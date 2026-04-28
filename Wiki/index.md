---
type: wiki-index
generated-by: claude
updated: 2026-04-28
---

# Wiki — Index

The compiled layer of the vault. Every note here is distilled from sources in `Raw/` by [[AIOS/skills/ingest-source]]. Authored strategy and decisions live in [[Atlas/Atlas|Atlas]]; this folder is for concepts, techniques, tools, and people we've learned about from external material.

## Navigation shortcuts
- **By recency:** [[Wiki/log|log.md]] — append-only timeline of ingestion and edits
- **By freshness:** [[Wiki/hot|hot.md]] — small recency buffer for the current AI session
- **By source:** every wiki note's frontmatter has a `sources:` field linking back to the raw file(s)

## Concepts

Big ideas extracted from source material.

- [[Wiki/concepts/LLM-Knowledge-Base]] — Karpathy's raw → compile → wiki pattern
- [[Wiki/concepts/Compiler-Analogy]] — the source code → compile → executable mental model applied to knowledge
- [[Wiki/concepts/Candidate-Sourcing-Channels]] — the critical difference between candidate data and job posting data
- [[Wiki/concepts/Bot-Detection-vs-Scraping]] — fingerprinting, Akamai, and the reliability hierarchy for scraping
- [[Wiki/concepts/Progressive-Disclosure]] — skills load context on demand (~50 tokens) vs agent.md files (~900+ tokens every turn)
- [[Wiki/concepts/Recursive-Skill-Building]] — walk-through → codify → fail → fix → update loop for building robust skills
- [[Wiki/concepts/Expert-In-The-Loop]] — why "expert in the loop" ≠ "human in the loop" and what that means for agent design
- [[Wiki/concepts/Context-Window-Management]] — keep context lean: what fills the window, the degradation curve, practical rules
- [[Wiki/concepts/Scale-for-Productivity]] — start with 1 agent, build skills, add sub-agents only when justified
- [[Wiki/concepts/File-Over-AI-Portable-Identity]] — mi.md pattern: portable identity file any AI tool can read
- [[Wiki/concepts/Seven-Levels-of-Web-Design]] — progression from generic prompt output to custom 3D/WebGL
- [[Wiki/concepts/Five-Filter-Rule-Audit]] — systematic methodology for pruning CLAUDE.md rules (Default, Contradiction, Redundancy, Bandaid, Vague)
- [[Wiki/concepts/Agent-Traffic-Arbitrage]] — agents will outnumber humans on websites; early-mover opportunity in AI-native GTM
- [[Wiki/concepts/AI-GTM-Stack]] — Idea Browser → Paper → Humbalytics pipeline for AI-native go-to-market
- [[Wiki/concepts/Authenticated-SPA-Capture]] — extracting live DOM from OAuth-protected SPAs via DevTools or Playwright
- [[Wiki/concepts/Search-First-SaaS-UI]] — natural-language search as the primary interface pattern (vs dashboard-first)
- [[Wiki/concepts/Search-First-Hero-Mode-Chips]] — search-first homepage pattern with intent-capture mode chips + example queries + collapse-on-submit
- [[Wiki/concepts/Projects-as-Scoping-Primitive]] — Projects as the top-level scoping unit; access model + sidebar 3-zone encoding
- [[Wiki/concepts/Personal-Inbox-Outreach-Tracking]] — browser-extension pattern (Juicebox) for logging outreach from a recruiter's personal Gmail/Outlook back to the platform; the deliverability-vs-build-cost trade
- [[Wiki/concepts/Idempotent-Multi-Role-Handoff]] — backend 409 dedup + frontend pre-check + status propagation chain for multi-role approval workflows (submit-gate pattern)
- [[Wiki/concepts/Apollo-Pre-Reveal-Quality-Signals]] — has_email / has_direct_phone flags available at search tier (free); use them to gate paid /people/match reveal calls
- [[Wiki/concepts/Adaptive-Search-Progressive-Loosening]] — auto-broadening query strategy that walks ranked loosenings until result pool reaches minimum size; transparent iteration log
- [[Wiki/concepts/Email-Tracking-Trifecta]] — pixel + click rewrite + bounce parse + AI intent classification: the four-part pattern for honest outreach engagement metrics
- [[Wiki/concepts/Self-Diagnosing-Crawler]] — `doctor()` function + manual route override: permanent escape from DOM-heuristic-failure loops in Playwright crawlers
- [[Wiki/concepts/Crawl-Walkthrough-Capture-Pipeline]] — 3-layer pattern (crawl → walkthrough → targeted captures) for cloning authenticated SaaS apps; the methodology behind Beroz pure-clone

