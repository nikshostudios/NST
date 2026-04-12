import { useState, useEffect, useRef, useCallback } from "react";

// ─── DESIGN SYSTEM ───────────────────────────────────────────────
const T = {
  bg: "#0C0C0E",
  surface: "#141416",
  surfaceHover: "#1A1A1E",
  surfaceActive: "#222226",
  border: "#2A2A2E",
  borderSubtle: "#1E1E22",
  text: "#E8E4DE",
  textMuted: "#8A8680",
  textDim: "#5A5854",
  accent: "#D4A853",
  accentMuted: "rgba(212,168,83,0.15)",
  accentGlow: "rgba(212,168,83,0.08)",
  success: "#4ADE80",
  successMuted: "rgba(74,222,128,0.12)",
  warning: "#FBBF24",
  warningMuted: "rgba(251,191,36,0.12)",
  danger: "#F87171",
  dangerMuted: "rgba(248,113,113,0.12)",
  info: "#60A5FA",
  infoMuted: "rgba(96,165,250,0.12)",
  purple: "#A78BFA",
  purpleMuted: "rgba(167,139,250,0.12)",
};

// ─── MOCK DATA ───────────────────────────────────────────────────
const REQUIREMENTS = [
  { id: 1, role: "Senior ServiceNow Developer", client: "HCL Technologies", market: "IN", status: "active", sourced: 48, matched: 22, screened: 18, shortlisted: 8, outreached: 8, replied: 5, toTL: 2, skills: ["ServiceNow", "JavaScript", "ITSM", "ITIL"], salary: "₹18-25 LPA", assignedTo: "Priya S.", daysOpen: 12, urgency: "high" },
  { id: 2, role: "Cloud DevOps Engineer", client: "Tech Mahindra", market: "IN", status: "active", sourced: 35, matched: 15, screened: 12, shortlisted: 6, outreached: 6, replied: 3, toTL: 1, skills: ["AWS", "Kubernetes", "Terraform", "CI/CD"], salary: "₹22-30 LPA", assignedTo: "Amit K.", daysOpen: 8, urgency: "medium" },
  { id: 3, role: "Cyber Security Analyst", client: "LGT Bank", market: "SG", status: "active", sourced: 20, matched: 9, screened: 7, shortlisted: 4, outreached: 4, replied: 2, toTL: 0, skills: ["SIEM", "Incident Response", "ISO 27001"], salary: "SGD 7-10K", assignedTo: "Wei L.", daysOpen: 15, urgency: "high" },
  { id: 4, role: "Angular Frontend Developer", client: "NCR Corporation", market: "IN", status: "active", sourced: 42, matched: 18, screened: 14, shortlisted: 7, outreached: 5, replied: 2, toTL: 0, skills: ["Angular", "TypeScript", "RxJS", "NgRx"], salary: "₹15-22 LPA", assignedTo: "Priya S.", daysOpen: 5, urgency: "low" },
  { id: 5, role: "Data Engineer", client: "DBS Bank", market: "SG", status: "active", sourced: 15, matched: 6, screened: 4, shortlisted: 2, outreached: 2, replied: 1, toTL: 0, skills: ["Python", "Spark", "Airflow", "BigQuery"], salary: "SGD 8-12K", assignedTo: "Wei L.", daysOpen: 20, urgency: "critical" },
];

const CANDIDATES = [
  { id: 1, name: "Rajesh Kumar", title: "Senior ServiceNow Developer", company: "Infosys", location: "Bangalore, IN", experience: 8, skills: ["ServiceNow", "JavaScript", "ITSM", "ITIL", "REST API"], matchScore: 94, source: "Internal DB", status: "shortlisted", email: "rajesh.k@email.com", phone: "+91 98xxx xxxxx", reqId: 1 },
  { id: 2, name: "Arun Patel", title: "ServiceNow Consultant", company: "Wipro", location: "Pune, IN", experience: 6, skills: ["ServiceNow", "JavaScript", "ITIL", "Scripted REST"], matchScore: 87, source: "Apollo", status: "screened", email: "arun.p@email.com", phone: "+91 97xxx xxxxx", reqId: 1 },
  { id: 3, name: "Li Wei Chen", title: "Cloud Infrastructure Engineer", company: "Grab", location: "Singapore", experience: 5, skills: ["AWS", "Kubernetes", "Docker", "Terraform", "Jenkins"], matchScore: 91, source: "Internal DB", status: "outreached", email: "liwei.c@email.com", phone: "+65 9xxx xxxx", reqId: 2 },
  { id: 4, name: "Meera Shankar", title: "DevOps Lead", company: "Zoho", location: "Chennai, IN", experience: 9, skills: ["AWS", "Azure", "Kubernetes", "Ansible", "CI/CD"], matchScore: 82, source: "Apollo", status: "matched", email: "meera.s@email.com", phone: "+91 96xxx xxxxx", reqId: 2 },
  { id: 5, name: "Tan Jia Hui", title: "SOC Analyst", company: "Standard Chartered", location: "Singapore", experience: 4, skills: ["SIEM", "Splunk", "Incident Response", "ISO 27001"], matchScore: 89, source: "Foundit", status: "shortlisted", email: "jiahui.t@email.com", phone: "+65 8xxx xxxx", reqId: 3 },
  { id: 6, name: "Vikram Desai", title: "Angular Developer", company: "TCS", location: "Hyderabad, IN", experience: 5, skills: ["Angular", "TypeScript", "RxJS", "NgRx", "Jasmine"], matchScore: 92, source: "Internal DB", status: "sourced", email: "vikram.d@email.com", phone: "+91 95xxx xxxxx", reqId: 4 },
  { id: 7, name: "Priya Nair", title: "Full Stack Developer", company: "Accenture", location: "Bangalore, IN", experience: 7, skills: ["Angular", "TypeScript", "Node.js", "MongoDB"], matchScore: 78, source: "Apollo", status: "sourced", email: "priya.n@email.com", phone: "+91 94xxx xxxxx", reqId: 4 },
  { id: 8, name: "Daniel Lim", title: "Data Engineer", company: "Sea Group", location: "Singapore", experience: 6, skills: ["Python", "Spark", "Airflow", "BigQuery", "dbt"], matchScore: 95, source: "Internal DB", status: "screened", email: "daniel.l@email.com", phone: "+65 9xxx xxxx", reqId: 5 },
];

