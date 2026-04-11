---
type: moc
area: Efforts
owner: Shoham & Nikhil
updated: 2026-04-10
cssclasses:
  - moc
---

# Efforts — MOC

> ⚡ The action headspace. *What we are doing.*
>
> An effort is anything with a start, an end, and a definition of done — but unlike a "project", it has variable intensity and a life of its own. Efforts move between four states. See [[Atlas/Concepts/Four-Intensities-of-Efforts]].

## 🌟 Start here

If you're new to this MOC (or you're an AI reading the vault cold):

1. **[[Efforts/ExcelTech-Automation/Overview|ExcelTech Automation]]** — the live system that pays the bills. Read this first to understand what's actually shipping.
2. **[[Efforts/Second-Brain-Setup/Overview|Second Brain Setup]]** — this vault. Why it exists, how it's structured.
3. **[[Atlas/Concepts/Four-Intensities-of-Efforts]]** — the model that organizes this whole headspace.

---

## 🔥 Active
*On the bench right now. Daily attention. Cap: 2 efforts.*

### [[Efforts/ExcelTech-Automation/Overview|ExcelTech Automation]]
The live build inside ExcelTech. 5 agents, 5 skills, web app, Railway deploy. Production today, refining weekly.
- **Definition of done:** Hit the success metrics in [[Atlas/Business-Model/Phase-1-ExcelTech]] — submission throughput up, recruiter mechanical hours down, TL bandwidth restored.
- **Why active:** It is the proof. Phase 2 and Phase 3 of [[Atlas/Business-Model/Niksho-Vision|the vision]] do not exist if this doesn't keep working.

### [[Efforts/Niksho-SaaS-Product/Overview|Niksho SaaS Product]]
Architecture decided (Option A: InsForge for data layer, Railway for FastAPI, Jinja2 first). InsForge project "NikSho" already created and linked. **Immediate next step: build the Managed Agents demo tenant to show Nik before any SaaS infra is built.** Demo → Nik feedback → Nik's dad's network → first external pilot.
- **Definition of done (Phase A):** A non-technical agency owner pastes a JD and says "I want this for my team" within 5 minutes.
- **Owner:** Shoham building. Nik validating.
- **Promoted from simmering:** 2026-04-10.

---

## 🌀 Ongoing
*Steady background care. Weekly touches. No sprint.*

### [[Efforts/Second-Brain-Setup/Overview|Second Brain Setup]]
Shipped v1 on 2026-04-10. The setup project is done; what remains is maintenance — `lint-wiki` passes, the occasional restructure, drift checks during weekly review, ingestion of new sources as they land. See [[Efforts/Second-Brain-Setup/decisions/2026-04-10-ship-vault-v1|the ship-v1 decision]] for why this was demoted in place rather than archived.
- **Definition of "still healthy":** the vault opens cleanly, [[Home]] agrees with `Efforts/Efforts.md` and the Overview frontmatter, AI sessions can navigate it cold without re-reading the whole thing.
- **Wake back up to Active if:** a structural problem emerges that needs a sustained push (more than a single weekly-review touch) — e.g. the four-intensities model breaks down, or `Wiki/` ingestion falls more than two weeks behind.

Beyond this, Ongoing stays deliberately small this quarter. Content, marketing, partnerships — all parked. The quarterly theme is "Prove it at ExcelTech," not "build a brand." See [[Calendar/Quarterly/2026-Q2]].

---

---

## 🌱 Simmering
*Not yet active. Ideas collecting. Pre-loading for the day it gets promoted.*

_(nothing here right now — SaaS promoted to Active 2026-04-10)_

---

## 💤 Sleeping
*Intentionally paused. Not cancelled. We will come back.*

### [[Efforts/Fundraising/Prep-2027|Fundraising 2027]]
The 2027 round prep. Narrative, target investor list, metrics dashboard, deck.
- **Why sleeping:** No round in 2026. The honest answer to "should we be raising now?" is no — we have no SaaS revenue, no case studies. Sleep it, drop founder memos in as they come, wake it in late 2026.

---

## 🧭 How efforts work in this vault

- Each effort gets a folder under `Efforts/<EffortName>/` with at minimum an `Overview.md` (or for Fundraising, a single doc).
- The Overview frontmatter declares an `intensity:` of `active`, `ongoing`, `simmering`, or `sleeping`. **This MOC and [[Home]] must agree.**
- Decisions are logged inline in the Overview (newest at top) or in a separate `decisions.md` for decision-heavy efforts.
- When an effort ends, move the folder to `Efforts/_archive/` with a closing note. Never delete — we learn from the ones that didn't ship.
- Weekly: run [[Templates/Weekly Review]] to retire, promote, or demote efforts. This is the only thing that keeps Home honest.

## 🛠️ Quick actions
- **New effort** — copy [[Templates/Effort]] or run [[AIOS/skills/new-effort]]
- **Log a decision** — copy [[Templates/Decision]] or run [[AIOS/skills/log-decision]], file it under the relevant Effort
- **Weekly review** — copy [[Templates/Weekly Review]] into `Calendar/Weekly/`

## 🧪 Open threads
*Things to work out at the next weekly review.*

- When does Niksho SaaS get promoted from Simmering to Active? What concrete signal triggers it? (Half-met: Second-Brain-Setup shipped 2026-04-10. Still waiting on two weeks of stable ExcelTech-Automation production.)
- Does ExcelTech client delivery deserve to live as Ongoing rather than buried inside the Active automation effort?
- Do we need a fifth Sleeping effort for "personal vault replication" so the framing for after-Niksho is captured?

## 🔗 Related
- [[Home]]
- [[Atlas/Atlas]]
- [[Calendar/Calendar]]
- [[Atlas/Concepts/Four-Intensities-of-Efforts]]
- [[Atlas/Concepts/Ideaverse]]
