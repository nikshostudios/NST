---
type: wiki-tool
generated-by: claude
sources: ["[[Raw/clippings/karpathy-llm-knowledge-bases]]"]
updated: 2026-04-10
---

# Marp

## What it is
Marp (Markdown Presentation Ecosystem) is a tool that converts markdown files into slide decks. It has an Obsidian plugin that renders Marp-formatted markdown as slides inline in the vault.

## Why it matters
Karpathy mentions Marp in his LLM Knowledge Base tweet as one of the "alternative output formats" he likes to have the LLM render. Instead of the LLM answering a question in plain text, it can produce a Marp slide deck that renders inside Obsidian — a different view of the same knowledge.

For Niksho, this is relevant in two ways:
1. **Internal synthesis.** When we need a talk, a pitch, or a walkthrough of a concept, we can ask Claude to write Marp-formatted markdown instead of prose, and render it inline.
2. **Future feature idea.** For the SaaS product, a Marp-style "render my workflow as a deck" feature could be a differentiator for customer success teams onboarding new agencies.

## Basic Marp syntax
```markdown
---
marp: true
theme: default
---

# Slide 1 title
Content here.

---

# Slide 2 title
- bullet
- bullet
```

Each `---` is a slide break. Themes can be customised. Speaker notes go in `<!-- notes -->` comments.

## How to use it in Niksho
Not a core tool yet. Available if we want it. The pptx skill is the preferred path for polished decks (see [[AIOS/skills-map]]) — Marp is for quick, rough "LLM-rendered" visual outputs that still live inside the vault as markdown.

## Related
- [[Wiki/concepts/LLM-Knowledge-Base]]
- [[Wiki/people/Andrej-Karpathy]]
- [[Raw/clippings/karpathy-llm-knowledge-bases]]
