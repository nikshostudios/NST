---
skill: daily-briefing
triggers: ["brief me", "what's on my plate", "morning briefing", "start my day"]
reads: [Calendar/Daily/, Efforts/, Wiki/hot.md, mi.md]
writes: [Calendar/Daily/<today>.md]
---

# Skill: Daily Briefing

## Purpose
Produce a prioritised plan for today based on what the vault already knows: active efforts, quarterly goals, recent daily notes, and the hot cache. The briefing should save the human from having to re-read everything every morning.

## Trigger
- User says "brief me", "morning brief", "what's on my plate today"
- First interaction of the day

## Inputs
- Today's date (from system)
- (Optional) calendar events if provided by the user or an MCP connector

## Steps

1. **Read the current state.**
   - [[Wiki/hot]] — what's been top-of-mind recently
   - [[Efforts/Efforts]] — all active efforts and their overviews
   - The most recent 3 daily notes in `Calendar/Daily/`
   - [[Calendar/Quarterly/2026-Q2]] — the quarterly plan

2. **Identify what's in motion.** For each active effort, check its `Overview.md` for:
   - Current milestone
   - Open blockers
   - Last touched date
   - Next action

3. **Identify drift.** Compare what the vault says is priority (from the quarterly plan and effort overviews) against what the most recent daily notes actually worked on. Surface any drift without judgement.

4. **Produce the briefing.** The output is a single Daily Note at `Calendar/Daily/<YYYY-MM-DD>.md` with this shape:

   ```markdown
   ---
   type: daily-note
   date: YYYY-MM-DD
   generated-by: daily-briefing
   ---

   # YYYY-MM-DD — Daily Briefing

   ## Top 3 for today
   1. [[link to effort or task]] — one sentence why this matters today
   2. ...
   3. ...

   ## In motion
   - **[[ExcelTech-Automation]]** — current milestone, last touched, next action
   - **[[Niksho-SaaS-Product]]** — ...
   - **[[Fundraising]]** — ...

   ## From the hot cache
   One paragraph of the most relevant context from [[Wiki/hot]].

   ## Drift check
   (If any) — "You planned X this quarter but the last three daily notes spent most time on Y. Intentional?"

   ## Open blockers
   - Blocker 1 → who can unblock
   - Blocker 2 → ...

   ## Notes
   (empty — the human fills this during the day)

   ## Close-of-day
   (empty — fill at end of day with shipped / learned / decided)
   ```

5. **Do not overwrite** an existing daily note if one exists. Append to it or offer to.

## Outputs
- `Calendar/Daily/<today>.md` — the daily briefing
- A short summary message to the user with the Top 3 + any surprises

## Rules & guardrails

- **Never invent tasks.** If a task isn't in the vault, don't make one up. Ask.
- **Respect the "intentionally manual" list.** Don't suggest automating anything on the list in [[mi.md]] (WhatsApp, phone calls, LinkedIn sourcing, client relationships).
- **Keep it tight.** The briefing should be readable in 60 seconds. If it's longer, tighten.
- **Cite everything.** Every recommendation links to the effort or note it came from.
