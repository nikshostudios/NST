---
type: wiki-hot-cache
generated-by: claude
updated: 2026-04-28
max-words: 1000
---

# Wiki — Hot Cache

Small recency buffer. Rewritten by [[AIOS/skills/lint-wiki]] whenever it runs. If you're an AI reading this first, this is the current state of what matters most.

---

## Right now — 2026-04-28

### Sequences redesign + row 3-dot menu → SHIPPED to repo, verification pending ⚠️
Two pushes in one session on 2026-04-26 — Sequences moves from "list of emails sent" to a real engagement-tracking surface, and rows pick up Pin / Star / Clone / Archive. **Code is in the repo. End-to-end verification (section 5 of the handoff doc) has not yet been run against a running stack** — treat as wired-up but unverified.

**The engagement trifecta (new, all four needed for honest metrics):**
1. **Pixel** — every send gets a `tracking_token` saved on `outreach_log`; 1×1 GIF at `/track/open/<token>.gif`. Directional signal (image-blocking distorts).
2. **Click rewrite** — every `<a href>` rewritten to `/track/click/<token>?u=<orig>`, skips mailto/tel/already-tracked/unsubscribe. Higher-fidelity than opens.
3. **Bounce parse** — `_run_process_inbox` checks bounce sender/subject/Final-Recipient patterns *before* the reply branch. Order matters: Mailer-Daemon emails would otherwise be misclassified as "no" replies.
4. **AI intent (Haiku)** — non-bounce replies → `interested | not_interested | out_of_office | other` + confidence, stamped on `sequence_runs.intent`.

Pattern extracted as [[Wiki/concepts/Email-Tracking-Trifecta]] — load-bearing for the SaaS port.

**Adjacent shipped this round:**
- **Signatures library** — `user_signatures` table, partial unique index on default, `/api/signatures` CRUD, dropdown in editor.
- **Unsubscribe flow** — token-signed footer (HMAC of `run_id:email`), global `email_unsubscribes` suppression list, pre-send guard at top of `sequence_tick`. Footer goes in *before* link rewrite (otherwise the unsub URL gets tracked).
- **Test-send** — `[TEST]`-prefixed preview to current user; no log/run/tracking. Keeps test traffic out of metrics.
- **UI rebuild** — overview cards (Total/Active/Opened/Clicked/Replied/Interested), 7/14/30-day chart on overview + detail, 7-card detail page with embedded chart, editor signature dropdown + unsub checkbox + Preview-and-test button.
- **Row 3-dot menu** — `sequences.is_pinned` / `is_starred` / `pinned_at` columns + partial index, deep-copy `clone_sequence_row`, popover Pin/Star/Edit/Clone/Archive (Archive red), purple pin icon + amber star on row name. `data-stop="1"` separates row-click drilldown from menu-click.

**Full details:** [[Wiki/digests/Session-Beroz-Sequences-Redesign-2026-04-26]] · [[Raw/docs/Beroz-Session-2026-04-26]]

**Before relying on this in production:** apply the migration (`apply_schema.py sequence_tracking.sql`), set `PUBLIC_BASE_URL` and `UNSUBSCRIBE_SECRET` env vars on Railway, then walk section 5 of the handoff doc.

---

### Full RCO lifecycle → LIVE end-to-end ✅ (2026-04-18, carried)
Two commits to `origin/main`: `ed63940` (Phase 5 — Submit-to-TL) and `717e523` (Phase 4 — Sequences wiring). The complete pipeline `Requirement → Source → Shortlist → Sequence → Submit to TL → TL approves + sends` is operational with persistent state and propagating status. Submit-to-TL backend rejects duplicate (candidate, requirement) with 409; frontend pre-checks `data.submissions`. Pattern: [[Wiki/concepts/Idempotent-Multi-Role-Handoff]]. See [[Wiki/digests/Session-Beroz-Phase4-Phase5-2026-04-18]].

### Projects layer + sidebar refactor + Search hero → LIVE ✅ (2026-04-17, carried)
Commits `423a01e` + `56ba201`. Projects are real Supabase tables. Sidebar is 3-zone. Agent Home deleted. Avatar at bottom-left, 5 items wired. See [[Wiki/digests/Session-Beroz-Projects-Layer-2026-04-17]].

