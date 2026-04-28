---
type: raw-session-log
source: cowork-session
date: 2026-04-28
participants: ["Nikhil", "Claude (Cowork)"]
parallel-tools: ["Claude Code (Nimbalyst)"]
topics:
  - "Strategic pivot: hybrid → pure clone"
  - "Playwright capture toolkit build"
  - "Authenticated SPA capture against Juicebox"
  - "Information Architecture extraction"
  - "Walkthrough kickoff"
---

# Beroz Clone — Capture Session 2026-04-28

## Session summary

Multi-hour Cowork session that produced a major strategy reversal, a working Playwright capture toolkit, a successful crawl + flows + analyze pipeline against Juicebox, and the first ~5 minutes of the live walkthrough. Three real artifacts shipped to vault + clone folder. Walkthrough proper deferred to next session per Nikhil's request for two-screen setup.

Originally the session opened with a continuation from earlier conversation about the Playwright capture script. It evolved through ~6 distinct phases.

## Phase 1 — Strategic pivot decision

Nikhil overrode the 2026-04-15 hybrid-clone decision in favour of **a pure 1:1 clone (visual + IA), then differentiate in Phase 4**. Reasoning: the 04-27 punch list had three demo-blockers all rooted in the same problem — mixing Juicebox patterns with Niksho behaviour before either was understood deeply. Pure clone forces understanding first.

I pushed back twice (the punch list bugs were ~2 days of surgical fixes, the IA-clone bakes in agency-unfriendly assumptions). Nikhil acknowledged the risks and proceeded anyway. ADR logged at [[Efforts/Niksho-SaaS-Product/decisions/2026-04-28-pivot-to-pure-clone]] with full risk register.

Two follow-on decisions:

- **Scope of "dismantle" = frontend only.** Backend, agents, data layer all stay (mi.md hard rule).
- **Clone Juicebox's IA wholesale**, not just the visual surface. Deferred Client primitive to Phase 4 as `projects.client_id` nullable column — same pattern Beroz already used for Projects layer.

## Phase 2 — Toolkit build

Drafted a comprehensive Playwright capture project at `/Users/nikhilkumar/Claude Workspace/exceltech-ai/Brand New Website/beroz/Clone/`. Architecture:

- `auth.ts` — interactive Google login → persistent profile + storageState
- `crawl.ts` — sidebar discovery + per-page DOM/screenshot/styles/interactives/network/hover capture
- `interact.ts` — scripted flows with traces + per-flow network logs
- `analyze.ts` — produces REPORT.md + JUICEBOX-FEATURE-MAP-AUTOFILL.md

Plus `config/flows.json` (7 flows specced), `config/routes.json.example` (manual override fallback), `package.json`, `tsconfig.json`, `playwright.config.ts`, `.env.example`, `README.md`.

## Phase 3 — Debugging marathon (the hard part)

Five distinct bugs hit in sequence. Each fix taught a lesson:

### Bug 1 — Google blocks bundled Chromium
**Symptom:** "This browser or app may not be secure" on OAuth.
**Cause:** Playwright's bundled Chromium has the `AutomationControlled` flag that Google fingerprints.
**Fix:** Switch to `channel: 'chrome'` (real installed Chrome) + `launchPersistentContext` + `--disable-blink-features=AutomationControlled`.
**Lesson:** Real Chrome with persistent profile + automation flag disabled is the reliable path for Google OAuth.

### Bug 2 — Stale SingletonLock on dirty exits
**Symptom:** "Failed to create a ProcessSingleton" on second auth attempt.
**Cause:** Chrome leaves `SingletonLock` / `SingletonCookie` / `SingletonSocket` files in profile dir if it doesn't exit cleanly.
**Fix:** Always delete those three files at script start.

### Bug 3 — Auth completes in browser, file never written
**Symptom:** User logged in, closed browser, no `storageState.json`.
**Cause:** `auth.ts` only writes on Enter press in terminal, not on browser close.
**Fix:** UX hint in script + clearer documentation. Also added profile-dir-exists check elsewhere.

