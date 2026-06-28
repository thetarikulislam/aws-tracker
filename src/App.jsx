import { useState, useEffect } from "react";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Legend
} from "recharts";

// ── palette ──────────────────────────────────────────────────────────────────
const C = {
  bg:      "#0B0F1A",
  surface: "#131929",
  card:    "#1A2235",
  border:  "#1E2D45",
  accent:  "#3B82F6",
  green:   "#22C55E",
  amber:   "#F59E0B",
  red:     "#EF4444",
  purple:  "#A855F7",
  muted:   "#64748B",
  text:    "#E2E8F0",
  sub:     "#94A3B8",
};

// ── data ─────────────────────────────────────────────────────────────────────
const PHASES = [
  {
    id: "p1", label: "Phase 1", title: "CLF-C02 Foundation", months: "মাস ১–৩",
    color: C.green,
    weeks: [
      { id:"w1", label:"সপ্তাহ ১", badge:"🌱 Cloud Initiate", tasks:[
        "Cloud কী — On-premise vs Cloud",
        "IaaS / PaaS / SaaS",
        "AWS Global Infra — Region, AZ, Edge",
        "Free Tier Account + Console tour",
        "IAM — User, Group, Role, Policy",
        "IAM Hands-on — User বানাও",
      ]},
      { id:"w2", label:"সপ্তাহ ২", badge:"🌐 Network Scout", tasks:[
        "VPC — private network in AWS",
        "Subnet, Route Table, IGW",
        "Security Group vs NACL",
        "VPC Hands-on — Custom VPC",
        "NAT Gateway, VPN, Direct Connect",
        "Networking Review + 20 MCQ",
      ]},
      { id:"w3", label:"সপ্তাহ ৩", badge:"⚡ Compute Warrior", tasks:[
        "EC2 — Instance types, AMI, Key Pair",
        "EC2 Pricing — On-demand, Reserved, Spot",
        "EC2 Hands-on — SSH into Linux server",
        "Lambda — Serverless concept",
        "Lambda Hands-on — Hello World",
        "Elastic Beanstalk, ECS intro",
      ]},
      { id:"w4", label:"সপ্তাহ ৪", badge:"🗄️ Storage Keeper", tasks:[
        "S3 — Buckets, Objects, Storage Classes",
        "S3 Versioning, Lifecycle, Replication",
        "S3 Hands-on — Static website 🌐",
        "EBS — Volume types, Snapshots",
        "EFS vs EBS vs S3 — comparison",
        "Month 1 Full Review",
      ]},
      { id:"w5", label:"সপ্তাহ ৫", badge:"🗃️ Data Architect", tasks:[
        "RDS — Managed relational DB",
        "Aurora — কেন ভালো",
        "RDS Hands-on — MySQL connect",
        "DynamoDB — NoSQL",
        "ElastiCache — Redis/Memcached",
        "Redshift — Data Warehouse",
      ]},
      { id:"w6", label:"সপ্তাহ ৬", badge:"🛡️ Security Guardian", tasks:[
        "Shared Responsibility Model",
        "KMS — Encryption",
        "CloudTrail — Who did what",
        "Shield + WAF — DDoS",
        "GuardDuty + Inspector + Macie",
        "Compliance — HIPAA, SOC2, PCI",
      ]},
      { id:"w7", label:"সপ্তাহ ৭", badge:"💰 Cost Optimizer", tasks:[
        "CloudWatch — Metrics, Alarms, Logs",
        "CloudWatch Hands-on — CPU alarm",
        "CloudFormation — IaC intro",
        "Systems Manager + Config",
        "Cost Explorer + Budgets",
        "Support Plans + Well-Architected Tool",
      ]},
      { id:"w8", label:"সপ্তাহ ৮", badge:"🔗 App Integrator", tasks:[
        "SQS — Message Queue",
        "SNS — Pub/Sub",
        "API Gateway — REST API",
        "Route 53 — DNS Routing",
        "CloudFront — CDN",
        "ELB — ALB vs NLB vs CLB",
      ]},
    ],
  },
  {
    id: "p2", label: "Phase 2", title: "SAA-C03 Architecture", months: "মাস ৪–৭",
    color: C.accent,
    weeks: [
      { id:"w9",  label:"সপ্তাহ ৯",  badge:"🏗️ Network Architect", tasks:[
        "VPC Peering",
        "Transit Gateway",
        "VPC Endpoints",
        "VPC Flow Logs",
        "Site-to-Site VPN + Direct Connect",
        "VPC Lab — Multi-tier network",
      ]},
      { id:"w10", label:"সপ্তাহ ১০", badge:"⚖️ HA Designer", tasks:[
        "Auto Scaling Group",
        "Scaling Policies — Target, Step, Scheduled",
        "ALB — Path & Host routing",
        "NLB — Layer 4 traffic",
        "Auto Scaling + ALB Hands-on",
        "Launch Template vs Launch Config",
      ]},
      { id:"w11", label:"সপ্তাহ ১১", badge:"🚀 Serverless Builder", tasks:[
        "Lambda Advanced — Layers, Concurrency",
        "Lambda + API Gateway",
        "Step Functions",
        "EventBridge",
        "SQS + Lambda integration",
        "DynamoDB + Lambda — CRUD",
      ]},
      { id:"w12", label:"সপ্তাহ ১২", badge:"🐳 Container Starter", tasks:[
        "Docker — Container vs VM",
        "Docker Hands-on",
        "ECR — Container registry",
        "ECS — Task, Service, Cluster",
        "ECS Fargate",
        "ECS Hands-on — Deploy container",
      ]},
    ],
  },
  {
    id: "p3", label: "Phase 3", title: "Terraform Automation", months: "মাস ৮–৯",
    color: C.purple,
    weeks: [
      { id:"w13", label:"সপ্তাহ ১৩", badge:"🤖 IaC Pioneer", tasks:[
        "IaC কী, Terraform কেন",
        "HCL Syntax — Variables, Resources",
        "Terraform workflow — init, plan, apply",
        "AWS Provider configure",
        "প্রথম Terraform code — EC2",
        "Variables + tfvars",
      ]},
      { id:"w14", label:"সপ্তাহ ১৪", badge:"📦 Module Master", tasks:[
        "Terraform State",
        "Remote State — S3 + DynamoDB",
        "Modules — Reusable infra",
        "VPC module বানাও",
        "Workspaces — Dev/Staging/Prod",
        "Terraform Registry",
      ]},
    ],
  },
  {
    id: "p4", label: "Phase 4", title: "CKA Kubernetes", months: "মাস ১০–১২",
    color: C.amber,
    weeks: [
      { id:"w15", label:"সপ্তাহ ১৫", badge:"🐋 Docker Expert", tasks:[
        "Dockerfile best practices",
        "Docker Compose",
        "Docker networking + volumes",
        "ECR — Push image",
        "Docker security",
        "Docker Compose project",
      ]},
      { id:"w16", label:"সপ্তাহ ১৬", badge:"☸️ K8s Navigator", tasks:[
        "K8s কী, কেন দরকার",
        "K8s Architecture — Master, Worker, etcd",
        "Pods + ReplicaSets + Deployments",
        "Services — ClusterIP, NodePort, LB",
        "ConfigMaps + Secrets",
        "kubectl commands",
      ]},
    ],
  },
];

