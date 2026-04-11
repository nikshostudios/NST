---
type: readme
updated: 2026-04-10
---

# Niksho Second Brain

A vault of markdown files that holds everything Nikhil and Shoham are building at Niksho. Works in Obsidian as a real **Ideaverse**, works in any code editor, works with any AI tool you drop into it.

Built on a hybrid of Nick Milo's **Ideaverse** (Home note + three headspaces, ACE folders, four intensities of efforts) and Andrej Karpathy's **LLM Knowledge Base** pattern (raw → compiled → wiki). The why is in [[Atlas/Concepts/Ideaverse]] and [[Atlas/Concepts/AI-OS]].

## 🚪 Open this in Obsidian

1. Open Obsidian → "Open folder as vault" → select this `NST/` directory.
2. The `.obsidian/` folder is checked in, so the workspace, daily notes, templates, bookmarks, and graph colors all come pre-configured.
3. The vault opens on **`Home.md`** by default. That's the Launchpad.

## If you're a human opening this for the first time
Start with these three files, in order:
1. **[[Home]]** — the Launchpad. The dashboard for everything.
2. **[[mi]]** — who we are, what we're building, the rules we follow.
3. **[[AIOS/vault-map]]** — where everything lives and what goes in each folder.

Then pick your entry point:
- Strategy: **[[Atlas/Business-Model/Niksho-Vision]]**
- Product: **[[Atlas/Product/Architecture]]**
- The agency we're automating: **[[Atlas/ExcelTech/ExcelTech-Overview]]**
- Active work: **[[Efforts/Efforts]]**

