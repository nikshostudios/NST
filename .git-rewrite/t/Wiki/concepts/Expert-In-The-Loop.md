---
type: wiki-concept
generated-by: claude
sources: ["[[Raw/transcripts/YT-Transcripts-2026-04-14]]"]
updated: 2026-04-14
tags: [agent-design, human-oversight, quality, production]
---

# Expert In The Loop

## What it is

A distinction between "human in the loop" (any person clicking approve) and "expert in the loop" (a domain expert who can actually evaluate the AI's output quality). The difference is critical for production systems — a non-expert approving AI output gives a false sense of safety.

## The distinction

**Human in the loop:** A founder who doesn't know React clicks "merge" on AI-generated code. A recruiter who's never written outreach emails clicks "send" on an AI draft without reading it. The human is present but not evaluating.

**Expert in the loop:** A senior developer reviews AI code for N+1 queries, missing auth checks, and architectural debt. A recruiter with 5 years of candidate communication experience reads the outreach draft and adjusts the tone for this specific industry. The expert is evaluating based on hard-won domain knowledge.

## Why it matters

AI produces output that looks right. It passes surface-level inspection. The gap between "looks right" and "is right" can only be caught by someone who knows what "right" actually means in context. LLMs are trained on internet data — they produce average output by default. Expert oversight is what lifts it from average to correct-for-this-situation.

## Application at Niksho

This principle is already embedded in the ExcelTech design:

- **Outreach agent:** drafts emails, but the recruiter reviews and sends. The recruiter IS the expert — they know the candidate market, the industry tone, the relationship history.
- **Screener agent:** scores candidates, but the recruiter reviews the shortlist. The recruiter knows which skills are truly mandatory vs nice-to-have for this specific client.
- **Follow-up agent:** extracts intent from replies, but edge cases (sarcasm, ambiguous "maybe") need recruiter judgment.
- **TL approval:** Raja reviews formatted submissions before they go to clients. He's the expert on what each client actually wants.

The risk is that as the system gets better, the expert starts rubber-stamping — approving output on autopilot without actually reading or evaluating it, because "it's been right the last 50 times." Guard against this — see [[Efforts/ExcelTech-Automation/Overview]] open risk on recruiter trust erosion.

## Related

- [[Wiki/concepts/Recursive-Skill-Building]] — expert feedback during the walk-through phase is what makes skills good
- [[Wiki/digests/YT-Senior-Dev-Reviews-AI-App-2026-04-14]] — the source video that introduced this framing
- [[Efforts/ExcelTech-Automation/Overview]] — where this principle is operationalised
