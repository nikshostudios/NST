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

### Feature test complete: 15-item punch list 🔴 action needed before demo
Full walkthrough ran against post-21-commit main (2026-04-27). Three items are blockers for any external demo:

- **[Bug #5] Source Now passes a 5-word summary, not the full requirement** — fix: pass `requirement.job_description` + structured intake fields directly to the search.
- **[Bug #6] Find Similar / Job Description / Select Manually are the same component** — needs to be three distinct components with different behaviour.
- **[Bug #8] Apollo page-size too small** — 30 results for "Software Engineer + Bangalore" with no filters. Raise to 100–200, show full raw pool with match % column.

Full punch list: [[Wiki/digests/Session-Beroz-Feature-Test-2026-04-27]] · [[Raw/docs/Beroz-Feature-Test-Log-2026-04-27]]. Tier 3 email loop (features 19–24) still deferred.

---

### Sequences redesign + row 3-dot menu → SHIPPED to repo ⚠️ verification pending
Two pushes on 2026-04-26 (Session A). Sequences moves from "list of emails sent" to a real engagement-tracking surface. **Code is in the repo. End-to-end verification (section 5 of the handoff doc) has not yet been run against a running stack.**

**The engagement trifecta (all four needed for honest metrics):**
1. **Pixel** — `tracking_token` on `outreach_log`; 1×1 GIF at `/track/open/<token>.gif`.
2. **Click rewrite** — every `<a href>` rewritten to `/track/click/<token>?u=<orig>`, skips mailto/tel/unsub.
3. **Bounce parse** — `_run_process_inbox` checks bounce patterns *before* the reply branch (order matters).
4. **AI intent (Haiku)** — non-bounce replies → `interested|not_interested|out_of_office|other` + confidence on `sequence_runs.intent`.

Pattern extracted as [[Wiki/concepts/Email-Tracking-Trifecta]].

**Adjacent shipped:** Signatures library, unsubscribe flow (HMAC-signed footer, global suppression list), test-send (no tracking), UI rebuild (overview/detail/editor), row 3-dot menu (Pin/Star/Clone/Archive). **Full details:** [[Wiki/digests/Session-Beroz-Sequences-Redesign-2026-04-26]] · [[Raw/docs/Beroz-Session-2026-04-26]]

**Before relying on this in production:** apply migration (`apply_schema.py sequence_tracking.sql`), set `PUBLIC_BASE_URL` and `UNSUBSCRIBE_SECRET` env vars on Railway, then walk section 5 of the handoff doc.

---

### 7-channel sourcing live on main (2026-04-25) ✅ — awaiting Railway deploy
```
Internal DB · Apollo · GitHub · Hugging Face · LinkedIn/Apify · YC/Apify · Web Agent
```

**⚠️ Pre-deploy blockers:**
1. **Supabase schema migration** — 6 new columns + 2 indexes (commit `2a9bf84`) must be applied in SQL Editor before Railway redeploy
2. **`APIFY_TOKEN`** not set in Railway env vars — Apify channel never fires on Railway
3. **Anthropic balance** — top up to ≥ $20 for tier-2 headroom

Harvestapi normalizer fixed 2026-04-26 (commit `dd0e4f1`) — confirmed via $0.16 smoke test: 9/10 bullseye ServiceNow devs for Bangalore query.

---

### Haiku 4.5 for all candidate scoring (commit `5b6916b`) ✅
~12× cheaper, 2–3× faster. JD parsing and web extraction stay on Sonnet. **Still open:** add 60s timeout + 30s heartbeat to `_call_claude` (~10-line patch).

---

### Apollo India data confirmed good (2026-04-25) ✅
~95.5% email coverage, ~70% direct-phone. Pipeline was fabricating location + discarding quality flags. Fixed in commit `2a9bf84`. See [[Wiki/concepts/Apollo-Pre-Reveal-Quality-Signals]].

---

### Full RCO lifecycle → LIVE (2026-04-18, carried) ✅
```
Requirement → Source → Shortlist → Sequence → Submit to TL → TL approves + sends to client
```
Commits `ed63940` + `717e523`. Fully operational.

---

### Open blockers / follow-ups

| Priority | Item |
|---|---|
| 🔴 | Fix punch list items 5, 6, 8 before demo |
| 🔴 | Run Supabase schema migration for commit `2a9bf84` (6 columns + 2 indexes) |
| 🔴 | Sequences end-to-end verification — walk section 5 of the 04-26 handoff doc |
| 🟠 | Set `PUBLIC_BASE_URL` and `UNSUBSCRIBE_SECRET` on Railway (needed for tracking) |
| 🟠 | Add `APIFY_TOKEN` to Railway Variables |
| 🟠 | Top up Anthropic to ≥ $20 |
| 🟠 | Add 60s timeout + 30s heartbeat to `_call_claude` |
| 🟡 | Tier 3 email loop test (features 19–24) |
| 🟡 | Apollo paid plan upgrade ($49 Basic — code ready) |
| 🟡 | Foundit EDGE API key — pending from Prayag |
| 🟡 | Detail-page 3-dot menu (overview only in this round) |
| ⬜ | `is_starred` filter / Starred scope chip — backend not wired |
| ⬜ | Full Searches post-query layout (waiting on second competitor screenshot from Nikhil) |
| ⬜ | `/api/search` project scoping — do NOT wire without Nikhil's sign-off |
| ⬜ | Legacy `/page-outreach` — preserved unlinked; retirement decision pending |

### Recently resolved
- ~~Apollo pipeline fabricating location data~~ — ✅ Fixed 2026-04-25, commit `2a9bf84`
- ~~Screener hanging on Sonnet at tier-1~~ — ✅ Fixed 2026-04-26, commit `5b6916b`
- ~~Harvestapi normalizer broken~~ — ✅ Fixed 2026-04-26, commit `dd0e4f1`
- ~~Submit-to-TL UI~~ — ✅ Shipped 2026-04-18, commits `ed63940` + `717e523`

### New to the vault today (2026-04-28)
- [[Wiki/digests/Session-Beroz-Sequences-Redesign-2026-04-26]]
- [[Wiki/digests/Session-Beroz-Apollo-MultiSource-2026-04-25]]
- [[Wiki/digests/Session-Beroz-Harvestapi-Haiku-2026-04-26]]
- [[Wiki/digests/Session-Beroz-Feature-Test-2026-04-27]]
- [[Wiki/concepts/Email-Tracking-Trifecta]]
- [[Wiki/concepts/Apollo-Pre-Reveal-Quality-Signals]]
- [[Wiki/concepts/Adaptive-Search-Progressive-Loosening]]
- [[Raw/docs/Beroz-Session-2026-04-25]]
- [[Raw/docs/Beroz-Session-2026-04-26]] (two sessions merged)
- [[Raw/docs/Beroz-Feature-Test-Log-2026-04-27]]
- [[Wiki/concepts/Candidate-Sourcing-Channels]] — updated to 7-channel table

### Guardrails for the AI reading this
- Do not edit anything in `Raw/`. It is sacred.
- Do not auto-send any email from any code path.
- Do not build or suggest LinkedIn *direct* scraping. Apify/harvestapi is the approved path — see [[Wiki/concepts/Candidate-Sourcing-Channels]] for the ToS risk note.
- Do not rewrite the Railway codebase for architectural purity. Extend in `/ai_agents/` or as new Flask routes.
- Do not wire `/api/search` to `state.activeProject` without Nikhil's sign-off — cosmetic scoping is intentional for now.
- Do not assume the 04-26 Sequences feature is verified — section 5 of the handoff doc has not been run end-to-end. Treat as wired-up only.
- Always add `generated-by: <tool>` frontmatter to AI-authored files.

See [[mi]] for the full guardrail set.

---

_Updated 2026-04-28 — merged two parallel ingests: (1) Sequences redesign + Email-Tracking-Trifecta concept; (2) Apollo audit + 7-channel expansion + harvestapi fix + Haiku swap + feature test + punch list. Both sets of notes and concepts now in vault._