const SUBMISSIONS = [
  { id: 1, candidate: "Rajesh Kumar", role: "Senior ServiceNow Developer", client: "HCL Technologies", submittedAt: "Apr 10", status: "pending_tl", tlNote: "" },
  { id: 2, candidate: "Li Wei Chen", role: "Cloud DevOps Engineer", client: "Tech Mahindra", submittedAt: "Apr 9", status: "sent_to_client", tlNote: "Strong AWS background. Recommend for first round." },
  { id: 3, candidate: "Tan Jia Hui", role: "Cyber Security Analyst", client: "LGT Bank", submittedAt: "Apr 8", status: "client_shortlisted", tlNote: "Client wants to schedule interview next week." },
];

const SEQUENCES = [
  { id: 1, name: "ServiceNow — HCL Batch 1", status: "active", contacts: 8, sent: 24, opened: 18, replied: 5, steps: 3, startDate: "Apr 5" },
  { id: 2, name: "DevOps — Tech Mahindra", status: "active", contacts: 6, sent: 12, opened: 9, replied: 3, steps: 3, startDate: "Apr 7" },
  { id: 3, name: "Security — LGT Bank", status: "paused", contacts: 4, sent: 8, opened: 5, replied: 2, steps: 3, startDate: "Apr 3" },
  { id: 4, name: "Angular — NCR Initial", status: "draft", contacts: 0, sent: 0, opened: 0, replied: 0, steps: 2, startDate: "" },
];

const ACTIVITY = [
  { time: "2m ago", text: "Rajesh Kumar replied to outreach — interested in HCL role", type: "success" },
  { time: "15m ago", text: "AI screened 14 candidates for Angular Frontend Developer", type: "info" },
  { time: "1h ago", text: "Tan Jia Hui shortlisted by LGT Bank — interview scheduling", type: "success" },
  { time: "2h ago", text: "Apollo sourced 12 new DevOps candidates for Tech Mahindra", type: "info" },
  { time: "3h ago", text: "Cookie expired for Foundit — manual refresh needed", type: "danger" },
  { time: "5h ago", text: "Priya S. submitted 2 candidates for TL review", type: "warning" },
];

// ─── ICONS (inline SVG) ─────────────────────────────────────────
const Icon = ({ name, size = 18, color = "currentColor" }) => {
  const icons = {
    dashboard: <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>,
    pipeline: <><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></>,
    search: <><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></>,
    candidates: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>,
    submissions: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M9 15l2 2 4-4"/></>,
    sequences: <><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></>,
    requirements: <><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/></>,
    agents: <><circle cx="12" cy="12" r="3"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></>,
    analytics: <><path d="M18 20V10M12 20V4M6 20v-6"/></>,
    settings: <><circle cx="12" cy="12" r="3"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></>,
    inbox: <><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></>,
    chevron: <><polyline points="9 18 15 12 9 6"/></>,
    close: <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>,
    star: <><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></>,
    send: <><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></>,
    check: <><polyline points="20 6 9 17 4 12"/></>,
    clock: <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>,
    alert: <><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></>,
    arrowUp: <><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></>,
    arrowDown: <><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></>,
    filter: <><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></>,
    sparkle: <><path d="M12 3l1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5L12 3z"/></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">{icons[name]}</svg>;
};

// ─── COMPONENTS ──────────────────────────────────────────────────

const Badge = ({ children, color = T.accent, bg }) => (
  <span style={{
    display: "inline-flex", alignItems: "center", gap: 4,
    padding: "2px 8px", borderRadius: 4, fontSize: 11, fontWeight: 600,
    letterSpacing: "0.03em", textTransform: "uppercase",
    color, background: bg || `${color}18`,
  }}>{children}</span>
);

const MarketBadge = ({ market }) => (
  <Badge
    color={market === "SG" ? T.info : T.accent}
    bg={market === "SG" ? T.infoMuted : T.accentMuted}
  >{market}</Badge>
);

const StatusBadge = ({ status }) => {
  const map = {
    active: { color: T.success, label: "Active" },
    paused: { color: T.warning, label: "Paused" },
    draft: { color: T.textMuted, label: "Draft" },
    sourced: { color: T.textMuted, label: "Sourced" },
    matched: { color: T.info, label: "Matched" },
    screened: { color: T.purple, label: "Screened" },
    shortlisted: { color: T.accent, label: "Shortlisted" },
    outreached: { color: T.warning, label: "Outreached" },
    pending_tl: { color: T.warning, label: "Pending TL" },
    sent_to_client: { color: T.info, label: "Sent to Client" },
    client_shortlisted: { color: T.success, label: "Client Shortlisted" },
  };
  const s = map[status] || { color: T.textMuted, label: status };
  return <Badge color={s.color}>{s.label}</Badge>;
};

const ScoreBar = ({ score, size = "md" }) => {
  const h = size === "sm" ? 4 : 6;
  const w = size === "sm" ? 60 : 80;
  const color = score >= 90 ? T.success : score >= 75 ? T.accent : score >= 60 ? T.warning : T.danger;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ width: w, height: h, background: T.border, borderRadius: h, overflow: "hidden" }}>
        <div style={{ width: `${score}%`, height: "100%", background: color, borderRadius: h, transition: "width 0.6s ease" }} />
      </div>
      <span style={{ fontSize: size === "sm" ? 11 : 12, fontWeight: 600, color, fontVariantNumeric: "tabular-nums" }}>{score}%</span>
    </div>
  );
};

const FunnelBar = ({ value, max, color = T.accent }) => {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, minWidth: 80 }}>
      <div style={{ flex: 1, height: 6, background: T.border, borderRadius: 3, overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 3, transition: "width 0.8s ease" }} />
      </div>
      <span style={{ fontSize: 12, fontWeight: 600, color: T.text, fontVariantNumeric: "tabular-nums", minWidth: 20, textAlign: "right" }}>{value}</span>
    </div>
  );
};

