---
type: decision
effort: Niksho-SaaS-Product
date: 2026-04-28
status: accepted
generated-by: claude-opus-4-7
decision-makers: Nikhil (this session), pending Shoham confirmation
supersedes:
  - "[[Wiki/digests/Session-Juicebox-Teardown-2026-04-15]]" (the hybrid-not-clone decision in Phase 6)
related:
  - "[[Efforts/ExcelTech-Automation/Overview]]"
  - "[[Efforts/Niksho-SaaS-Product/Overview]]"
  - "[[Wiki/digests/Session-Beroz-Feature-Test-2026-04-27]]"
  - "[[Atlas/Business-Model/Steal-Their-Strategy]]"
  - "[[Atlas/Product/Technical-Architecture-Stolen]]"
---

# Decision: Pivot from hybrid clone to pure clone, then differentiate

## Context

On 2026-04-15 the team decided **not** to do a pure Juicebox clone. The reasoning was that a pure clone would produce a Juicebox lookalike that didn't reflect Niksho's actual product (multi-agent recruitment automation, agency-native workflow, India/SG sources). The chosen path was a hybrid: take Juicebox's UI patterns (search-first interface, candidate cards, sidebar navigation) and combine with Niksho-specific features.

That hybrid approach shipped as Beroz over April 15–26: 10 pages wired to ExcelTech backend, Projects layer, sidebar 3-zone restructure, Search hero with mode chips, Submit-to-TL gate, Sequences redesign with the engagement-tracking trifecta, 7-channel sourcing.

The 2026-04-27 feature test surfaced 15 punch-list items. Three are demo-blockers and they share a structural cause: **the hybrid mixed Juicebox patterns with improvised behaviour before either side was understood deeply enough.** Examples:

- Source Now passes a 5-word summary to the Searches tab instead of the full requirement + JD. The Juicebox equivalent passes structured search intent. We hybridised before understanding the contract.
- Find Similar / Job Description / Select Manually are the same component with three labels. Juicebox treats them as three distinct surfaces. We took the visual pattern without the workflow logic.
- Apollo page-size is too small (30 results for "Software Engineer + Bangalore"). Juicebox shows a deep raw pool with visible match %; the recruiter sets the threshold. We assumed a different mental model and undermined the trust the search bar is supposed to build.

Each of these is a workflow-comprehension failure, not a design failure. The hybrid strategy assumed we could mix-and-match without understanding why Juicebox built each piece the way it did. We could not.

## Decision

**Rebuild the Beroz frontend as a 1:1 Juicebox clone first. Layer Niksho-proprietary features on top only after the clone is verified end-to-end.**

This reverses the 2026-04-15 hybrid call. The reversal is justified because:

1. The hybrid produced a punch list of 15 items, three of them demo-blockers, all rooted in workflow misunderstanding.
2. A pure clone forces us to understand every Juicebox screen and *why* before we customise. That comprehension is the bottleneck on every clone attempt to date.
3. Once the clone is verified, the Niksho moat (multi-client / TL-recruiter dual-role / branded client submissions / India-SG sources / WhatsApp outreach / per-requirement pricing) layers on top of a foundation that actually works, instead of being mixed in halfway.

## Scope of "dismantle"

**Dismantle = frontend rebuild only.** The backend, agents, and data layer all stay.

| Component | Action |
|---|---|
| Beroz frontend (`frontend-exceltech/index.html`) | **Rebuild from scratch** as a Juicebox clone in `/Brand New Website/beroz/clone/`. Existing Beroz keeps running for ExcelTech in parallel until the clone is verified. |
| Beroz backend (FastAPI / Flask routes) | **Keep entirely.** Production-stable, 14k submissions through it, no rewrites. |
| `/ai-agents/` layer + 5 agents + 5 skills | **Keep entirely.** mi.md rule. |
| Supabase schema | **Keep entirely.** Add columns later only if a Juicebox feature requires it. |
| 7-channel sourcing pipeline | **Keep entirely.** This is unique to Niksho already. |
| Sequences engagement trifecta (pixel + click + bounce + AI intent) | **Keep entirely.** Verify section 5 of the 04-26 handoff doc independently. |
| Submissions dual-role workflow spec | **Defer until after clone is verified.** Becomes the first Niksho-proprietary feature layered on top in Phase 4. |

## Execution plan

Five phases. Each gates the next. No phase starts until the previous is verified.

### Phase 0 — Confirm and snapshot (today, 30 min)

This ADR. The strategy reversal is logged. Future sessions read this and don't try to extend the hybrid plan.

### Phase 1 — Capture (1–2 days)

