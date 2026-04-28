---
type: wiki-hot-cache
generated-by: claude
updated: 2026-04-28
max-words: 1000
---

# Wiki — Hot Cache

Small recency buffer. Rewritten by [[AIOS/skills/ingest-source]] whenever it runs. If you're an AI reading this first, this is the current state of what matters most.

---

## Right now — 2026-04-28 (late evening)

### Strategic pivot logged: pure clone, IA included 🔴 supersedes 04-15 hybrid plan

Nikhil overrode the 2026-04-15 hybrid-clone decision in favour of **pure 1:1 clone (visual + IA) → differentiate in Phase 4**. The 04-27 punch list (15 bugs, 3 demo-blockers) showed the cost of hybrid: mixing Juicebox patterns with Niksho behaviour before either was understood. Pure clone forces understanding first. ADR signed by Nikhil this session, **pending Shoham confirmation**.

ADR: [[Efforts/Niksho-SaaS-Product/decisions/2026-04-28-pivot-to-pure-clone]]

**Frontend rebuild only** — backend/agents/data layer all stay (mi.md hard rule). The clone goes in `/Brand New Website/beroz/Clone/` alongside existing Beroz; no production risk.

**IA decision (load-bearing):** Project is the routing primitive at `/project/<id>`. No Client primitive. Phase 4 multi-client extension path = `projects.client_id` nullable column, Client as tag/filter not routing parent. Same pattern Beroz already used for Projects layer.

---

### Capture pipeline complete ✅

Playwright capture toolkit built and run against Juicebox in this session. Toolkit at `/Brand New Website/beroz/Clone/`:

- `auth.ts` (real Chrome + persistent profile)
- `crawl.ts` (with self-diagnostic `doctor()` + manual route override — see [[Wiki/concepts/Self-Diagnosing-Crawler]])
- `interact.ts` (90% scripted flows with click/fill/wait actions)
- `analyze.ts` (REPORT.md + per-page autofill)

Captured: **11 pages × 428 interactives × 102 API endpoints × 7 flow traces.**

**Design system corrections to 04-15 teardown** (load-bearing — would have built wrong):

| Property | Was | Real |
|---|---|---|
| Font stack | Inter | Helvetica/Arial system stack |
| Brand purple | `#7600bc` | `#6B2F8D` (`rgb(107, 47, 141)`) |
| Base font size | 14px implied | 16px |
| Border radius default | 4px | 0px dominant |

**API manifest:** 102 unique endpoints, ~25 are real product routes (`/api/user`, `/api/search`, `/api/sequence/list`, `/api/contact`, `/api/integration`, etc.). This is the spec for backend extensions.

---

### Walkthrough ~85% remaining — pickup point for next session 🟡

Walkthrough kicked off at end of session. Took one screenshot — Nikhil was on the candidate detail drawer for Dan Kaplun, showing one of the most important uncaptured surfaces (we missed it in the crawl). Nikhil deferred to next session for two-screen setup.

**Pickup signal:** Nikhil says "let's do the walkthrough" → I re-request Chrome access → screenshot → start at top, work top-down through sidebar.

**Pre-walkthrough checklist for Nikhil:** Juicebox open in real Chrome (logged in, mailbox connected), populated sequence running, shortlist with 2-3 candidates, executed search visible, Typewhisper ready, two screens.

**~50-60 missing surfaces** the walkthrough has to capture: modals (Create Sequence, Filter editor, Criteria editor, Share, Status dropdown), drawers (Candidate Detail with 4 profile tabs + 5-tab right panel), populated states (Search Results, populated sequence list, populated shortlist), sub-tabs within Settings, 3-dot row menus.

---

### New concept notes from this session

- [[Wiki/concepts/Self-Diagnosing-Crawler]] — doctor() + manual routes.json: structurally prevents DOM-heuristic-failure loops
- [[Wiki/concepts/Crawl-Walkthrough-Capture-Pipeline]] — 3-layer methodology for cloning authenticated SaaS
- [[Wiki/concepts/Authenticated-SPA-Capture]] — UPDATED with Playwright auth findings (channel:'chrome' + persistent profile + networkidle pitfall + lock-cleanup)

