---
type: map
purpose: navigation manual for AI and humans
updated: 2026-04-10
---

# Vault Map — How This Second Brain Is Organised

> This is the navigation manual for the Niksho vault.
> Any AI tool reading this should be able to move through the vault without scanning every file.
> The structure follows **Nick Milo's Ideaverse** (Home note + three headspaces, ACE model) for authored knowledge and active work, plus **Andrej Karpathy's LLM Knowledge Base** pattern for ingested research. Hybrid by design. See [[Atlas/Concepts/Ideaverse]] for the design pattern.

## 🚪 The one-line answer

**Read [[Home]] first.** It is the Launchpad. Everything else in this vault is reachable from there in two clicks.

If you've read Home and you're still lost, *then* read this map.

---

## The Seven Top-Level Things

```
NST/
├── Home.md      ← 🚪 Launchpad. Read this first. Always.
├── mi.md        ← portable identity (who we are)
├── claude.md    ← thin pointer → mi.md (kept so any AI tool can land here)
├── README.md    ← human-facing onboarding
│
├── Atlas/       ← 📚 authored knowledge. "What we know and believe." (Milo)
├── Calendar/    ← 🗓️ time-based notes. Daily / Weekly / Quarterly. (Milo)
├── Efforts/     ← ⚡ active work. "What we are doing." Four intensities. (Milo)
├── Raw/         ← 🧾 source documents. Untouched imports. Sacred. (Karpathy)
├── Wiki/        ← 🧠 compiled knowledge. Processed from Raw. (Karpathy)
├── AIOS/        ← 🤖 portable AI translation layer (this folder)
└── Templates/   ← 🗂️ reusable scaffolds (Daily Note, Effort, MOC, Decision, Weekly Review)
```

The folder tree mirrors the structure of [[Home]]. That mirroring is the **unified system** — knowledge, time, and action are three sides of one Ideaverse, not three silos.

---

## Layer 1: Atlas (Authored Knowledge)

**What it is:** Things Shoham and Nikhil know, believe, have decided. Stable knowledge about the business, product, market, team. Hand-written, not machine-compiled.

**When to read it:** When you need context about who we are, what we're building, why we made a decision, or what's in the product.

**When to write to it:** When a new fact or decision emerges that belongs here. Updating the product architecture. Adding a new client. Documenting a new agent.

**Sub-areas:**
- `Atlas/Business-Model/` — vision, phases, strategy, pricing, funding path
- `Atlas/ExcelTech/` — the proving-ground agency: team, markets, clients, current & new flow
- `Atlas/Product/` — architecture, agents, skills, database schema, sourcing channels, tech stack
- `Atlas/People/` — the humans: founders, TL, recruiters, advisors
- `Atlas/Concepts/` — cross-cutting ideas: AI OS, second brain, agentic workflows

**Entry point:** [[Atlas/Atlas]]

---

## Layer 2: Calendar (Time)

**What it is:** Time-bound notes. Daily journal, weekly reviews, quarterly OKRs and milestones.

**When to read it:** When you need to know what's happening this week, what the current priority is, or what shipped when.

**When to write to it:** Daily notes go in `Calendar/Daily/YYYY-MM-DD.md`. Weekly reviews in `Calendar/Weekly/`. Quarterly plans in `Calendar/Quarterly/`.

**Filename convention:**
- Daily: `2026-04-10.md`
- Weekly: `2026-W15.md`
- Quarterly: `2026-Q2.md`

**Entry point:** [[Calendar/Calendar]]

---

## Layer 3: Efforts (Active Projects)

**What it is:** Things being actively built or pursued. Each effort has an `Overview.md` plus child notes for sub-tasks.

**When to read it:** When the question is "what's the status of X?" or "what are we doing right now on Y?"

**When to write to it:** When a milestone hits, a sub-task is added, a risk is logged, a decision is made.

**Current efforts:**
- [[Efforts/ExcelTech-Automation/Overview]] — the five agents, Supabase migration, async pipeline
- [[Efforts/Niksho-SaaS-Product/Overview]] — productise for external clients, Insforge migration, GTM
- [[Efforts/Fundraising/Prep-2027]] — narrative, metrics, deck, target investors

**Entry point:** [[Efforts/Efforts]]

---

## Layer 4: Raw (Source Documents)

