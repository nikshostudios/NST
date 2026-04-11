---
type: decision
date: 2026-04-10
effort: Second-Brain-Setup
owners: Shoham & Nikhil
status: decided
generated-by: claude
---

# Decision — Ship the vault as v1 and demote Second-Brain-Setup to Ongoing

## Context
The Niksho vault has been built up over 2026-04-10 to include: the `.obsidian/` config (10 JSON files), the [[Home]] Launchpad, [[Templates/Daily Note|Templates]] (six templates), the four Milo concept notes ([[Atlas/Concepts/Ideaverse]], [[Atlas/Concepts/ARC-Framework]], [[Atlas/Concepts/Four-Intensities-of-Efforts]], [[Atlas/Concepts/Maps-of-Content]]), the [[Atlas/Atlas|Atlas MOC]] rewrite, the [[Efforts/Efforts|Efforts MOC]] four-intensities restructure, the [[Raw/transcripts/nick-milo-ideaverse|Milo Ideaverse transcript stub]], and routing of [[mi]] / [[claude]] / `README.md` / [[AIOS/vault-map]] through Home. Atlas, AIOS, Raw, Wiki, Calendar, Efforts and Templates are all populated and reading cleanly.

Setup, as a finite project, is done. The next push that matters for the business is [[Efforts/ExcelTech-Automation/Overview|ExcelTech Automation]] refinement and the [[Efforts/Niksho-SaaS-Product/Overview|Niksho SaaS migration]] — neither of which should compete with vault construction for "Active" attention. The fork: keep Second-Brain-Setup Active and let it slowly atrophy, archive it and spawn a fresh `Vault-Maintenance` effort, or demote it in place to Ongoing.

## Options considered

### Option A — Demote Second-Brain-Setup from Active to Ongoing in place
- Pros: One move, three files. Effort history (decisions, milestones) stays connected to its successor work. The four-intensities pattern is built exactly for this — `intensity:` is metadata about pace, not identity.
- Cons: The name "Second Brain Setup" implies a finite project, which is now slightly misleading for an Ongoing effort. Risk: in three months we look at it and ask "why is setup still going?"

### Option B — Archive Second-Brain-Setup to `Efforts/_archive/` and spin up `Vault-Maintenance` as a fresh Ongoing effort
- Pros: Clean semantic break. Setup closes. Maintenance starts with its own identity, decision log, definition of "still healthy."
- Cons: Two effort folders to keep in sync. The historical decisions live in the archive, away from where future maintenance work is being logged. More churn for marginal gain when the vault is one day old.

### Option C — Leave it Active and just stop touching it
- Pros: No work today.
- Cons: Violates the four-intensities discipline (Active = daily attention). Drift between Home / Efforts.md / Overview frontmatter is the exact failure mode the model is supposed to prevent. Hard no.

## Decision
**We chose: Option A — demote in place.**

Frontmatter `intensity: active → ongoing`, `status: in-progress → shipped`, add `shipped: 2026-04-10`. Update [[Home]] Active/Ongoing buckets and [[Efforts/Efforts]] to match. File this decision note. Rewrite [[Wiki/hot]] In-motion to reflect the new reality. Update today's [[Calendar/Daily/2026-04-10|daily note]] close-of-day with what moved.

## Why
The vault is one day old. Splitting setup from maintenance into two efforts the moment maintenance begins is premature scaffolding — it pretends we know what maintenance will look like, and we don't yet. The four-intensities model exists precisely so an effort can change pace without changing identity. If maintenance turns out to be its own beast in three weeks, we spawn `Vault-Maintenance` then, with real signal. Right now, fewer moving parts wins.

The other half of "why": the historical decisions and milestones for *why this vault exists* belong next to the work that maintains it, not in an archive folder where nobody looks.

## What we're giving up by choosing this
- A clean semantic break between "we built it" and "we maintain it." Future readers may have to read the milestones table to understand the effort is in maintenance mode rather than telling from the name alone.
- A fresh decision log for maintenance work. New decisions about lint-wiki cadence, ingestion rules, etc. will pile into the existing Overview's decision section rather than starting from a blank slate.

## Reversibility
- [x] Easy to reverse (< 1 day)
- [ ] Moderate to reverse (1 week)
- [ ] Hard to reverse (> 1 month)
- [ ] One-way door

If maintenance turns out to want its own identity, archiving Second-Brain-Setup and spinning up `Vault-Maintenance` takes under an hour. This decision note is the receipt that we considered Option B and rejected it on YAGNI grounds — easy to revisit.

## How we'll know if this was wrong
A concrete signal — any one of these reopens the decision:

- During a weekly review we find ourselves writing maintenance decisions that don't fit naturally under "Second-Brain-Setup" because the framing is wrong.
- Three weeks from now the Overview's decision log has more "maintenance" entries than "setup" entries and the name feels actively misleading.
- A new contributor (or a fresh AI session) reads `Efforts/Efforts.md` and asks "wait, is the vault still being set up?" — a signal the name is doing the wrong work.
- The effort needs to be promoted back to Active for a sustained push (e.g. a structural redesign), at which point spinning out a separate `Vault-Maintenance` makes sense and we do it then.

## Linked notes
- Effort: [[Efforts/Second-Brain-Setup/Overview]]
- Atlas: [[Atlas/Concepts/Four-Intensities-of-Efforts]] · [[Atlas/Concepts/AI-OS]]
- Daily: [[Calendar/Daily/2026-04-10]]
- Hot cache: [[Wiki/hot]]

---
*Template: [[Templates/Decision]] · Home: [[Home]]*
