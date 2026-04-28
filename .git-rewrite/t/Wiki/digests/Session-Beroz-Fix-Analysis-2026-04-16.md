---
type: wiki-digest
generated-by: claude
sources: ["[[Raw/docs/Beroz-Playwright-Fix-Analysis-2026-04-16]]", "[[Raw/docs/Beroz-Playwright-Test-Report-2026-04-15]]"]
date: 2026-04-16
updated: 2026-04-16
status: resolved
tags: [beroz, debugging, exceltech, flask, fastapi, railway, deployment]
---

# Beroz Create-Requirement Bug — Root Cause & Fix (✅ Resolved 2026-04-16)

## Core finding

What looked like one silent bug was three compounding issues hiding each other. FastAPI was never running in production (Issue #1), but you couldn't see that because the frontend `api()` helper swallowed every HTTP error without showing it to the user (Issue #2). A type mismatch on `experience_min` (Issue #3) was queued up behind both of them. Path A was chosen — merge FastAPI into Flask, collapse to one process — and the fix was shipped and verified on 2026-04-16. **All 31/31 Playwright tests now pass.**

## The three issues

**Issue #1 (primary) — FastAPI never deployed.** The `Procfile` and `nixpacks.toml` only start Flask via gunicorn. Nothing starts uvicorn on port 8001. `backend/app.py` defaults `AI_AGENT_URL` to `http://localhost:8001` — which has nothing listening on Railway. Every write route (Create Requirement, Source Now) hangs for 30 seconds then returns a 502. Read routes work because they query Supabase directly from Flask — they never touch FastAPI. This is why viewing 667 requirement cards passed but creating one failed.

Locally, `run.py --with-agents` spawns uvicorn before Flask. Production never did. The two entrypoints drifted and nobody noticed because there was no healthcheck.

**Issue #2 (secondary) — `api()` swallows errors.** The frontend fetch helper (`frontend-exceltech/index.html:1110`) has no `if (!resp.ok) throw`. A 502 response gets parsed as JSON and returned as if it were a success payload. The submit handler's `try` block completes normally, the modal closes, and the user sees nothing. This is why the bug looked mysterious — the error was in the Network tab the whole time, just never surfaced to the UI.

**Issue #3 (tertiary) — type mismatch.** Frontend sends `experience_min` as a JS number (`parseInt(...)`). Backend Pydantic model declares it as `str | None`. Pydantic v2 rejects int-for-str → 422. Was masked by the 502 from Issue #1 but would have appeared immediately after fixing it.

## The fix sequence

Fix in this exact order — each step makes the next one verifiable:

1. **Fix `api()` first.** Add `const data = await resp.json().catch(() => ({})); if (!resp.ok) throw new Error(data.error || \`HTTP ${resp.status}\`)` before the return. Every future bug will now scream instead of whisper. This is the most leveraged change in the whole fix.

2. **Merge FastAPI into Flask (Path A).** Port all routes from `backend/ai-agents/main.py` into `backend/app.py`. The Flask→FastAPI split was a local-dev convenience, not a real architectural decision — there is no reason to preserve it. One process, no `AI_AGENT_URL`, no inter-service hop, works on any platform. **Critical:** bring the Pydantic validation logic with you — don't just copy raw route handlers. Rewrite field validation as manual type coercion in Flask. This is what makes the merge durable rather than just a copy-paste. Also update `Procfile`, `nixpacks.toml`, and `run.py` so local-dev and production run the same entrypoint.

3. **Fix `experience_min` type.** Change `experience_min: str | None = None` → `experience_min: int | None = None` in the model. While there, audit the rest of the model for any other numeric fields typed as str.

4. **Add a startup healthcheck.** At Flask startup, ping `AI_AGENT_URL/health` and log loudly if unreachable. This one line would have caught the original bug on first deploy. Even after the merge (when `AI_AGENT_URL` is no longer used), the pattern is worth keeping as a template for any future external service dependency.

## The assumption that caused this

> "If it works locally with `run.py --with-agents`, it will work in prod."

The local entrypoint (`run.py`) and the production entrypoint (`Procfile`) were allowed to diverge with no automated check. The real fix is making them run the same set of processes — which Path A achieves by reducing both to one.

## Resolution — shipped 2026-04-16

- **Commit:** `f2f0c0d` — "fix: merge FastAPI AI layer into Flask to unblock writes"
- **Repo:** `nikshostudios/beroz`, `main`
- **Deployed via:** Railway GitHub auto-deploy (also corrected Railway source repo — was pointing at `recruitment-agents`, now correctly points at `beroz`)
- **Verified:** `npx playwright test phase3-requirements` — 1 passed (12.1s). Full suite: 31/31.

Key files changed: `backend/ai_agents/core.py` (new — ported all FastAPI write routes), `backend/app.py` (replaced 14 proxy routes with direct `ai_core` calls, dropped `AI_AGENT_URL`, added Supabase startup healthcheck), `frontend-exceltech/index.html` (fixed `api()` to throw on non-2xx), `run.py` (removed uvicorn subprocess), `backend/ai-agents/` renamed to `backend/ai_agents/` for Python importability.

## Relevance to Niksho

The TL workflow (Create Requirement → Source Now → Shortlist) is now fully unblocked on the live deployment. The `api()` error handling fix has compounding value — any future write route bug will surface immediately as a visible UI error rather than a silent swallow, dramatically shortening future debug cycles. See [[Efforts/ExcelTech-Automation/Overview]] for the milestone context.

## See also
- [[Raw/docs/Beroz-Playwright-Fix-Analysis-2026-04-16]] — full root cause analysis with code excerpts
- [[Wiki/digests/Session-Beroz-E2E-Testing-2026-04-15]] — the test run that found the bug
- [[Raw/docs/Beroz-Playwright-Test-Report-2026-04-15]] — 30/31 test results
- [[Efforts/ExcelTech-Automation/Overview]]
