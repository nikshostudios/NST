---
type: raw-session-note
generated-by: human
date: 2026-04-25
sessions:
  - "Apollo India data-quality audit (Phases A–C)"
  - "Apollo pipeline gates implementation (5 gates, commit 2a9bf84)"
  - "Multi-source sourcing expansion — HuggingFace, Apify, Web Agent (Slices B–D, commits 345d5c4, 52d5620, e597279)"
---

# 2026-04-25 — Apollo India audit (executed end-to-end)

## Session 1 — Apollo data-quality audit for India (Phases A–C complete)

- **Goal:** Decide if Apollo is the right data source for `market='IN'` before building more on top of it. Plan: `nimbalyst-local/plans/alright-so-honestly-this-quirky-eclipse.md`.
- **Did:** Phase A (5 SQL aggregations on the live `candidates` table), Phase B (4 fresh Apollo searches, raw payloads dumped to `~/Downloads/apollo_audit_2026-04-25_*.json`), Phase C (verdict below).
- **Headline:** Apollo's *underlying* data is good — ~95% of senior India candidates have an email, ~70% have a direct phone. Our pipeline throws all those signals away. Verdict: **🟢 Apollo is fine, just needs gates**.
- **Commits:** `9c6719e` — chore(apollo): save India data-quality audit SQL queries.

---

## Phase A — Historical fill-rate audit (results)

Source data: `candidates` where `market='IN' AND source='apollo'`. Computed in Python from `supabase.candidates.*` (147 rows total). Queries saved in `backend/ai_agents/data/audit_india_apollo.sql`.

### A1. Volume + recency
| total | last_30d | last_7d |
|---|---|---|
| 147 | 134 | 134 |

→ Almost all rows came in within the last week — they're fresh, not legacy. Audit is reading current pipeline behaviour, not stale data.

### A2. Reachability fill rates
| total | pct_with_email | pct_with_phone | pct_with_linkedin | pct_reveal_attempted |
|---|---|---|---|---|
| 147 | **0.0%** | **0.0%** | **0.0%** | **0.0%** |

→ **Zero candidates** in the table have any contact info, LinkedIn URL, or have ever been enriched. We're storing only `apollo_person_id` + a synthetic `"<title> @ <org> (Apollo)"` name.

### A3. Location distribution (top 20)
| current_location | n |
|---|---|
| `India` (literal placeholder) | 98 |
| `Bangalore, India` (literal placeholder) | 49 |

→ **100% of `current_location` values are fabricated** — exactly the two strings stamped at `core.py:705-709`. Apollo never returned a real city.

### A4. Top employers (top 25)
Most-frequent employers (count): Wipro 2 · Cognizant 2 · Grab 2 · Indium · Blend · Changepond Technologies · IBM · Aditya Birla Capital · Sony · Accion Labs · Bravery Infotech · Infosys · Valory · Pawp · Archipelago · Chetu · ProductSquads · EMPClaims · Accenture · Deqode · Zelis · Red Education · Tegain · DCV Global Recruitment · L&T Technology Services.

→ Distribution is extremely flat (almost no employer appears twice). Of the visibly-known names: India-HQ (Wipro, Cognizant, Infosys, Aditya Birla, L&T, Accenture-India) ~6; US-HQ tech with India presence (IBM, Sony, Pawp, Zelis, Chetu, Blend) ~6; SE-Asia/SG (Grab) 1. Roughly half/half — *not* a smoking gun on employer realism.

### A5. Duplicate density
| linkedin_url | dup_count |
|---|---|
| (none) | — |

→ Zero duplicate LinkedIn URLs because **0 rows have a LinkedIn URL at all**. Query is meaningless until reveals start running.

---

## Phase B — Fresh raw-payload capture (findings)

Four searches against `https://api.apollo.io/v1/mixed_people/api_search`, raw JSONs in `~/Downloads/apollo_audit_2026-04-25_*.json`. Each search returns `per_page: 50` from a much larger pool.

| Variant | Filters | total_entries | returned |
|---|---|---|---|
| jd1 (original) | titles + `q_keywords="fraud"` + senior+head+director seniority | **0** | 0 |
| jd1 v2 | titles + senior+head+director (no kw) | 2,249 | 50 |
| jd1 v3 | titles (no kw, no seniority) | 15,751 | 50 |
| jd1 v4 | one loose title `["Machine Learning Engineer"]` | 15,733 | 50 |
| jd2 | senior backend titles + Bangalore | 192 | 50 |

