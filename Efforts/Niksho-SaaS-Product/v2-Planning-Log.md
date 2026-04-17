---
type: effort-log
effort: Niksho-SaaS-Product
status: active
created: 2026-04-13
updated: 2026-04-17
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

## Beroz Frontend — Current Phase (2026-04-15)

Beroz frontend build is complete. Juicebox clone integrated with ExcelTech backend. Now in **testing + design iteration**. See [[Raw/docs/Beroz-Build-Session-2026-04-15]] for full session log.

### ExcelTech Instance — Next Steps
- [ ] Deploy Beroz to Railway with all env vars
- [ ] Test end-to-end with live Supabase + Outlook (all 10 pages)
- [ ] Add GeBIZ tender workflow (Singapore)
- [ ] Add notification bell with real-time polling
- [ ] Add WhatsApp Business API integration

### SaaS Product — Next Steps
- [ ] Wire SaaS frontend to generic multi-tenant backend
- [ ] Add user registration / onboarding flow
- [ ] Build out chart visualizations in Analytics
- [ ] Add real-time notifications via WebSocket
- [ ] Make responsive for mobile

---

## Beroz Frontend Polish — Planning (2026-04-17)

Next code pass on the SaaS shell (`frontend-saas/index.html`). Full session: [[Raw/docs/Beroz-Frontend-Planning-2026-04-17]] · digest: [[Wiki/digests/Session-Beroz-Frontend-Planning-2026-04-17]]. Four scoped changes, one deferred decision.

### SaaS shell — Ready to implement
- [ ] **Profile avatar dropdown** — make `.avatar` (top-right header, ~line 902) clickable. Menu items: Invite members · Help center · Knowledge base · Contact support · Sign out. Visual ref: Juicebox settings dropdown.
- [ ] **Sidebar: rename "recruitment agent" → "Projects"** (~lines 816–887). Make clickable. Dropdown: search field ("Find projects") + project list + "View all projects →" footer link.
- [ ] **Sidebar: add persistent "All Projects" entry** at the very top of the sidebar (above the Projects dropdown). Routes to `page-all-projects`.
- [ ] **Build out `page-all-projects`** — table with columns: Title · Progress · Created on · Collaborators · Status. Top-right "Create new project +" button → modal: Project Title (required) · Access Level (Shared/Private) · Collaborators (optional) · "Create Project →".
- [ ] **Remove `#page-agent-home` entirely** (~lines 910–929). Set default landing route to `page-all-projects`.

### Gating decision (must settle BEFORE the All Projects schema is built)
- [ ] **Project ↔ Agent relationship.** Reading A: Project = client engagement, contains many requirements/agents (3-level hierarchy). Reading B: Project = renamed agent (presentational rename only). Recommendation in digest: Reading A. Needs Shoham + Nikhil sign-off.

### Deferred — explicit non-goal for this code pass
- [ ] **Chrome extension for outreach tracking (Gmail/Outlook).** Mirrors Juicebox's [[Wiki/concepts/Personal-Inbox-Outreach-Tracking|personal-inbox tracking]] pattern. Decision pending — full trade-off analysis in the concept note. Forward-compat ask: ensure `outreach_event` schema accepts an event source field (`platform | extension | imap_scan`) so this can be added later without a rewrite.

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
| Frontend pivot — Juicebox clone replaces Jinja2 → Next.js plan | [[Raw/docs/Beroz-Build-Session-2026-04-15]] |

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
| Beroz build session log | [[Raw/docs/Beroz-Build-Session-2026-04-15]] |
| Beroz repo | [github.com/nikshostudios/beroz](https://github.com/nikshostudios/beroz) |

---
*Home: [[Home]]*
