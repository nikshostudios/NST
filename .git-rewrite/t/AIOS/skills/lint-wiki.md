---
skill: lint-wiki
triggers: ["lint the wiki", "wiki health check", "clean up wiki"]
reads: [Wiki/]
writes: [Wiki/index.md, Wiki/log.md, Wiki/hot.md]
---

# Skill: Lint Wiki

## Purpose
Health-check the wiki the way Karpathy describes in his LLM knowledge base playbook: find inconsistent data, broken links, orphan notes, stale summaries, and missing backlinks. Keep the graph clean.

## Trigger
- The user says "lint the wiki" or "wiki health check"
- Scheduled: weekly (Sunday evening is a good default)

## Inputs
None — the skill scans the whole wiki.

## Steps

1. **Scan for orphan notes.** Any file in `Wiki/` with no inbound backlinks. Report them. For each, propose either (a) delete, (b) add backlinks from related notes, or (c) merge into an existing note.

2. **Scan for broken wikilinks.** Any `[[link]]` pointing to a file that doesn't exist. Either create the missing note (with a stub and a `needs-content: true` frontmatter field) or fix the link target.

3. **Scan for duplicate concepts.** Two wiki notes covering the same concept under different names. Propose a merge.

4. **Scan for missing frontmatter.** Every wiki note needs `type`, `generated-by`, `sources`, `updated`. Flag anything missing.

5. **Scan for stale `updated` dates.** Notes that haven't been touched in 90+ days where the underlying concept has moved on. Flag for review.

6. **Check `Wiki/index.md` coverage.** Every wiki note must be discoverable from the index. Add missing entries.

7. **Rebuild `Wiki/hot.md`.** Identify what's recently relevant based on (a) the most recent entries in Calendar/Daily, (b) the active Efforts, (c) the last N entries in Wiki/log.md. Produce a tight ~500-word cache.

8. **Find gaps.** Look at the concepts referenced across the vault. Are there wiki notes missing for concepts that are mentioned in Atlas or Efforts? Propose ingestion targets.

9. **Log the run in `Wiki/log.md`.** One block: timestamp, number of orphans found/fixed, broken links found/fixed, duplicates merged, hot cache refreshed.

## Outputs
- A **report** to the user summarising findings before any destructive action.
- After user approval: cleaned-up wiki notes, updated index, refreshed hot cache, log entry.

## Rules & guardrails

- **Never delete a note without user approval.** Always report, wait, then act.
- **Never silently merge two notes.** The user sees the merge proposal first.
- **Do not touch Raw/.** Lint is wiki-only.
- **Preserve history.** If a note is being materially changed, keep the old version in a `## Previous version` section at the bottom until the user confirms.
- **Do not hallucinate backlinks.** Only create a backlink if you can point to the actual source sentence.

## Quality bar
After a lint, a fresh AI session should be able to answer any business question by reading `Wiki/index.md` and following 1-2 links — without needing to read `Raw/` or do a full-text search.
