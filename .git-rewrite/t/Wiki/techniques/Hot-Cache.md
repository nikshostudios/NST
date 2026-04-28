---
type: wiki-technique
generated-by: claude
sources: ["[[Raw/clippings/karpathy-llm-knowledge-bases]]", "[[Raw/transcripts/YT-Transcripts-2026-04-10]]"]
updated: 2026-04-10
---

# Hot Cache

## What it is
A small (~500 word) file that summarises the most important recent context for the current session. When a new AI session starts, the hot cache is one of the first files it reads — giving it immediate awareness of what matters right now without paying to re-read everything.

In Niksho's vault, this lives at `Wiki/hot.md` and is rewritten by [[AIOS/skills/lint-wiki]] whenever it runs.

## Where it comes from
Karpathy's LLM Knowledge Base approach mentions the value of small, distilled index files for fast navigation. Cole Medin's [claude-memory-compiler](https://github.com/coleam00/claude-memory-compiler) operationalises this as a recency buffer — a hot cache — that grows from session logs and gets pruned on compaction.

## What it should contain
- Top 3 currently-in-motion efforts (with status)
- Most-recently-updated Atlas notes (last 3–5)
- Latest Wiki concepts added
- Any open decisions that affect the next session
- Any open blockers

What it should **not** contain:
- Full historical context (that's what the rest of the vault is for)
- Stale items (anything older than a week should be pruned)
- Authored strategy that doesn't change session-to-session (put that in Atlas)

## Implementation in Niksho
- **File:** `Wiki/hot.md`
- **Size target:** ~500 words, hard cap at 1000
- **Rewritten by:** [[AIOS/skills/lint-wiki]] (manual invocation for now, possibly cron later)
- **Read by:** Every new AI session after `claude.md` → `mi.md` → `AIOS/vault-map.md`

## Why it matters
- **Token economics.** One small file beats loading a dozen larger ones for the same context.
- **Session freshness.** A new Claude session without the hot cache starts cold and has to re-derive priorities from the whole vault. With it, the first response is already oriented.
- **Drift detection.** If the hot cache is stale (last update > a few days ago), it's a signal the vault hasn't been used — a lint rule.

## Related
- [[Wiki/concepts/LLM-Knowledge-Base]]
- [[Wiki/techniques/Linting-Wiki]]
- [[Wiki/tools/Claude-Memory-Compiler]]
- [[AIOS/skills/lint-wiki]]
- [[AIOS/vault-map]]

## Sources
- [[Raw/clippings/karpathy-llm-knowledge-bases]]
- [[Raw/transcripts/YT-Transcripts-2026-04-10]]
