---
type: concept
generated-by: ingest-source
sources: ["[[Raw/docs/sourcing-troubleshooting-2026-04-11]]"]
updated: 2026-04-11
---

# Bot Detection vs Scraping

Modern web applications use fingerprinting systems (Akamai, Cloudflare, DataDome) that detect headless browsers by examining browser properties, timing patterns, and execution signatures — not just IP addresses.

## Why it matters to Niksho

The ExcelTech pipeline's Foundit Recruiter channel was blocked by Akamai after a few Firecrawl requests. The blocking was fingerprint-based: Browserless could scrape the same site from the same IP because its Playwright implementation includes more advanced anti-detection. This means proxy rotation and IP changes won't fix the problem — the headless browser itself is the tell.

## The hierarchy of scraping reliability

From most reliable to least:

1. **Official API** — structured JSON, stable, documented, no detection risk. Best option when available.
2. **Direct XHR/fetch interception** — calling the same backend endpoints the frontend calls, with the same headers. Looks identical to a real user. See [[Wiki/techniques/Direct-API-Interception]].
3. **Headless browser with advanced stealth** — Browserless, undetected-chromedriver. Higher success rate than basic headless but still fragile.
4. **Standard headless browser** — Firecrawl, Playwright, Puppeteer. Gets blocked by Akamai, Cloudflare at ~34% success rate on protected sites.
5. **Simple HTTP request + HTML parsing** — BeautifulSoup/Scrape.do. Only works on static pages with no JS rendering.

## The lesson for pipeline design

Always start at the top of the hierarchy. Check for an official API first. If none exists, intercept the XHR calls. Only fall back to headless browser scraping as a last resort, and flag it as inherently fragile.

## Related
- [[Wiki/tools/Firecrawl]]
- [[Wiki/techniques/Direct-API-Interception]]
- [[Wiki/concepts/Candidate-Sourcing-Channels]]
