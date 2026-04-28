---
title: Claude Code Brief — Wire up the React Dashboard to Real Data
date: 2026-04-13
effort: ExcelTech-Automation
tags: [exceltech, react, dashboard, fastapi, supabase]
generated-by: claude-sonnet-4-6
---

# Claude Code Brief: Wire the React Dashboard to Real Data

## Who you are working with

Shoham Shree, co-founder of Niksho. Building an AI-powered recruitment automation platform for ExcelTech Computers (Singapore/India). The product is live on Railway and being used daily by a team of recruiters.

## The single goal of this session

The React dashboard at `exceltechcomputers.up.railway.app/new` is a **static poster** — it renders beautifully but every number and every row comes from `dashboard/src/data/mockData.ts`. Zero live data. Your job is to wire it to the real backend so it becomes a functional product.

Do NOT rewrite or refactor the architecture. Do NOT touch the old Flask dashboard at `/dashboard` — recruiters use it daily. Surgical changes only.

---

## Folder structure

You have two connected folders:

**`el-paso/`** — the full codebase
```
el-paso/
├── app.py                  ← Flask web app (old dashboard, DO NOT BREAK)
├── ai-agents/
│   └── main.py             ← FastAPI backend (the real API)
├── dashboard/
│   ├── src/
│   │   ├── data/mockData.ts    ← DELETE THIS (replace with real API calls)
│   │   ├── pages/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Requirements.tsx
│   │   │   ├── Candidates.tsx
│   │   │   ├── Pipeline.tsx
│   │   │   ├── Submissions.tsx
│   │   │   ├── Sequences.tsx
│   │   │   ├── Search.tsx
│   │   │   └── Agents.tsx
│   │   ├── components/
│   │   │   ├── MetricCard.tsx
│   │   │   ├── FunnelBar.tsx
│   │   │   └── ...
│   │   ├── App.tsx
│   │   └── theme.ts
│   ├── dist/               ← pre-built, committed to git (Railway serves this)
│   └── package.json
├── scripts/
│   └── local_foundit_agent.py  ← DO NOT TOUCH
└── .env                    ← has RAILWAY_AGENT_URL etc.
```

**`NST/`** — Obsidian knowledge vault (read-only context, do not write here)
```
NST/
├── Atlas/Product/Architecture.md   ← system architecture
├── Atlas/Product/Database-Schema.md ← Supabase schema
├── Atlas/Product/Agents.md
├── Raw/docs/sourcing-troubleshooting-2026-04-12.md  ← full session history
└── Efforts/ExcelTech-Automation/Overview.md
```

---

## The backend API

**Base URL (production):** `https://ai-agents-production-50e8.up.railway.app`

All endpoints require two headers:
```
x-user-role: recruiter
x-user-email: nikshostudios@gmail.com
```

### Endpoints you will use

| Method | Path | What it returns |
|--------|------|-----------------|
| `GET` | `/requirements` | List of open requirements (supports `?market=IN\|SG\|all`) |
| `GET` | `/pipeline` | Per-requirement funnel counts (sourced, matched, screened, shortlisted, outreached, replied, submitted_to_tl, sent_to_client) |
| `GET` | `/tl/queue` | Submissions pending TL review |
| `GET` | `/health` | Health check |
| `POST` | `/requirements/{req_id}/source` | Trigger sourcing (async) |
| `POST` | `/requirements/{req_id}/match` | Trigger LLM matching |
| `POST` | `/candidates/screen` | Trigger screening |

### `/pipeline` response shape
```json
{
  "pipeline": [
    {
      "requirement_id": "uuid",
      "role_title": "Senior ServiceNow Developer",
      "client_name": "HCL Technologies",
      "market": "IN",
      "sourced": 80,
      "matched": 73,
      "screened": 18,
      "shortlisted": 8,
      "outreached": 8,
      "replied": 5,
      "details_complete": 3,
      "submitted_to_tl": 2,
      "sent_to_client": 1
    }
  ]
}
```

### `/requirements` response shape
```json
{
  "requirements": [
    {
      "id": "uuid",
      "market": "IN",
      "client_name": "HCL Technologies",
      "role_title": "Senior ServiceNow Developer",
      "skills_required": ["ServiceNow", "JavaScript", "ITSM"],
      "status": "open",
      "assigned_recruiters": ["priya.s@exceltechcomputers.com"],
      "created_at": "2026-04-01T..."
    }
  ],
  "count": 12
}
```

