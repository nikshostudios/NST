---
skill: new-effort
triggers: ["new effort", "start a project", "spin up X"]
reads: [mi.md, Efforts/Efforts.md]
writes: [Efforts/<name>/]
---

# Skill: New Effort

## Purpose
Spin up a new active project folder with the standard skeleton so every effort looks the same and is instantly legible.

## Trigger
- User says "new effort X", "start a project called X", "spin up X"

## Inputs
- The effort name (kebab-case for the folder, title case for display)
- (Optional) one-line description
- (Optional) linked strategic goal (which Atlas business-model note or quarterly goal it serves)

## Steps

1. **Create the folder** `Efforts/<kebab-name>/`.

2. **Create `Overview.md`** using this template:

   ```markdown
   ---
   type: effort-overview
   status: active
   started: YYYY-MM-DD
   updated: YYYY-MM-DD
   owner: Shoham | Nikhil | both
   serves: [[Atlas/Business-Model/...]] | [[Calendar/Quarterly/...]]
   ---

   # <Effort Title>

   ## What this is
   One paragraph. Plain English. Why we're doing it.

   ## Success criteria
   - Criterion 1
   - Criterion 2
   - Criterion 3

   ## Current milestone
   <one line — what we're working on right now>

   ## Milestones
   - [ ] M1 — ...
   - [ ] M2 — ...
   - [ ] M3 — ...

   ## Next action
   <exactly one thing, concrete, owned by someone>

   ## Open risks
   - Risk 1 — severity — mitigation
   - Risk 2 — ...

   ## Decisions log
   - YYYY-MM-DD — decided X because Y → see [[link]]

   ## Related
   - [[Atlas/...]]
   - [[Wiki/...]]
   ```

3. **Create a `Milestones.md`** file as a placeholder for detailed milestone breakdowns.

4. **Create a `Decisions.md`** file for decision logs.

5. **Update [[Efforts/Efforts]]** to list the new effort under "Active efforts".

6. **Update [[Calendar/Quarterly/2026-Q2]]** if the new effort is in scope for the current quarter.

7. **Log the creation** in [[Wiki/log]].

## Rules & guardrails

- **Always check if the effort already exists** before creating. Grep first.
- **Link to a strategic goal.** If the new effort doesn't serve any goal in Atlas/Business-Model or the quarterly plan, stop and ask: is this the right thing to be spinning up?
- **Keep the Overview thin.** It's a landing page, not a spec doc. Detailed work goes in child files.
