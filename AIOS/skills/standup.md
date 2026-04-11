---
skill: standup
triggers: ["standup", "status update", "what did I ship yesterday", "end of day"]
reads: [Calendar/Daily/, Efforts/, Wiki/log.md]
writes: [Calendar/Daily/<today>.md (close-of-day section)]
---

# Skill: Standup

## Purpose
Generate a yesterday / today / blockers update — the kind you'd drop in Slack or share with a co-founder. Also used as the end-of-day close on the daily note.

## Trigger
- User says "standup", "status update", "close out the day"
- Evening, before stopping work

## Steps

1. **Read yesterday's daily note** and the recent entries in `Wiki/log.md`.

2. **Read today's daily note** (the one produced by `daily-briefing`) and see what the human actually wrote in the `Notes` section.

3. **Read the relevant Effort overviews** to check if any milestones ticked over.

4. **Produce the standup** in this shape:

   ```markdown
   ## Standup — YYYY-MM-DD

   **Yesterday:**
   - Shipped: [[thing]] — one line
   - Decided: [[thing]] — one line
   - Learned: [[thing]] — one line

   **Today:**
   - Working on: [[thing]]
   - Priority: [[thing]]

   **Blockers:**
   - (none) or specific blockers with owners
   ```

5. **Append it to today's daily note** under the `## Close-of-day` heading.

6. **If this is an end-of-day run**, also ask:
   - Anything that should move from the daily note into an Effort or Atlas file?
   - Any decision worth logging with `log-decision`?
   - Any new source to ingest into the wiki?

## Rules & guardrails

- **Don't invent wins.** If nothing shipped, say "no ship — spent the day on X" honestly.
- **Keep it to 10 lines max.** Standups are not essays.
- **Respect the language of the effort.** Use the same names the effort files use.
