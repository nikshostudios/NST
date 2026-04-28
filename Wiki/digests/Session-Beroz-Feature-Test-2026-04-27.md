---
type: wiki-digest
generated-by: claude
sources:
  - "[[Raw/docs/Beroz-Feature-Test-Log-2026-04-27]]"
date: 2026-04-27
updated: 2026-04-28
tags: [beroz, exceltech, testing, ux, bugs, sequences, requirements, searches]
---

# Digest — Beroz 27 April 2026 (Feature Test Walkthrough)

## Core argument

A systematic feature test of the post-21-commit main branch covered 18 features across Requirements, Searches, Sequences, Settings, and Email Loop (Tier 3 deferred). Most features work. The most structurally significant finding is that all three Searches tabs (Find Similar, Job Description, Select Manually) are the same component with different labels — a fundamental UX problem, not a cosmetic one. A punch list of 15 items was compiled, prioritised by impact.

---

## Test coverage and status summary

```
REQUIREMENTS (5 features)
  [1] Row menu (…)            ☑ works with feedback  — pin icon missing
  [2] 4 new intake fields     ☑ works as-is
  [3] JD diagnostics modal    ☑ BROKEN               — score + red_flags invisible
  [4] Generate LinkedIn posts ☑ works with feedback  — slow + reads as AI
  [5] Boolean copy buttons    ☑ works as-is

SEARCHES (4 features)
  [6] Find Similar (NL)       ☑ works with feedback  — 3/4 fields parsed; excluded cos. missing
  [7] Job Description tab     ☑ works with feedback  — UI issues (see below)
  [8] Select Manually         ☑ works as-is
  [9] My Saved Searches       ☑ works with feedback  — naming/credit transparency

SEQUENCES (8 features)
  [10] Overview stat cards    ☑ works as-is
  [11] Schedule chart         ☑ works as-is
  [12] Row menu (…)           ☑ works with feedback  — clips below viewport
  [13] Pin & Star icons       ☑ SKIPPED              — blocked by [12]
  [14] Sequence detail        ☑ works as-is
  [15] Preview & test email   ☑ works as-is
  [16] Signature dropdown     ☑ not fully tested     — needs signatures first
  [17] Unsubscribe checkbox   ☑ not fully tested     — Tier 3

SETTINGS (1 feature)
  [18] Email signatures       ☑ works with feedback  — 2 bugs (raw error + cursor)

EMAIL LOOP (6 features, Tier 3)
  [19–24]                     ☑ DEFERRED
```

---

## Key findings

### 1. All three Searches tabs are the same component

Find Similar, Job Description, and Select Manually share the same text input, the same interpreted-filters panel, and the same results state. Switching between tabs shows the same query and results on both. This is structurally broken — they should behave differently:

- **Find Similar**: takes a candidate profile description or NL text; returns similar people
- **Job Description**: takes a raw JD; parses it into structured filters then searches
- **Select Manually**: takes explicit filter inputs (not NL); structured form

All three currently do the same NL → filter → Apollo search. Separate components are needed.

### 2. Source Now passes a bare 5-word summary, not the requirement

When a recruiter clicks "Source Now" on a requirement, the system sends only a minimal NL summary ("Network Engineer Python in Bangalore") to the Searches tab — discarding the full JD, certifications, industry experience, excluded companies, and remote policy. This produces a JD score of 2/10 on a requirement that has a rich JD attached. Source Now should pass `requirement.job_description` and the structured intake fields directly.

### 3. JD diagnostics are invisible in the Requirements modal

`jd_quality_score` and `red_flags` work correctly in the Searches → Job Description tab (8/10 score, 2 red-flag warnings rendered for the Mumbai DevOps JD). But after saving a JD in the Requirements modal, neither field is displayed anywhere. The diagnostics either don't run on save or run but have no UI surface. Effectively broken from the recruiter's perspective.

### 4. Candidate pool is conspicuously small

"Software Engineer + Bangalore" with no other filters returned 30 candidates, all scoring 77–95%. High scores rule out threshold filtering. The Apollo API page-size is likely set too low (~25–50). At 30 results for the broadest possible query, recruiters experience a feeling of scarcity that undermines trust in the platform. Proposed fix: raise page-size to 100–200 and show the full raw pool with visible match % — let recruiters set their own threshold rather than hiding results below 60%.

### 5. Saved Searches saves queries, not results

Each "Re-run" is a fresh Apollo API call. Results vary slightly between runs. The product implies persistent results but delivers a repeat-search shortcut. This is a credit transparency issue: reopening a saved search and clicking Re-run spends Apollo credits each time, with no warning.

---

## Punch list (priority order)

| # | Category | Item |
|---|---|---|
| 1 | Bug | Requirements pin icon missing — row looks identical pinned vs unpinned |
| 2 | Bug | JD diagnostics not shown in Requirements modal |
| 3 | UX | LinkedIn posts loading estimate wrong (5-10s shown, ~30s actual) |
| 4 | Quality | LinkedIn post copy reads as AI — tighten `job_seller.md` prompt |
| 5 | Bug | Source Now passes 5-word summary instead of full requirement + JD |
| 6 | Bug | Find Similar / Job Description / Select Manually tabs are identical component |
| 7 | Bug | Excluded companies field not shown in interpreted filters |
| 8 | Product | Apollo page-size too small; show full raw pool with match % column |
| 9 | Feature | Saved Searches: persist candidate list, not just query |
| 10 | Bug | Sequence row menu clips below viewport (drop-up needed) |
| 11 | UX | Sequence auto-naming: "New Sequence - MM/DD/YYYY" unusable; derive from requirement |
| 12 | Bug | Signatures: raw Postgres error (23505) shown to user |
| 13 | Bug | Add Contacts: no per-row checkbox to exclude individual recipients |
| 14 | Bug | Add Contacts: "sending now" misleading when send time is scheduled |
| 15 | Bug | Signatures: Save button cursor reverts to arrow during loading |

---

## Features confirmed clean (no action needed)

All 3 boolean copy buttons (Copy Boolean, Copy X-ray, Copy GitHub) produce well-formed outputs. The Schedule chart redraws correctly on period change. Sequence detail stat cards render. Preview & test email sends with `[TEST EMAIL]` prefix. Signature default-switching enforces uniqueness constraint correctly. The two-line empty state in Find Similar ("Scanned 24 candidates…") is a good UX improvement over a single line.

---

## Email loop (Tier 3) — deferred

Features [19–24] (test send, open/click tracking, unsubscribe flow, bounce handling, intent classification) require enrolling `nikshostudios@gmail.com` in a live sequence and waiting for `sequence_tick`. Deferred until inbox access is available.

---

## Relevance to Niksho

This test session is the pre-release quality gate for the [[Efforts/ExcelTech-Automation/Overview]] ExcelTech product. The punch list drives the next sprint. Items 5, 6, and 8 are the most damaging to recruiter trust and should be prioritised before any external demo. Item 9 (save candidate results, not just queries) is a product differentiation decision — it changes the mental model of what "Saved Searches" means and has DB implications.

---

## See also
- [[Wiki/digests/Session-Beroz-Harvestapi-Haiku-2026-04-26]] — previous day's session
- [[Wiki/digests/Session-Beroz-Sequences-DB-Cleanup-2026-04-19]] — Sequences feature architecture
- [[Raw/docs/Beroz-Feature-Test-Log-2026-04-27]]
- [[Efforts/ExcelTech-Automation/Overview]]
