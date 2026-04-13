---
type: wiki-digest
generated-by: claude
sources: ["[[Raw/transcripts/YT-Transcripts-2026-04-14]]"]
video: "Everything You Need to Know About Coding with AI // NOT vibe coding"
tab: 1
date: 2026-04-14
updated: 2026-04-14
tags: [ai-coding, prompting, workflow, code-review]
---

# Strategic AI Coding (Not Vibe Coding)

Source: Tab 1 of [[Raw/transcripts/YT-Transcripts-2026-04-14]]

## Core argument

There is a huge difference between software developers strategically guiding AI and vibe coders who let it take the wheel. The difference is specificity, context management, and treating AI output like a junior dev's PR — you review everything.

## Key principles

**Foundation first.** Index your codebase so the AI has full context before you start. Then set up two layers of rules: global rules (coding standards, preferred libraries, testing philosophy — applied to every project) and project-specific rules (tech stack, versions, DB schema, API patterns, branch naming — scoped to one repo or submodule).

**Be specific in prompts.** "Make the edit button toggle" is lazy. "Add a boolean field `editable` to the users table, expose it through API `/users/:id` endpoint, and conditionally render the edit button based on that field" is concrete, testable, and removes margin for hallucination. Use this template:

> Implement [function/class/endpoint] to [goal] using [lib/framework]. Work in [files/paths] only. Respect [style/tests/rules]. Provide [tests/docs/migration]. If assumptions needed, list them first.

**Add explicit file context.** Reference or highlight the specific code sections you want the AI to work with. Don't make it search the entire codebase — that wastes tokens and leads to wrong assumptions.

**Screenshots for UI bugs.** Upload a screenshot when something looks wrong visually. Visual context beats a text description of a layout issue every time.

**Choose your model deliberately.** Don't let the AI autopick an expensive model (like Opus 4) when a cheaper one would suffice. Specify the model for each task.

**Short, focused conversations.** Each conversation's history prepends to every new prompt. Longer history = higher cost = dumber responses as context fills up. Start fresh often.

**Treat AI tasks like sprint tasks.** Small, iterative, testable. Not "build me the whole feature" — that's vibe coding.

**Review like pair programming with a junior.** Question every decision. Don't blindly accept. If you wouldn't let a junior merge it without review, don't let AI either.

**Parallel agents on independent tasks.** Run up to 3 agents on separate git worktrees/checkouts for genuinely independent work. But not more — coordination overhead kills gains.

**Know when to stop.** If you're losing control of what the AI is doing, revert to a checkpoint or previous commit. Don't chase a runaway agent.

## Relevance to Niksho

This maps directly to how Shoham works with Claude Code on the ExcelTech codebase. The "two layers of rules" maps to [[mi]] (global identity) + project-specific context in [[Atlas/Product/Architecture]]. The "review like a junior dev's PR" principle reinforces why every outreach email goes through recruiter approval before sending — see [[Efforts/ExcelTech-Automation/Overview]].

## See also

- [[Wiki/concepts/Progressive-Disclosure]] — related: don't dump everything into context
- [[Wiki/concepts/Recursive-Skill-Building]] — related: iterative improvement over one-shot
- [[Wiki/digests/YT-Agents-Skills-Clearly-Explained-2026-04-14]] — complementary: context management philosophy
