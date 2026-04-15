---
type: wiki-index
generated-by: claude
updated: 2026-04-15
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

## Techniques

Specific methods we've learned.

- [[Wiki/techniques/Hot-Cache]] — small recency buffer for fresh session context
- [[Wiki/techniques/Linting-Wiki]] — LLM health-checks to keep the wiki clean
- [[Wiki/techniques/Direct-API-Interception]] — bypass headless browsers by calling SPA backend endpoints directly

## Digests

Video/podcast summaries with extracted knowledge and Niksho relevance.

- [[Wiki/digests/YT-Strategic-AI-Coding-2026-04-14]] — strategic AI coding vs vibe coding: specificity, context, review discipline
- [[Wiki/digests/YT-Senior-Dev-Reviews-AI-App-2026-04-14]] — senior dev reviews AI-built app: security, testing, expert-in-the-loop
- [[Wiki/digests/YT-Elite-Websites-Claude-Code-2026-04-14]] — 7 levels of building elite websites: from generic to custom
- [[Wiki/digests/YT-Top-10-Claude-Skills-Plugins-2026-04-14]] — top 10 Claude Code skills, plugins & CLIs (April 2026)
- [[Wiki/digests/YT-Agents-Skills-Clearly-Explained-2026-04-14]] — Ross Mike on context management, progressive disclosure, recursive skill building
- [[Wiki/digests/YT-Context-Cleanup-Claude-Code-2026-04-14]] — Bradley Bonanno: context hygiene, MCP token cost, five-filter rule audit, settings optimization
- [[Wiki/digests/YT-AI-GTM-Stack-2026-04-14]] — Amir (Humbalytics): Idea Browser + Paper + Humbalytics pipeline, autonomous CRO agent, agent traffic arbitrage

## Tools

Software and systems we reference.

- [[Wiki/tools/Obsidian-Web-Clipper]] — web article → markdown capture
- [[Wiki/tools/Marp]] — markdown → slide deck rendering inside Obsidian
- [[Wiki/tools/Claude-Memory-Compiler]] — Cole Medin's self-evolving Claude Code memory system
- [[Wiki/tools/Firecrawl]] — web scraping API, strong for content scraping, weak against bot-protected portals
- [[Wiki/tools/Idea-Browser]] — MCP-connected business context management; ICP, offer definition, built-in GTM skills
- [[Wiki/tools/Paper-Design]] — design-to-code intermediary connected to Claude Code; visual iteration → working code
- [[Wiki/tools/Humbalytics]] — analytics + AB testing operated by Claude via API; autonomous CRO agent capability

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

## How to add to this index
1. Ingest new sources via [[AIOS/skills/ingest-source]].
2. The ingestion skill updates this file automatically.
3. Manual edits to this file are fine but prefer the skill so [[Wiki/log|log.md]] reflects the change.

## Related
- [[AIOS/vault-map]]
- [[AIOS/skills/ingest-source]]
- [[AIOS/skills/lint-wiki]]
- [[Atlas/Concepts/AI-OS]]
