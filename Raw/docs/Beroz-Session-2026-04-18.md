---
type: raw-session-log
source: internal
date: 2026-04-18
phases: ["Phase 5 — Submit-to-TL", "Phase 4 — Sequences wiring"]
commits: ["ed63940", "717e523"]
generated-by: claude
---

# Session Log — 2026-04-18

Phase 5 (Submit-to-TL) + Phase 4 wiring shipped. Full recruiter→TL→client
lifecycle is now live in production.

---

## TL;DR

Two commits landed on `origin/main` (Railway auto-deploys):

- **`ed63940`** — `feat(phase5): Submit-to-TL workflow — close recruiter→TL loop`
- **`717e523`** — `feat(phase4): wire Sequences everywhere — slide-over + page + Activity`

No schema changes required — all new surfaces read from tables that
already existed (`submissions`, `outreach_log`).

---

## What shipped

### Phase 5 — Submit-to-TL (commit `ed63940`)

Closes the recruiter→TL handoff. Until now, the TL queue was wired for
reading (`/api/tl/queue`) and approving, but there was no way to push a
candidate *into* the queue from the UI.

**Backend**
- `POST /api/candidates/<id>/submit-to-tl` → new `submit_to_tl` handler in
  [backend/ai_agents/core.py](backend/ai_agents/core.py).
  Validates candidate, requirement, and rejects duplicate submissions for
  the same (candidate, requirement). Inserts a `submissions` row with
  `tl_approved=false`, `submitted_by_recruiter`, and optional
  `placement_type` (FTE/TP/C2H) + `remarks`. Also flips
  `candidate_details.status` to `submitted_to_tl`.
- `get_candidate_detail` now returns `submissions[]` for this candidate so
  the slide-over can tell whether Submit-to-TL is already done per
  requirement (prevents accidental double submission).
- `list_user_shortlists` now joins the latest submission per candidate so
  shortlist cards surface a status tag at a glance.

**Frontend — Candidate slide-over**
- New **Submit to TL** button next to Shortlist. Only visible when:
  1. User role is `recruiter`
  2. Slide-over was opened with a requirement context
  3. No existing submission for this (candidate, requirement) pair
- Opens a modal with placement-type dropdown + notes textarea.
- After submit, button flips to **Submitted** / **TL approved** /
  **Sent to client** depending on state, and a status chip appears in
  the hero area.

**Frontend — Shortlist + source cards**
- Sourced candidate cards now stamp `data-requirement-id` so clicking
  through opens the slide-over with the right requirement scope.
- Shortlist cards now show a coloured status tag (`With TL` / `TL
  approved` / `Sent to client` / `TL rejected`) when a submission exists.

### Phase 4 — Sequences wiring (commit `717e523`)

Phase 4 was half-done: the send-sequence modal worked, but three surfaces
were placeholders or disconnected. Fixed all three.

**Backend**
- `get_candidate_detail` now returns `outreach[]` rows joined with
  `requirements.role_title` + `requirements.client_name` so the
  slide-over can show "For &lt;role&gt; · &lt;client&gt;" on each email.
- New `list_sequences(scope)` handler in
  [backend/ai_agents/core.py](backend/ai_agents/core.py):
  - `scope=mine` → only emails the logged-in user sent
  - `scope=all` → TL only; everyone's emails
  - Returns each email enriched with candidate + requirement metadata,
    plus a `requirements` summary array for group headers.
- New `GET /api/sequences?scope=mine|all` route.

**Frontend — Slide-over Sequences right tab**
- Was: *"No active sequences — Phase 4 will wire this up."*
- Now: list of every outreach email sent to this candidate, each with
  subject, requirement context, recruiter, timestamp, and a
  **Replied** / **Awaiting reply** chip.
- **New sequence** button launches the existing sequence modal
  pre-populated with just this candidate (requires requirement context).

**Frontend — Slide-over Activity right tab**
- Was: disabled stub.
- Now: unified timeline merging notes + emails sent + replies received +
  Submit-to-TL + TL approvals + client sends + TL rejections, sorted
  newest-first. Each event has a colour-coded icon and inline detail.

**Frontend — Sidebar Sequences page**
- Was: pointed to the legacy **Outreach & Inbox** page (resume upload +
  inbox monitor — old flow).
- Now: modern list view:
  - Grouped by requirement, each group showing sent/replied counts.
  - Three filter tabs: **All** / **Awaiting reply** / **Replied**.
  - Scope switch: **My sequences** / **All sequences** (TL-only).
  - 3 stat tiles: Emails sent / Replies received / Reply rate.
  - Click any row → opens the candidate slide-over scoped to that
    requirement.
- Legacy Outreach & Inbox UI preserved at `/page-outreach` (not linked
  from the sidebar anymore, but not deleted — can be re-linked if
  needed).

---

## Files touched

