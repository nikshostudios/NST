---
skill: ingest-source
triggers: ["ingest this", "process raw", "add to wiki", "new source in raw"]
reads: [Raw/, Wiki/index.md, Wiki/log.md, mi.md]
writes: [Wiki/concepts/, Wiki/tools/, Wiki/people/, Wiki/techniques/, Wiki/sources/, Wiki/index.md, Wiki/log.md, Wiki/hot.md]
---

# Skill: Ingest Source

## Purpose
Take a raw document (YouTube transcript, article, PDF, meeting notes) from `Raw/` and compile it into the `Wiki/` — Karpathy-style — so it becomes queryable, linkable, and reusable.

## Trigger
- The user says "ingest this" or "process the new source in raw"
- A new file lands in `Raw/transcripts/`, `Raw/docs/`, or `Raw/clippings/`

## Inputs
- The path to the source file in `Raw/`
- (Optional) emphasis or angle the user wants prioritised

## Steps

1. **Read the source.** Read the full file. For large multi-tab transcripts, use `grep -n "^# "` to find section headers first, then read each section.

2. **Identify the atoms.** For each source, extract as many of these as are present:
   - **Concepts** — abstract ideas (e.g. "AI OS", "agentic workflow", "second brain", "RAG")
   - **Tools** — products, libraries, platforms (e.g. "Obsidian", "Claude Code", "Firecrawl")
   - **People** — individuals referenced (e.g. "Andrej Karpathy", "Nick Milo", "Greg Eisenberg")
   - **Techniques** — specific how-tos (e.g. "hot cache", "slash commands", "Obsidian CLI", "MCP servers")
   - **Claims** — statements worth evaluating ("95% token reduction on querying", "compiler analogy for knowledge")

3. **Check for existing wiki notes.** Before creating anything, `grep -r` the wiki for each atom. If a note already exists, update it — don't duplicate. If it doesn't, create it.

4. **Write wiki notes.** Each note follows this frontmatter:
   ```yaml
   ---
   type: concept | tool | person | technique | source
   generated-by: ingest-source
   sources: ["[[Raw/transcripts/YT-Transcripts-Batch-1]]"]
   updated: YYYY-MM-DD
   ---
   ```
   Followed by:
   - **One-paragraph definition** in our own words
   - **Why it matters to Niksho** — direct relevance to our business
   - **Related** — `[[wikilinks]]` to connected concepts, tools, people
   - **Quotes** — 1-3 exact quotes from the source with inline citation
   - **Sources** — backlinks to every raw file that mentions this

5. **Create a source note.** In `Wiki/sources/<slug>.md`, write a summary of the raw file: what it is, what it covers, the key extraction targets, and backlinks to every wiki note you created from it.

6. **Update `Wiki/index.md`.** Add any new notes under the right section. The index is the table of contents an AI reads first — it must stay complete.

7. **Update `Wiki/hot.md`** if the ingested material changes the "most recently relevant context" for active work.

8. **Log the operation in `Wiki/log.md`.** One line, timestamped: `[YYYY-MM-DD] ingest-source: processed <file>, created/updated N wiki notes`.

## Outputs
- New or updated files in `Wiki/concepts/`, `Wiki/tools/`, `Wiki/people/`, `Wiki/techniques/`
- One new file in `Wiki/sources/`
- Updated `Wiki/index.md`
- Updated `Wiki/log.md`
- Possibly updated `Wiki/hot.md`

## Rules & guardrails

- **Never modify files in `Raw/`.** Extract from them, link to them, do not rewrite them.
- **Never create duplicate wiki notes.** Grep first, update second, create third.
- **Every wiki note must have `sources:` frontmatter with backlinks.** No orphan notes.
- **Every wiki note must have at least one `[[wikilink]]` to another note.** Isolated nodes are anti-pattern.
- **Use our own words** for definitions. Direct quotes get wrapped in `>` blockquote with attribution.
- **Mark the `generated-by:` field** so the human can see what's AI-authored.
- **Respect the Niksho lens.** If a concept has no business relevance, note it briefly — don't spend tokens building a full wiki page for something we'll never use.
- **Do not create notes for trivial mentions.** A tool mentioned once in passing doesn't earn a wiki page. Three mentions across sources does.

## Quality bar
A good ingest leaves the wiki in a state where:
- The graph view shows new, connected nodes — not isolated islands.
- A search for any extracted concept returns a clean, single, authoritative note.
- The source file can be deleted and the wiki would still stand (but never actually delete the source).
