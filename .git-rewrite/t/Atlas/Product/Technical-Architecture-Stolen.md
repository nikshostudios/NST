---
type: atlas-note
area: Product
updated: 2026-04-11
status: blueprint — build against this
sources: ["Juicebox demo transcript April 2026", "competitive teardown"]
generated-by: claude
---

# Technical Architecture — Stolen from Juicebox

> This is what Juicebox actually does under the hood, stripped of marketing.
> Seven layers. Each one is buildable with our current stack.
> This is the build roadmap for Niksho's sourcing product.

---

## Layer 1: Search Parser

**What it does:** Takes a natural language job requirement and extracts structured data.

**Input:** "Senior Java developer, 5+ years, Singapore, experience with microservices and AWS, preferably from fintech"

**Output (structured JSON):**
```json
{
  "hard_filters": {
    "title_keywords": ["Java developer", "software engineer"],
    "location": "Singapore",
    "min_years_experience": 5,
    "must_have_skills": ["Java", "microservices", "AWS"]
  },
  "soft_criteria": [
    {"criterion": "Fintech industry experience", "weight": "preferred"},
    {"criterion": "Microservices architecture", "weight": "required"},
    {"criterion": "AWS cloud services", "weight": "required"},
    {"criterion": "Senior-level responsibilities", "weight": "required"}
  ]
}
```

**How Juicebox does it:** LLM parses the natural language query. Splits into "filters" (hard matches — used as database WHERE clauses) and "criteria" (soft matches — used for LLM scoring later). Recruiter can review and edit both before running the search.

**How we build it:** One structured output prompt. Feed the requirement text to the LLM, ask for JSON with hard_filters and soft_criteria. Validate the output schema. Done.

**Complexity:** Low. A day of work.

---

## Layer 2: Multi-Source Data Fetcher

**What it does:** Takes the hard filters from Layer 1, fires parallel API calls to all data sources, merges and deduplicates results.

**Juicebox's version:** 30+ data sources, 800M+ profiles. Their data aggregation layer is their real moat — years of crawling, partnerships, and deduplication.

