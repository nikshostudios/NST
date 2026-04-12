---
type: atlas-note
area: Product
updated: 2026-04-12
generated-by: claude-opus-4-6
sources: ["[[Atlas/Product/Sourcing-Channels]]", "[[Atlas/Product/Architecture]]", "[[Raw/docs/sourcing-architecture]]"]
status: design
---

# Product — Sourcing Architecture v2

> This document describes the proposed upgrade to ExcelTech's sourcing layer.
> It builds on the existing [[Atlas/Product/Sourcing-Channels]] (v1, 4 channels) and introduces a multi-channel sourcing mesh with 8 channels, a sourcing inversion strategy, and 3 new agents.
> See also: [[Atlas/Product/Agent-Layer-v2]] for the full agent design.

## The problem with v1

v1 has four sourcing channels. In practice, only one external channel works reliably:

| Channel | Status | Problem |
|---|---|---|
| **Foundit** | BLOCKED | Firecrawl hits Akamai bot detection. Session cookies expire every 24-48h. CAPTCHA blocks automated login refresh. |
| **MyCareersFuture** | WRONG DATA | Returns job postings, not candidate profiles. Cannot be upserted to candidates table. By design — MCF is a job board, not a candidate database. |
| **Internal DB** | Working | 2,300+ candidates. Zero cost. But it's a fixed pool — no new candidates without external sourcing. |
| **LinkedIn** | Manual only | Hard rule: no automation, ever. See [[Atlas/Product/Sourcing-Channels#LinkedIn---manual-only]]. |

**Bottom line:** the automation layer can screen, outreach, follow-up, and format beautifully, but it has almost nothing to feed into the pipeline. Sourcing is the bottleneck, and sourcing is the biggest opportunity.

---

## The sourcing inversion

v1 is reactive: client sends JD → recruiter searches Foundit manually → finds candidates.

v2 adds a parallel proactive track: agents continuously harvest open jobs across India and SG → match against ExcelTech's internal candidate pool → alert recruiters to pitch opportunities to warm candidates.

This means ExcelTech can approach companies *before* they send a JD, saying "We have 3 pre-screened ServiceNow developers available, and we see you're hiring for this role." That changes the power dynamic entirely.

The two tracks run in parallel:

**Reactive (client-initiated):** Client sends JD → JD Parser Agent → multi-channel sourcing → Screener → shortlist

**Proactive (market-initiated):** TheirStack/SerpApi harvest open jobs → Intelligence Agent matches against internal pool → recruiter pitches candidate to hiring company

---

## The 8-channel sourcing mesh

### Channel 1: Foundit Direct API (ENHANCED)

**Market:** India + SG (with `.sg` subscription)
**Type:** Candidate profiles

**Current approach:** Firecrawl + session cookie. Blocked by Akamai.

**Proposed approach:** Reverse-engineer the Foundit Recruiter SPA's internal REST API. Open Chrome DevTools on `recruiter.foundit.in`, run a search, capture the XHR request to their internal API endpoint. Call it directly via `httpx` with the session cookie. This bypasses Firecrawl, browser fingerprinting, and bot detection entirely because you're making the same request the browser makes.

**Fallback:** If the internal API is also protected, use Bright Data's Web Scraper API (98.4% success rate across anti-bot systems, built-in proxy rotation, ~$0.005/page) or Apify's Foundit actor (managed headless browser with anti-detection).

**Cookie refresh:** Lightweight Playwright script runs once per 24h per Foundit account. 3 accounts × 1 login/day = 3 automated sessions. Cookies stored in a new `scraper_sessions` table in Supabase with TTL tracking.

**Output:** Candidate profiles (name, skills, experience, location, current CTC, expected CTC, notice period, CV link). Normalized to the same schema as all other candidate-profile channels.

### Channel 2: Naukri.com (NEW)

**Market:** India
**Type:** Candidate profiles

Naukri is India's #1 job portal with 80M+ resumes. Having both Naukri and Foundit gives near-complete India market coverage for IT roles.

**Option A (preferred):** Apply for Naukri's enterprise Resume Search API via their partnership program. ExcelTech is a real agency with 14,000+ historical submissions — qualifies easily. This gives structured, legal, contractual access to India's largest resume database.

**Option B:** Same DevTools reverse-engineering approach as Foundit. Naukri's recruiter portal (`resdex.naukri.com`) has internal API endpoints discoverable via the Network tab.

**Option C:** Use Apify's Naukri Navigator actor — pre-built, handles anti-bot, managed cloud, ~$5-20/month.

**Recommendation:** Start with Option C (fast, no approvals needed) while applying for Option A in parallel. Switch to enterprise API when approved.

**Cost:** Enterprise API ~INR 15-30K/month. Apify actor ~$5-20/month.

### Channel 3: TheirStack — Job Intelligence (NEW)

**Market:** Global (India + SG + everywhere)
**Type:** Job postings + company intelligence

TheirStack aggregates job postings from 315,000+ sources — LinkedIn, Indeed, Glassdoor, Naukri, and 16,000+ ATS platforms (Greenhouse, Lever, Workable, etc.). Database updates every minute. Built-in deduplication.

**This is NOT a candidate sourcing channel.** It's the market intelligence layer. It tells you *who is hiring, for what, right now*. Use cases:

1. **Discover companies** hiring for ServiceNow/Snow/DevOps in India → pitch ExcelTech's services proactively
2. **Match open jobs** against ExcelTech's 2,300+ candidate pool → proactive placement
3. **Track existing clients** (HCL, TechM, Paytm) job postings → anticipate JDs before they arrive
4. **Competitive intel** — which other agencies are hiring recruiters (signals who's scaling)
5. **Feed the Intelligence Agent** — see [[Atlas/Product/Agent-Layer-v2#Market-Intelligence-Agent]]

**Pricing:** $59/month (Starter tier). Free tier: 200 credits/month for prototyping. Can filter by company size, funding stage, tech stack, geography.

**Integration:** REST API → `market_jobs` table in Supabase → Intelligence Agent consumes nightly.

### Channel 4: Google Jobs via SerpApi (NEW)

**Market:** India + SG + global
**Type:** Job postings

Google indexes jobs from 1,000+ job boards — Indeed, LinkedIn, Glassdoor, Naukri, Foundit, company career pages, and more. SerpApi provides structured JSON access to Google Jobs search results without any scraping.

**Why this matters:** Broadest coverage per API call. One search for "ServiceNow Developer Bangalore" returns results aggregated from dozens of sources. Complementary to TheirStack — SerpApi catches jobs TheirStack might miss (smaller company career pages, local Indian job boards).

**Pricing:** $0.001-0.002 per request. 100 searches/month for active reqs = ~$0.20/month. Absurdly cheap.

**Speed:** ~1.2 seconds per request. No browser needed. Pure REST.

**Integration:** Feed results into `market_jobs` table. Dedup against TheirStack data.

### Channel 5: Adzuna API (NEW)

**Market:** India + SG + 15 other countries
**Type:** Job postings + salary benchmarks

Job aggregator with a proper developer API. Real-time posts, historical data, and — the unique value — **salary statistics** by role and location.

**Salary benchmarking is the killer feature here.** When a candidate says "I want 22 LPA for ServiceNow" and Adzuna's data shows the India market median is 18 LPA, the Screener agent can flag it as "22% above market" instead of just "salary mismatch." Gives recruiters negotiation ammunition.

**Pricing:** Free tier available. Paid tiers from $99/month for higher volume.

**Integration:** REST API → salary data into `market_salary_benchmarks` table → Screener agent references during scoring.

### Channel 6: Internal DB with Vector Search (ENHANCED)

**Market:** India + SG
**Type:** Candidate profiles

**Current state:** 2,300+ candidates, simple text/keyword search.

**Enhancement:** Add vector embeddings to all CVs using Supabase's pgvector extension. Use an embeddings model (Voyage AI, OpenAI text-embedding-3-small, or Cohere embed-v3) to generate 1536-dim vectors. This transforms a dumb keyword lookup into semantic search:

- "Find someone who has done ITSM implementation at a large Indian bank" finds candidates even if those exact words aren't in their CV.
- "Similar to candidate #1234" returns candidates with comparable skill profiles.

**Cost:** One-time embedding generation: ~$2-3 for 2,300 CVs via a cheap embeddings model. Ongoing: $0 (vectors live in Supabase). Re-embed only when a CV is updated.

**Priority:** Always searched first. Zero marginal cost, fastest response, highest signal (known, pre-screened candidates).

### Channel 7: Inbound Candidate Portal (NEW)

**Market:** India + SG
**Type:** Candidate profiles

**Concept:** Build a "Submit Your CV" page on excelt.ai. Candidates upload their CV via a web form. The system auto-parses the CV (Formatter agent), auto-screens against all open requirements (Screener agent), and auto-notifies matching recruiters.

LinkedIn posts by recruiters already generate inbound interest, but candidates currently WhatsApp their CVs (unstructured, not tracked). A web form captures them into the pipeline automatically. Every inbound candidate is a $0 sourcing cost candidate.

**Amplification:**
- Auto-post open requirements to free job boards (Indeed free tier, Google for Jobs via JSON-LD structured data on the excelt.ai career page).
- JSON-LD structured data makes career page listings appear in Google Jobs search results for free.
- Passive inbound grows the candidate pool 24/7 without recruiter effort.

**Cost:** Development time only. No API cost. Google for Jobs indexing is free.

### Channel 8: LinkedIn (Manual + AI-Assisted)

**Market:** India + SG
**Type:** Candidate profiles
**Rule:** No scraping. No automation. Ever. See [[Atlas/Product/Sourcing-Channels#LinkedIn---manual-only]].

**What AI CAN do:**
- When a recruiter manually finds a good candidate on LinkedIn and pastes their profile URL into the web app, the system auto-generates a Boolean search string for finding similar profiles. "I found one good ServiceNow dev in Bangalore" → AI generates `ServiceNow AND (ITSM OR ITOM) AND Bangalore NOT manager` for the recruiter to paste into LinkedIn search. Augments the human without automating the platform.
- AI drafts LinkedIn post copy for recruiters to share open roles. Human posts it. Candidates come to ExcelTech, not the other way around.
- When a recruiter pastes a LinkedIn profile URL, the system creates a candidate record from the manually-provided info (no scraping — the recruiter copies it).

---

## Sourcing priority waterfall

When a new requirement arrives, channels are activated in this order:

```
1. Internal DB (vector search)     — $0, <2 sec, always first
2. Foundit API (India/SG)          — candidate profiles
3. Naukri API (India)              — candidate profiles
4. TheirStack (market scan)        — who else is hiring for this role?
5. Google Jobs / Adzuna            — broad market scan + salary benchmarks
6. Inbound Portal (passive)        — candidates self-apply
7. LinkedIn (manual)               — AI-generated Boolean strings assist recruiter
```

The Sourcing agent's channel router selects which channels to activate based on:
- Market (India vs SG vs both)
- Role type (tech vs non-tech)
- Volume vs precision need
- Channel health (is Foundit's session alive?)
- Budget remaining (Firecrawl/Bright Data credits)

Results from all channels normalize into a unified candidate schema and dedup via `(email || phone || name+city)` hash — same as v1 but across more channels.

---

## New database tables

| Table | Purpose |
|---|---|
| `market_jobs` | Job postings from TheirStack, SerpApi, Adzuna. Columns: source, company, title, location, salary_range, skills[], posted_at, url, matched_candidates[] |
| `market_salary_benchmarks` | Salary data from Adzuna, by role + location. Columns: role_normalized, location, p25, median, p75, sample_size, updated_at |
| `candidate_embeddings` | Vector embeddings for semantic search (pgvector). Columns: candidate_id, embedding vector(1536), source_text_hash, created_at |
| `scraper_sessions` | Foundit/Naukri session cookies with TTL. Columns: platform, account_id, cookie_json, expires_at, last_refresh |
| `sourcing_channels` | Channel config + health. Columns: channel_name, enabled, priority, last_success, last_failure, avg_response_ms, daily_quota |
| `skill_taxonomy` | Canonical skill list with aliases. Columns: canonical_name, aliases[], category, demand_trend |
| `market_briefs` | Weekly Intelligence Agent output. Columns: week_of, insights_json, demand_spikes[], salary_changes[], new_client_leads[] |
| `inbound_applications` | Self-submitted candidates via website. Columns: name, email, phone, cv_url, parsed_skills[], auto_matched_reqs[], status |

---

## Cost impact

| Item | Monthly cost |
|---|---|
| TheirStack (Starter) | +$59 |
| SerpApi (Google Jobs) | +$5 |
| Adzuna API | $0 (free tier) |
| Naukri (Apify actor) | +$20 |
| Bright Data (contingency for Foundit fallback) | +$50 |
| pgvector embeddings (one-time ~$3) | $0 ongoing |
| **Total incremental** | **~$85-135/month** |

One additional placement per month = SGD 1,000-5,000+ in fees. ROI breakeven: a fraction of one extra placement.

---

## Related

- [[Atlas/Product/Agent-Layer-v2]] — the 3 new agents + enhanced existing agents
- [[Atlas/Product/Sourcing-Channels]] — v1 channel documentation (still accurate for current production)
- [[Atlas/Product/Architecture]] — system architecture (v2 extends, does not replace)
- [[Atlas/ExcelTech/India-Market]]
- [[Atlas/ExcelTech/Singapore-Market]]
- [[Raw/docs/sourcing-architecture]]
