---
type: wiki-digest
generated-by: claude
sources: ["[[Raw/docs/Beroz-Session-2026-04-17]]"]
date: 2026-04-17
updated: 2026-04-17
commits: ["423a01e", "56ba201"]
status: shipped
tags: [beroz, exceltech, projects, supabase, ui, search, sidebar, production]
---

# Beroz Projects Layer + Sidebar + Search Hero — Shipped 2026-04-17

## Core argument

Beroz went from a single-tenant "Agent Home" landing page to a project-scoped workspace. Two commits (`423a01e`, `56ba201`) landed on `main` and Railway auto-deployed. The shipped change is a real [[Wiki/concepts/Projects-as-Scoping-Primitive|Projects layer]] in Supabase (not in-memory state), a restructured sidebar that distinguishes project-scoped surfaces from global ones, a [[Wiki/concepts/Search-First-Hero-Mode-Chips|competitor-inspired Search hero]] with 4 intent-mode chips, and a wired avatar dropdown with real modals instead of console-log stubs. Crucially, the session also settled the "does a Requirement belong to a Project?" question — **Requirements stays global** — which makes the sidebar's 3-zone structure principled rather than arbitrary.

## Key principles/findings

**Projects as the top-level organizational unit.** Real Supabase tables: `projects` (id, title, access_level shared|private, status, created_by, created_at) and `project_collaborators` (project_id, user_email). `requirements` gets a nullable `project_id` FK so we can opt back in later, but it is currently unused — Requirements is a global TL-owned pool. The access model for visibility is: owner **OR** `access_level='shared'` **OR** listed in `project_collaborators`. Only the creator can edit/archive/delete; any logged-in user can create.

**The sidebar encodes the scoping boundary.** Three zones, from top to bottom: (1) global-top with "All Projects", (2) a boxed **Project Card** containing Projects dropdown + Searches + Shortlist — these are the surfaces scoped by `state.activeProject`, (3) global-middle with Requirements / Contacts / Sequences / Submissions (TL-only) / Analytics / Integrations. The visual grouping communicates the data model: if it's in the project card, it's scoped; if it's outside, it's global. Currently only `/api/pipeline` actually respects `activeProject` — `/api/search` ignores it and the "In: <project>" strip is cosmetic. That's a known follow-up.

**Avatar moved to the bottom-left sidebar.** Opens upward. Five items, all wired to real modals or real links (no console.logs): Invite members (lists team via new `/api/team`, send disabled), Help center, Knowledge base, Contact support (mailto + clipboard copy), Sign out (`/logout`). The header is now minimal — notifications + page title only.

**Search page rebuilt as an intent-capture hero.** "Hey \<firstName\>, who are you looking for?" + 4 mode chips (Find Similar / Job Description / Boolean / Select Manually — chips only change the placeholder, backend call is identical) + purple-glow textarea + circular send + 5 clickable example queries. After a query runs the hero collapses into a compact header with results below. This pattern is extracted as [[Wiki/concepts/Search-First-Hero-Mode-Chips]] — directly complements [[Wiki/concepts/Search-First-SaaS-UI]].

**Agent Home is dead.** The greeting + chat input + quick-action chips on `/app` are gone. Default landing is now **All Projects**. The dynamic "Hi Raju" greeting code was also removed. This is a deliberate reversal of the earlier "chat is the home" instinct — projects are the home.

**Auto git-pull hook on every prompt.** A `UserPromptSubmit` hook in `~/.claude/settings.json` runs `git -C ".../beroz" pull --ff-only origin main` before each prompt, keeping local and GitHub in sync without thinking. See [[Wiki/techniques/Auto-Git-Pull-Hook]].

**Git auth side-quest.** The local keychain was cached to `thenikhil05`, causing push failures. `gh auth setup-git` switched git to use the active `nikshostudios` GitHub account. Worth keeping in the debugging playbook.

## Workflow visualisation — Sidebar 3-zone structure

```
╭─ Logo / Org / Collapse ──────────────╮
│                                      │
│  All Projects            ← GLOBAL TOP
│                                      │
│  ╭─ Project Card ──────────────────╮ │
│  │   Projects (dropdown)           │ │ ← SCOPED BY
│  │   Searches                      │ │   state.activeProject
│  │   Shortlist                     │ │
│  ╰─────────────────────────────────╯ │
│                                      │
│  Requirements           ← GLOBAL MIDDLE
│  Contacts                            │
│  Sequences                           │
│  Submissions (TL only)               │
│  Analytics                           │
│  Integrations                        │
│                                      │
├─ Footer ────────────────────────────-┤
│  Settings                            │
│  [R] avatar ▲ (opens upward)         │ ← 5 items, all wired
╰──────────────────────────────────────╯
```

