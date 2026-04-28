---
type: wiki-hot-cache
generated-by: claude
updated: 2026-04-28
max-words: 1000
---

# Wiki — Hot Cache

Small recency buffer. Rewritten by [[AIOS/skills/ingest-source]] whenever it runs. If you're an AI reading this first, this is the current state of what matters most.

---

## Right now — 2026-04-28

### Feature test complete: 15-item punch list for ExcelTech 🔴 action needed
Full feature walkthrough ran against the post-21-commit main branch (2026-04-27). Most features work. **Three items require immediate attention before any external demo:**

- **[Bug #5] Source Now passes a 5-word summary, not the full requirement** — discards JD + all intake fields, producing a JD score of 2/10 on a rich requirement. Fix: pass `requirement.job_description` + structured intake fields directly to the search.
- **[Bug #6] Find Similar / Job Description / Select Manually are the same component** — same input, same filters, same results, shared state across tab switches. Needs to be three distinct components.
- **[Bug #8] Apollo page-size too small** — 30 results for "Software Engineer + Bangalore" with no other filters. Raise to 100–200 and show full raw pool with match % column.

Full punch list: [[Wiki/digests/Session-Beroz-Feature-Test-2026-04-27]]. Raw log: [[Raw/docs/Beroz-Feature-Test-Log-2026-04-27]].

**Tier 3 email loop (features 19–24) still deferred** — requires enrolling `nikshostudios@gmail.com` in a live sequence and waiting for `sequence_tick`.

---

### 7-channel sourcing live on main (2026-04-25) ✅ — awaiting Railway deploy
Four commits shipped on April 25 expanded the agentic-boost pipeline from 4 to **7 sourcing channels**. Each is independently env-gated and failure-isolated.

```
Internal DB · Apollo · GitHub · Hugging Face · LinkedIn/Apify · YC/Apify · Web Agent
```

**⚠️ Pre-deploy blockers still open:**
1. **Supabase schema migration** for Phase 2 (`ALTER TABLE candidates ADD COLUMN IF NOT EXISTS has_email ...` — 6 columns + 2 indexes) must be run in the SQL Editor before Railway redeploy of commit `2a9bf84`
2. **`APIFY_TOKEN`** not set in Railway env vars — Apify channel never fires on Railway (only local). Add to Railway → Variables.
3. **Anthropic balance** was $0.66 on 2026-04-26 (caused screener hang at 80/134). Top up to ≥ $20 for tier-2 headroom.

Harvestapi normalizer was fixed on 2026-04-26 (commit `dd0e4f1`) — the April 25 Apify slice was broken against the real schema. Confirmed via $0.16 smoke test: 9/10 bullseye ServiceNow devs for "Bangalore" query.

---

### Haiku 4.5 now used for all candidate scoring (commit `5b6916b`) ✅
Sonnet 4 → Haiku 4.5 swap for four scoring call sites. JD parsing and web extraction stay on Sonnet. Net effect: ~12× cheaper per screener batch, 2–3× faster. Routing rule encoded in `agents/screener.md` + `config/context_rules.md`.

**Still open from April 26:** Add 60s timeout + 30s heartbeat to `_call_claude` (~10-line patch). Without it, any future rate-limit hang is invisible to the recruiter.

---

### Apollo India data confirmed good (2026-04-25) ✅
The April 25 audit: Apollo's India coverage is ~95.5% email, ~70% direct-phone — the failure was entirely in our pipeline (fabricated `current_location`, discarded quality flags, never called `/people/match`). Fixed in commit `2a9bf84`. See [[Wiki/concepts/Apollo-Pre-Reveal-Quality-Signals]].

---

### Full RCO lifecycle → LIVE (2026-04-18, carried) ✅
```
Requirement → Source → Shortlist → Sequence → Submit to TL → TL approves + sends to client
```
Commits `ed63940` + `717e523`. No schema changes needed. Still fully operational.

---

### Open blockers / follow-ups

| Priority | Item |
|---|---|
| 🔴 | Fix punch list items 5, 6, 8 before demo |
| 🔴 | Run Supabase schema migration for commit `2a9bf84` (6 columns + 2 indexes) |
| 🟠 | Add `APIFY_TOKEN` to Railway Variables |
| 🟠 | Top up Anthropic to ≥ $20 |
| 🟠 | Add 60s timeout + 30s heartbeat to `_call_claude` |
| 🟡 | Tier 3 email loop test (features 19–24) |
| 🟡 | Apollo paid plan upgrade ($49 Basic — code ready) |
| 🟡 | Foundit EDGE API key — still pending from Prayag |
| ⬜ | Full Searches post-query layout (waiting on second competitor screenshot from Nikhil) |
| ⬜ | `/api/search` project scoping — do NOT wire without Nikhil sign-off |
| ⬜ | Legacy `/page-outreach` — preserved but unlinked; retirement decision pending |

### Recently resolved
- ~~Apollo pipeline fabricating location data~~ — ✅ Fixed 2026-04-25, commit `2a9bf84`
- ~~Screener hanging on Sonnet at tier-1~~ — ✅ Fixed 2026-04-26, commit `5b6916b`
- ~~Harvestapi normalizer broken~~ — ✅ Fixed 2026-04-26, commit `dd0e4f1`
- ~~Submit-to-TL UI~~ — ✅ Shipped 2026-04-18, commits `ed63940` + `717e523`

### New to the vault today (2026-04-28)
- [[Wiki/digests/Session-Beroz-Apollo-MultiSource-2026-04-25]]
- [[Wiki/digests/Session-Beroz-Harvestapi-Haiku-2026-04-26]]
- [[Wiki/digests/Session-Beroz-Feature-Test-2026-04-27]]
- [[Wiki/concepts/Apollo-Pre-Reveal-Quality-Signals]]
- [[Wiki/concepts/Adaptive-Search-Progressive-Loosening]]
- [[Raw/docs/Beroz-Session-2026-04-25]]
- [[Raw/docs/Beroz-Session-2026-04-26]]
- [[Raw/docs/Beroz-Feature-Test-Log-2026-04-27]]
- [[Wiki/concepts/Candidate-Sourcing-Channels]] — updated to 7-channel table

### Guardrails for the AI reading this
- Do not edit anything in `Raw/`. It is sacred.
- Do not auto-send any email from any code path.
- Do not build or suggest LinkedIn *direct* scraping. Apify/harvestapi is the approved path — see [[Wiki/concepts/Candidate-Sourcing-Channels]] for the ToS risk note.
- Do not rewrite the Railway codebase for architectural purity. Extend in `/ai_agents/` or as new Flask routes.
- Do not wire `/api/search` to `state.activeProject` without Nikhil's sign-off.
- Always add `generated-by: <tool>` frontmatter to AI-authored files.

See [[mi]] for the full guardrail set.

---

_Updated 2026-04-28 — ingested Beroz-Session-2026-04-25 (Apollo audit + 5 gates + 7-channel expansion), Beroz-Session-2026-04-26 (harvestapi fix + Haiku swap), Beroz-Feature-Test-Log-2026-04-27 (feature test + 15-item punch list). Created Apollo-Pre-Reveal-Quality-Signals and Adaptive-Search-Progressive-Loosening concepts. Updated Candidate-Sourcing-Channels to 7-channel table. Previous (2026-04-18): Beroz-Session-2026-04-18 ingested; full RCO lifecycle live._
