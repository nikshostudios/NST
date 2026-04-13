---
type: wiki-concept
generated-by: claude
sources: ["[[Raw/transcripts/YT-Transcripts-2026-04-14]]"]
updated: 2026-04-14
tags: [context-management, skills, tokens, agent-architecture]
---

# Progressive Disclosure

## What it is

A context management pattern where only the name and description of a skill (~50 tokens) are loaded into the agent's context window at each turn. The full skill content is only loaded when the agent recognises it needs that skill. This contrasts with agent.md/claude.md files which load their entire content (~900+ tokens) at every single turn regardless of relevance.

## Why it matters

Context windows have a practical limit. As they fill up (approaching 250K tokens), model performance degrades — the agent gets "dumber." Every unnecessary token in context is wasted money and reduced quality. Progressive disclosure keeps the window lean by only expanding skill content on demand.

**The math (from Ross Mike):** A 944-token skill file as an agent.md → 944 tokens every turn. The same content as a skill → 53 tokens (name + description) until needed. That's an 18x reduction in per-turn context cost.

## How it works in practice

1. Agent starts a turn. Context includes: system prompt, agent.md (if any), skill names + descriptions, tools, codebase, conversation history.
2. User asks "create a notion report."
3. Agent scans its skill list. Sees: `name: notion-report`, `description: generates structured reports in Notion format`.
4. Agent decides it needs this skill. Only now does it load the full skill.md content.
5. Agent executes using the full instructions.
6. On the next turn, if the skill isn't relevant, it's back to just name + description.

## Implications for Niksho

Our `claude.md` is currently a pointer to `mi.md`, which is ~137 lines. That's loaded every turn. The vault-map is another large file. Following the progressive disclosure principle, most of `mi.md` should be converted to skills — only the essential identity/tone/guardrails stay in the always-loaded file. Business context, product architecture, workflow instructions → skills.

## Related

- [[Wiki/concepts/Recursive-Skill-Building]] — how to build the skills that benefit from progressive disclosure
- [[Wiki/digests/YT-Agents-Skills-Clearly-Explained-2026-04-14]] — full context from Ross Mike
- [[Atlas/Concepts/AI-OS]] — how the vault's AI layer is structured
- [[mi]] — the file most affected by this principle
