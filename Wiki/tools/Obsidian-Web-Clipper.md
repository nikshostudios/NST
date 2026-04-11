---
type: wiki-tool
generated-by: claude
sources: ["[[Raw/clippings/karpathy-llm-knowledge-bases]]"]
updated: 2026-04-10
---

# Obsidian Web Clipper

## What it is
An official Obsidian browser extension that captures web articles as markdown files directly into a target folder in your vault. Preserves formatting, handles images, and can apply a template per domain or page type.

## Why it matters to the Niksho second brain
This is the recommended "capture" tool for the Raw layer. When we see an article, paper, blog post, or tweet worth preserving:

1. Click the Web Clipper extension.
2. Clip directly into `Raw/clippings/`.
3. Frontmatter gets filled in (URL, title, captured date, tags).
4. The file is immediately available for [[AIOS/skills/ingest-source]] to compile into Wiki notes.

Karpathy specifically recommends it in his original tweet as his capture tool of choice for converting web articles into markdown files for the raw directory. See [[Raw/clippings/karpathy-llm-knowledge-bases]].

## Suggested setup for Niksho
- **Target folder:** `Raw/clippings/`
- **Default template:** frontmatter with `source-type`, `url`, `author`, `captured`, `captured-by`, `tags`
- **Image handling:** download images alongside the markdown so they live with the source
- **Naming convention:** `author-topic-slug.md` (lowercase, dashed)

## Workflow
1. See article worth keeping → click Web Clipper
2. File lands in `Raw/clippings/`
3. Later (on demand or batched), run [[AIOS/skills/ingest-source]] pointing at that file or folder
4. New/updated Wiki notes get written
5. Original clipping stays untouched forever ([[Atlas/Concepts/File-over-AI]] principle)

## Related
- [[Wiki/concepts/LLM-Knowledge-Base]]
- [[AIOS/skills/ingest-source]]
- [[Atlas/Concepts/File-over-AI]]
- [[Raw/clippings/karpathy-llm-knowledge-bases]]
