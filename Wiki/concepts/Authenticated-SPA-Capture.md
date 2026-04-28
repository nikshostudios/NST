---
type: wiki-concept
generated-by: claude
sources:
  - "[[Raw/docs/Juicebox-Teardown-Session-2026-04-15]]"
  - "[[Raw/docs/Beroz-Clone-Capture-Session-2026-04-28]]"
updated: 2026-04-28
tags: [frontend, scraping, devtools, playwright, technique]
---

# Authenticated SPA Capture

## What it is

A method for extracting the full rendered DOM from single-page applications that sit behind OAuth login (Google sign-in, SSO, etc.). Standard tools like WebFetch, curl, or unauthenticated Puppeteer all fail because the server returns the login page, not the app. The rendered SPA content only exists in the browser's live DOM after JavaScript has executed with a valid auth session.

## The approach

1. Log in normally in Chrome
2. Undock DevTools into a separate window (critical — docked DevTools shrinks the viewport, which can trigger responsive fallbacks that hide the real UI)
3. Run `copy(document.documentElement.outerHTML)` in the Console
4. This captures the fully rendered DOM including all React/Next.js hydrated content, Emotion CSS-in-JS styles, and dynamically loaded data

For systematic multi-page capture, use [[Wiki/techniques/Playwright-DOM-Crawling]] instead of manual copy — Playwright can persist login sessions and automate clicking through every page.

## Why it matters

Most modern SaaS products are authenticated SPAs. Traditional scraping (fetching HTML from the server) only gets the shell or login page. The actual UI, design system, component structure, and interaction patterns are all rendered client-side after authentication. If you want to clone, teardown, or audit a competitor's UI, you need the live DOM, not the server response.

## Key gotchas discovered

- **View Source (Ctrl+U) doesn't work** — it makes a fresh unauthenticated HTTP request
- **DevTools must be undocked** — docked panels reduce viewport width, triggering responsive breakpoints (Juicebox hides desktop UI below 600px)
- **Session expiry** — the DOM copy only works while your session is active; 401 errors in the console mean you need to re-login first
- **Chrome's paste warning** — first-time console paste requires typing "allow pasting" to bypass Chrome's social engineering protection

## Update 2026-04-28 — Playwright auth path (the canonical automated approach)

When automating with Playwright against Google-OAuth-protected SPAs, three things matter and they were learned the hard way during the [[Wiki/digests/Session-Beroz-Clone-Capture-2026-04-28|Beroz clone capture session]]:

### 1. Use real Chrome, not bundled Chromium

Google's auth heuristics fingerprint Playwright's bundled Chromium and refuse OAuth with "this browser may not be secure" — *regardless* of whether credentials are valid. The fix is to use the system-installed Chrome via `channel: 'chrome'`:

```typescript
const context = await chromium.launchPersistentContext(PROFILE_DIR, {
  channel: "chrome",
  headless: false,
  args: ["--disable-blink-features=AutomationControlled"],
});
```

Real Chrome + AutomationControlled flag disabled passes Google's checks reliably.

### 2. Reuse the same persistent profile across all scripts

`storageState.json` handoff from a real-Chrome auth context to a bundled-Chromium crawl context is fragile — Firebase Auth tokens often live in localStorage on origins the auth context never visited as top-level pages, so they don't get serialised. Symptom: crawler lands on the marketing/login page despite valid storageState.

The reliable fix: every script (`auth.ts`, `crawl.ts`, `interact.ts`) uses `launchPersistentContext` against the same profile dir. No cross-context translation. The profile is the session.

### 3. Don't use `waitUntil: 'networkidle'`

Modern SaaS apps keep the network busy indefinitely with WebSockets (Firestore Listen channel), telemetry endpoints (PostHog, Frigade, monitoring), and long-polling. `networkidle` never fires; `page.goto()` times out at 30s.

Use `waitUntil: 'domcontentloaded'` plus a 2-3 second `page.waitForTimeout()` to give the SPA time to hydrate after DOMContentLoaded. Wrap gotos in try/catch so timeouts don't crash the script — they're often non-fatal because the DOM has already rendered.

### 4. Clean stale Chrome profile locks before launching

Chrome leaves `SingletonLock`, `SingletonCookie`, `SingletonSocket` files in profile dirs on dirty exits. Auto-clean them at the start of every script:

```typescript
function cleanupStaleLocks(profileDir: string): void {
  for (const f of ["SingletonLock", "SingletonCookie", "SingletonSocket"]) {
    const p = join(profileDir, f);
    if (existsSync(p)) { try { rmSync(p, { force: true }); } catch {} }
  }
}
```

### 5. Add a self-diagnostic so failures are explicit

When auto-discovery fails, you want to know *why* — auth or DOM or hydration timing. See [[Wiki/concepts/Self-Diagnosing-Crawler]] for the doctor function pattern that makes failure modes explicit instead of silent.

## Relevance to Niksho

Used to capture the Juicebox AI dashboard for the [[Wiki/digests/Session-Juicebox-Teardown-2026-04-15|Juicebox teardown session]]. Also applicable when researching any competitor SaaS UI. Contrast with [[Wiki/tools/Firecrawl]] which works well for public pages but fails on authenticated apps.

## Related

- [[Wiki/techniques/Playwright-DOM-Crawling]] — automated version for multi-page capture
- [[Wiki/concepts/Self-Diagnosing-Crawler]] — the doctor() + manual route override pattern that makes failures explicit
- [[Wiki/concepts/Crawl-Walkthrough-Capture-Pipeline]] — the 3-layer pattern this technique is the foundation of
- [[Wiki/digests/Session-Beroz-Clone-Capture-2026-04-28]] — where the Playwright auth findings were learned
- [[Wiki/tools/Firecrawl]] — alternative for public (unauthenticated) pages
- [[Wiki/techniques/Direct-API-Interception]] — another approach: bypass the UI entirely and call the backend APIs
- [[Wiki/concepts/Bot-Detection-vs-Scraping]] — the broader landscape of web scraping challenges
