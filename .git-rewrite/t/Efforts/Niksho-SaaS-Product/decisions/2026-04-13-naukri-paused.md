---
type: decision
date: 2026-04-13
effort: Niksho-SaaS-Product
owners: Nikhil & Shoham
status: decided
generated-by: claude-opus-4-6
---

# Decision — Pause Naukri Integration

## Context

Naukri (Resdex) is India's #1 job board with 80M+ resumes. Code exists in `sourcing.py` (`source_naukri_with_cookie()`). However, ExcelTech does not have an active Naukri/Resdex subscription.

## Decision

**Paused.** Don't activate Naukri for MVP. Code stays in the codebase but is dormant.

## Why

Can't use what we can't access. The code is written and tested — activation is straightforward once credentials exist.

## Future plan

Naukri becomes a SaaS selling point: "Connect your Naukri account and we'll auto-source from India's #1 resume database." Each tenant brings their own Naukri credentials via the onboarding flow. Part of the channel marketplace.

## Reversibility

- [x] Easy to reverse (< 1 day)

Set the `NAUKRI_SESSION_COOKIE` env var and the code activates.

## How we'll know if this was wrong

If ExcelTech is consistently failing to find enough India candidates through Foundit + Apollo alone and the sourcing pipeline is the bottleneck.

## Linked notes

- Effort: [[Efforts/Niksho-SaaS-Product/Overview]]
- Atlas: [[Atlas/Product/Sourcing-Channels]]

---
*Template: [[Templates/Decision]] · Home: [[Home]]*
