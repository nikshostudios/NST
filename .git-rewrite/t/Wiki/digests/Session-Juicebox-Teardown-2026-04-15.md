---
type: wiki-digest
generated-by: claude
sources: ["[[Raw/docs/Juicebox-Teardown-Session-2026-04-15]]"]
date: 2026-04-15
updated: 2026-04-15
tags: [frontend, ui-cloning, juicebox, playwright, site-teardown]
---

# Juicebox Teardown & UI Cloning Session

## Core outcome

Reverse-engineered the Juicebox AI recruiting platform (app.juicebox.ai) to use as the primary design reference for the Niksho/ExcelTech frontend. Produced a 700-line teardown document, built a Playwright-based automated DOM crawler (43+ pages captured), and landed on a hybrid strategy: Juicebox UI patterns + Niksho product features.

## Key findings

### Juicebox tech stack
Next.js (Pages Router) + MUI v6 + Emotion CSS-in-JS. Firebase Auth for Google login. Stripe + Churnkey for billing. PostHog + GTM via Stape server-side proxy for analytics. Sentry for errors. Pylon for in-app chat. TinyMCE + TipTap for rich text editing. Hosted on Vercel.

The design system is deliberately warm and organic — not cold clinical SaaS. Near-white background (#FCFCFC), white cards, single purple accent (#7600bc), Inter font, 4px spacing grid, 250ms standard transitions. The sidebar is 220px fixed, main content flexes, right drawer is 480-500px.

### What makes Juicebox's UI work
The app is search-first, not dashboard-first. The primary interface is a natural-language search bar that returns candidate cards with match explanations. Each result shows the candidate name with LinkedIn/external links, current title and company, skill match tags with AI-generated explanations of why the candidate matches, and a status dropdown (Shortlisted, Contacted, etc.). Filter pills and criteria counts appear at the top. This is fundamentally different from a traditional recruitment dashboard with metric cards and pipeline tables.

### The authenticated SPA problem
Juicebox is behind Google OAuth, so standard scraping tools (WebFetch, curl, Puppeteer with no auth) all return the login page. The working approach for capturing authenticated SPAs:

```
Undock DevTools → Console → copy(document.documentElement.outerHTML) → paste
```

Undocking is critical because docked DevTools shrinks the viewport, triggering Juicebox's mobile fallback (600px breakpoint hides the desktop UI).

### Playwright crawler approach
For systematic full-app capture, Playwright with manual login pause is more reliable than trying to automate Google OAuth. The script pauses, the user logs in manually, presses Enter, then the crawler takes over. Session cookies are persisted to disk so subsequent runs skip login.

The crawler walks every sidebar nav item, clicks into sub-tabs, finds "Create new" buttons to capture modals, and saves each page state as a full HTML file with metadata comments.

## Strategy decision: hybrid, not clone

Pure cloning produces a Juicebox lookalike but doesn't reflect Niksho's actual product (multi-agent recruitment automation with sourcing, screening, outreach, follow-up). The decision: use Juicebox's UI patterns (search-first interface, candidate cards, sidebar navigation, status management) but populate them with Niksho-specific features (agent status dashboards, pipeline stages unique to ExcelTech workflow, submission formatting for client delivery).

## Relevance to Niksho

This session directly feeds [[Efforts/Niksho-SaaS-Product/Overview]] and [[Efforts/ExcelTech-Automation/Overview]]. The Playwright crawler output (43+ HTML files) becomes the reference material for the next Claude Code session to build the production frontend. The teardown document at `NST/research/2026-04-14-juicebox-agent-teardown.md` is the design spec.

The previous Beroz frontend (documented in [[Raw/docs/Beroz-Build-Session-2026-04-15]]) was the first Juicebox clone attempt. This session represents the second, more systematic iteration — complete with automated tooling for capturing the source material.

## See also

- [[Wiki/concepts/Seven-Levels-of-Web-Design]] — the Beroz design approach was inspired by this
- [[Wiki/concepts/Authenticated-SPA-Capture]] — new technique from this session
- [[Wiki/techniques/Playwright-DOM-Crawling]] — new technique from this session
- [[Wiki/tools/Firecrawl]] — contrast: Firecrawl can't handle authenticated SPAs
- [[Raw/docs/Beroz-Build-Session-2026-04-15]] — previous frontend iteration
- [[Efforts/Niksho-SaaS-Product/Overview]] — the product this feeds into
