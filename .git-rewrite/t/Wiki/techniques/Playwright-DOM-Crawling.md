---
type: wiki-technique
generated-by: claude
sources: ["[[Raw/docs/Juicebox-Teardown-Session-2026-04-15]]"]
updated: 2026-04-15
tags: [playwright, scraping, automation, ui-cloning]
---

# Playwright DOM Crawling

## What it is

An automated technique for systematically capturing the live rendered DOM of every page, tab, modal, and interactive state in a web application. Uses Playwright (browser automation) with a manual login step, then automatically walks every clickable element and saves each page state as a complete HTML file.

## How it works

```
Launch browser (non-headless)
  → Navigate to app
  → Pause for manual login (user signs in with Google/SSO)
  → Save session cookies to disk
  → Crawl sidebar nav items (click each, save DOM)
  → For each page: find tabs, expandable sections, dropdowns
    → Click each, save DOM state
  → Find "Create new" / "Add" buttons → click, save modal DOM
  → Crawl settings sub-tabs
  → Generate INDEX.md mapping files to URLs
```

Key implementation details:
- **Session persistence:** Cookies saved to `auth-session/cookies.json` so subsequent runs skip login entirely
- **Login detection:** Script checks if the page contains "Continue with Google" text — if yes, pauses for manual login; if no, proceeds automatically
- **Viewport:** Fixed at 1440x900 to ensure desktop layout renders (avoids responsive breakpoints hiding content)
- **Wait times:** 3-4 second delays after each navigation to let React/Next.js hydrate fully
- **Deduplication:** Tracks visited URLs and clicked buttons to avoid capturing the same state twice
- **Metadata:** Each HTML file includes a comment header with capture timestamp, URL, and page title

## When to use it

- Reverse-engineering a competitor's UI for design reference
- Creating a comprehensive teardown/blueprint for cloning
- Auditing a SaaS product's complete feature surface
- Capturing reference material for AI-assisted UI building (feed HTML files to Claude Code)

## Limitations

- Cannot automate Google OAuth directly (Google blocks automated browsers)
- Single-page app state changes (e.g., typing in search, scrolling infinite lists) may not be captured without explicit scripting
- Very dynamic content (WebSocket-driven real-time updates) may appear differently each run
- Large apps may need multiple targeted crawl scripts rather than one generic crawler

## Relevance to Niksho

Built and used during the [[Wiki/digests/Session-Juicebox-Teardown-2026-04-15|Juicebox teardown session]]. The crawler captured 43 HTML files from Juicebox (with a second pass script targeting ~20 more). These files serve as the ground-truth reference for building the Niksho hybrid UI — Claude Code reads the actual HTML/CSS instead of relying on written specs.

Crawler lives at: `recruitment-agents/juicebox-crawler/`

## Related

- [[Wiki/concepts/Authenticated-SPA-Capture]] — the manual single-page version of this technique
- [[Wiki/tools/Firecrawl]] — works for public pages but can't handle authenticated SPAs
- [[Wiki/techniques/Direct-API-Interception]] — alternative: skip the UI and call backend APIs directly
- [[Wiki/concepts/Seven-Levels-of-Web-Design]] — the captured HTML reveals what "level" the target site is built at
