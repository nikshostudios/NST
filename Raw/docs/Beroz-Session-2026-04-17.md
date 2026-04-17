---
type: raw-session-log
source: internal
date: 2026-04-17
commits: ["423a01e", "56ba201"]
repo: nikshostudios/beroz
---

# Session Log — 2026-04-17

Projects layer + sidebar refinement + Search hero shipped to ExcelTech production.

---

## TL;DR

Two commits landed on `origin/main` (Railway auto-deploy):

- **`423a01e`** — `feat: Projects layer, sidebar refinement, and Search hero`
- **`56ba201`** — `feat: frontend-saas static mockup — apply Projects layer reference design`

Supabase schema for the new `projects` + `project_collaborators` tables was applied manually in the Dashboard SQL Editor before the push.

---

## What shipped

### Auto git-pull hook (local dev)

Added a `UserPromptSubmit` hook to [~/.claude/settings.json](~/.claude/settings.json) that runs
`git -C "…/beroz" pull --ff-only origin main` before every prompt — keeps the local working tree in sync with GitHub without thinking about it.

### ExcelTech Projects layer (production)

**Data model** — [backend/ai_agents/data/schema.sql](backend/ai_agents/data/schema.sql):

```sql
create table projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  access_level text check (access_level in ('shared','private')) default 'shared',
  status text check (status in ('active','draft','archived')) default 'active',
  created_by text not null,           -- recruiter_email from RECRUITER_LOGINS
  created_at timestamptz default now()
);
create table project_collaborators (
  project_id uuid references projects(id) on delete cascade,
  user_email text not null,
  primary key (project_id, user_email)
);
alter table requirements add column project_id uuid references projects(id);
```

**API surface** — [backend/app.py](backend/app.py):

| Method | Route | Handler | Authz |
|---|---|---|---|
| GET  | `/api/projects` | `list_projects(user_email)` | auth'd |
| POST | `/api/projects/create` | `create_project(...)` | any logged-in user |
| PATCH | `/api/projects/<id>` | `update_project(...)` | owner-only |
| POST | `/api/projects/<id>/archive` | `archive_project(...)` | owner-only |
| DELETE | `/api/projects/<id>` | `delete_project(...)` | owner-only |
| GET | `/api/team` | `list_team()` | auth'd |

Access visibility for `list_projects`: owner **OR** `access_level='shared'` **OR** listed in `project_collaborators`.

**Frontend** — [frontend-exceltech/index.html](frontend-exceltech/index.html) (2255 → 3194 lines):

- Agent Home page deleted (greeting, chat input, quick-action chips — all gone).
- Default landing: **All Projects**.
- Sidebar restructured into 3 zones:

  ```
  ─ Logo / Org / Collapse ─
    All Projects              ← persistent global top
  ┌─ Project Card ──────────┐
  │  Projects (dropdown)    │
  │  Searches               │
  │  Shortlist              │
  └─────────────────────────┘
    Requirements             ← global middle
    Contacts
    Sequences
    Submissions (TL only)
    Analytics
    Integrations
  ─ Footer ─
    Settings
    [R] avatar + dropdown    ← 5 items, all wired
  ```

- Avatar dropdown items:
  - Invite members → modal listing the team (uses `/api/team`), disabled send button.
  - Help center → modal with 3 placeholder cards.
  - Knowledge base → modal with searchable article list.
  - Contact support → modal with mailto button + clipboard copy.
  - Sign out → `/logout`.
- All Projects page: 4 stat cards + table with Title / Status / Progress / Created On / Collaborators / ⋯.
- Create Project modal (Title / Shared-Private / Collaborators multi-select).
- Row ⋯ menu — **only shown on projects you own** — with Edit / Archive / Delete.
- Edit Project modal (pre-fills title, access, collaborators).
- Archive → grey "Archived" tag; Delete → confirm + DELETE + orphans `requirements.project_id`.
- **Search page rebuilt** with competitor-inspired hero:
  - `"Hey <firstName>, who are you looking for?"`
  - 4 mode chips: Find Similar / Job Description / Boolean / Select Manually (chips toggle the placeholder text; backend call is the same for all modes).
  - Large textarea with purple focus glow + circular send button.
  - 5 clickable example queries that populate the input.
  - Compact hero mode once a query runs (results appear below).
- **Removed**: Quick Find, duplicate bottom Logout, chat textarea JS, dynamic "Hi Raju" greeting on the dead Agent Home.

### Sibling mockup (`frontend-saas/index.html`)

Same visual Projects feature applied to the static mockup served at `/frontend-saas/`. Pure in-memory state, no backend wiring. Kept in sync with the production UI as a reference.

---

## Key decisions

