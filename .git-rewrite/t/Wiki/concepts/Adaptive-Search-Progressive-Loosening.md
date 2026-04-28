---
type: wiki-concept
generated-by: claude
sources:
  - "[[Raw/docs/Beroz-Session-2026-04-25]]"
updated: 2026-04-28
tags: [search, apollo, pipeline, ux, query-design]
---

# Adaptive Search: Progressive Loosening

## What it is

A query strategy where the system automatically walks a ranked sequence of filter relaxations until the result pool reaches a usable minimum size. Instead of failing silently on an empty result set, it broadens the query step by step and surfaces which loosening step succeeded.

The Apollo implementation (`source_apollo_structured_adaptive`) runs five progressive loosenings:

```
Step 0: original query (all filters)
          │ total_entries ≥ 50? → proceed
          │ No
Step 1: drop q_keywords
          │ total_entries ≥ 50? → proceed
          │ No
Step 2: drop person_seniorities
          │ total_entries ≥ 50? → proceed
          │ No
Step 3: trim person_titles to 1 (most generic)
          │ total_entries ≥ 50? → proceed
          │ No
Step 4: drop person_titles entirely
          │ return whatever we have + iteration_log
```

The function stops at the first step that clears the threshold. The `iteration_log` (how many steps it took, what was dropped) is returned alongside the candidates and surfaced in the SSE `agent_done` payload so the recruiter knows how specific the final query actually was.

## Why it matters

Keyword over-matching is a silent failure mode in structured search APIs. In Apollo, including `q_keywords` alongside `person_titles` can collapse a pool of 15,751 candidates to **zero** — with no error, just an empty response. Without progressive loosening:
- The recruiter sees "no candidates found" and assumes no one matches
- In reality, thousands of candidates match — they're being filtered out by an over-specified query
- The only fix is manual trial-and-error, which requires understanding the API's AND-match semantics

Progressive loosening makes the system self-correcting: it narrows when it can, widens when it must, and reports the outcome transparently.

## Design considerations

**Ordering matters.** The loosening sequence should remove the least informative filters first — keywords (free text, prone to AND-match collapse) before seniority (broad but intentional) before titles (core of the query). Never loosen what you absolutely need first.

**Threshold calibration.** The `min_total` default of 50 is conservative for Apollo's India pool (which can reach 15,000+). For smaller markets or niche roles, a lower threshold (e.g. 20) may be appropriate to avoid over-loosening.

**Transparency.** The iteration log is as important as the results. A recruiter who gets 30 candidates from a fully-loosened query (Step 4: no titles) should know that — the candidates might be too broad. A recruiter who gets 30 from Step 0 (original query intact) knows those 30 are highly specific.

## Generalisation

This pattern applies to any search API where:
1. The API uses AND-match logic that can zero out results
2. There's a meaningful hierarchy of filter specificity
3. The product should not silently fail on empty results

Examples: LinkedIn Recruiter filters, Apollo organisation search, internal DB skill-tag matching, Elasticsearch with strict term filters.

## Related
- [[Wiki/concepts/Apollo-Pre-Reveal-Quality-Signals]] — companion pattern on the enrichment side
- [[Wiki/concepts/Candidate-Sourcing-Channels]] — sourcing channel context
- [[Wiki/digests/Session-Beroz-Apollo-MultiSource-2026-04-25]] — where this was built and documented
- [[Raw/docs/Beroz-Session-2026-04-25]]
- [[Efforts/ExcelTech-Automation/Overview]]