→ **q_keywords killed the result set 15,751 → 0.** Apollo's `q_keywords` is AND-match (already documented in `sourcing.py:118-123`). The original Staff ML/Fraud audit JD from 2026-04-24 is the same shape — including the kw was likely the cause of yesterday's tiny result + 80% no-phone outcome. Production code already drops kw when titles are present, so this only burns when both are sent together.

### Fields Apollo actually returns on search-tier (per-person)

Per-person keys present on **every** result (sample n=50, JD2):
- `id`, `first_name`, `title`, `last_name_obfuscated` (e.g. `Ga***m`), `last_refreshed_at`, `organization` (with `name` + a parallel `has_*` flag set for the org)
- **`has_email`** (bool), **`has_direct_phone`** ("Yes" / "Maybe: please request direct dial via people/bulk_match"), **`has_city`**, **`has_state`**, **`has_country`** (all bool/string)

Across the four searches (n=200 candidates aggregated):

| Apollo field | Present? | Avg value across 200 results | Used today? |
|---|---|---|---|
| `first_name` | 100% | (real first names — Rajat, Shushant, Rahul, Divyanshu…) | No |
| `last_name_obfuscated` | ~98% | obfuscated last name (`Ga***m`) | No |
| `title` | 100% | full title | **Yes** (stored) |
| `organization.name` | 100% | full employer | **Yes** (stored) |
| `last_refreshed_at` | 100% | ISO timestamp (e.g. `2026-03-06`) — staleness signal | No |
| `has_email` | 100% (flag exists) | **~95.5% = True** (191/200) | No |
| `has_direct_phone` | 100% (flag exists) | **~70% = "Yes"**, ~30% = "Maybe (need bulk_match)", 0% definitive No | No |
| `has_country` | 100% | 100% True | No |
| `has_city` / `has_state` | 100% | 100% True | No |
| `email_status` | 0% | redacted on search-tier | No |
| `extrapolated_email_confidence` | 0% | redacted on search-tier | No |
| `phone_numbers` | 0% | redacted on search-tier | No |
| `linkedin_url` | 0% | redacted on search-tier | No |
| `country` / `city` / `state` (actual values) | 0% | redacted on search-tier | No |

Eyeball check (real first names returned):
- jd2 (Sr Backend BLR): Rajat / Shushant / Manish / Aditya / Shreyans — **genuinely Indian-market first names.**
- jd1 v3 (Sr ML, India, no kw): Rahul / Divyanshu / Shushant — same. No US-diaspora signal in the names sampled.

---

## Phase C — Verdict + decision matrix

