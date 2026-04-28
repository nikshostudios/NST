---
type: wiki-person
generated-by: claude
sources: ["[[Raw/clippings/karpathy-llm-knowledge-bases]]"]
updated: 2026-04-10
---

# Andrej Karpathy

## Relevance to Niksho
Author of the **LLM Knowledge Base** pattern that forms one half of the Niksho second brain's architecture (the other half is Nick Milo's ACE). Specifically, his 2026 tweet and companion gist described the raw → compile → wiki loop that we adopted for the Raw/Wiki layers of this vault.

See [[Atlas/Concepts/AI-OS]] for how we blend his approach with Milo's.

## The contributions we built on
1. **The raw → compile → wiki pattern.** Source material → LLM compiler → compiled notes. See [[Wiki/concepts/LLM-Knowledge-Base]] and [[Wiki/concepts/Compiler-Analogy]].
2. **Backlinks + index > vector DBs at small scale.** His observation that a well-maintained index and follow-links outperform fancy RAG at ~100 articles / ~400k words. This is why we don't use a vector DB.
3. **Obsidian as the IDE.** Raw, compiled, visualisations, and derived outputs all viewable in one place.
4. **Linting as a first-class operation.** Periodic LLM health-checks to keep the wiki consistent. See [[Wiki/techniques/Linting-Wiki]].
5. **Alternative output formats.** Getting the LLM to render Marp slides and matplotlib images back into the vault, not just text answers. See [[Wiki/tools/Marp]].

## Sources
- [[Raw/clippings/karpathy-llm-knowledge-bases]] — captured verbatim tweet + gist reference

## Related
- [[Wiki/concepts/LLM-Knowledge-Base]]
- [[Wiki/concepts/Compiler-Analogy]]
- [[Wiki/techniques/Hot-Cache]]
- [[Wiki/techniques/Linting-Wiki]]
- [[Wiki/tools/Obsidian-Web-Clipper]]
- [[Wiki/tools/Marp]]
- [[Wiki/tools/Claude-Memory-Compiler]]
- [[Wiki/people/Cole-Medin]]
- [[Wiki/people/Nick-Milo]]
- [[Atlas/Concepts/AI-OS]]
