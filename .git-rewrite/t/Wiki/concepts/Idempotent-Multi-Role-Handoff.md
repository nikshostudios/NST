---
type: wiki-concept
generated-by: claude
sources: ["[[Raw/docs/Beroz-Session-2026-04-18]]"]
updated: 2026-04-18
tags: [workflow, multi-role, approval, idempotency, ui-pattern]
---

# Idempotent Multi-Role Handoff

## What it is

A three-layer pattern for preventing double-submission and propagating state in multi-role approval workflows:

1. **Backend deduplication** — a unique constraint (or equivalent check) on the handoff record causes the server to return 409 Conflict on any duplicate submission. The initiating role's endpoint validates the pair (e.g. candidate + requirement) before inserting.

2. **Frontend pre-check** — the UI loads existing handoff records alongside the entity being acted on. The action button is never shown (or is shown disabled) when a prior handoff record already exists for this (entity, context) pair. The frontend does not rely on the 409 to know the state — it reads state directly from data.

3. **Status propagation chain** — the handoff status (e.g. `submitted → approved → sent`) is surfaced on every surface that references the entity: cards in list views, chips in slide-overs/detail panels, buttons that served as the entry point. No secondary lookup needed; the status is embedded in the data already returned by the detail endpoint.

```
Recruiter submits candidate for Requirement A
       ↓
  Backend check: submissions row for (candidate, Requirement A)?
       ↓ Yes → 409 Conflict          ↓ No → INSERT, flip candidate.status
  [Frontend shows disabled button]   [Frontend shows "Submitted" chip]
                                          ↓
                               TL approves → status = "tl_approved"
                                          ↓
                               Client send → status = "sent_to_client"
                                          ↓
                      [Chip on shortlist card / slide-over / source card
                       reflects current status without any extra fetch]
```

## Why it matters

Multi-role workflows where one role initiates a handoff to another create two failure modes: accidental duplicate submissions (two recruiters submit the same candidate for the same role), and stale UI state (a user sees an "action available" button for something already done). Solving both at once — backend gate + frontend pre-read + propagation — means the UI is never misleading and the backend never accumulates duplicate records.

The "no new endpoint for status" constraint matters: if status propagation required a separate polling call, the complexity compounds quickly. Embedding submissions alongside the entity detail is the simpler path.

## Relevance to Niksho

First implemented in Beroz's Submit-to-TL feature (commit `ed63940`, 2026-04-18). Applied to the (candidate, requirement) pair in the recruiter→TL handoff.

The same skeleton should apply to any future multi-role approval step in the SaaS product — e.g. a client approval step, a quality-review queue, or any escalation path between roles. Before adding a new approval flow, check:
- Is there a unique constraint on the (entity, context) pair?
- Does the detail endpoint already return the relevant approval records?
- Does every surface that references the entity show the current approval state?

If yes to all three, the pattern is correctly applied.

## Related

- [[Wiki/digests/Session-Beroz-Phase4-Phase5-2026-04-18]] — session where this was first implemented
- [[Wiki/concepts/Projects-as-Scoping-Primitive]] — related concept: Projects as the scoping layer that determines which (entity, context) pairs are visible to which users
- [[Efforts/ExcelTech-Automation/Overview]] — the effort where this pattern lives in production