### Beroz — 31/31 Playwright passing (carried)
Commit `f2f0c0d`. FastAPI merged into Flask, silent `api()` fixed, `experience_min` type fixed, Supabase healthcheck. See [[Wiki/digests/Session-Beroz-Fix-Analysis-2026-04-16]].

### v2 Recruitment architecture (carried)
8 sourcing channels, 7 agents, 4 phases. Phase 1 Foundit EDGE API migration **blocked on API key from Prayag**. See [[Raw/docs/ExcelTech-Recruitment-Agent-Architecture-v3.html]].

### Competitor analysis — X0PA AI (carried)
29 features across 3 platforms. See [[Wiki/competitors/X0PA-AI]].

### In motion (by intensity)
- 🔥 **Active** — [[Efforts/ExcelTech-Automation/Overview|ExcelTech Automation]] — Sequences redesign in repo, awaiting verification. [[Efforts/Niksho-SaaS-Product/Overview|Niksho SaaS Product]] — engagement trifecta is the load-bearing pattern for the SaaS port.
- 🌀 **Ongoing** — [[Efforts/Second-Brain-Setup/Overview|Second Brain Setup]] v1 shipped, maintenance mode.
- 💤 **Sleeping** — [[Efforts/Fundraising/Prep-2027|Fundraising 2027]].

### Open blockers / follow-ups
- **Sequences end-to-end verification** — section 5 of the 04-26 handoff doc not yet executed. Top priority.
- **`PUBLIC_BASE_URL` and `UNSUBSCRIBE_SECRET` env vars** — must be set on Railway before tracking works.
- **Detail-page 3-dot menu** — overview list only this round.
- **`is_starred` filter / Starred scope chip** — backend not wired.
- **Bulk row actions** — not yet in scope; will likely accompany the Starred filter.
- **Settings panel inside editor** — still deferred.
- **Foundit EDGE API key** — still pending from Prayag.
- **Apollo plan upgrade** — code ready; needs paid plan ($49 Basic).
- **Full Searches post-query layout** — second competitor screenshot pending from Nikhil.
- **`/api/search` project scoping** — endpoint ignores `state.activeProject`; cosmetic. Do NOT wire without sign-off.
- **Invite members** — placeholder; no `POST /api/team/invite` yet.
- **Legacy `/page-outreach`** — preserved unlinked from 04-18; retirement decision pending.
- **`supabase-py` has no DDL** — schema changes still need Supabase Console or `apply_schema.py`.

### Recently resolved
- ~~Sequences redesign + 3-dot menu (code)~~ — ⚠️ Shipped to repo 2026-04-26; verification pending.
- ~~Submit-to-TL UI~~ — ✅ Shipped 2026-04-18, commits `ed63940` + `717e523`.
- ~~Projects layer / sidebar refactor / Search hero~~ — ✅ Shipped 2026-04-17, commits `423a01e` + `56ba201`.
- ~~Create Requirement bug~~ — ✅ Fixed 2026-04-16, commit `f2f0c0d`.

### New to the vault today
- [[Wiki/digests/Session-Beroz-Sequences-Redesign-2026-04-26]]
- [[Wiki/concepts/Email-Tracking-Trifecta]]
- [[Raw/docs/Beroz-Session-2026-04-26]]

### Guardrails for the AI reading this
- Do not edit anything in `Raw/`. It is sacred.
- Do not auto-send any email from any code path.
- Do not build or suggest LinkedIn scraping. Ever.
- Do not rewrite the Railway codebase for architectural purity. Extend in `/ai_agents/` or as new Flask routes.
- Do not wire `/api/search` to `state.activeProject` without Nikhil's sign-off — cosmetic scoping is intentional for now.
- Do not assume the 04-26 Sequences feature is verified — section 5 of the handoff doc has not been run end-to-end. Treat as wired-up only.
- Always add `generated-by: <tool>` frontmatter to AI-authored files.

See [[mi]] for the full guardrail set.

---

_Updated on 2026-04-28 — ingested Beroz-Session-2026-04-26 (Sequences end-to-end redesign: engagement tracking trifecta, signatures + unsubscribe, overview/detail/editor rebuild, Pin/Star/Clone/Archive 3-dot menu). Created Email-Tracking-Trifecta concept. Verification status: code in repo, end-to-end test pending. Previous (2026-04-18): Phase 4+5 RCO lifecycle live; Idempotent-Multi-Role-Handoff concept._
