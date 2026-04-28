---
type: raw-session-note
generated-by: human
date: 2026-04-26
sessions:
  - "Validate harvestapi LinkedIn integration (commit dd0e4f1)"
  - "Sonnet 4 → Haiku 4.5 swap for candidate scoring (commit 5b6916b)"
---

# 2026-04-26

## Session: Validate harvestapi LinkedIn integration

**Goal:** finish the plan at `nimbalyst-local/plans/alright-let-s-plan-to-cosmic-creek.md` — prove the new harvestapi search + enrichment wiring works against the live Apify actors, not just in theory.

**What shipped (commit `dd0e4f1`, pushed to main):**
- Search-side normalizer: harvestapi puts `current_location` inside `location.linkedinText` (and nested `parsed.{text,city}`), not the `name/text/city` keys we'd guessed. Also `emails` comes back as a list of `{email, status, deliverable, qualityScore}` objects, not a scalar `email` field. Both fixed.
- Enrichment defaults: hit the actor's `inputSchema` and confirmed the `profileScraperMode` enum only accepts two values — `"Profile details no email ($4 per 1k)"` and `"Profile details + email search ($10 per 1k)"`. Our previous default `"Profile + email"` would have failed validation. Switched the default to the with-email tier (the whole point of enrichment is recovering emails; $0.05 per top-5 enrichment is fine).
- Enrichment body: dropped the `targetUrls`/`urls`/`maxItems` aliases that aren't in the schema; the actor only accepts `queries` (and a few alt URL fields).
- Enrichment email extractor: ranks the `emails[]` list by `status=valid + deliverable + qualityScore` instead of looking for a scalar that never existed.

**Live smoke results (real Apify spend, ~$0.16):**
- Search actor on "ServiceNow Developer / Bangalore" → 10 items, 9/10 are bullseye SN devs at Wipro / PwC / KPMG / Siemens / Alstom / Ensono / UST / Thermo Fisher / MSC. One outlier (Khammam, Telangana). Connections 200–7800, real headlines, 3–7+ years' experience.
- Enrichment actor on Bill Gates + Sandeep Singh → both returned deliverable emails (`bill.gates@gatesfoundation.org`, `sandeep.singh@pwc.com`).

**Frontend test (Railway) — blocked, not done:**
- Ran the boost on Railway. Sourcing card showed `Apollo + Internal DB` — i.e. **the Apify channel never fired** because `APIFY_TOKEN` isn't set in Railway's env vars (only ever set locally for the smoke tests).
- Pipeline then froze at Screener `80/134` for 10+ minutes. Anthropic balance is `$0.66` → almost certainly tier-1 rate limit kicking in, with the SDK doing silent exponential-backoff retries. `_call_claude` has no explicit timeout, so a queued request can hang indefinitely.

**Also shipped this session (commit `5b6916b`, pushed):** Sonnet 4 → Haiku 4.5 swap for all four candidate-scoring call sites in `core.py` (`_score_candidate_batch` + two legacy `source_and_screen` paths + `search-run-scoring`). JD parsing and web extraction deliberately stay on Sonnet — those are reasoning/extraction tasks. Updated `agents/screener.md` + `config/context_rules.md` to encode the new routing rule. Net effect: ~12× cheaper per screener batch and 2–3× faster, which directly addresses the hang's root cause (tier-1 RPM ceiling on Sonnet).

**Open items for next session (in order):**
1. Add `APIFY_TOKEN=APIFY_TOKEN_REDACTED` to Railway → Variables. (Optional: also `APIFY_LINKEDIN_ENRICH_MODE` to override the with-email default.) Verify Railway deploy is on `5b6916b` or later.
2. Top up Anthropic to ≥ $20 → tier-2 headroom. Even with the Haiku swap, $0.66 is one-or-two-boosts thin.
3. Defensive: add 60s timeout + 30s heartbeat to `_call_claude` so any future hang surfaces as an error instead of a frozen UI. ~10-line patch.
4. Deferred (decided not now): per-boost source-conversion analytics. Global per-source pass-rate via one SQL join answers the headline "is Apify worth keeping vs Apollo" question with no schema change. Per-boost junction table only earns its keep later if we want JD-type routing ("Apify wins for SN/India, Apollo wins for US sales").

**Surprise / non-obvious bit worth remembering:** the harvestapi search tier returns `emails: []` empty even on profiles where the enrichment tier later finds a deliverable email. Don't conflate "search returned no email" with "no email exists" — that's exactly what the separate `enrich_linkedin_with_apify` step is for, and it works.
