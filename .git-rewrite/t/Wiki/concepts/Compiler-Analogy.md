---
type: wiki-concept
generated-by: claude
sources: ["[[Raw/clippings/karpathy-llm-knowledge-bases]]", "[[Raw/transcripts/YT-Transcripts-2026-04-10]]"]
updated: 2026-04-10
---

# Compiler Analogy

## The idea in one line
Raw source material → LLM compiler → wiki is the same shape as source code → compiler → executable. Once you see it, the whole knowledge base pattern becomes obvious.

## The mapping

| Software engineering | Knowledge base |
|---|---|
| Source code (`.c`, `.py`) | Raw source material (`.md`, `.pdf`, transcripts) |
| Compiler / interpreter | LLM + prompt |
| Executable / binary | Compiled wiki notes |
| `make` / build system | [[AIOS/skills/ingest-source]] and [[AIOS/skills/lint-wiki]] |
| Linker | Backlinks + index.md |
| Lint / type checker | Wiki linting skill |
| Recompilation on change | Re-running ingest-source on modified raw |

## Who articulated it
- **Andrej Karpathy** — introduced the overall raw → wiki compiler pattern ([[Raw/clippings/karpathy-llm-knowledge-bases]]).
- **Cole Medin** — made the analogy explicit in his [claude-memory-compiler](https://github.com/coleam00/claude-memory-compiler) project, specifically applied to Claude Code session logs as the "raw" input.

## Why it's useful
- **It tells you where the effort should go.** Source code is where developer time goes, not binaries. Similarly, the human's time goes into Raw + Atlas, not into the Wiki — the Wiki is generated.
- **It tells you what's sacred.** You don't edit the compiled binary; you edit the source and recompile. Same here: Raw is read-only, edits happen upstream or in Atlas.
- **It tells you what can be thrown away and regenerated.** The wiki is fungible. If it gets out of date, you recompile. This removes the "preciousness" of AI-written notes that can paralyse knowledge workers.
- **It scales to self-evolving systems.** Cole's application to session logs means every AI conversation becomes raw input, and the wiki compounds automatically.

## How Niksho uses it
- `Raw/` is the source tree. Sacred. Read-only.
- `Wiki/` is the build output. Regeneratable via [[AIOS/skills/ingest-source]].
- `Atlas/` is the human-authored code that doesn't get "compiled" — like handwritten assembly or hand-tuned libraries.
- `AIOS/` is the build system — the skills and vault map that describe how the compilation works.

See [[Atlas/Concepts/AI-OS]] for the full picture.

## Related
- [[Wiki/concepts/LLM-Knowledge-Base]]
- [[Wiki/tools/Claude-Memory-Compiler]]
- [[Wiki/people/Andrej-Karpathy]]
- [[Wiki/people/Cole-Medin]]
- [[Atlas/Concepts/AI-OS]]
- [[Atlas/Concepts/File-over-AI]]

## Sources
- [[Raw/clippings/karpathy-llm-knowledge-bases]]
- [[Raw/transcripts/YT-Transcripts-2026-04-10]]
