---
type: wiki-concept
generated-by: claude
sources: ["[[Raw/transcripts/YT-Transcripts-2026-04-14]]"]
updated: 2026-04-14
tags: [ai-os, portability, obsidian, knowledge-management]
---

# File Over AI — Portable Identity (mi.md Pattern)

## What it is

An extension of the [[Atlas/Concepts/File-over-AI]] principle specifically applied to AI identity files. Instead of using tool-specific config files (claude.md, cursor rules, warp.md), you create a single portable identity file — `mi.md` — that any AI tool can read. Tool-specific files become thin pointers to it.

Nick Milo's AI OS framework (Tab 3) formalises this as a 3-layer system:
1. **Layer 1: Your Ideaverse** — your notes, ideas, connections in plain files (ACE structure)
2. **Layer 2: Your Maps** — `mi.md` (who you are) + `vault-map.md` (how to navigate) + `skills-map.md` (processes) — the translation layer between your knowledge and any AI tool
3. **Layer 3: Your Tools** — Claude, Obsidian, OpenClaw, etc. — the most replaceable layer

## Why it matters

If you spend hundreds of hours setting up preferences in Claude only to have the tool go offline or pivot, you've lost your workflow. With `mi.md` as the source of truth and tool-specific files as thin pointers, switching to a new AI tool means changing one pointer — not rebuilding your entire setup.

## How we already do this

Our vault already implements this pattern:
- `mi.md` — the portable identity ([[mi]])
- `claude.md` — thin pointer that says "go read mi.md"
- `AIOS/vault-map` — navigation manual
- `AIOS/skills-map` — skill registry

This was designed before watching these videos — validation that the architecture is sound.

## Related

- [[Atlas/Concepts/File-over-AI]] — the parent principle (markdown + git as the only portable substrate)
- [[Atlas/Concepts/AI-OS]] — the hybrid architecture we built
- [[Wiki/digests/YT-Agents-Skills-Clearly-Explained-2026-04-14]] — why agent.md files are wasteful
- [[Wiki/people/Nick-Milo]] — ACE framework, Ideaverse
- [[mi]] — our implementation
