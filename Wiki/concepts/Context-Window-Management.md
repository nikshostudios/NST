---
type: wiki-concept
generated-by: claude
sources: ["[[Raw/transcripts/YT-Transcripts-2026-04-14]]"]
updated: 2026-04-14
tags: [context-management, tokens, agent-architecture, cost]
---

# Context Window Management

## What it is

The practice of deliberately controlling what fills an LLM's context window to maximise output quality and minimise cost. The context window is the total amount of text (measured in tokens) the model can "see" during a single interaction. As it fills up, the model's performance degrades — it gets less precise, misses instructions, and starts producing generic output.

## The context stack (in a coding agent like Claude Code)

1. **System prompt** — always present, set by the model provider (~10% of the window)
2. **agent.md / claude.md** — loaded every turn (burns tokens whether relevant or not)
3. **Skills** — only name + description unless activated (see [[Wiki/concepts/Progressive-Disclosure]])
4. **Tools** — tool definitions the agent can call
5. **Codebase** — project files as context
6. **Conversation history** — grows with each turn until compaction

## The degradation curve

Performance is best when the window is 10-70% full. As you approach 80-100%, the model starts to lose coherence — similar to a person cramming too much information at once. At the limit (~250K tokens in Claude), the system compacts (summarises older turns), which loses detail.

## Practical rules

- Don't tell the model things it already knows from training (React syntax, dollar signs for currency). That's wasted context.
- Use skills instead of agent.md files — 53 tokens per turn vs 900+ (see [[Wiki/concepts/Progressive-Disclosure]]).
- Start fresh conversations often — long conversations accumulate history that makes each turn more expensive and less sharp.
- What the model actually needs from you: your specific workflows, your business rules, your taste — the things that aren't in the training data.

## Relevance to Niksho

Our `mi.md` is ~137 lines, loaded every turn via `claude.md`. Per this principle, most of it should become skills. Only the core identity/tone/guardrails (maybe 30-40 lines) need to load every turn. The rest — product architecture, business context, workflow instructions — should be skills that load on demand.

## Related

- [[Wiki/concepts/Progressive-Disclosure]] — the mechanism for reducing per-turn context
- [[Wiki/concepts/Recursive-Skill-Building]] — how to build the skills that replace bloated agent.md
- [[Wiki/digests/YT-Agents-Skills-Clearly-Explained-2026-04-14]] — full source (Ross Mike)
- [[Wiki/digests/YT-Strategic-AI-Coding-2026-04-14]] — short focused conversations as a corollary
