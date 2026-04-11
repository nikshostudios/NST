---
type: atlas-note
area: Concepts
updated: 2026-04-10
---

# File-over-AI — The Principle

## The short version
The source of truth is a **markdown file in a git repo**, not a vector database, not a proprietary "second brain" app, not a context window.

Files are portable. Apps die. Models change. Plain text with wikilinks outlives all of them.

## Where the phrase comes from
Obsidian's founding principle is "file over app" — your notes should outlive the app they were written in. We extend that to AI: "file over AI" means your knowledge base should outlive the model and the tool that wrote it.

## Why we hold it
### 1. Portability
Every file in this vault is plain markdown. You can open it in VS Code, Obsidian, Vim, TextEdit, GitHub, or any AI tool on the planet. If Obsidian dies, we lose an IDE. We don't lose a vault.

### 2. Versioning
Git gives us diffs, blame, rollback, branches. Try that with a vector database.

### 3. Readability by humans AND AIs
Markdown is the LLM-native format. Every frontier model is trained on enormous amounts of markdown. Feeding a model markdown files is the highest-signal-per-token you can get. No embedding pipeline, no RAG index, no vector store — just files and follow-links.

### 4. Debuggability
When an AI gets something wrong, you can open the file it was reading and see exactly what it saw. Try that with a vector DB query that returned "the top 5 chunks by cosine similarity".

### 5. No vendor lock
We don't want to be one ToS change away from losing our memory. Files on disk that we back up to git are the least-lock-in option possible.

## What this means in practice
- **Every concept has exactly one file.** Linked from many places. No duplicates, no orphans (see [[AIOS/skills/lint-wiki]]).
- **Every wiki note links to its sources** in frontmatter. If the source was a transcript, the Wiki note has `sources: ["[[Raw/transcripts/..."]]` in its frontmatter. Traceability is built in.
- **Every AI-generated file is marked.** `generated-by:` in frontmatter. Humans always know what they wrote vs what an AI wrote.
- **No vector DBs.** Not because vector search is bad, but because at our scale (Karpathy's ~100 articles / 400k words) a well-maintained index + follow-links is faster, cheaper, and more debuggable.
- **No "AI memory" plugins.** We don't use Mem0, Zep, Letta, or similar. The vault IS the memory.
- **No hidden state.** If the AI decided something, there's a file. If there's no file, it didn't decide anything we can rely on.

## What we give up
- **Query speed on massive corpora.** At 10M words a real RAG pipeline beats follow-links. We're nowhere near that and won't be for years.
- **Fancy analytics.** You can't run complex analytical queries over markdown the way you can over a database.
- **Fuzzy semantic search.** We rely on wikilinks + structured frontmatter + indexes. Good enough so far.

We're fine with all of these trade-offs.

## The broader principle
"File over AI" also maps to a business principle: **the asset should outlive the tool that built it.**

- Code in git outlives the IDE.
- Markdown in git outlives the note-taking app.
- Structured data in Postgres outlives the ORM.
- Prompts in git outlive the Claude model version.

If it doesn't live in a file you own, you don't actually own it.

## Related
- [[Atlas/Concepts/AI-OS]]
- [[Atlas/Concepts/Second-Brain]]
- [[Atlas/Business-Model/Product-Thesis#Why-we-own-the-stack]]
- [[Raw/clippings/karpathy-llm-knowledge-bases]]
