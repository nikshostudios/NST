---
type: wiki-digest
generated-by: claude
sources: ["[[Raw/transcripts/YT-Transcripts-2026-04-14]]"]
video: "Senior Developer Reviews My AI Built App (Brutally Honest)"
tab: 2
date: 2026-04-14
updated: 2026-04-14
tags: [code-review, ai-apps, production-readiness, expert-in-the-loop]
---

# Senior Dev Reviews an AI-Built App

Source: Tab 2 of [[Raw/transcripts/YT-Transcripts-2026-04-14]]

## Core argument

AI can build functional apps fast (core features in 3 days, full app in 7), but "functional" is not "production-ready." The gap is security, performance, testing, and architectural coherence — and that gap requires an expert in the loop, not just a human in the loop.

## The app reviewed: Combo

An interview chatbot built in 7 days using Claude Code. Features: text chat, voice interview (11 Labs), interview creation, link sharing, response collection and summarisation. Maps non-linear conversation responses back to original questions. Impressive velocity, concerning depth.

## What the senior dev found

**Security gaps.** Exposed API keys, unaudited npm dependencies with known vulnerabilities, no data governance consideration for third-party services (11 Labs, Supabase).

**Performance / cost issues.** Full UI library imports instead of tree-shaken imports → bloated bundle size → bandwidth costs. Supabase token usage gets expensive at scale. 11 Labs voice API costs compound quickly with users.

**Zero tests.** No unit tests, no integration tests. Any new feature can silently break existing ones. This is the single biggest risk for ongoing development.

**UX inconsistencies.** Missing loading states, inconsistent patterns across views, no error boundaries.

**SaaS cost model shift.** Software used to approach zero marginal cost. AI-powered apps are expensive to run because every interaction burns API tokens. This fundamentally changes the economics.

## Key insight: "Expert in the loop" vs "human in the loop"

A non-technical founder clicking "approve" on AI code is human-in-the-loop. It's not the same as an experienced developer who can spot an N+1 query, a missing auth check, or an architectural decision that will haunt you at scale. The distinction matters — especially for [[Efforts/ExcelTech-Automation/Overview]] where the "expert" is the recruiter who understands nuances of candidate communication, not just a human clicking send.

## When AI-first works vs fails

**Works:** Early adopters, MVP phase, single creator or small team, continuous iteration with expert oversight.

**Fails:** Enterprise with shared codebases, scaling without architecture review, no expert validation of decisions.

## Relevance to Niksho

This is a direct mirror of our situation. The ExcelTech Railway app was built fast. The v2 architecture ([[Raw/docs/ExcelTech-Recruitment-Agent-Architecture-v2.html]]) needs the same senior-dev scrutiny: security audit of API key handling, testing strategy for the agent pipeline, cost modelling for Claude API + enrichment API calls at scale. The "expert in the loop" framing validates our design choice that recruiters approve every outreach before it sends.

## See also

- [[Wiki/concepts/Expert-In-The-Loop]] — the standalone concept
- [[Wiki/digests/YT-Strategic-AI-Coding-2026-04-14]] — complementary: how to review AI code properly
- [[Efforts/ExcelTech-Automation/Overview]] — open risk: recruiter trust erosion
