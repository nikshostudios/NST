---
type: atlas-note
area: Product
updated: 2026-04-10
sources: ["[[Raw/docs/ExcelTech_Master_Knowledge_Base]]", "[[Raw/docs/sourcing-architecture]]"]
---

# Product — Architecture

## One-sentence picture
A Python/FastAPI web app on Railway, backed by Supabase Postgres, with an `/ai-agents/` layer that runs 5 agents and a skills layer that orchestrates the daily recruiter workflow. All state in Postgres, all markdown in this vault, all portable.

## Layer diagram (mental model)

```
┌──────────────────────────────────────────────────┐
│  Web app (FastAPI + server-rendered templates)  │
│  Role-based UI: TL screens vs recruiter screens  │
└─────────────┬───────────────────────────┬────────┘
              │                           │
     ┌────────▼────────┐         ┌────────▼────────┐
     │  /ai-agents/    │         │  APScheduler    │
     │  (Niksho IP)    │         │  (15 min cron)  │
     └────────┬────────┘         └────────┬────────┘
              │                           │
              └───────────┬───────────────┘
                          │
                ┌─────────▼──────────┐
                │   Supabase (PG)    │
                │   single source    │
                │   of truth         │
                └─────────┬──────────┘
                          │
          ┌───────────────┼───────────────┐
          │               │               │
  ┌───────▼─────┐ ┌───────▼─────┐ ┌──────▼─────┐
  │ MS Graph    │ │  Foundit    │ │  Claude    │
  │ (10 inboxes)│ │  Firecrawl  │ │  Sonnet 4  │
  └─────────────┘ └─────────────┘ └────────────┘
```

## The layers in detail

### Web app (FastAPI)
- **Framework:** FastAPI with Jinja2 server-rendered HTML. No React, no SPA. Deliberately.
- **Why server-rendered:** faster to ship, fewer moving parts, easier for recruiters on mid-tier laptops, trivial to deploy to Railway.
- **Auth:** simple `RECRUITER_LOGINS` dict with role flags (`TL` vs `recruiter`). Will harden before SaaS launch — see [[Efforts/Niksho-SaaS-Product/Overview]].
- **Role-based routing:** TL sees Submission Queue, Create Requirement, Approve-and-Send screens. Recruiters see Source/Screen, Outreach Queue, My Candidates.

### `/ai-agents/` layer
Our IP. Never built on top of third-party agent platforms (OpenClaw, Paperclip, etc.) — see [[Atlas/Business-Model/Product-Thesis#Why-we-own-the-stack]].

Contains:
- Agent definitions (prompts, tools, schemas) — one folder per agent
- Skill runners (the orchestration layer that calls multiple agents in sequence)
- Prompt versioning (git-tracked, since prompts ARE the code)
- Per-agent token budget caps

Five agents live here. See [[Atlas/Product/Agents]].

### Scheduler (APScheduler)
- Runs inside the same FastAPI process (no separate worker service, by design, to keep Railway footprint tiny).
- Every 15 minutes: scans each recruiter's inbox via MS Graph, hands new messages to the Follow-up agent.
- Hourly: token cache invalidation, requirement status reconciliation.
- Daily: end-of-day summary rollup.

### Supabase Postgres
Single source of truth for everything stateful. Schema summarised in [[Atlas/Product/Database-Schema]]. Key tables:

- `requirements`, `clients`, `client_contacts`
- `candidates`, `cvs` (with URL references to stored files)
- `submissions`, `gebiz_tenders`, `gebiz_submissions`
- `recruiter_actions` (audit log for every agent action)
- `agent_runs` (token usage, cost, latency per invocation)

Row-level security is scoped but not aggressive yet — will tighten for multi-tenant in Phase 2.

### External integrations
- **Microsoft Graph API** — 10 individual recruiter inboxes, per-user OAuth, 1-hour token cache. See [[Atlas/ExcelTech/Team#Key-technical-fact]].
- **Foundit** — scraping via Firecrawl with credentialed sessions across 3 shared accounts. Account rotation logic in [[Atlas/Product/Sourcing-Channels]].
- **MyCareersFuture** — free Singapore government API. No scraping needed. SG-only.
- **Apollo.io Professional** — prospecting for the BD side (client acquisition, not candidate sourcing).
- **Claude API** — Sonnet 4 for reasoning-heavy agents (Screener, Outreach), Haiku 4.5 for cheap high-volume calls (parsing, classification).
- **LinkedIn** — **manual only**. Not automated. Not scraped. Ever.

## Deployment
- **Host:** Railway (current) → migrating to Insforge for SaaS kickoff (see [[Efforts/Niksho-SaaS-Product/Overview]]).
- **Config:** environment variables only. No secrets in code.
- **Observability:** structured logs → Railway log drain; agent_runs table is the primary operational dashboard.

## Core design principles
1. **Postgres is the source of truth. The UI is a view.** If it's not in the DB, it didn't happen.
2. **Agents are tools, not platforms.** Every agent is a function with typed inputs and outputs. See [[Atlas/Concepts/Agents-vs-Tools]].
3. **No auto-send.** Every outbound email is drafted by an agent, reviewed by a human, sent by the human's click.
4. **Individual Outlook per recruiter.** Never a shared inbox. Never a "from noreply@excelt".
5. **Prompts are git-tracked.** Prompt changes are code changes. PR-reviewed.
6. **Don't rewrite — extend.** The existing Railway app works. New functionality lives in `/ai-agents/` or as new FastAPI routes. Never refactor for its own sake.

## Related
- [[Atlas/Product/Agents]]
- [[Atlas/Product/Skills]]
- [[Atlas/Product/Database-Schema]]
- [[Atlas/Product/Sourcing-Channels]]
- [[Atlas/Product/Tech-Stack]]
- [[Atlas/Concepts/Agents-vs-Tools]]
- [[Atlas/Concepts/File-over-AI]]
