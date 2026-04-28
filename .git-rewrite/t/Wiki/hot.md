---
type: wiki-hot-cache
generated-by: claude
updated: 2026-04-18
max-words: 1000
---

# Wiki — Hot Cache

Small recency buffer. Rewritten by [[AIOS/skills/lint-wiki]] whenever it runs. If you're an AI reading this first, this is the current state of what matters most.

---

## Right now — 2026-04-18

### Full RCO lifecycle → LIVE end-to-end in ExcelTech production ✅
Two commits shipped to `origin/main` and auto-deployed via Railway: **`ed63940`** (Phase 5 — Submit-to-TL) and **`717e523`** (Phase 4 — Sequences wiring complete). No schema changes — both commits run on existing `submissions` and `outreach_log` tables.

**The complete pipeline is now operational:**
```
Requirement → Source → Shortlist → Sequence → Submit to TL → TL approves + sends to client
```
Every step has a UI surface, persistent state in Supabase, and a status that propagates back to every card/chip/button referencing that candidate.

**Phase 5 — Submit-to-TL:**
- New Submit to TL button in candidate slide-over; gated on recruiter role + requirement context + no existing submission.
- Backend rejects duplicate (candidate, requirement) submissions with 409. Frontend pre-checks `data.submissions` — button never misleads.
- Status propagation: shortlist cards show `With TL / TL approved / Sent to client / TL rejected` tag. Slide-over chip updates across all states.
- `data-requirement-id` stamped on source cards to carry requirement context through to the slide-over.

**Phase 4 — Sequences wiring:**
- Slide-over Sequences tab: real list of every outreach email with subject, "For \<role\> · \<client\>", timestamp, Replied/Awaiting chip.
- Slide-over Activity tab: unified timeline (notes + emails + submissions + approvals) — client-side merge, no new endpoint.
- Sidebar Sequences page redesigned: grouped by requirement, filter tabs (All / Awaiting / Replied), scope switch My/All (TL-only), 3 stat tiles, click → opens candidate.
- Legacy Outreach & Inbox preserved at `/page-outreach`, unlinked from sidebar.

Pattern extracted as [[Wiki/concepts/Idempotent-Multi-Role-Handoff]] — reusable for any future multi-role approval flow in the SaaS product.

**Full details:** [[Wiki/digests/Session-Beroz-Phase4-Phase5-2026-04-18]] · [[Raw/docs/Beroz-Session-2026-04-18]]

---

### Projects layer + sidebar refactor + Search hero → LIVE ✅ (2026-04-17, carried)
Two commits: `423a01e` (Projects layer, sidebar, Search hero) + `56ba201` (frontend-saas mockup). Projects are real Supabase tables. Sidebar is 3-zone. Agent Home deleted. Search rebuilt as competitor-inspired hero with mode chips. Avatar at bottom-left sidebar, 5 items all wired. See [[Wiki/digests/Session-Beroz-Projects-Layer-2026-04-17]].

### Planning artifact for Projects ship — preserved (2026-04-17)
[[Raw/docs/Beroz-Frontend-Planning-2026-04-17]] — the morning planning session that drove the ship. Useful for understanding *why* the ship looks the way it does. [[Wiki/digests/Session-Beroz-Frontend-Planning-2026-04-17]].

### Beroz — 31/31 Playwright passing (carried)
Commit `f2f0c0d` merged FastAPI into Flask, fixed the silent `api()` helper, corrected `experience_min` type, added Supabase healthcheck. Full chain healthy. See [[Wiki/digests/Session-Beroz-Fix-Analysis-2026-04-16]].

### v2 Recruitment architecture (carried, still in flight)
8 sourcing channels, 7 agents, 4 implementation phases. Phase 1: Foundit EDGE API migration (**blocked on API key from Prayag**). See [[Raw/docs/ExcelTech-Recruitment-Agent-Architecture-v3.html]].

### Competitor analysis — X0PA AI (carried)
29 features across 3 platforms. Niksho's lane: end-to-end recruiter workflow automation. See [[Wiki/competitors/X0PA-AI]].

### In motion (by intensity)
- 🔥 **Active** — [[Efforts/ExcelTech-Automation/Overview|ExcelTech Automation]] — Full RCO lifecycle live in production. [[Efforts/Niksho-SaaS-Product/Overview|Niksho SaaS Product]] — UI patterns reusable; Juicebox post-query layout next.
- 🌀 **Ongoing** — [[Efforts/Second-Brain-Setup/Overview|Second Brain Setup]] v1 shipped, maintenance mode.
- 💤 **Sleeping** — [[Efforts/Fundraising/Prep-2027|Fundraising 2027]].

### Open blockers / follow-ups
- **Full Searches post-query layout** — second competitor screenshot pending from Nikhil.
- **`/api/search` project scoping** — endpoint ignores `state.activeProject`; cosmetic for now. Do NOT wire without sign-off.
- **Foundit EDGE API key** — still pending from Prayag.
- **Apollo plan upgrade** — code ready; needs paid plan ($49 Basic).
- **Legacy `/dashboard` route** — redirect / delete / leave pending.
- **Invite members** — placeholder; no `POST /api/team/invite` yet.
- **Requirement ↔ Project backfill** — old requirements have `project_id = NULL`; "Assign to project" deferred.
- **Legacy `/page-outreach`** — preserved but unlinked; retirement decision pending.
- **`supabase-py` has no DDL** — schema changes still need Supabase Console.

### Recently resolved
- ~~Submit-to-TL UI~~ — ✅ Shipped 2026-04-18, commits `ed63940` + `717e523`. Full RCO lifecycle live.
- ~~Projects layer / sidebar refactor / Search hero~~ — ✅ Shipped 2026-04-17, commits `423a01e` + `56ba201`.
- ~~Create Requirement bug~~ — ✅ Fixed 2026-04-16, commit `f2f0c0d`. 31/31 tests passing.

### New to the vault today
- [[Wiki/digests/Session-Beroz-Phase4-Phase5-2026-04-18]]
- [[Wiki/concepts/Idempotent-Multi-Role-Handoff]]
- [[Raw/docs/Beroz-Session-2026-04-18]]

### Guardrails for the AI reading this
- Do not edit anything in `Raw/`. It is sacred.
- Do not auto-send any email from any code path.
- Do not build or suggest LinkedIn scraping. Ever.
- Do not rewrite the Railway codebase for architectural purity. Extend in `/ai_agents/` or as new Flask routes.
- Do not wire `/api/search` to `state.activeProject` without Nikhil's sign-off — cosmetic scoping is intentional for now.
- Always add `generated-by: <tool>` frontmatter to AI-authored files.

See [[mi]] for the full guardrail set.

---

_Updated on 2026-04-18 — ingested Beroz-Session-2026-04-18 (Phase 5 Submit-to-TL + Phase 4 Sequences wiring; full RCO lifecycle live end-to-end). Created Idempotent-Multi-Role-Handoff concept. SESSION-2026-04-17 was already ingested (2026-04-17c); skipped re-processing. Previous (2026-04-17c): Beroz-Frontend-Planning-2026-04-17 ingested. Earlier: Projects layer + Search hero shipped; X0PA competitor analysis; Create Requirement bug resolved._
