---
type: moc
area: Atlas
owner: Shoham & Nikhil
updated: 2026-04-10
cssclasses:
  - moc
---

# Atlas — MOC

> 📚 The knowledge headspace. *What we know and believe.*
>
> Atlas is the **authored** layer. Stable, hand-written, our perspective. If a fact is durable, it lives here. If it's a transient observation, it belongs in [[Calendar/Calendar|Calendar]]. If it's something an outside source said, it gets extracted into [[Wiki/index|Wiki]] and only flows into Atlas once we've made it our own.

---

## 🌟 Start here

If you're new to this MOC (or you're an AI reading the vault cold), read these five in order. They are 80% of what you need to be useful in a meeting:

1. **[[Atlas/Business-Model/Niksho-Vision]]** — what Niksho is and isn't, in one document.
2. **[[Atlas/ExcelTech/ExcelTech-Overview]]** — the agency that pays the bills and where we prove everything.
3. **[[Atlas/Product/Architecture]]** — how the system is built and the six design principles we don't break.
4. **[[Atlas/Concepts/AI-OS]]** — the philosophy behind why this vault exists at all.
5. **[[Atlas/People/Shoham]]** + **[[Atlas/People/Nikhil]]** — who's in the room.

---

## 🧭 Business Model
*Why we exist and how we get paid.*

The "why" of Niksho — vision, phases, strategy, pricing, funding path. We are betting that recruitment agencies are the right beachhead for an AI-native operations layer, and we are using ExcelTech as the proof.

- [[Atlas/Business-Model/Niksho-Vision]] — the one-pager
- [[Atlas/Business-Model/Phase-1-ExcelTech]] — prove it on real money
- [[Atlas/Business-Model/Phase-2-GTM]] — turn the proof into product
- [[Atlas/Business-Model/Phase-3-Funding]] — raise on numbers, not slides
- [[Atlas/Business-Model/Product-Thesis]] — what we believe about the market

## 🏢 ExcelTech
*The proving ground.*

ExcelTech is a recruitment agency operating in India and Singapore. It is **not** a customer of Niksho — it is the test bed where we earn the right to sell the product elsewhere. Everything in Product is being built against this real workflow.

- [[Atlas/ExcelTech/ExcelTech-Overview]] — what it is, who it serves
- [[Atlas/ExcelTech/Team]] — humans in the building
- [[Atlas/ExcelTech/India-Market]] — HCL, ServiceNow, Foundit, LPA, the volume reality
- [[Atlas/ExcelTech/Singapore-Market]] — GeBIZ, MyCareersFuture, the nationality rule
- [[Atlas/ExcelTech/Current-Flow]] — pre-automation: 6-8 hours of mechanical work per recruiter per day
- [[Atlas/ExcelTech/New-Flow]] — post-automation: 1.5-2 hours, agents do the rest

## ⚙️ Product
*The system being built.*

A FastAPI + Jinja2 webapp on Railway, Supabase Postgres, a thin `/ai-agents/` layer, APScheduler in-process. Five agents, five skills, individual Outlook accounts per recruiter. The architecture exists to serve the workflow, not the other way around.

- [[Atlas/Product/Architecture]] — system shape and the six principles we don't break
- [[Atlas/Product/Agents]] — the five agents and what model each one runs
- [[Atlas/Product/Skills]] — the five end-to-end skills humans can run
- [[Atlas/Product/Database-Schema]] — Postgres is the source of truth
- [[Atlas/Product/Sourcing-Channels]] — Foundit, MyCareersFuture, the LinkedIn hard rule
- [[Atlas/Product/Tech-Stack]] — what we picked and what we deliberately didn't

## 👥 People
*Who's in the room and what they own.*

- [[Atlas/People/Shoham]] — design, product, vault, AI orchestration
- [[Atlas/People/Nikhil]] — backend, agents, infra, son of Nik
- [[Atlas/People/Raja-TL]] — the only TL with client-facing access
- [[Atlas/People/Recruiters]] — the 10-11 recruiters and their Foundit assignments

## 💡 Concepts
*Cross-cutting ideas that shape how we think.*

These are the *load-bearing* mental models. They overlap with [[Wiki/index|Wiki]] but are authored from our perspective rather than extracted from sources. When you find yourself explaining the same thing for the third time, it belongs here.

- [[Atlas/Concepts/Ideaverse]] — the design pattern this whole vault is built on
- [[Atlas/Concepts/ARC-Framework]] — Add → Relate → Communicate
- [[Atlas/Concepts/Four-Intensities-of-Efforts]] — Active / Ongoing / Simmering / Sleeping
- [[Atlas/Concepts/Maps-of-Content]] — what a MOC actually is
- [[Atlas/Concepts/AI-OS]] — the hybrid Milo+Karpathy architecture
- [[Atlas/Concepts/Second-Brain]] — what "second brain" means at Niksho specifically
- [[Atlas/Concepts/Agents-vs-Tools]] — when to reach for an LLM and when not to
- [[Atlas/Concepts/File-over-AI]] — why markdown + git beats vector DBs for us

---

## 🧭 The golden rule

If you're about to write something in a Daily Note that is actually a durable fact or decision about the business, it belongs in Atlas. Move it. Daily notes are for the day. Atlas is for the year.

## 🧪 Open threads
*Things we should write up but haven't yet.*

- A proper **client account playbook** under ExcelTech — the canonical one-pager per client (HCL, LGT, OWIS, BCS, MOE) with contacts, commercials, idiosyncrasies.
- A **Pricing** note under Business-Model that captures the actual SaaS pricing thinking, not just the funding narrative.
- A **Glossary** so terms like "BD", "TL", "submission", "tender fan-out", "intensity" all have one canonical definition.

## 🔗 Related
- [[Home]]
- [[Calendar/Calendar]]
- [[Efforts/Efforts]]
- [[Wiki/index]]
- [[AIOS/vault-map]]
