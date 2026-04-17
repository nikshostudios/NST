---
type: wiki-hot-cache
generated-by: claude
updated: 2026-04-17c
max-words: 1000
---

# Wiki — Hot Cache

Small recency buffer. Rewritten by [[AIOS/skills/lint-wiki]] whenever it runs. If you're an AI reading this first, this is the current state of what matters most.

---

## Right now — 2026-04-17

### Projects layer + sidebar refactor + Search hero → LIVE in ExcelTech production ✅
Two commits shipped to `origin/main` and auto-deployed via Railway: **`423a01e`** (Projects layer, sidebar refinement, Search hero) and **`56ba201`** (frontend-saas mockup mirror). Supabase schema was applied manually in the Dashboard SQL Editor before the push (`supabase-py` has no DDL support — an open constraint on future schema changes).

**What's new on `/app`:**
- **Projects are real.** New Supabase tables `projects` (id, title, access_level shared|private, status, created_by, created_at) + `project_collaborators` (many-to-many). `requirements.project_id` column exists but is **unused on purpose** — Requirements stays global.
- **Sidebar is now a 3-zone layout.** Global-top (All Projects) → **Project Card** (Projects dropdown / Searches / Shortlist, scoped by `state.activeProject`) → Global-middle (Requirements / Contacts / Sequences / Submissions TL-only / Analytics / Integrations). The box around the Project Card is the visual encoding of the scoping boundary. See [[Wiki/concepts/Projects-as-Scoping-Primitive]].
- **Agent Home is gone.** Default landing is now All Projects. Greeting + chat input + quick-action chips all deleted. The "chat is the home" instinct is reversed.
- **Search page rebuilt as a competitor-inspired hero.** "Hey \<firstName\>, who are you looking for?" + 4 mode chips (Find Similar / JD / Boolean / Manual — chips only toggle placeholder, backend identical) + purple-glow textarea + 5 clickable example queries + collapse-on-submit. Pattern extracted as [[Wiki/concepts/Search-First-Hero-Mode-Chips]].
- **Avatar moved to bottom-left sidebar, opens upward, 5 items all wired** (Invite members, Help center, Knowledge base, Contact support, Sign out). No more console.log stubs. Header is now minimal (notifications + title).
- **Sibling mockup** at `frontend-saas/index.html` mirrors the UI in pure in-memory state for reference.

**Access model:** visibility = owner **OR** `access_level='shared'` **OR** listed in collaborators. Edit/archive/delete = owner-only (`created_by == session_email`).

**Full details:** [[Wiki/digests/Session-Beroz-Projects-Layer-2026-04-17]] · [[Raw/docs/Beroz-Session-2026-04-17]]

### Planning artifact for the Projects ship — preserved
The morning planning session that drove the ship is now filed at [[Raw/docs/Beroz-Frontend-Planning-2026-04-17]] with a digest at [[Wiki/digests/Session-Beroz-Frontend-Planning-2026-04-17]]. Useful for understanding *why* the ship looks the way it does — what was on the table, what the open questions were before implementation collapsed them. The avatar's bottom-left placement (vs the originally-planned top-right header) and the Project Card boundary (vs a flat sidebar) are the main divergences worth knowing.

### Chrome extension for outreach — DEFERRED, novel concept added
The planning session raised but did not commit to building a Gmail/Outlook extension that mirrors Juicebox's "send from your own inbox, log to platform" pattern. Trade-offs (deliverability vs build cost, store reviews, MS/Google policy risk) and a forward-compat ask (let `outreach_event` accept an event source field) are now captured at [[Wiki/concepts/Personal-Inbox-Outreach-Tracking]].

### Dev-loop change — auto git-pull hook
Added a `UserPromptSubmit` hook in `~/.claude/settings.json` that runs `git -C ".../beroz" pull --ff-only origin main` before every prompt. Keeps local in sync with GitHub (defends against the "Claude edits a stale file" class of bug). Git auth side-quest also resolved: `gh auth setup-git` switched git from cached `thenikhil05` to active `nikshostudios`. See [[Wiki/techniques/Auto-Git-Pull-Hook]].

### Beroz — 31/31 Playwright passing, Create Requirement fix shipped (carried from 2026-04-16)
Commit `f2f0c0d` merged FastAPI into Flask, fixed the silent `api()` helper, corrected `experience_min` type, and added a Supabase healthcheck. Full chain is healthy. See [[Wiki/digests/Session-Beroz-Fix-Analysis-2026-04-16]].