| Criterion | Threshold | Measured | Pass / Fail |
|---|---|---|---|
| Email reachability (Apollo's own claim) | ≥ 60% have email | **~95.5% `has_email=True`** | ✅ Pass |
| Phone reachability (Apollo's own claim) | ≥ 30% have phone | **~70% `has_direct_phone="Yes"`** (+30% "Maybe") | ✅ Pass |
| Email reachability (in our DB) | ≥ 60% have stored email | **0%** (we never store) | ❌ Fail (our pipeline) |
| Phone reachability (in our DB) | ≥ 30% have stored phone | **0%** (we never store) | ❌ Fail (our pipeline) |
| Location verifiability | < 20% rows show literal `India`/`Bangalore, India` as `current_location` | **100%** are literal placeholders | ❌ Fail (`core.py:705-709` fabrication) |
| Employer realism | ≥ 10 of top-25 employers are India-HQ | ~6 India-HQ / ~6 US-HQ tech / mixed long tail | ⚠️ Marginal |
| Available quality signals | Apollo returns `email_status` and `country` per-person | **Search tier only returns `has_email` / `has_direct_phone` / `has_country` boolean flags** — actual values redacted until `/people/match` | ✅ Useful (different fields than expected, but exist) |

**Verdict: 🟢 Apollo is fine, just needs gates.**

One-line rationale: Apollo's underlying India data is healthy (~95% email coverage, ~70% direct-phone, 100% country known) — the failure is entirely in our pipeline, which discards all of Apollo's pre-reveal quality flags, fabricates `current_location`, and never auto-triggers `/people/match` so `email`/`phone` columns sit empty.

### Five concrete gates for the next plan
1. **Stop fabricating `current_location`.** Remove or env-gate the stamp at `core.py:705-709`. If location is missing, leave it null; trust Apollo's `has_country=True` flag instead.
2. **Capture Apollo's pre-reveal quality flags** into the `candidates` row (new columns or JSON blob): `has_email`, `has_direct_phone`, `has_city`, `last_refreshed_at`, `first_name`, `last_name_obfuscated`. Update `_normalize_apollo_people` (`sourcing.py:48-84`).
3. **Drop ingest of rows where `has_email=False AND has_direct_phone="No"`.** None of the 200 we just sampled met this, so the gate is conservative — but it's the cheapest filter for the few unreachable ones.
4. **Auto-trigger `/people/match` reveal** for any candidate where `has_email=True` OR `has_direct_phone="Yes"`, on a budget (e.g., top-N per JD, scored by skills overlap). This is the only way to populate the `email`/`phone` columns the UI is waiting for.
5. **Hard-cap `q_keywords` to the ones that don't tank `total_entries`.** Already partially in place at `sourcing.py:121-123` — extend to log `total_entries` so future audits catch the kw-zeros-out-results case in production.

### Done-criteria (from plan §Verification)
1. % of Indian Apollo candidates **stored** with an email — **0%** (147/147 missing); per Apollo's own `has_email` flag the *true* number is ~95%.
2. % with a phone (no reveal) — **0%** stored; ~70% definitive `has_direct_phone="Yes"` per Apollo (+30% "Maybe").
3. Top `current_location` value + % literally `"India"` — **`India` itself, 66.7% (98/147)**; the other 33.3% is `Bangalore, India` — **100% are placeholder strings stamped by our code, not Apollo data**.
4. 5 unused Apollo fields with fill rates — `has_email` (100% / 95.5% True), `has_direct_phone` (100% / 70% Yes), `has_country` (100% / 100% True), `last_refreshed_at` (100% present), `first_name` + `last_name_obfuscated` (100% present).
5. Verdict color + one-line rationale — **🟢 Apollo is fine, just needs gates.** Apollo returns useful pre-reveal quality signals; we discard all of them and never enrich.

---

## Session 2 — Apollo pipeline gates implemented (Phases 1–5 shipped)

- **Goal:** Implement plan `nimbalyst-local/plans/wait-so-you-re-telling-delightful-harp.md` end-to-end — turn the five audit gates above into shipping code.
- **Did:**
  - **Phase 1 — stopped fabrication.** Deleted the `current_location = location or region_default` stamp from both Apollo paths (`core.py` legacy `run_search` and `launch_agentic_boost_stream`). Kept the `<title> @ <employer> (Apollo)` placeholder name (factually descriptive, not fabrication). Nudged the scorer prompt to treat `Location: N/A` as neutral so Apollo rows aren't penalised out of the result set.
  - **Phase 2 — captured pre-reveal signals.** Schema adds 6 columns + 2 indexes (`has_email`, `has_direct_phone`, `has_country`, `apollo_last_refreshed_at`, `first_name`, `last_name_obfuscated`). `_normalize_apollo_people` now maps them straight off the search payload. **Schema must be applied to live Supabase via the SQL Editor before this ships.**
  - **Phase 3 — drop unreachable at ingest.** Both Apollo upsert blocks early-skip rows where `has_email=False AND has_direct_phone in ("", "no")`. Skip count surfaces in the agentic-boost SSE summary as `apollo_skipped_unreachable`.
  - **Phase 4 — adaptive search.** Split `source_apollo_structured` into low-level `_apollo_search_raw` (no raise on empty) + back-compat thin wrapper. New `source_apollo_structured_adaptive` walks 5 progressive loosenings (drop `q_keywords` → drop `person_seniorities` → trim `person_titles` to 1 → drop `person_titles`) and stops at the first step with `total_entries ≥ min_total` (default 50). Returns `(candidates, iteration_log)`. Agentic-boost calls the adaptive variant; iterations surface in the SSE `agent_done` payload.
  - **Phase 5 — conservative auto-reveal (budget=5).** New `_auto_reveal_top_reachable` runs between scoring and enrichment. Pre-flight credit check skips the whole pass if `email_credits < 5` (avoids 402-on-Nth-call partial-state). Filters score-ordered top to Apollo rows Apollo flagged reachable, calls `/people/match` for up to 5, persists sync name/email patches, routes phone via the existing `pending_phone_reveals` webhook. Emits a new `agent_done` SSE event named `auto_reveal`.
- **Commit:** `2a9bf84` — `fix(apollo): stop fabricating location, capture pre-reveal signals, adaptive search, auto-reveal` (3 files, +347/−43). Pushed to `main`.
- **Pre-deploy step still needed:** run the Phase 2 `alter table candidates add column if not exists ...` block in Supabase SQL Editor before redeploying — Railway will accept the new fields immediately once the columns exist.
- **Phase D — post-fix audit:** to be appended after the next live agentic-boost run on the Sr Backend Bangalore JD; expected non-zero `has_email`/`has_direct_phone` fill rates and a non-fabricated `current_location` distribution per the plan's Verification §6.

---

## Session 3 — Multi-source sourcing expansion (Slices B–D shipped)

- **Goal:** Implement plan `nimbalyst-local/plans/right-i-m-planning-on-staged-deer.md` slices B → C → D end-to-end (Slice A — GitHub — was already on main as `b6d7c9e`). Eliminate Apollo single-vendor risk on the agentic-boost path.
- **Did, in order, one PR-sized commit each (no bundling):**
  - **Slice B — Hugging Face** (`345d5c4`). New `source_huggingface()` + `_normalize_hf_users()` in `sourcing.py`: search `/api/models` per skill, dedupe authors, enrich top 30 via `/users/{name}/overview`. Public API (no auth required); gated on `HF_ENABLED` *or* `HF_TOKEN` so it doesn't fire on every requirement just because some other code happened to set the token. `_run_sourcing()` branch upserts by name (HF never exposes email). Frontend: `huggingface` label + HF-orange badge.
  - **Slice C — Apify** (`52d5620`). `source_apify()` runs LinkedIn People Search (always) and YC directory (only when `role_title` matches founder/early-stage/first-hire keywords) in parallel via `asyncio.gather`. Sub-actor wrapper `_apify_run_actor()` swallows non-2xx so a single failed actor doesn't kill the source. Two normalizers emit `source="linkedin_apify"` and `source="yc"`; the upsert branch attributes the count to the right sub-source by reading `cand["source"]`, so the UI renders LinkedIn / YC as separate badges instead of a flat "apify". Actor IDs default to popular community actors (`curious_coder/linkedin-search-scraper`, `michael.g/y-conductor-scraper`) and are swappable via `APIFY_LINKEDIN_ACTOR_ID` / `APIFY_YC_ACTOR_ID` env vars. **Risk callout (carried over from plan):** LinkedIn ToS forbids automated scraping; Apify mitigates the technical risk but not the legal one — swap for the Naukri actor if uncomfortable.
  - **Slice D — Web-search agent** (`e597279`). The AI-native angle: Claude Haiku generates 3–5 Google-style queries → Brave Search (fallback SerpAPI per-query) → bounded-concurrency httpx fetch (Sem=8, 5s/page, 8KB cap) → Claude Sonnet extraction. Hard 60s `asyncio.wait_for` around the whole pipeline; caps on queries (5), pages (30), candidates (30). Anthropic client called via `asyncio.to_thread` so the rest of `sourcing.py` stays purely async. Skipped entirely when `skills_required` is empty. Frontend: `web_agent` label + indigo badge.
- **Cross-slice wiring pattern (mirrors Slice A lessons exactly):** for each new source, three edits — (1) `source_<name>()` + `_normalize_<name>()` in `sourcing.py` and a conditional `tasks.append` in `run_all_sources()`; (2) in `core.py` `_run_sourcing()` add a `<src>_enabled` env gate, append the coro, add an `elif name == "<src>":` upsert branch, init the `source_counts` key; (3) frontend `labelMap` (in *both* spots — sourcing-card desc and pipeline-error alert) + `_sourceBadge` palette. No DB migration needed — the `source_profile_url` / `source_metadata` columns added in Slice A cover all four slices.
- **Commits:** `345d5c4` (HF, +181/−5) · `52d5620` (Apify, +278/−11) · `e597279` (Web Agent, +307/−5). All pushed to `main`.
- **Verification:** plan's per-slice smoke tests are user-driven (need to flip env vars and trigger a live boost). All three slices syntax-check clean and follow the GitHub template Slice A established. Net surface: agentic-boost now has **7 sourcing channels** (Internal DB, Apollo, GitHub, Hugging Face, LinkedIn-via-Apify, YC-via-Apify, Web Agent), each independently env-gated and failure-isolated.
