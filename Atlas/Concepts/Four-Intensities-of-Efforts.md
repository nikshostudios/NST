---
type: concept
category: second-brain
owner: Shoham & Nikhil
updated: 2026-04-10
generated-by: claude
sources:
  - Raw/transcripts/nick-milo-ideaverse.md
---

# Four Intensities of Efforts

> "An effort is not a project. A project is a word managers use. An effort has a life — it's hot, it's warm, it's cold, it's asleep."
> — adapted from Nick Milo

## The idea in plain English

Most productivity systems treat work as binary: either it's an active project or it's done. Reality is messier. An initiative can be full-attention, low-hum, shelved-but-alive, or outright paused — and lumping everything into "projects + someday/maybe" loses all of that.

The Four Intensities reframe this:

1. **🔥 Active** — on the bench right now. Daily attention. There should be very few of these. If everything is active, nothing is.
2. **🌀 Ongoing** — steady background care, not a sprint. Weekly touches. Operational work, maintenance, ongoing relationships.
3. **🌱 Simmering** — not yet active but not dead. Ideas are collecting, thoughts are accumulating, you're pre-loading it for the day you promote it.
4. **💤 Sleeping** — intentionally paused. Not cancelled. You know you'll come back to this, but not now.

The key move is that these are **states an effort moves between over time**, not categories you pick once. During a weekly review, efforts move up and down.

## Why it matters for Niksho

We are a two-person team in a quarter where the theme is *"Prove it at ExcelTech"*. We cannot have five active efforts — it would be lying to ourselves. The four intensities force us to be honest:

- **Active** right now: [[Efforts/Second-Brain-Setup/Overview]] (this week) + [[Efforts/ExcelTech-Automation/Overview]] (ongoing production work that genuinely needs daily attention).
- **Ongoing**: none right now. We are deliberately NOT treating content/marketing as ongoing this quarter.
- **Simmering**: [[Efforts/Niksho-SaaS-Product/Overview]]. We're thinking about Insforge, reading, sketching — but we're not building.
- **Sleeping**: [[Efforts/Fundraising/Prep-2027]]. The answer to "should we be fundraising now?" is no. The effort exists so we have a place to drop founder memos when they come, without acting on them.

This honesty is what keeps [[Home]] truthful. If Home.md claims something is Active and nobody's touched it in three weeks, Home is lying.

## Key moves

1. **Tag every effort with one `intensity:` in frontmatter.** Active / Ongoing / Simmering / Sleeping.
2. **Review intensities weekly.** Use [[Templates/Weekly Review]]. Efforts move between intensities deliberately, not by drift.
3. **Cap active.** Two active efforts is plenty for a two-person team. Three is a red flag.
4. **Sleeping is a feature, not a graveyard.** A sleeping effort is a deliberate bet that "not now" is the right answer. Don't delete it — letting it sleep *is* the decision.

## Common failure modes

- **Everything is active.** The classic trap. Nothing moves because attention is too thin. Fix: force-demote.
- **Simmering is a black hole.** Efforts go in and never come out because there's no trigger to wake them. Fix: during weekly review, ask "should any simmering effort wake up?"
- **Calling ongoing work a project.** Client delivery, recruiting, operations — these are Ongoing, not Active, even when they're intense. Treat them as Ongoing so they don't crowd Active.
- **Deleting instead of sleeping.** If you might come back to it, let it sleep. Deleting erases the thinking you already did.

## How we apply it in this vault

Each effort's Overview note has a frontmatter field:

```yaml
intensity: active   # or ongoing / simmering / sleeping
```

And [[Home]] mirrors the state with four buckets. When you change one, change the other. The [[Templates/Weekly Review]] enforces the sync.

## Related
- [[Atlas/Concepts/Ideaverse]]
- [[Atlas/Concepts/ARC-Framework]]
- [[Efforts/Efforts]]

## Sources
- [[Raw/transcripts/nick-milo-ideaverse|Nick Milo — Ideaverse YouTube transcript]]
- [[Wiki/people/Nick-Milo]]
