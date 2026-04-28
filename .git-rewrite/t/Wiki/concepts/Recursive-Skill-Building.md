---
type: wiki-concept
generated-by: claude
sources: ["[[Raw/transcripts/YT-Transcripts-2026-04-14]]"]
updated: 2026-04-14
tags: [skills, agent-workflow, iteration, methodology]
---

# Recursive Skill Building

## What it is

A methodology for creating robust AI skills through iterative refinement rather than one-shot creation. Instead of writing a skill from scratch and hoping it works, you walk through the workflow with the agent conversationally, achieve a successful run, then codify it — and continue improving the skill each time it fails.

## The loop

```
1. Identify the workflow you want to automate
2. Walk through it step-by-step WITH the agent
   - Tell it what to do at each step
   - Correct it when wrong
   - Build the context of a successful execution
3. Once successful → ask agent to review what it did
4. Tell agent: "Create a skill.md from what you just did"
5. Use the skill in production → it WILL fail (that's good)
6. When it fails:
   a. Ask: "Why did you fail? What error?"
   b. Agent explains the failure descriptively
   c. Feed the failure back: "You failed here. Fix this."
   d. Agent fixes itself
7. Once fixed → "Update the skill so this doesn't happen again"
8. Repeat steps 5-7 until rock solid
```

## Why this works

LLMs are token predictors, not thinkers. They mimic patterns, so they need examples of successful execution to mimic — not just instructions about what success looks like. A skill built from a real successful run contains the actual patterns of correct behaviour. A skill written speculatively contains your guess about what the agent needs, which is usually incomplete.

Ross Mike's YouTube report skill took 5 iterations of this loop. Now it pulls from 8 data sources flawlessly in 10 minutes.

## Why downloading pre-made skills fails

Pre-made skills lack your context, your workflow, your definition of "correct." They're also a security risk — a skill.md file can contain instructions that exfiltrate data. The agent needs the context of YOUR successful run, not someone else's.

## The anti-pattern

```
Identify workflow → Immediately write skill.md → Wonder why it fails → Give up or blame the AI
```

This is like handing a new employee a procedure manual on day one without ever showing them what a good outcome looks like. They'll follow the steps mechanically and miss every edge case.

## Current application at Niksho

We are using this exact methodology right now to build the `obsidian-ingest` skill. Walk through the ingestion step-by-step, correct the process in real time, achieve a successful run, then codify.

Same methodology should be applied to:
- ExcelTech Screener agent — when it scores a candidate wrong, feed the failure back and update the screening skill
- Outreach agent voice tuning — walk through drafting emails with each recruiter, get it right, then codify per-recruiter voice skills
- Any new agent in the v2 architecture (JD Parser, Reactivation) — build the skill from a successful run, not from the architecture doc alone

## Related

- [[Wiki/concepts/Progressive-Disclosure]] — why skills are the right container (not agent.md)
- [[Wiki/concepts/Expert-In-The-Loop]] — the human role during the walk-through phase
- [[Wiki/digests/YT-Agents-Skills-Clearly-Explained-2026-04-14]] — full source
- [[Wiki/digests/YT-Top-10-Claude-Skills-Plugins-2026-04-14]] — Skill Creator skill for measuring performance
