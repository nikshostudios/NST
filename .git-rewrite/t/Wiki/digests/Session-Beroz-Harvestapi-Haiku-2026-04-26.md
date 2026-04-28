---
type: wiki-digest
generated-by: claude
sources:
  - "[[Raw/docs/Beroz-Session-2026-04-26]]"
date: 2026-04-26
updated: 2026-04-28
tags: [beroz, exceltech, apify, harvestapi, haiku, model-routing, sourcing]
---

# Digest — Beroz 26 April 2026 (Harvestapi Wiring + Haiku Model Swap)

## Core argument

Two commits on April 26 addressed separate but related problems: the harvestapi/Apify normalizer was broken against the real actor schema (field paths guessed wrong), and the screener was hanging because Sonnet 4 at tier-1 RPM can't handle batched scoring without queuing. Both are now fixed. The Apify channel is smoke-tested and live; the screener is ~12× cheaper and 2–3× faster per batch.

---

## Harvestapi wiring fix (commit `dd0e4f1`)

The April 25 Apify/LinkedIn slice was written against an assumed normalizer shape. Live smoke testing revealed two places where the guesses were wrong:

**Location field path:** harvestapi puts `current_location` inside `location.linkedinText` (and `location.parsed.{text,city}`), not the `name/text/city` top-level keys. Fixed.

**Emails field shape:** `emails` comes back as a list of objects `{email, status, deliverable, qualityScore}`, not a scalar. The enrichment email extractor now ranks the list by `status=valid + deliverable + qualityScore` rather than reading a field that never existed.

**Enrichment mode enum:** the `profileScraperMode` only accepts two exact strings:
- `"Profile details no email ($4 per 1k)"`
- `"Profile details + email search ($10 per 1k)"`

Our previous default `"Profile + email"` would have failed validation on every enrichment call. Switched to the with-email tier — at ~$0.05 per top-5 enrichment run, the cost is acceptable and email recovery is the entire point.

**Live smoke results (real Apify spend, ~$0.16):**
- Search "ServiceNow Developer / Bangalore" → 10 results, 9/10 bullseye SN devs at Wipro / PwC / KPMG / Siemens / Alstom / Ensono / UST / Thermo Fisher / MSC. Connections 200–7800, real job titles, 3–7+ years' experience.
- Enrichment on Bill Gates + Sandeep Singh → deliverable emails returned for both.

**⚠️ Non-obvious:** the harvestapi *search* tier returns `emails: []` even when the *enrichment* tier will later find a deliverable email. Never conflate "search returned no email" with "this person has no email" — enrichment is a separate, deliberate step that costs money and runs after scoring.

**Frontend test blocked:** APIFY_TOKEN not set in Railway env vars. The sourcing card showed `Apollo + Internal DB` — Apify never fired. Open item: add token to Railway → Variables.

---

## Haiku 4.5 model swap for scoring (commit `5b6916b`)

**Problem:** `_call_claude` has no explicit timeout. At Anthropic tier-1 RPM limits, a Sonnet 4 request from a batch of 134 candidates can queue indefinitely. The screener froze at `80/134` for 10+ minutes with $0.66 Anthropic balance.

**Fix:** Swap all four candidate-scoring call sites in `core.py` to Claude Haiku 4.5:
- `_score_candidate_batch`
- Two legacy `source_and_screen` paths
- `search-run-scoring`

**What stays on Sonnet:** JD parsing and web extraction — these are reasoning/extraction tasks where quality matters more than speed. The routing rule is now encoded in `agents/screener.md` + `config/context_rules.md`.

**Effect:** ~12× cheaper per screener batch, 2–3× faster. This directly raises the RPM ceiling for scoring, since Haiku has more generous tier-1 limits and costs far less per request.

**Remaining open items from this session:**
1. Add `APIFY_TOKEN` to Railway Variables → verify on `5b6916b` or later
2. Top up Anthropic to ≥ $20 for tier-2 headroom
3. Add 60s timeout + 30s heartbeat to `_call_claude` (~10-line patch) so future hangs surface as errors instead of frozen UI

---

## Relevance to Niksho

The harvestapi fix completes the Apify/LinkedIn channel that was theoretically shipped on April 25 but broken against the real schema. This is a common failure mode when normalizing third-party APIs from docs rather than live inspection — the pattern of running a cheap smoke test (~$0.16) against the real actor before trusting the normalizer is worth encoding as standard practice.

The Haiku swap is directly relevant to the [[Efforts/ExcelTech-Automation/Overview]] production stability goal. Sonnet at tier-1 with no timeout is a latent hang bug for any scoring job over ~30 candidates. The fix also reduces per-boost cost meaningfully, which matters given the $0.66 → $0 cliff that already triggered a freeze.

---

## See also
- [[Wiki/digests/Session-Beroz-Apollo-MultiSource-2026-04-25]] — previous day: Apollo audit + 5 gates + 7-channel expansion
- [[Wiki/digests/Session-Beroz-Feature-Test-2026-04-27]] — next day: full feature test walkthrough
- [[Wiki/concepts/Expert-In-The-Loop]] — the "live test, don't assume" philosophy in action
- [[Raw/docs/Beroz-Session-2026-04-26]]
- [[Efforts/ExcelTech-Automation/Overview]]
