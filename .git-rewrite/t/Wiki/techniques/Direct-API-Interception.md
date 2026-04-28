---
type: technique
generated-by: ingest-source
sources: ["[[Raw/docs/sourcing-troubleshooting-2026-04-11]]"]
updated: 2026-04-11
---

# Direct API Interception

Instead of rendering a web page in a headless browser and scraping the HTML, find the XHR/fetch API endpoint that the frontend calls and hit it directly with a simple HTTP client (`httpx`, `requests`).

## How it works

Modern web apps are SPAs (React, Next.js, Vue) where the frontend makes API calls to a backend that returns structured JSON. The rendered HTML is just a presentation layer on top of that JSON. By intercepting the API call, you skip the browser entirely and get cleaner, faster, cheaper data.

## Steps to intercept

1. Open Chrome DevTools → Network tab → filter by Fetch/XHR
2. Perform the action on the website (search, navigate, etc.)
3. Find the request that returns the data you want
4. Copy the full request: URL, method, headers (including cookies and CSRF tokens), and body
5. Reproduce it with `httpx` or `requests` in Python

## Why it's better than headless scraping

No browser rendering cost (Firecrawl charges per scrape). No fingerprinting risk (direct HTTP looks identical to the real frontend). No SPA interaction flakiness (no clicking, typing, waiting for JS). Structured JSON response — no HTML parsing needed. Much faster — milliseconds vs seconds per request.

## Why it matters to Niksho

This is the proposed fix for the Foundit Recruiter channel. The recruiter portal at `recruiter.foundit.sg` is a Next.js SPA. When a recruiter searches, the frontend calls a backend API that returns candidate profiles as JSON. By calling that API directly with the session cookie, we bypass Firecrawl, Akamai bot detection, and browser action flakiness in one move.

## Caveats

The session cookie still expires every 24-48 hours and requires manual refresh (Foundit has CAPTCHA on login). The API endpoint may change when Foundit updates their frontend. But both are far more manageable than fighting bot detection.

## Related
- [[Wiki/tools/Firecrawl]]
- [[Wiki/concepts/Bot-Detection-vs-Scraping]]
- [[Wiki/concepts/Candidate-Sourcing-Channels]]
- [[Raw/docs/sourcing-troubleshooting-2026-04-11]]
