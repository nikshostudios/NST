---
type: wiki-log
generated-by: claude
updated: 2026-04-28
---

# Wiki — Log

Append-only timeline of ingestion and wiki edits. New entries at the top.

---

## 2026-04-28 — Beroz Sequences redesign + 3-dot menu ingestion

**Skill:** [[AIOS/skills/ingest-source]]
**Sources processed:**
- Handoff doc dated 2026-04-26 (Sequences end-to-end redesign + row 3-dot menu Pin/Star/Clone/Archive). Sequences and Beroz session log series — filed as `Beroz-Session-2026-04-26.md` to match the existing daily-slug convention.

**Raw docs created:**
- [[Raw/docs/Beroz-Session-2026-04-26]] — full handoff doc with section 5 verification plan, exact code paths, and "verification still pending" annotation in frontmatter.

**Wiki notes created:**
- [[Wiki/digests/Session-Beroz-Sequences-Redesign-2026-04-26]] — session digest with the full tracking pipeline diagram, ordering-rule callouts, Niksho relevance, and follow-ups.
- [[Wiki/concepts/Email-Tracking-Trifecta]] — pixel + click rewrite + bounce parse + AI intent classification as a unified four-part pattern; includes the two ordering rules (bounce-before-reply; footer-before-rewrite) and the four-question "is the trifecta correctly applied?" checklist.

**Navigation files updated:**
- [[Wiki/index]] — added 1 concept, 1 digest, 1 raw doc; `updated:` bumped to 2026-04-28.
- [[Wiki/hot]] — rewritten to lead with the Sequences redesign (flagged as shipped to repo, end-to-end verification pending); engagement trifecta + adjacent (signatures, unsubscribe, test-send) summarised; new blockers added (verification + env vars + detail-page 3-dot menu + `is_starred` filter); 04-18 + 04-17 entries carried.
- [[Wiki/log]] — this entry.

