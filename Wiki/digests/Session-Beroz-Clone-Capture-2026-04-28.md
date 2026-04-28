---
type: wiki-digest
generated-by: claude
sources: ["[[Raw/docs/Beroz-Clone-Capture-Session-2026-04-28]]"]
date: 2026-04-28
updated: 2026-04-28
tags: [beroz, juicebox, playwright, ui-cloning, ia-extraction, capture-pipeline]
---

# Digest — Beroz Clone Capture Session 2026-04-28

## Core argument

The 2026-04-15 hybrid-clone strategy was reversed in favour of a pure 1:1 clone (visual + IA) → differentiate in Phase 4. A fresh Playwright capture toolkit was built and run against Juicebox: 11 pages with full DOM/screenshots/styles/interactives/network/hover-states, 7 flow traces with 90%-scripted automation, 102 unique API endpoints catalogued, and the IA confirmed (Project as routing primitive + 8 sub-routes + 1 workspace-scoped). Real captured data corrected several earlier teardown guesses (Helvetica/Arial system stack instead of Inter; brand purple `#6B2F8D` instead of `#7600bc`). The walkthrough — the primary capture mechanism for sub-surfaces (modals, drawers, populated states) — was kicked off but deferred to the next session for proper two-screen setup.

## What was decided

**Pivot to pure clone, IA included.** The 04-15 hybrid call assumed we could mix-and-match Juicebox patterns with Niksho behaviour without understanding either deeply. The 04-27 punch list (15 bugs, three demo-blockers) showed the cost. Pure clone forces understanding of every surface before customising; differentiation goes in Phase 4 once the foundation works. Risks accepted in writing: cloning Juicebox's IA bakes in agency-unfriendly assumptions (no Client primitive), Phase 4 multi-client must shoehorn Client as a Project tag rather than a routing parent.

**Frontend rebuild only.** Backend, agents, data layer all stay (mi.md hard rule, ExcelTech production stability). Missing endpoints get added as extensions in `/ai-agents/`, not as a backend rewrite.

**Real Chrome with persistent profile** is the canonical Playwright auth approach for Google-OAuth-protected SPAs. Bundled Chromium + storageState is fragile and gets blocked by Google. Documented update needed to [[Wiki/concepts/Authenticated-SPA-Capture]].

**Two protections folded in even within "execute as planned":** design tokens + primitives layer before any page-build PR (prevents drift across Claude Code sessions), and per-page visual diff gate (catches drift early).

## What got built — the toolkit

A complete Playwright capture project at `/Brand New Website/beroz/Clone/`:

```
auth.ts        → real-Chrome login → storageState + persistent profile
crawl.ts       → 11 pages × DOM + 3-breakpoint screenshots + styles
                 + interactives + network + hover states
                 + doctor() self-diagnostic + manual route override
interact.ts    → 7 flows with traces, 90% scripted (click/fill/wait actions)
analyze.ts    → REPORT.md + JUICEBOX-FEATURE-MAP-AUTOFILL.md
                 (design system + IA + 102-endpoint API manifest)
```

The toolkit's permanent insurance against the DOM-heuristic-failure loop:

1. **`doctor()` function** — runs first, reports browser state in plain English (URL, title, sign-in text Y/N, sidebar element Y/N, body HTML dumped). No more silent failures.
2. **`config/routes.json` manual override** — explicit URL list always wins over auto-discovery.

These two layers earn standalone concept-note treatment: [[Wiki/concepts/Self-Diagnosing-Crawler]].

## Capture findings — corrections to earlier teardown

| Property | 04-15 guess | Captured reality | Impact |
|---|---|---|---|
| Font stack | Inter | Helvetica/Arial system stack (44× vs 3× for Inter) | Building with Inter would look subtly wrong everywhere |
| Brand purple | `#7600bc` | `rgb(107, 47, 141)` = `#6B2F8D` | Slightly different shade; matters for pixel-accurate clone |
| Body text colour | not captured | `rgb(51, 51, 51)` (33×) | Standard near-black grey |
| Base font size | implied 14px | 16px (56×) | Larger than typical SaaS — readable for older recruiters |
| Border radius default | 4px | 0px dominant (40×); 4px secondary (10×) | Juicebox uses sharp corners more than rounded |
| Box shadows | implied subtle | mostly `none` (61×) — flat design | Clone is largely shadowless |

These corrections are **load-bearing.** They would have been wrong in any clone built from the 04-15 teardown alone.

## Information Architecture (extracted, confirmed)

```
Workspace
├── /                              (landing)
├── /account                       (workspace-scoped: Settings sub-tabs via ?tab=)
└── /project/<id>                  (THE routing primitive)
    ├── /agents
    ├── /analytics
    ├── /contacts
    ├── /integrations
    ├── /network
    ├── /search/                   (note: trailing slash quirk)
    ├── /sequences
    └── /shortlist
```

API ownership patterns (from endpoint shapes):
- `user → company-dnc, country-dnc, team`
- `profile → eligibility`
- `ats → hired`
- `integrations → eligibility-check, next-page, organization-metadata`
- `sequence → invite`
- `eval → titles`

