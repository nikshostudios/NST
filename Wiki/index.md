---
type: wiki-index
generated-by: claude
updated: 2026-04-17
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
