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

<<<<<<< HEAD
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
=======
### Sequences redesign + row 3-dot menu → SHIPPED to repo, verification pending ⚠️
Two pushes in one session on 2026-04-26 — Sequences moves from "list of emails sent" to a real engagement-tracking surface, and rows pick up Pin / Star / Clone / Archive. **Code is in the repo. End-to-end verification (section 5 of the handoff doc) has not yet been run against a running stack** — treat as wired-up but unverified.

**The engagement trifecta (new, all four needed for honest metrics):**
1. **Pixel** — every send gets a `tracking_token` saved on `outreach_log`; 1×1 GIF at `/track/open/<token>.gif`. Directional signal (image-blocking distorts).
2. **Click rewrite** — every `<a href>` rewritten to `/track/click/<token>?u=<orig>`, skips mailto/tel/already-tracked/unsubscribe. Higher-fidelity than opens.
3. **Bounce parse** — `_run_process_inbox` checks bounce sender/subject/Final-Recipient patterns *before* the reply branch. Order matters: Mailer-Daemon emails would otherwise be misclassified as "no" replies.
4. **AI intent (Haiku)** — non-bounce replies → `interested | not_interested | out_of_office | other` + confidence, stamped on `sequence_runs.intent`.

Pattern extracted as [[Wiki/concepts/Email-Tracking-Trifecta]] — load-bearing for the SaaS port.

**Adjacent shipped this round:**
- **Signatures library** — `user_signatures` table, partial unique index on default, `/api/signatures` CRUD, dropdown in editor.
- **Unsubscribe flow** — token-signed footer (HMAC of `run_id:email`), global `email_unsubscribes` suppression list, pre-send guard at top of `sequence_tick`. Footer goes in *before* link rewrite (otherwise the unsub URL gets tracked).
- **Test-send** — `[TEST]`-prefixed preview to current user; no log/run/tracking. Keeps test traffic out of metrics.
- **UI rebuild** — overview cards (Total/Active/Opened/Clicked/Replied/Interested), 7/14/30-day chart on overview + detail, 7-card detail page with embedded chart, editor signature dropdown + unsub checkbox + Preview-and-test button.
- **Row 3-dot menu** — `sequences.is_pinned` / `is_starred` / `pinned_at` columns + partial index, deep-copy `clone_sequence_row`, popover Pin/Star/Edit/Clone/Archive (Archive red), purple pin icon + amber star on row name. `data-stop="1"` separates row-click drilldown from menu-click.

**Full details:** [[Wiki/digests/Session-Beroz-Sequences-Redesign-2026-04-26]] · [[Raw/docs/Beroz-Session-2026-04-26]]

**Before relying on this in production:** apply the migration (`apply_schema.py sequence_tracking.sql`), set `PUBLIC_BASE_URL` and `UNSUBSCRIBE_SECRET` env vars on Railway, then walk section 5 of the handoff doc.

---

### Full RCO lifecycle → LIVE end-to-end ✅ (2026-04-18, carried)
Two commits to `origin/main`: `ed63940` (Phase 5 — Submit-to-TL) and `717e523` (Phase 4 — Sequences wiring). The complete pipeline `Requirement → Source → Shortlist → Sequence → Submit to TL → TL approves + sends` is operational with persistent state and propagating status. Submit-to-TL backend rejects duplicate (candidate, requirement) with 409; frontend pre-checks `data.submissions`. Pattern: [[Wiki/concepts/Idempotent-Multi-Role-Handoff]]. See [[Wiki/digests/Session-Beroz-Phase4-Phase5-2026-04-18]].

### Projects layer + sidebar refactor + Search hero → LIVE ✅ (2026-04-17, carried)
Commits `423a01e` + `56ba201`. Projects are real Supabase tables. Sidebar is 3-zone. Agent Home deleted. Avatar at bottom-left, 5 items wired. See [[Wiki/digests/Session-Beroz-Projects-Layer-2026-04-17]].

### Beroz — 31/31 Playwright passing (carried)
Commit `f2f0c0d`. FastAPI merged into Flask, silent `api()` fixed, `experience_min` type fixed, Supabase healthcheck. See [[Wiki/digests/Session-Beroz-Fix-Analysis-2026-04-16]].

### v2 Recruitment architecture (carried)
8 sourcing channels, 7 agents, 4 phases. Phase 1 Foundit EDGE API migration **blocked on API key from Prayag**. See [[Raw/docs/ExcelTech-Recruitment-Agent-Architecture-v3.html]].

### Competitor analysis — X0PA AI (carried)
29 features across 3 platforms. See [[Wiki/competitors/X0PA-AI]].

