---
skill: log-decision
triggers: ["log this decision", "record this", "decided to X"]
reads: [Atlas/, Efforts/]
writes: [Atlas/... or Efforts/.../Decisions.md]
---

# Skill: Log Decision

## Purpose
Capture a decision with reasoning and trade-offs so future-Shoham and future-Nikhil (and any AI reading the vault) can understand why a choice was made — not just what.

## Trigger
- User says "log this decision", "record that we decided X"

## Inputs
- The decision (one sentence)
- The context that forced the decision
- The options considered
- The chosen path and the reasoning
- The trade-off being accepted
- Where the decision belongs (which Effort or Atlas area)

If the user provides only the decision itself, ask for the rest — a one-line "decided X" is worse than no log at all.

## Steps

1. **Identify the home.** Is this a product decision? → `Efforts/ExcelTech-Automation/Decisions.md`. A strategic decision? → `Atlas/Business-Model/Decisions.md`. A technical decision? → the relevant Atlas/Product file's Decisions section.

2. **Append to the decisions log** using this format:

   ```markdown
   ## YYYY-MM-DD — <short title>

   **Decision:** <one sentence>

   **Context:** <why this needed deciding now>

   **Options considered:**
   - Option A — pros / cons
   - Option B — pros / cons
   - Option C — pros / cons

   **Chose:** Option <X>

   **Reasoning:** <the actual reasoning, not a rationalisation>

   **Trade-off accepted:** <what we're giving up by choosing this>

   **Reversibility:** <can we change our mind later, and at what cost>

   **Related:** [[...]]
   ```

3. **If the decision contradicts an earlier one**, link to the earlier one and note the reversal explicitly. Don't hide it.

4. **Surface implications.** If the decision changes something in Atlas (e.g. the stack, the team, the phase), update the relevant Atlas file and note the update in the decision log.

## Rules & guardrails

- **Never edit a past decision.** Add a superseding entry that references the old one.
- **Trade-offs must be explicit.** A decision without a stated trade-off is a red flag — surface it.
- **Keep reasoning honest.** Don't write a reasoning that reads like a press release.