### Juicebox teardown → Search-First UI direction (carried)
Juicebox reverse-engineering produced a 700-line teardown + 43 HTML captures. Established that the UI pattern is [[Wiki/concepts/Search-First-SaaS-UI]], not dashboard-first. Today's Search hero is the first production application of this. Still pending: `crawl-missing.js` to capture search-results page + candidate details for the full post-query layout design.

### v2 Recruitment architecture (carried, still in flight)
8 sourcing channels, 7 agents, 4 implementation phases. Phase 1: Foundit EDGE API migration (**blocked on API key from Prayag**), JD Parser agent, Screener salary logic, Excel CRM export. See [[Raw/docs/ExcelTech-Recruitment-Agent-Architecture-v3.html]].

### Competitor analysis — X0PA AI (carried)
29 features across 3 platforms. Positioning insight: X0PA is assessment/compliance-heavy but doesn't touch the recruiter's daily operational loop. That's Niksho's lane. See [[Wiki/competitors/X0PA-AI]].

### In motion (by intensity)
- 🔥 **Active** — [[Efforts/ExcelTech-Automation/Overview|ExcelTech Automation]] — Projects layer + Search hero live in production. [[Efforts/Niksho-SaaS-Product/Overview|Niksho SaaS Product]] — same UI patterns now reusable; Juicebox post-query layout next.
- 🌀 **Ongoing** — [[Efforts/Second-Brain-Setup/Overview|Second Brain Setup]] v1 shipped, maintenance mode.
- 💤 **Sleeping** — [[Efforts/Fundraising/Prep-2027|Fundraising 2027]].

### Open blockers / follow-ups
- **Full Searches post-query layout** — second competitor screenshot pending from Nikhil.
- **`/api/search` project scoping** — endpoint currently ignores `state.activeProject`; the "In: \<project\>" strip is cosmetic. Do NOT wire without Nikhil's sign-off.
- **Foundit EDGE API key** — still pending from Prayag.
- **Playwright `crawl-missing.js`** — still needed for Juicebox search-results + candidate-details capture.
- **Legacy `/dashboard` route** — decide: redirect to `/app`, delete, or leave.
- **Invite members** — placeholder; no `POST /api/team/invite` yet. `RECRUITER_LOGINS` dict still owns team membership.
- **Requirement ↔ Project backfill** — old requirements have `project_id = NULL` (fine for now; "Assign to project" action is a future follow-up).
- **`supabase-py` has no DDL** — future schema changes still need Supabase Console runs (Alembic not in the stack).

### Recently resolved
- ~~Projects layer / sidebar refactor / Search hero~~ — ✅ Shipped 2026-04-17, commits `423a01e` + `56ba201`.
- ~~Create Requirement bug~~ — ✅ Fixed 2026-04-16, commit `f2f0c0d`. 31/31 tests passing.

### New to the vault today
- [[Wiki/concepts/Projects-as-Scoping-Primitive]]
- [[Wiki/concepts/Search-First-Hero-Mode-Chips]]
- [[Wiki/concepts/Personal-Inbox-Outreach-Tracking]]
- [[Wiki/techniques/Auto-Git-Pull-Hook]]
- [[Wiki/digests/Session-Beroz-Projects-Layer-2026-04-17]]
- [[Wiki/digests/Session-Beroz-Frontend-Planning-2026-04-17]]
- [[Raw/docs/Beroz-Session-2026-04-17]]
- [[Raw/docs/Beroz-Frontend-Planning-2026-04-17]]

### Guardrails for the AI reading this
- Do not edit anything in `Raw/`. It is sacred.
- Do not auto-send any email from any code path.
- Do not build or suggest LinkedIn scraping. Ever.
- Do not rewrite the Railway codebase for architectural purity. Extend in `/ai_agents/` or as new Flask routes.
- Do not wire `/api/search` to `state.activeProject` without Nikhil's sign-off — cosmetic scoping is intentional for now.
- Always add `generated-by: <tool>` frontmatter to AI-authored files.

See [[mi]] for the full guardrail set.

---

_Updated on 2026-04-17c — ingested Beroz-Frontend-Planning-2026-04-17 (the planning artifact that drove today's Projects ship); added Personal-Inbox-Outreach-Tracking concept (deferred Chrome extension decision). Previous (2026-04-17): Beroz Projects layer + Search hero shipped to production. Earlier: X0PA AI competitor analysis; Create Requirement bug resolved (commit f2f0c0d)._