| File | Δ | Purpose |
|---|---|---|
| `backend/ai_agents/core.py` | +199 / -1 | `submit_to_tl`, `list_sequences`, enriched `get_candidate_detail`, enriched `list_user_shortlists` |
| `backend/app.py` | +24 / 0 | `POST /api/candidates/<id>/submit-to-tl`, `GET /api/sequences` |
| `frontend-exceltech/index.html` | +569 / -21 | Submit-to-TL button + modal, slide-over Sequences + Activity tabs, Sequences page redesign, data-requirement-id on source cards, shortlist status tags |

Two commits:
- `ed63940` — Phase 5 Submit-to-TL (325 lines)
- `717e523` — Phase 4 wiring (462 lines)

---

## Full RCO lifecycle — now live end-to-end

```
┌─────────────┐   ┌──────────┐   ┌──────────┐   ┌────────────┐   ┌──────────────┐
│ Requirement │ → │ Source   │ → │ Shortlist│ → │ Sequence   │ → │ Submit to TL │
│  (TL or     │   │ Now      │   │  + Notes │   │  Draft +   │   │ (placement + │
│  recruiter) │   │          │   │          │   │  Send      │   │  remarks)    │
└─────────────┘   └──────────┘   └──────────┘   └────────────┘   └──────┬───────┘
                                                                         ↓
                                                              ┌──────────────────┐
                                                              │ TL Queue         │
                                                              │ Approve & Send   │
                                                              │ (to client email)│
                                                              └──────────────────┘
```

Every step has a UI surface, persistent state in Supabase, and a status
that propagates back up to the candidate card / shortlist card /
slide-over chip.

---

## Key decisions

| Question | Answer |
|---|---|
| **Should Submit-to-TL require a requirement context?** | Yes. Opens only from sourced-candidate cards, requirement-candidate views, or the shortlist (which now carries `latest_requirement_id`). |
| **What prevents double submission?** | Backend rejects with 409 if a `submissions` row already exists for (candidate, requirement). Frontend also greys the button out when it sees an existing submission in `data.submissions`. |
| **Where does Activity get its data?** | Client-side merge of `notes`, `outreach`, `submissions` (all already returned by `/api/candidates/<id>/detail`). No new endpoint. |
| **Did we delete the legacy Outreach & Inbox?** | No — just unlinked it from the sidebar. The route still resolves at `/page-outreach` in case the team needs it during transition. |
| **TL scope for sequences?** | `scope=all` available only to TL role; recruiters always see their own. |
| **Schema changes?** | Zero. Everything runs on existing `submissions` and `outreach_log` tables. |

---

## Production smoke-test checklist

After Railway finishes deploying `717e523` (1–2 min):

- [ ] Hard-refresh `/app` (⌘⇧R) to bust the browser cache.
- [ ] As Devesh (recruiter): open a requirement with candidates → click
      any sourced candidate → Submit to TL button visible next to
      Shortlist → clicking opens modal with placement-type + notes.
- [ ] Submit one candidate. Button flips to **Submitted**, chip
      "Awaiting TL review" appears. Try to submit the same candidate
      again → modal never reopens (button is disabled).
- [ ] Still as Devesh: open the Sequences tab in the slide-over → if
      this candidate was sent an email previously, the list shows it
      with the right subject/timestamp/chip.
- [ ] Activity tab → shows chronological merge of notes + emails +
      submission events.
- [ ] Sidebar **Sequences** → grouped list, stats tiles populated,
      filter tabs work, clicking a row opens the candidate.
- [ ] As Raju (TL): Sequences page shows an **All sequences** tab —
      switch to it and see everyone's outreach.
- [ ] **Submissions** (TL only): the candidate Devesh just submitted
      shows up as pending. Approve & Send → modal asks for client
      email → email sent via Graph, submission row updates
      `tl_approved=true` + `sent_to_client_at`.
- [ ] Re-open that candidate's slide-over as Devesh → chip reads
      **Sent to client**, Submit to TL button now reads **Sent to
      client** and is disabled.

If all 8 pass, Phase 4 + 5 are production-ready.

---

## Known follow-ups (from prior sessions, still open)

1. **Live `1M+ matches` counter** on Select-Manually panel — still
   deferred.
2. **Apollo plan upgrade** — code ready, just needs a paid plan
   ($49 Basic → mixed_people/search endpoint unlocks).
3. **match_scores caching for ad-hoc search** — still not wired.
4. **Invite members endpoint** — placeholder modal; users still
   hardcoded in `RECRUITER_LOGINS`.
5. **Legacy Outreach & Inbox** — still accessible at `/page-outreach`,
   decision pending on whether to fully retire it.
6. **Requirement ↔ Project scoping** — `project_id` still nullable on
   requirements; no "Assign to project" action yet.

---

## Commands that mattered

```bash
# Local run (needs Supabase + Anthropic creds):
cd "/Users/nikhilkumar/Claude Workspace/exceltech-ai/Brand New Website/beroz"
export FLASK_PORT=5352
export SUPABASE_URL="..."
export SUPABASE_SERVICE_ROLE_KEY="..."
export ANTHROPIC_API_KEY="..."
python3 run.py
# → open http://localhost:5352/app

# Push to Railway:
git push origin main
# ed63940..717e523  main -> main
```