### In motion (by intensity)
- 🔥 **Active** — [[Efforts/ExcelTech-Automation/Overview|ExcelTech Automation]] — Sequences redesign in repo, awaiting verification. [[Efforts/Niksho-SaaS-Product/Overview|Niksho SaaS Product]] — engagement trifecta is the load-bearing pattern for the SaaS port.
- 🌀 **Ongoing** — [[Efforts/Second-Brain-Setup/Overview|Second Brain Setup]] v1 shipped, maintenance mode.
- 💤 **Sleeping** — [[Efforts/Fundraising/Prep-2027|Fundraising 2027]].

### Open blockers / follow-ups
- **Sequences end-to-end verification** — section 5 of the 04-26 handoff doc not yet executed. Top priority.
- **`PUBLIC_BASE_URL` and `UNSUBSCRIBE_SECRET` env vars** — must be set on Railway before tracking works.
- **Detail-page 3-dot menu** — overview list only this round.
- **`is_starred` filter / Starred scope chip** — backend not wired.
- **Bulk row actions** — not yet in scope; will likely accompany the Starred filter.
- **Settings panel inside editor** — still deferred.
- **Foundit EDGE API key** — still pending from Prayag.
- **Apollo plan upgrade** — code ready; needs paid plan ($49 Basic).
- **Full Searches post-query layout** — second competitor screenshot pending from Nikhil.
- **`/api/search` project scoping** — endpoint ignores `state.activeProject`; cosmetic. Do NOT wire without sign-off.
- **Invite members** — placeholder; no `POST /api/team/invite` yet.
- **Legacy `/page-outreach`** — preserved unlinked from 04-18; retirement decision pending.
- **`supabase-py` has no DDL** — schema changes still need Supabase Console or `apply_schema.py`.

### Recently resolved
- ~~Sequences redesign + 3-dot menu (code)~~ — ⚠️ Shipped to repo 2026-04-26; verification pending.
- ~~Submit-to-TL UI~~ — ✅ Shipped 2026-04-18, commits `ed63940` + `717e523`.
- ~~Projects layer / sidebar refactor / Search hero~~ — ✅ Shipped 2026-04-17, commits `423a01e` + `56ba201`.
- ~~Create Requirement bug~~ — ✅ Fixed 2026-04-16, commit `f2f0c0d`.

### New to the vault today
- [[Wiki/digests/Session-Beroz-Sequences-Redesign-2026-04-26]]
- [[Wiki/concepts/Email-Tracking-Trifecta]]
- [[Raw/docs/Beroz-Session-2026-04-26]]
>>>>>>> origin/main

### Guardrails for the AI reading this
- Do not edit anything in `Raw/`. It is sacred.
- Do not auto-send any email from any code path.
- Do not build or suggest LinkedIn *direct* scraping. Apify/harvestapi is the approved path — see [[Wiki/concepts/Candidate-Sourcing-Channels]] for the ToS risk note.
- Do not rewrite the Railway codebase for architectural purity. Extend in `/ai_agents/` or as new Flask routes.
<<<<<<< HEAD
- Do not wire `/api/search` to `state.activeProject` without Nikhil's sign-off.
=======
- Do not wire `/api/search` to `state.activeProject` without Nikhil's sign-off — cosmetic scoping is intentional for now.
- Do not assume the 04-26 Sequences feature is verified — section 5 of the handoff doc has not been run end-to-end. Treat as wired-up only.
>>>>>>> origin/main
- Always add `generated-by: <tool>` frontmatter to AI-authored files.

See [[mi]] for the full guardrail set.

---

<<<<<<< HEAD
_Updated 2026-04-28 — ingested Beroz-Session-2026-04-25 (Apollo audit + 5 gates + 7-channel expansion), Beroz-Session-2026-04-26 (harvestapi fix + Haiku swap), Beroz-Feature-Test-Log-2026-04-27 (feature test + 15-item punch list). Created Apollo-Pre-Reveal-Quality-Signals and Adaptive-Search-Progressive-Loosening concepts. Updated Candidate-Sourcing-Channels to 7-channel table. Previous (2026-04-18): Beroz-Session-2026-04-18 ingested; full RCO lifecycle live._
=======
_Updated on 2026-04-28 — ingested Beroz-Session-2026-04-26 (Sequences end-to-end redesign: engagement tracking trifecta, signatures + unsubscribe, overview/detail/editor rebuild, Pin/Star/Clone/Archive 3-dot menu). Created Email-Tracking-Trifecta concept. Verification status: code in repo, end-to-end test pending. Previous (2026-04-18): Phase 4+5 RCO lifecycle live; Idempotent-Multi-Role-Handoff concept._
>>>>>>> origin/main