const ALL_TASKS = PHASES.flatMap(ph =>
  ph.weeks.flatMap(wk =>
    wk.tasks.map((t, i) => ({
      id: `${wk.id}-t${i}`,
      phaseId: ph.id,
      weekId: wk.id,
      label: t,
    }))
  )
);
const TOTAL = ALL_TASKS.length;

// ── helpers ───────────────────────────────────────────────────────────────────
function todayStr() {
  return new Date().toISOString().slice(0, 10);
}
function loadState() {
  try {
    const raw = localStorage.getItem("aws_tracker_v2");
    if (raw) return JSON.parse(raw);
  } catch (_) {}
  return { done: {}, attendanceDates: [], xp: 0 };
}
function saveState(s) {
  try { localStorage.setItem("aws_tracker_v2", JSON.stringify(s)); } catch (_) {}
}

// ── sub-components ────────────────────────────────────────────────────────────
const Tag = ({ color, children }) => (
  <span style={{
    background: color + "22", color, border: `1px solid ${color}55`,
    borderRadius: 6, padding: "2px 10px", fontSize: 12, fontWeight: 600,
  }}>{children}</span>
);

const StatCard = ({ label, value, sub, color }) => (
  <div style={{
    background: C.card, border: `1px solid ${C.border}`,
    borderRadius: 14, padding: "18px 20px", flex: 1, minWidth: 130,
  }}>
    <div style={{ color: C.sub, fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>{label}</div>
    <div style={{ color: color || C.text, fontSize: 32, fontWeight: 800, lineHeight: 1.2, marginTop: 4 }}>{value}</div>
    {sub && <div style={{ color: C.muted, fontSize: 12, marginTop: 4 }}>{sub}</div>}
  </div>
);

const RADIAN = Math.PI / 180;
const PieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) => {
  if (percent < 0.06) return null;
  const r = innerRadius + (outerRadius - innerRadius) * 0.55;
  const x = cx + r * Math.cos(-midAngle * RADIAN);
  const y = cy + r * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="#fff" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={700}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

// ── main ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [state, setState] = useState(loadState);
  const [activePhase, setActivePhase] = useState("p1");
  const [activeWeek, setActiveWeek] = useState("w1");
  const [tab, setTab] = useState("tasks"); // tasks | charts | log

  useEffect(() => { saveState(state); }, [state]);

  // derived
  const doneCount = Object.values(state.done).filter(Boolean).length;
  const totalPct  = Math.round((doneCount / TOTAL) * 100);
  const streak    = calcStreak(state.attendanceDates);
  const today     = todayStr();
  const attendedToday = state.attendanceDates.includes(today);

  const phase = PHASES.find(p => p.id === activePhase);
  const week  = phase?.weeks.find(w => w.id === activeWeek);

  // phase progress for pie
  const phasePieData = PHASES.map(ph => {
    const phTasks = ALL_TASKS.filter(t => t.phaseId === ph.id);
    const phDone  = phTasks.filter(t => state.done[t.id]).length;
    return { name: ph.label, value: phTasks.length, done: phDone, color: ph.color };
  });

  const donePieData = [
    { name: "সম্পন্ন", value: doneCount,        color: C.green  },
    { name: "বাকি",    value: TOTAL - doneCount, color: C.border },
  ];

  // weekly XP line data
  const weeklyData = PHASES.flatMap(ph => ph.weeks).map(wk => {
    const wkTasks = ALL_TASKS.filter(t => t.weekId === wk.id);
    const wkDone  = wkTasks.filter(t => state.done[t.id]).length;
    return { name: wk.label.replace("সপ্তাহ ", "W"), xp: wkDone * 10 };
  });

  function toggle(taskId) {
    setState(prev => {
      const done   = { ...prev.done, [taskId]: !prev.done[taskId] };
      const gained = !prev.done[taskId] ? 10 : -10;
      const dates  = prev.attendanceDates.includes(today)
        ? prev.attendanceDates
        : [...prev.attendanceDates, today];
      return { ...prev, done, xp: (prev.xp || 0) + gained, attendanceDates: dates };
    });
  }

  function markAttendance() {
    if (attendedToday) return;
    setState(prev => ({
      ...prev,
      attendanceDates: [...prev.attendanceDates, today],
    }));
  }

  function resetAll() {
    if (window.confirm("সব progress মুছে ফেলবে?")) {
      const fresh = { done: {}, attendanceDates: [], xp: 0 };
      setState(fresh);
      saveState(fresh);
    }
  }

  // week completion badge
  const weekBadgeEarned = week
    ? week.tasks.every((_, i) => state.done[`${week.id}-t${i}`])
    : false;

  return (
    <div style={{
      minHeight: "100vh", background: C.bg, color: C.text,
      fontFamily: "'Inter', 'Segoe UI', sans-serif", padding: "0 0 60px",
    }}>
      {/* ── header ── */}
      <div style={{
        background: C.surface, borderBottom: `1px solid ${C.border}`,
        padding: "20px 24px", display: "flex", alignItems: "center",
        justifyContent: "space-between", flexWrap: "wrap", gap: 12,
      }}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: -0.5 }}>
            ☁️ AWS Cloud Tracker
          </div>
          <div style={{ color: C.sub, fontSize: 13, marginTop: 2 }}>
            Zero → Freelance Professional · ১২ মাসের যাত্রা
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          {!attendedToday && (
            <button onClick={markAttendance} style={{
              background: C.green + "22", color: C.green,
              border: `1px solid ${C.green}55`, borderRadius: 8,
              padding: "8px 16px", cursor: "pointer", fontWeight: 600, fontSize: 13,
            }}>✅ আজকের উপস্থিতি</button>
          )}
          <button onClick={resetAll} style={{
            background: "transparent", color: C.muted,
            border: `1px solid ${C.border}`, borderRadius: 8,
            padding: "8px 12px", cursor: "pointer", fontSize: 12,
          }}>Reset</button>
        </div>
      </div>

      {/* ── stat row ── */}
      <div style={{ display: "flex", gap: 12, padding: "20px 24px", flexWrap: "wrap" }}>
        <StatCard label="মোট Progress" value={`${totalPct}%`}
          sub={`${doneCount} / ${TOTAL} task`} color={C.green} />
        <StatCard label="মোট XP" value={state.xp || 0}
          sub="10 XP per task" color={C.accent} />
        <StatCard label="🔥 Streak" value={`${streak}d`}
          sub="consecutive days" color={C.amber} />
        <StatCard label="📅 Attendance" value={state.attendanceDates.length}
          sub="total days studied" color={C.purple} />
        <StatCard label="🎯 Attendance Rate"
          value={`${state.attendanceDates.length > 0 ? Math.round((state.attendanceDates.length / 365) * 100) : 0}%`}
          sub="of 365 days" color={C.red} />
      </div>

      {/* ── overall progress bar ── */}
      <div style={{ padding: "0 24px 20px" }}>
        <div style={{
          background: C.card, borderRadius: 14, padding: "16px 20px",
          border: `1px solid ${C.border}`,
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontWeight: 700 }}>Overall Journey</span>
            <span style={{ color: C.green, fontWeight: 800 }}>{totalPct}%</span>
          </div>
          <div style={{ background: C.border, borderRadius: 99, height: 12, overflow: "hidden" }}>
            <div style={{
              width: `${totalPct}%`, height: "100%",
              background: `linear-gradient(90deg, ${C.accent}, ${C.green})`,
              borderRadius: 99, transition: "width 0.4s ease",
            }} />
          </div>
          <div style={{
            display: "flex", gap: 16, marginTop: 12, flexWrap: "wrap",
          }}>
            {PHASES.map(ph => {
              const phTasks = ALL_TASKS.filter(t => t.phaseId === ph.id);
              const phDone  = phTasks.filter(t => state.done[t.id]).length;
              const phPct   = Math.round((phDone / phTasks.length) * 100);
              return (
                <div key={ph.id} style={{ fontSize: 12, color: C.sub }}>
                  <span style={{ color: ph.color, fontWeight: 700 }}>{ph.label}</span>
                  {" "}{phPct}%
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── tab nav ── */}
      <div style={{
        display: "flex", gap: 4, padding: "0 24px 20px",
      }}>
        {[["tasks","📋 Tasks"],["charts","📊 Charts"],["log","📅 Attendance Log"]].map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)} style={{
            padding: "9px 18px", borderRadius: 10, border: "none", cursor: "pointer",
            fontWeight: 600, fontSize: 13,
            background: tab === id ? C.accent : C.card,
            color: tab === id ? "#fff" : C.sub,
            transition: "all 0.2s",
          }}>{label}</button>
        ))}
      </div>

      {/* ── TASKS TAB ── */}
      {tab === "tasks" && (
        <div style={{ padding: "0 24px", display: "flex", gap: 20, flexWrap: "wrap" }}>
          {/* sidebar */}
          <div style={{ width: 220, flexShrink: 0 }}>
            {PHASES.map(ph => (
              <div key={ph.id} style={{ marginBottom: 8 }}>
                <button onClick={() => { setActivePhase(ph.id); setActiveWeek(ph.weeks[0].id); }}
                  style={{
                    width: "100%", textAlign: "left", padding: "10px 14px",
                    background: activePhase === ph.id ? ph.color + "22" : C.card,
                    border: `1px solid ${activePhase === ph.id ? ph.color : C.border}`,
                    borderRadius: 10, cursor: "pointer", color: C.text,
                    fontWeight: activePhase === ph.id ? 700 : 400, fontSize: 13,
                  }}>
                  <div style={{ color: ph.color, fontSize: 11, fontWeight: 700 }}>{ph.label}</div>
                  {ph.title}
                </button>
                {activePhase === ph.id && ph.weeks.map(wk => {
                  const wkTasks = ALL_TASKS.filter(t => t.weekId === wk.id);
                  const wkDone  = wkTasks.filter(t => state.done[t.id]).length;
                  const full    = wkDone === wkTasks.length;
                  return (
                    <button key={wk.id} onClick={() => setActiveWeek(wk.id)}
                      style={{
                        width: "100%", textAlign: "left", padding: "8px 14px 8px 24px",
                        background: activeWeek === wk.id ? C.surface : "transparent",
                        border: "none", borderLeft: `2px solid ${activeWeek === wk.id ? ph.color : C.border}`,
                        cursor: "pointer", color: full ? C.green : C.sub,
                        fontSize: 12, marginTop: 2,
                      }}>
                      {full ? "✅ " : ""}{wk.label}
                      <span style={{ float: "right", color: C.muted }}>{wkDone}/{wkTasks.length}</span>
                    </button>
                  );
                })}
              </div>
            ))}
          </div>

          {/* task list */}
          <div style={{ flex: 1, minWidth: 280 }}>
            {week && (
              <div style={{
                background: C.card, borderRadius: 16, border: `1px solid ${C.border}`,
                padding: "24px",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
                  <div>
                    <div style={{ fontSize: 18, fontWeight: 800 }}>{week.label}</div>
                    <div style={{ color: C.sub, fontSize: 13, marginTop: 2 }}>{phase.title} · {phase.months}</div>
                  </div>
                  <div style={{ marginLeft: "auto" }}>
                    <Tag color={phase.color}>{phase.label}</Tag>
                  </div>
                </div>

                {/* week progress mini bar */}
                {(() => {
                  const wkTasks = ALL_TASKS.filter(t => t.weekId === week.id);
                  const wkDone  = wkTasks.filter(t => state.done[t.id]).length;
                  const pct     = Math.round((wkDone / wkTasks.length) * 100);
                  return (
                    <div style={{ marginBottom: 20 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: C.sub, marginBottom: 6 }}>
                        <span>সপ্তাহের অগ্রগতি</span>
                        <span style={{ color: phase.color, fontWeight: 700 }}>{pct}%</span>
                      </div>
                      <div style={{ background: C.border, borderRadius: 99, height: 8 }}>
                        <div style={{
                          width: `${pct}%`, height: "100%", background: phase.color,
                          borderRadius: 99, transition: "width 0.3s",
                        }} />
                      </div>
                    </div>
                  );
                })()}

                {/* tasks */}
                {week.tasks.map((task, i) => {
                  const tid    = `${week.id}-t${i}`;
                  const isDone = !!state.done[tid];
                  return (
                    <div key={tid} onClick={() => toggle(tid)}
                      style={{
                        display: "flex", alignItems: "center", gap: 14,
                        padding: "14px 16px", marginBottom: 8,
                        background: isDone ? C.green + "11" : C.surface,
                        border: `1px solid ${isDone ? C.green + "44" : C.border}`,
                        borderRadius: 12, cursor: "pointer",
                        transition: "all 0.2s",
                      }}>
                      <div style={{
                        width: 22, height: 22, borderRadius: 6, flexShrink: 0,
                        background: isDone ? C.green : "transparent",
                        border: `2px solid ${isDone ? C.green : C.muted}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        {isDone && <span style={{ color: "#fff", fontSize: 13, fontWeight: 800 }}>✓</span>}
                      </div>
                      <span style={{
                        fontSize: 14, color: isDone ? C.green : C.text,
                        textDecoration: isDone ? "line-through" : "none",
                        opacity: isDone ? 0.7 : 1,
                      }}>{task}</span>
                      <span style={{ marginLeft: "auto", color: C.muted, fontSize: 12, flexShrink: 0 }}>+10 XP</span>
                    </div>
                  );
                })}

                {/* badge */}
                {weekBadgeEarned && (
                  <div style={{
                    marginTop: 20, padding: "16px 20px",
                    background: `linear-gradient(135deg, ${phase.color}22, ${phase.color}11)`,
                    border: `1px solid ${phase.color}55`, borderRadius: 14,
                    textAlign: "center",
                  }}>
                    <div style={{ fontSize: 24 }}>{week.badge.split(" ")[0]}</div>
                    <div style={{ color: phase.color, fontWeight: 800, marginTop: 4 }}>{week.badge}</div>
                    <div style={{ color: C.sub, fontSize: 12, marginTop: 4 }}>Badge অর্জিত হয়েছে! 🎉</div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── CHARTS TAB ── */}
      {tab === "charts" && (
        <div style={{ padding: "0 24px", display: "flex", flexDirection: "column", gap: 20 }}>
          {/* row 1 — two pies */}
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
            {/* overall done vs remaining */}
            <div style={{
              flex: 1, minWidth: 280, background: C.card,
              border: `1px solid ${C.border}`, borderRadius: 16, padding: 24,
            }}>
              <div style={{ fontWeight: 700, marginBottom: 4 }}>Overall Progress</div>
              <div style={{ color: C.sub, fontSize: 12, marginBottom: 16 }}>সম্পন্ন vs বাকি</div>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={donePieData} cx="50%" cy="50%"
                    innerRadius={55} outerRadius={90}
                    dataKey="value" labelLine={false} label={PieLabel}>
                    {donePieData.map((d, i) => <Cell key={i} fill={d.color} />)}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8 }}
                    labelStyle={{ color: C.text }} itemStyle={{ color: C.sub }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
                {donePieData.map(d => (
                  <div key={d.name} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12 }}>
                    <div style={{ width: 10, height: 10, borderRadius: 3, background: d.color }} />
                    <span style={{ color: C.sub }}>{d.name}</span>
                    <span style={{ color: C.text, fontWeight: 700 }}>{d.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* phase breakdown pie */}
            <div style={{
              flex: 1, minWidth: 280, background: C.card,
              border: `1px solid ${C.border}`, borderRadius: 16, padding: 24,
            }}>
              <div style={{ fontWeight: 700, marginBottom: 4 }}>Phase Breakdown</div>
              <div style={{ color: C.sub, fontSize: 12, marginBottom: 16 }}>৪টি Phase-এ task বিতরণ</div>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={phasePieData} cx="50%" cy="50%"
                    innerRadius={55} outerRadius={90}
                    dataKey="done" labelLine={false} label={PieLabel}>
                    {phasePieData.map((d, i) => <Cell key={i} fill={d.color} />)}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8 }}
                    formatter={(v, n, p) => [`${v} / ${p.payload.value} tasks`, p.payload.name]}
                    labelStyle={{ color: C.text }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                {phasePieData.map(d => (
                  <div key={d.name} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12 }}>
                    <div style={{ width: 10, height: 10, borderRadius: 3, background: d.color }} />
                    <span style={{ color: C.sub }}>{d.name}</span>
                    <span style={{ color: d.color, fontWeight: 700 }}>{Math.round((d.done/d.value)*100)}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* row 2 — XP line chart */}
          <div style={{
            background: C.card, border: `1px solid ${C.border}`,
            borderRadius: 16, padding: 24,
          }}>
            <div style={{ fontWeight: 700, marginBottom: 4 }}>Weekly XP Progress</div>
            <div style={{ color: C.sub, fontSize: 12, marginBottom: 20 }}>প্রতি সপ্তাহে কত XP অর্জিত হয়েছে</div>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
                <XAxis dataKey="name" stroke={C.muted} tick={{ fontSize: 11 }} />
                <YAxis stroke={C.muted} tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8 }}
                  labelStyle={{ color: C.text }} itemStyle={{ color: C.accent }}
                />
                <Line type="monotone" dataKey="xp" stroke={C.accent}
                  strokeWidth={2.5} dot={{ fill: C.accent, r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* row 3 — phase progress bars */}
          <div style={{
            background: C.card, border: `1px solid ${C.border}`,
            borderRadius: 16, padding: 24,
          }}>
            <div style={{ fontWeight: 700, marginBottom: 16 }}>Phase-wise Progress</div>
            {PHASES.map(ph => {
              const phTasks = ALL_TASKS.filter(t => t.phaseId === ph.id);
              const phDone  = phTasks.filter(t => state.done[t.id]).length;
              const pct     = Math.round((phDone / phTasks.length) * 100);
              return (
                <div key={ph.id} style={{ marginBottom: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 13 }}>
                    <span><span style={{ color: ph.color, fontWeight: 700 }}>{ph.label}</span> — {ph.title}</span>
                    <span style={{ color: ph.color, fontWeight: 700 }}>{pct}% ({phDone}/{phTasks.length})</span>
                  </div>
                  <div style={{ background: C.border, borderRadius: 99, height: 10 }}>
                    <div style={{
                      width: `${pct}%`, height: "100%", background: ph.color,
                      borderRadius: 99, transition: "width 0.4s",
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── ATTENDANCE LOG TAB ── */}
      {tab === "log" && (
        <div style={{ padding: "0 24px" }}>
          <div style={{
            background: C.card, border: `1px solid ${C.border}`,
            borderRadius: 16, padding: 24,
          }}>
            <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>📅 Attendance Log</div>
            <div style={{ color: C.sub, fontSize: 13, marginBottom: 20 }}>
              মোট {state.attendanceDates.length} দিন পড়েছো · 🔥 {streak} দিনের streak
            </div>

            {state.attendanceDates.length === 0 ? (
              <div style={{ color: C.muted, textAlign: "center", padding: "40px 0", fontSize: 14 }}>
                এখনো কোনো attendance নেই।<br/>
                <span style={{ fontSize: 12 }}>উপরের "আজকের উপস্থিতি" বোতাম চাপো অথবা task complete করো।</span>
              </div>
            ) : (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {[...state.attendanceDates].sort().reverse().map(d => (
                  <div key={d} style={{
                    background: d === today ? C.green + "22" : C.surface,
                    border: `1px solid ${d === today ? C.green : C.border}`,
                    borderRadius: 8, padding: "6px 12px",
                    fontSize: 13, color: d === today ? C.green : C.sub,
                    fontWeight: d === today ? 700 : 400,
                  }}>
                    {d === today ? "📍 " : ""}{d}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ── streak calculator ──────────────────────────────────────────────────────────
function calcStreak(dates) {
  if (!dates || dates.length === 0) return 0;
  const sorted = [...new Set(dates)].sort().reverse();
  let streak = 0;
  let cur = new Date();
  cur.setHours(0, 0, 0, 0);
  for (const d of sorted) {
    const dd = new Date(d);
    dd.setHours(0, 0, 0, 0);
    const diff = Math.round((cur - dd) / 86400000);
    if (diff === 0 || diff === streak) { streak++; cur = dd; }
    else break;
  }
  return streak;
}
