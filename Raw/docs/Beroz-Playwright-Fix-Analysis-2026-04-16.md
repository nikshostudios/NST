---
type: raw-doc
source: internal
date: 2026-04-16
updated: 2026-04-16
status: resolved
project: Beroz
companion-to: "[[Raw/docs/Beroz-Playwright-Test-Report-2026-04-15]]"
related:
  - "[[Efforts/ExcelTech-Automation/Overview]]"
---

# Create-Requirement Bug — Root Cause & Fix

**Companion to:** `PLAYWRIGHT_TEST_REPORT.md`
**Bug:** `phase3-requirements › create requirement saves to DB` (failing)
**Secondary:** "Source Now" silent failure (same root cause)
**Date:** 2026-04-16

---

## TL;DR

There is no single bug. There are **three compounding issues**, and they hide each other:

1. **FastAPI is not running in production** (deployment/architecture)
2. **Frontend `api()` helper doesn't check `resp.ok`** — swallows every HTTP error silently
3. **`experience_min` type mismatch** — frontend sends `number`, backend expects `string`

#2 is why you couldn't *see* #1. #3 would bite the moment you fix #1.

---

## Issue #1 — FastAPI never deployed on Railway (PRIMARY)

### Evidence

`Procfile`:
```
web: gunicorn wsgi:app --bind 0.0.0.0:$PORT --workers 2 --timeout 120
```

`nixpacks.toml`:
```toml
[start]
cmd = "gunicorn wsgi:app --bind 0.0.0.0:$PORT --workers 2 --timeout 120"
```

Only Flask starts. There is no process manager, no second service, no uvicorn command.

`backend/app.py:91`:
```python
AI_AGENT_URL = os.environ.get("AI_AGENT_URL", "http://localhost:8001")
```

`backend/app.py:3156-3171` (the Create Requirement route):
```python
@app.route("/api/requirements/create", methods=["POST"])
def api_create_requirement():
    ...
    resp = http_requests.post(
        f"{AI_AGENT_URL}/requirements/create",
        json=request.get_json(),
        headers={"X-User-Role": role, "X-User-Email": email},
        timeout=30,
    )
```

On Railway, `http://localhost:8001` has nothing listening. The POST hangs until timeout, then the `except` returns `502 {"error": "Connection refused"}`.

### Why some things still work

Flask has **two kinds of routes**:
- **Read routes** (`GET /api/requirements`) → query Supabase directly → ✅ work
- **Write/agent routes** (`POST /api/requirements/create`, `POST /api/requirements/{id}/source`) → forward to FastAPI → ❌ fail

This matches the bug report exactly: viewing and filtering work, creating and sourcing don't.

### Why locally it "works"

`run.py --with-agents` spawns uvicorn on 8001 before Flask. In production nothing spawns it.

---

## Issue #2 — `api()` helper swallows HTTP errors (SECONDARY)

`frontend-exceltech/index.html:1110-1124`:
```javascript
async function api(url, opts = {}) {
  const defaults = { credentials: 'include', headers: { 'Content-Type': 'application/json' } };
  if (opts.body && typeof opts.body === 'object' && !(opts.body instanceof FormData)) {
    opts.body = JSON.stringify(opts.body);
  }
  if (opts.body instanceof FormData) {
    delete defaults.headers['Content-Type'];
  }
  const resp = await fetch(url, { ...defaults, ...opts });
  if (resp.status === 401) {
    window.location.href = '/';
    return null;
  }
  return resp.json();   // ← no resp.ok check!
}
```

No `if (!resp.ok) throw`. A 502 response returns its JSON body as if it were a success payload. The submit handler's `try` block completes normally, modal closes, `loadRequirements()` runs, user sees nothing.

**This is why the bug looked mysterious.** The error was surfacing in the network tab the whole time; the UI just never showed it.

---

## Issue #3 — `experience_min` type mismatch (TERTIARY)

Frontend (`index.html:1389`):
```javascript
experience_min: parseInt(document.getElementById('req-experience').value) || 0,
```
Sends a **number**.

Backend (`backend/ai-agents/main.py:164`):
```python
experience_min: str | None = None
```
Expects a **string**.

Pydantic v2 by default rejects int for str → 422 Unprocessable Entity. Currently masked by the connection-refused error but waiting in line.

---

## The Fix — In Order