### Bug 4 — storageState handoff loses session
**Symptom:** Crawler's bundled Chromium lands on marketing page despite valid `storageState.json`.
**Cause:** Cross-context handoff from real Chrome to bundled Chromium loses some auth tokens (Firebase Auth tokens stored in localStorage on origins the auth context never visited as top-level pages).
**Fix:** `crawl.ts` and `interact.ts` now reuse the same persistent Chrome profile via `launchPersistentContext`. No more cross-context translation.
**Lesson:** When in doubt, reuse the profile. Don't ferry cookies between contexts.

### Bug 5 — networkidle never fires
**Symptom:** Seed page goto times out at 30s on `networkidle`.
**Cause:** Modern SaaS apps keep network busy indefinitely with WebSockets (Firestore Listen channel), telemetry, long-polls, analytics.
**Fix:** `domcontentloaded` + 3.5s settle wait, all gotos wrapped in try/catch.
**Lesson:** Don't use `waitUntil: 'networkidle'` against any modern SaaS app. Same fix needed in `interact.ts`.

### Bug 6 — Sidebar discovery returns 0 routes (recurring)
**Symptom:** After fixing all the above, discovery still found 0 routes.
**Investigation:** First debug pass thought it was unauthenticated state. Second pass realized doctor function would tell us reliably whether auth or DOM was the problem. This was the failure mode hitting for the 4th time. Nikhil rightly pushed for a permanent solution — I had been patching symptoms.
**Permanent fix (two layers):**
1. **`doctor()` function** — runs first, reports browser state in plain English: URL, title, sign-in text detected (Y/N), sidebar-like element present (Y/N), full body HTML dumped to `_debug-doctor.html`. No more silent failures.
2. **`config/routes.json` manual override** — if file exists, crawler skips auto-discovery entirely and walks the explicit URL list. Five minutes of human time replaces an hour of DOM-heuristic chasing.

After these layers, discovery worked on the next attempt — turns out the persistent profile had become fully-loaded only on the third login. Nikhil's comment "i had not completely logged in" was the diagnosis.

## Phase 4 — Successful capture run

Crawl walked 11 pages successfully. Output:

```
Pages captured: 11
Total interactive elements: 428
Total API calls observed: 2613
Unique API endpoints: 102
Pages with errors: 11 (mostly benign — CSP warnings, free-tier 401s)
```

Real anomalies worth noting:
- `/project/<id>/network` page: 403 in addition to 401s (gated feature on free tier)
- `/account?tab=user`: 500 server error (real Juicebox-side bug)

URL pattern extraction confirmed the IA:
```
/                           (root)
/account                    (workspace-scoped)
/project/<id>               (routing primitive)
/project/<id>/agents
/project/<id>/analytics
/project/<id>/contacts
/project/<id>/integrations
/project/<id>/network
/project/<id>/search/       (note: trailing slash)
/project/<id>/sequences
/project/<id>/shortlist
```

## Phase 5 — Flows pass (mixed quality)

First flow attempt: Nikhil spammed Enter through prompts without driving the browser. Traces captured nothing useful.

Rewrote `flows.json` to be ~90% script-driven (added `click`, `fill`, `wait` actions to `interact.ts`). New flows used text-based locators (`page.getByText("Find Similar")`) so the script could click tabs itself. Re-run produced useful traces.

Discovered during flow 05 (shortlist + sequence) that **Juicebox gates sequencing behind mailbox connection**. The "Connect your mailbox to start sequencing" modal IS the workflow — captured as a real product insight, not a debugging issue.

Flow 06 (settings tour) showed many `optional click skipped` for Settings sub-tabs (Workspace, Notifications, API) — my guessed labels didn't match Juicebox's actual sub-tab names. Captures still useful but several "settings/X" screenshots actually show the previous Settings page.

## Phase 6 — Analyze + key findings

`npm run analyze` produced REPORT.md (1500+ lines) + JUICEBOX-FEATURE-MAP-AUTOFILL.md (one section per page). Key findings:

