---
type: wiki-digest
generated-by: claude
sources: ["[[Raw/docs/Beroz-Session-2026-04-26]]"]
date: 2026-04-26
updated: 2026-04-28
tags: [beroz, exceltech, sequences, email-tracking, deliverability, ui-pattern, phase4]
---

# Session Digest — Beroz Sequences Redesign + Row 3-dot Menu (2026-04-26)

**Two pushes in one session. Sequences moves from "list of emails sent" to a real engagement-tracking surface, and rows pick up Pin / Star / Clone / Archive.**

---

## Core argument

The Sequences feature had two structural gaps. First, it could send and log outreach but couldn't tell us anything about what happened next — no opens, no clicks, no bounces, no read on whether a reply was a yes or an out-of-office. Second, the row-level UX was too thin — there was no way to keep important sequences pinned, no way to clone a working template, and no clear archive path. This session closes both. A new tracking schema (pixel + click rewrite + bounce parse + Haiku-classified reply intent) backs an overview that finally answers "is this campaign working." A pin/star/clone/archive 3-dot menu makes the list usable when there are dozens of sequences. The frontend (overview + detail + editor) is rebuilt around the new metrics, with a 7/14/30-day chart on both pages and a Preview-and-test path so a recruiter can sanity-check a step before enrolling anyone. Status: shipped to the repo, end-to-end verification still pending — the verification plan in section 5 of the handoff doc has not yet been executed against a running stack.

---

## What shipped

### Engagement tracking — the trifecta

**Pixel + click rewrite for engagement.** Every send generates a `tracking_token` (uuid hex) saved on the `outreach_log` row. `_inject_tracking_pixel` appends a 1×1 transparent GIF pointing to `/track/open/<token>.gif`. `_rewrite_links_for_tracking` regex-walks every `<a href>` and rewrites to `/track/click/<token>?u=<original>`, skipping `mailto:`/`tel:`/already-tracked/unsubscribe links. The two route handlers (`track_open`, `track_click`) record events and, for clicks, 302 to the original URL.

**Bounce parsing — Mailer-Daemon never gets misclassified.** `_run_process_inbox` now runs a bounce branch *before* the candidate-reply branch. `_BOUNCE_SENDER_PATTERNS` + `_BOUNCE_SUBJECT_PATTERNS` + `_looks_like_bounce` triage the email; `_extract_bounced_recipient` pulls the address from the `Final-Recipient:` header; `_handle_bounce` flips the run to `bounced`. Without the ordering rule, a Mailer-Daemon bounce would have been read as a "no" reply and trigger the wrong follow-up.

**AI intent classification.** Replies that aren't bounces go through `_classify_reply_intent` — a Haiku 4.5 call that returns one of `interested | not_interested | out_of_office | other` with a confidence score. The classification is stamped on `sequence_runs.intent` + `intent_confidence`; "interested" ticks a counter that rolls up to the overview.

### Signatures + unsubscribe — compliance + per-recruiter voice

**Signature library.** New `user_signatures` table (per-user, with a partial unique index enforcing one default per user). CRUD wired through `/api/signatures` GET/POST/PUT/DELETE. Editor gets a Signature dropdown on every step. `sequence_steps.signature_id` references the chosen signature.

