---
type: tool
generated-by: ingest-source
sources: ["[[Raw/docs/sourcing-troubleshooting-2026-04-11]]", "[[Raw/docs/sourcing-architecture]]"]
updated: 2026-04-11
---

# Firecrawl

Web scraping API that renders JavaScript, handles SPAs, and outputs clean markdown or structured JSON. Used in the ExcelTech sourcing pipeline for Foundit searches.

## What it's good at

Firecrawl works well for standard web pages, documentation sites, SaaS marketing pages, and public content. It handles JS rendering, strips boilerplate, and gives you LLM-ready output. It supports browser actions (click, type, wait) for interacting with SPAs, and has a built-in stealth mode with proxy management.

## Where it fails for us

Against advanced bot detection (Akamai, Cloudflare), Firecrawl has a **33.69% success rate** at 2 requests/second according to a Proxyway benchmark. Foundit's recruiter portal uses Akamai fingerprinting, which detects Firecrawl's headless browser after a few requests and blocks it entirely.

> "Firecrawl returns HTTP 500 with SCRAPE_SITE_ERROR / ERR_ABORTED when trying to scrape recruiter.foundit.sg. Even simple scrapes without browser actions fail." — [[Raw/docs/sourcing-troubleshooting-2026-04-11]]

The blocking is **fingerprint-based, not IP-based** — Browserless (a competitor) can scrape from the same IP because it uses more advanced anti-detection techniques in its Playwright implementation.

## Cost traps

Base cost is ~$0.01/scrape, but JSON mode adds 4 extra credits, enhanced proxy adds 4 extra credits. A page that needs both can cost 9 credits per request. Budget caps are essential — see [[Atlas/Product/Sourcing-Channels]] for our per-day and per-requirement limits.

## Where Firecrawl *can* still help us

Firecrawl is useful for **content scraping** rather than authenticated portal scraping: scraping job descriptions from client career pages, extracting structured data from public company websites for account research, converting web pages to markdown for the vault's Raw/ folder. It is not the right tool for scraping behind authentication on bot-protected portals.

## The better approach for Foundit

Rather than rendering the full SPA, intercept the XHR/fetch API endpoint that Foundit's Next.js frontend calls, and hit it directly with `httpx` + the session cookie. This bypasses Firecrawl entirely — no browser rendering, no fingerprinting, no cost. See [[Wiki/techniques/Direct-API-Interception]].

## Related
- [[Wiki/concepts/Bot-Detection-vs-Scraping]]
- [[Wiki/concepts/Candidate-Sourcing-Channels]]
- [[Wiki/techniques/Direct-API-Interception]]
- [[Atlas/Product/Sourcing-Channels]]
- [[Raw/docs/sourcing-architecture]]
