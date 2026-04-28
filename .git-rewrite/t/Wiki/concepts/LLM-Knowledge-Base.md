---
type: wiki-concept
generated-by: claude
sources: ["[[Raw/clippings/karpathy-llm-knowledge-bases]]"]
updated: 2026-04-10
---

# LLM Knowledge Base

## What it is
A personal knowledge base where the source material (articles, papers, repos, images) lives in a `raw/` directory, and an LLM incrementally "compiles" it into a wiki of markdown files — summaries, concepts, backlinks, and articles — that the same LLM can then query against.

Popularised by Andrej Karpathy in a 2026 tweet (archived verbatim in [[Raw/clippings/karpathy-llm-knowledge-bases]]).

## The loop
1. **Ingest.** Drop a source into `raw/` — a paper, a web clipping (via Obsidian Web Clipper), a transcript, a repo snapshot.
2. **Compile.** Run an LLM over the new source to extract concepts, summarise, cross-link, and write/update `.md` files in the wiki.
3. **Query.** Ask the LLM questions against the wiki. The LLM navigates via index files, backlinks, and follow-links — no vector DB needed at Karpathy's scale (~100 articles, ~400k words).
4. **Output.** Answers come back as new markdown, rendered slides (Marp), or matplotlib images — all of which can be "filed back" into the wiki.
5. **Lint.** Periodic health checks find inconsistencies, missing data, broken links, orphan notes, and suggest new concepts.

## Why it works at small-to-mid scale
- No vector database means no reindexing pipeline, no embedding model, no staleness.
- Wikilinks + well-maintained index.md files give the LLM fast navigation.
- The compiler pattern means raw sources are preserved exactly — you can always recompile.
- Token cost is low because you're querying against distilled notes, not raw sources.

## Why it matters for Niksho
This is the architectural pattern underneath the Niksho second brain's Raw → Wiki pipeline. See [[Atlas/Concepts/AI-OS]] for how we blend it with Nick Milo's authored ACE approach. Concrete adoption:

- `Raw/` holds every source we consume. Never edited.
- `Wiki/` holds compiled notes, written by AI via [[AIOS/skills/ingest-source]].
- `Wiki/index.md` is the navigation spine.
- `Wiki/hot.md` is the recency buffer ([[Wiki/techniques/Hot-Cache]]).
- [[AIOS/skills/lint-wiki]] implements Karpathy's "linting" step.

## Related concepts
- [[Wiki/concepts/Compiler-Analogy]] — the source → compile → executable mental model
- [[Wiki/techniques/Linting-Wiki]] — the health-check pattern
- [[Wiki/techniques/Hot-Cache]] — recency buffer for fresh context
- [[Wiki/tools/Obsidian-Web-Clipper]] — how sources get into raw/
- [[Wiki/tools/Claude-Memory-Compiler]] — Cole Medin's reference implementation
- [[Wiki/people/Andrej-Karpathy]] — the author of the concept
- [[Atlas/Concepts/AI-OS]] — Niksho's adapted version

## Source
[[Raw/clippings/karpathy-llm-knowledge-bases]]