| Question | Answer |
|---|---|
| **Where do Projects live?** | Real Supabase tables, not in-memory. |
| **Project ↔ Requirement?** | Originally 1-to-many, but after mid-session clarification: **Requirements is global** (TL-owned pool). The `project_id` column stays on `requirements` (nullable, unused for now) so we can opt back in later. |
| **Who can create a Project?** | Any logged-in user. |
| **Who can edit/archive/delete?** | Only the creator (`created_by == session email`). |
| **Collaborators source?** | New `GET /api/team` exposes the 9 hardcoded `RECRUITER_LOGINS` entries (name/email/role, no passwords). |
| **Avatar dropdown stubs?** | No console.logs — every item opens a real modal or a real link. |
| **Avatar location?** | Moved from top-right header to **bottom-left sidebar**, opens upward. Header now has only notifications + page title. |
| **Project-scoped pages?** | Shortlist + Search show an "In: \<project\>" context strip and scope `/api/pipeline` calls. Contacts / Sequences / Submissions / Analytics / Integrations stay global. |
| **Default landing?** | `/app` → Projects view (was Agent Home). |

---

## Deployment steps

1. Applied schema manually in Supabase Dashboard → SQL Editor (new `projects` + `project_collaborators` tables + `project_id` column + indexes + RLS enables). Confirmed `Success. No rows returned.`
2. Fixed git auth — local keychain was cached to `thenikhil05`; `gh auth setup-git` switched git to use the active `nikshostudios` GitHub account.
3. Pushed both commits to `origin/main`.
4. Railway auto-deploys from `main` within 1–2 min.

---

## Files touched

| File | Δ | Purpose |
|---|---|---|
| `backend/ai_agents/data/schema.sql` | +31 | `projects`, `project_collaborators`, `project_id` FK, indexes, RLS enables |
| `backend/ai_agents/config/db.py` | +79 / helpers for `list_projects_for_user`, `insert_project`, `update_project`, `delete_project`, collaborator helpers |
| `backend/ai_agents/core.py` | +134 / handlers: `list_team`, `list_projects`, `create_project`, `update_project`, `archive_project`, `delete_project` |
| `backend/app.py` | +62 / 6 new routes + `project_id` query-param on `/api/requirements` and `/api/pipeline` |
| `frontend-exceltech/index.html` | 2255 → 3194 (+939) — sidebar, avatar, All Projects page, modals, Search hero |
| `frontend-saas/index.html` | +460 / −169 — reference mockup |
| `~/.claude/settings.json` | +13 — `UserPromptSubmit` hook |

---

## Known follow-ups

1. **Full Searches page redesign** — user said they'd share a second competitor screenshot; current Searches page only has the landing hero, not the post-query layout.
2. **`/api/search` project scoping** — currently the search endpoint ignores `state.activeProject`; the hero only *displays* "In: \<project\>" in the context strip.
3. **Legacy `/dashboard` route** — Flask still serves a totally different UI at `/dashboard` (the original Recruiter Hub / Outreach / Requirements / Submissions tabbed view). Decision pending: redirect to `/app`, delete it, or leave it for now.
4. **Invite members** — modal is a placeholder; no `POST /api/team/invite` endpoint yet. Users stay managed via the hardcoded `RECRUITER_LOGINS` dict.
5. **Requirement ↔ Project backfill** — requirements created before this feature have `project_id = NULL`. A future "Assign to project" action on requirement cards would close that gap.
6. **Row `⋯` on non-owned projects** — currently hidden entirely. Could become a read-only view menu later.
7. **`supabase-py` has no DDL support** — future schema changes still require manual Supabase Console runs unless we adopt `psql`-based migrations (Alembic isn't in the stack).

---

## Production smoke-test checklist

After Railway finishes deploying:

- [ ] Hard-refresh `/app` (⌘⇧R) to bust the browser cache.
- [ ] Log in as Raju → land on **All Projects**, header title "All Projects".
- [ ] Sidebar shows 3 zones exactly as above; no Quick Find, no duplicate Logout.
- [ ] Create a project (e.g. "HCL — Senior Engineers", Private, pick a collaborator) → row appears in table, app jumps to **Searches**, context strip shows "In: HCL — Senior Engineers".
- [ ] Click any row in All Projects → enters that project's Searches view.
- [ ] On a row you own, `⋯` → Edit / Archive / Delete all work. On a row you don't own, `⋯` is hidden.
- [ ] Avatar (bottom-left R) → all 5 items open something real. Sign out → `/logout`.
- [ ] Searches page: greeting, 4 mode chips, 5 example queries, purple-glow textarea, circular send button.
- [ ] Log in as Manoj (recruiter) → sees any projects Raju created with `access_level='shared'` or that list Manoj as a collaborator.
- [ ] Browser console: 0 errors on every page.

---

## Commands that mattered

```bash
# Run locally (needs Supabase creds in env):
cd "/Users/nikhilkumar/Claude Workspace/exceltech-ai/Brand New Website/beroz"
export FLASK_PORT=5352
export SUPABASE_URL="..."
export SUPABASE_SERVICE_ROLE_KEY="..."
python3 run.py
# → open http://localhost:5352/app

# Fixed git push auth:
gh auth setup-git                  # uses the active `nikshostudios` gh account

# Pushed:
git push origin main
# b69b7ba..56ba201  main -> main
```
