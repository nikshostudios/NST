---
skill: trace-idea
triggers: ["trace X", "how has my thinking on X evolved", "history of X in this vault"]
reads: [Atlas/, Calendar/, Efforts/, Wiki/, Raw/]
writes: []
---

# Skill: Trace Idea

## Purpose
Follow an idea through the vault across time. Where did it first appear? How did it evolve? Where does it sit now? Inspired by Vin's `/trace` command (see [[Wiki/people/Vin]]).

## Trigger
- User says "trace [idea]" or "how has my thinking on [X] evolved"

## Inputs
- The idea/concept/term to trace

## Steps

1. **Build a vocabulary map.** Grep the vault for the term and its obvious variants (e.g. "sourcing agent", "Sourcing Agent", "sourcing pipeline").

2. **Categorise the hits by type and time:**
   - Raw source → where the idea was first introduced externally
   - Wiki concept/tool/person → how it's currently defined
   - Atlas → authored understanding
   - Efforts → how it's being built
   - Calendar/Daily → when it came up day-to-day

3. **Order chronologically.** Use the `updated:` frontmatter, git log if present, or the daily note date.

4. **Produce a trace narrative.** Not a list — prose. Phases of evolution:
   - **Origin** — where and when the idea first appeared in the vault, and the context
   - **Development** — key moments where the thinking shifted, with quotes and dates
   - **Current state** — how the idea lives in the vault today
   - **Tensions** — any unresolved contradictions between how the idea is described in different places

5. **Close with a reflection prompt.** Something like: "Is the current framing in [[Atlas/...]] still consistent with what [[Raw/...]] originally said? Worth revisiting X."

## Outputs
- A trace report delivered back to the user in the chat (not saved to a file unless the user asks)

## Rules & guardrails

- **Do not synthesise new thinking.** The trace is a mirror, not a creator. You're showing the user their own evolution.
- **Cite every claim** with a wikilink to the exact note.
- **If the trace is thin** (only 2-3 mentions), say so. Don't stretch it.
- **Surface contradictions** — that's the whole point. If the Atlas says X and an Effort says not-X, name it.
