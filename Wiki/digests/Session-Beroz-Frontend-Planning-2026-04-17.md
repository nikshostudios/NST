---
type: wiki-digest
generated-by: claude
sources: ["[[Raw/docs/Beroz-Frontend-Planning-2026-04-17]]"]
date: 2026-04-17
updated: 2026-04-17
status: planning-shipped
tags: [beroz, frontend, ui, saas, juicebox, projects, navigation, planning]
---

# Beroz Frontend Polish — SaaS Shell Navigation & Profile Menu (Planning, 2026-04-17)

> **Status update — superseded by ship.** The four implementation TODOs in this planning session were executed and shipped to production the same day in commits `423a01e` + `56ba201`. See [[Wiki/digests/Session-Beroz-Projects-Layer-2026-04-17]] for the shipped state, the architectural decisions that were settled during implementation (Requirements-as-global, avatar moved to bottom-left, Project Card boundary), and follow-ups carried forward. This digest is preserved as the **planning artifact** that captures the decision moment — useful for understanding *why* the ship looks the way it does and what was on the table beforehand.

## Core argument

The Beroz SaaS shell (`frontend-saas/index.html`) inherits Juicebox's chrome but still has three dead-ends from the clone phase: a non-functional sidebar dropdown labelled "recruitment agent", a non-clickable profile avatar, and a vestigial "Agent Home" landing page that serves no purpose now that the product is project-scoped. This session locks in the next pass of frontend changes — a top-of-sidebar **Projects** model (with a persistent "All Projects" entry, a searchable dropdown, and a real list/create flow), a clickable profile avatar with a settings dropdown, and removal of Agent Home in favour of `page-all-projects` as the default landing. A separate, deferred decision is whether to ship a Gmail/Outlook Chrome extension that mirrors Juicebox's "send from your own inbox, log to platform" pattern.

## Key decisions captured

**1. Default landing changes from Agent Home → All Projects.** The greeting + chat input + quick-action chips on the Agent Home page were copied wholesale from Juicebox's first-touch experience and never earned their place in our product. Recruiters arriving at Beroz should land on a list of work, not a chatbot prompt. `#page-agent-home` will be removed entirely; `page-all-projects` becomes the default route.

**2. Projects as the primary organising unit in the sidebar.** Two related navigation entries:
- A persistent **All Projects** nav item at the very top of the sidebar (above the dropdown).
- A **Projects** dropdown (renamed from "recruitment agent") with a "Find projects" search field, the list of client/project names, and a "View all projects →" footer link.

This pulls the sidebar's information architecture in line with how the work is actually scoped: a recruiter is always operating in the context of *a project* (read: a client engagement) or moving between projects.

**3. The All Projects page gets a real list + create flow.** Columns: Title, Progress, Created on, Collaborators, Status. A top-right **Create new project +** button opens a modal: Project Title (required) · Access Level (Shared vs Private) · Collaborators (optional). This is the first concrete acknowledgement that Beroz is multi-recruiter from day one — collaborators and access levels are first-class.

**4. Profile avatar becomes the settings entry point.** The "S" avatar in the top-right header opens a dropdown with: Invite members · Help center · Knowledge base · Contact support · Sign out. Visual reference is Juicebox's settings menu — clean, minimal, icons next to each item.

**5. Chrome extension for outreach tracking — DEFERRED, decision still open.** The proposed pattern is the [[Wiki/concepts/Personal-Inbox-Outreach-Tracking|personal-inbox tracking]] approach used by Juicebox: extension sits on Gmail/Outlook in the browser, detects sends/replies/opens, logs them back to Beroz against the candidate. Trade-off: better deliverability and replies in a familiar inbox vs build cost (ongoing maintenance of two browser extensions, store reviews, MS/Google policy risk). Not part of this code pass.

## Workflow visualisation — the sidebar navigation model

```
┌─ SIDEBAR ───────────────────────┐
│                                 │
│  📂 All Projects ──────────────►│ persistent — page-all-projects
│  ─────────────────              │
│  ▼ Projects                     │ dropdown — renamed from "recruitment agent"
│    ┌───────────────────────┐    │
│    │ 🔍 Find projects      │    │
│    ├───────────────────────┤    │
│    │ • Acme Corp           │    │ click → loads that project's
│    │ • Beta Industries     │    │   role-specific requirements
│    │ • Gamma Holdings      │    │
│    │ • …                   │    │
│    ├───────────────────────┤    │
│    │ View all projects →   │────►│ → page-all-projects
│    └───────────────────────┘    │
│                                 │
│  (rest of sidebar nav)          │
│                                 │
└─────────────────────────────────┘
```

