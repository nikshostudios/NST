---
type: wiki-digest
generated-by: claude
sources: ["[[Raw/docs/Beroz-Session-2026-04-18]]"]
date: 2026-04-18
updated: 2026-04-18
tags: [beroz, exceltech, rco-lifecycle, submit-to-tl, sequences, phase4, phase5]
---

# Session Digest — Beroz Phase 4 + 5 Ship (2026-04-18)

**Two commits. Full recruiter→TL→client lifecycle now live end-to-end.**

---

## Core argument

Before this session, Beroz could source candidates, shortlist them, and send outreach — but there was no UI path to push a candidate into the TL's review queue. The Submit-to-TL button didn't exist. Phase 5 closes that gap: a modal with placement type + remarks, a backend gate that rejects duplicates with 409, and status chips that propagate the handoff state to every surface that touches that candidate. Phase 4 wiring finishes three surfaces that were stubs: the slide-over Sequences tab (now shows every email sent to a candidate), the Activity tab (client-side merge of notes + emails + submission events), and the sidebar Sequences page (grouped list with filter tabs and a TL-only scope switch). No schema changes — everything builds on `submissions` and `outreach_log` tables that already existed.

---

## What shipped

### Phase 5 — Submit-to-TL gate

**Backend** — `POST /api/candidates/<id>/submit-to-tl` handler in `core.py`. Validates candidate + requirement, rejects duplicate (candidate, requirement) pairs with 409. Inserts `submissions` row with `tl_approved=false`, `submitted_by_recruiter`, optional `placement_type` (FTE/TP/C2H) + `remarks`. Flips `candidate_details.status` to `submitted_to_tl`.

`get_candidate_detail` now returns `submissions[]` so the slide-over knows before rendering whether Submit-to-TL is already done for this (candidate, requirement) pair. `list_user_shortlists` now joins the latest submission per candidate so status tags appear on shortlist cards without an extra round-trip.

**Frontend** — Submit to TL button appears next to Shortlist, gated on three conditions: user is `recruiter` role, slide-over has requirement context, no existing submission for this pair. Opens placement-type modal. After submit, button flips through `Submitted → TL approved → Sent to client` states. Sourced candidate cards now carry `data-requirement-id` so the right requirement context is preserved when a recruiter clicks through from search results.

### Phase 4 — Sequences wiring

Three surfaces promoted from stub to real:

**Slide-over Sequences tab** — lists every outreach email sent to this candidate: subject, "For \<role\> · \<client\>" context, recruiter, timestamp, Replied/Awaiting chip. New sequence button launches the existing modal pre-populated with this candidate.

**Slide-over Activity tab** — unified chronological timeline: notes + emails sent + replies + Submit-to-TL + TL approvals + client sends + TL rejections. All data comes from `/api/candidates/<id>/detail` (already returned `notes`, `outreach`, `submissions`) — no new endpoint needed. Client-side merge, sorted newest-first, colour-coded icons.

**Sidebar Sequences page** — complete redesign from the legacy Outreach & Inbox page. Grouped by requirement; sent/replied counts per group; three filter tabs (All / Awaiting reply / Replied); scope switch My sequences / All sequences (TL-only); 3 stat tiles (Emails sent / Replies received / Reply rate). Clicking a row opens the candidate slide-over scoped to that requirement. Legacy UI preserved at `/page-outreach` — unlinked, not deleted.

---

## Lifecycle — now live end-to-end

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

Every step has a UI surface, persistent state in Supabase, and a status that propagates back up to the candidate card / shortlist card / slide-over chip.

---

## Key decisions

**Submit-to-TL requires requirement context.** The button only appears when the slide-over knows which requirement it was opened from. Source cards now stamp `data-requirement-id` to preserve this context. This prevents ambiguous submissions where a recruiter hasn't tied the candidate to a specific opening.

**Backend 409 + frontend pre-check = idempotent handoff.** The backend rejects if a `submissions` row already exists for (candidate, requirement). The frontend independently checks `data.submissions` before showing the button — so the UI is never in a misleading state even if the page was loaded before a prior submission. See [[Wiki/concepts/Idempotent-Multi-Role-Handoff]].

**Activity timeline is client-side, no new endpoint.** Notes, outreach, and submissions were already returned by the detail endpoint. Merging them in the browser avoids creating another backend route and keeps the server simple. This was the right call for a pre-MVP system — revisit only if detail payload gets unwieldy.

**Legacy Outreach & Inbox preserved at `/page-outreach`.** Not linked from the sidebar, but not deleted. Team can re-link it during transition if needed.

**Zero schema changes.** Both commits run entirely on existing `submissions` and `outreach_log` tables. This was a deliberate constraint — prove out the UI surface before adding columns.

---

## Relevance to Niksho

This is the milestone that makes Beroz a complete workflow tool, not just a sourcing assistant. The full pipeline — Requirement → Source → Shortlist → Sequence → Submit to TL → TL approves + sends — is now operational with no gaps. Every step is persistent, role-gated, and status-propagating.

The ExcelTech team can now use the product for the entire recruiter→TL→client handoff cycle without falling back to WhatsApp, email threads, or manual tracking. That's the core value proposition of [[Efforts/ExcelTech-Automation/Overview]] proven in production.

The Submit-to-TL gate design (backend 409 + frontend pre-check + status propagation chain) is a pattern worth preserving for the SaaS product — any multi-role approval flow in a future Niksho product should use the same skeleton. See [[Wiki/concepts/Idempotent-Multi-Role-Handoff]].

---

## Open follow-ups (from this and prior sessions)

- **Full Searches post-query layout** — second competitor screenshot still pending from Nikhil.
- **`/api/search` project scoping** — cosmetic for now; do not wire without sign-off.
- **Apollo plan upgrade** — code ready; needs paid plan ($49 Basic).
- **Invite members endpoint** — modal is placeholder; `RECRUITER_LOGINS` dict still owns team.
- **Legacy `/dashboard` route** — redirect / delete / leave decision pending.
- **Requirement ↔ Project backfill** — `project_id` nullable on requirements; "Assign to project" action deferred.
- **`match_scores` caching for ad-hoc search** — not wired.
- **`1M+ matches` counter** on Select-Manually — deferred.

---

## See also

- [[Raw/docs/Beroz-Session-2026-04-18]] — full session log with smoke-test checklist and file Δ table
- [[Wiki/digests/Session-Beroz-Projects-Layer-2026-04-17]] — previous session (Projects layer, sidebar 3-zone, Search hero)
- [[Wiki/concepts/Idempotent-Multi-Role-Handoff]] — the submit gate pattern extracted from this session
- [[Wiki/concepts/Projects-as-Scoping-Primitive]] — how Projects scope the data visible to Sequences + Shortlist
- [[Raw/docs/Beroz-RCO-Workflow-2026-04-17]] — user-facing recruiter workflow reference
- [[Efforts/ExcelTech-Automation/Overview]] — effort overview; milestone 5b now fully live
