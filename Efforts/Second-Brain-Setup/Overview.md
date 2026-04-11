---
type: effort
effort: Second-Brain-Setup
status: shipped
intensity: ongoing
started: 2026-04-10
shipped: 2026-04-10
updated: 2026-04-10
owner: Shoham & Nikhil
---

# Second Brain Setup — Overview

## Goal
Stand up the Niksho second brain vault as a working AI OS that Shoham and Nikhil use daily, any AI tool can navigate cold, and that can be replicated for personal use later. Blend Nick Milo's ACE framework with Karpathy's raw → compile → wiki pattern. Root it at `/Users/shohamshree/niksho/NST`.

Full concept: [[Atlas/Concepts/AI-OS]].

## Status
**Shipped v1 — 2026-04-10.** The vault is structurally complete and in daily use. Atlas, AIOS, Raw, Wiki, Calendar, Efforts, Templates, and the `.obsidian/` config are all populated and reading cleanly. Setup-as-project is done; this effort transitions to **ongoing** for vault maintenance — `lint-wiki` passes, occasional restructures, drift checks during weekly review, ingestion of new sources as they land. See the ship decision: [[Efforts/Second-Brain-Setup/decisions/2026-04-10-ship-vault-v1]].

## Milestones

| # | Milestone | Status |
|---|---|---|
| 1 | `.obsidian/` config — 10 JSON files (app, appearance, bookmarks, community-plugins, core-plugins, daily-notes, graph, hotkeys, templates, workspace) | 🟢 |
| 2 | `Home.md` Launchpad — three headspaces, four intensities, quick-actions panel, AI entry-point block | 🟢 |
| 3 | `Templates/` — six templates (Daily Note, Decision, Effort, MOC, Weekly Review, Wiki Concept) | 🟢 |
| 4 | Four Milo concept notes in `Atlas/Concepts/` — Ideaverse, ARC-Framework, Four-Intensities-of-Efforts, Maps-of-Content | 🟢 |
| 5 | `Efforts/Efforts.md` restructured around the four intensities (Active / Ongoing / Simmering / Sleeping) | 🟢 |
| 6 | `Atlas/Atlas.md` rewritten as an active MOC — Start-here block, five domains, golden rule, open threads | 🟢 |
| 7 | Milo Ideaverse transcript stub at `Raw/transcripts/nick-milo-ideaverse.md` | 🟢 |
| 8 | Routing of `mi.md` / `claude.md` / `README.md` / `AIOS/vault-map.md` through `Home.md` — every onboarding path lands on Home and branches from there | 🟢 |
| 9 | Cowork session hooks (session-start, pre-compact, session-end) | ⚪ Deferred — described in AIOS but not wired up; not blocking daily use, will revisit when a real friction emerges. |
| 10 | Personal-vault replication for Shoham (separate vault built from this template) | ⚪ Deferred — wait until the Niksho vault has proven itself in business use for a few weeks before forking. |

## Decisions
_(in reverse chronological order)_

### 2026-04-10 — Hybrid architecture (Milo + Karpathy)
- **Context:** Neither pure Nick Milo ACE nor pure Karpathy raw/wiki fit our needs on their own. Milo lacks a compilation loop for source material; Karpathy lacks a place for authored strategy and decisions.
- **Decision:** Blend both. Atlas/Calendar/Efforts is authored (Milo). Raw/Wiki is compiled (Karpathy). AIOS is the glue layer of manuals and skills.
- **Trade-off:** Slightly more structure to learn than either approach alone. Offset by [[AIOS/vault-map]] which makes navigation explicit for any AI.
- **Reversibility:** High. Folders can be collapsed later if one half goes unused.

### 2026-04-10 — `claude.md` as thin pointer, identity in `mi.md`
- **Context:** Claude has a convention for `claude.md`. But we don't want the vault to be Claude-specific — GPT, Gemini, local models, whatever comes next should all work.
- **Decision:** `claude.md` is a ~10 line pointer. The real identity file is `mi.md` (portable, tool-agnostic). Every AI tool reads `mi.md` first.
- **Reversibility:** Trivial.

### 2026-04-10 — Vault root = `/Users/shohamshree/niksho/NST`
- **Context:** Existing folder had legacy ExcelTech docs and transcripts scattered.
- **Decision:** Use the same path as the new vault root. Existing files moved into `Raw/docs/` and `Raw/transcripts/` respectively. Nothing deleted.
- **Reversibility:** Medium. Moves are git-trackable. Originals are in git history.

### 2026-04-10 — AI-generated files must carry `generated-by` frontmatter
- **Context:** Human trust depends on knowing what the AI wrote vs what we wrote.
- **Decision:** Every file created by an AI has `generated-by: <tool>` in frontmatter. Human-authored files do not.
- **Reversibility:** Easy to add retroactively if missed.

### 2026-04-10 — Raw is sacred
- **Context:** Raw material (transcripts, clippings, original docs) can be mutated by well-meaning edits, breaking traceability.
- **Decision:** Raw/ is read-only for everyone. Thoughts on a source go in a Wiki note that links back to the raw file.
- **Reversibility:** N/A — this is a convention, enforced by discipline not code.

## Open questions
- Do we add Cowork session hooks (session-start, pre-compact, session-end) now or later? Probably later — not blocking usefulness.
- Do we start a personal second brain for Shoham now, or wait until the Niksho one proves itself in the business context?
- How aggressively should lint-wiki run? Manually at first; cron later if it earns its keep.

## Related
- [[Atlas/Concepts/AI-OS]]
- [[Atlas/Concepts/Second-Brain]]
- [[Atlas/Concepts/File-over-AI]]
- [[AIOS/vault-map]]
- [[AIOS/skills-map]]
- [[mi]]
- [[claude]]
