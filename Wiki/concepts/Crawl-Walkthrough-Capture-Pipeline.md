---
type: wiki-concept
generated-by: claude
sources: ["[[Raw/docs/Beroz-Clone-Capture-Session-2026-04-28]]"]
updated: 2026-04-28
tags: [ui-cloning, capture-pipeline, methodology, claude-code]
---

# Crawl-Walkthrough-Capture Pipeline

## What it is

A three-layer pipeline for cloning authenticated SaaS apps. Each layer fills a gap the others can't.

```
Layer 1: Crawl       (automated)  → static structure of every page
Layer 2: Walkthrough (human-led)  → why per button + missing-surface inventory
Layer 3: Targeted    (automated)  → specific missing surfaces (modals, drawers)
                                    ↓
                                    feature map .md → Claude Code build
```

The architecture is **layered defence against the dominant failure mode of UI cloning** — that pure automated capture produces "a generic SaaS dashboard" because it doesn't capture the *why*, while pure manual capture is too slow and inconsistent for the *what*.

## How each layer works

### Layer 1 — Crawl (automated, ~45 minutes wall-clock)

Playwright walks every page in the app's sidebar (or follows a manual route list). Per page captures: full DOM, full-page screenshot, computed styles for representative elements (buttons / inputs / cards / headings / pills / chips), every interactive element enumerated (buttons / links / inputs / role=button), every API call fired, hover-state captures for the first N interactives.

Plus: a coverage report telling you what was missed, and a debug HTML dump if discovery fails. See [[Wiki/concepts/Self-Diagnosing-Crawler]] for the robustness pattern this layer should follow.

**What it captures:** the default landing state of every routable page. The *what* dimension.

**What it misses:** modals, drawers, populated states (search results, populated lists), sub-tabs that share a URL, post-interaction states, loading/error/empty states.

### Layer 2 — Walkthrough (human-led, ~90 minutes)

The human (someone who uses the target app daily) drives the app in their real browser. The capture agent (Claude in Cowork) takes screenshots periodically to see what state the human is in, asks structured questions per tab using the captured button inventory from Layer 1, and the human dictates answers via voice-to-text (e.g., Typewhisper).

The structured question template per tab:

1. **Identity (2 Qs):** What is this page for? When does a user land here?
2. **Workflow (3 Qs):** First action on this page? Success state? Failure state?
3. **Per-button (n Qs, driven by Layer 1's interactives.json):** What does each captured button do? When? What happens after?
4. **Connection (2 Qs):** Where do you go next? What data carries forward?
5. **Edge cases (2 Qs):** Most annoying thing? What breaks?
6. **Inventory (1 Q):** What modals, drawers, sub-tabs does this page open? — this generates the input for Layer 3.

While narrating, the human is asked to **open every modal, drawer, dropdown they describe** so the capture agent can screenshot each. This is when the bulk of Layer 1's gaps get filled — opportunistically during the walkthrough.

**What it captures:** the *why* dimension (workflow logic, recruiter mental model, edge cases) and most of the missed *what* surfaces (modals, drawers, populated states the human can trigger live).

**What it misses:** loading states (flash by too fast), error states (hard to trigger reliably), edge-case empty/populated states the human doesn't have data for, hover tooltips on long-hover.

### Layer 3 — Targeted captures (automated, ~30 minutes)

After the walkthrough produces the missing-surface inventory, write a follow-up `flows.json` with one targeted flow per surface still missing. The flows are mostly script-driven (Playwright clicks the buttons by text) with sample data hardcoded where needed. Re-run the flow script; it captures the long-tail surfaces automatically.

Example flow per missing surface:

```json
{
  "name": "search-filter-editor",
  "steps": [
    { "action": "navigate", "url": "/project/<id>/search/" },
    { "action": "fill", "selector": "#filter-input", "value": "Software engineer" },
    { "action": "click", "by": "selector", "value": "button[type='submit']" },
    { "action": "wait", "ms": 5000 },
    { "action": "click", "by": "text", "value": "Filters" },
    { "action": "screenshot", "label": "01-filter-editor-open" }
  ]
}
```

**What it captures:** specific missing UI states with pixel-accurate screenshots and DOM snapshots.

**What it misses:** edge cases requiring real backend state (failed payments, expired trials, banned accounts) — these get reconstructed from the walkthrough narrative during the build.

## Why this pattern works

Each layer has a different cost/coverage profile:

| Layer | Effort | Coverage | What it produces |
|---|---|---|---|
| Crawl | ~45 min, mostly hands-off | High breadth, low depth | The skeleton |
| Walkthrough | ~90 min, fully attentive | Medium breadth, high depth | The why + missing inventory |
| Targeted | ~30 min, mostly hands-off | Specific gaps only | The long-tail |

Cumulatively: ~2.5 hours total for a complete capture of a 10-page app, with both *what* and *why* covered. This is the fastest path to a build-ready spec we've found.

The 04-15 attempt at Juicebox tried Layer 1 only (no walkthrough, no targeted captures). Output was "a generic SaaS dashboard." That's the failure mode this pipeline structurally prevents.

## Relevance to Niksho

This pipeline is the core capture methodology for the Beroz pure-clone strategy ([[Efforts/Niksho-SaaS-Product/decisions/2026-04-28-pivot-to-pure-clone]]). The output (populated `JUICEBOX-FEATURE-MAP.md`) is what Claude Code builds against in Phase 3.

Beyond the immediate Beroz build, the pattern applies to:

- **Future competitor captures** (Recruiterflow, GoPerfect) when we want detailed spec docs for either teardown analysis or comparative UX research
- **Internal UI documentation** — point Layer 1 at our own Beroz frontend, run Layer 2 with one of our recruiters, produce the docs we never wrote
- **Onboarding tooling** — generate spec-quality walkthroughs of new features for handoff to our engineering team

## What makes this work in practice

- **Voice dictation for the walkthrough** (Typewhisper or macOS Voice Control) — keeps the human's hands free for clicking while answering questions. Without this, the walkthrough is much slower because the human context-switches between clicking and typing.
- **Two screens during the walkthrough** — target app on one, chat + dictation on the other. Single-screen walkthroughs are clunky.
- **Computer-use grant for the capture agent** — Cowork's screenshot capability lets the agent see the human's screen in real time. Without it, the agent has to ask "what's on screen now?" constantly.
- **A populated app state going into Layer 2** — a sequence running, candidates in shortlist, recent search results visible. Empty states give thin walkthrough material.

## Related

- [[Wiki/concepts/Self-Diagnosing-Crawler]] — the robustness pattern Layer 1 should follow
- [[Wiki/concepts/Authenticated-SPA-Capture]] — the auth approach all three layers depend on
- [[Wiki/techniques/Playwright-DOM-Crawling]] — Layer 1 implementation
- [[Efforts/Niksho-SaaS-Product/JUICEBOX-FEATURE-MAP]] — the spec format the pipeline produces
- [[Wiki/digests/Session-Beroz-Clone-Capture-2026-04-28]] — the session where this pattern crystallised
- [[Wiki/concepts/Seven-Levels-of-Web-Design]] — the design-progression model that underpins clone-from-real-source
