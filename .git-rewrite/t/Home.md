---
type: home
owner: Shoham & Nikhil
updated: 2026-04-10
cssclasses:
  - home
---

# Niksho — Home

> A place where all your knowledge is connected. A place where ideas go to live. A place that powers the mind and the actions in the world around it.
>
> — the promise of an Ideaverse, adapted for Niksho.

This is the Launchpad. Whenever you're lost, come here. Whenever you're starting, come here. Three headspaces — **knowledge**, **time**, **action** — each with a folder that mirrors it. Unified system.

---

## 🧭 The three headspaces

### 📚 Knowledge — [[Atlas/Atlas|Atlas]]
*What we know and believe.*

The authored layer. Stable ideas about the business, product, markets, people, and concepts. Return here to refresh context before a meeting, a decision, or a new push. If a fact is durable, it lives in Atlas.

- [[Atlas/Business-Model/Niksho-Vision|→ Vision]] · [[Atlas/Business-Model/Phase-1-ExcelTech|Phase 1]] · [[Atlas/Business-Model/Phase-2-GTM|Phase 2]] · [[Atlas/Business-Model/Phase-3-Funding|Phase 3]]
- [[Atlas/Product/Architecture|→ Product architecture]] · [[Atlas/Product/Agents|Agents]] · [[Atlas/Product/Skills|Skills]] · [[Atlas/Product/Database-Schema|Schema]]
- [[Atlas/ExcelTech/ExcelTech-Overview|→ ExcelTech]] · [[Atlas/ExcelTech/Team|Team]] · [[Atlas/ExcelTech/New-Flow|New flow]]
- [[Atlas/People/Shoham|→ People]]
- [[Atlas/Concepts/AI-OS|→ Concepts]] · [[Atlas/Concepts/File-over-AI|File over AI]] · [[Atlas/Concepts/Ideaverse|Ideaverse]] · [[Atlas/Concepts/Maps-of-Content|MOCs]]

### 🗓️ Time — [[Calendar/Calendar|Calendar]]
*What is happening right now, this week, this quarter.*

Sparks, daily reflections, weekly reviews, quarterly direction. Come here when you need to capture a thought fast or take stock of where the quarter is going.

- [[Calendar/Daily/2026-04-10|→ Today]]
- [[Calendar/Quarterly/2026-Q2|→ This quarter — "Prove it at ExcelTech"]]

### ⚡ Action — [[Efforts/Efforts|Efforts]]
*What we are doing.*

Active pushes with start, end, and a definition of done. Managed by the **four intensities**: Active · Ongoing · Simmering · Sleeping. See [[Atlas/Concepts/Four-Intensities-of-Efforts]].

- 🔥 **Active** — [[Efforts/ExcelTech-Automation/Overview|ExcelTech Automation]] · [[Efforts/Niksho-SaaS-Product/Overview|Niksho SaaS Product]]
- 🌀 **Ongoing** — [[Efforts/Second-Brain-Setup/Overview|Second Brain Setup]] (vault maintenance — shipped v1 on 2026-04-10)
- 🌱 **Simmering** — _(nothing — SaaS promoted to Active 2026-04-10)_
- 💤 **Sleeping** — [[Efforts/Fundraising/Prep-2027|Fundraising 2027]]

---

## ✅ Shared To-Do

**[[TODO|TODO.md]]** — the active task board for Nik + Nikhil. Updated by Claude after each session report. Open this if you're not sure what to work on next.

---

## 🔥 Right now

- **Top effort:** [[Efforts/ExcelTech-Automation/Overview|ExcelTech Automation]] — production, refining weekly
- **Building now:** [[Efforts/Niksho-SaaS-Product/Overview|Niksho SaaS Product]] — v2 architecture designed, Foundit EDGE API analyzed. **Next step: Phase 1 — migrate Foundit to official EDGE API** (blocked on API key from Prayag). Build tracker: [[Efforts/Niksho-SaaS-Product/v2-Planning-Log]]
- **Quarterly theme:** [[Calendar/Quarterly/2026-Q2|2026-Q2 — Prove it at ExcelTech]]
- **Hot cache (for AI sessions):** [[Wiki/hot|Wiki/hot.md]]

---

## ⚙️ Quick actions

- **Create today's note** — click the ribbon ✎ or `Ctrl/Cmd + P` → "Open today's daily note" (template: [[Templates/Daily Note]])
- **Start a new effort** — run [[AIOS/skills/new-effort]] or copy [[Templates/Effort]]
- **Capture a source** — drop a file into `Raw/clippings/`, then run [[AIOS/skills/ingest-source]]
- **Log a decision** — [[AIOS/skills/log-decision]], file it under the relevant Effort
- **Clean the vault** — [[AIOS/skills/lint-wiki]] (rebuilds [[Wiki/hot]])

---

## 🧠 Knowledge base — look things up

- [[Wiki/index|Wiki/index.md]] — every compiled concept, technique, tool, person
- [[Wiki/hot|Wiki/hot.md]] — recency buffer for fresh AI sessions
- [[Raw/docs/ExcelTech_Master_Knowledge_Base|Raw knowledge base]] — the canonical business doc (read-only)

---

## 🤖 For the AI reading this

If you're an AI opening this vault cold, this is your entry point. Read in order:
1. [[mi|mi.md]] — who we are, how we work, the NOT-to-do list
2. [[AIOS/vault-map]] — navigation manual
3. [[Wiki/hot]] — what's hot right now
4. Answer the question using the links above.

Golden rules — never edit `Raw/`, never auto-send emails, never touch LinkedIn scraping, never rewrite the Railway app for architectural purity, always stamp AI-authored files with `generated-by:` frontmatter. Full list in [[mi]].

---

## 🗂️ Unified structure — folders ↔ links

The folder tree mirrors this Home note. Knowledge → `Atlas/`. Time → `Calendar/`. Action → `Efforts/`. Source material → `Raw/`. Compiled notes → `Wiki/`. AI manuals → `AIOS/`. Reusable scaffolds → `Templates/`.

```
NST/
├── Home.md              ← you are here
├── mi.md                ← portable identity
├── claude.md            ← thin pointer to mi.md
├── README.md            ← human onboarding
│
├── Atlas/     📚 Knowledge — authored
├── Calendar/  🗓️ Time — daily / weekly / quarterly
├── Efforts/   ⚡ Action — four intensities
├── Raw/       🧾 Source — sacred, never edited
├── Wiki/      🧠 Compiled — AI-written from Raw
├── AIOS/      🤖 AI manuals + skills
└── Templates/ 🗂️ Scaffolds for new notes
```
