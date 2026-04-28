---
type: wiki-digest
generated-by: claude
sources: ["[[Raw/transcripts/YT-Transcripts-2026-04-14]]"]
video: "How AI agents & Claude skills work (Clearly Explained)"
tab: 5
date: 2026-04-14
updated: 2026-04-14
tags: [agents, skills, context-management, progressive-disclosure, workflow]
speaker: Ross Mike
---

# How AI Agents & Claude Skills Actually Work

Source: Tab 5 of [[Raw/transcripts/YT-Transcripts-2026-04-14]]

## Core argument

The models are good now (Opus 4.6, GPT 5.4). Context matters more than model choice. You steer models toward quality or slop through the context you provide. Less is more — save your context window for what's unique to you.

## The context stack (what fills the window)

1. **System prompt** — from the model provider (Anthropic, OpenAI). Always present.
2. **agent.md / claude.md** — added to context at every turn. Expensive. 95% of people don't need this.
3. **Skills** — only title + description in context (~50 tokens). Full content loaded on demand via [[Wiki/concepts/Progressive-Disclosure]]. This is the key insight.
4. **Tools** — read, write, web fetch, etc. Required for execution.
5. **Codebase** — project files become context.
6. **User conversation** — grows with each turn until compaction at ~250K tokens.

## Why 95% don't need agent.md files

The model already knows React, Postgres, etc. from training. Telling it "use React" wastes tokens on every single turn. Exception: proprietary company info or a methodology unique to you that must be referenced in every conversation. Everything else should be a skill.

**The math:** A 944-token agent.md burns 944 tokens every turn. The same content as a skill burns ~53 tokens (name + description) until it's actually needed.

## The right way to build skills (Ross Mike methodology)

Most people: identify workflow → immediately create skill → wonder why it fails.

The right way — [[Wiki/concepts/Recursive-Skill-Building]]:

1. **Identify the workflow.** Know what you want automated.
2. **Walk through it with the agent step-by-step.** Tell it what to do. Correct it when wrong. Let it learn through conversation. This builds the context of a successful execution.
3. **Once you have a successful run, ask the agent to review what it did.**
4. **Tell it to create a skill.md from that review.** Now it has actual context of what success looks like.
5. **Use the skill. It will fail.** That's good.
6. **When it fails:** ask "Why did you fail? What error?" Feed the failure back. "You failed here, fix this." It fixes itself.
7. **Once fixed:** "Update the skill so this doesn't happen again."
8. **Repeat 5-7 until rock solid.** His YouTube report skill took 5 iterations. Now pulls from 8 data sources flawlessly in 10 minutes.

## Why not to download other people's skills

Two reasons: security risk (skills can be attack vectors) and effectiveness (skills work best with your context, your workflow, your successful runs). Building your own = fundamentally more effective. His quote: "mum can we get mcdonalds, we have food at home."

## Scale for productivity, not for cool factor

Most people set up 15 sub-agents and 30 skills without defining their own workflows first. Wrong.

Right progression: start with 1 agent → build skills for that agent → once workflows are solid, add sub-agents for specific domains. He has 5 sub-agents now (marketing, business, personal, etc.), each with purpose and skills earned through iteration.

Quote: "I scaled for productivity, not for what looks cool."

## Templates having a renaissance

Code itself has become context. A solid project template (web app, mobile app) becomes the foundation the agent builds on top of. More valuable than agent.md files or tech stack instructions.

## Relevance to Niksho

This is the methodological backbone for how we should be building all our automation. Direct applications:

1. **Our CLAUDE.md should be minimal** — most of it should be skills, not a massive file loaded every turn. The `mi.md` approach already aligns with this (it's a pointer file), but the actual claude.md content still loads.
2. **The obsidian-ingest skill we're building right now follows this exact methodology** — walk through it together, get a successful run, then codify.
3. **ExcelTech agent skills should be recursively refined** — when a Screener or Outreach agent fails on an edge case, that failure should update the skill, not just get patched in the prompt.
4. **Don't buy/download skills for the SaaS product** — build them from successful runs with real ExcelTech workflows.

## See also

- [[Wiki/concepts/Progressive-Disclosure]] — the core mechanism that makes skills efficient
- [[Wiki/concepts/Recursive-Skill-Building]] — the full methodology extracted as a standalone concept
- [[Wiki/concepts/Context-Window-Management]] — the broader principle behind "less is more" with tokens
- [[Wiki/concepts/Scale-for-Productivity]] — the 1-agent → sub-agents progression
- [[Wiki/concepts/Expert-In-The-Loop]] — related: the human role in the agent loop
- [[Wiki/concepts/File-Over-AI-Portable-Identity]] — why mi.md > claude.md
- [[Wiki/digests/YT-Strategic-AI-Coding-2026-04-14]] — complementary: the coding discipline side
- [[Wiki/digests/YT-Top-10-Claude-Skills-Plugins-2026-04-14]] — tools that support this workflow (especially Skill Creator for measuring skill performance)
- [[Atlas/Concepts/File-over-AI]] — our existing principle that aligns with this
