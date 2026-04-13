---
type: wiki-concept
generated-by: claude
sources: ["[[Raw/transcripts/YT-Transcripts-2026-04-14]]", "[[Raw/clippings/context-audit-skill-bradley-bonanno]]"]
updated: 2026-04-14
tags: [context-management, claude-md, optimization, methodology]
---

# Five-Filter Rule Audit

## What it is

A systematic methodology for pruning rules from CLAUDE.md (or any agent instruction file) by testing each rule against five filters. If a rule fails any single filter, it should be cut. The goal is a lean instruction set where every rule earns its place in the context window.

## The five filters

1. **Default** — Does the model already do this without being told? Rules like "write clean code" or "handle errors properly" are default behaviour for modern LLMs. They waste tokens restating what the model already knows from training.

2. **Contradiction** — Does this rule conflict with another rule in the same file or across files? Example: "Be concise" + "Always explain your reasoning in detail." The model can't satisfy both, picks one randomly, and you get inconsistent output without knowing why.

3. **Redundancy** — Is this already covered elsewhere? Multiple rules saying variations of the same thing ("be concise" + "keep it short" + "don't be verbose") bloat the file without adding signal.

4. **Bandaid** — Was this rule added to fix one specific bad output rather than improve outputs generally? Bandaid rules are reactive patches that often don't generalise and clutter the instruction set.

5. **Vague** — Would the model interpret this differently every time? Rules like "be natural" or "use a good tone" are too subjective to produce consistent output. Either make them specific ("use a conversational tone, avoid jargon, write at a 10th-grade reading level") or cut them.

## How to apply it

```
For each rule in CLAUDE.md:
  │
  ├─ Pass all 5 filters?  →  KEEP
  │
  └─ Fail any filter?     →  CUT
       │
       └─ Be ruthless. Cut more than you think you should.
          Add back only what you notice is missing later.
```

The same filters apply to skill instructions — verbose skills (400-800 lines) should be run through these filters too.

## Why it matters

Every token in CLAUDE.md is loaded into context at every turn. A 5,000-token file means 5,000 tokens of overhead on every single message, compounding across the conversation. By applying these filters, you might reduce to ~500 tokens of core rules + one-line pointers to reference files (see [[Wiki/concepts/Progressive-Disclosure]]).

## Relevance to Niksho

Our `mi.md` and CLAUDE.md should be periodically audited with these filters. Specific checks:
- Are any rules in `mi.md` things Claude already does by default? (e.g. "write clear documentation")
- Do any rules across `mi.md`, `CLAUDE.md`, and `Home.md` contradict each other?
- Are there vague instructions that Claude would interpret differently each session?

The context-audit skill ([[Raw/clippings/context-audit-skill-bradley-bonanno]]) automates this check.

## Related

- [[Wiki/concepts/Context-Window-Management]] — the broader principle this methodology serves
- [[Wiki/concepts/Progressive-Disclosure]] — what to do with rules you cut: move them to reference files
- [[Wiki/digests/YT-Context-Cleanup-Claude-Code-2026-04-14]] — the source video explaining this methodology
- [[Wiki/digests/YT-Agents-Skills-Clearly-Explained-2026-04-14]] — Ross Mike's "95% don't need agent.md" reinforces this
- [[Raw/clippings/context-audit-skill-bradley-bonanno]] — the skill that automates these filters