### Step 1 — Fix `api()` so errors scream instead of whisper
```javascript
async function api(url, opts = {}) {
  const defaults = { credentials: 'include', headers: { 'Content-Type': 'application/json' } };
  if (opts.body && typeof opts.body === 'object' && !(opts.body instanceof FormData)) {
    opts.body = JSON.stringify(opts.body);
  }
  if (opts.body instanceof FormData) {
    delete defaults.headers['Content-Type'];
  }
  const resp = await fetch(url, { ...defaults, ...opts });
  if (resp.status === 401) { window.location.href = '/'; return null; }
  const data = await resp.json().catch(() => ({}));
  if (!resp.ok) throw new Error(data.error || `HTTP ${resp.status}`);
  return data;
}
```
Do this *first* — every future deploy bug will be easier to see.

### Step 2 — Fix the FastAPI deployment gap

Three viable paths (ranked):

**Path A — Merge FastAPI into Flask (recommended).**
Port `backend/ai-agents/main.py` routes into `backend/app.py` as Flask routes. The split exists for local-dev ergonomics, not for a real architectural reason. One process = no `AI_AGENT_URL`, no inter-service hop, no deployment complexity, works on any platform.

**Path B — Run both processes on Railway.**
Use a process manager. Change `Procfile` to:
```
web: honcho -f Procfile.dev start
```
…with `Procfile.dev`:
```
flask: gunicorn wsgi:app --bind 0.0.0.0:$PORT --workers 2 --timeout 120
agents: uvicorn ai-agents.main:app --host 127.0.0.1 --port 8001
```
Add `honcho` to `requirements.txt`. Note: FastAPI never gets a public port — only Flask talks to it via localhost.

**Path C — Deploy FastAPI as a second Railway service.**
Create a second Railway service pointing at `backend/ai-agents/`, set `AI_AGENT_URL` env var in the Flask service to the FastAPI service's internal URL. Two deploy pipelines, two sets of env vars. Most scalable, most operational overhead.

### Step 3 — Fix the `experience_min` type
Change `backend/ai-agents/main.py:164`:
```python
experience_min: int | None = None
```
Years of experience is numeric. Apply the same treatment to any other numeric-ish fields if they exhibit the same pattern.

### Step 4 — Add a production healthcheck
At Flask startup, ping `AI_AGENT_URL/health` and log loudly if unreachable. This single line would have caught the original bug on the first deploy:
```python
try:
    http_requests.get(f"{AI_AGENT_URL}/health", timeout=2).raise_for_status()
except Exception as e:
    log.error("AI_AGENT_URL %s unreachable: %s — writes will fail", AI_AGENT_URL, e)
```

---

## The Assumption That Caused This

> "If it works locally with `run.py --with-agents`, it will work in prod."

Nothing in the deployment verified parity. `run.py` is a dev-only entrypoint; `Procfile` is the prod entrypoint; the two drifted. The fix isn't just "add FastAPI to prod" — it's **making local-dev and prod entrypoints run the same set of processes** (ideally by collapsing them to one).

---

## Verification Plan

After applying the fixes:
1. `cd tests && npx playwright test phase3-requirements` — expect all tests green
2. Log in, create a requirement manually, confirm DB row in Supabase
3. Click "Source Now" on an existing req, confirm toast + Shortlist populates
4. Re-run the full Playwright suite — target 31/31

---

## ✅ Resolution — 2026-04-16

All four fix steps were implemented and deployed:

- **Commit:** `f2f0c0d` — "fix: merge FastAPI AI layer into Flask to unblock writes"
- **Repo:** `nikshostudios/beroz`, branch `main`
- **Deployed via:** Railway GitHub auto-deploy (corrected source from `recruitment-agents` → `beroz`)

**Playwright result after fix:**
```
npx playwright test phase3-requirements.spec.js --grep "Create requirement saves to DB"
1 passed (12.1s)
```

**Final score: 31 / 31 tests passing.**

### What changed in the codebase

| File | Change |
| --- | --- |
| `backend/ai_agents/core.py` | New — ports all FastAPI write/agent routes into Flask-callable functions |
| `backend/ai_agents/__init__.py` | New — Python package marker |
| `backend/ai_agents/config/__init__.py` | New — sub-package marker |
| `backend/app.py` | Replaced 14 proxy routes with direct `ai_core` calls; dropped `AI_AGENT_URL`; added startup Supabase healthcheck |
| `frontend-exceltech/index.html` | Fixed `api()` helper to throw on non-2xx |
| `run.py` | Removed uvicorn subprocess; single Flask process |
| `backend/ai-agents/` → `backend/ai_agents/` | Renamed for Python importability (dash → underscore) |
| `.gitignore` | Updated paths for renamed directory; added test output dirs |
