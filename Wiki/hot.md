---
type: wiki-hot-cache
generated-by: claude
updated: 2026-04-11
max-words: 1000
---

# Wiki — Hot Cache

Small recency buffer. Rewritten by [[AIOS/skills/lint-wiki]] whenever it runs. If you're an AI reading this first, this is the current state of what matters most.

---

## Right now — 2026-04-11

### CRITICAL: Sourcing pipeline partially broken
Production test on April 11 revealed 3 of 4 sourcing channels return job postings, not candidates. Only Foundit Recruiter returns real candidates but is blocked by Akamai bot detection. See [[Raw/docs/sourcing-troubleshooting-2026-04-11]] and [[Atlas/Product/Sourcing-Strategy-v2]] for the revised plan.

**Immediate actions:** (1) Intercept Foundit Recruiter XHR endpoint, (2) Fix Internal DB skill matching, (3) Push pending commits, (4) Evaluate Apollo.io paid plan.

### In motion (by intensity)
- 🔥 **Active** — [[Efforts/ExcelTech-Automation/Overview|ExcelTech Automation]] — production deployed but sourcing pipeline needs fixes per [[Atlas/Product/Sourcing-Strategy-v2]]. [[Efforts/Niksho-SaaS-Product/Overview|Niksho SaaS Product]] — architecture decided, Managed Agents demo next.
- 🌀 **Ongoing** — [[Efforts/Second-Brain-Setup/Overview|Second Brain Setup]] shipped v1, maintenance mode.
- 💤 **Sleeping** — [[Efforts/Fundraising/Prep-2027|Fundraising 2027]].

### Freshly added to Atlas
- [[Atlas/Concepts/AI-OS]] — the hybrid architecture (Milo ACE + Karpathy raw/wiki)
- [[Atlas/Concepts/File-over-AI]] — markdown + git as the only portable substrate
- [[Atlas/Concepts/Agents-vs-Tools]] — where judgement lives
- [[Atlas/Product/Architecture]] + [[Atlas/Product/Agents]] + [[Atlas/Product/Skills]] + [[Atlas/Product/Database-Schema]] + [[Atlas/Product/Sourcing-Channels]] + [[Atlas/Product/Tech-Stack]] — full product picture
- [[Atlas/ExcelTech/India-Market]] + [[Atlas/ExcelTech/Singapore-Market]] + [[Atlas/ExcelTech/Current-Flow]] + [[Atlas/ExcelTech/New-Flow]] — the two markets and the before/after of the recruiter day

### Freshly added to Wiki (April 11)
- [[Wiki/concepts/Candidate-Sourcing-Channels]] — the job-postings vs candidates lesson
- [[Wiki/concepts/Bot-Detection-vs-Scraping]] — fingerprinting hierarchy
- [[Wiki/tools/Firecrawl]] — where it helps and where it fails
- [[Wiki/techniques/Direct-API-Interception]] — the Foundit fix approach

### Freshly added to Atlas (April 11)
- [[Atlas/Product/Sourcing-Strategy-v2]] — revised channel strategy with 8 next actions

### Open decisions affecting the next session
- Apollo.io: Basic ($49/mo) vs Professional ($79/mo) — depends on how many credits ExcelTech needs monthly
- Naukri RMS: does ExcelTech already have a subscription? (Ask Nik's dad)
- Foundit API partnership: worth pursuing? (Email cr@foundit.in)

### Open blockers
- **Sourcing pipeline** — Foundit Recruiter blocked by Akamai. Internal DB skill matching broken (composite skills). Zero working external channels until fixes land.
- **Pending commits** — `upsert_candidate_by_name`, pipeline count fix, pipeline query limit are deployed but NOT pushed to GitHub.

### Guardrails for the AI reading this
- Do not edit anything in `Raw/`. It is sacred.
- Do not auto-send any email from any code path.
- Do not build or suggest LinkedIn scraping. Ever.
- Do not rewrite the Railway codebase for architectural purity. Extend in `/ai-agents/` or as new FastAPI routes.
- Always add `generated-by: <tool>` frontmatter to AI-authored files.

See [[mi]] for the full guardrail set.

---

_Rewritten on 2026-04-11 — Sourcing pipeline post-mortem ingested, strategy v2 written, hot cache updated with blockers. Next rewrite: next time [[AIOS/skills/lint-wiki]] runs._
