---
type: wiki-concept
generated-by: claude
sources: ["[[Raw/docs/Beroz-Session-2026-04-26]]"]
updated: 2026-04-28
tags: [email, tracking, deliverability, ai-classification, outreach, ui-pattern]
---

# Email-Tracking Trifecta

## What it is

A four-part pattern for turning a one-way "send and forget" outreach pipeline into a real engagement-tracking surface, while keeping deliverability honest. The four parts work together — drop any one and the others lie to you.

1. **Tracking pixel** — every send generates a unique `tracking_token` (uuid hex), saved on the outreach log row. A 1×1 transparent GIF pointing at `/track/open/<token>.gif` is injected into the email body. The route handler records an `opened` event when the pixel is fetched. (Imperfect — image-blocking clients suppress the pixel — but a useful directional signal.)

2. **Click rewriting** — every `<a href>` in the body is regex-walked and rewritten to `/track/click/<token>?u=<encoded original URL>`. Skip rules: `mailto:`/`tel:`/already-tracked URLs/the unsubscribe link itself. The route handler records a `clicked` event and 302s to the original destination. Click events are higher-fidelity than opens because clients can't suppress redirects.

3. **Bounce parsing** — inbox processing checks each incoming email for bounce signatures *before* checking for candidate replies: sender patterns (Mailer-Daemon, postmaster, etc.), subject patterns ("Undeliverable", "Delivery Status Notification"), header patterns (`Final-Recipient:` regex). Order matters — a bounce email is structurally a reply (same threading), so without the bounce-first ordering it would be misread as a "no" reply and trigger the wrong follow-up.

4. **AI intent classification** — non-bounce replies go through a fast classifier (Haiku 4.5 in this implementation) that returns one of `interested | not_interested | out_of_office | other` plus a confidence score. The classification is stamped on the run row and rolls up to "Interested" counters in the UI. Cheap enough to run on every reply; lets the recruiter triage the inbox at a glance.

```
Send branch                                  Receive branch
─────────────────                           ────────────────────
generate token                              incoming email arrives
  ↓                                                  ↓
inject pixel                                 looks like bounce?
  ↓                                          (sender + subject + header patterns)
rewrite <a href>                                   ↓ yes
  ↓                                          extract Final-Recipient
send via provider                            mark run as bounced
  ↓                                                  ↓ no
log row gets token                           classify intent (LLM)
                                                     ↓
                                             interested | not_interested |
                                             out_of_office | other
                                                     ↓
                                             stamp run.intent + confidence
                                             tick the right counter
```

## Why it matters

The naive version of an outreach product gives you "messages sent." That's a vanity metric. To make outreach decisions — kill an underperforming step, double down on a winning template, retire a dead email address — you need answers to three questions that the trifecta provides:

- *Is anyone reading these?* — opens (directional) and clicks (high-fidelity)
- *Who's interested?* — AI intent on replies, surfaced as a counter
- *Which addresses are dead?* — bounce parsing, suppressed automatically

Why all four parts and not just three: the bounce branch alone protects the data quality of the reply branch. If bounces leak through as "replies," intent classification gets confused and the "interested" counter gets contaminated. If reply intent is missing, opens and clicks tell you who engaged but not who *wants to talk*. Pick all four or live with a metrics surface you can't trust.

### Two ordering rules that are easy to miss

- **Bounce branch must run before the reply branch.** Otherwise Mailer-Daemon emails get classified as replies. Cheap to get right at design time; expensive to debug later.
- **Unsubscribe footer must be appended *before* link rewriting.** Otherwise the unsub URL itself gets wrapped in `/track/click/...` — the recipient's "remove me" click gets recorded as click engagement before they're suppressed. Subtle but real.

## Relevance to Niksho

First implemented in Beroz's Sequences redesign on 2026-04-26 (see [[Raw/docs/Beroz-Session-2026-04-26]]). Lives in `backend/ai_agents/core.py` (`_inject_tracking_pixel`, `_rewrite_links_for_tracking`, `_run_process_inbox` bounce branch, `_classify_reply_intent`) plus three new public route handlers in `backend/app.py` (`track_open`, `track_click`, `unsubscribe`).

For the SaaS port (see [[Efforts/Niksho-SaaS-Product/Overview]]), this is the load-bearing pattern for any outreach surface — agency outreach, internal HR talent pipelines, candidate nurture sequences. Before adding a new send path, check:

- Is there a unique token per send, recorded on the log row?
- Does the body get pixel-injected and link-rewritten before send?
- Does the inbox processor check bounces *before* classifying replies?
- Is reply intent stamped on the run, with a confidence score?

If yes to all four, the trifecta is correctly applied.

Adjacent concepts worth carrying alongside this one: a per-user signature library (compliance-shaped + voice-shaped), a global suppression list with token-signed unsubscribe (compliance), and `[TEST]`-prefixed preview sends that bypass logging entirely (so test traffic doesn't pollute engagement metrics). The 04-26 session shipped all three.

## Tradeoffs and limits

- **Pixel opens are noisy.** Image-blocking + preview-pane fetches both distort the signal. Treat opens as directional, clicks as authoritative.
- **Click rewriting changes the URL the user sees on hover.** Some recipients are spam-trained to hover; a tracking-domain URL can look phishy. Mitigation: use a custom subdomain on the same root domain as the sender.
- **AI intent classification is fast but not perfect.** Edge cases ("sounds great but not yet") need human review. Pair with a confidence threshold for auto-routing vs flagging for triage.
- **Bounce patterns are provider-specific.** The patterns in this implementation cover common providers; new senders need new patterns. Keep `_BOUNCE_SENDER_PATTERNS` and `_BOUNCE_SUBJECT_PATTERNS` curated.

## Related

- [[Wiki/digests/Session-Beroz-Sequences-Redesign-2026-04-26]] — session where this was first implemented
- [[Wiki/concepts/Idempotent-Multi-Role-Handoff]] — companion pattern in the same Sequences code paths
- [[Atlas/Product/Agents]] — Outreach + Follow-up agents now consume engagement signals
- [[Efforts/ExcelTech-Automation/Overview]] — the effort where this pattern lives in production
- [[Efforts/Niksho-SaaS-Product/Overview]] — the SaaS port that will reuse the trifecta