The box around the Project Card is the visual metaphor for the scoping boundary. Anything inside = scoped; outside = global.

## Workflow visualisation — Search hero flow

```
  ┌─────────────────────────────────────────────┐
  │  Hey Raju, who are you looking for?         │
  │                                             │
  │  [Find Similar] [JD] [Boolean] [Manual]     │  ← chips toggle placeholder only
  │  ┌────────────────────────────────────────┐ │
  │  │ Paste a job description...         [▶] │ │  ← purple glow + circular send
  │  └────────────────────────────────────────┘ │
  │                                             │
  │  Example queries (click to populate):       │
  │   • Senior SWE · Bangalore · 8y+            │
  │   • DevOps leads in Singapore               │
  │   • ...                                     │
  └─────────────────────────────────────────────┘
              │  user submits
              ▼
  ┌─────────────────────────────────────────────┐
  │  [compact header: query + active project]   │
  │  ─────────────────────────────────────────  │
  │  Results                                    │
  │  • candidate card                           │
  │  • candidate card                           │
  │  • ...                                      │
  └─────────────────────────────────────────────┘
```

## Relevance to Niksho

This is a live production milestone for [[Efforts/ExcelTech-Automation/Overview]] — the workspace that recruiters use every day. Three compounding wins:

1. **A scoping primitive now exists.** Future features that need "this is for project X" (exported CSVs, sequences with a project prefix, analytics rollups by project) can hang off `projects.id` without re-litigating where projects live. Same pattern is directly transferable to [[Efforts/Niksho-SaaS-Product/Overview]] — SaaS tenants need project scoping too, and the `access_level` + collaborator model generalises cleanly.
2. **Requirements-as-global is now a committed decision, not a question.** TL owns the pool. Project scoping is opt-in via the nullable `project_id` column. This keeps the TL's Submission Queue workflow (the current bottleneck flagged in the Overview's open risks) untouched while still giving recruiters a project UX.
3. **The Search hero is the first real application of [[Wiki/concepts/Search-First-SaaS-UI]] to Beroz.** The Juicebox teardown captured the pattern; this session put it in front of real users. The "compact after submit" behaviour is worth studying before the full Searches post-query layout ships (follow-up #1).

**Guardrail for next AI session:** don't wire `/api/search` to `activeProject` without checking with Nikhil first — the cosmetic "In: \<project\>" strip is intentional while the scoping semantics get finalised. Same logic applies to the Contacts / Sequences / Submissions surfaces — they are deliberately global right now.

## Known follow-ups (carried forward)

1. Full Searches page redesign (post-query layout) — second competitor screenshot pending from Nikhil.
2. `/api/search` project scoping — endpoint ignores `state.activeProject` today.
3. Legacy `/dashboard` route — decide: redirect to `/app`, delete, or leave.
4. Invite members — placeholder modal; no `POST /api/team/invite` yet.
5. Requirement ↔ Project backfill — old requirements have `project_id = NULL`.
6. Row `⋯` on non-owned projects — hidden; could become read-only.
7. `supabase-py` has no DDL — schema changes still need Supabase Console (Alembic not in the stack).

## See also

- [[Raw/docs/Beroz-Session-2026-04-17]] — full source log with SQL, route table, deployment steps, smoke-test checklist
- [[Wiki/concepts/Projects-as-Scoping-Primitive]] — the scoping model extracted as a reusable pattern
- [[Wiki/concepts/Search-First-Hero-Mode-Chips]] — the intent-capture hero pattern
- [[Wiki/techniques/Auto-Git-Pull-Hook]] — UserPromptSubmit hook for keeping local in sync
- [[Wiki/digests/Session-Beroz-Fix-Analysis-2026-04-16]] — the 2026-04-16 Create Requirement fix that cleared the runway for this session
- [[Wiki/digests/Session-Juicebox-Teardown-2026-04-15]] — Juicebox teardown (source of the search-hero inspiration)
- [[Wiki/concepts/Search-First-SaaS-UI]] — the broader pattern this session operationalised
- [[Efforts/ExcelTech-Automation/Overview]]
- [[Efforts/Niksho-SaaS-Product/Overview]]
