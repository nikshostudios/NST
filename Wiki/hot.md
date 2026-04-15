---
type: wiki-hot-cache
generated-by: claude
updated: 2026-04-15b
max-words: 1000
---

# Wiki — Hot Cache

Small recency buffer. Rewritten by [[AIOS/skills/lint-wiki]] whenever it runs. If you're an AI reading this first, this is the current state of what matters most.

---

## Right now — 2026-04-15 (evening)

### Juicebox teardown complete — UI reference captured
Full reverse-engineering of Juicebox AI (app.juicebox.ai) completed. 700-line teardown document produced at `NST/research/2026-04-14-juicebox-agent-teardown.md` covering complete tech stack, design system (colors, typography, spacing, transitions), component hierarchy, and build plan. See [[Wiki/digests/Session-Juicebox-Teardown-2026-04-15]].

**Playwright DOM crawler built and run.** Automated crawler at `recruitment-agents/juicebox-crawler/` captured 43 HTML files covering every sidebar page, modals, settings, integrations. Second pass script (`crawl-missing.js`) ready to capture missing pages: search results (the #1 priority), candidate details, agent chat conversation, analytics sub-tabs, sequence details.

**Key insight: search-first, not dashboard-first.** The first Claude Code build attempt produced a generic dashboard (metric cards, pipeline tables). Juicebox's actual UI is a [[Wiki/concepts/Search-First-SaaS-UI|search-first interface]] — natural language search bar → AI-ranked candidate cards with match explanations. The Niksho UI must follow this pattern. See [[Wiki/concepts/Search-First-SaaS-UI]].

### Frontend strategy: hybrid Juicebox + Niksho
NOT a pure clone. Take Juicebox's UI patterns (search-first, candidate cards, sidebar navigation, status dropdowns, filter/criteria pills) and combine with Niksho-specific features (multi-agent dashboards, screening pipeline, outreach sequences, submission formatting for client delivery). The captured HTML files are the ground-truth reference for Claude Code.

**Next step:** Run `crawl-missing.js` to capture the search results page and candidate details, then feed the full HTML capture set to Claude Code to build the hybrid UI in `recruitment-agents/niksho-ui/`.

### Beroz frontend — still the deployed version
Beroz (previous Juicebox clone attempt) remains the current deployed frontend. The new hybrid UI will replace it once built and tested. See [[Raw/docs/Beroz-Build-Session-2026-04-15]].

### v2 System Architecture (still in progress)
Full v2 architecture from April 13: 8 sourcing channels, 7 agents, 4 implementation phases. Foundit EDGE API replaces cookie scraping. Phone-first enrichment. See [[Raw/docs/ExcelTech-Recruitment-Agent-Architecture-v3.html]].

**Phase 1 priority (weeks 1-4):** Migrate to Foundit EDGE API (blocked on API key from Prayag), ship JD Parser agent, fix Screener salary logic, Excel CRM export.

### In motion (by intensity)
- 🔥 **Active** — [[Efforts/ExcelTech-Automation/Overview|ExcelTech Automation]] — production deployed, Beroz frontend live. [[Efforts/Niksho-SaaS-Product/Overview|Niksho SaaS Product]] — Juicebox teardown done, hybrid UI next.
- 🌀 **Ongoing** — [[Efforts/Second-Brain-Setup/Overview|Second Brain Setup]] shipped v1, maintenance mode.
- 💤 **Sleeping** — [[Efforts/Fundraising/Prep-2027|Fundraising 2027]].

### New techniques added to vault
- [[Wiki/concepts/Authenticated-SPA-Capture]] — how to extract DOM from OAuth-protected apps
- [[Wiki/techniques/Playwright-DOM-Crawling]] — automated multi-page capture with session persistence

### Open blockers
- **Foundit EDGE API key** — need from Prayag to start Phase 1.
- **Playwright round 2** — `crawl-missing.js` needs to run to capture search page + candidate details before hybrid UI build.
- **Pending commits** — `upsert_candidate_by_name`, pipeline count fix, pipeline query limit are deployed but NOT pushed to GitHub.

### Guardrails for the AI reading this
- Do not edit anything in `Raw/`. It is sacred.
- Do not auto-send any email from any code path.
- Do not build or suggest LinkedIn scraping. Ever.
- Do not rewrite the Railway codebase for architectural purity. Extend in `/ai-agents/` or as new FastAPI routes.
- Always add `generated-by: <tool>` frontmatter to AI-authored files.

See [[mi]] for the full guardrail set.

---

_Updated on 2026-04-15 evening — Juicebox teardown session ingested. Playwright crawler output logged. Hybrid UI strategy documented. New concepts: Authenticated-SPA-Capture, Search-First-SaaS-UI. New technique: Playwright-DOM-Crawling._
