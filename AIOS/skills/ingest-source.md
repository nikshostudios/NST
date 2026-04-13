---
skill: ingest-source
triggers: ["ingest this", "process raw", "add to wiki", "new source in raw", "log this into obsidian", "add to vault"]
reads: [Raw/, Wiki/index.md, Wiki/log.md, Wiki/hot.md, mi.md, Home.md, AIOS/vault-map.md]
writes: [Raw/transcripts/, Raw/docs/, Raw/clippings/, Wiki/concepts/, Wiki/tools/, Wiki/people/, Wiki/techniques/, Wiki/digests/, Wiki/sources/, Wiki/index.md, Wiki/log.md, Wiki/hot.md]
updated: 2026-04-14
built-from: "Successful ingestion run on 2026-04-14 — 5 YouTube transcripts + 1 HTML architecture doc. Corrections applied after first-pass review."
---

# Skill: Ingest Source

## Purpose
Take raw material (YouTube transcripts, articles, PDFs, architecture docs, meeting notes) and compile it into the vault's Wiki layer — Karpathy-style — so it becomes queryable, linkable, and reusable. The goal: someone opening the vault cold can find and use this knowledge without watching the original video or reading the raw doc.

## Trigger
- The user says "ingest this", "log this into obsidian", "add to wiki", "process the new source"
- A new file is uploaded or mentioned for processing
- A new file lands in `Raw/transcripts/`, `Raw/docs/`, or `Raw/clippings/`

## Phase 0 — Clarify before touching anything

Before any file writes, establish:

1. **What is the source material?** Transcript, doc, HTML, PDF, clipping?
2. **How many distinct pieces?** A multi-video transcript file has tabs. An architecture doc is one piece.
3. **Granularity preference:** One note per source? One per section? Hybrid (summaries + concept breakouts)?
4. **Filing location:** Match existing conventions — check `Raw/transcripts/`, `Raw/docs/`, `Raw/clippings/` for naming patterns.
5. **Any duplicates?** If user uploaded multiple versions, confirm which to file.

**Naming conventions (established):**
- Transcripts: `YT-Transcripts-YYYY-MM-DD.md` (date-based, in `Raw/transcripts/`)
- Architecture/design docs: `Name-vN.html` or `Name-vN.md` (versioned, in `Raw/docs/`)
- Clippings: descriptive slug (in `Raw/clippings/`)

## Phase 1 — File the raw source

