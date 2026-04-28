---
type: wiki-concept
generated-by: claude
sources: ["[[Raw/transcripts/YT-Transcripts-2026-04-14]]", "[[Raw/clippings/context-audit-skill-bradley-bonanno]]"]
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

## Concrete implementation (from Bradley Bonanno)

Beyond the principles above, there are specific settings and habits that reduce context waste:

**MCP servers** are the #1 hidden cost. Each connected server loads ~18,000 tokens of tool definitions every turn — even when you never call them. Run `/mcp` at session start and disconnect anything you won't use. Replace MCPs with CLI equivalents where available (CLI costs tokens only when called; MCP costs tokens just by existing). Expected savings: ~40%.

**CLAUDE.md pruning** via the [[Wiki/concepts/Five-Filter-Rule-Audit]] — test every rule against five filters (Default, Contradiction, Redundancy, Bandaid, Vague). Cut anything that fails any filter. Move surviving detailed rules into reference files with one-line pointers.

**Settings.json tweaks:**
- `autocompact_percentage_override: 75` — triggers compaction before quality degrades (default is ~83%)
- `BASH_MAX_OUTPUT_LENGTH: 150000` — prevents silent truncation + costly reruns (default is 30-50K)
- `permissions.deny` rules — block node_modules, dist, build, .next, coverage, etc. from being read

**Daily habits:**
- `/clear` between unrelated tasks (biggest single savings)
- Plan mode before non-trivial work (prevents wasted tokens on wrong-path code)
- Edit bad prompts instead of sending follow-up corrections (avoids bad response + correction + new response all compounding in history)
- Use the right model: Sonnet for coding, Haiku for sub-agents/formatting, Opus for deep architectural decisions

## Relevance to Niksho

Our `mi.md` is ~137 lines, loaded every turn via `claude.md`. Per this principle, most of it should become skills. Only the core identity/tone/guardrails (maybe 30-40 lines) need to load every turn. The rest — product architecture, business context, workflow instructions — should be skills that load on demand.

## Related

- [[Wiki/concepts/Progressive-Disclosure]] — the mechanism for reducing per-turn context
- [[Wiki/concepts/Five-Filter-Rule-Audit]] — the specific methodology for pruning rules
- [[Wiki/concepts/Recursive-Skill-Building]] — how to build the skills that replace bloated agent.md
- [[Wiki/digests/YT-Context-Cleanup-Claude-Code-2026-04-14]] — Bradley Bonanno's implementation guide
- [[Wiki/digests/YT-Agents-Skills-Clearly-Explained-2026-04-14]] — full source (Ross Mike)
- [[Wiki/digests/YT-Strategic-AI-Coding-2026-04-14]] — short focused conversations as a corollary
- [[Raw/clippings/context-audit-skill-bradley-bonanno]] — automated audit skill