const MetricCard = ({ label, value, sub, delta, onClick, accent = T.accent }) => (
  <div onClick={onClick} style={{
    background: T.surface, border: `1px solid ${T.borderSubtle}`, borderRadius: 8, padding: "16px 20px",
    cursor: onClick ? "pointer" : "default", transition: "all 0.2s",
    ...(onClick && { ":hover": { borderColor: T.border } }),
  }}
  onMouseEnter={e => { if(onClick) { e.currentTarget.style.borderColor = accent; e.currentTarget.style.background = T.surfaceHover; }}}
  onMouseLeave={e => { if(onClick) { e.currentTarget.style.borderColor = T.borderSubtle; e.currentTarget.style.background = T.surface; }}}
  >
    <div style={{ fontSize: 11, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600, marginBottom: 8 }}>{label}</div>
    <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
      <span style={{ fontSize: 28, fontWeight: 700, color: T.text, fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>{value}</span>
      {delta && (
        <span style={{ fontSize: 12, fontWeight: 600, color: delta > 0 ? T.success : T.danger, display: "flex", alignItems: "center", gap: 2 }}>
          <Icon name={delta > 0 ? "arrowUp" : "arrowDown"} size={12} color={delta > 0 ? T.success : T.danger} />
          {Math.abs(delta)}
        </span>
      )}
    </div>
    {sub && <div style={{ fontSize: 11, color: T.textDim, marginTop: 4 }}>{sub}</div>}
  </div>
);

// ─── SLIDE-OVER PANEL ────────────────────────────────────────────
const SlideOver = ({ open, onClose, title, children, width = 480 }) => {
  if (!open) return null;
  return (
    <>
      <div onClick={onClose} style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 100,
        animation: "fadeIn 0.2s ease",
      }} />
      <div style={{
        position: "fixed", top: 0, right: 0, bottom: 0, width, zIndex: 101,
        background: T.bg, borderLeft: `1px solid ${T.border}`, padding: 0,
        animation: "slideIn 0.25s ease", display: "flex", flexDirection: "column",
      }}>
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "16px 24px", borderBottom: `1px solid ${T.border}`,
        }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: T.text }}>{title}</h3>
          <div onClick={onClose} style={{ cursor: "pointer", padding: 4, borderRadius: 4, color: T.textMuted }}
            onMouseEnter={e => e.currentTarget.style.color = T.text}
            onMouseLeave={e => e.currentTarget.style.color = T.textMuted}>
            <Icon name="close" size={18} />
          </div>
        </div>
        <div style={{ flex: 1, overflow: "auto", padding: 24 }}>{children}</div>
      </div>
    </>
  );
};

// ─── CANDIDATE DETAIL PANEL ──────────────────────────────────────
const CandidateDetail = ({ candidate, onClose }) => {
  if (!candidate) return null;
  const req = REQUIREMENTS.find(r => r.id === candidate.reqId);
  const criteria = [
    { label: "Experience", score: Math.min(100, (candidate.experience / 8) * 100), note: `${candidate.experience} years in the field` },
    { label: "Skills Match", score: candidate.matchScore, note: `${candidate.skills.length} relevant skills` },
    { label: "Location", score: candidate.location.includes("Singapore") || candidate.location.includes("IN") ? 100 : 60, note: candidate.location },
    { label: "Seniority", score: candidate.title.includes("Senior") || candidate.title.includes("Lead") ? 95 : 70, note: candidate.title },
  ];
  return (
    <SlideOver open={!!candidate} onClose={onClose} title="Candidate Profile" width={520}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 8, background: T.accentMuted,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18, fontWeight: 700, color: T.accent,
          }}>{candidate.name.split(" ").map(n => n[0]).join("")}</div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 600, color: T.text }}>{candidate.name}</div>
            <div style={{ fontSize: 13, color: T.textMuted }}>{candidate.title} at {candidate.company}</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
          <StatusBadge status={candidate.status} />
          <Badge color={T.textMuted}>{candidate.source}</Badge>
          <Badge color={T.textMuted}>{candidate.experience} yrs</Badge>
        </div>
      </div>

      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 12 }}>Overall Match</div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <div style={{
            width: 56, height: 56, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
            background: `conic-gradient(${candidate.matchScore >= 90 ? T.success : T.accent} ${candidate.matchScore * 3.6}deg, ${T.border} 0deg)`,
          }}>
            <div style={{ width: 44, height: 44, borderRadius: "50%", background: T.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, color: T.text }}>
              {candidate.matchScore}
            </div>
          </div>
          <div style={{ fontSize: 13, color: T.textMuted }}>
            {candidate.matchScore >= 90 ? "Excellent match — recommend for shortlist" : candidate.matchScore >= 80 ? "Strong match — worth screening" : "Partial match — review criteria"}
          </div>
        </div>
      </div>

      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 12 }}>Criteria Breakdown</div>
        {criteria.map((c, i) => (
          <div key={i} style={{ marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ fontSize: 13, color: T.text }}>{c.label}</span>
              <span style={{ fontSize: 12, color: T.textDim }}>{c.note}</span>
            </div>
            <ScoreBar score={Math.round(c.score)} />
          </div>
        ))}
      </div>

      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 12 }}>Skills</div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {candidate.skills.map((s, i) => (
            <span key={i} style={{
              padding: "4px 10px", borderRadius: 4, fontSize: 12, fontWeight: 500,
              background: req?.skills.includes(s) ? T.accentMuted : T.surfaceActive,
              color: req?.skills.includes(s) ? T.accent : T.textMuted,
              border: `1px solid ${req?.skills.includes(s) ? "rgba(212,168,83,0.3)" : T.border}`,
            }}>{s} {req?.skills.includes(s) && "✓"}</span>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 12 }}>Contact</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ fontSize: 13, color: T.text }}>{candidate.email}</div>
          <div style={{ fontSize: 13, color: T.text }}>{candidate.phone}</div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, marginTop: 24, paddingTop: 16, borderTop: `1px solid ${T.border}` }}>
        <button style={{
          flex: 1, padding: "10px 16px", borderRadius: 6, border: "none", cursor: "pointer",
          background: T.accent, color: T.bg, fontSize: 13, fontWeight: 600,
        }}>Add to Shortlist</button>
        <button style={{
          flex: 1, padding: "10px 16px", borderRadius: 6, cursor: "pointer",
          background: "transparent", color: T.text, fontSize: 13, fontWeight: 600,
          border: `1px solid ${T.border}`,
        }}>Start Sequence</button>
      </div>
    </SlideOver>
  );
};

