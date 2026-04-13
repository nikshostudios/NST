---
type: atlas-note
area: Product
updated: 2026-04-14
generated-by: claude-opus-4-6
sources: ["[[Raw/docs/sourcing-architecture]]", "[[Raw/docs/ExcelTech_Master_Knowledge_Base]]"]
---

# Product — Sourcing Channels

How we get candidates into the system. Six core channels, each with different mechanics, costs, and constraints. Enrichment (phone/email lookup) is handled separately — see [[Atlas/Product/Enrichment-Strategy]].

> **v2 update (2026-04-13):** Channel lineup restructured. Foundit upgraded to official EDGE API. MyCareersFuture removed (returns job postings, not candidates). TheirStack/SerpApi/Adzuna moved to BD add-on. Apollo, GitHub, Lusha added to core. Naukri paused (no subscription). See decision records in [[Efforts/Niksho-SaaS-Product/decisions/]].

## Channel matrix

| # | Channel | Market | Method | Status | Cost |
|---|---------|--------|--------|--------|------|
| 1 | **Internal DB** | Both | pgvector semantic search | Working | Free |
| 2 | **Foundit EDGE API** | India + SG | Official ATS API, token auth | Ready to build | Included in subscription |
| 3 | **Apollo.io** | Global | People Search API | **Live** in sourcing.py | $49-99/mo |
| 4 | **GitHub** | Global | Public API, tech roles only | To build | Free |
| 5 | **Inbound Portal** | Both | Candidates self-submit on excelt.ai | To build | Free |
| 6 | **LinkedIn** | Both | Manual only + AI boolean strings | Live (manual) | Free |

**Paused:** Naukri (no subscription — code exists, activate when tenant brings credentials)

## Priority waterfall

When a requirement arrives, the Sourcing Agent searches channels in this order:

```
JD Parser extracts skills, salary, location
    │
    1. Internal DB (vector search, 2,300+ candidates, $0, <2 sec)
    │   └── Semantic matches → Screener → Shortlist
    │
    2. Foundit EDGE API (official API, India + SG, token auth)
    │   └── Search → Screen top results → Profile API for contacts → Shortlist
    │
    3. Apollo.io (275M+ contacts, passive candidates)
    │   └── Candidates with direct contact data → Screener → Shortlist
    │
    4. GitHub (tech roles only: DevOps, Data Eng, Full Stack, Cloud)
    │   └── Developer profiles → Enrich via Lusha/Apollo → Screener → Shortlist
    │
    5. Inbound Portal (passive: candidates apply via excelt.ai, 24/7)
    │   └── Auto-screen on arrival → notify recruiter of matches
    │
    6. LinkedIn (manual + AI boolean strings)
    │   └── Recruiter copies profiles into app → CV Parser → Screener
```

## Channel details

### 1. Internal DB

Our own candidate history — 2,300+ candidates who reached interview stage, plus thousands more. Always searched first because it's free and fast.

v2 upgrade: **pgvector semantic search.** Instead of keyword matching, embeddings from candidate CVs are compared against the JD semantically. "Find someone like this candidate" becomes possible.

### 2. Foundit EDGE API

The workhorse for India and Singapore. Official ATS EDGE Integration with five documented endpoints, API key + token authentication, no more cookie scraping.

Full reference: [[Atlas/Product/Foundit-EDGE-Integration]]

**Key architecture detail:** Search returns profiles (enough to screen), but structured contact data (email, phone) requires a second call to the Candidate Profile API using the candidate's `p_uuid`. We only make this call for candidates who pass screening — saves API usage.

Three shared ExcelTech accounts (Rakesh, Devesh, Bhuwan) rotate for India searches. Singapore uses the `.sg` subscription.

### 3. Apollo.io

275M+ verified contacts with direct emails, phone numbers, job titles, companies, tech stacks, and career history. Both a discovery engine and an enrichment tool.

**Already proven in production.** Nikhil used Apollo to find 30 fresh candidates for a senior sourcing manager role in Singapore after Foundit and MCF were exhausted.

Use cases: direct candidate search by skills/title/location, company-based sourcing ("all DevOps engineers at HCL"), enrichment (LinkedIn URL → full contact card), lookalike search ("20 people similar to this placed candidate").

### 4. GitHub

For tech roles only. GitHub's public API exposes developer profiles with contribution history, tech stacks, and location. Free.

Target roles: DevOps, Data Engineering, Full Stack, Cloud Architecture — roles where GitHub activity is a meaningful signal.

### 5. Inbound Portal

Candidates self-submit on excelt.ai. A careers page with active openings. When a candidate applies, the CV Parser extracts structured data and the Screener Agent auto-scores them against open requirements.

### 6. LinkedIn — manual only

**Hard rule, non-negotiable.** No automated scraping, crawling, or API hitting of LinkedIn. Ever. Reasons: ToS litigation risk, IP bans, and credibility for Phase 2 SaaS.

**What IS allowed:**
- Recruiters manually searching LinkedIn and copy-pasting into the app
- AI-generated boolean search strings for recruiters to paste into LinkedIn search
- Posting JDs on recruiters' LinkedIn feeds to generate inbound
- Receiving candidate CVs via LinkedIn messages

This rule is echoed in [[mi]] NOT-to-do list.

### Naukri (PAUSED)

India's #1 job board with 80M+ resumes. ExcelTech does not currently have a Naukri/Resdex subscription. Code exists in `sourcing.py` (`source_naukri_with_cookie()`) but is inactive.

**Future plan:** Naukri becomes a selling point for the SaaS product — each tenant brings their own Naukri credentials. Part of the channel marketplace.

## Deduping across channels

Candidates are deduped by `(email || phone || name+city)` hash. When the Sourcing agent pulls a candidate that already exists: update `last_seen_on` and `source` array, link to the new requirement, don't create a duplicate record.

## Related

- [[Atlas/Product/Foundit-EDGE-Integration]] — detailed Foundit API reference
- [[Atlas/Product/Enrichment-Strategy]] — how we get phone/email for sourced candidates
- [[Atlas/Product/Agents#Sourcing-agent]] — the agent that orchestrates this
- [[Atlas/Product/Database-Schema]] — where candidates land
- [[Atlas/ExcelTech/India-Market]]
- [[Atlas/ExcelTech/Singapore-Market]]

---
*Template: Atlas note · Home: [[Home]]*