---

### Workflow gate discovered ⚠ Niksho-relevant

**Juicebox gates sequencing behind mailbox connection.** Add to Sequence / New Sequence with no connected mailbox → modal: Connect Gmail / Outlook / IMAP / Do this later. The full sequence editor is unreachable without connection.

For Niksho: Beroz already has Microsoft Graph connections for ExcelTech's 10 inboxes — gate is reversed. SaaS multi-tenant Phase 4 needs equivalent gate. Add to backlog.

---

### Carried from previous hot.md (still active)

**04-27 feature test punch list** — 3 demo-blockers (Bug #5 Source Now passes 5-word summary; Bug #6 three Searches tabs are same component; Bug #8 Apollo page-size too small). The pure-clone rebuild supersedes these: when the new clone is built it replaces the surfaces these bugs lived in. Don't fix in old Beroz.

**Sequences engagement trifecta** (pixel + click + bounce + AI intent) — code shipped to repo on 04-26, end-to-end verification still pending. See [[Wiki/digests/Session-Beroz-Sequences-Redesign-2026-04-26]].

**7-channel sourcing** live on main as of 04-25 — awaiting Railway deploy with schema migration (commit `2a9bf84`), `APIFY_TOKEN`, Anthropic top-up.

**Haiku 4.5 for candidate scoring** ✅ shipped — ~12× cheaper, 2-3× faster.

---

### Open follow-ups (priority ordered)

| Priority | Item |
|---|---|
| 🔴 | **Walkthrough — resume next session.** ~85% remaining. Two-screen setup. |
| 🔴 | Shoham confirms pivot ADR before any further build |
| 🟠 | After walkthrough: targeted capture flow for ~10-15 high-value missing surfaces |
| 🟠 | Build tokens.css + ~10 primitive components before any page-build PR (drift prevention) |
| 🟠 | Per-page visual diff gate before merge |
| 🟡 | Cross-link pivot ADR from Niksho-SaaS Overview + reading copy of hot.md tomorrow |
| 🟡 | Diff 102-endpoint API manifest against Beroz's existing FastAPI routes → backend extension list |
| 🟡 | Run Supabase schema migration `2a9bf84`, set Railway env vars |
| 🟡 | Foundit EDGE API key (chase Prayag) |

### Recently resolved this session

- ✅ Strategy hybrid-vs-clone re-decided (pure clone, IA included)
- ✅ Playwright capture toolkit built end-to-end
- ✅ 11 pages captured with full DOM/styles/interactives/network/hover
- ✅ 7 flow traces with 90%-scripted automation
- ✅ Design system extracted from real computed styles (corrects 04-15 guesses)
- ✅ IA confirmed: Project primitive + 8 sub-routes + 1 workspace-scoped
- ✅ 102-endpoint API manifest produced
- ✅ Self-diagnosing crawler pattern with doctor() + manual route override

### Guardrails for the AI reading this

- Do not edit anything in `Raw/`. It is sacred.
- The pivot to pure clone is the active strategy as of 2026-04-28. Do NOT extend the 04-15 hybrid plan — it has been superseded. Read the ADR before suggesting changes.
- The clone code lives at `/Users/nikhilkumar/Claude Workspace/exceltech-ai/Brand New Website/beroz/Clone/` (outside vault).
- `auth-session/chrome-profile/` keeps Nikhil's Juicebox session — re-auth only if Firebase Auth expires (typically ~24h).
- Frontend rebuild only; backend stays. mi.md hard rule. Don't propose backend rewrites.
- The walkthrough is the primary mechanism for filling sub-surface gaps. Don't propose alternative discovery methods that bypass it.
- Always `generated-by:` frontmatter on AI-authored files.

See [[mi]] for the full guardrail set.

---

_Updated 2026-04-28 (late) — full ingest of the Beroz Clone Capture Session: pivot ADR, capture pipeline complete, 2 new concept notes, 1 concept note updated, walkthrough deferred._
