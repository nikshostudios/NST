---
type: wiki-hot-cache
generated-by: claude
updated: 2026-04-10
max-words: 1000
---

# Wiki — Hot Cache

Small recency buffer. Rewritten by [[AIOS/skills/lint-wiki]] whenever it runs. If you're an AI reading this first, this is the current state of what matters most.

---

## Right now — 2026-04-10

### In motion (by intensity)
- 🔥 **Active** — [[Efforts/ExcelTech-Automation/Overview|ExcelTech Automation]] is the sole Active effort. All 5 agents and 5 skills live in Nik's agency. Current focus: baseline metrics and per-recruiter voice tuning.
- 🌀 **Ongoing** — [[Efforts/Second-Brain-Setup/Overview|Second Brain Setup]] shipped v1 on 2026-04-10 and demoted from Active. Maintenance only from here: lint-wiki passes, weekly drift checks, ingestion of new sources. See [[Efforts/Second-Brain-Setup/decisions/2026-04-10-ship-vault-v1|ship-v1 decision]].
- 🌱 **Simmering** — [[Efforts/Niksho-SaaS-Product/Overview|Niksho SaaS Product]] awaits its trigger: ExcelTech-Automation showing two weeks of stable production, then promote and start the Insforge migration.
- 💤 **Sleeping** — [[Efforts/Fundraising/Prep-2027|Fundraising 2027]]. No round in 2026. Wakes late 2026 once Phase 2 has paying customers.

### Freshly added to Atlas
- [[Atlas/Concepts/AI-OS]] — the hybrid architecture (Milo ACE + Karpathy raw/wiki)
- [[Atlas/Concepts/File-over-AI]] — markdown + git as the only portable substrate
- [[Atlas/Concepts/Agents-vs-Tools]] — where judgement lives
- [[Atlas/Product/Architecture]] + [[Atlas/Product/Agents]] + [[Atlas/Product/Skills]] + [[Atlas/Product/Database-Schema]] + [[Atlas/Product/Sourcing-Channels]] + [[Atlas/Product/Tech-Stack]] — full product picture
- [[Atlas/ExcelTech/India-Market]] + [[Atlas/ExcelTech/Singapore-Market]] + [[Atlas/ExcelTech/Current-Flow]] + [[Atlas/ExcelTech/New-Flow]] — the two markets and the before/after of the recruiter day

### Freshly added to Wiki
- [[Wiki/concepts/LLM-Knowledge-Base]] (Karpathy)
- [[Wiki/concepts/Compiler-Analogy]] (Karpathy + Cole Medin)
- [[Wiki/techniques/Hot-Cache]] (this file's pattern)
- [[Wiki/techniques/Linting-Wiki]]
- [[Wiki/tools/Claude-Memory-Compiler]] (Cole's project)
- [[Wiki/people/Andrej-Karpathy]] + [[Wiki/people/Nick-Milo]] + [[Wiki/people/Cole-Medin]]

### Open decisions affecting the next session
- Whether to implement Cowork session hooks (session-start, pre-compact, session-end) now or later. Leaning later.
- How to measure "recruiter hours saved per day" in a way the team agrees is fair. Blocking the ExcelTech Phase-1 success metrics.
- Insforge vs Railway boundary: ExcelTech stays on Railway; SaaS goes to Insforge. Decided. See [[Efforts/Niksho-SaaS-Product/Overview]].

### Open blockers
None for the vault — Second-Brain-Setup shipped v1 today and is now Ongoing. Niksho-SaaS is unblocked structurally; the only thing holding it back is the trigger (two weeks of stable ExcelTech-Automation production).

### Guardrails for the AI reading this
- Do not edit anything in `Raw/`. It is sacred.
- Do not auto-send any email from any code path.
- Do not build or suggest LinkedIn scraping. Ever.
- Do not rewrite the Railway codebase for architectural purity. Extend in `/ai-agents/` or as new FastAPI routes.
- Always add `generated-by: <tool>` frontmatter to AI-authored files.

See [[mi]] for the full guardrail set.

---

_Rewritten on 2026-04-10 — Second-Brain-Setup demoted from Active to Ongoing after v1 ship. Next rewrite: next time [[AIOS/skills/lint-wiki]] runs._
