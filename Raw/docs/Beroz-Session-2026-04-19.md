---
type: raw-session-log
source: internal
date: 2026-04-19
covers: 2026-04-18 to 2026-04-19
generated-by: claude
commits:
  - b3e3cfd  # refactor(db): consolidate gebiz + client_contacts into interview_tracker
  - b9be657  # feat(projects): make new projects private-only on creation
  - f258bed  # feat(sequences): multi-step builder + AI streaming + add-contacts enroll
  - 4d63a01  # fix: Source Now always includes Supabase DB pool + clearer batch dialog
  - e4c9388  # feat: bulk action bar with shortlist toggle, CSV/PDF download + unified sourced candidate view
  - 3469b93  # feat: add synopsis/table/cards view toggle for search results
  - 819c4b5  # feat: add apply_schema.py for one-command SQL migrations
  - 717e523  # feat(phase4): wire Sequences everywhere — slide-over + page + Activity
note: "717e523 was already ingested in Beroz-Session-2026-04-18. The 7 remaining commits are net-new to the vault."
---

# Session Log — 18–19 April 2026

Changes shipped to GitHub (`main`) during this two-day window.
8 commits, 20 tables → 18 tables, ~2,300 lines net added.


## 19 April — Database Cleanup & Consolidation

`b3e3cfd` — refactor(db): consolidate gebiz + client_contacts into interview_tracker

Problem: Two tables held historical data that overlapped with or were
never used by live code — `gebiz_submissions` (668 rows of SG tender data)
and `client_contacts` (96 rows, zero Python reads/writes). The stale
`backend/ai-agents/` folder (hyphenated) was a duplicate of `backend/ai_agents/`
that cluttered search results and confused navigation.

What changed:

* Schema — `interview_tracker` extended with 4 new columns:
  `tender_number`, `school_name`, `submission_date`, `rechecking_date` + 2 indexes.
  `gebiz_submissions` and `client_contacts` dropped.

* `backend/ai_agents/data/consolidate_tracker.sql` (new) — migration file
  with the ALTER / CREATE INDEX / DROP statements. Applied to Supabase before deploy.

* `backend/ai_agents/data/schema.sql` — authoritative schema updated to
  reflect consolidated state (fresh redeploys get the right table structure).

* `backend/ai_agents/config/db.py` — removed `insert_gebiz_submission` and
  `get_gebiz_by_candidate`; added `insert_interview_tracker(data: dict)`; removed
  `interview_tracker` from the wipe loop (it is now the primary tracking table,
  not a disposable child-of-requirements).

* `backend/ai_agents/core.py` — TL approval flow (`tl_send_to_client`, line ~1746)
  now writes SG tender rows to `interview_tracker` instead of `gebiz_submissions`,
  including `candidate_id`, `requirement_id`, `tender_number`, `school_name`,
  `submission_date`, and `status='Submitted'`.

* `backend/ai_agents/data/wipe_requirements.sql` — removed `interview_tracker`
  from the pre/post count blocks and the delete loop; updated header comment.

* `backend/ai_agents/data/migrate.py` — GeBIZ sheet handler now inserts into
  `interview_tracker` instead of `gebiz_submissions`; deleted the broken
  `migrate_contacts` handler (it targeted the now-dropped `client_contacts` table).

* `backend/ai_agents/skills/tl-send-to-client.md` — updated step 7 and DB
  tables list to reference `interview_tracker`; removed `client_contacts` from Read.

* `backend/ai_agents/config/context_rules.md` — two GeBIZ rule lines updated
  to reference `interview_tracker`.

* `FEATURES.md` — data model table updated (removed two rows, added
  `interview_tracker` row); TL approval flow diagram note updated; `ai-agents/` → `ai_agents/`.

* `SESSION.md`, `TESTING.md`, `backend/scripts/refresh_foundit_cookie.py` —
  prose references `ai-agents/` renamed to `ai_agents/`.

* `backend/ai-agents/` (entire folder, 25 files) — deleted. Was a stale snapshot
  of `backend/ai_agents/`. Python never imported from it (hyphen in path is invalid
  for Python imports); only showed up in search results.

Net: 20 → 18 public Supabase tables. Single source of truth for interview +
tender tracking. Dead folder gone.


## 18 April — Feature Shipping

`b9be657` — feat(projects): make new projects private-only on creation

Dropped "Access Level" and "Collaborators" fields from the Create-Project modal.
`access_level` is now hardcoded to `'private'` server-side on creation.
Edit-Project modal retained so owners can promote to shared later.
Prevents accidental data exposure when a TL creates a project under pressure.

Files: `backend/ai_agents/core.py`, `frontend-exceltech/index.html`


`f258bed` — feat(sequences): multi-step builder + AI streaming + add-contacts enroll

Replaced the single-email Phase 4 outreach flow with a full multi-step
sequence builder (like a lightweight Outreach.io).

DB: 5 new tables via `sequences_v2.sql`:
`sequences`, `sequence_steps`, `sequence_runs`, `sequence_step_sends`,
`sequence_run_events` + backlinks on `outreach_log`.

