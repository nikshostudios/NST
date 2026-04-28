---
type: wiki-digest
generated-by: claude
sources:
  - "[[Raw/docs/Beroz-Session-2026-04-19]]"
covers: 2026-04-18 to 2026-04-19
date: 2026-04-19
updated: 2026-04-19
tags: [beroz, exceltech, sequences, db-schema, sourcing, candidates]
---

# Digest — Beroz 18–19 April 2026 (Sequences + DB Cleanup)

## Core argument

Eight commits over two days completed the Sequences feature end-to-end, hardened the data model, and added several long-overdue UX/infra improvements. The most architecturally significant commit is `f258bed`, which replaced the single-email Phase 4 outreach flow with a full multi-step sequence builder — the platform's closest thing to a lightweight Outreach.io. The database cleanup (`b3e3cfd`) reduced Supabase's public tables from 20 to 18 by eliminating two zombie tables and extending `interview_tracker` to absorb their responsibilities.

**Note:** Commit `717e523` (Phase 4 Sequences wiring) was also covered in [[Wiki/digests/Session-Beroz-Phase4-Phase5-2026-04-18]]. The 7 other commits here are net-new to the vault.

---

## Key changes, by area

### Sequences — full multi-step builder (`f258bed`)

The single-email Phase 4 flow is gone. Replaced by a 5-table architecture:

```
sequences
  └── sequence_steps (ordered, draggable)
        └── sequence_runs (one per enrolled contact)
              ├── sequence_step_sends (one send per step per run)
              └── sequence_run_events (reply detected → halt run)
outreach_log (backlink added)
```

Ten new Flask routes under `/api/sequences/*`. An SSE generator streams Claude-drafted step content token-by-token. Enrolment sends Step 1 immediately (via Microsoft Graph API); Steps 2+ are staggered 2 minutes apart. If a reply is detected, the active run halts automatically.

Frontend is a full 4-stage wizard: chooser modal → AI config → 2-pane step editor with drag-reorder + rich-text + variable chips → per-contact email preview before final send.

See [[Wiki/concepts/Multi-Step-Outreach-Sequences]] for the reusable architecture pattern.

### Database cleanup — 20 → 18 tables (`b3e3cfd`)

Two zombie tables eliminated:
- `gebiz_submissions` (668 SG tender rows, but all live code now writes elsewhere) — dropped. `interview_tracker` extended with `tender_number`, `school_name`, `submission_date`, `rechecking_date` + 2 indexes to absorb it.
- `client_contacts` (96 rows, zero Python reads/writes since creation) — dropped.

`interview_tracker` is now the **primary tracking table** for both interview state and GeBIZ tender submissions. It is intentionally excluded from the wipe loop. The stale `backend/ai-agents/` folder (25 files, hyphenated path — invalid for Python imports, only appeared in search results) was also deleted.

### Projects — private-by-default (`b9be657`)

"Access Level" and "Collaborators" fields removed from the Create-Project modal. `access_level` is hardcoded `'private'` server-side on creation. The Edit-Project modal retains the field so owners can promote to shared deliberately. This prevents accidental data exposure when a TL creates a project under pressure.

### Sourcing — DB pool always merged (`4d63a01`)

Per-card "Source Now" previously skipped the internal Supabase candidate pool and returned only external results. Now it delegates to `_source_and_score_capped`, which merges both. Background screening also receives the full merged pool. Batch dialog now shows `external-new / DB-considered / matched` counts instead of the misleading "saved to DB" line.

### Candidate views — bulk bar + exports + unified views (`e4c9388`)

Bulk action bar expanded: Shortlist ↔ Unshortlist toggle, Download CSV/PDF, Add to Sequence, Clear. Sourced candidates now use the same 3-view dispatcher (synopsis / table / cards) as Search results — consistent UX. `renderSourcedCandidateCards` deleted; replaced by shared `wireSelectionCheckboxes` helper. Client-side CSV export; new `POST /api/candidates/export/pdf` (PyMuPDF, one A4 page per candidate).

### Search — synopsis/table/cards toggle (`3469b93`)

Three switchable views for search results (synopsis 4-up grid / table with per-criterion thumbs / cards). Toggle persists to `localStorage`, re-renders without re-fetching. Backend now surfaces `criterion_matches` map per candidate so the table view can show per-criterion match indicators.

### Infra — one-command SQL migration (`819c4b5`)

`backend/ai_agents/data/apply_schema.py` runs any `.sql` file against Supabase via the Management API (PAT auth). Replaces the manual copy-paste-into-Dashboard workflow used for every prior migration. Used immediately to apply `phase3_shortlists_notes.sql` (which created `candidate_shortlists` and `candidate_notes` — their absence was causing PGRST205 500s on the Shortlist page).

See [[Wiki/techniques/One-Command-SQL-Migration]] for the reusable technique.

---

## Relevance to Niksho

This window completes the Phase 4 Sequences feature fully and hardens the data layer for long-term operation. The sequence builder architecture (`f258bed`) is the most reusable pattern — it's the kind of outreach automation that SaaS products charge for, and the 5-table event-sourced design with reply detection is solid enough to extract into [[Efforts/Niksho-SaaS-Product/Overview]] when the time comes. The database cleanup removes 2 tables that were technical debt from the very first migration (April 2026) and won't cause confusion in future schema reads. The `apply_schema.py` helper ends the "copy SQL into the Supabase dashboard" workflow that has slowed every migration to date.

---

## See also
- [[Wiki/concepts/Multi-Step-Outreach-Sequences]] — the sequence builder architecture as a reusable pattern
- [[Wiki/techniques/One-Command-SQL-Migration]] — apply_schema.py pattern
- [[Wiki/digests/Session-Beroz-Phase4-Phase5-2026-04-18]] — previous session (Submit-to-TL + 717e523 Sequences wiring)
- [[Efforts/ExcelTech-Automation/Overview]] — decisions log with 2026-04-19 entry
- [[Raw/docs/Beroz-Session-2026-04-19]] — full session log with all commit details
