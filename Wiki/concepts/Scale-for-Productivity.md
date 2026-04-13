---
type: wiki-concept
generated-by: claude
sources: ["[[Raw/transcripts/YT-Transcripts-2026-04-14]]"]
updated: 2026-04-14
tags: [agent-architecture, workflow, scaling, methodology]
---

# Scale for Productivity, Not for Cool

## What it is

A principle for building agent systems: start with one agent, build it up with real skills from real workflows, and only add sub-agents when a specific domain's workload justifies it. The opposite of the common pattern where people set up 15 sub-agents and 30 skills on day one because it looks impressive, then wonder why nothing works.

## The progression

```
1. Start with ONE agent that does everything
2. Build skills for that agent through real workflow iteration
   (see [[Wiki/concepts/Recursive-Skill-Building]])
3. Once you have well-defined workflows with proven skills →
   split off a sub-agent for a specific domain
4. Each sub-agent inherits the skills relevant to its domain
5. The main agent becomes an orchestrator
```

Ross Mike's example: started with 1 agent managing sponsors, spreadsheets, emails. After building skills through iteration, split into 5 sub-agents: marketing, business, personal, etc. Each one has earned its place through proven workflows — not created for show.

## Why premature scaling fails

Same reason hiring 10 employees before you've defined your own workflows fails. If you haven't done the work yourself (or walked through it with a single agent), you don't know what "right" looks like. Sub-agents without skills are just empty shells that produce generic output. Tools like Paperclip look impressive but you'd be more productive building your own version over 2-3 weeks with workflows matched to your actual needs.

## Relevance to Niksho

This validates our current approach with ExcelTech: 5 agents, 5 skills, all battle-tested in production before expanding. The v3 architecture ([[Raw/docs/ExcelTech-Recruitment-Agent-Architecture-v3.html]]) adds 2 new agents (JD Parser, Reactivation) — each justified by a specific workflow gap, not added for completeness. When building the SaaS product, resist the temptation to offer "50 agents" as a feature. Fewer agents, each with deeply refined skills, will outperform.

## Related

- [[Wiki/concepts/Recursive-Skill-Building]] — how to build the skills that justify sub-agents
- [[Wiki/concepts/Expert-In-The-Loop]] — the human who validates whether a sub-agent is actually needed
- [[Wiki/digests/YT-Agents-Skills-Clearly-Explained-2026-04-14]] — full source
- [[Efforts/ExcelTech-Automation/Overview]] — our 5-agent setup in production