Run the three-script Playwright system specced in chat at the top of the 2026-04-28 session (`crawl.ts`, `interact.ts`, `analyze.ts`). Output saved to `/Brand New Website/beroz/clone/captures/`:
- Full DOM, screenshots, computed styles for every page at mobile / tablet / desktop
- Interaction state captures (hover / focus / active / disabled / loading / empty / error)
- Playwright traces for the signup, create-project, run-search, build-sequence, submit-to-client flows
- Optional: axe-core accessibility output

The 04-15 crawl already captured 43 pages. We extend that to cover the missing surfaces (search results, candidate detail, agent chat, analytics sub-tabs, every modal, every state).

### Phase 2 — Spec (1–2 days, mostly synthesis)

Produce `JUICEBOX-FEATURE-MAP.md` in the clone folder. Cross-link to vault. Structure:

- One section per page (Sidebar / Search / Project Overview / Shortlist / Sequences / Contacts / Analytics / Integrations / Settings / Agent Chat / etc.)
- Per page: route, layout dimensions, every button + behaviour, every state, every modal, every API call, success/failure states
- Per flow: signup, create project, run search, build sequence, send to client, approve candidate — step-by-step screens, state transitions, side effects, data shape
- Component inventory (CandidateCard, MatchScoreBadge, FilterPill, SidebarNavItem, etc.) with observed variants
- Design tokens (colour palette, typography, spacing, transitions, shadows) — already 80% captured in the 04-15 teardown
- Embedded screenshots as ground truth

The *why* in this doc cannot come from the crawler alone. It comes from a live walkthrough (Nikhil + Claude with computer use enabled) or from Nikhil's Loom narration. Without that, the .md describes only the *what* and the clone falls into the same trap as the hybrid.

### Phase 3 — Build (handed to Claude Code, several days)

Claude Code implements page by page against `JUICEBOX-FEATURE-MAP.md`. Wired to existing Beroz backend. New folder under `/Brand New Website/beroz/clone/`. Each PR references the .md section it implements. Verification gate before each merge: every button does something, every state renders, every flow completes.

No Niksho-proprietary feature ships in this phase. The clone is the foundation, nothing more.

### Phase 4 — Niksho proprietary layer (after clone is verified)

Layered on top of the working clone:
- Submissions dual-role workflow ([[Efforts/Niksho-SaaS-Product/Submissions-Page-Spec]])
- Performance tab (rename from Analytics) + per-recruiter graphs
- Global pipeline funnel (Sourced → Shortlisted → Submitted → Approved → Placed)
- Branded client submissions
- WhatsApp outreach (India/SG)
- India/SG source surfaces (Foundit, MCF, Naukri once subscriptions land)
- Per-requirement pricing surfaces

This is the moat. Built on a foundation that actually works.

## Success criteria for the clone (Phase 3 exit)

1. Every Juicebox page in `JUICEBOX-FEATURE-MAP.md` has a functional equivalent in the clone.
2. Every flow in the .md (signup through send-to-client) completes end-to-end with no console errors.
3. Pixel-level visual diff against Juicebox screenshots is within agreed tolerance per page.
4. Every backend API call the clone makes is wired to the existing Beroz/ExcelTech backend.
5. The 04-27 punch list is closed (because the new clone replaces the surfaces those bugs lived in).

## What we're betting on

That the bottleneck on building Niksho is workflow comprehension, not capacity. The hybrid failed because we tried to differentiate before we understood. The clone-then-differentiate sequence forces understanding first, which is the cheaper order even though it looks slower from outside.

## What could make this wrong

- **If Juicebox's data layer (800M profiles) is what makes their UI feel right, our clone on top of Apollo + 7-channel will feel hollow.** Mitigation: keep the 7-channel sourcing pipeline; the clone surfaces it differently than Juicebox does, but the underlying data depth is comparable for India/SG roles.
- **If the team finds Juicebox's UX actually wrong for an agency workflow on first contact, cloning it wholesale is a step backward.** Mitigation: that's exactly what Phase 4 is for. Phase 3 is "make the clone work like Juicebox." Phase 4 is "now make it work for an agency, with full understanding of what we're changing and why."
- **If Phase 3 takes longer than 2 weeks, it eats into Q2 momentum.** Mitigation: hard gate at end of week 1 — if fewer than 3 pages are functionally complete, reassess the strategy rather than push through.

## Status

Decision logged 2026-04-28 by Claude based on Nikhil's session input. Pending Shoham confirmation before Phase 1 work begins. Will be cross-linked from [[Efforts/Niksho-SaaS-Product/Overview]] and [[Wiki/hot]] once confirmed.
