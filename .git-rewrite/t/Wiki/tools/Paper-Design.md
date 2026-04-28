---
type: wiki-tool
generated-by: claude
sources: ["[[Raw/transcripts/YT-Transcripts-2026-04-14]]"]
updated: 2026-04-14
tags: [tools, design, mcp, landing-pages, claude-code]
---

# Paper (Design Tool)

## What it is

A visual design tool connected to Claude Code as an MCP. Serves as the intermediary between design and code — build layout iterations visually, then Claude ports the confirmed design to working code. Replaces the Figma → developer handoff workflow for AI-native builders.

## Why it exists

Prompting for design directly in code (no visual feedback) leads to inconsistent output. Static Figma assets require a developer to implement. Paper fills the gap: visual iteration → code output in one connected workflow. Non-designers can make layout tweaks without going back to the terminal.

Figma launched a bidirectional MCP (design ↔ code) as a competitor, but Paper's UX is currently smoother for the Claude Code workflow.

## Where it fits

Part of the [[Wiki/concepts/AI-GTM-Stack]]. Layer 2 (design) of the Idea Browser → Paper → Humbalytics pipeline.

## Related

- [[Wiki/tools/Idea-Browser]] — context layer before design
- [[Wiki/tools/Humbalytics]] — analytics layer after launch
- [[Wiki/concepts/AI-GTM-Stack]] — the full pipeline
- [[Wiki/digests/YT-AI-GTM-Stack-2026-04-14]] — source video
- [[Wiki/digests/YT-Elite-Websites-Claude-Code-2026-04-14]] — complementary approach to high-quality web design