## Techniques

Specific methods we've learned.

- [[Wiki/techniques/Hot-Cache]] — small recency buffer for fresh session context
- [[Wiki/techniques/Linting-Wiki]] — LLM health-checks to keep the wiki clean
- [[Wiki/techniques/Direct-API-Interception]] — bypass headless browsers by calling SPA backend endpoints directly
- [[Wiki/techniques/Playwright-DOM-Crawling]] — automated multi-page DOM capture with session persistence for authenticated apps
- [[Wiki/techniques/Auto-Git-Pull-Hook]] — Claude Code `UserPromptSubmit` hook that runs `git pull --ff-only` to keep local in sync with GitHub

## Digests

Video/podcast summaries with extracted knowledge and Niksho relevance.

- [[Wiki/digests/YT-Strategic-AI-Coding-2026-04-14]] — strategic AI coding vs vibe coding: specificity, context, review discipline
- [[Wiki/digests/YT-Senior-Dev-Reviews-AI-App-2026-04-14]] — senior dev reviews AI-built app: security, testing, expert-in-the-loop
- [[Wiki/digests/YT-Elite-Websites-Claude-Code-2026-04-14]] — 7 levels of building elite websites: from generic to custom
- [[Wiki/digests/YT-Top-10-Claude-Skills-Plugins-2026-04-14]] — top 10 Claude Code skills, plugins & CLIs (April 2026)
- [[Wiki/digests/YT-Agents-Skills-Clearly-Explained-2026-04-14]] — Ross Mike on context management, progressive disclosure, recursive skill building
- [[Wiki/digests/YT-Context-Cleanup-Claude-Code-2026-04-14]] — Bradley Bonanno: context hygiene, MCP token cost, five-filter rule audit, settings optimization
- [[Wiki/digests/YT-AI-GTM-Stack-2026-04-14]] — Amir (Humbalytics): Idea Browser + Paper + Humbalytics pipeline, autonomous CRO agent, agent traffic arbitrage
- [[Wiki/digests/Session-Juicebox-Teardown-2026-04-15]] — Juicebox AI reverse-engineering: site teardown, Playwright crawler (43+ pages), hybrid UI strategy decision
- [[Wiki/digests/Session-Beroz-E2E-Testing-2026-04-15]] — Beroz Playwright E2E run: 30/31 passed, full stack confirmed healthy, 1 bug (Create Requirement silent failure)
- [[Wiki/digests/Session-Beroz-Fix-Analysis-2026-04-16]] — root cause analysis: 3 compounding issues (FastAPI not deployed, api() swallows errors, type mismatch), fix plan = Path A merge + api() fix + type fix + healthcheck
- [[Wiki/digests/Session-Beroz-Projects-Layer-2026-04-17]] — Projects layer + sidebar 3-zone restructure + Search hero shipped to production (commits 423a01e, 56ba201)
- [[Wiki/digests/Session-Beroz-Frontend-Planning-2026-04-17]] — planning artifact for the Projects layer ship: 4 TODOs (avatar dropdown, Projects nav, All Projects page, kill Agent Home), gating decision on Project ↔ Agent, deferred Chrome extension question
- [[Wiki/digests/Session-Beroz-Phase4-Phase5-2026-04-18]] — Phase 5 Submit-to-TL gate + Phase 4 Sequences wiring; full RCO lifecycle (Requirement → Source → Shortlist → Sequence → Submit to TL → TL approve + send) live end-to-end (commits ed63940, 717e523)
- [[Wiki/digests/Session-Beroz-Sequences-DB-Cleanup-2026-04-19]] — 8 commits: full multi-step sequence builder (5-table schema), DB cleanup (20→18 tables), several UX + infra improvements
- [[Wiki/digests/Session-Beroz-Sequences-Redesign-2026-04-26]] — Sequences end-to-end redesign: engagement tracking trifecta (pixel + click + bounce + AI intent), signature library, unsubscribe flow, overview/detail/editor rebuild, row 3-dot menu (Pin/Star/Clone/Archive). Shipped to repo, end-to-end verification pending.
- [[Wiki/digests/Session-Beroz-Apollo-MultiSource-2026-04-25]] — Apollo India audit (pipeline was fabricating data, Apollo is fine); 5 pipeline gates shipped; sourcing expanded from 4 to 7 channels (HF, Apify/LinkedIn, Apify/YC, Web Agent)
- [[Wiki/digests/Session-Beroz-Harvestapi-Haiku-2026-04-26]] — harvestapi normalizer fixed against live actor schema; Sonnet 4 → Haiku 4.5 swap for scoring (~12× cheaper, 2–3× faster)
- [[Wiki/digests/Session-Beroz-Feature-Test-2026-04-27]] — full feature test walkthrough (18 features, Tier 3 deferred); 15-item punch list; key finding: all 3 Searches tabs are the same component
- [[Wiki/digests/Session-Beroz-Clone-Capture-2026-04-28]] — strategy pivot to pure 1:1 clone (visual + IA), Playwright capture toolkit built and run against Juicebox, 11 pages + 7 flows captured, 102 API endpoints catalogued, IA confirmed (Project as primitive). Walkthrough kicked off, deferred for two-screen setup.

