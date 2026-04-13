---
type: wiki-log
generated-by: claude
updated: 2026-04-10
---

# Wiki — Log

Append-only timeline of ingestion and wiki edits. New entries at the top.

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
