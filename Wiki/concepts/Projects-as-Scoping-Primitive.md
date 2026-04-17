---
type: wiki-concept
generated-by: claude
sources: ["[[Raw/docs/Beroz-Session-2026-04-17]]"]
updated: 2026-04-17
tags: [product, architecture, scoping, multi-tenant, access-control, ui]
---

# Projects as Scoping Primitive

## What it is

A **Project** is the top-level organizational unit in a recruitment workspace — a named, persistent container that scopes a subset of the product's surfaces while leaving other surfaces deliberately global. In Beroz, Projects are real rows in Postgres (not in-memory state), with their own access-control model (owner, shared, or collaborator-list), and the sidebar visually encodes which features are "inside" a project and which live at the team level.

The minimal data model:

```
projects(id, title, access_level in ['shared','private'], status, created_by, created_at)
project_collaborators(project_id, user_email)      -- many-to-many
requirements.project_id                            -- nullable FK; opt-in scoping
```

Visibility rule for listing: `owner OR access_level='shared' OR user_email ∈ collaborators`.
Mutation rule: `created_by == session_email` (owner-only edit/archive/delete).

## The scoping-boundary decision

The real architectural work isn't the `projects` table — it's deciding **which surfaces are project-scoped and which are global**. In Beroz the answer came out as:

- **Scoped by `state.activeProject`:** Searches, Shortlist, Projects dropdown.
- **Global (team-wide):** Requirements, Contacts, Sequences, Submissions, Analytics, Integrations.

The sidebar's 3-zone layout (global-top · Project Card · global-middle) is the UI encoding of that decision. The Project Card has a visible border so the user reads the containment the same way the code does. Anything inside the box = scoped; outside = shared across the team.

## Why it matters

**It converts a future-proofing tax into a concrete API.** Without a Projects layer, every "this is for HCL" feature accumulates ad-hoc filters — a tag on a candidate, a naming convention on a sequence, an `if requirement.id in [...]` somewhere. Each one is cheap individually and murder in aggregate. A real scoping primitive lets you just pass a `project_id` parameter.

**It decouples "a primitive exists" from "every surface uses it."** The `requirements.project_id` column is nullable and currently unused — Requirements is global by product decision, not by technical constraint. That's a feature, not a compromise. Surfaces opt into scoping when the workflow actually demands it, instead of being forced into it prematurely.

**Access control gets a single place to live.** Instead of N per-feature visibility rules, there is one (visibility = owner OR shared OR collaborator). New features inherit it automatically.

**The sidebar becomes self-documenting.** A new recruiter opening the app sees the containment visually and doesn't have to learn which lists are "mine" vs "ours." The UI carries the data model.

## When the pattern fits

- The product has a natural **campaign / client / engagement** unit that groups work but doesn't replace team-level operations.
- You want to ship multi-tenancy flavour *within* a single tenant (Projects ≠ Tenants, but use the same shape).
- There's tension between "give users their own space" and "the team needs a shared pool" — the pattern lets both exist.

## When it doesn't fit

- If every feature should be project-scoped, you don't need a scoping primitive — you need tenancy. Projects is the pattern for when **some** things scope and others don't.
- If the access model is purely flat (everyone sees everything), the `access_level` + collaborators machinery is overkill.

## Relevance to Niksho

This is now the de-facto organizational primitive in Beroz (ExcelTech's production workspace). The same shape applies to [[Efforts/Niksho-SaaS-Product/Overview|the Niksho SaaS product]] — SaaS tenants get projects for the same reason ExcelTech does: recruiters need a named container for "this HCL search" or "this Accenture batch." The `access_level` + collaborators model generalises cleanly from 9 hardcoded `RECRUITER_LOGINS` to arbitrary tenant user tables.

Direct consequences for Niksho's roadmap:

- **Exports, analytics rollups, and sequence prefixes** can all key off `project_id` without re-arguing where projects live.
- **"Requirements is global" is a committed decision**, not a placeholder — the TL workflow (see [[Atlas/ExcelTech/Team]]) stays untouched while recruiters get a project UX.
- **The scoping UI pattern (boxed Project Card in the sidebar)** is the template for any future scope-aware feature. Don't invent a new visual metaphor each time.

**Guardrail:** until the post-query Searches layout ships and `/api/search` actually respects `activeProject`, the "In: \<project\>" strip is cosmetic. Don't wire the search endpoint to `activeProject` without Nikhil's sign-off.

## Related

- [[Wiki/digests/Session-Beroz-Projects-Layer-2026-04-17]] — the ship that introduced the primitive
- [[Wiki/concepts/Search-First-Hero-Mode-Chips]] — the Search surface that sits inside the Project Card
- [[Wiki/concepts/Search-First-SaaS-UI]] — the broader UI pattern this operationalises
- [[Efforts/ExcelTech-Automation/Overview]]
- [[Efforts/Niksho-SaaS-Product/Overview]]
- [[Atlas/Product/Architecture]]
- [[Atlas/ExcelTech/Team]]