---

## What to build — in priority order

### 1. API client layer (do this first)

Create `dashboard/src/lib/api.ts`:
- Base URL: read from `import.meta.env.VITE_API_URL` with fallback to `https://ai-agents-production-50e8.up.railway.app`
- Always attach `x-user-role: recruiter` and `x-user-email: nikshostudios@gmail.com` headers
- Export typed fetch functions: `getPipeline()`, `getRequirements(market?)`, `getTLQueue()`
- Handle loading and error states

### 2. Dashboard.tsx — metric cards + pipeline table

The metric cards at the top (Sourced, AI Screened, Shortlisted, Outreached, Open Roles, Pending TL) should aggregate totals across all requirements from `/pipeline`.

The pipeline table below them should be the real rows from `/pipeline`, not the hardcoded 5 fake rows.

The activity feed can stay mocked for now — there's no activity log endpoint yet.

### 3. Requirements.tsx

Replace mock `REQUIREMENTS` with real data from `GET /requirements`.

### 4. Pipeline.tsx

Wire to `/pipeline`. This is the most important page — it's the recruiter's daily view.

### 5. Submissions.tsx

Wire to `GET /tl/queue` for pending submissions.

### 6. Loading + error states

Every page that hits the API needs:
- Skeleton/spinner while loading
- Error message if the API is unreachable (Railway cold-starts take ~3s)
- Empty state if no data

---

## What NOT to do

- **Do not add auth to the React app** — the `/new` route is intentionally open for now. Auth comes later.
- **Do not touch `app.py` or anything in `ai-agents/`** — backend is stable and in production.
- **Do not use the old Flask `/api/*` routes** — those are for the old dashboard only. Use the FastAPI base URL above.
- **Do not auto-trigger sourcing or matching** — read-only for now. Display data only. Action buttons (Source, Match, Screen) can exist but should confirm before firing.
- **Do not move or rename dashboard pages** — the routes are set up in App.tsx and the sidebar already links to them.
- **Do not rewrite the design** — the dark theme, sidebar layout, and component structure are correct. Data wiring only.

---

## After you make changes

The `dashboard/dist/` is pre-built and committed to git (Railway serves the static files directly — it does NOT run `npm build`). So after any code change you must:

```bash
cd dashboard
npm run build
cd ..
git add dashboard/dist -f
git commit -m "feat: ..."
git push

# Then merge to main so Railway deploys
cd /Users/shohamshree/conductor/repos/recruitment-agents
git merge nikshostudios/ai-agent-layer
git push origin main
```

The `el-paso` folder is a git worktree — `main` is locked to `/Users/shohamshree/conductor/repos/recruitment-agents`, not to `el-paso/`. Always push feature work from `el-paso/`, then merge to main from the other folder.

---

## Environment

```
VITE_API_URL=https://ai-agents-production-50e8.up.railway.app
```

Add this to `dashboard/.env` (create if missing) and `dashboard/.env.production`.

---

## Known issues to be aware of (don't fix in this session)

- **Skill normalization**: composite skills like `"ServiceNow JavaScript ITSM"` stored as one string don't match individual skill filters. The `/pipeline` `sourced` count may be 0 for some requirements because of this. Don't try to fix in the frontend.
- **Railway URL drift**: the `ai-agents` URL has changed once before (`b4ef` → `50e8`). If you hit 404s on the API, check `.env` for the current URL.
- **Railway cold start**: first request after inactivity can take 3-5s. The loading state you add will handle this.
- **Candidates page**: the `candidates` table in Supabase doesn't have a simple list API endpoint yet. Candidates tab can stay in "coming soon" state for now — don't invent an endpoint.

---

## Definition of done

- [ ] `/new` dashboard loads real pipeline data from the API
- [ ] Metric cards show real aggregated totals
- [ ] Pipeline table shows real requirements with real funnel counts
- [ ] Requirements page lists real open requirements
- [ ] Loading and error states on every page that fetches
- [ ] `dist/` rebuilt and pushed, Railway shows new deployment
- [ ] Visit `exceltechcomputers.up.railway.app/new` and confirm live data
