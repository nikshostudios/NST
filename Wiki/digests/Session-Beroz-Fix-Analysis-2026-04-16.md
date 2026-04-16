---
type: wiki-digest
generated-by: claude
sources: ["[[Raw/docs/Beroz-Playwright-Fix-Analysis-2026-04-16]]", "[[Raw/docs/Beroz-Playwright-Test-Report-2026-04-15]]"]
date: 2026-04-16
updated: 2026-04-16
tags: [beroz, debugging, exceltech, flask, fastapi, railway, deployment]
---

# Beroz Create-Requirement Bug — Root Cause & Fix Plan

## Core finding

What looked like one silent bug was three compounding issues hiding each other. FastAPI was never running in production (Issue #1), but you couldn't see that because the frontend `api()` helper swallowed every HTTP error without showing it to the user (Issue #2). A type mismatch on `experience_min` (Issue #3) was queued up behind both of them. The fix is Path A: merge FastAPI into Flask, collapse to one process, eliminate the inter-service hop entirely.

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

## Relevance to Niksho

This is the last blocker before Create Requirement works end-to-end for the first time on the live deployment. After this fix, the Playwright suite should hit 31/31 and the TL workflow (Create Requirement → Source Now → Shortlist) is unblocked. See [[Efforts/ExcelTech-Automation/Overview]] for the milestone context.

The `api()` error handling fix also has compounding value — any future write route that has a backend issue will now show a visible error immediately, which dramatically shortens future debug cycles.

## See also
- [[Raw/docs/Beroz-Playwright-Fix-Analysis-2026-04-16]] — full root cause analysis with code excerpts
- [[Wiki/digests/Session-Beroz-E2E-Testing-2026-04-15]] — the test run that found the bug
- [[Raw/docs/Beroz-Playwright-Test-Report-2026-04-15]] — 30/31 test results
- [[Efforts/ExcelTech-Automation/Overview]]
