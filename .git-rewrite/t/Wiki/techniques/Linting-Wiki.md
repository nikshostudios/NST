---
type: wiki-technique
generated-by: claude
sources: ["[[Raw/clippings/karpathy-llm-knowledge-bases]]"]
updated: 2026-04-10
---

# Linting a Wiki

## What it is
Running periodic LLM health checks over a compiled wiki to find inconsistencies, missing data, broken links, orphan notes, stale updates, and opportunities for new concept articles. The software-engineering "lint" concept applied to a knowledge base.

Karpathy mentions this in his original LLM Knowledge Base tweet as a lightweight way to keep the wiki's data integrity high without manual audits.

## What a lint run checks

### Structural
- **Broken wikilinks.** Note links to `[[Foo]]` but no file called Foo.md exists.
- **Orphan notes.** Files that aren't linked from anywhere — including the index.
- **Duplicate concepts.** Two notes about the same idea, with slightly different names.
- **Missing frontmatter.** Files without required metadata (`type`, `updated`, `sources`).
- **Inconsistent tagging.** Tags that drift (`ai-os` vs `aios` vs `ai_os`).

### Content
- **Stale notes.** Files that haven't been updated in > N days, especially in active areas.
- **Incomplete summaries.** Notes that are shorter than they should be for their subject.
- **Missing sources.** Wiki notes without a `sources:` frontmatter field.
- **Contradictions.** Two notes that say incompatible things about the same concept.

### Opportunistic
- **Missing concepts.** Terms that appear in multiple notes but don't have their own concept file.
- **New backlink candidates.** Places where an existing wiki term is mentioned but not linked.
- **Rebuild the hot cache.** See [[Wiki/techniques/Hot-Cache]].

## How Niksho runs it
Implemented as [[AIOS/skills/lint-wiki]]. Invoked manually for now — e.g. "lint the wiki" — and may become scheduled later. The skill:

1. Walks the vault folder tree.
2. Parses frontmatter on every markdown file.
3. Builds an index of wikilinks → targets.
4. Runs each check above.
5. Produces a report: a list of issues, categorised by severity.
6. Rebuilds `Wiki/hot.md`.
7. Optionally auto-fixes the trivial issues (missing frontmatter, broken-link suggestions) if given permission.

## What it is NOT
- **Not a replacement for human editing.** Lint finds structural and hygiene issues. The actual content and quality of the notes is still the human's call (or the ingestion skill's call).
- **Not a full re-compilation.** Lint doesn't rewrite concept files from raw sources — that's [[AIOS/skills/ingest-source]]'s job.
- **Not real-time.** It's a batch job. Run it when you feel the vault has drifted.

## Why it matters
- **Wiki decay is the #1 killer of knowledge bases.** Things go stale, links break, notes become orphaned, the whole structure rots. Lint catches this early.
- **Trust.** If the vault is linted regularly, humans and AIs can trust it more. An unlinted vault is a liability.
- **Cheap.** One pass over a ~100 note vault costs pennies in tokens. The payoff compounds.

## Related
- [[Wiki/concepts/LLM-Knowledge-Base]]
- [[Wiki/techniques/Hot-Cache]]
- [[AIOS/skills/lint-wiki]]
- [[AIOS/skills/ingest-source]]

## Source
[[Raw/clippings/karpathy-llm-knowledge-bases]]
