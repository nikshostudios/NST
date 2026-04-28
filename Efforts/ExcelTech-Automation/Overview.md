---
type: effort
effort: ExcelTech-Automation
status: in-production
intensity: active
started: 2025-11-01
updated: 2026-04-28
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

### 2026-04-26 — Sequences redesign + row 3-dot menu (shipped to repo, **unverified — pending end-to-end test**)

Decision: Rebuild Sequences end-to-end so it can answer "is this campaign working?" — not just "what did we send?". Add a tracking schema (pixel + click rewrite + bounce parse + AI-classified reply intent), a per-user signature library, a token-signed unsubscribe flow, a Preview-and-test path that bypasses logging, and a redesigned overview / detail / editor surface. Add a row 3-dot menu (Pin / Star / Edit / Clone / Archive, Archive in red). Code is in the repo; **the verification plan in section 5 of the handoff doc has not yet been executed against a running stack** — treat as wired-up only until the migration is applied (`apply_schema.py sequence_tracking.sql`), `PUBLIC_BASE_URL` and `UNSUBSCRIBE_SECRET` env vars are set on Railway, and the 8-step walk-through passes.

**Sub-decisions:**
- **Bounce branch runs before reply branch** in `_run_process_inbox`. Mailer-Daemon emails would otherwise be misclassified as "no" replies.
- **Unsubscribe footer is appended before link rewriting.** Otherwise the unsub URL gets wrapped in `/track/click/...` and the recipient's "remove me" click is recorded as engagement before suppression.
- **Test-send is a separate path (`test_send_step`).** No log row, no run row, no tracking — `[TEST]` subject prefix only. Keeps test traffic out of engagement metrics.
- **Pre-send unsubscribe guard at top of `sequence_tick`.** Skipped runs marked `skipped` for auditability; not silently dropped.
- **Pin/star are first-class columns + a partial index** (`sequences.is_pinned`, `is_starred`, `pinned_at`). Cheap reads, rare writes.
- **Clone is a deep copy** with `status='draft'`, `source='clone'`, name `"<original> (copy)"` — carries `signature_id` + `include_unsubscribe` per step.
- **3-dot menu is overview-only this round.** Detail-page menu deferred — avoids fanning out a half-finished pattern.

**Files touched:** `backend/ai_agents/data/sequence_tracking.sql`, `backend/ai_agents/config/db.py`, `backend/ai_agents/core.py`, `backend/app.py`, `frontend-exceltech/index.html`. Python files compile cleanly; no commit hashes captured in the handoff doc.

**Source docs:**
- [[Raw/docs/Beroz-Session-2026-04-26]] — full handoff doc with section 5 verification plan and exact helper names (grep targets)
- [[Wiki/digests/Session-Beroz-Sequences-Redesign-2026-04-26]] — compiled digest with full tracking pipeline diagram and Niksho relevance
- [[Wiki/concepts/Email-Tracking-Trifecta]] — the deliverability/engagement pattern extracted from this session, load-bearing for the SaaS port

**Guardrail:** Do not assume engagement metrics are accurate until verification passes — opens/clicks/bounces/intent could all be silently broken until the env vars are set and a real send-and-track is observed. Run section 5 of the handoff doc before any data from the new metrics surfaces influences a decision.

### 2026-04-18 — Full RCO lifecycle live end-to-end (Phase 5 Submit-to-TL + Phase 4 Sequences wiring)

Decision: Ship the Submit-to-TL UI and finish wiring Phase 4 surfaces (Sequences slide-over tab, Activity timeline, Sequences page redesign). The complete recruiter→TL→client pipeline is now operational with no gaps. Two commits to `origin/main`, auto-deployed via Railway: `ed63940` (Submit-to-TL) and `717e523` (Sequences wiring). No schema changes required — both commits run on existing `submissions` and `outreach_log` tables.

**Sub-decisions:**
- **Submit-to-TL requires requirement context.** Button only appears when slide-over knows which requirement it was opened from. Source cards now stamp `data-requirement-id`.
- **Idempotent handoff.** Backend rejects duplicate (candidate, requirement) submissions with 409. Frontend pre-checks `data.submissions` — button never misleads. Pattern: [[Wiki/concepts/Idempotent-Multi-Role-Handoff]].
- **Activity tab is client-side merge.** Notes, outreach, and submissions were already returned by the detail endpoint — no new route needed.
- **Legacy Outreach & Inbox preserved at `/page-outreach`.** Unlinked from sidebar, not deleted.
- **Sequences scope:** `scope=mine|all` on `GET /api/sequences`; `scope=all` is TL-only.

**Source docs:**
- [[Raw/docs/Beroz-Session-2026-04-18]] — full session log (handler code, smoke-test checklist, file Δ table)
- [[Wiki/digests/Session-Beroz-Phase4-Phase5-2026-04-18]] — compiled digest with full lifecycle diagram and Niksho relevance
- [[Wiki/concepts/Idempotent-Multi-Role-Handoff]] — submit-gate pattern extracted from this session

**Guardrail:** The full pipeline is live but several surfaces (Searches post-query layout, `/api/search` project scoping, Apollo upgrade, Invite members) remain deferred. Do not wire these without explicit sign-off from Nikhil.

### 2026-04-17 — Projects layer + sidebar refactor + Search hero shipped to production
Decision: Introduce Projects as the top-level scoping primitive in Beroz, restructure the sidebar into 3 zones (global-top / Project Card / global-middle) to encode the scoping boundary visually, and rebuild the Search page as a competitor-inspired hero with mode chips. Two commits shipped to `origin/main` and auto-deployed via Railway: `423a01e` (Projects layer, sidebar refinement, Search hero) and `56ba201` (frontend-saas mockup mirror). Supabase schema applied manually via Dashboard (`supabase-py` has no DDL).

**Sub-decisions:**
- **Requirements stays global.** `project_id` column added to `requirements` but nullable and currently unused — we can opt back in later without a migration. TL-owned pool is unchanged.
- **Agent Home is dead.** Default `/app` landing is now All Projects. Greeting + chat input + quick-action chips deleted.
- **Access model:** visibility = owner OR `access_level='shared'` OR collaborator; edit/archive/delete = owner-only.
- **Avatar moved to bottom-left sidebar** (opens upward), 5 items all wired to real modals (no console.log stubs). Header is now minimal.
- **Search hero mode chips toggle placeholder text only.** Single backend call across all 4 modes — keeps backend simple, preserves option to route later.
- **Dev-loop change:** `UserPromptSubmit` hook added to `~/.claude/settings.json` that runs `git pull --ff-only origin main` on the Beroz repo before every prompt.

**Source docs:**
- [[Raw/docs/Beroz-Session-2026-04-17]] — full session log (SQL, API, sidebar, decisions, follow-ups, smoke-test)
- [[Wiki/digests/Session-Beroz-Projects-Layer-2026-04-17]] — compiled digest with Niksho relevance
- [[Wiki/concepts/Projects-as-Scoping-Primitive]] — the reusable scoping pattern
- [[Wiki/concepts/Search-First-Hero-Mode-Chips]] — the intent-capture hero pattern
- [[Wiki/techniques/Auto-Git-Pull-Hook]] — the git-pull hook

**Guardrail for next session:** `/api/search` currently ignores `state.activeProject` — the "In: \<project\>" strip is cosmetic. Do not wire search scoping without explicit sign-off; the Contacts / Sequences / Submissions surfaces are deliberately global right now.

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
