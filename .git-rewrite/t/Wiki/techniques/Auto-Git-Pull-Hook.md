---
type: wiki-technique
generated-by: claude
sources: ["[[Raw/docs/Beroz-Session-2026-04-17]]"]
updated: 2026-04-17
tags: [claude-code, hooks, git, dev-workflow, settings]
---

# Auto Git-Pull Hook (UserPromptSubmit)

## What it is

A `UserPromptSubmit` hook configured in `~/.claude/settings.json` that runs a fast-forward `git pull` on a target repo **before every Claude prompt**. For Beroz, the hook runs:

```
git -C ".../beroz" pull --ff-only origin main
```

Effect: the local working tree is always in sync with `origin/main` at the exact moment Claude reads the file system. Solves the class of "Claude is editing a version of the file that's stale vs GitHub" bugs that show up when you work from multiple machines or let a CI-committed fix (e.g. Railway auto-pushing a config tweak) drift ahead of local.

## Why it matters

**It removes a silent failure mode.** Without the hook, you might ask Claude "add a column to the schema" and Claude edits a file that's three commits behind — the diff looks fine, you push, and the merge clobbers prod changes. With `--ff-only`, the pull either succeeds cleanly or fails loudly (no accidental auto-merges).

**`UserPromptSubmit` is the right lifecycle point.** Running on every tool call would be wasteful; running on session start would miss mid-session drift; running on user prompt matches the moment when new intent shows up. The pull is ~100ms when there's nothing new and skipped entirely if the working tree is clean.

**`--ff-only` is the important flag.** A non-fast-forward means someone else's changes diverge from yours — that should never be auto-reconciled silently. Let it fail and deal with it consciously.

## When the pattern fits

- Solo-ish repos where `main` is the active branch and auto-deploys are live (Railway, Vercel, Netlify).
- Multi-machine setups (laptop + desktop) where a commit from one could silently stale the other.
- Any repo where "did I pull?" is a question you answer more than once a week.

## When it doesn't fit

- Feature-branch workflows — pulling `main` on every prompt will fight the branch you're actually on.
- Repos with expensive `git hooks` or large-file-system (LFS) operations on pull.
- Shared branches where a fast-forward is not guaranteed — the failures will be noisy and constant.

## Implementation

In `~/.claude/settings.json`:

```json
{
  "hooks": {
    "UserPromptSubmit": [
      {
        "command": "git -C /absolute/path/to/repo pull --ff-only origin main",
        "timeout": 5000
      }
    ]
  }
}
```

Notes:
- Use an **absolute path** with `-C` — hooks don't inherit your shell's cwd.
- Cap the timeout so a hung network can't freeze Claude.
- The hook runs on **every** prompt in the session, including prompts that have nothing to do with the repo. That's fine — `pull --ff-only` with nothing to pull is essentially free.
- If you use multiple repos, add multiple hooks (or a shell script that pulls each one).

## Relevance to Niksho

This was added to the dev loop during the 2026-04-17 Beroz session after git auth got briefly confused between the `thenikhil05` and `nikshostudios` GitHub accounts (`gh auth setup-git` fixed that). The hook defends against a different failure — drift between local and GitHub — that would have been harder to debug after the fact. It's cheap enough to default on for any single-branch production repo, including anything we add for the [[Efforts/Niksho-SaaS-Product/Overview|Niksho SaaS product]].

**Guardrail:** don't add this hook to repos where you actively work on feature branches. The ff-only pull will succeed on `main` but your working branch can still diverge silently — the hook is not a substitute for `git fetch`-driven awareness on a branch-based workflow.

## Related

- [[Wiki/digests/Session-Beroz-Projects-Layer-2026-04-17]] — the session where this was introduced
- [[Efforts/ExcelTech-Automation/Overview]]
- [[AIOS/vault-map]]