1. **Read the source.** For large multi-section files, use `grep -n "^# "` to find section headers first, then read each section.
2. **Add minimal frontmatter.** For transcripts:
   ```yaml
   ---
   type: raw-transcript
   source: youtube
   date: YYYY-MM-DD
   videos:
     - "Video Title 1"
     - "Video Title 2"
   ---
   ```
   For docs: no frontmatter needed (HTML/PDF won't render it anyway).
3. **Do not edit the content.** Raw is sacred. Frontmatter is the only addition.
4. **File in the correct Raw subfolder.** Copy (not move) if the original is elsewhere in the vault.
5. **Version control:** If a document already exists (e.g. architecture doc), check existing versions and increment (v2 → v3). Rename old and new files consistently. Update any backlinks in the vault that point to the old filename.

## Phase 2 — Extract and compile into Wiki

### For multi-video transcripts: use the hybrid approach

**Create one digest per video** in `Wiki/digests/`:
```yaml
---
type: wiki-digest
generated-by: claude
sources: ["[[Raw/transcripts/YT-Transcripts-YYYY-MM-DD]]"]
video: "Full Video Title"
tab: N
date: YYYY-MM-DD
updated: YYYY-MM-DD
tags: [relevant, tags]
---
```

Each digest must include:
- **Core argument** — one paragraph, what the video is actually saying
- **Key principles/findings** — the substance, written in our own words (not a transcript summary)
- **Relevance to Niksho** — how this connects to our business, product, or workflow. Reference specific vault files ([[Efforts/...]], [[Atlas/...]]). If there's no relevance, say so briefly and move on.
- **See also** — backlinks to related digests, concepts, vault files. Be generous with links — the more connections, the more useful the vault becomes.

**Then extract standalone concept notes** for ideas that:
- Cross-link to 2+ other vault files (existing or new)
- Represent a reusable framework, methodology, or principle
- Would be useful to reference from outside this specific video context

Concept notes go in `Wiki/concepts/` with this structure:
```yaml
---
type: wiki-concept
generated-by: claude
sources: ["[[Raw/transcripts/...]]"]
updated: YYYY-MM-DD
tags: [relevant, tags]
---
```

Each concept note must include:
- **What it is** — clear definition that makes sense without watching the video
- **Why it matters** — broader significance
- **Relevance to Niksho** — concrete application to our business
- **Related** — backlinks to other concepts, digests, Atlas files, Efforts

**Inline clarity rule:** If a term might be unclear to someone who didn't watch the video, add a brief parenthetical explanation. Don't over-explain obvious things — just catch the jargon that would confuse a cold reader.

### For architecture/design docs:

Check if the content is already reflected in Atlas/Efforts files (it often is — the HTML is the source doc, the vault files are the extracted knowledge). If already logged:
- Add a backlink from the relevant Efforts/Atlas file to the Raw source
- Update Wiki/hot.md with current state
- Don't re-extract what's already in the vault

If NOT already logged:
- Extract into the appropriate Atlas or Efforts files (not Wiki — architecture decisions are authored, not compiled)
- Follow the existing patterns in those folders

### For articles/clippings:

Follow the original atomic extraction approach:
- **Concepts** — abstract ideas → `Wiki/concepts/`
- **Tools** — products, libraries → `Wiki/tools/`
- **People** — individuals referenced → `Wiki/people/`
- **Techniques** — specific how-tos → `Wiki/techniques/`

## Phase 3 — Update indexes

1. **`Wiki/index.md`** — add new entries under the correct sections. If a new section is needed (e.g. Digests), create it. The index is the table of contents an AI reads first — it must stay complete.

2. **`Wiki/hot.md`** — rewrite (not append) if the ingested material changes the current state of what matters most. Include: what was just ingested, key actionable insights, updated blockers/decisions, and links to all new notes.

3. **`Wiki/log.md`** — append one line, timestamped: `[YYYY-MM-DD] ingest-source: processed <file>, created N digests + M concept notes, updated index + hot`.

## Phase 4 — Review and correct

**Do not skip this step.** After all files are written:

1. Present the user with a summary of everything created/updated
2. List the decisions made during the run (filing location, naming, granularity, what got standalone concept treatment)
3. Ask for corrections: "Did I miss any concepts? Are the backlinks right? Anything filed wrong?"
4. Apply corrections immediately
5. **Update this skill file** if the corrections reveal a gap in the process (recursive skill building — see [[Wiki/concepts/Recursive-Skill-Building]])

## Rules & guardrails

- **Never modify content in `Raw/`.** Frontmatter is the only addition to raw files.
- **Never create duplicate wiki notes.** Grep first, update second, create third.
- **Every wiki note must have `sources:` frontmatter with backlinks.** No orphan notes.
- **Every wiki note must have at least one `[[wikilink]]` to another note.** Isolated nodes are anti-pattern.
- **Use our own words** for definitions. Direct quotes get wrapped in `>` blockquote with attribution.
- **Mark the `generated-by:` field** so the human can always tell what's AI-authored.
- **Respect the Niksho lens.** Every note should connect back to our business where relevant. If a concept has no business relevance, note it briefly and move on.
- **Do not create notes for trivial mentions.** A tool mentioned once in passing doesn't earn a wiki page.
- **Be generous with backlinks.** More connections = more useful vault. Link to existing Atlas, Efforts, Calendar files — not just other Wiki notes.
- **Version source documents** when they evolve. Never overwrite — rename with version suffix.

## Quality bar

A good ingest leaves the vault in a state where:
- The graph view shows new, connected nodes — not isolated islands
- A search for any extracted concept returns a clean, single, authoritative note
- Someone reading just the Wiki (not the Raw source) gets the actionable knowledge
- The "Relevance to Niksho" sections create genuine bridges to active work, not generic filler
- Wiki/hot.md reflects the current state accurately for the next AI session

## Outputs

- New files in `Raw/` (source material)
- New files in `Wiki/digests/` (one per video/major section)
- New or updated files in `Wiki/concepts/`, `Wiki/tools/`, `Wiki/people/`, `Wiki/techniques/`
- Updated `Wiki/index.md`
- Updated `Wiki/hot.md`
- Updated `Wiki/log.md`
- Possibly updated `Efforts/` or `Atlas/` files (backlinks to new Raw sources)