## Tools

Software and systems we reference.

- [[Wiki/tools/Obsidian-Web-Clipper]] — web article → markdown capture
- [[Wiki/tools/Marp]] — markdown → slide deck rendering inside Obsidian
- [[Wiki/tools/Claude-Memory-Compiler]] — Cole Medin's self-evolving Claude Code memory system
- [[Wiki/tools/Firecrawl]] — web scraping API, strong for content scraping, weak against bot-protected portals
- [[Wiki/tools/Idea-Browser]] — MCP-connected business context management; ICP, offer definition, built-in GTM skills
- [[Wiki/tools/Paper-Design]] — design-to-code intermediary connected to Claude Code; visual iteration → working code
- [[Wiki/tools/Humbalytics]] — analytics + AB testing operated by Claude via API; autonomous CRO agent capability

## Competitors

Direct and adjacent competitors analysed against Niksho's positioning.

- [[Wiki/competitors/X0PA-AI]] — Singapore-based AI recruitment platform (est. 2017). Strong on assessment, compliance, enterprise integrations. Weak on end-to-end recruiter workflow automation, job portal sourcing, outreach/follow-up. 29 features across 3 platforms.

## People

Humans whose work shaped how we think about this stuff.

- [[Wiki/people/Andrej-Karpathy]] — LLM Knowledge Base pattern
- [[Wiki/people/Nick-Milo]] — ACE framework, Ideaverse, MOCs
- [[Wiki/people/Cole-Medin]] — claude-memory-compiler, session hooks, compiler analogy

## Sources index

Raw material captured in the vault. This is the input side of the compile loop.

### Clippings
- [[Raw/clippings/karpathy-llm-knowledge-bases]] — Karpathy tweet + gist + Cole Medin repo notes

### Transcripts
- [[Raw/transcripts/YT-Transcripts-2026-04-10]] — Nick Milo AI OS, Cole Medin self-evolving memory, Claude inside Obsidian
- [[Raw/transcripts/YT-Transcripts-2026-04-14]] — strategic AI coding, senior dev review, elite websites, top 10 skills/plugins, agents & skills (Ross Mike), context cleanup (Bradley Bonanno), AI GTM stack (Amir/Humbalytics)
- [[Raw/transcripts/YT-Transcripts-Batch-1]] — Obsidian + Claude Code workflows, Karpathy wiki, Vin on Obsidian slash-commands