// ─── REQUIREMENT DETAIL PANEL ────────────────────────────────────
const RequirementDetail = ({ req, onClose, onViewCandidate }) => {
  if (!req) return null;
  const candidates = CANDIDATES.filter(c => c.reqId === req.id);
  const stages = [
    { label: "Sourced", value: req.sourced, color: T.textMuted },
    { label: "Matched", value: req.matched, color: T.info },
    { label: "Screened", value: req.screened, color: T.purple },
    { label: "Shortlisted", value: req.shortlisted, color: T.accent },
    { label: "Outreached", value: req.outreached, color: T.warning },
    { label: "Replied", value: req.replied, color: T.success },
    { label: "To TL", value: req.toTL, color: T.success },
  ];
  return (
    <SlideOver open={!!req} onClose={onClose} title="Requirement Detail" width={560}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 600, color: T.text }}>{req.role}</h2>
          <MarketBadge market={req.market} />
        </div>
        <div style={{ fontSize: 14, color: T.textMuted, marginBottom: 4 }}>{req.client}</div>
        <div style={{ display: "flex", gap: 12, fontSize: 12, color: T.textDim }}>
          <span>{req.salary}</span>
          <span>·</span>
          <span>Assigned: {req.assignedTo}</span>
          <span>·</span>
          <span>{req.daysOpen} days open</span>
        </div>
      </div>

      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 12 }}>Pipeline Funnel</div>
        {stages.map((s, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
            <span style={{ fontSize: 12, color: T.textMuted, width: 80 }}>{s.label}</span>
            <FunnelBar value={s.value} max={req.sourced} color={s.color} />
          </div>
        ))}
      </div>

      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 12 }}>Skills Required</div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {req.skills.map((s, i) => (
            <span key={i} style={{ padding: "4px 10px", borderRadius: 4, fontSize: 12, background: T.accentMuted, color: T.accent, border: "1px solid rgba(212,168,83,0.3)" }}>{s}</span>
          ))}
        </div>
      </div>

      <div>
        <div style={{ fontSize: 12, fontWeight: 600, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 12 }}>Top Candidates</div>
        {candidates.sort((a, b) => b.matchScore - a.matchScore).map(c => (
          <div key={c.id} onClick={() => onViewCandidate(c)} style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "10px 12px", borderRadius: 6, marginBottom: 4, cursor: "pointer",
            border: `1px solid ${T.borderSubtle}`, transition: "all 0.15s",
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.background = T.surfaceHover; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = T.borderSubtle; e.currentTarget.style.background = "transparent"; }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 500, color: T.text }}>{c.name}</div>
              <div style={{ fontSize: 11, color: T.textDim }}>{c.title} · {c.company}</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <StatusBadge status={c.status} />
              <ScoreBar score={c.matchScore} size="sm" />
            </div>
          </div>
        ))}
      </div>
    </SlideOver>
  );
};