**Unsubscribe footer + suppression list.** `_build_unsubscribe_footer` adds a token-signed link (`UNSUBSCRIBE_SECRET` HMAC of `run_id:email`) to the email body before link rewriting (so the unsub link itself isn't tracked). `/unsubscribe` handler shows a confirm page; `POST /unsubscribe` writes the email to the global `email_unsubscribes` table and pauses every open run for that email. Pre-send guard at the top of `sequence_tick` checks `is_email_unsubscribed` — re-enrolling an unsubscribed email is silently skipped.

### UI redesign — overview, detail, editor

**Overview cards: Total / Active / Opened / Clicked / Replied / Interested.** Backed by `count_sequence_metrics()` which now returns the full nine-key bag. Schedule chart card with a 7/14/30-day period selector — lavender bars for sent, purple for scheduled, dashed today line, smart label spacing. Whole sequence rows are clickable; the row 3-dot button uses `data-stop="1"` so the menu doesn't bubble up as a row drilldown.

**Detail page: 7 stat cards** (Contacts / Active / Opened / Clicked / Replied / Interested / Bounced) + an embedded chart with its own period dropdown + table columns including a per-run "Opened ×N · Clicked ×M" engagement strip. `count_run_engagement(run_ids)` does the per-run rollup.

**Editor: Preview-and-test, signature picker, unsubscribe checkbox.** New `test_send_step` handler sends a `[TEST]`-prefixed email to the current user, no run/log/tracking — pure preview. Signature dropdown + Include-unsubscribe checkbox per step.

### Row 3-dot menu — Pin / Star / Edit / Clone / Archive

Schema additions: `sequences.is_pinned`, `is_starred`, `pinned_at` + a partial index on pinned. `list_sequences_for_user` now sorts pinned rows to the top by most-recent pin, the rest by `created_at desc`. `clone_sequence_row` deep-copies the sequence header + all steps (including `signature_id` and `include_unsubscribe`); cloned sequence is `status='draft'`, `source='clone'`, name `"<original> (copy)"`. Pin/star reuse the existing `PUT /api/sequences/<id>` route. Clone gets a new `POST /api/sequences/<id>/clone`.

Row name renders a small purple pin icon when pinned and an amber star when starred. The popover items are Pin/Unpin → Star/Unstar → Edit → Clone → separator → Archive (red).

---

## Tracking pipeline — at a glance

```
                     ┌─────────────────────────────────┐
                     │  sequence_tick (send branch)    │
                     └────────────────┬────────────────┘
                                      ↓
        is_email_unsubscribed? ──→ yes → mark `skipped`
                  ↓ no
        load step → append signature → append unsub footer
                  ↓
        rewrite <a href> → /track/click/<token>?u=…
                  ↓
        inject <img src=/track/open/<token>.gif>
                  ↓
        send via Microsoft Graph; outreach_log gets tracking_token

           ┌──────────────────────────────────────┐
           │  Recipient opens / clicks / replies  │
           └──────────────────────────────────────┘
                  ↓                  ↓                ↓
           track_open          track_click       _run_process_inbox
           (pixel hit)         (302 + record)         ↓
                  ↓                  ↓        bounce? → _handle_bounce
           insert opened       insert clicked    no →  _classify_reply_intent
           run_event           run_event             → set runs.intent
                                                    → tick "interested" counter
```

Every effect rolls up to `count_sequence_metrics` and `count_run_engagement`, which feed the overview cards, the embedded chart, and the per-row engagement strip.

---

## Key decisions

**Bounce branch runs before reply branch.** Order matters in `_run_process_inbox`. A Mailer-Daemon email looks structurally like a reply (it threads the same conversation), so checking bounce-sender / bounce-subject patterns *first* prevents misclassification.

**Pre-send unsubscribe guard, not just a quiet drop.** The check happens at the top of the `sequence_tick` try block before any Graph call; the run row is marked `skipped` so the suppression is auditable. Belt-and-braces with the per-step unsubscribe footer.

**Footer goes in before link rewrite.** Otherwise the unsub URL itself ends up wrapped in `/track/click/...` and the recipient's "unsubscribe me" click gets recorded as click engagement before they're suppressed. Subtle ordering bug avoided.

**Test-send is a separate path, not a flag on `sequence_tick`.** No log row, no run row, no tracking — `[TEST]` subject prefix only. Keeps test traffic out of the engagement metrics. The recruiter can preview without polluting the data.

**Pin/star are first-class columns + an index, not derived state.** `is_pinned` + `pinned_at` + partial index = pin-sorted lists are O(rows-with-pinned-true) rather than a scan. Tradeoff: each pin/unpin is a write, but those are rare.

**Clone = deep copy, status `draft`.** A cloned sequence carries every step (including `signature_id` and `include_unsubscribe`) but starts paused as a draft. No risk of an accidental re-send from the original's audience.

**Three-dot menu is overview-only this round.** Detail-page row menu deferred to a follow-up. Avoids fanning out a half-finished pattern across two surfaces.

---

## Relevance to Niksho

This is the milestone that makes Sequences a real outreach product, not a glorified send log. The full deliverability/engagement stack — pixel, click rewrite, bounce parse, AI intent — is the same skeleton any future Niksho outreach surface will need. SaaS customers will ask the same three questions ExcelTech recruiters now get answers to: *Is anyone reading these? Who's interested? Which addresses are dead?* The pattern is captured as a standalone concept — see [[Wiki/concepts/Email-Tracking-Trifecta]] — so the SaaS port can grep the Beroz code and match the shape, not reinvent the parts.

The 3-dot menu (Pin / Star / Clone / Archive) is the first list-row interaction in Beroz that goes beyond "click row to drill in." The `data-stop="1"` row-vs-menu separation is a small but reusable pattern worth applying to Shortlists, Submissions, and any other list view that grows past a dozen rows.

The signature library is the seed of per-recruiter voice — a hard-coded slot per recruiter today, but the same table can carry tone-tuned variants once the per-recruiter voice work in [[Efforts/ExcelTech-Automation/Overview]] (milestone 7) advances.

---

## Open follow-ups

- **End-to-end verification not yet run.** Section 5 of the handoff doc lists the ordered steps (apply migration → set env vars → send-and-track → unsubscribe → bounce → reply intent → signatures → row click → period dropdown). Until executed against a running stack, treat the feature as wired-up but unverified.
- **`PUBLIC_BASE_URL` and `UNSUBSCRIBE_SECRET` env vars** must be set on Railway before any send actually tracks correctly.
- **Detail-page 3-dot menu** — overview list only this round.
- **Backend filter on `is_starred`** so "Starred" can be a quick scope in the All-Owners dropdown — not yet wired.
- **Multi-tab `pinned_at` ordering** trusts server-side sort; no client-side reconciliation if a pin happens in another tab during a render.
- **Settings panel inside the editor** — still deferred from earlier rounds.
- **Bulk actions (multi-select rows)** — not in scope yet, will likely come with a Starred filter.

---

## See also

- [[Raw/docs/Beroz-Session-2026-04-26]] — full handoff doc with section 5 verification plan and exact code paths
- [[Wiki/concepts/Email-Tracking-Trifecta]] — the deliverability/engagement pattern extracted from this session
- [[Wiki/digests/Session-Beroz-Phase4-Phase5-2026-04-18]] — previous Sequences work (slide-over tab + sidebar redesign + scope switch)
- [[Wiki/concepts/Idempotent-Multi-Role-Handoff]] — companion pattern from the 04-18 session, also lives in Sequences code paths
- [[Atlas/Product/Agents]] — Outreach + Follow-up agents that read engagement signals
- [[Efforts/ExcelTech-Automation/Overview]] — milestone 7 (per-recruiter voice) is the natural successor to the signature library
