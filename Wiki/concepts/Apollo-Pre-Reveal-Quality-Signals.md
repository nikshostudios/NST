---
type: wiki-concept
generated-by: claude
sources:
  - "[[Raw/docs/Beroz-Session-2026-04-25]]"
updated: 2026-04-28
tags: [apollo, sourcing, data-quality, enrichment, pipeline]
---

# Apollo Pre-Reveal Quality Signals

## What it is

Apollo's search-tier API (`/v1/mixed_people/api_search`) returns boolean quality flags on every result — without requiring a paid `/people/match` reveal call. These flags reliably predict whether enrichment will succeed:

| Flag | What it means | Measured fill rate (India, n=200) |
|---|---|---|
| `has_email` | Apollo has a verified email address for this person | ~95.5% True |
| `has_direct_phone` | Apollo has a direct-dial phone number | ~70% "Yes", ~30% "Maybe" |
| `has_city` / `has_state` / `has_country` | Location is known | ~100% True |
| `first_name` + `last_name_obfuscated` | Real name available (last name masked as `Ga***m`) | ~100% present |
| `last_refreshed_at` | ISO timestamp of last data refresh — staleness signal | ~100% present |

The *actual* values (`email`, `phone_numbers`, `linkedin_url`, `city`) are redacted at search tier. They only appear after calling `/people/match`, which costs credits.

## Why it matters

Most pipelines that use Apollo call `/people/match` on every candidate — spending credits blindly. The flags allow a two-phase approach:

```
Search (free) → inspect flags → decide who earns a reveal (costs credits)
```

This is especially important at tier-1 Apollo plans where credits are limited. A pipeline that ignores the flags and never calls `/people/match` ends up with zero emails in its database — even though Apollo knew 95%+ of the candidates were reachable.

**The failure mode to avoid:** storing only `apollo_person_id` + a synthetic name, never capturing the flags, never running enrichment. This was the Beroz pipeline state before April 25, 2026 — 147 India rows, 0% reachability in the DB.

## Application to Niksho / Beroz

The five pipeline gates shipped in commit `2a9bf84` operationalise this pattern:
1. **Capture flags at ingest** — `has_email`, `has_direct_phone`, `has_country`, `apollo_last_refreshed_at`, `first_name`, `last_name_obfuscated` are now stored as columns on the `candidates` table
2. **Drop unreachable rows at ingest** — skip any row where `has_email=False AND has_direct_phone="no"`
3. **Auto-reveal the top reachable** — `_auto_reveal_top_reachable()` calls `/people/match` for up to 5 budget-gated candidates per boost run
4. **Surface signals in the UI** — the flags make it possible to show recruiters "email available" before they spend a credit to reveal it

## Generalisation

This two-phase pattern (free quality signal → budget-gated enrichment) applies to any enrichment API that offers a cheaper "does this record have data?" check before a paid "give me the data" call. The key design rule: **never spend enrichment credits without first inspecting the signal that predicts success**.

## Related
- [[Wiki/concepts/Candidate-Sourcing-Channels]] — broader context on Apollo's role in the sourcing stack
- [[Wiki/concepts/Adaptive-Search-Progressive-Loosening]] — companion pattern for search-side quality
- [[Wiki/digests/Session-Beroz-Apollo-MultiSource-2026-04-25]] — the audit that surfaced this pattern
- [[Raw/docs/Beroz-Session-2026-04-25]]
- [[Efforts/ExcelTech-Automation/Overview]]