**No Client primitive.** Phase 4 multi-client extension path: `projects.client_id` nullable column, Client becomes a tag/filter on Project rather than a routing parent. Same pattern Beroz already used for the Projects layer over Requirements.

## Capture coverage gaps — what the walkthrough still has to fill

The crawl captured the **default state of every page**. Estimated **~50-60 critical UI surfaces missing**, mostly:

- **Modals** triggered by buttons (Create Sequence, Filter editor, Criteria editor, Share, Status dropdown, etc.)
- **Drawers** opened on row-click (Candidate Detail with Overview/Experience/Education/Skills tabs + right-side Notes/Sequences/Activity/Projects/Tasks panel — confirmed by the one walkthrough screenshot taken)
- **Populated states** that only render after data exists (Search Results, populated Sequence list, populated Shortlist)
- **Sub-tabs within pages** (Settings → Profile/Team/Billing/Workspace/Notifications — many sub-tab clicks missed during scripted flows because label guesses didn't match)
- **3-dot row menus** (Pin/Star/Edit/Clone/Archive on sequences)
- **Loading, error, empty states** across all pages

The walkthrough fills 90% of this; a follow-up targeted-capture flow handles the long-tail (loading, error, edge cases).

## The capture pipeline as a meta-pattern

This session crystallised a 3-layer pattern for cloning authenticated SaaS apps. Earned concept-note treatment: [[Wiki/concepts/Crawl-Walkthrough-Capture-Pipeline]].

```
Layer 1: Crawl    (automated)  → static structure of every page
Layer 2: Walkthrough  (human)  → why per button + missing-surface inventory
Layer 3: Targeted flows (auto) → specific missing surfaces (modals, populated states)
                                 ↓
                                 spec.md → Claude Code build
```

Layer 1 alone produces "a generic SaaS dashboard" — proven by the 04-15 attempt. Layer 2 fills the *why* dimension. Layer 3 cleans up the long-tail.

## Workflow gates discovered (Niksho-relevant)

**Sequencing is gated behind mailbox connection in Juicebox.** Clicking "Add to Sequence" or "New Sequence" with no connected mailbox shows a mandatory modal with Connect Gmail / Connect Outlook / Connect IMAP / Do this later. The full sequence editor is only reachable post-connection.

For Niksho: the existing Beroz sequence flow already integrates Microsoft Graph for the 10 ExcelTech inboxes — the gate is reversed (we have the connection, they have the gate). For SaaS multi-tenant, we'll need an equivalent gate when a tenant has no mailbox connected. Add this to the Phase 4 build.

## Relevance to Niksho

Direct dependency for [[Efforts/Niksho-SaaS-Product/Overview]] Phase 3 build. Also feeds [[Efforts/ExcelTech-Automation/Overview]] indirectly — the punch list bugs we deferred fixing are the foundation the new clone will be built on top of.

The captured data + IA + walkthrough output (when complete) becomes the spec Claude Code builds against in Phase 3. The current state is: capture pipeline complete, walkthrough kicked off but ~85% remaining. Next session resumes the walkthrough.

The corrections to the design system (Helvetica vs Inter, `#6B2F8D` vs `#7600bc`) propagate into the design tokens layer that gets built before Phase 3. The 102-endpoint API manifest becomes the diff input for backend extension tickets.

## Bug/fix pairs — useful for future sessions

Six bugs hit in sequence during the toolkit build. Each fix taught a lesson worth carrying forward:

| Bug | Fix | Lesson |
|---|---|---|
| Google blocks bundled Chromium on OAuth | `channel: 'chrome'` + persistent profile + `--disable-blink-features=AutomationControlled` | Real Chrome > bundled Chromium for OAuth |
| Stale SingletonLock on dirty exits | Auto-cleanup at script start | Clean profile dirs proactively |
| storageState handoff loses Firebase tokens | Reuse persistent profile in crawl/interact | Don't ferry sessions between contexts |
| `networkidle` never fires on modern SaaS | `domcontentloaded` + 3.5s settle wait | Never use networkidle against realtime apps |
| Sidebar discovery returns 0 routes | doctor() + manual routes.json override | Stop guessing DOM, start inspecting + override |
| Spammed-Enter flows captured nothing | Rewrote flows.json with click/fill actions | Most steps should be script-driven, not user-driven |

## See also

- [[Efforts/Niksho-SaaS-Product/decisions/2026-04-28-pivot-to-pure-clone]] — full ADR with risk register
- [[Efforts/Niksho-SaaS-Product/JUICEBOX-FEATURE-MAP]] — feature map scaffold (canonical, in vault)
- [[Wiki/concepts/Authenticated-SPA-Capture]] — needs update with channel:'chrome' + persistent profile findings
- [[Wiki/concepts/Self-Diagnosing-Crawler]] — new concept extracted from this session
- [[Wiki/concepts/Crawl-Walkthrough-Capture-Pipeline]] — new concept: the 3-layer pattern
- [[Wiki/techniques/Playwright-DOM-Crawling]] — needs update with new toolkit findings
- [[Wiki/digests/Session-Juicebox-Teardown-2026-04-15]] — the earlier teardown this session corrects
- [[Efforts/ExcelTech-Automation/Overview]] — milestone 5b (Beroz Juicebox clone) supersedes the hybrid approach
