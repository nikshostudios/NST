---
type: wiki-person
generated-by: claude
sources: ["[[Raw/clippings/karpathy-llm-knowledge-bases]]", "[[Raw/transcripts/YT-Transcripts-2026-04-10]]"]
updated: 2026-04-10
---

# Cole Medin

## Relevance to Niksho
Creator of **claude-memory-compiler** ([[Wiki/tools/Claude-Memory-Compiler]]), the closest existing reference implementation of what Niksho's second brain wants to be. He took Karpathy's external-research pattern and turned it inward — applying it to Claude Code session logs as a self-evolving memory system.

## The contributions we built on
1. **Applied Karpathy's pattern to internal data.** Session logs as `raw/`, a compiled wiki as the memory. This unlocks a use case Karpathy's original approach didn't cover.
2. **Session hooks as the capture mechanism.** session-start / pre-compact / session-end — a clean, minimal API for making memory compounding automatic. We scaffold for these in our AIOS layer even though we haven't implemented them yet.
3. **`agents.md` as a single entry point.** One file that describes the whole system to any agent. We adapted this into [[AIOS/vault-map]] and [[mi]].
4. **The compiler analogy made explicit.** Cole called it a "compiler" which cleanly maps the mental model.
5. **Daily flush, not synchronous compile.** Batch the compilation overnight instead of doing it mid-session. Cheaper, less noisy, more reviewable.

## What we kept
- The compiler pattern
- The hook architecture (planned for implementation)
- The compounding-memory framing
- The idea that the wiki gets smarter with use, not with manual editing

## What we diverged from
- Cole's is Claude Code-specific; ours is tool-agnostic
- Ours includes external research (Karpathy-style), not just internal session logs
- Ours has an authored Atlas layer (Milo-style), not only compiled wiki

## Sources
- https://github.com/coleam00/claude-memory-compiler
- [[Raw/transcripts/YT-Transcripts-2026-04-10]] (Tab 4 — the walkthrough video)
- [[Raw/clippings/karpathy-llm-knowledge-bases]]

## Related
- [[Wiki/tools/Claude-Memory-Compiler]]
- [[Wiki/people/Andrej-Karpathy]]
- [[Wiki/people/Nick-Milo]]
- [[Wiki/concepts/LLM-Knowledge-Base]]
- [[Wiki/concepts/Compiler-Analogy]]
- [[Atlas/Concepts/AI-OS]]
