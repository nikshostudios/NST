---
type: wiki-concept
generated-by: claude
sources: ["[[Raw/docs/Beroz-Session-2026-04-17]]"]
updated: 2026-04-17
tags: [ui, search, ux, patterns, saas, intent-capture]
---

# Search-First Hero with Mode Chips

## What it is

A homepage pattern where the primary call to action is a large natural-language search input, framed by a greeting ("Hey \<firstName\>, who are you looking for?"), orbited by a small strip of **mode chips** that let the user declare *intent* ("Find Similar" / "Job Description" / "Boolean" / "Select Manually"), and seeded with 5 clickable example queries that populate the input on tap. When a query is submitted, the hero **collapses into a compact header** and results render below.

Crucial implementation detail from Beroz's version: the mode chips change only the **placeholder text**. The backend call is identical across modes. The chips are UX scaffolding — they tell the user "this input accepts any of these shapes" — not a router to different endpoints. That keeps the backend surface simple while giving the user permission to paste a long JD, a boolean string, or a plain-English description without wondering which will work.

Visual anatomy:

```
"Hey Raju, who are you looking for?"

[Find Similar] [Job Description] [Boolean] [Select Manually]   ← chips (placeholder toggle only)
┌─────────────────────────────────────────┐
│ Paste a job description...          [▶] │   ← purple glow + circular send
└─────────────────────────────────────────┘

Example queries:
  • Senior SWE · Bangalore · 8y+
  • DevOps leads in Singapore
  • ...
```

## Why it matters

**Intent-capture beats feature-menu on a blank canvas.** When the user lands on a tool and doesn't know what to type, a grid of buttons ("Search candidates", "Run sourcing job", "Open shortlist") forces them to decode your product's taxonomy. A single input + mode chips + example queries does the opposite — it demonstrates the expected shapes and lets the user start from the closest match. The examples double as onboarding: new users click one and immediately see what good input looks like.

**Mode chips without mode routing is a good compromise.** Routing each mode to a different endpoint doubles your backend surface and forces users to pick the "right" one. Toggling placeholder text costs nothing, works for any LLM-backed search, and preserves the option to route later without breaking the UI contract.

**Collapsing the hero after first submit keeps the workspace honest.** Big hero = invitation. After the user has committed, the screen is about results, not about re-marketing the input. The collapsed header still shows the query and mode so the user knows what they're looking at.

**The greeting is cheap personalization that works.** First-name + a question grammatically forces the user into answer mode. It is the UI equivalent of a sales rep asking "what brings you in?" rather than handing you a binder.

## When the pattern fits

- The primary user action is a search or query, not a list-view or a form.
- The input accepts **multiple shapes** (natural language, JD text, boolean string, structured criteria) that are functionally equivalent to the backend.
- You have a population of example queries that are meaningful without context.
- The user will do many searches per session (collapse-on-submit pays back).

## When it doesn't fit

- Dashboard-first workflows where the user wants to see current state, not run a query.
- Tools where each "mode" genuinely needs different validation or a different endpoint — chip-as-placeholder-toggle becomes misleading.
- Workflows with stateful selection (e.g. multi-step wizards) — the hero is for kicking off a fresh query, not for returning to one.

## Relevance to Niksho

This is Beroz's first real application of [[Wiki/concepts/Search-First-SaaS-UI]] in a post-Juicebox-teardown form. The Juicebox reference ([[Wiki/digests/Session-Juicebox-Teardown-2026-04-15]]) validated the search-first approach; this session made it Niksho's. The pattern is now the default for any "start a thing" surface in Beroz and the [[Efforts/Niksho-SaaS-Product/Overview|Niksho SaaS Product]].

Open Niksho-specific follow-ups:

- **The post-query layout is not done.** The hero collapses, but the results page is placeholder. Second competitor screenshot pending from Nikhil before finalising the layout.
- **The mode chips are cosmetic by design (for now).** If we later decide Boolean mode should hit a different ranking, we can do it without breaking the URL or the state machine — the chips are already tracked.
- **The 5 example queries should be per-recruiter eventually.** First draft is hardcoded; personalising them from each recruiter's history is a low-effort, high-delight follow-up.

## Related

- [[Wiki/concepts/Search-First-SaaS-UI]] — the parent pattern (NL search as primary interface)
- [[Wiki/digests/Session-Juicebox-Teardown-2026-04-15]] — where the pattern came from
- [[Wiki/digests/Session-Beroz-Projects-Layer-2026-04-17]] — the ship that introduced the hero
- [[Wiki/concepts/Projects-as-Scoping-Primitive]] — the Searches surface sits inside the scoping boundary
- [[Efforts/Niksho-SaaS-Product/Overview]]
- [[Atlas/Product/Architecture]]
