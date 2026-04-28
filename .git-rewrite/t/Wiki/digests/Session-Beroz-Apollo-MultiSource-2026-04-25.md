---
type: wiki-digest
generated-by: claude
sources:
  - "[[Raw/docs/Beroz-Session-2026-04-25]]"
date: 2026-04-25
updated: 2026-04-28
tags: [beroz, exceltech, apollo, sourcing, multi-source, india, pipeline]
---

# Digest — Beroz 25 April 2026 (Apollo Audit + 5 Gates + 7-Channel Sourcing)

## Core argument

Three back-to-back sessions shipped the most significant sourcing infrastructure changes since launch. Session 1 established via hard data that Apollo's India coverage is genuinely good — the problem was entirely in our pipeline, which had been silently discarding Apollo's quality signals and fabricating location data. Sessions 2 and 3 fixed that and then expanded from a 4-channel to a **7-channel sourcing architecture**, eliminating single-vendor risk on the agentic-boost path.

---

## Session 1 — Apollo India audit: the pipeline was lying, not Apollo

The audit ran five SQL aggregations against the live `candidates` table (147 India/Apollo rows), then captured four fresh Apollo payloads via `/v1/mixed_people/api_search`.

**What the DB showed (before the fix):**
- 0% of rows had an email, phone, LinkedIn URL, or had ever been enriched
- 100% of `current_location` values were fabricated strings (`"India"` or `"Bangalore, India"`) stamped by `core.py:705-709` — Apollo never returned a real city
- Only `apollo_person_id` + a synthetic `<title> @ <org> (Apollo)` name were being stored

**What Apollo's raw payloads actually showed:**
- `has_email=True` on ~95.5% of the 200 India candidates sampled
- `has_direct_phone="Yes"` on ~70%, plus ~30% "Maybe" (via `/bulk_match`)
- `first_name`, `last_name_obfuscated`, `organization.name`, `last_refreshed_at` present on 100% of results
- Real Indian first names (Rajat, Shushant, Rahul, Divyanshu) — not US diaspora signal

**The key mismatch:** Apollo's search tier redacts the *actual* `email`, `phone`, `linkedin_url`, `city` values until you call `/people/match`. But it returns boolean quality flags (`has_email`, `has_direct_phone`, `has_city`) that are 100% present. Our pipeline was ignoring all of them and never calling `/people/match` for enrichment.

**`q_keywords` finding:** Including `q_keywords` AND `person_titles` in the same Apollo query killed result volume from 15,751 → 0. Apollo's `q_keywords` is AND-match — it filters the full pool. Already partially guarded in `sourcing.py:121-123`; needs to surface `total_entries` in prod logs to catch future zero-out cases.

---

## Session 2 — Five Apollo pipeline gates (commit `2a9bf84`)

Five concrete fixes shipped as one commit (+347/−43 across 3 files):

```
Phase 1: Stop fabricating current_location
  → Delete core.py:705-709 stamp; null is better than a lie
  → Nudge scorer to treat "Location: N/A" as neutral (not a penalty)

Phase 2: Capture pre-reveal quality flags
  → 6 new columns: has_email, has_direct_phone, has_country,
    apollo_last_refreshed_at, first_name, last_name_obfuscated
  → _normalize_apollo_people() maps them from raw Apollo payload
  ⚠️  Requires Supabase ALTER TABLE before Railway redeploy

Phase 3: Drop unreachable rows at ingest
  → Skip rows where has_email=False AND has_direct_phone="no"
  → Skip count surfaced in SSE summary as apollo_skipped_unreachable

Phase 4: Adaptive search (progressive loosening)
  → _apollo_search_raw() — low-level, no-raise on empty
  → source_apollo_structured_adaptive() — walks 5 loosenings:
    drop q_keywords → drop seniorities → trim titles to 1 → drop titles
  → Stops at first step reaching total_entries ≥ 50
  → Iteration log surfaced in SSE agent_done payload

Phase 5: Conservative auto-reveal (budget=5)
  → _auto_reveal_top_reachable() runs between scoring and enrichment
  → Pre-flight credit check: skip entire pass if email_credits < 5
  → Calls /people/match for top-5 reachable candidates only
  → Emits auto_reveal SSE event
```

The Supabase schema migration still needs manual application before this is live on Railway.

---

## Session 3 — Multi-source expansion: 4 channels → 7 (commits `345d5c4`, `52d5620`, `e597279`)

