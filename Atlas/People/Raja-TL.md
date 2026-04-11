---
type: atlas-note
area: People
updated: 2026-04-10
sources: ["[[Raw/docs/ExcelTech_Master_Knowledge_Base]]"]
---

# Raja — Team Lead

## The one-liner
The only human at ExcelTech who talks to clients. Everything client-facing that the product does routes through Raja first.

## Role
- **Team Lead** of the 10-recruiter team in India.
- **Client-facing** for every client across both markets. Receives JDs, forwards to the team, reviews shortlists, approves submissions, sends final profiles to clients.
- **Also a recruiter.** Raja sources and screens himself alongside his team. Wears both hats.
- **BD owner** for most of the 1,007 client contacts in the CRM.

## Access level in the web app
**Full TL access.** Raja is the only user with `role = TL` in `RECRUITER_LOGINS`. That unlocks:
- **Create Requirement** screen — the only place new JDs enter the system.
- **Submission Queue** — pre-formatted submissions waiting for TL approval.
- **Approve + Send to Client** — the final human click that produces the outbound email from his own Outlook.
- Plus everything a recruiter sees (source/screen, outreach queue, my candidates).

## Why everything routes through Raja
This isn't a product limitation — it's the **business model**. The client relationships are Raja's (and by extension Nik's). Recruiters are not supposed to talk to clients directly. The automation is designed to make Raja 10x faster at the human layer of his job, not to replace his client-facing role.

When we productise this for other agencies, every agency will have its own "Raja" figure — the TL/owner who owns client trust. The role is baked in.

## What automation gives Raja specifically
- **Submission Queue with pre-formatted profiles.** No more chasing the team for a properly formatted CV.
- **One-click client send.** Draft is generated from his Outlook, he reviews, he sends.
- **Visibility.** Every requirement, every candidate, every outreach — searchable and filterable. No more "where did that CV go".
- **Time back to do BD.** The point of automation isn't to make Raja a cyborg recruiter — it's to give him hours back to close more clients.

## What we deliberately didn't build for Raja
- **No automated client emails.** Raja clicks send, always.
- **No AI-written client commentary.** The cover paragraph for each submission is either written by Raja or generated-and-approved — never auto-sent.
- **No client-side communication channel.** Clients still talk to Raja over email/WhatsApp/phone. We don't put a portal between them.

## Dinner-table feedback loop
Nikhil can get unfiltered product feedback from Raja (via Nik) any time. This is the single biggest advantage we have over any vendor building recruitment software from the outside. See [[Atlas/People/Nikhil#Relationship-to-ExcelTech]].

## Related
- [[Atlas/ExcelTech/Team]]
- [[Atlas/ExcelTech/ExcelTech-Overview]]
- [[Atlas/ExcelTech/Current-Flow]]
- [[Atlas/ExcelTech/New-Flow]]
- [[Atlas/People/Nikhil]]