### Internal docs
- [[Raw/docs/ExcelTech_Master_Knowledge_Base]] — canonical business context
- [[Raw/docs/ExcelTech_Vision_and_Goals]] — phases, milestones, vision
- [[Raw/docs/sourcing-architecture]] — sourcing architecture doc
- [[Raw/docs/sourcing-troubleshooting-2026-04-11]] — production test post-mortem, 10 issues, sourcing channel validation failure
- [[Raw/docs/ExcelTech-Recruitment-Agent-Architecture-v3.html]] — v2 system architecture: 8 sourcing channels, 7 agents, 4 implementation phases
- [[Raw/docs/Beroz-Build-Session-2026-04-15]] — Beroz build session: Juicebox clone, two-product frontend, full API map, project structure
- [[Raw/docs/Beroz-Features-Guide-2026-04-15]] — Beroz feature & workflow reference: all 10 pages, 8 agents, 5 skills, DB schema, env vars
- [[Raw/docs/Beroz-Testing-Guide-2026-04-15]] — Beroz testing guide: test checklist, credentials, debugging, Railway deploy notes
- [[Raw/docs/Beroz-Playwright-Test-Report-2026-04-15]] — Beroz Playwright E2E results: 30/31 passed, Create Requirement bug documented with reproduction steps
- [[Raw/docs/Beroz-Playwright-Fix-Analysis-2026-04-16]] — root cause analysis for Create Requirement silent failure: 3 issues, Path A fix plan with code
- [[Raw/docs/Beroz-Workflow-Diagrams-2026-04-15]] — Beroz Mermaid diagrams: master pipeline, outreach/inbox, submission/approval, role-based access, agent routing
- [[Raw/docs/Beroz-RCO-Workflow-2026-04-17]] — Beroz RCO lifecycle from recruiter UI perspective: requirement flow, shortlist vs sequence, mass mail/export/get number actions, TL approval loop
- [[Raw/docs/Beroz-Session-2026-04-17]] — Beroz session log: Projects layer, sidebar 3-zone refactor, Search hero, avatar dropdown (commits 423a01e + 56ba201)
- [[Raw/docs/Beroz-Frontend-Planning-2026-04-17]] — planning session that preceded the Projects layer ship: 4 TODOs, Claude Code prompt, open Project ↔ Agent question, Chrome extension deferred
- [[Raw/docs/Beroz-Session-2026-04-18]] — Phase 5 Submit-to-TL + Phase 4 Sequences wiring session: full RCO lifecycle live, smoke-test checklist, file Δ table (commits ed63940, 717e523)
- [[Raw/docs/Beroz-Session-2026-04-25]] — Apollo India audit (3 sessions): audit data, 5 pipeline gates (commit 2a9bf84), 3 new sourcing channels — HF, Apify, Web Agent (commits 345d5c4, 52d5620, e597279)
- [[Raw/docs/Beroz-Session-2026-04-26]] — two sessions: (A) Sequences redesign + row 3-dot menu handoff (tracking schema, pixel/click/bounce/intent, signatures, unsubscribe, frontend rebuild — verification pending); (B) harvestapi normalizer fix (commit dd0e4f1) + Haiku 4.5 swap (commit 5b6916b)
- [[Raw/docs/Beroz-Feature-Test-Log-2026-04-27]] — full feature test: 18 features tested across Requirements/Searches/Sequences/Settings; 15-item punch list

### Competitor analysis
- [[Raw/docs/X0PA-AI-Recruiter-Features-2026-04-17]] — X0PA AI full feature extraction from sales deck (29 features, 3 platforms, Singapura Finance presentation)
- [[Raw/docs/Juicebox-Teardown-Session-2026-04-15]] — Juicebox teardown session: authenticated DOM capture, 700-line teardown doc, Playwright crawler, hybrid UI strategy

## How to add to this index
1. Ingest new sources via [[AIOS/skills/ingest-source]].
2. The ingestion skill updates this file automatically.
3. Manual edits to this file are fine but prefer the skill so [[Wiki/log|log.md]] reflects the change.

## Related
- [[AIOS/vault-map]]
- [[AIOS/skills/ingest-source]]
- [[AIOS/skills/lint-wiki]]
- [[Atlas/Concepts/AI-OS]]
