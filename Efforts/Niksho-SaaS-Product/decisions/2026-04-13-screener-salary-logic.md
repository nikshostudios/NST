---
type: decision
date: 2026-04-13
effort: Niksho-SaaS-Product
owners: Nikhil & Shoham
status: decided
generated-by: claude-opus-4-6
---

# Decision — Screener Salary Logic (Client Budget Primary)

## Context

The Screener Agent scores candidates on multiple dimensions including salary fit. The old logic could penalize a candidate for asking above the market average, even if the candidate's ask was within the client's stated budget. This created false negatives — good candidates scored low because of salary "market mismatch" even though the client could afford them.

## Decision

**Client budget is the primary ceiling. Market data is informational only.**

Rules:
1. If client gave a budget and the candidate's expected salary is within it → **no penalty, ever**, regardless of what the market average says
2. If candidate exceeds client budget → penalty scales: 5-10% over = minor flag, 10-20% = moderate, 20%+ = major
3. If no client budget → use Adzuna market data as an **informational flag only**, never as a scoring penalty

## Why

Nikhil: "If my client says they'll pay 25 LPA and the candidate wants 24 LPA, I don't care that the market average is 18 LPA. The client can afford it. Don't make me miss a placement because of a market benchmark."

## Reversibility

- [x] Easy to reverse (< 1 day)

It's a scoring formula in the Screener Agent prompt. Change the rules, change the scores.

## How we'll know if this was wrong

If clients consistently reject candidates as "too expensive" when the Screener scored them as salary-fit, the budget threshold logic needs tightening. Track: rejection reason = "salary" for candidates the Screener approved.

## Linked notes

- Effort: [[Efforts/Niksho-SaaS-Product/Overview]]
- Atlas: [[Atlas/Product/Agents]]

---
*Template: [[Templates/Decision]] · Home: [[Home]]*
