---
type: map
purpose: index of recurring processes (skills) for any AI tool
updated: 2026-04-10
---

# Skills Map — Recurring Processes For This Vault

> A **skill** is a markdown file that describes a repeatable process.
> When I ask you to do one of these things, read the matching skill file first, then execute.
> Skills are portable — they work in Claude Code, Cowork, Codex, Cursor, or any tool that can read markdown.

---

## The Skills

### Knowledge management
| Skill | Trigger | What it does |
|---|---|---|
| [[skills/ingest-source]] | "ingest this", new file in Raw/ | Takes a raw source (transcript, article, PDF), extracts concepts/tools/people/techniques, creates linked wiki notes, updates index and log |
| [[skills/lint-wiki]] | "lint the wiki", weekly | Health-checks the wiki: stale links, orphan notes, gaps, missing summaries, outdated hot cache |
| [[skills/trace-idea]] | "trace X", "how has my thinking on X evolved" | Follows an idea across the vault, shows how it emerged and changed over time |
| [[skills/emerge]] | "what am I missing", "emerge" | Surfaces patterns the vault implies but never states — latent ideas, unnamed patterns |
| [[skills/challenge]] | "challenge this", "pressure-test" | Finds contradictions and counter-evidence for a claim using the vault's own history |

### Operations
| Skill | Trigger | What it does |
|---|---|---|
| [[skills/daily-briefing]] | "what's on my plate", "brief me", morning | Pulls today's priorities from Efforts, Calendar, and hot cache. Returns a prioritised plan |
| [[skills/standup]] | "standup", "status update" | Generates a yesterday/today/blockers summary from recent daily notes and effort updates |
| [[skills/log-decision]] | "log this decision" | Records a decision with reasoning and trade-offs in the relevant Atlas or Efforts file |

### Product work
| Skill | Trigger | What it does |
|---|---|---|
| [[skills/new-effort]] | "new effort X", "start a project" | Creates a new effort folder with Overview, Milestones, Risks template |
| [[skills/ship-check]] | "ship check", before deploy | Runs a pre-deploy checklist against the relevant effort |

---

## Skill File Format

Every skill file follows the same shape so an AI can execute it deterministically:

```markdown
# Skill: <name>

## Trigger
When the user says X, or a file lands in Y, or the date crosses Z.

## Inputs
What context the AI needs before running.

## Steps
1. ...
2. ...
3. ...

## Outputs
Where the result goes. What files are modified. What gets logged.

## Rules & guardrails
Things the AI must never do while running this skill.
```

---

## Adding A New Skill

When a process starts repeating more than three times, promote it to a skill:
1. Create `AIOS/skills/<skill-name>.md` using the format above.
2. Add it to the table on this page.
3. Update [[AIOS/vault-map]] if the new skill changes navigation behaviour.
4. Log the addition in [[Wiki/log]].

---

## Slash Commands (Optional Integration)

If you are running Claude Code inside Obsidian via the Terminal plugin, you can make these skills into slash commands by creating matching files in `.claude/commands/<name>.md` at the vault root. Each command file can just read and execute the matching skill file. See [[Wiki/techniques/Slash-Commands]] for the pattern.