**Our version (what we have now and what's coming):**

| Source | Status | What it returns |
|---|---|---|
| Internal DB (Supabase) | Has 2,300+ candidates — skill matching needs fixing | Full candidate profiles we own |
| Apollo People Search | Needs $49/mo signup + API key | 210M+ contacts, email + phone, India/SG coverage |
| Foundit Recruiter API | Blocked — cookie auth dead, needs API partnership | Singapore candidates with recruiter-grade data |
| Naukri RMS | Check if ExcelTech has subscription | India's largest resume database (69M+ jobseekers) |

**How it works:**
1. Convert hard_filters to source-specific query format (each API has different params)
2. Fire all source queries in parallel (asyncio / concurrent)
3. Collect results
4. Deduplicate by email → name+company fallback
5. Return unified candidate list with source tags

**Complexity:** Medium. The parallel fetching and dedup logic exists in the current pipeline. Main work is adding Apollo and fixing Internal DB queries.

---

## Layer 3: LLM Scorer

**What it does:** Takes each candidate profile from Layer 2 and scores it against the soft criteria from Layer 1. Per criterion. With explanations.

**Juicebox's version:** Each candidate gets a match assessment. In their demo, you see a description of WHY each candidate matched. In the table view, you see per-criterion scores across many candidates at once.

**Example output:**
```
Candidate: Rajesh Kumar
Overall Match: 82%

- Java experience: 95% — 8 years Java including Spring Boot and J2EE
- Microservices: 85% — built microservices at Grab, managed 12-service architecture
- AWS: 70% — mentions EC2 and S3 usage, no evidence of advanced services (Lambda, ECS)
- Fintech: 90% — 4 years at DBS Bank + 2 years at Grab Financial
- Senior level: 80% — led team of 3, but title was "Software Engineer" not "Senior"
```

**How we build it:**
1. Batch candidates in groups of 10-20
2. Send to LLM: "Here are the soft criteria. Here are 10 candidate profiles. Score each candidate 0-100 on each criterion. Give a one-line explanation per score."
3. Parse structured output
4. Sort by overall score (weighted average of criterion scores)
5. Cache scores in a `match_scores` table so we don't re-score same pairs

**Complexity:** Low-medium. The prompt engineering needs iteration to get consistent scoring, but the architecture is straightforward. Main cost is LLM tokens for large result sets — mitigate by only scoring candidates that pass hard filters.

---

## Layer 4: Enrichment

**What it does:** Once you have ranked candidates, add extra data on demand — contact info, salary estimates, developer profiles, company funding data.

**What Juicebox layers on per candidate:**
- Phone number + email reveal (contact enrichment)
- Salary estimate powered by Levels.fyi partnership
- Developer profiles (GitHub, Stack Overflow links)
- Company funding data (for their current employer)
- Work history timeline

**Our version:**

| Data point | Source | Cost |
|---|---|---|
| Email + phone | Apollo enrichment API | Included in Apollo plan (credits) |
| Salary estimate | Glassdoor API / Levels.fyi / internal ExcelTech placement data | Free-TBD |
| GitHub/LinkedIn profiles | Apollo returns these | Included |
| Company data | Apollo org enrichment | Included |

**How it works:** Enrichment is on-demand, not upfront. When a recruiter clicks into a candidate profile, fire enrichment API calls for that specific candidate. Cache the results so you don't re-enrich.

**Complexity:** Low. Apollo's API handles most of this. The salary estimate is the one piece that needs a separate data source or our own model built from ExcelTech's historical placement data.

---

## Layer 5: Sequencing Engine

**What it does:** Recruiter selects candidates from search results → system generates personalised outreach emails → schedules as a multi-step drip sequence.

**Juicebox's version (from demo):**
1. Select 10 candidates from search results
2. Choose to add to a sequence
3. Select email type (personal email)
4. In seconds, personalised email copy appears alongside a pre-written template
5. Recruiter reviews/edits
6. Hit send → candidates enter the drip sequence

**How we build it:**
1. **Template system:** Recruiter creates base email templates with merge fields (`{{candidate_name}}`, `{{relevant_experience}}`, `{{role_title}}`)
2. **LLM personalisation:** For each candidate, LLM reads their profile + the template → generates a personalised version that references their specific experience
3. **Sequence scheduler:** Multi-step drip: Day 0 = initial outreach, Day 3 = follow-up 1, Day 7 = follow-up 2. Schedule via queue (Celery/Redis or simple cron)
4. **Email infrastructure:** SendGrid or AWS SES for sending. Pixel tracking for opens. Reply detection on inbox.
5. **Multi-channel (our advantage):** Email + WhatsApp (Twilio API) + SMS. Juicebox only does email. We add WhatsApp for India/SG where it's the default professional channel.

**Complexity:** Medium. The email sending exists in the current pipeline. Main new work is the template system, LLM personalisation at scale, and the scheduling queue.

---

## Layer 6: Analytics + Insights

**What it does:** Two separate things that Juicebox combines:

### A. Talent Insights (pre-search)
Before the recruiter even starts sourcing, show market data:
- How many candidates match this role in our sources
- Geographic distribution (pie chart)
- Top current employers (bar chart)
- Years of experience distribution (histogram)
- Average/median salary range (if data available)

This is literally: run the Layer 2 query, don't score, just aggregate with GROUP BY and render charts. Recruiters use this data in client conversations to set expectations ("There are ~340 matching candidates in Singapore, here's the experience distribution").

### B. Sequence Analytics (post-outreach)
Track per sequence and per email:
- Emails sent / delivered / bounced
- Open rate (pixel tracking)
- Reply rate (inbox monitoring)
- Positive vs negative replies (LLM classification)
- Meetings booked (manual tracking or calendar integration)

**Complexity:** Low for talent insights (it's SQL aggregation + charts). Medium for sequence analytics (needs email tracking infrastructure).

---

## Layer 7: Shortlist + Export

**What it does:** Save candidates to named projects. Track their status. Export to client or ATS.

**Juicebox's version:**
- Save candidates to shortlists
- See when you last reached out
- See if they were sequenced before
- Export to ATS (Greenhouse, Lever, Workday integrations)

**Our version (THIS IS WHERE WE BEAT THEM):**
- Everything above PLUS:
- **Client submission formatting:** Generate branded candidate shortlists formatted for the client. "Here are 5 candidates for your Java Developer role" with ExcelTech branding, formatted profiles, match scores, and the recruiter's notes.
- **Client portal:** Client gets a link, sees the shortlist, gives thumbs up/down per candidate, adds comments. Feedback flows back to the recruiter.
- **Multi-client management:** Each project is tied to a client + requirement. Recruiter dashboard shows all active requirements across all clients.
- **Placement tracking:** When a candidate gets placed, track the placement fee, start date, guarantee period.

This is the layer Juicebox doesn't have and won't build. This is the agency-native workflow.

**Complexity:** Medium. It's CRUD + a simple client-facing portal + PDF/email generation for submissions.

---

## Build Order

| Priority | Layer | Effort | Dependency |
|---|---|---|---|
| 1 | Layer 1: Search Parser | 1 day | None |
| 2 | Layer 2: Multi-Source Fetcher | 2-3 days | Apollo API key, Internal DB fix |
| 3 | Layer 3: LLM Scorer | 2 days | Layers 1+2 |
| 4 | Layer 7: Shortlist + Client Submission | 3-4 days | Layer 3 |
| 5 | Layer 5: Sequencing Engine | 3-4 days | Layer 3 |
| 6 | Layer 6: Analytics + Insights | 2-3 days | Layers 2+5 |
| 7 | Layer 4: Enrichment | 1-2 days | Apollo API |

**Total estimated build time:** 2-3 weeks for all 7 layers with 2 people.

**What you can demo after 1 week:** Layers 1-3 + basic Layer 7. Recruiter types a requirement → gets ranked candidates with match scores → saves to shortlist → exports as client submission. That's a working product.

---

## Immediate Next Steps

1. **Sign up for Apollo Basic** ($49/mo) — gets you API key for Layers 2 + 4
2. **Run Prompt 2** in Conductor — fix Internal DB skill matching
3. **Run the Layer 1 prompt** in Conductor — build the search parser
4. **Test end to end** — natural language → scored candidates from Internal DB + Apollo

---

## Related
- [[Atlas/Business-Model/Steal-Their-Strategy]]
- [[Atlas/Business-Model/Competitive-Landscape]]
- [[Atlas/Product/Sourcing-Strategy-v2]]
- [[Atlas/Product/Architecture]]
