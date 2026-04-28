---
type: atlas-note
area: Concepts
updated: 2026-04-10
---

# Agents vs Tools — How We Use the Words

## The short version
- A **tool** is a function. Deterministic inputs, deterministic outputs. "Given a CV, return the extracted fields." No judgement, no loop, no autonomy.
- An **agent** is a tool wrapped in a loop that can choose which sub-tools to call, when to stop, and how to respond to unexpected inputs. It has a prompt, a model, a scratchpad, and some degree of goal-directedness.

The line between them is fuzzy. The usefulness of keeping the words distinct is that it tells you **where the judgement lives**.

## Why this matters for us
When we say "the Screener agent", we mean something that:
- Has a prompt describing its job and its rules.
- Takes structured inputs (JD + CV).
- Uses reasoning (Claude Sonnet 4) to produce a scored, justified output.
- Has judgment — it can flag edge cases, recognise overqualification, catch missing data.

When we say "the PDF parser", we mean a tool:
- Given a PDF file, return the text.
- Deterministic. No model involved. No judgement.
- If it fails, it fails loudly and the caller decides what to do.

Both are useful. Both have their place. The distinction matters because:
- **Agents are expensive.** Every invocation is tokens, latency, and non-determinism.
- **Tools are cheap and predictable.** You can call them in loops without worrying about cost.
- **Agents can hallucinate.** Tools can't.
- **Agents need evaluation.** Tools need unit tests.

## Our rule of thumb
**If a human could write a one-line regex or a two-line SQL query to do it, it's a tool. If a human would have to think about it, it's an agent.**

Examples:
- Parsing "3 years of experience" out of a CV line → tool (regex or simple extraction).
- Deciding whether "3 years of relevant experience" is enough for a senior requirement → agent (judgement).
- Extracting an email address from a message → tool.
- Deciding whether the email is a yes, a no, or a maybe → agent.
- Sending an email via MS Graph → tool.
- Drafting a personalised outreach email from a recruiter's voice → agent.

## Why we don't build on agent platforms
This is also why we don't build on OpenClaw, Paperclip, or any of the "agent OS" products. See [[Atlas/Business-Model/Product-Thesis#Why-we-own-the-stack]].

Our agents are our IP. They're the compounding asset. If we built on a platform:
- We'd be paying the platform per-token while our agents generated revenue through placements.
- We couldn't modify the core reasoning loop to match the niche we understand (recruitment).
- Platform pivots / deprecations / acquisitions would kill our product.

Instead, every agent is a function in `/ai-agents/` that we own end-to-end. The scaffolding is a thin wrapper around the Claude SDK. No magic.

## How this maps to our product
Our five "agents" (Screener, Outreach, Follow-up, Formatter, Sourcing) all qualify as agents under the definition above. Each has:
- A versioned prompt (git-tracked).
- A defined input/output contract.
- A token budget.
- An evaluation harness (some more mature than others).
- A place in a skill — the skill is where the agents get chained into workflows.

See [[Atlas/Product/Agents]] and [[Atlas/Product/Skills]].

## The thing people miss
Agents aren't magic. They're just loops of tool calls with a model choosing the next step. If your tools are bad, your agents are bad. If your inputs are sloppy, your agents hallucinate. If your prompts are wishy-washy, your outputs are wishy-washy.

**Most of the work of building good agents is actually the work of designing good tools and structured inputs.**

## Related
- [[Atlas/Product/Agents]]
- [[Atlas/Product/Skills]]
- [[Atlas/Business-Model/Product-Thesis]]
- [[Atlas/Concepts/AI-OS]]
