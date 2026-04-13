---
type: effort-log
effort: Niksho-SaaS-Product
status: active
created: 2026-04-13
updated: 2026-04-14
generated-by: claude-opus-4-6
owner: Nikhil & Shoham
related:
  - "[[Efforts/ExcelTech-Automation/Overview]]"
  - "[[Atlas/Product/Architecture]]"
  - "[[Atlas/Product/Sourcing-Channels]]"
  - "[[Atlas/Business-Model/Phase-2-GTM]]"
---

# v2 Architecture — Build Tracker

> Status tracker for the v2 system architecture build.
> **Decisions** live in [[Efforts/Niksho-SaaS-Product/decisions/]].
> **Product knowledge** lives in [[Atlas/Product/]] (channels, enrichment, Foundit API, agents).
> **The spec** is `ExcelTech-Recruitment-Agent-Architecture.html` in vault root.
> This file tracks only: what's next, what's blocked, what's done.

---

## Mission

Double or triple recruiter throughput — from ~6 submissions/day to 12-20.

---

## Build Order

| Phase | What | Status | Blocked on |
|-------|------|--------|------------|
| 1 | Migrate to Foundit EDGE API | **Ready to build** | API key from Prayag Sanghvi |
| 2 | Quick Screen page + CV Parser + JD Parser + Screener salary fix | Not started | Phase 1 |
| 3 | Excel CRM tracking sheet + dedup + availability tracker | Not started | Nikhil to upload ExcelTech tracking sheet |
| 4 | Vector search (pgvector) + Reactivation Agent | Not started | Phase 2 |
| 5 | Lusha enrichment + recruiter dashboard + Adzuna benchmarks | Not started | Phase 4 |
| 6 | Naukri + GitHub + Inbound Portal + BD add-on | Future | Naukri subscription, demand signal |

---

## Open Items

- [ ] Obtain Foundit EDGE API key from Prayag Sanghvi (required for Phase 1)
- [ ] Nikhil to upload ExcelTech tracking sheet (required for Phase 3)
- [ ] Decide on Lusha subscription tier (Free: 50 credits/mo, Pro: $49/mo)
- [ ] Pricing model discussion (deferred — build working product first)

---

## Decisions Made (2026-04-13)

All decision records with full context, options, and reasoning:

| Decision | Record |
|----------|--------|
| Switch Foundit to official EDGE API | [[Efforts/Niksho-SaaS-Product/decisions/2026-04-13-foundit-edge-api]] |
| Phone-first enrichment, email last resort | [[Efforts/Niksho-SaaS-Product/decisions/2026-04-13-phone-first-enrichment]] |
| Channel restructure (core vs BD add-on) | [[Efforts/Niksho-SaaS-Product/decisions/2026-04-13-channel-restructure]] |
| Screener salary logic (client budget primary) | [[Efforts/Niksho-SaaS-Product/decisions/2026-04-13-screener-salary-logic]] |
| Pause Naukri (no subscription) | [[Efforts/Niksho-SaaS-Product/decisions/2026-04-13-naukri-paused]] |
| Hybrid architecture (Option A) | [[Efforts/Niksho-SaaS-Product/decisions/2026-04-10-option-a-hybrid-architecture]] |

---

## Competitive Intelligence

Brief notes — full analysis lives in the HTML spec doc.

**Juicebox AI** ($375-950/mo): 800M+ profiles, enrichment baked into search, 41 ATS integrations. Validates our pricing — we're competitive at $200/mo. Their enrichment-first approach validates our strategy.

**Greenhouse** (enterprise ATS): Applicant management, not sourcing. We'd integrate WITH Greenhouse, not compete against it. Our product fills the gap they don't — active sourcing + enrichment.

---

## Key Reference Files

| What | Where |
|------|-------|
| Channel lineup & waterfall | [[Atlas/Product/Sourcing-Channels]] |
| Foundit EDGE API reference | [[Atlas/Product/Foundit-EDGE-Integration]] |
| Enrichment strategy | [[Atlas/Product/Enrichment-Strategy]] |
| Agent layer design | [[Atlas/Product/Agent-Layer-v2]] |
| Database schema | [[Atlas/Product/Database-Schema]] |
| Full HTML spec | `ExcelTech-Recruitment-Agent-Architecture.html` |

---
*Home: [[Home]]*