// ─── PAGE: DASHBOARD ─────────────────────────────────────────────
const DashboardPage = ({ onNavigate, onViewReq, onViewCandidate }) => {
  const totalSourced = REQUIREMENTS.reduce((a, r) => a + r.sourced, 0);
  const totalScreened = REQUIREMENTS.reduce((a, r) => a + r.screened, 0);
  const totalShortlisted = REQUIREMENTS.reduce((a, r) => a + r.shortlisted, 0);
  const totalOutreached = REQUIREMENTS.reduce((a, r) => a + r.outreached, 0);
  const totalReplied = REQUIREMENTS.reduce((a, r) => a + r.replied, 0);
  const pendingTL = REQUIREMENTS.reduce((a, r) => a + r.toTL, 0);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 24 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 600, color: T.text }}>Dashboard</h1>
          <p style={{ margin: "4px 0 0", fontSize: 13, color: T.textMuted }}>Recruitment overview · India + Singapore</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <MarketBadge market="IN" />
          <MarketBadge market="SG" />
        </div>
      </div>

      {/* Metrics */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 12, marginBottom: 28 }}>
        <MetricCard label="Sourced" value={totalSourced} delta={32} onClick={() => onNavigate("candidates")} />
        <MetricCard label="AI Screened" value={totalScreened} delta={14} sub={`${Math.round(totalScreened/totalSourced*100)}% screen rate`} onClick={() => onNavigate("candidates")} />
        <MetricCard label="Shortlisted" value={totalShortlisted} sub={`${Math.round(totalShortlisted/totalScreened*100)}% screen-to-shortlist`} onClick={() => onNavigate("candidates")} accent={T.success} />
        <MetricCard label="Outreached" value={totalOutreached} sub={`${totalReplied} replies received`} onClick={() => onNavigate("sequences")} />
        <MetricCard label="Open Roles" value={REQUIREMENTS.length} sub={`2 markets`} onClick={() => onNavigate("requirements")} />
        <MetricCard label="Pending TL" value={pendingTL} sub="awaiting review" onClick={() => onNavigate("submissions")} accent={T.warning} />
      </div>

      {/* Pipeline Table + Activity Feed */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 16 }}>
        {/* Pipeline */}
        <div style={{ background: T.surface, border: `1px solid ${T.borderSubtle}`, borderRadius: 8, overflow: "hidden" }}>
          <div style={{ padding: "14px 20px", borderBottom: `1px solid ${T.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: T.text }}>Recruitment Pipeline</span>
            <span style={{ fontSize: 11, color: T.textDim, cursor: "pointer" }} onClick={() => onNavigate("pipeline")}>View all →</span>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${T.border}` }}>
                {["Role", "Client", "Mkt", "Sourced", "Matched", "Screened", "Shortlisted", "Replied", "To TL"].map(h => (
                  <th key={h} style={{ padding: "10px 12px", fontSize: 11, fontWeight: 600, color: T.textDim, textAlign: "left", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {REQUIREMENTS.map(r => (
                <tr key={r.id} onClick={() => onViewReq(r)} style={{ borderBottom: `1px solid ${T.borderSubtle}`, cursor: "pointer", transition: "background 0.15s" }}
                  onMouseEnter={e => e.currentTarget.style.background = T.surfaceHover}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <td style={{ padding: "12px", fontSize: 13, fontWeight: 500, color: T.text, maxWidth: 200 }}>{r.role}</td>
                  <td style={{ padding: "12px", fontSize: 12, color: T.textMuted }}>{r.client}</td>
                  <td style={{ padding: "12px" }}><MarketBadge market={r.market} /></td>
                  <td style={{ padding: "12px" }}><FunnelBar value={r.sourced} max={50} /></td>
                  <td style={{ padding: "12px" }}><FunnelBar value={r.matched} max={r.sourced} color={T.info} /></td>
                  <td style={{ padding: "12px" }}><FunnelBar value={r.screened} max={r.sourced} color={T.purple} /></td>
                  <td style={{ padding: "12px" }}><FunnelBar value={r.shortlisted} max={r.sourced} color={T.accent} /></td>
                  <td style={{ padding: "12px" }}><FunnelBar value={r.replied} max={r.sourced} color={T.success} /></td>
                  <td style={{ padding: "12px", fontSize: 14, fontWeight: 600, color: r.toTL > 0 ? T.accent : T.textDim, textAlign: "center" }}>{r.toTL}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Activity Feed */}
        <div style={{ background: T.surface, border: `1px solid ${T.borderSubtle}`, borderRadius: 8 }}>
          <div style={{ padding: "14px 20px", borderBottom: `1px solid ${T.border}` }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: T.text }}>Activity</span>
          </div>
          <div style={{ padding: "8px 0" }}>
            {ACTIVITY.map((a, i) => (
              <div key={i} style={{ padding: "10px 20px", display: "flex", gap: 12, alignItems: "flex-start", borderBottom: i < ACTIVITY.length - 1 ? `1px solid ${T.borderSubtle}` : "none" }}>
                <div style={{
                  width: 6, height: 6, borderRadius: "50%", marginTop: 6, flexShrink: 0,
                  background: a.type === "success" ? T.success : a.type === "danger" ? T.danger : a.type === "warning" ? T.warning : T.info,
                }} />
                <div>
                  <div style={{ fontSize: 12, color: T.text, lineHeight: 1.5 }}>{a.text}</div>
                  <div style={{ fontSize: 11, color: T.textDim, marginTop: 2 }}>{a.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── PAGE: SEARCH ────────────────────────────────────────────────
const SearchPage = ({ onViewCandidate }) => {
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState(null);
  const [filters, setFilters] = useState(null);

  const handleSearch = () => {
    if (!query.trim()) return;
    setSearching(true);
    setFilters({
      hard: { title: "Software Engineer", location: "Singapore", minYears: 5, skills: ["Python", "AWS"] },
      soft: [{ criterion: "Cloud experience", weight: "required" }, { criterion: "Startup background", weight: "preferred" }],
    });
    setTimeout(() => {
      setSearching(false);
      setResults(CANDIDATES.sort((a, b) => b.matchScore - a.matchScore));
    }, 1200);
  };

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 600, color: T.text }}>Search</h1>
        <p style={{ margin: "4px 0 0", fontSize: 13, color: T.textMuted }}>Find candidates using natural language</p>
      </div>

      {/* Search Bar */}
      <div style={{
        display: "flex", gap: 8, marginBottom: 20, padding: 4,
        background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10,
      }}>
        <div style={{ display: "flex", alignItems: "center", padding: "0 12px", color: T.textDim }}>
          <Icon name="sparkle" size={18} color={T.accent} />
        </div>
        <input
          value={query} onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSearch()}
          placeholder="Describe the candidate you're looking for..."
          style={{
            flex: 1, padding: "14px 0", background: "transparent", border: "none", outline: "none",
            color: T.text, fontSize: 15, fontFamily: "inherit",
          }}
        />
        <button onClick={handleSearch} style={{
          padding: "10px 24px", borderRadius: 8, border: "none", cursor: "pointer",
          background: T.accent, color: T.bg, fontSize: 13, fontWeight: 600,
          display: "flex", alignItems: "center", gap: 6,
        }}>
          <Icon name="search" size={14} color={T.bg} /> Search
        </button>
      </div>

      {/* Parsed Filters */}
      {filters && (
        <div style={{
          display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20, padding: "12px 16px",
          background: T.accentGlow, border: `1px solid rgba(212,168,83,0.15)`, borderRadius: 8,
        }}>
          <span style={{ fontSize: 11, color: T.textMuted, textTransform: "uppercase", fontWeight: 600, lineHeight: "24px" }}>Filters:</span>
          {Object.entries(filters.hard).map(([k, v]) => (
            <span key={k} style={{
              padding: "4px 10px", borderRadius: 4, fontSize: 12, fontWeight: 500,
              background: T.surfaceActive, color: T.text, border: `1px solid ${T.border}`,
            }}>{k}: {Array.isArray(v) ? v.join(", ") : v}</span>
          ))}
          <span style={{ fontSize: 11, color: T.textMuted, textTransform: "uppercase", fontWeight: 600, lineHeight: "24px", marginLeft: 8 }}>Criteria:</span>
          {filters.soft.map((c, i) => (
            <span key={i} style={{
              padding: "4px 10px", borderRadius: 4, fontSize: 12, fontWeight: 500,
              background: c.weight === "required" ? T.accentMuted : T.surfaceActive,
              color: c.weight === "required" ? T.accent : T.textMuted,
              border: `1px solid ${c.weight === "required" ? "rgba(212,168,83,0.3)" : T.border}`,
            }}>{c.criterion}</span>
          ))}
        </div>
      )}

      {/* Loading */}
      {searching && (
        <div style={{ textAlign: "center", padding: "60px 0" }}>
          <div style={{ fontSize: 14, color: T.textMuted, marginBottom: 8 }}>Searching Internal DB + Apollo...</div>
          <div style={{ width: 200, height: 3, background: T.border, borderRadius: 2, margin: "0 auto", overflow: "hidden" }}>
            <div style={{ width: "60%", height: "100%", background: T.accent, borderRadius: 2, animation: "pulse 1s ease infinite" }} />
          </div>
        </div>
      )}

      {/* Results */}
      {results && !searching && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <span style={{ fontSize: 13, color: T.textMuted }}>{results.length} candidates found · sorted by match score</span>
            <div style={{ display: "flex", gap: 8 }}>
              <button style={{ padding: "6px 14px", borderRadius: 6, border: `1px solid ${T.border}`, background: "transparent", color: T.textMuted, fontSize: 12, cursor: "pointer" }}>
                <Icon name="filter" size={12} /> Filter
              </button>
              <button style={{ padding: "6px 14px", borderRadius: 6, border: "none", background: T.accent, color: T.bg, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                Select All · Add to Sequence
              </button>
            </div>
          </div>

          {results.map(c => (
            <div key={c.id} onClick={() => onViewCandidate(c)} style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "14px 16px", marginBottom: 4, borderRadius: 8, cursor: "pointer",
              border: `1px solid ${T.borderSubtle}`, transition: "all 0.15s",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.background = T.surfaceHover; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = T.borderSubtle; e.currentTarget.style.background = "transparent"; }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 8, background: T.accentMuted,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 14, fontWeight: 700, color: T.accent,
                }}>{c.name.split(" ").map(n => n[0]).join("")}</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 500, color: T.text }}>{c.name}</div>
                  <div style={{ fontSize: 12, color: T.textMuted }}>{c.title} · {c.company} · {c.location}</div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ display: "flex", gap: 4, flexWrap: "wrap", maxWidth: 200 }}>
                  {c.skills.slice(0, 3).map((s, i) => (
                    <span key={i} style={{ padding: "2px 6px", borderRadius: 3, fontSize: 10, background: T.surfaceActive, color: T.textMuted }}>{s}</span>
                  ))}
                  {c.skills.length > 3 && <span style={{ fontSize: 10, color: T.textDim }}>+{c.skills.length - 3}</span>}
                </div>
                <StatusBadge status={c.status} />
                <Badge color={T.textMuted}>{c.source}</Badge>
                <ScoreBar score={c.matchScore} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!results && !searching && (
        <div style={{ textAlign: "center", padding: "80px 0" }}>
          <div style={{ fontSize: 40, marginBottom: 16, opacity: 0.3 }}><Icon name="sparkle" size={48} color={T.accent} /></div>
          <div style={{ fontSize: 16, color: T.textMuted, marginBottom: 8 }}>Type a requirement in natural language</div>
          <div style={{ fontSize: 13, color: T.textDim }}>Example: "Senior Java developer, 5+ years, Singapore, fintech experience"</div>
        </div>
      )}
    </div>
  );
};

// ─── PAGE: PIPELINE ──────────────────────────────────────────────
const PipelinePage = ({ onViewReq }) => {
  const stages = ["Sourced", "Matched", "Screened", "Shortlisted", "Outreached", "Replied", "To TL"];
  const stageKeys = ["sourced", "matched", "screened", "shortlisted", "outreached", "replied", "toTL"];
  const stageColors = [T.textMuted, T.info, T.purple, T.accent, T.warning, T.success, T.success];

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 600, color: T.text }}>Pipeline</h1>
        <p style={{ margin: "4px 0 0", fontSize: 13, color: T.textMuted }}>Visual funnel for each requirement</p>
      </div>

      {REQUIREMENTS.map(r => (
        <div key={r.id} onClick={() => onViewReq(r)} style={{
          background: T.surface, border: `1px solid ${T.borderSubtle}`, borderRadius: 8,
          padding: 20, marginBottom: 12, cursor: "pointer", transition: "all 0.15s",
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = T.border; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = T.borderSubtle; }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 15, fontWeight: 600, color: T.text }}>{r.role}</span>
              <MarketBadge market={r.market} />
              <Badge color={r.urgency === "critical" ? T.danger : r.urgency === "high" ? T.warning : T.textMuted}>
                {r.urgency}
              </Badge>
            </div>
            <span style={{ fontSize: 12, color: T.textDim }}>{r.client} · {r.daysOpen}d open · {r.assignedTo}</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${stages.length}, 1fr)`, gap: 8 }}>
            {stages.map((s, i) => {
              const val = r[stageKeys[i]];
              const pct = r.sourced > 0 ? (val / r.sourced) * 100 : 0;
              return (
                <div key={s}>
                  <div style={{ fontSize: 10, color: T.textDim, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>{s}</div>
                  <div style={{ height: 8, background: T.border, borderRadius: 4, overflow: "hidden", marginBottom: 4 }}>
                    <div style={{ width: `${pct}%`, height: "100%", background: stageColors[i], borderRadius: 4, transition: "width 0.8s ease" }} />
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: T.text, fontVariantNumeric: "tabular-nums" }}>{val}</div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

// ─── PAGE: REQUIREMENTS ──────────────────────────────────────────
const RequirementsPage = ({ onViewReq }) => (
  <div>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
      <div>
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 600, color: T.text }}>Requirements</h1>
        <p style={{ margin: "4px 0 0", fontSize: 13, color: T.textMuted }}>{REQUIREMENTS.length} active roles across 2 markets</p>
      </div>
      <button style={{
        padding: "10px 20px", borderRadius: 8, border: "none", cursor: "pointer",
        background: T.accent, color: T.bg, fontSize: 13, fontWeight: 600,
      }}>+ New Requirement</button>
    </div>

    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
      {REQUIREMENTS.map(r => (
        <div key={r.id} onClick={() => onViewReq(r)} style={{
          background: T.surface, border: `1px solid ${T.borderSubtle}`, borderRadius: 8,
          padding: 20, cursor: "pointer", transition: "all 0.15s",
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = T.accent; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = T.borderSubtle; }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 600, color: T.text, marginBottom: 4 }}>{r.role}</div>
              <div style={{ fontSize: 13, color: T.textMuted }}>{r.client}</div>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <MarketBadge market={r.market} />
              <Badge color={r.urgency === "critical" ? T.danger : r.urgency === "high" ? T.warning : T.textMuted}>{r.urgency}</Badge>
            </div>
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
            {r.skills.map((s, i) => (
              <span key={i} style={{ padding: "3px 8px", borderRadius: 4, fontSize: 11, background: T.surfaceActive, color: T.textMuted }}>{s}</span>
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 12, color: T.textDim }}>{r.salary} · {r.assignedTo} · {r.daysOpen}d</span>
            <div style={{ display: "flex", gap: 12, fontSize: 12 }}>
              <span style={{ color: T.text }}><strong>{r.sourced}</strong> <span style={{ color: T.textDim }}>sourced</span></span>
              <span style={{ color: T.success }}><strong>{r.replied}</strong> <span style={{ color: T.textDim }}>replied</span></span>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// ─── PAGE: CANDIDATES ────────────────────────────────────────────
const CandidatesPage = ({ onViewCandidate }) => (
  <div>
    <div style={{ marginBottom: 24 }}>
      <h1 style={{ margin: 0, fontSize: 24, fontWeight: 600, color: T.text }}>Candidates</h1>
      <p style={{ margin: "4px 0 0", fontSize: 13, color: T.textMuted }}>{CANDIDATES.length} candidates in pipeline</p>
    </div>
    <div style={{ background: T.surface, border: `1px solid ${T.borderSubtle}`, borderRadius: 8, overflow: "hidden" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ borderBottom: `1px solid ${T.border}` }}>
            {["Name", "Role", "Company", "Source", "Status", "Match"].map(h => (
              <th key={h} style={{ padding: "12px 14px", fontSize: 11, fontWeight: 600, color: T.textDim, textAlign: "left", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {CANDIDATES.sort((a, b) => b.matchScore - a.matchScore).map(c => (
            <tr key={c.id} onClick={() => onViewCandidate(c)} style={{ borderBottom: `1px solid ${T.borderSubtle}`, cursor: "pointer", transition: "background 0.15s" }}
              onMouseEnter={e => e.currentTarget.style.background = T.surfaceHover}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
              <td style={{ padding: "12px 14px" }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: T.text }}>{c.name}</div>
                <div style={{ fontSize: 11, color: T.textDim }}>{c.location}</div>
              </td>
              <td style={{ padding: "12px 14px", fontSize: 12, color: T.textMuted }}>{c.title}</td>
              <td style={{ padding: "12px 14px", fontSize: 12, color: T.textMuted }}>{c.company}</td>
              <td style={{ padding: "12px 14px" }}><Badge color={T.textMuted}>{c.source}</Badge></td>
              <td style={{ padding: "12px 14px" }}><StatusBadge status={c.status} /></td>
              <td style={{ padding: "12px 14px" }}><ScoreBar score={c.matchScore} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// ─── PAGE: SUBMISSIONS ───────────────────────────────────────────
const SubmissionsPage = () => (
  <div>
    <div style={{ marginBottom: 24 }}>
      <h1 style={{ margin: 0, fontSize: 24, fontWeight: 600, color: T.text }}>Submissions</h1>
      <p style={{ margin: "4px 0 0", fontSize: 13, color: T.textMuted }}>Candidate submissions to clients</p>
    </div>
    {SUBMISSIONS.map(s => (
      <div key={s.id} style={{
        background: T.surface, border: `1px solid ${T.borderSubtle}`, borderRadius: 8,
        padding: 20, marginBottom: 8, transition: "all 0.15s", cursor: "pointer",
      }}
      onMouseEnter={e => e.currentTarget.style.borderColor = T.border}
      onMouseLeave={e => e.currentTarget.style.borderColor = T.borderSubtle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, color: T.text }}>{s.candidate}</div>
            <div style={{ fontSize: 12, color: T.textMuted }}>{s.role} · {s.client}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 11, color: T.textDim }}>{s.submittedAt}</span>
            <StatusBadge status={s.status} />
          </div>
        </div>
        {s.tlNote && (
          <div style={{ padding: "10px 14px", background: T.accentGlow, borderRadius: 6, fontSize: 12, color: T.textMuted, borderLeft: `3px solid ${T.accent}` }}>
            <strong style={{ color: T.text }}>TL Note:</strong> {s.tlNote}
          </div>
        )}
        {s.status === "pending_tl" && (
          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            <button style={{ padding: "8px 16px", borderRadius: 6, border: "none", background: T.success, color: T.bg, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Approve & Send</button>
            <button style={{ padding: "8px 16px", borderRadius: 6, border: `1px solid ${T.border}`, background: "transparent", color: T.text, fontSize: 12, cursor: "pointer" }}>Add Note</button>
            <button style={{ padding: "8px 16px", borderRadius: 6, border: `1px solid ${T.border}`, background: "transparent", color: T.danger, fontSize: 12, cursor: "pointer" }}>Reject</button>
          </div>
        )}
      </div>
    ))}
  </div>
);

// ─── PAGE: SEQUENCES ─────────────────────────────────────────────
const SequencesPage = () => (
  <div>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
      <div>
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 600, color: T.text }}>Sequences</h1>
        <p style={{ margin: "4px 0 0", fontSize: 13, color: T.textMuted }}>Email outreach campaigns</p>
      </div>
      <button style={{ padding: "10px 20px", borderRadius: 8, border: "none", background: T.accent, color: T.bg, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>+ New Sequence</button>
    </div>

    {/* Stats */}
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24 }}>
      <MetricCard label="Total Sent" value={SEQUENCES.reduce((a, s) => a + s.sent, 0)} />
      <MetricCard label="Opened" value={SEQUENCES.reduce((a, s) => a + s.opened, 0)} sub={`${Math.round(SEQUENCES.reduce((a, s) => a + s.opened, 0) / Math.max(1, SEQUENCES.reduce((a, s) => a + s.sent, 0)) * 100)}% open rate`} />
      <MetricCard label="Replied" value={SEQUENCES.reduce((a, s) => a + s.replied, 0)} sub={`${Math.round(SEQUENCES.reduce((a, s) => a + s.replied, 0) / Math.max(1, SEQUENCES.reduce((a, s) => a + s.sent, 0)) * 100)}% reply rate`} accent={T.success} />
      <MetricCard label="Active Sequences" value={SEQUENCES.filter(s => s.status === "active").length} />
    </div>

    {SEQUENCES.map(s => (
      <div key={s.id} style={{
        background: T.surface, border: `1px solid ${T.borderSubtle}`, borderRadius: 8,
        padding: 20, marginBottom: 8, cursor: "pointer", transition: "all 0.15s",
      }}
      onMouseEnter={e => e.currentTarget.style.borderColor = T.border}
      onMouseLeave={e => e.currentTarget.style.borderColor = T.borderSubtle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: T.text }}>{s.name}</span>
            <StatusBadge status={s.status} />
          </div>
          <span style={{ fontSize: 11, color: T.textDim }}>{s.steps} steps · {s.contacts} contacts{s.startDate && ` · Started ${s.startDate}`}</span>
        </div>
        {s.sent > 0 && (
          <div style={{ display: "flex", gap: 24 }}>
            <div style={{ fontSize: 12 }}>
              <span style={{ color: T.textDim }}>Sent </span>
              <span style={{ color: T.text, fontWeight: 600 }}>{s.sent}</span>
            </div>
            <div style={{ fontSize: 12 }}>
              <span style={{ color: T.textDim }}>Opened </span>
              <span style={{ color: T.info, fontWeight: 600 }}>{s.opened}</span>
              <span style={{ color: T.textDim }}> ({Math.round(s.opened / s.sent * 100)}%)</span>
            </div>
            <div style={{ fontSize: 12 }}>
              <span style={{ color: T.textDim }}>Replied </span>
              <span style={{ color: T.success, fontWeight: 600 }}>{s.replied}</span>
              <span style={{ color: T.textDim }}> ({Math.round(s.replied / s.sent * 100)}%)</span>
            </div>
          </div>
        )}
      </div>
    ))}
  </div>
);

// ─── MAIN APP ────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("dashboard");
  const [selectedReq, setSelectedReq] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  const nav = [
    { section: "MAIN", items: [
      { id: "dashboard", label: "Dashboard", icon: "dashboard" },
      { id: "search", label: "Search", icon: "sparkle" },
      { id: "pipeline", label: "Pipeline", icon: "pipeline" },
      { id: "requirements", label: "Requirements", icon: "requirements", count: REQUIREMENTS.length },
      { id: "candidates", label: "Candidates", icon: "candidates", count: CANDIDATES.length },
      { id: "submissions", label: "Submissions", icon: "submissions", count: SUBMISSIONS.filter(s => s.status === "pending_tl").length },
      { id: "sequences", label: "Sequences", icon: "sequences" },
    ]},
    { section: "MANAGE", items: [
      { id: "agents", label: "AI Agents", icon: "agents" },
      { id: "analytics", label: "Analytics", icon: "analytics" },
      { id: "settings", label: "Settings", icon: "settings" },
    ]},
  ];

  return (
    <div style={{
      display: "flex", height: "100vh", background: T.bg, color: T.text,
      fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${T.border}; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: ${T.textDim}; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        input::placeholder { color: ${T.textDim}; }
      `}</style>

      {/* Sidebar */}
      <div style={{
        width: 220, flexShrink: 0, background: T.surface, borderRight: `1px solid ${T.border}`,
        display: "flex", flexDirection: "column", padding: "16px 0",
      }}>
        {/* Logo */}
        <div style={{ padding: "4px 20px 20px", borderBottom: `1px solid ${T.border}`, marginBottom: 8 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: T.accent, letterSpacing: "-0.02em" }}>ExcelTech</div>
          <div style={{ fontSize: 11, color: T.textDim }}>Recruitment Platform</div>
        </div>

        {/* Nav */}
        <div style={{ flex: 1, overflow: "auto" }}>
          {nav.map(group => (
            <div key={group.section}>
              <div style={{ padding: "14px 20px 6px", fontSize: 10, fontWeight: 600, color: T.textDim, textTransform: "uppercase", letterSpacing: "0.08em" }}>{group.section}</div>
              {group.items.map(item => (
                <div key={item.id} onClick={() => setPage(item.id)} style={{
                  display: "flex", alignItems: "center", gap: 10, padding: "9px 20px",
                  cursor: "pointer", transition: "all 0.15s",
                  background: page === item.id ? T.accentMuted : "transparent",
                  color: page === item.id ? T.accent : T.textMuted,
                  borderRight: page === item.id ? `2px solid ${T.accent}` : "2px solid transparent",
                }}
                onMouseEnter={e => { if(page !== item.id) { e.currentTarget.style.background = T.surfaceHover; e.currentTarget.style.color = T.text; }}}
                onMouseLeave={e => { if(page !== item.id) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = T.textMuted; }}}>
                  <Icon name={item.icon} size={16} />
                  <span style={{ fontSize: 13, fontWeight: page === item.id ? 600 : 400, flex: 1 }}>{item.label}</span>
                  {item.count > 0 && (
                    <span style={{
                      fontSize: 10, fontWeight: 600, padding: "1px 6px", borderRadius: 10,
                      background: page === item.id ? T.accent : T.surfaceActive,
                      color: page === item.id ? T.bg : T.textDim,
                    }}>{item.count}</span>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* User */}
        <div style={{ padding: "12px 20px", borderTop: `1px solid ${T.border}`, display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 6, background: T.accentMuted,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 12, fontWeight: 700, color: T.accent,
          }}>RA</div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: T.text }}>Raju Akula</div>
            <div style={{ fontSize: 10, color: T.textDim }}>Team Lead</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, overflow: "auto", padding: "24px 32px" }}>
        {page === "dashboard" && <DashboardPage onNavigate={setPage} onViewReq={setSelectedReq} onViewCandidate={setSelectedCandidate} />}
        {page === "search" && <SearchPage onViewCandidate={setSelectedCandidate} />}
        {page === "pipeline" && <PipelinePage onViewReq={setSelectedReq} />}
        {page === "requirements" && <RequirementsPage onViewReq={setSelectedReq} />}
        {page === "candidates" && <CandidatesPage onViewCandidate={setSelectedCandidate} />}
        {page === "submissions" && <SubmissionsPage />}
        {page === "sequences" && <SequencesPage />}
        {page === "agents" && (
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 600, color: T.text, marginBottom: 8 }}>AI Agents</h1>
            <p style={{ fontSize: 13, color: T.textMuted, marginBottom: 24 }}>Autonomous agents running your pipeline</p>
            {[
              { name: "Sourcing Agent", status: "active", desc: "Searching Apollo + Internal DB", runs: 12, tokens: "45K" },
              { name: "Screening Agent", status: "active", desc: "Scoring candidates against criteria", runs: 8, tokens: "32K" },
              { name: "Outreach Agent", status: "paused", desc: "Generating personalised emails", runs: 5, tokens: "18K" },
              { name: "Follow-up Agent", status: "active", desc: "Monitoring replies, sending follow-ups", runs: 15, tokens: "12K" },
              { name: "Formatter Agent", status: "idle", desc: "Preparing client submission docs", runs: 2, tokens: "8K" },
            ].map((a, i) => (
              <div key={i} style={{
                background: T.surface, border: `1px solid ${T.borderSubtle}`, borderRadius: 8,
                padding: 20, marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 8,
                    background: a.status === "active" ? T.successMuted : a.status === "paused" ? T.warningMuted : T.surfaceActive,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <Icon name="agents" size={16} color={a.status === "active" ? T.success : a.status === "paused" ? T.warning : T.textDim} />
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: T.text }}>{a.name}</div>
                    <div style={{ fontSize: 12, color: T.textMuted }}>{a.desc}</div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <span style={{ fontSize: 12, color: T.textDim }}>{a.runs} runs today · {a.tokens} tokens</span>
                  <StatusBadge status={a.status === "idle" ? "draft" : a.status} />
                </div>
              </div>
            ))}
          </div>
        )}
        {page === "analytics" && (
          <div style={{ textAlign: "center", padding: "100px 0" }}>
            <Icon name="analytics" size={48} color={T.textDim} />
            <div style={{ fontSize: 16, color: T.textMuted, marginTop: 16 }}>Analytics — coming soon</div>
            <div style={{ fontSize: 13, color: T.textDim, marginTop: 4 }}>Placement rates, time-to-fill, source effectiveness</div>
          </div>
        )}
        {page === "settings" && (
          <div style={{ textAlign: "center", padding: "100px 0" }}>
            <Icon name="settings" size={48} color={T.textDim} />
            <div style={{ fontSize: 16, color: T.textMuted, marginTop: 16 }}>Settings</div>
            <div style={{ fontSize: 13, color: T.textDim, marginTop: 4 }}>API keys, team management, integrations</div>
          </div>
        )}
      </div>

      {/* Slide-over panels */}
      <RequirementDetail req={selectedReq} onClose={() => setSelectedReq(null)} onViewCandidate={c => { setSelectedReq(null); setSelectedCandidate(c); }} />
      <CandidateDetail candidate={selectedCandidate} onClose={() => setSelectedCandidate(null)} />
    </div>
  );
}