Slice A (GitHub) was already on main. Sessions B–D shipped in one day, one PR-sized commit each:

```
7-channel sourcing map (post April 25):
┌─────────────────────┬──────────────┬─────────────────────┐
│ Source              │ Auth         │ Badge               │
├─────────────────────┼──────────────┼─────────────────────┤
│ Internal DB         │ —            │ internal            │
│ Apollo              │ API key      │ apollo              │
│ GitHub              │ token (opt.) │ github              │
│ Hugging Face        │ none / token │ huggingface (orange)│
│ LinkedIn via Apify  │ APIFY_TOKEN  │ linkedin_apify      │
│ YC directory        │ APIFY_TOKEN  │ yc                  │
│ Web Agent           │ Brave/Serp   │ web_agent (indigo)  │
└─────────────────────┴──────────────┴─────────────────────┘
```

**Hugging Face (Slice B):** Searches `/api/models` per skill, dedupes authors, enriches top 30 via `/users/{name}/overview`. Public API, no auth needed. Gated on `HF_ENABLED` or `HF_TOKEN`. Upserts by name (HF never exposes email).

**Apify/LinkedIn + YC (Slice C):** `source_apify()` runs LinkedIn People Search always, and YC directory only for founder/early-stage keyword matches, in parallel via `asyncio.gather`. Each actor failure is swallowed independently. UI renders separate LinkedIn / YC badges (not a flat "apify"). Actor IDs are env-overridable. ⚠️ LinkedIn ToS risk remains — swap for Naukri actor if needed.

**Web Agent (Slice D):** The AI-native sourcing channel. Claude Haiku generates 3–5 Google queries → Brave Search (SerpAPI fallback) → bounded-concurrency httpx fetch (Sem=8, 5s/page, 8KB cap) → Claude Sonnet extraction. Hard 60s timeout. Skipped when `skills_required` is empty. Anthropic client called via `asyncio.to_thread` to stay async-safe.

**Cross-slice wiring pattern (established template for future sources):**
1. `source_<name>()` + `_normalize_<name>()` in `sourcing.py` + conditional append in `run_all_sources()`
2. `core.py` `_run_sourcing()`: add `<src>_enabled` env gate + `elif name == "<src>":` upsert branch + init `source_counts` key
3. Frontend: `labelMap` entry (both places) + `_sourceBadge` palette entry
No DB migration needed — `source_profile_url` / `source_metadata` from Slice A cover all channels.

---

## Workflow visualisation — adaptive search path

```
Apollo query submitted
        │
        ▼
total_entries ≥ 50? ──Yes──► proceed normally
        │ No
        ▼
Drop q_keywords → re-query
        │
total_entries ≥ 50? ──Yes──► proceed
        │ No
        ▼
Drop person_seniorities → re-query
        │
total_entries ≥ 50? ──Yes──► proceed
        │ No
        ▼
Trim person_titles to 1 → re-query
        │
total_entries ≥ 50? ──Yes──► proceed
        │ No
        ▼
Drop person_titles entirely → re-query
        │
Return whatever we have + iteration_log in SSE
```

---

## Relevance to Niksho

This is the most important backend day since the pipeline went live. The Apollo audit established that the data quality problem was ours, not Apollo's — critical for the [[Efforts/ExcelTech-Automation/Overview]] roadmap, which was stalled on the question of whether to invest more in Apollo or replace it. Answer: invest. The 7-channel architecture now provides genuine redundancy; the Web Agent channel is the first AI-native sourcing path and directly demonstrates the [[Wiki/concepts/Expert-In-The-Loop]] philosophy applied to data sourcing.

The pre-deploy schema migration for Phase 2 is still outstanding — this must be run in Supabase before the next Railway deploy.

---

## See also
- [[Wiki/concepts/Apollo-Pre-Reveal-Quality-Signals]] — the has_email / has_direct_phone gate pattern, extracted from this session
- [[Wiki/concepts/Adaptive-Search-Progressive-Loosening]] — the 5-step query broadening pattern, extracted from Phase 4
- [[Wiki/concepts/Candidate-Sourcing-Channels]] — updated to reflect 7-channel reality
- [[Wiki/digests/Session-Beroz-Harvestapi-Haiku-2026-04-26]] — next day: harvestapi wiring + Haiku swap
- [[Raw/docs/Beroz-Session-2026-04-25]]
- [[Efforts/ExcelTech-Automation/Overview]]
