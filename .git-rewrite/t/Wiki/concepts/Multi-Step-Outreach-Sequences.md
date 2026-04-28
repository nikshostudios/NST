---
type: wiki-concept
generated-by: claude
sources:
  - "[[Raw/docs/Beroz-Session-2026-04-19]]"
updated: 2026-04-19
tags: [sequences, outreach, architecture, saas, email-automation]
---

# Multi-Step Outreach Sequences

## What it is

A multi-step outreach sequence is an automated, event-driven drip campaign for a single contact — a sequence of emails sent at defined intervals, where any reply halts further sends. The architecture consists of five database tables forming a clear separation between the template (what to send and when) and the execution (who received what, and what happened):

```
sequences                          ← the template: name, goal, owner
  └── sequence_steps               ← ordered steps (subject, body, delay_days, position)
        └── sequence_runs          ← one execution per enrolled contact
              ├── sequence_step_sends   ← one record per step attempted per run
              └── sequence_run_events  ← reply detected → status = 'replied', run halted
outreach_log                       ← backlinked: all sends appear here too
```

The key design choices:
- **Step 1 sends immediately** on enrolment; Steps 2+ are staggered by a configurable delay (default 2 minutes in the Beroz implementation, easily extended to days).
- **Reply detection halts the run.** The inbox scan (already running every 15 min via APScheduler) sets `sequence_runs.status = 'replied'` and stops further step sends.
- **SSE streaming** for AI-drafted step content — Claude generates subject + body per step, streamed token-by-token to the frontend. The recruiter reviews and edits before saving.
- **Per-contact editable preview** before final send — "Add Contacts" page shows each recipient's personalised email (variable chips filled in) so the human approves the copy, not just the template.

## Why it matters

Single-email outreach has poor reply rates. Multi-step sequences (often called "cadences" or "drip campaigns") dramatically increase the chance of a response by following up automatically without the recruiter having to remember. This is the core value of tools like Outreach.io and Apollo Sequences. The event-sourced design (separate tables for runs, step_sends, and events) means the full history of every send and reply is queryable — enabling reply-rate analytics, A/B testing across templates, and auditing without destructive updates.

## Relevance to Niksho

Beroz implemented this for ExcelTech recruiters (commit `f258bed`, April 2026). The 5-table schema is clean enough to port directly into the Niksho SaaS product when outreach automation becomes a product feature — it's already multi-tenant friendly (sequences belong to a `created_by` user). The reply-detection halting logic should be preserved as-is: recruiters don't want to spam a candidate who already replied. See [[Efforts/ExcelTech-Automation/Overview]] for the decision record and [[Efforts/Niksho-SaaS-Product/Overview]] for where this pattern lands in the SaaS build.

## Related
- [[Wiki/digests/Session-Beroz-Sequences-DB-Cleanup-2026-04-19]] — the session where this was built
- [[Wiki/digests/Session-Beroz-Phase4-Phase5-2026-04-18]] — Phase 4 Sequences wiring (slide-over, Sequences page, Activity timeline)
- [[Wiki/concepts/Idempotent-Multi-Role-Handoff]] — adjacent pattern: the submit-gate that feeds into TL approval after sequences are done
- [[Wiki/concepts/Personal-Inbox-Outreach-Tracking]] — the browser-extension alternative for personal-email outreach logging
- [[Efforts/ExcelTech-Automation/Overview]]
- [[Efforts/Niksho-SaaS-Product/Overview]]