**What it is:** The unmodified source-of-truth inputs. Transcripts, exported docs, PDFs, clipped articles. Karpathy's "raw folder."

**When to read it:** When you need to verify a quote, find the original context, or ingest something new.

**When to write to it:** Only via the `ingest-source` skill. Human drops a file in; AI moves it into place and extracts wiki notes from it.

**Sub-folders:**
- `Raw/docs/` — canonical business docs (Vision, KB, pipeline refs, sourcing architecture)
- `Raw/transcripts/` — YouTube transcripts, meeting recordings, call notes
- `Raw/clippings/` — web articles saved via Obsidian Web Clipper

**Rule:** Never modify files in Raw. Extract, link, summarise — but the source stays untouched.

---

## Layer 5: Wiki (Compiled Knowledge)

**What it is:** Processed, cross-linked knowledge extracted from Raw. Karpathy's "wiki folder." Every note has backlinks. Query this, not Raw, for fast lookup.

**When to read it:** When you need to look up a concept, tool, person, or technique mentioned anywhere in the source material.

**When to write to it:** Only via the `ingest-source` or `lint-wiki` skills.

**Sub-folders:**
- `Wiki/concepts/` — abstract ideas (AI OS, RAG, second brain, agentic workflows)
- `Wiki/techniques/` — how-to patterns (hot cache, slash commands, linting)
- `Wiki/tools/` — tools and platforms (Obsidian, Claude Code, Firecrawl, Insforge)
- `Wiki/people/` — people referenced in the sources (Karpathy, Nick Milo, Vin, Greg Eisenberg)
- `Wiki/sources/` — one note per source document with summary + links

**Required files at `Wiki/` root:**
- `index.md` — master table of contents. Always up to date. Always read first.
- `log.md` — operation history. Every ingest, lint, or compaction logged here.
- `hot.md` — hot cache. ~500 words of the most recently relevant context.

---

## Layer 6: AIOS (The Translation Layer)

**What it is:** The portable layer that sits between the vault and any AI tool. Based on Nick Milo's AI OS.

**Files:**
- `AIOS/vault-map.md` — you are reading it
- `AIOS/skills-map.md` — index of recurring processes (see below)
- `AIOS/skills/*.md` — one file per skill

**When to read it:** At the start of every session, after `mi.md`.

---

## How An AI Should Navigate This Vault

### Cold start (always)
1. Read [[mi]] — who we are, the NOT-to-do list, golden rules.
2. Read [[Home]] — the Launchpad. Tells you what's hot right now and where to look next.
3. Read [[Wiki/hot]] — recency buffer for fresh sessions.
4. *Then* answer the question, picking the right path below.

### For a business question
1. Check [[Wiki/hot]] — is it in the hot cache?
2. Check [[Wiki/index]] — which wiki folders are relevant?
3. Read the relevant wiki notes and their backlinks.
4. If still not found, check [[Atlas/Atlas]] for authored context.
5. Only fall back to Raw if the wiki and Atlas don't cover it.

### For a "what are we doing" question
1. Go straight to [[Home]] — it shows the four intensities of efforts at a glance.
2. Then [[Efforts/Efforts]] for the active MOC and the relevant effort Overview.
3. Cross-reference with [[Calendar/Quarterly/2026-Q2]] for the wider plan.

### For a technical task on the product
1. Read [[Atlas/Product/Architecture]].
2. Read [[Atlas/Product/Agents]] if touching agents.
3. Read [[Raw/docs/ExcelTech_Pipeline_Developer_Reference]] for the canonical technical reference.
4. Check the relevant Effort overview for current in-progress work.

### For ingesting a new source
Use the [[AIOS/skills/ingest-source]] skill. Never dump into the wiki by hand.

### For daily operations
Use [[AIOS/skills/daily-briefing]] to start the day. Use [[AIOS/skills/standup]] to summarise what happened.

---

## What Does NOT Belong In This Vault

- Client PII (candidate names, phone numbers, emails). That lives in Supabase.
- Portal credentials. That lives encrypted in `portal_credentials` in Supabase.
- Slack logs, Gmail threads, WhatsApp chats. Those stay in their native apps.
- Code. Code lives in the `/ai-agents/` directory of the Railway project, not here.

This vault is for **thinking, deciding, strategising, learning**. Not for running the business day-to-day.

---

*Update this map when a new top-level folder is added, a sub-folder reorganises, or the navigation rules change.*