```
┌─ HEADER (top-right) ────────────┐
│                       [ S ]◄────┤ click avatar opens:
│                       │         │
│           ┌───────────▼──────┐  │
│           │ ✉  Invite members │  │
│           │ ?  Help center    │  │
│           │ 📖 Knowledge base │  │
│           │ 💬 Contact support│  │
│           │ ──────────────    │  │
│           │ ↪  Sign out       │  │
│           └───────────────────┘  │
└─────────────────────────────────┘
```

## Open question that gates everything else (settled at ship time)

The planning session left this question on the table:

**What is the relationship between a Project and an Agent?** Two readings:
- **Reading A — Project = client engagement, contains many agents/requirements** (3-level hierarchy: Project → Requirements → Candidates).
- **Reading B — Project = renamed agent** (presentational rename only).

**What actually shipped (see [[Wiki/digests/Session-Beroz-Projects-Layer-2026-04-17]]):** A pragmatic blend, leaning A but not committing fully. `requirements.project_id` was added as a **nullable FK** — the Projects layer exists as a real Postgres primitive, but Requirements stays a global TL-owned pool. Surfaces opt into project scoping (Searches, Shortlist) while the TL Submission Queue stays untouched. This sidesteps the gating question by making it deferrable per-surface instead of all-at-once. See [[Wiki/concepts/Projects-as-Scoping-Primitive]] for the full pattern.

## Relevance to Niksho

This is the next concrete pass on the [[Efforts/Niksho-SaaS-Product/Overview|Niksho SaaS Product]] — specifically the SaaS shell at `frontend-saas/`, distinct from the [[Efforts/ExcelTech-Automation/Overview|ExcelTech instance]] at `frontend-exceltech/`. With the Create Requirement bug now resolved (commit `f2f0c0d`, see [[Wiki/digests/Session-Beroz-Fix-Analysis-2026-04-16]]) and the full Playwright suite green at 31/31, attention shifts from "does the chain work end-to-end" to "does the chrome around the chain make sense for a multi-tenant SaaS user who has never seen ExcelTech."

The Project-as-organising-unit decision is also load-bearing for the Phase B work in the [[Efforts/Niksho-SaaS-Product/Overview|main effort]] — tenant isolation, per-tenant secrets, and per-tenant Firecrawl caps all assume a clean container that "Project" can map to or sit inside. Settling Reading A vs Reading B early avoids re-doing the schema during multi-tenant wiring.

The Chrome-extension question, even though deferred, ties directly to one of the open product strategy questions in the SaaS overview: do we *force* outreach through the platform (cleaner data, worse deliverability, awkward replies) or *meet recruiters in their inbox* (Juicebox's bet). See [[Wiki/concepts/Personal-Inbox-Outreach-Tracking]] for the pattern and the trade-offs.

## See also
- [[Raw/docs/Beroz-Frontend-Planning-2026-04-17]] — full source planning doc with TODO list and Claude Code prompt
- [[Wiki/digests/Session-Beroz-Projects-Layer-2026-04-17]] — what actually shipped (commits 423a01e + 56ba201)
- [[Wiki/concepts/Projects-as-Scoping-Primitive]] — the architectural pattern that resolved the planning's gating question
- [[Wiki/concepts/Search-First-Hero-Mode-Chips]] — the Search hero pattern that landed alongside (not in this planning doc)
- [[Wiki/concepts/Personal-Inbox-Outreach-Tracking]] — the browser-extension outreach pattern (Juicebox) — still deferred
- [[Wiki/digests/Session-Beroz-Fix-Analysis-2026-04-16]] — the Create Requirement fix that unblocked this work
- [[Wiki/digests/Session-Juicebox-Teardown-2026-04-15]] — the source UI patterns being adapted
- [[Wiki/concepts/Search-First-SaaS-UI]] — the Juicebox-derived design pattern Beroz already inherits
- [[Efforts/Niksho-SaaS-Product/Overview]] — the parent effort
- [[Efforts/Niksho-SaaS-Product/v2-Planning-Log]] — running build log
