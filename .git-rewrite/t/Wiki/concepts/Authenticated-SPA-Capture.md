---
type: wiki-concept
generated-by: claude
sources: ["[[Raw/docs/Juicebox-Teardown-Session-2026-04-15]]"]
updated: 2026-04-15
tags: [frontend, scraping, devtools, technique]
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

## Relevance to Niksho

Used to capture the Juicebox AI dashboard for the [[Wiki/digests/Session-Juicebox-Teardown-2026-04-15|Juicebox teardown session]]. Also applicable when researching any competitor SaaS UI. Contrast with [[Wiki/tools/Firecrawl]] which works well for public pages but fails on authenticated apps.

## Related

- [[Wiki/techniques/Playwright-DOM-Crawling]] — automated version for multi-page capture
- [[Wiki/tools/Firecrawl]] — alternative for public (unauthenticated) pages
- [[Wiki/techniques/Direct-API-Interception]] — another approach: bypass the UI entirely and call the backend APIs
- [[Wiki/concepts/Bot-Detection-vs-Scraping]] — the broader landscape of web scraping challenges