### Design system — corrections to earlier teardown

| Property | 04-15 teardown guess | Real captured value |
|---|---|---|
| Font stack | Inter | Helvetica/Arial system stack (44 occurrences vs 3 for Inter) |
| Brand purple | `#7600bc` | `rgb(107, 47, 141)` = `#6B2F8D` |
| Body text | not captured | `rgb(51, 51, 51)` (33 occurrences) |
| Base font size | implied 14px | 16px (56 occurrences) |
| Border radius default | 4px | 0px is dominant (40 occurrences); 4px secondary (10) |

**These corrections are load-bearing.** Building the clone with Inter and `#7600bc` would have looked subtly wrong everywhere.

### Information Architecture (extracted)

- Routing primitives: **project** only (`/project/<id>`)
- Project-scoped: agents, analytics, contacts, integrations, network, search, sequences, shortlist
- Workspace-scoped: account
- API ownership patterns: `user → company-dnc/country-dnc/team`, `profile → eligibility`, `ats → hired`, `integrations → eligibility-check/next-page/organization-metadata`, `sequence → invite`, `eval → titles`

Confirms my earlier hypothesis. Phase 4 multi-client implication is real and documented in the ADR.

### API endpoint manifest

102 unique endpoints across 11 pages + 7 flows. Top endpoints by frequency are mostly analytics/telemetry (`monitoring`, `you-fool-2582/s/`, `frigade.com/v1/public/flowStates`, `securetoken.googleapis.com`). Real product endpoints include:

- `GET /api/user/org` (58 calls)
- `GET, PATCH /api/user` (53 calls)
- `GET, PATCH /api/search` (40 calls)
- `GET, PATCH /api/contact` (25 calls)
- `GET /api/sequence/list` (36 calls)
- `GET /api/user/org/team` (36 calls)
- `GET /api/invites/pending` (25 calls)
- `GET, POST /api/integration` (19 calls)
- `GET, POST /api/activities` (23 calls)
- `GET /api/tags` (21 calls)

Plus `_next/data/<hash>/...` SSR endpoints per page (Next.js Pages Router data fetching).

This manifest IS the spec for what the clone backend has to expose. Diff against Beroz's existing FastAPI routes to produce the backend extension list.

### Capture coverage gaps (the honest part)

The crawl captured **default state of every page**. It did NOT capture:

**Search page (~15 critical surfaces missing):** Filters editor, Criteria editor, Results state (the most-time-spent surface for recruiters), candidate row component, match score badges, Shortlisted dropdown, view toggle, bulk selection, Review button, pagination, Insights tab, Share modal, New Search modal.

**Sequences page (~20 critical surfaces missing):** Populated sequence list, row 3-dot menu (Pin/Star/Edit/Clone/Archive), sequence editor (multi-step builder), step editor, recipient list, schedule UI, preview modal, send/test states, analytics drill-in. The Connect Mailbox gating modal WAS captured because it rendered by default.

**Other pages:** Each tab has 3-8 missing surfaces (modals, drawers, sub-tabs, populated states).

**Total missing: ~50-60 UI surfaces** estimated. These are filled by the walkthrough + targeted capture pass, not by the static crawl.

## Phase 7 — Walkthrough kickoff (deferred to next session)

Started the walkthrough. Took one screenshot — Nikhil was on the **candidate detail drawer** for Dan Kaplun, showing one of the most important uncaptured surfaces. Documented the visible structure:

- Drawer chrome: ← back, → forward, ⤡ expand, ⋯ menu, ✕ close
- Header: name + LinkedIn / GitHub / Stack Overflow / X icons
- Location, current company badge, education badge
- Profile tabs: Overview / Experience / Education / **Skills**
- Skills tab: GitHub repos with star counts (jsonresume/resume-cli ⭐6, etc.) — confirms GitHub-derived skills inference
- Owned Repositories section
- Bottom action bar: Shortlisted dropdown + Create First Sequence button
- Right-side panel tabs: Notes / Sequences / Activity / Projects / Tasks

