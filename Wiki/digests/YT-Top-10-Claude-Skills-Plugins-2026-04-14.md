---
type: wiki-digest
generated-by: claude
sources: ["[[Raw/transcripts/YT-Transcripts-2026-04-14]]"]
video: "Top 10 Claude Code Skills, Plugins & CLIs (April 2026)"
tab: 4
date: 2026-04-14
updated: 2026-04-14
tags: [claude-code, skills, plugins, cli-tools, tooling]
---

# Top 10 Claude Code Skills, Plugins & CLIs (April 2026)

Source: Tab 4 of [[Raw/transcripts/YT-Transcripts-2026-04-14]]

## The list

**1. Codeex Plugin** — combines Claude with CodeX (OpenAI) for adversarial code review. Claude looks favourably on its own code; a second model provides honest critique. Commands: `codeex claude adversarial review`, `codeex rescue`. Needs an OpenAI account.

**2. Obsidian + Obsidian Skills** — free markdown-based knowledge organisation. Creates knowledge graphs and a mini RAG system. Install the Obsidian skills from the CEO's GitHub repo. Claude Code opens inside the vault folder and manages notes, backlinks, and structure. This is literally what we're building right now.

**3. AutoResearch** — ML algorithm in a box for optimisation. Installs locally, runs automated experiments against any program or skill, commits improvements, discards failures. Perfect for iteratively improving products over time. Directly relevant to [[Wiki/concepts/Recursive-Skill-Building]].

**4. Awesome Design.md** — repo (38K stars in first week) that takes popular site designs (Claude, 11 Labs, Figma, Notion) and converts them to detailed markdown prompt files. Each file is a structured design template. Use as a foundation instead of prompting from scratch. Related to Level 4-5 in [[Wiki/digests/YT-Elite-Websites-Claude-Code-2026-04-14]].

**5. Firecrawl CLI + Skill** — web scraping that bypasses anti-bot protection, returns structured data for LLMs. Open-source version available. Already in our stack — see [[Wiki/tools/Firecrawl]]. The CLI version is more capable than the API-only integration we currently use.

**6. Playwright CLI (not MCP)** — browser automation, newer and better than the Playwright MCP. Works with the accessibility tree (code level), not screenshots. Cheaper and more effective than Claude in Chrome for automated web interaction. Use for any website manipulation task.

**7. NotebookLM-Pine CLI** — hooks Claude Code to NotebookLM web app (no official API). Enables batch downloads, slide revision, full text access, programmatic sharing. Analysis offloaded to Google servers = saves tokens.

**8. Skill Creator Skill (flagged as most important)** — doesn't just create skills, measures their performance. Runs benchmarks and A/B tests: with-skill vs without-skill, before-improvement vs after-improvement. Quantifiable impact measurement. We already have this installed — worth using more deliberately.

**9. LightRAG** — open-source graph RAG system. More robust than Obsidian-based knowledge management at scale. Free and lightweight vs expensive Microsoft graph RAG. Use when: thousands of documents, client projects, beyond Obsidian scale. Potential future tool if the Niksho vault outgrows the current structure.

**10. GWS (Google Workspace Suite) CLI** — not an official Google product but built by Google developers. Connects Claude Code to Gmail, Docs, Calendar, Drive. 30+ pre-built skills for common workflows. Technical setup required (Google Cloud configuration).

## Installation pattern

Most follow the same pattern: copy command from GitHub, run in Claude Code terminal. Skills: copy URL, paste into Claude Code, request installation.

## Relevance to Niksho

Immediate value: **Skill Creator** (measure our obsidian-ingest skill once built), **Playwright CLI** (potential replacement for Firecrawl on Foundit if EDGE API has issues), **Obsidian + Skills** (what we're actively building). Medium-term: **LightRAG** if the vault scales past Obsidian's comfortable range, **Codeex** for adversarial review of agent code before production deploys.

## See also

- [[Wiki/concepts/Progressive-Disclosure]] — why skills > agent.md files (context management)
- [[Wiki/concepts/Recursive-Skill-Building]] — the methodology for building skills properly
- [[Wiki/tools/Firecrawl]] — existing tool note, updated context from this video
