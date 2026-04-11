---
type: concept
category: second-brain
owner: Shoham & Nikhil
updated: 2026-04-10
generated-by: claude
sources:
  - Raw/transcripts/nick-milo-ideaverse.md
---

# ARC — Add, Relate, Communicate

> Three verbs that describe what you *do* with ideas once they're in the vault. From Nick Milo.

## The idea in plain English

Most note-taking systems tell you how to *file* things. ARC tells you what to *do* with them:

1. **Add** — bring the raw material in. Clippings, transcripts, meeting notes, half-thoughts. Don't worry about structure yet. Just get it in.
2. **Relate** — link it to other things already in the vault. This is where a note stops being an orphan and starts being part of a web. The link is the unit of thought, not the note.
3. **Communicate** — pull the web into something you can say out loud: a decision, a doc, a Slack message, a pitch, a strategy memo, a Loom, a blog post.

The key insight is that the value is in step 3, but most people only ever do step 1. They collect and never connect, connect and never communicate. The vault exists to turn raw input into output you can *use*.

## Why it matters for Niksho

- **ExcelTech automation decisions** come out of communicate: we only ship an agent change when we can state in plain English why we're doing it. The vault's job is to hold the relate layer so the communicate step is cheap.
- **AI sessions** are pure communicate. Claude reads [[Wiki/hot]] and [[Home]] and produces an answer. The better our add/relate work is, the better the communicate is.
- **Fundraising** in 2027 is also communicate. Decks, one-pagers, data rooms are just the relate web collapsed into artifacts. If the relate work is done, the communicate is 10x cheaper.

## How we apply it

| ARC step | Where in the vault | Who does it |
|----------|--------------------|-------------|
| Add      | `Raw/` (sacred, never edited) + daily notes in `Calendar/Daily/` | Human, mostly |
| Relate   | `Atlas/`, `Wiki/`, MOCs, wikilinks | Human + Claude via [[AIOS/skills/ingest-source]] |
| Communicate | Decisions, status reports, client docs, external content | Human, with Claude as drafter |

## Key moves

1. **Lower the bar on Add.** Drop things into `Raw/clippings/` fast. Don't triage at capture time.
2. **Raise the bar on Relate.** Every time you touch a note, ask "what else does this connect to?" and add at least one link.
3. **Time-box Communicate.** Don't try to perfect — ship the v1 decision, then revise.
4. **Let AI do the relate step.** Claude is very good at seeing connections you've already made but didn't notice. Use it.

## Common failure modes

- **Collector's fallacy.** Clipping 500 articles and reading zero. Raw grows forever, Wiki stays empty.
- **Connector's trap.** Beautiful link graph, zero real-world output. The vault becomes a zen garden.
- **Communicator's shortcut.** Skipping Add and Relate entirely and just writing from memory — works until you need to do it at scale.

## Related
- [[Atlas/Concepts/Ideaverse]]
- [[Atlas/Concepts/Maps-of-Content]]
- [[Atlas/Concepts/Second-Brain]]
- [[Wiki/techniques/Hot-Cache]]

## Sources
- [[Raw/transcripts/nick-milo-ideaverse|Nick Milo — Ideaverse YouTube transcript]]
- [[Wiki/people/Nick-Milo]]
