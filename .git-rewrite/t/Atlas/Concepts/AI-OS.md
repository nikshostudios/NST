---
type: atlas-note
area: Concepts
updated: 2026-04-10
sources: ["[[Raw/transcripts/YT-Transcripts-2026-04-10]]", "[[Raw/clippings/karpathy-llm-knowledge-bases]]"]
---

# AI OS — The Concept Behind This Vault

## What we mean by "AI OS"
An **AI OS** is a vault of markdown files structured so that any AI tool, dropped into it cold, can understand what we're working on, what we've decided, and what to do next — without us re-explaining every time.

It's not a framework. It's not a plugin. It's not a product to install. It's **a folder of markdown files and a set of conventions** that any AI (Claude, GPT, local models, whatever comes next) can read and operate on.

## The two influences

This vault is a **hybrid** of two independent approaches. We took what works from each and merged them.

### Nick Milo — "Ideaverse" / ACE
From Nick Milo's workshop on using Claude inside Obsidian.

- **ACE framework:** Atlas (reference knowledge) / Calendar (time-based notes) / Efforts (active projects).
- Authored knowledge. The human writes the notes. The AI assists with synthesis, search, and clarification.
- The vault reflects how you think, not what the internet says.
- Anchored around Maps of Content (MOCs) — hand-curated hubs that link to everything relevant.

### Andrej Karpathy — LLM Knowledge Bases
From the Karpathy tweet and gist ([[Raw/clippings/karpathy-llm-knowledge-bases]]).

- **raw → compile → wiki.** Source documents go into `raw/`. An LLM incrementally compiles them into a wiki of summaries, concepts, and cross-links.
- Compiled knowledge. The AI writes the wiki; the human rarely edits it directly.
- The vault is a distilled index over a lot of external material.
- Works at ~100 articles / 400k words without needing vector DBs — index + follow-links is enough.

## Why blend the two
Neither approach alone is enough for what we need:

- **If we only did Milo (Atlas/Calendar/Efforts),** we'd have a nicely authored vault that gets stale the moment our source material grows. There's no loop for processing the transcripts, papers, and repos we consume weekly.
- **If we only did Karpathy (raw/wiki),** we'd have a great research index but no place for decisions, projects, plans, or identity. The vault would be a library, not an operating system.

So we run both:

| Layer | What lives there | Who writes it | Inspired by |
|---|---|---|---|
| **Atlas** | Vision, strategy, people, product design, concepts | Humans (us) | Nick Milo |
| **Calendar** | Daily notes, weekly reviews, quarterly plans | Humans | Nick Milo |
| **Efforts** | Active projects with status, milestones, decisions | Humans | Nick Milo |
| **Raw** | Source material: transcripts, papers, clippings, docs | Dropped in as-is, never edited | Karpathy |
| **Wiki** | Compiled notes: concepts, techniques, tools, people, sources | AI (with the `ingest-source` skill) | Karpathy |
| **AIOS** | The manuals for the AI itself | Humans (us) | Our glue layer |

Atlas is authored. Wiki is compiled. Raw is sacred and never edited.

## The third influence — Cole Medin's compiler
Cole Medin's [claude-memory-compiler](https://github.com/coleam00/claude-memory-compiler) implements Karpathy's pattern applied to **internal** data (session logs from Claude Code) rather than external (articles, papers). Captured in [[Raw/clippings/karpathy-llm-knowledge-bases]].

We borrow the **session hooks idea** from Cole:
- A session-start hook loads [[AIOS/vault-map]] and `Wiki/index.md` into the fresh session
- A pre-compact hook summarises recent messages before context is lost
- A session-end hook writes the summary to a daily log

These aren't implemented yet — they'll ship as part of the AIOS layer in a later pass. But the architecture is ready for them.

## The compiler analogy
Karpathy's most useful framing:

```
Raw source material   →   LLM compiler   →   Wiki
(articles, papers,        (ingest-source)    (concepts, links,
 transcripts, repos)                          summaries)
```

Just like source code → compiler → executable. The wiki is the "compiled" form of the raw inputs. The compiler is the LLM running a skill. The source never changes; recompilation is cheap and idempotent.

## The hot cache idea
Karpathy and Cole both reference a "hot cache" — a small (~500 word) recency buffer of the most relevant context for the current session. This lives at `Wiki/hot.md` and is rewritten by `lint-wiki` whenever it runs.

When a new Claude session starts, the hot cache is the first thing it should read after `claude.md` and `mi.md`. See [[AIOS/vault-map]].

## Token economics
One of the reasons this architecture matters: compacting raw sources into a wiki can reduce token usage by ~95% for complex queries (Karpathy's cited result). This is the difference between a vault we can query daily and one we can't afford to.

## Why markdown files and not a database
See [[Atlas/Concepts/File-over-AI]].

## Related
- [[Atlas/Concepts/File-over-AI]]
- [[Atlas/Concepts/Second-Brain]]
- [[Atlas/Concepts/Agents-vs-Tools]]
- [[AIOS/vault-map]]
- [[AIOS/skills-map]]
- [[Raw/clippings/karpathy-llm-knowledge-bases]]
- [[Raw/transcripts/YT-Transcripts-2026-04-10]]
