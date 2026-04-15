---
type: wiki-hot-cache
generated-by: claude
updated: 2026-04-15
max-words: 1000
---

# Wiki — Hot Cache

Small recency buffer. Rewritten by [[AIOS/skills/lint-wiki]] whenever it runs. If you're an AI reading this first, this is the current state of what matters most.

---

## Right now — 2026-04-15

### Beroz frontend shipped — major milestone
The old frontend is dead. Beroz is a Juicebox AI clone — 52 pages scraped, pixel-accurate 10-page HTML dashboard, clean modern design (Inter, Material Icons, CSS variables). The ExcelTech instance is fully integrated with the backend (all 10 pages wired to live APIs). The SaaS instance is a static shell ready for multi-tenant wiring. Repo: [github.com/nikshostudios/beroz](https://github.com/nikshostudios/beroz). Design approach based on [[Wiki/concepts/Seven-Levels-of-Web-Design]].

**Current phase: testing + design iteration.** Test all ExcelTech pages end-to-end against live Supabase + Outlook. Tinkering with the design — the clone is the starting point, not the finish line. See [[Raw/docs/Beroz-Build-Session-2026-04-15]].

**Frontend strategy changed:** The Jinja2 → Next.js plan is replaced. The Beroz frontend is already a clean, modern single-file HTML app. The "rebuild later" step is gone.

### v2 System Architecture (still in progress)
Full v2 architecture from April 13: 8 sourcing channels, 7 agents, 4 implementation phases. Foundit EDGE API replaces cookie scraping. Phone-first enrichment. See [[Raw/docs/ExcelTech-Recruitment-Agent-Architecture-v3.html]].

**Phase 1 priority (weeks 1-4):** Migrate to Foundit EDGE API (blocked on API key from Prayag), ship JD Parser agent, fix Screener salary logic, Excel CRM export.

### In motion (by intensity)
- 🔥 **Active** — [[Efforts/ExcelTech-Automation/Overview|ExcelTech Automation]] — production deployed, Beroz frontend integrated. [[Efforts/Niksho-SaaS-Product/Overview|Niksho SaaS Product]] — Beroz frontend shipped, status upgraded from "planning" to "building".
- 🌀 **Ongoing** — [[Efforts/Second-Brain-Setup/Overview|Second Brain Setup]] shipped v1, maintenance mode.
- 💤 **Sleeping** — [[Efforts/Fundraising/Prep-2027|Fundraising 2027]].

### ExcelTech next steps (from Beroz session)
- Deploy Beroz to Railway with all env vars
- Test end-to-end with live Supabase + Outlook
- Add GeBIZ tender workflow (Singapore)
- Add notification bell with real-time polling
- Add WhatsApp Business API integration

### SaaS next steps (from Beroz session)
- Wire SaaS frontend to generic multi-tenant backend
- Add user registration / onboarding flow
- Build out chart visualizations in Analytics
- Add real-time notifications via WebSocket
- Make responsive for mobile

### Open decisions affecting the next session
- **Foundit EDGE API key** — blocked on Prayag providing the API key. Once received, Phase 1 can start.
- Apollo.io: Basic ($49/mo) vs Professional ($79/mo) — depends on monthly credit needs
- Naukri RMS: does ExcelTech already have a subscription? (Ask Nik's dad)
- **CLAUDE.md / mi.md audit** — run the five-filter rule audit on mi.md, strip it down, convert sections to skills. See [[Wiki/digests/YT-Context-Cleanup-Claude-Code-2026-04-14]]

### Open blockers
- **Foundit EDGE API key** — need from Prayag to start Phase 1.
- **Pending commits** — `upsert_candidate_by_name`, pipeline count fix, pipeline query limit are deployed but NOT pushed to GitHub.

### Guardrails for the AI reading this
- Do not edit anything in `Raw/`. It is sacred.
- Do not auto-send any email from any code path.
- Do not build or suggest LinkedIn scraping. Ever.
- Do not rewrite the Railway codebase for architectural purity. Extend in `/ai-agents/` or as new FastAPI routes.
- Always add `generated-by: <tool>` frontmatter to AI-authored files.

See [[mi]] for the full guardrail set.

---

_Updated on 2026-04-15 — Beroz build session ingested. Frontend pivot from Jinja2 → Juicebox clone. ExcelTech effort updated with new milestone. SaaS effort status upgraded to "building". Next steps merged into v2 Planning Log. Next rewrite: next time [[AIOS/skills/lint-wiki]] runs._