## If you're an AI tool opening this for the first time
1. Read **[[claude|claude.md]]** (if you are Claude) or jump straight to **[[mi]]** otherwise.
2. Read **[[Home]]** — the Launchpad. It tells you what's hot right now.
3. Read **[[AIOS/vault-map]]** if you need orientation.
4. Read **[[Wiki/hot|Wiki/hot.md]]** for the current recency buffer.
5. You are now oriented. Operate within the guardrails in [[mi#NOT-to-do]].

## The folder structure at a glance

```
NST/
├── Home.md                🚪 Launchpad — the dashboard. Read this first.
├── mi.md                  Portable identity file (any AI can read)
├── claude.md              Thin pointer for Claude → reads mi.md
├── README.md              This file
├── .obsidian/             Obsidian config (workspace, plugins, daily notes, templates)
│
├── Atlas/                 📚 Authored: what we know and have decided
│   ├── Atlas.md           MOC (active, not an index)
│   ├── Business-Model/    Vision, phases, GTM, thesis
│   ├── ExcelTech/         The agency we're automating
│   ├── Product/           Architecture, agents, schema, stack
│   ├── People/            Shoham, Nikhil, Raja, recruiters
│   └── Concepts/          Ideaverse, ARC, Four-Intensities, MOCs, AI-OS, File-over-AI
│
├── Calendar/              🗓️ Time-based notes
│   ├── Calendar.md        MOC
│   ├── Daily/             Daily notes (auto-created by Obsidian → Templates/Daily Note)
│   ├── Weekly/            Weekly reviews (Templates/Weekly Review)
│   └── Quarterly/         Quarterly plans (the important one)
│
├── Efforts/               ⚡ Active work, organized by four intensities
│   ├── Efforts.md         MOC (active, with Active/Ongoing/Simmering/Sleeping)
│   ├── Second-Brain-Setup/   🔥 Active
│   ├── ExcelTech-Automation/ 🔥 Active
│   ├── Niksho-SaaS-Product/  🌱 Simmering
│   └── Fundraising/          💤 Sleeping
│
├── Raw/                   🧾 Source material (SACRED — never edited)
│   ├── clippings/         Web articles, tweets, gists
│   ├── transcripts/       YouTube, meetings
│   └── docs/              Internal docs (ExcelTech knowledge base, etc.)
│
├── Wiki/                  🧠 Compiled: AI-written notes from Raw
│   ├── index.md           Navigation spine
│   ├── log.md             Append-only ingestion log
│   ├── hot.md             Recency buffer (~500 words)
│   ├── concepts/
│   ├── techniques/
│   ├── tools/
│   └── people/
│
├── AIOS/                  🤖 Manuals and skills for the AI itself
│   ├── vault-map.md       Navigation manual
│   ├── skills-map.md      Index of recurring processes
│   └── skills/            10 skill definitions
│
└── Templates/             🗂️ Reusable scaffolds (Daily Note, Effort, MOC, Decision, Wiki Concept, Weekly Review)
```

## The core principles

1. **File over AI.** The source of truth is a markdown file in a git repo, not a vector DB, not an app, not a model's context window. See [[Atlas/Concepts/File-over-AI]].
2. **Atlas is authored. Wiki is compiled. Raw is sacred.** Human writes Atlas. AI writes Wiki from Raw. Raw never gets edited in place.
3. **Every AI-generated file carries a `generated-by:` field in its frontmatter.** Humans always know what they wrote vs what an AI wrote.
4. **The vault is tool-agnostic.** `claude.md` is a thin pointer; identity lives in `mi.md` so GPT, Gemini, and everything next can use the same vault.
5. **Portability over prettiness.** We don't use Obsidian plugins that would lock us in. Markdown + wikilinks + frontmatter is everything.
6. **Decisions live in files.** If a decision isn't written down, it didn't happen.

## Daily rhythm (when we actually use this)

- **Morning:** run [[AIOS/skills/daily-briefing]] → produces `Calendar/Daily/<today>.md` with Top 3, in-motion list, hot cache summary.
- **During the day:** capture sources into `Raw/clippings/` via Obsidian Web Clipper. Log decisions via [[AIOS/skills/log-decision]] into the relevant effort.
- **End of day:** run [[AIOS/skills/standup]] → appends Yesterday/Today/Blockers to the daily note.
- **Weekly (Friday):** open [[Calendar/Quarterly/2026-Q2]] and add a weekly check-in entry.
- **As needed:** run [[AIOS/skills/ingest-source]] on new clippings and transcripts. Run [[AIOS/skills/lint-wiki]] when the vault feels stale.

## How to create a new effort
```
/ai-skill new-effort "Effort Name"
```
Or manually: mkdir, copy the template from [[AIOS/skills/new-effort]], scaffold Overview.md.

## How to add a new source
1. Drop the source into `Raw/clippings/` (or `Raw/transcripts/`, or `Raw/docs/` — whichever applies).
2. Run [[AIOS/skills/ingest-source]] against the file.
3. Check `Wiki/log.md` for what was added.

## What NOT to do
- Don't edit anything in `Raw/`.
- Don't write authored strategy inside `Wiki/` — that belongs in Atlas.
- Don't create files without frontmatter.
- Don't commit secrets. Ever.
- See [[mi#NOT-to-do]] for the full list.

## For replicating this vault for personal use
The vault structure is deliberately tool- and content-agnostic. To clone it for personal use:
1. Copy the folder structure (without the content).
2. Rewrite [[mi]] from scratch — this is the one file that's yours alone.
3. Keep [[AIOS/vault-map]] and the `AIOS/skills/` folder as-is.
4. Start by dropping one source into `Raw/clippings/` and running [[AIOS/skills/ingest-source]].
5. Build Atlas as you go — don't pre-populate. Atlas should reflect what you actually know.

## Questions to ask the vault

Once populated, the vault answers questions like:
- "Why did we choose Sonnet 4 for the Screener agent?" → [[Atlas/Product/Agents#Model-choice]]
- "What's our nationality rule for SG reqs?" → [[Atlas/ExcelTech/Singapore-Market#The-nationality-rule]]
- "When do we start fundraising?" → [[Atlas/Business-Model/Phase-3-Funding]]
- "What's the current status of ExcelTech automation?" → [[Efforts/ExcelTech-Automation/Overview]]

If the vault can't answer a question it should be able to, that's a signal to either author an Atlas note or ingest a new source.

## Related
- [[mi]]
- [[claude]]
- [[AIOS/vault-map]]
- [[AIOS/skills-map]]
- [[Atlas/Concepts/AI-OS]]
- [[Atlas/Concepts/Second-Brain]]
