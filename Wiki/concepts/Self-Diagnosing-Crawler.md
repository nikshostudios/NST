---
type: wiki-concept
generated-by: claude
sources: ["[[Raw/docs/Beroz-Clone-Capture-Session-2026-04-28]]"]
updated: 2026-04-28
tags: [playwright, scraping, debugging, automation, robustness]
---

# Self-Diagnosing Crawler

## What it is

A pattern for web crawlers that adds two layers of insurance against the silent-failure-then-debug-loop trap that DOM-heuristic-based crawling produces:

1. **A `doctor()` function** that runs first and reports the actual state of the browser in plain English — what URL it landed on, what the title is, whether sign-in text is visible (= unauthenticated), whether a sidebar-like element rendered, plus a full body HTML dump. Replaces silent failures ("0 routes discovered, no error") with explicit diagnostics.

2. **A manual route override** (`config/routes.json`) — if the file exists, the crawler skips auto-discovery entirely and walks the explicit URL list. Five minutes of human time replaces hours of DOM-heuristic chasing.

The combination means: when a crawler can't auto-discover, it tells you exactly why; and you can always get unstuck by listing routes manually.

## The pattern in code

```typescript
async function doctor(page: Page, captureDir: string) {
  const url = page.url();
  const title = await page.title();
  const html = await page.content();
  writeFileSync(join(captureDir, "_debug-doctor.html"), html);

  const diag = await page.evaluate(() => {
    const bodyText = (document.body?.innerText || "").slice(0, 800);
    const signinPhrases = ["sign in", "log in", "continue with google", ...];
    const signinDetected = signinPhrases.some(p =>
      bodyText.toLowerCase().includes(p));
    const navCandidates = ["nav", "[role='navigation']", "aside",
      "[class*='Sidebar']", "[data-testid*='sidebar' i]"];
    const hasNav = navCandidates.some(sel => {
      const el = document.querySelector(sel);
      return el && el.getBoundingClientRect().height > 200;
    });
    return { signinDetected, hasNav };
  });

  return {
    authenticated: !diag.signinDetected && diag.hasNav,
    url, title, signinDetected: diag.signinDetected,
    hasNavLikeElement: diag.hasNav,
  };
}

function loadExplicitRoutes(): string[] | null {
  if (!existsSync("config/routes.json")) return null;
  const cfg = JSON.parse(readFileSync("config/routes.json", "utf-8"));
  return Array.isArray(cfg.routes) && cfg.routes.length > 0 ? cfg.routes : null;
}
```

Then in the main flow:

```typescript
const dx = await doctor(seedPage, captureDir);
if (!dx.authenticated) {
  if (dx.signinDetected) {
    console.log("Re-run npm run auth, then re-run crawl");
  } else {
    console.log("SPA may not have hydrated. Check captures/_debug-doctor.html");
  }
  process.exit(1);
}

const routes = loadExplicitRoutes() ?? await discoverSidebarRoutes(seedPage);
if (routes.length === 0) {
  console.log("Quickest fix: create config/routes.json with the URLs");
  process.exit(1);
}
```

## Why it matters

Web crawlers against modern React/Next.js apps fail in many subtle ways: nav items are buttons not anchors, sidebars are `<div class="Sidebar">` not `<nav>`, auth tokens don't transfer between contexts, networkidle never fires. Without a doctor function, all of these failures look identical to the developer: "0 routes discovered, no error message." You then patch one heuristic at a time, each round taking 30+ minutes, often without ever knowing whether it's the auth, the SPA hydration, the selector, or the timing.

The doctor function makes the failure mode explicit — which one of those things is actually wrong. The manual route override means you never have to debug auto-discovery as a blocker; you can always proceed with a hand-listed URL set while you fix the auto-discovery later.

## Why it's permanent

The pattern eliminates an entire class of recurring bugs. Once the doctor function exists, it tells you definitively whether the issue is auth state vs. SPA rendering vs. sidebar selectors vs. timing — you don't guess. Once `routes.json` is supported, you can always make forward progress regardless of how broken auto-discovery is. That's the difference between "fix the symptom" and "structurally remove the failure mode."

## Relevance to Niksho

Built during the [[Wiki/digests/Session-Beroz-Clone-Capture-2026-04-28|2026-04-28 Beroz clone capture session]] after auto-discovery failed three times in a row against Juicebox (each time with a different root cause: unauthenticated state, no sidebar selectors matching, button-based nav requiring click-and-observe). Adding the doctor function + routes.json override on the fourth attempt is what unblocked the entire capture pipeline.

The pattern applies anywhere a web crawler sits in our stack — including future captures of other competitors (Recruiterflow, GoPerfect), and potentially the harvestapi/Apify capture paths in our 7-channel sourcing pipeline if they ever need DOM-level inspection.

The clone's `crawl.ts` permanently includes both layers; future captures inherit the robustness automatically.

## Related

- [[Wiki/concepts/Authenticated-SPA-Capture]] — the broader category this fits within
- [[Wiki/concepts/Crawl-Walkthrough-Capture-Pipeline]] — the larger 3-layer pattern that uses self-diagnosing crawler as Layer 1
- [[Wiki/techniques/Playwright-DOM-Crawling]] — the technique this strengthens
- [[Wiki/digests/Session-Beroz-Clone-Capture-2026-04-28]] — the session where this pattern crystallised
