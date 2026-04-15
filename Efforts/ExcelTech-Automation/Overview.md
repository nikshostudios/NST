---
type: effort
effort: ExcelTech-Automation
status: in-production
intensity: active
started: 2025-11-01
updated: 2026-04-15
owner: Shoham & Nikhil
---

# ExcelTech Automation — Overview

## Goal
Make every mechanical step of the ExcelTech recruiter workflow run through agents, so that recruiters spend their day on the 20% that actually needs a human. Hit the success criteria in [[Atlas/Business-Model/Phase-1-ExcelTech]].

## Status
**In production.** The web app is live on Railway. All 5 agents and 5 skills are shipped in v1. The team is actively using it. Refinement is ongoing — prompt tuning, edge-case handling, performance monitoring.

## Milestones

| # | Milestone | Target | Status |
|---|---|---|---|
| 1 | Excel → Supabase migration (14k submissions, 633 reqs, 1,007 contacts) | Apr 2026 | ✅ Done (zero errors on dry run) |
| 2 | Web app v1 (role-based, TL + recruiter screens) | Feb 2026 | ✅ Done |
| 3 | All 5 agents wired up (Screener, Outreach, Follow-up, Formatter, Sourcing) | Mar 2026 | ✅ Done |
| 4 | All 5 skills in production (source-and-screen, prepare-outreach, process-inbox, submit-to-tl, tl-send-to-client) | Mar 2026 | ✅ Done |
| 5 | APScheduler inbox scan running every 15 min for all 10 inboxes | Apr 2026 | ✅ Done |
| 5b | Beroz frontend — Juicebox clone integrated with backend (10 pages, all API-connected) | Apr 2026 | ✅ Done |
| 6 | Clean baseline metrics captured (before/after) | May 2026 | 🚧 In progress |
| 7 | Per-recruiter voice tuning for Outreach agent | May 2026 | 🚧 In progress |
| 8 | First 3 case studies drafted (recruiters who felt the biggest lift) | Jun 2026 | ⏳ Not started |

See [[Calendar/Quarterly/2026-Q2]] for Q2 outcomes.

## Scope of the build
- FastAPI web app on Railway (will migrate to Insforge for SaaS — see [[Efforts/Niksho-SaaS-Product/Overview]])
- Supabase Postgres (schema in [[Atlas/Product/Database-Schema]])
- `/ai-agents/` layer with all five agents (see [[Atlas/Product/Agents]])
- Five skills orchestrating the workflow (see [[Atlas/Product/Skills]])
- Microsoft Graph API integration for 10 individual recruiter inboxes
- Firecrawl integration for Foundit sourcing
- MyCareersFuture API integration for SG
- Apollo.io integration for BD
- APScheduler for the every-15-min inbox scan

## Open risks
- **Agent drift.** Over time, prompts get stale and the output quality declines. Mitigation: weekly spot-checks, tied to [[AIOS/skills/lint-wiki]] pattern.
- **Firecrawl credit overruns.** One runaway sourcing job could burn the monthly budget. Mitigation: hard daily and per-requirement caps. Verified by [[AIOS/skills/ship-check]].
- **Foundit account lockouts.** If one of the three shared accounts gets suspended, we're down to two. Mitigation: respect rate limits in the rotation logic; warn early if one account looks stressed.
- **Recruiter trust erosion.** If the Outreach agent writes something that lands wrong with a candidate and a recruiter gets embarrassed, trust dies. Mitigation: every outreach requires human approval, never auto-sent.
- **TL bandwidth.** Raja is the bottleneck on client sends. If the Submission Queue backs up, the whole pipeline stalls. Mitigation: monitor queue depth, alert if > 20 pending.

## Recent decisions
_(log in reverse chronological order)_

### 2026-04-15 — Beroz frontend replaces old Jinja2 templates
Decision: Scrap the old frontend entirely. Clone Juicebox AI's production dashboard (52 pages scraped, pixel-accurate HTML clone), then wire it to the existing ExcelTech backend. Approach based on [[Wiki/concepts/Seven-Levels-of-Web-Design]] — start from a proven design rather than building from scratch. Repo: `github.com/nikshostudios/beroz`. Next: end-to-end testing, then design iteration.

**Source docs:**
- [[Raw/docs/Beroz-Build-Session-2026-04-15]] — build session log (architecture, project structure, phases)
- [[Raw/docs/Beroz-Features-Guide-2026-04-15]] — full feature & workflow reference (10 pages, 8 agents, 5 skills, DB schema, env vars)
- [[Raw/docs/Beroz-Testing-Guide-2026-04-15]] — test checklist, credentials, debugging tips, Railway deploy notes
- [[Raw/docs/Beroz-Workflow-Diagrams-2026-04-15]] — Mermaid diagrams: master pipeline, outreach/inbox, submission/approval, role-based access, agent routing

### 2026-04-10 — Hybrid vault architecture for the second brain
Decision: Set up the second brain as a hybrid of Nick Milo's ACE and Karpathy's raw/wiki compiler pattern, rooted at `/Users/shohamshree/niksho/NST`. Not strictly a decision about this effort but it affects how we'll document future decisions — from now on, they live in files, not in Slack.

### 2026-04 — Migrate from Railway to Insforge for SaaS kickoff
Decision: ExcelTech stays on Railway for now (works, cheap, shippable). The SaaS product lives on Insforge from day one. Rationale: better multi-tenant story, better usage billing. See [[Efforts/Niksho-SaaS-Product/Overview]].

### 2026-03 — Sonnet 4 for Screener, Haiku 4.5 for extraction
Decision: Model split by judgment density. Sonnet 4 where reasoning quality compounds into placement rate. Haiku 4.5 where it's just transformation. Cost-effective, high-quality. See [[Atlas/Product/Agents#Model-choice]].

### 2026-03 — No LinkedIn scraping. Ever.
Decision: LinkedIn is manual-only. No automated scraping, no Firecrawl jobs, no background reads. Rationale: ToS, reputation, Phase 2 GTM credibility. See [[Atlas/Product/Sourcing-Channels#LinkedIn]].

### 2026-02 — Individual Outlook per recruiter, not a shared inbox
Decision: 10 Microsoft Graph OAuth connections. Outreach always from a named human's real email. Rationale: candidate trust, recruiter identity, no spam filter blacklists. See [[Atlas/ExcelTech/Team#Key-technical-fact]].

## Open questions
- How do we measure "time saved per recruiter per day" in a way the team agrees is fair?
- What's the right way to tune per-recruiter voice without having them write prompts themselves?
- When a Follow-up agent makes a wrong extraction (e.g. parses "no" as interested), what's the cleanest feedback mechanism?

## Related
- [[Atlas/ExcelTech/ExcelTech-Overview]]
- [[Atlas/ExcelTech/New-Flow]]
- [[Atlas/Product/Architecture]]
- [[Atlas/Product/Agents]]
- [[Atlas/Product/Skills]]
- [[Atlas/Business-Model/Phase-1-ExcelTech]]
- [[Calendar/Quarterly/2026-Q2]]
