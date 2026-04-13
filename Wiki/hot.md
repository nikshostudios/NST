---
type: wiki-hot-cache
generated-by: claude
updated: 2026-04-14
max-words: 1000
---

# Wiki — Hot Cache

Small recency buffer. Rewritten by [[AIOS/skills/lint-wiki]] whenever it runs. If you're an AI reading this first, this is the current state of what matters most.

---

## Right now — 2026-04-14

### v2 System Architecture designed
Full v2 architecture designed on April 13: 8 sourcing channels, 7 agents (5 enhanced + 2 new: JD Parser, Reactivation), 4 implementation phases. Foundit EDGE API replaces cookie scraping. Phone-first enrichment strategy. BD add-on as separate optional module. See [[Raw/docs/ExcelTech-Recruitment-Agent-Architecture-v3.html]].

**Phase 1 priority (weeks 1-4):** Migrate to Foundit EDGE API (blocked on API key from Prayag), ship JD Parser agent, fix Screener salary logic, Excel CRM export.

### Knowledge ingestion — April 14
7 YouTube transcripts ingested covering: strategic AI coding, senior dev code review patterns, elite website building progression, Claude Code tooling ecosystem, agent/skill architecture (Ross Mike), and context cleanup / token optimization (Bradley Bonanno). Key concepts extracted: [[Wiki/concepts/Progressive-Disclosure]], [[Wiki/concepts/Recursive-Skill-Building]], [[Wiki/concepts/Expert-In-The-Loop]], [[Wiki/concepts/Five-Filter-Rule-Audit]].

**Actionable insight — context hygiene:** Our MCP setup (Notion, Gmail, Canva, Figma, Apollo, Google Drive, etc.) loads ~18K tokens per server every turn. Disconnecting unused servers per session is the biggest quick win. Additionally: `mi.md` should be audited with the five-filter methodology, and settings.json needs autocompact override (75%), BASH_MAX_OUTPUT_LENGTH (150000), and deny rules. See [[Wiki/digests/YT-Context-Cleanup-Claude-Code-2026-04-14]].

### In motion (by intensity)
- 🔥 **Active** — [[Efforts/ExcelTech-Automation/Overview|ExcelTech Automation]] — production deployed, v2 architecture designed. [[Efforts/Niksho-SaaS-Product/Overview|Niksho SaaS Product]] — v2 architecture + Foundit EDGE API integration spec complete.
- 🌀 **Ongoing** — [[Efforts/Second-Brain-Setup/Overview|Second Brain Setup]] shipped v1, maintenance mode. Obsidian-ingest skill being built.
- 💤 **Sleeping** — [[Efforts/Fundraising/Prep-2027|Fundraising 2027]].

### Freshly added to Wiki (April 14)
- [[Wiki/concepts/Progressive-Disclosure]] — skills load context on demand vs agent.md every turn
- [[Wiki/concepts/Recursive-Skill-Building]] — the walk-through → codify → fail → fix → update methodology
- [[Wiki/concepts/Expert-In-The-Loop]] — expert validation vs rubber-stamp human approval
- [[Wiki/digests/YT-Strategic-AI-Coding-2026-04-14]] — coding with AI, not vibe coding
- [[Wiki/digests/YT-Senior-Dev-Reviews-AI-App-2026-04-14]] — production readiness gaps in AI-built apps
- [[Wiki/digests/YT-Elite-Websites-Claude-Code-2026-04-14]] — 7-level progression for web design quality
- [[Wiki/digests/YT-Top-10-Claude-Skills-Plugins-2026-04-14]] — tooling: Codeex, AutoResearch, Playwright CLI, Skill Creator, LightRAG, GWS
- [[Wiki/digests/YT-Agents-Skills-Clearly-Explained-2026-04-14]] — Ross Mike on context, skills, scaling for productivity
- [[Wiki/digests/YT-Context-Cleanup-Claude-Code-2026-04-14]] — Bradley Bonanno: MCP costs, five-filter audit, settings.json, daily habits
- [[Wiki/concepts/Five-Filter-Rule-Audit]] — the 5-question test for every CLAUDE.md rule
- [[Wiki/digests/YT-AI-GTM-Stack-2026-04-14]] — Amir: Idea Browser → Paper → Humbalytics, autonomous CRO agent, agent traffic arbitrage
- [[Wiki/concepts/Agent-Traffic-Arbitrage]] — agents will outnumber humans on websites; early-mover opportunity RIGHT NOW
- [[Wiki/concepts/AI-GTM-Stack]] — the full AI-native GTM pipeline
- [[Wiki/tools/Humbalytics]], [[Wiki/tools/Idea-Browser]], [[Wiki/tools/Paper-Design]] — the three tools in the stack

### Open decisions affecting the next session
- **Foundit EDGE API key** — blocked on Prayag providing the API key. Once received, Phase 1 can start.
- Apollo.io: Basic ($49/mo) vs Professional ($79/mo) — depends on monthly credit needs
- Naukri RMS: does ExcelTech already have a subscription? (Ask Nik's dad)
- **CLAUDE.md / mi.md audit** — run the five-filter rule audit on mi.md, strip it down, convert sections to skills. Also audit MCP server overhead and add settings.json tweaks. (Planned for follow-up session — see [[Wiki/digests/YT-Context-Cleanup-Claude-Code-2026-04-14]])

### Open blockers
- **Foundit EDGE API key** — need from Prayag to start Phase 1.
- **Pending commits** — `upsert_candidate_by_name`, pipeline count fix, pipeline query limit are deployed but NOT pushed to GitHub.

### Guardrails for the AI reading this
- Do not edit anything in `Raw/`. It is sacred.
- Do not auto-send any email from any code path.
- Do not build or suggest LinkedIn scraping. Ever.
- Do not rewrite the Railway codebase for architectural purity. Extend in `/ai-agents/` or as new FastAPI routes.
- Always add `generated-by: <tool>` frontmatter to AI-authored files.

See [[mi]] for the full guardrail set.

---

_Updated on 2026-04-14 — 6th video transcript (context cleanup) ingested, Five-Filter-Rule-Audit concept added, Context-Window-Management concept updated with implementation specifics. Total: 6 transcripts processed, 8 concepts + 6 digests in Wiki. Next rewrite: next time [[AIOS/skills/lint-wiki]] runs._