**Efforts files updated:**
- [[Efforts/ExcelTech-Automation/Overview]] — 2026-04-26 decision entry added (Sequences redesign + row 3-dot menu; flagged "unverified — pending end-to-end test" per the user's choice).

**Decisions captured:**
- Bounce branch must run before reply branch in `_run_process_inbox` (Mailer-Daemon misclassification risk).
- Unsubscribe footer is appended *before* link rewriting (otherwise the unsub URL gets wrapped in `/track/click/...` and the unsub click is recorded as engagement before suppression).
- Test-send is a separate path (`test_send_step`), not a flag on `sequence_tick` — keeps test traffic out of engagement metrics.
- Pre-send `is_email_unsubscribed` guard at top of `sequence_tick`; suppressed runs marked `skipped` for auditability.
- Pin/star are first-class columns + a partial index, not derived state (cheap reads, rare writes).
- Clone is a deep copy with `status='draft'`, `source='clone'`, name `"<original> (copy)"`.
- 3-dot menu is overview-only this round; detail-page menu deferred.

**Status note:**
- The verification plan in section 5 of the handoff doc has not yet been executed against a running stack. Code is in the repo. Before treating the feature as live: apply the migration (`apply_schema.py sequence_tracking.sql`), set `PUBLIC_BASE_URL` and `UNSUBSCRIBE_SECRET` env vars on Railway, then walk section 5.

---

## 2026-04-18 — Beroz Phase 4 + 5 session ingestion (full RCO lifecycle live)

**Skill:** [[AIOS/skills/ingest-source]]
**Sources processed:**
- `SESSION-2026-04-18.md` (uploaded — Phase 5 Submit-to-TL + Phase 4 Sequences wiring; full RCO lifecycle live in production)
- `SESSION-2026-04-17.md` — **skipped, already ingested** (log entry 2026-04-17c; `Raw/docs/Beroz-Session-2026-04-17.md` confirmed present)

**Raw docs created:**
- [[Raw/docs/Beroz-Session-2026-04-18]] — full session log (Submit-to-TL handler, Sequences wiring, Activity timeline, key decisions, smoke-test checklist, commits ed63940 + 717e523)

**Wiki notes created:**
- [[Wiki/digests/Session-Beroz-Phase4-Phase5-2026-04-18]] — production ship digest with full RCO lifecycle diagram and Niksho relevance
- [[Wiki/concepts/Idempotent-Multi-Role-Handoff]] — backend 409 dedup + frontend pre-check + status propagation chain; reusable pattern for any multi-role approval flow

**Navigation files updated:**
- [[Wiki/index]] — added 1 concept, 1 digest, 1 raw doc; `updated:` bumped to 2026-04-18
- [[Wiki/hot]] — rewritten to lead with Phase 4+5 ship; full lifecycle diagram; open blockers carried forward
- [[Wiki/log]] — this entry

**Efforts files updated:**
- [[Efforts/ExcelTech-Automation/Overview]] — 2026-04-18 decision entry added (Phase 5 Submit-to-TL + Phase 4 Sequences wiring; milestone 5b fully live)

**Decisions captured:**
- Submit-to-TL requires requirement context (button only appears with `data-requirement-id` in scope)
- Backend 409 + frontend pre-check = idempotent handoff; no misleading UI state
- Activity timeline is client-side merge — no new endpoint (notes + outreach + submissions already returned by detail endpoint)
- `scope=mine|all` on `GET /api/sequences`; TL only sees `scope=all`
- Legacy Outreach & Inbox preserved at `/page-outreach`, unlinked, not deleted
- Zero schema changes in this session (both commits ran on existing tables)

**Known follow-ups (carried from this and prior sessions):**
- Full Searches post-query layout — competitor screenshot pending
- `/api/search` project scoping — cosmetic only; do not wire without sign-off
- Apollo plan upgrade — code ready, needs paid plan
- Invite members endpoint — still placeholder
- Legacy `/dashboard` route — retirement decision pending
- Requirement ↔ Project backfill — deferred
- `match_scores` caching and `1M+ matches` counter — deferred

---

## 2026-04-17d — Beroz Frontend Planning artifact ingestion (planning → ship loop closed)

**Skill:** [[AIOS/skills/ingest-source]]
**Sources processed:**
- Beroz Frontend Planning Session 2026-04-17 (provided inline via `/ingest-source` — TODO list of 4 frontend changes + Chrome extension question + Claude Code prompt + open questions)

**Raw docs created:**
- [[Raw/docs/Beroz-Frontend-Planning-2026-04-17]] — full planning session with TODOs, Claude Code prompt, open questions

**Wiki notes created:**
- [[Wiki/digests/Session-Beroz-Frontend-Planning-2026-04-17]] — planning artifact digest with `status: planning-shipped` callout linking to the same-day ship
- [[Wiki/concepts/Personal-Inbox-Outreach-Tracking]] — reusable concept for the deferred Chrome extension question (deliverability vs build cost trade-offs, when to build, forward-compat schema ask)

**Navigation files updated:**
- [[Wiki/index]] — added 1 concept, 1 digest, 1 raw doc; `updated:` bumped to 2026-04-17c
- [[Wiki/hot]] — added "planning artifact preserved" section + "Chrome extension deferred" callout; new files added to "New to the vault today"; footer timestamp bumped
- [[Efforts/Niksho-SaaS-Product/v2-Planning-Log]] — new "Beroz Frontend Polish — Planning → Ship" section with all 4 implementation TODOs marked ✅ shipped, gating decision marked settled, Chrome extension kept as open deferred item; bonus shipped items + carried-forward follow-ups also captured

**Notes:** This ingestion was unusual — the planning artifact was uploaded for filing **after** the implementation work it described had already been shipped and ingested earlier today (entry 2026-04-17c above). Rather than treating that as wasted, the planning doc is preserved as the historical decision-moment artifact, with a "superseded by ship" callout in the digest pointing forward to [[Wiki/digests/Session-Beroz-Projects-Layer-2026-04-17]]. The main divergences between plan and ship are documented for future readers: avatar shipped at bottom-left of sidebar (not top-right header as planned), and the gating Project ↔ Agent question was resolved as a pragmatic blend (Projects as real Supabase primitive, Requirements stays global, scoping per-surface). The Chrome extension question is the only TODO that remained open after the ship — it now has its own concept page so the trade-off doesn't have to be re-derived next time it comes up.

---

## 2026-04-17c — Beroz Projects Layer session ingestion

**Skill:** [[AIOS/skills/ingest-source]]
**Sources processed:**
- `SESSION-2026-04-17.md` (uploaded — Beroz session log for Projects layer + sidebar refactor + Search hero)

**Raw docs created:**
- [[Raw/docs/Beroz-Session-2026-04-17]] — full session log (SQL schema, API surface, sidebar structure, key decisions, follow-ups, smoke-test checklist)

**Wiki notes created:**
- [[Wiki/digests/Session-Beroz-Projects-Layer-2026-04-17]] — production ship digest with Niksho relevance
- [[Wiki/concepts/Projects-as-Scoping-Primitive]] — Projects as top-level scoping unit; access model + sidebar 3-zone encoding
- [[Wiki/concepts/Search-First-Hero-Mode-Chips]] — intent-capture homepage pattern (chips, example queries, collapse-on-submit)
- [[Wiki/techniques/Auto-Git-Pull-Hook]] — Claude Code `UserPromptSubmit` hook for keeping local in sync with GitHub

**Navigation files updated:**
- [[Wiki/index]] — added 2 concepts, 1 technique, 1 digest, 1 raw doc; bumped `updated:` to 2026-04-17
- [[Wiki/hot]] — rewritten to lead with Projects layer ship; carried over open blockers and guardrails
- [[Efforts/ExcelTech-Automation/Overview]] — added 2026-04-17 decision entry

**Decisions captured:**
- Requirements stays global (TL-owned pool); `project_id` column kept nullable on `requirements` for future opt-in scoping
- Any logged-in user can create a Project; edit/archive/delete = owner-only
- Project-scoped surfaces: Searches, Shortlist. Global: Requirements, Contacts, Sequences, Submissions, Analytics, Integrations
- Default landing is now All Projects (Agent Home deleted)
- Avatar moved to bottom-left sidebar; header minimised to notifications + title
- Search page rebuilt as mode-chip hero; chips toggle placeholder only (single backend call)
- Auto git-pull hook added to `~/.claude/settings.json` for the Beroz repo

**Known gaps / followups:**
- `/api/search` ignores `state.activeProject` — cosmetic scoping only for now; do not wire without Nikhil's sign-off
- Full post-query Searches layout pending — second competitor screenshot expected from Nikhil
- Legacy `/dashboard` route still exists — decision pending (redirect / delete / leave)
- Invite members is a placeholder — no `POST /api/team/invite` endpoint yet
- `supabase-py` has no DDL support — schema changes remain manual via Supabase Console

---

## 2026-04-17b — X0PA AI competitor analysis ingestion

**Skill:** [[AIOS/skills/ingest-source]]
**Sources processed:**
- `X0PA-AI-Recruiter-Features-Singapura-Finance.pptx` (uploaded — sales deck for Singapura Finance)

**Raw docs created:**
- [[Raw/docs/X0PA-AI-Recruiter-Features-2026-04-17]] — full feature extraction (29 features across 3 platforms: AI Recruiter, X0PA ROOM, Agentic AI)

**Wiki notes created:**
- [[Wiki/competitors/X0PA-AI]] — competitor profile with feature comparison, overlap analysis, strategic positioning vs Niksho

**Vault files updated:**
- [[Wiki/index]] — new "Competitors" section added, new raw source entry under "Competitor analysis"
- [[Wiki/hot]] — updated with competitor analysis reference
- [[Wiki/log]] — this entry

**Notes:** First competitor analysis note in the vault. Created `Wiki/competitors/` as a new category. Key finding: X0PA is wide (29 features, enterprise integrations, assessment depth, 72+ languages) but doesn't solve the recruiter's daily operational grind — no job portal sourcing, no outreach/follow-up automation, no submission formatting. Niksho's positioning: "X0PA helps you evaluate candidates better; Niksho helps you find, contact, and deliver them faster."

---

## 2026-04-17 — Beroz RCO Workflow ingestion

**Skill:** [[AIOS/skills/ingest-source]]
**Sources processed:**
- [[Raw/docs/Beroz-RCO-Workflow-2026-04-17]] (RCO lifecycle from recruiter UI perspective — requirement flow, shortlist vs sequence actions, TL approval loop)

**Vault files updated:**
- [[Wiki/index]] — new raw source entry added under Internal docs
- [[Wiki/hot]] — updated with new RCO workflow doc reference
- [[Wiki/log]] — this entry

**Notes:** Internal workflow document. Complements the existing [[Raw/docs/Beroz-Workflow-Diagrams-2026-04-15]] (system/architecture perspective) with the user-facing recruiter workflow: RCO creation → assignment → search → shortlist/sequence → mass mail/export/get number → submit to TL → approve/send to client. No new wiki concepts warranted — operational detail, not reusable framework.

---

## 2026-04-16c — Beroz fix verification — vault updated to resolved state

**Skill:** [[AIOS/skills/ingest-source]]
**Sources processed:**
- `PLAYWRIGHT_TEST_REPORT.md` (uploaded — final state: 31/31, fix verified)
- `PLAYWRIGHT_TEST_FIX_ANALYSIS.md` (uploaded — includes ✅ Resolution section, commit f2f0c0d)

**Raw docs updated (in place):**
- [[Raw/docs/Beroz-Playwright-Test-Report-2026-04-15]] — updated to 31/31, stack updated (Flask single-process), Phase 3 status → PASS, bug section replaced with "Bug Fixed" summary
- [[Raw/docs/Beroz-Playwright-Fix-Analysis-2026-04-16]] — Resolution section added (commit, deployed, file change table), frontmatter updated with `status: resolved`

**Wiki notes updated:**
- [[Wiki/digests/Session-Beroz-E2E-Testing-2026-04-15]] — core finding updated to 31/31, bug section rewritten as "resolved", Relevance updated
- [[Wiki/digests/Session-Beroz-Fix-Analysis-2026-04-16]] — title updated to reflect resolved state, Resolution section added, Relevance rewritten as past tense
- [[Wiki/hot]] — Beroz section updated (31/31 confirmed), Create Requirement removed from Open blockers, added to "Recently resolved"
- [[Wiki/log]] — this entry

**Notes:** No new wiki notes created — all updates are to existing files. The fix (Path A: merge FastAPI into Flask) was implemented exactly as planned. Railway source repo was also corrected as part of the fix — auto-deploy is now live on every push to `nikshostudios/beroz` main.

---

## 2026-04-16b — Beroz Create-Requirement fix analysis ingestion

**Skill:** [[AIOS/skills/ingest-source]]
**Sources processed:**
- [[Raw/docs/Beroz-Playwright-Fix-Analysis-2026-04-16]] (root cause analysis — 3 compounding issues, Path A fix plan with code)

**Wiki notes created:**
- [[Wiki/digests/Session-Beroz-Fix-Analysis-2026-04-16]]

**Vault files updated:**
- [[Wiki/index]] — new digest + raw source entries
- [[Wiki/hot]] — Beroz bug section updated with confirmed root cause and fix plan; blocker updated to reflect Path A decision
- [[Wiki/log]] — this entry
- [[TODO]] — Create Requirement task rewritten with full 4-step fix plan and Claude Code prompt instructions

**Notes:** Root cause is three compounding issues: FastAPI not deployed on Railway, frontend api() swallowing errors silently, and a type mismatch on experience_min. Path A (merge FastAPI into Flask) chosen over Path C (second Railway service) — pre-MVP, no reason for the operational overhead. Claude Code implementation prompt generated and ready to run.

---

## 2026-04-16 — Beroz Playwright E2E test report ingestion

**Skill:** [[AIOS/skills/ingest-source]]
**Sources processed:**
- [[Raw/docs/Beroz-Playwright-Test-Report-2026-04-15]] (Playwright E2E results — 30/31 passed, 1 reproducible bug)

**Wiki notes created:**
- [[Wiki/digests/Session-Beroz-E2E-Testing-2026-04-15]]

**Vault files updated:**
- [[Wiki/index]] — new digest entry + new raw source entry added
- [[Wiki/hot]] — Beroz section updated with test results; Create Requirement silent failure added as active blocker
- [[Wiki/log]] — this entry

**Notes:** Internal test report. No new concept notes warranted — the test findings are project-specific, not reusable frameworks. The one bug (Create Requirement fails silently, no Supabase write, no user feedback) is the key actionable output. Full reproduction steps and four root-cause hypotheses documented in the digest and the raw report. Bug should be resolved before or alongside the hybrid Juicebox UI build.

---

## 2026-04-15c — Beroz companion docs ingestion

**Skill:** [[AIOS/skills/ingest-source]]
**Sources processed:**
- [[Raw/docs/Beroz-Features-Guide-2026-04-15]] (feature & workflow guide — 10 pages, 8 agents, 5 skills, DB schema, env vars)
- [[Raw/docs/Beroz-Testing-Guide-2026-04-15]] (testing guide — test checklist, credentials, Railway debug tips)
- [[Raw/docs/Beroz-Workflow-Diagrams-2026-04-15]] (Mermaid diagrams — master pipeline, outreach/inbox, submission/approval, role-based access, agent routing)

**Vault files updated:**
- [[Efforts/ExcelTech-Automation/Overview]] — 2026-04-15 decision entry expanded with links to all 4 Beroz source docs
- [[Wiki/index]] — 3 new raw source entries added under Internal docs
- [[Wiki/hot]] — Beroz section updated with full source doc references
- [[Wiki/log]] — this entry

**Notes:** Three companion documents to the existing Beroz-Build-Session-2026-04-15 log. All internal work product — processed as Efforts update (no new Wiki concepts created). The features guide is the canonical reference for what each page does and which API it calls. The testing guide is the primary reference for the current deploy phase (testing + env var validation). The workflow diagrams are the clearest visual representation of the full recruitment pipeline and can be shared with stakeholders or used as onboarding material.

---

## 2026-04-15b — Juicebox teardown session ingestion

**Skill:** [[AIOS/skills/ingest-source]]
**Sources processed:**
- [[Raw/docs/Juicebox-Teardown-Session-2026-04-15]] (Cowork session log — Juicebox reverse-engineering, Playwright crawler, hybrid UI strategy)

**Wiki notes created:**
- [[Wiki/digests/Session-Juicebox-Teardown-2026-04-15]]
- [[Wiki/concepts/Authenticated-SPA-Capture]]
- [[Wiki/concepts/Search-First-SaaS-UI]]
- [[Wiki/techniques/Playwright-DOM-Crawling]]

**Wiki notes updated:**
- [[Wiki/index]] — added 2 concepts, 1 technique, 1 digest, 1 raw source
- [[Wiki/hot]] — rewritten to reflect Juicebox teardown as current priority, hybrid UI strategy, search-first insight
- [[Wiki/log]] — this entry

**Also produced (not wiki, but reference):**
- `NST/research/2026-04-14-juicebox-agent-teardown.md` — 700-line teardown document (design system, tech stack, components, build plan)
- `NST/research/juicebox-clone-prompt.md` — Claude Code prompt for building the UI
- `recruitment-agents/juicebox-crawler/` — Playwright crawler scripts + 43 HTML captures

**Notes:** This session's primary output is tooling and reference material, not wiki knowledge. The Playwright crawler and HTML captures are the high-value artifacts — they feed the next Claude Code build session. The wiki notes capture the reusable techniques (Authenticated-SPA-Capture, Playwright-DOM-Crawling) and the strategic insight (Search-First-SaaS-UI pattern) that apply beyond this specific project.

---

## 2026-04-15 — Beroz build session ingestion

**Skill:** [[AIOS/skills/ingest-source]]
**Sources processed:**
- [[Raw/docs/Beroz-Build-Session-2026-04-15]] (internal build session log — Juicebox clone, two-product architecture, full API map)

**Vault files updated:**
- [[Efforts/Niksho-SaaS-Product/Overview]] — added Beroz section, status changed from "planning" to "building", frontend strategy pivot documented
- [[Efforts/ExcelTech-Automation/Overview]] — added milestone 5b (Beroz frontend), new decision entry
- [[Efforts/Niksho-SaaS-Product/v2-Planning-Log]] — merged next steps from session (ExcelTech deploy + testing, SaaS multi-tenant wiring), added decision record and key references
- [[Wiki/hot]] — rewritten to reflect Beroz as the current priority

**Notes:** This was an internal build session log, not an external source. Processed as an Efforts update rather than Wiki extraction — the knowledge here is authored (architecture decisions, project structure) not compiled. No new Wiki concepts created. Connected to existing [[Wiki/concepts/Seven-Levels-of-Web-Design]] concept (user confirmed the design approach was inspired by it).

---

## 2026-04-14 — YouTube transcript batch ingestion (7th video: AI GTM Stack)

**Skill:** [[AIOS/skills/ingest-source]]
**Sources processed:**
- [[Raw/transcripts/YT-Transcripts-2026-04-14]] (Tab 7 appended: "3 MCPs, 2 AI tools to make $$ in the AI era")

**Wiki notes created:**
- [[Wiki/digests/YT-AI-GTM-Stack-2026-04-14]]
- [[Wiki/concepts/Agent-Traffic-Arbitrage]]
- [[Wiki/concepts/AI-GTM-Stack]]
- [[Wiki/tools/Idea-Browser]]
- [[Wiki/tools/Paper-Design]]
- [[Wiki/tools/Humbalytics]]

---

## 2026-04-14 — YouTube transcript batch ingestion (6 videos)

**Skill:** [[AIOS/skills/ingest-source]]
**Sources processed:**
- [[Raw/transcripts/YT-Transcripts-2026-04-14]] (6 tabs: strategic AI coding, senior dev review, elite websites, top 10 skills/plugins, agents & skills, context cleanup)
- [[Raw/docs/ExcelTech-Recruitment-Agent-Architecture-v3.html]] (v3 architecture doc, filed and versioned)
- [[Raw/clippings/context-audit-skill-bradley-bonanno]] (context-audit SKILL.md)
- [[Raw/docs/Claude-Code-Context-Cleanup-Guide.pdf]] (companion PDF guide)

**Wiki notes created:**
- [[Wiki/digests/YT-Strategic-AI-Coding-2026-04-14]]
- [[Wiki/digests/YT-Senior-Dev-Reviews-AI-App-2026-04-14]]
- [[Wiki/digests/YT-Elite-Websites-Claude-Code-2026-04-14]]
- [[Wiki/digests/YT-Top-10-Claude-Skills-Plugins-2026-04-14]]
- [[Wiki/digests/YT-Agents-Skills-Clearly-Explained-2026-04-14]]
- [[Wiki/digests/YT-Context-Cleanup-Claude-Code-2026-04-14]]
- [[Wiki/concepts/Progressive-Disclosure]]
- [[Wiki/concepts/Recursive-Skill-Building]]
- [[Wiki/concepts/Expert-In-The-Loop]]
- [[Wiki/concepts/Context-Window-Management]]
- [[Wiki/concepts/Scale-for-Productivity]]
- [[Wiki/concepts/File-Over-AI-Portable-Identity]]
- [[Wiki/concepts/Seven-Levels-of-Web-Design]]
- [[Wiki/concepts/Five-Filter-Rule-Audit]]

**Wiki notes updated:**
- [[Wiki/concepts/Context-Window-Management]] — added implementation specifics from Bradley Bonanno (MCP costs, settings.json, daily habits)

**Skill codified:**
- [[AIOS/skills/ingest-source]] — built using Recursive Skill Building methodology (walk through → successful run → codify → corrections → update)

**Notes:** First use of the hybrid digest + concept breakout approach. Tab 6 digest includes workflow visualisation diagrams (ASCII art showing context bloat architecture, progressive disclosure before/after, five-filter decision tree, daily habits flow). Visualisation pattern should be applied to future digests.

---

## 2026-04-11 — Sourcing troubleshooting ingestion

**Skill:** [[AIOS/skills/ingest-source]]
**Sources processed:**
- [[Raw/docs/sourcing-troubleshooting-2026-04-11]]

**Wiki notes created:**
- [[Wiki/concepts/Candidate-Sourcing-Channels]]
- [[Wiki/concepts/Bot-Detection-vs-Scraping]]
- [[Wiki/tools/Firecrawl]]
- [[Wiki/techniques/Direct-API-Interception]]
- [[Wiki/sources/sourcing-troubleshooting-2026-04-11]]

**Notes:** First ingestion of an internal troubleshooting doc (exception to the "only external research gets compiled" rule — this post-mortem contains reusable lessons about scraping, bot detection, and channel validation that apply beyond ExcelTech).

---

## 2026-04-10 — Initial ingestion pass

**Skill:** [[AIOS/skills/ingest-source]] (manual first pass)
**Sources processed:**
- [[Raw/clippings/karpathy-llm-knowledge-bases]]
- [[Raw/transcripts/YT-Transcripts-2026-04-10]]
- [[Raw/transcripts/YT-Transcripts-Batch-1]]

**Wiki notes created:**
- [[Wiki/concepts/LLM-Knowledge-Base]]
- [[Wiki/concepts/Compiler-Analogy]]
- [[Wiki/techniques/Hot-Cache]]
- [[Wiki/techniques/Linting-Wiki]]
- [[Wiki/tools/Obsidian-Web-Clipper]]
- [[Wiki/tools/Marp]]
- [[Wiki/tools/Claude-Memory-Compiler]]
- [[Wiki/people/Andrej-Karpathy]]
- [[Wiki/people/Nick-Milo]]
- [[Wiki/people/Cole-Medin]]

**Navigation files created:**
- [[Wiki/index]]
- [[Wiki/log]] (this file)
- [[Wiki/hot]]

**Known gaps / followups:**
- Full transcripts haven't been exhaustively mined — only the high-signal concepts have been lifted. A second pass should extract narrower techniques (e.g. Vin's slash-command patterns like /trace, /emerge, /challenge are scaffolded as AIOS skills but don't have wiki notes of their own yet).
- No wiki notes for the internal ExcelTech docs yet — they're authored into Atlas directly instead. Decision: internal company docs go straight to Atlas, not through the compile loop. Only external research gets compiled.
- Image handling is not implemented. Any source with embedded images is text-only for now.