Backend (`backend/app.py` + `config/db.py`): 10 new Flask routes under
`/api/sequences/*`. SSE generator streams Claude-drafted step content
one-by-one. Full CRUD + preview + enroll (step 1 sends immediately via
Graph API; steps 2+ staggered 2 min apart). Reply detection halts the
active run automatically.

Frontend: Sequence overview with 6 stat cards + pure-SVG 7-day activity
chart. 4-card chooser modal → AI config modal → 2-pane drag-reorder step
editor with rich-text contenteditable + variable chips. Detail page with run
table. Add-contacts page with per-contact editable email preview before send.

Files: `backend/ai_agents/config/db.py`, `backend/ai_agents/data/sequences_v2.sql`,
`backend/app.py`


`4d63a01` — fix: Source Now always includes Supabase DB pool + clearer batch dialog

* Per-card "Source Now" now delegates to `_source_and_score_capped` so the
  internal DB candidate pool is always merged (was previously skipped on
  per-card sourcing, returning only external results).

* Background screening now receives the full merged pool (external + DB).
* Batch dialog now shows external-new / DB-considered / matched counts instead
  of the misleading "saved to DB" line.

Files: `backend/ai_agents/core.py`, `frontend-exceltech/index.html`


`e4c9388` — feat: bulk action bar with shortlist toggle, CSV/PDF download + unified sourced candidate view

* Bulk action bar expanded: Shortlist ↔ Unshortlist toggle, Download (CSV / PDF),
  Add to Sequence, Clear.

* Sourced candidates now go through the same 3-view dispatcher (synopsis / table /
  cards) as Search results — consistent UX across the app.

* `renderSourcedCandidateCards` deleted; replaced by shared `wireSelectionCheckboxes`
  helper. Checkboxes persist on view toggle.

* Client-side `downloadCandidatesCSV` builder with soft-criterion columns.
* New `POST /api/candidates/export/pdf` endpoint (PyMuPDF, one A4 page per candidate).

Files: `backend/app.py`, `frontend-exceltech/index.html`


`3469b93` — feat: add synopsis/table/cards view toggle for search results

Three switchable views for search results:

* Synopsis — compact 4-up grid
* Table — Excel-like rows with per-criterion thumbs-up/down
* Cards — existing layout

Toggle state persists to `localStorage` and re-renders without re-fetching.
Backend now surfaces a `criterion_matches` map per candidate so the table
view can show per-criterion match indicators.

Files: `backend/ai_agents/core.py`, `frontend-exceltech/index.html`


`819c4b5` — feat: add apply_schema.py for one-command SQL migrations

New helper `backend/ai_agents/data/apply_schema.py` runs any `.sql` file
against the Supabase project via the Management API (PAT auth). Replaces
the manual copy-paste-into-Dashboard workflow used for every prior migration.

Used immediately to apply `phase3_shortlists_notes.sql`, which created
`candidate_shortlists` and `candidate_notes` tables that were missing from
production (causing the Shortlist page to 500 with PGRST205).

Files: `backend/ai_agents/data/apply_schema.py`


`717e523` — feat(phase4): wire Sequences everywhere — slide-over + page + Activity

Phase 4 Sequences was half-implemented: the send-sequence modal worked but the
slide-over Sequences tab was a placeholder and Activity was disabled.

Backend:

* `get_candidate_detail` now returns `outreach_log` rows joined with requirement
  `role_title` + `client_name` for inline email history in the slide-over.

* New `list_sequences(scope)` handler returns all outreach emails enriched with
  candidate + requirement metadata. TL with `scope=all` sees all recruiters'.

* New `GET /api/sequences?scope=mine|all` route.

Frontend — Candidate slide-over:

* Sequences tab: renders each email as a card with subject, requirement context,
  recruiter, timestamp, Replied / Awaiting chip. New-sequence button pre-populates
  with this candidate when requirement context exists.

* Activity tab (was disabled): unified timeline — notes, emails, replies, Submit
  to TL, TL approvals, client sends, TL rejections — newest-first.

Frontend — Sequences page:

* `/page-sequences` replaced with a modern grouped list (per requirement),
  per-group sent/replied counts, 3 filter tabs (All / Awaiting / Replied),
  Mine/All scope switch (TL-only), stats tiles, click-to-open candidate slide-over.

* Legacy Outreach UI preserved at `/page-outreach` — nothing deleted.

Files: `backend/ai_agents/core.py`, `backend/app.py`, `frontend-exceltech/index.html`


## Summary Table

| Commit    | Type     | Area        | Impact                                          |
|-----------|----------|-------------|------------------------------------------------|
| `b3e3cfd` | refactor | DB / backend | 20→18 tables; single tracker source of truth  |
| `b9be657` | feat     | projects    | New projects always private on creation         |
| `f258bed` | feat     | sequences   | Multi-step outreach builder + AI streaming      |
| `4d63a01` | fix      | sourcing    | DB pool always merged in Source Now             |
| `e4c9388` | feat     | candidates  | Bulk bar, CSV/PDF export, unified sourced view  |
| `3469b93` | feat     | search      | Synopsis/table/cards view toggle                |
| `819c4b5` | feat     | infra       | One-command SQL migration helper                |
| `717e523` | feat     | sequences   | Full Sequences + Activity wired across app      |