Nikhil deferred the rest of the walkthrough to next session for two-screen setup. Pickup point: **start from the top (sidebar order)** — landing → Project root → Search → Shortlist → Contacts → Sequences → Network → Analytics → Integrations → Account → Agents.

## Artifacts produced

### In vault
- [[Efforts/Niksho-SaaS-Product/decisions/2026-04-28-pivot-to-pure-clone]] — strategy reversal ADR with IA decision + Phase 4 path
- [[Efforts/Niksho-SaaS-Product/JUICEBOX-FEATURE-MAP]] — feature map scaffold (canonical), empty WHY sections waiting for walkthrough fill-in

### In Clone folder (outside vault)
- `package.json`, `tsconfig.json`, `playwright.config.ts`, `.env.example`, `.gitignore`, `README.md`
- `scripts/auth.ts` (~95 lines)
- `scripts/crawl.ts` (~600 lines, includes doctor function + manual route override)
- `scripts/interact.ts` (~200 lines, with click/fill/wait actions)
- `scripts/analyze.ts` (~280 lines)
- `config/flows.json` (7 flows, ~90% scripted)
- `config/routes.json.example`
- `auth-session/chrome-profile/` (gitignored — persistent Chrome profile with active Juicebox session)
- `auth-session/storageState.json` (gitignored — also kept for reference)

### Generated outputs
- `captures/<11 pages>/dom.html, fullpage.png, above-fold.png, styles.json, interactives.json, network.json, hover/*.png, meta.json`
- `captures/_coverage.json`, `captures/_urlpatterns.json`
- `traces/<7 flows>/trace.zip + network.json + numbered screenshots`
- `REPORT.md` — design system + IA + 102-endpoint API manifest
- `JUICEBOX-FEATURE-MAP-AUTOFILL.md` — per-page button/API auto-population, WHY sections blank

## Decisions logged

1. **Pivot to pure clone (visual + IA).** ADR signed by Nikhil, pending Shoham confirmation.
2. **Backend stays.** Frontend rebuild only. New endpoints get added as extensions, not replacements.
3. **Real Chrome + persistent profile** is the canonical auth approach for Playwright against Google-OAuth-protected apps.
4. **Manual route override** (`config/routes.json`) is the permanent escape hatch — never debug DOM heuristics again.
5. **Walkthrough is the primary capture pass** for sub-surfaces (modals/drawers/sub-tabs); crawl + flows is supplementary.
6. **Two protections folded into "as planned" execution:** tokens + primitives layer before page builds, and visual diff gate per page.

## Lessons that earn concept-note treatment

1. **Real Chrome with channel:'chrome' + persistent profile + AutomationControlled disabled** beats bundled Chromium for Google-OAuth-protected SPAs. Should update [[Wiki/concepts/Authenticated-SPA-Capture]].
2. **Self-diagnosing crawler with `doctor()` + manual route override** is a permanent escape from DOM-heuristic-failure loops. New concept note.
3. **Crawl → walkthrough → targeted capture** as a 3-layer pipeline for cloning authenticated SPAs. New concept note.
4. **Modern SaaS networkidle pitfall** — fold into Authenticated SPA Capture update.

## Open follow-ups for next session

- Run the live walkthrough (60-90 min) starting from the top
- Build inventory of missing UI surfaces during walkthrough (target ~50-60 surfaces)
- Write follow-up `flows.json` for targeted capture pass after walkthrough
- Hand the populated feature map to Claude Code for Phase 3 build
- Cross-link the pivot ADR from `Efforts/Niksho-SaaS-Product/Overview.md` and `Wiki/hot.md`
- Build tokens + primitives layer before any page-build PRs
- Set up visual diff gate per page

## Pickup signal

Nikhil says "let's do the walkthrough" → I re-request Chrome access → screenshot to see his Juicebox state → start at landing/All Projects and work top-down through sidebar. He'll have two screens, populated sequence, shortlist with 2-3 candidates, executed search visible, Typewhisper ready.
