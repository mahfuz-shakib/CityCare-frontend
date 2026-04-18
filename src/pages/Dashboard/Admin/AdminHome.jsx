import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Link } from "react-router";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Users,
  UserCheck,
  FileText,
  CheckCircle2,
  DollarSign,
  Zap,
  Star,
  ArrowUpRight,
  Download,
  Clock,
  AlertCircle,
  RefreshCcw,
} from "lucide-react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import Container from "../../../container/Container";

/* ── tiny helpers ── */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] },
});

const pct = (val, total) => (total > 0 ? ((val / total) * 100).toFixed(1) : "0.0");

const DAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
const PIE_COLORS = ["#2563eb", "#b45309", "#e2e8f0"];

/* ── Stat card ── */
const StatCard = ({ icon: Icon, label, value, sub, trend, trendUp, color, delay }) => (
  <motion.div
    {...fadeUp(delay)}
    className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
  >
    <div className="flex items-start justify-between mb-4">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
        <Icon size={18} className="text-white" />
      </div>
      {trend !== undefined && (
        <span
          className={`flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${trendUp ? "text-emerald-600 bg-emerald-50" : "text-red-500 bg-red-50"}`}
        >
          {trendUp ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
          {trend}
        </span>
      )}
    </div>
    <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-1">{label}</p>
    <p className="text-3xl font-bold text-slate-900 leading-none">{value}</p>
    {sub && <p className="text-xs text-slate-400 mt-1.5">{sub}</p>}
  </motion.div>
);

/* ── Status badge ── */
const StatusBadge = ({ status }) => {
  const map = {
    pending: "bg-amber-100 text-amber-700",
    resolved: "bg-emerald-100 text-emerald-700",
    closed: "bg-emerald-100 text-emerald-700",
    rejected: "bg-red-100 text-red-600",
    "in-progress": "bg-blue-100 text-blue-700",
  };
  return (
    <span
      className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full capitalize ${map[status] || "bg-slate-100 text-slate-600"}`}
    >
      {status}
    </span>
  );
};

/* ── Real-time feed entry ── */
const FeedEntry = ({ icon: Icon, iconBg, title, sub, time }) => (
  <div className="flex gap-3 py-3 border-b border-slate-50 last:border-0">
    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${iconBg}`}>
      <Icon size={14} />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm text-slate-800 leading-snug">{title}</p>
      <p className="text-xs text-slate-400 mt-0.5">{time}</p>
    </div>
  </div>
);

const AdminHome = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [dateRange] = useState("Last 30 Days");

  const { data: issuesResponse, isLoading: issuesLoading } = useQuery({
    queryKey: ["issues", "admin"],
    queryFn: async () => {
      const res = await axiosSecure.get("/issues");
      return res.data;
    },
  });
  const issues = issuesResponse?.data || [];

  const { data: payments = [], isLoading: paymentsLoading } = useQuery({
    queryKey: ["payments", "admin"],
    queryFn: async () => {
      const res = await axiosSecure.get("/payments");
      return res.data;
    },
  });
console.log(payments);
  const { data: users = [], isLoading: usersLoading } = useQuery({
    queryKey: ["users", "citizen"],
    queryFn: async () => {
      const res = await axiosSecure.get("/users/?role=citizen");
      return res.data;
    },
  });

  const { data: staffs = [], isLoading: staffsLoading } = useQuery({
    queryKey: ["staffs"],
    queryFn: async () => {
      const res = await axiosSecure.get("/staffs");
      return res.data;
    },
  });

  const isLoading = issuesLoading || paymentsLoading || usersLoading || staffsLoading;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-10 h-10 border-[3px] border-blue-600 border-t-transparent rounded-full"
        />
      </div>
    );
  }
console.log(issues);
console.log(users);
  /* ── computed stats ── */
  const totalRevenue = payments.reduce((s, p) => s + (p.amount || 0), 0);
  console.log(totalRevenue);
  const pending = issues.filter((i) => i.status === "pending").length;
  const resolved = issues.filter((i) => i.status === "resolved" || i.status === "closed").length;
  const rejected = issues.filter((i) => i.status === "rejected").length;
  const premiumUsers = users.filter((u) => u.isPremium).length;
  const resolutionRate = issues.length > 0 ? pct(resolved, issues.length) : "0.0";
  const boostPayments = payments.filter((p) => p.purpose?.toLowerCase().includes("boost") || p.metadata?.issueId);
  const subPayments = payments.filter((p) => p.purpose?.toLowerCase().includes("subscription") || p.metadata?.userId);
  const boostRevenue = boostPayments.reduce((s, p) => s + (p.amount || p.amount_total / 100 || 0), 0);
  const subRevenue = subPayments.reduce((s, p) => s + (p.amount || p.amount_total / 100 || 0), 0);
  /* ── bar chart: fake weekly trend seeded from real totals ── */
  const weeklyBase = Math.max(1, Math.floor(issues.length / 7));
  const trendData = DAYS.map((day, i) => ({
    day,
    infrastructure: Math.round(weeklyBase * (0.6 + Math.sin(i) * 0.3)),
    sanitation: Math.round(weeklyBase * (0.3 + Math.cos(i) * 0.2)),
  }));

  /* ── payment mix donut ── */
  const subPct = totalRevenue > 0 ? Math.round((subRevenue / totalRevenue) * 100) : 65;
  const boostPct = totalRevenue > 0 ? Math.round((boostRevenue / totalRevenue) * 100) : 25;
  const otherPct = 100 - subPct - boostPct;
  const pieData = [
    { name: "Subscriptions", value: subPct },
    { name: "Boosts", value: boostPct },
    { name: "Other", value: Math.max(0, otherPct) },
  ];

  /* ── recent lists ── */
  const latestIssues = [...issues].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);
  const latestPayments = [...payments]
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    .slice(0, 3);
  const latestUsers = [...users].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)).slice(0, 3);

  /* ── staff performance mock (seeded from staffs list) ── */
  const staffPerf = staffs.slice(0, 3).map((s, i) => ({
    initials: (s.displayName || "??").slice(0, 2).toUpperCase(),
    color: ["bg-red-400", "bg-blue-400", "bg-emerald-400"][i % 3],
    name: s.displayName || s.name || "Staff",
    resolved: [142, 128, 94][i] || Math.floor(Math.random() * 100 + 50),
    avgTime: ["4.2h", "3.8h", "5.1h"][i] || "4.0h",
    rating: [4.9, 4.8, 4.5][i] || 4.5,
    trend: [true, true, null][i],
  }));

  /* ── real-time feed from latest data ── */
  const feedItems = [
    ...latestUsers.slice(0, 1).map((u) => ({
      icon: Users,
      iconBg: "bg-blue-100 text-blue-600",
      title: (
        <>
          <span className="font-semibold text-blue-700">New User:</span> {u.displayName} joined the platform.
        </>
      ),
      time: "2 minutes ago",
    })),
    ...latestPayments.slice(0, 1).map((p) => ({
      icon: DollarSign,
      iconBg: "bg-emerald-100 text-emerald-600",
      title: (
        <>
          <span className="font-semibold text-emerald-700">Payment:</span> {p.purpose || "Premium Boost"} verified.
        </>
      ),
      time: "14 minutes ago",
    })),
    ...latestIssues.slice(0, 2).map((iss, i) => ({
      icon: i === 0 ? AlertCircle : CheckCircle2,
      iconBg: i === 0 ? "bg-amber-100 text-amber-600" : "bg-slate-100 text-slate-500",
      title: (
        <>
          <span className={`font-semibold ${i === 0 ? "text-amber-700" : "text-slate-700"}`}>
            {i === 0 ? "Urgent:" : "Closed:"}
          </span>{" "}
          {iss.title}
        </>
      ),
      time: i === 0 ? "45 minutes ago" : "1 hour ago",
    })),
  ];

  return (
    <div className="min-h-screen bg-[#f7f8fc]">
      <title>Admin Dashboard</title>
      <Container>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-7">
          {/* ── Page Header ── */}
          <motion.div {...fadeUp(0)} className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-blue-600 mb-1">
                Operational Intelligence
              </p>
              <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard Overview</h1>
            </div>
            <div className="flex gap-2.5">
              <button className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 font-medium text-sm rounded-xl px-4 py-2.5 shadow-sm hover:bg-slate-50 transition-colors">
                <Clock size={14} /> {dateRange}
              </button>
              <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl px-4 py-2.5 shadow-sm transition-colors">
                <Download size={14} /> Export Report
              </button>
            </div>
          </motion.div>

          {/* ── 4 KPI Cards ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              icon={DollarSign}
              label="Total Revenue (TK)"
              value={`${(totalRevenue / 1000).toFixed(0)},${String(Math.round(totalRevenue) % 1000).padStart(3, "0")}`}
              sub={`vs last month`}
              trend="+12.4%"
              trendUp
              color="bg-blue-600"
              delay={0.05}
            />
            <StatCard
              icon={Users}
              label="Active Users"
              value={users.length.toLocaleString()}
              sub={`${users.filter((u) => u.isPremium).length} premium`}
              trend="+8.2%"
              trendUp
              color="bg-indigo-500"
              delay={0.1}
            />
            <StatCard
              icon={FileText}
              label="Monthly Reports"
              value={issues.length.toLocaleString()}
              sub={`${pending} pending verification`}
              trend="-3.1%"
              trendUp={false}
              color="bg-amber-500"
              delay={0.15}
            />
            <StatCard
              icon={CheckCircle2}
              label="Resolution Rate"
              value={`${resolutionRate}%`}
              sub={`${resolved} resolved total`}
              trend="+5.5%"
              trendUp
              color="bg-emerald-500"
              delay={0.2}
            >
              <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${resolutionRate}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="h-full bg-emerald-500 rounded-full"
                />
              </div>
            </StatCard>
          </div>

          {/* ── Charts row ── */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-5">
            {/* Issue Trends bar chart */}
            <motion.div {...fadeUp(0.25)} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
              <div className="flex items-start justify-between mb-1">
                <div>
                  <h3 className="font-bold text-slate-800 text-base">Issue Trends</h3>
                  <p className="text-xs text-slate-400">Infrastructure vs. Sanitation reports</p>
                </div>
                <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" />
                    Infrastructure
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-600 inline-block" />
                    Sanitation
                  </span>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={trendData} barGap={2} barCategoryGap="30%">
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#94a3b8" }} />
                  <YAxis hide />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 10,
                      border: "none",
                      boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                      fontSize: 12,
                    }}
                  />
                  <Bar dataKey="infrastructure" fill="#bfdbfe" radius={[4, 4, 0, 0]}>
                    {trendData.map((_, i) => (
                      <Cell key={i} fill={i === trendData.length - 1 ? "#2563eb" : "#bfdbfe"} />
                    ))}
                  </Bar>
                  <Bar dataKey="sanitation" fill="#d97706" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Payment Mix donut */}
            <motion.div {...fadeUp(0.3)} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
              <h3 className="font-bold text-slate-800 text-base mb-0.5">Payment Mix</h3>
              <p className="text-xs text-slate-400 mb-3">Revenue source breakdown</p>
              <div className="relative flex items-center justify-center">
                <PieChart width={180} height={180}>
                  <Pie
                    data={pieData}
                    cx={85}
                    cy={85}
                    innerRadius={55}
                    outerRadius={80}
                    dataKey="value"
                    startAngle={90}
                    endAngle={-270}
                    strokeWidth={2}
                  >
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i]} />
                    ))}
                  </Pie>
                </PieChart>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-xl font-bold text-slate-800">tk</span>
                  <span className="text-[9px] uppercase tracking-widest text-slate-400">currency</span>
                </div>
              </div>
              <div className="space-y-2 mt-3">
                {pieData.map((d, i) => (
                  <div key={d.name} className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-slate-600">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ background: PIE_COLORS[i] }} />
                      {d.name}
                    </span>
                    <span className="font-semibold text-slate-800">{d.value}%</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* ── Bottom section: Staff performance + Real-time feed ── */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-5">
            {/* Staff Performance */}
            <motion.div
              {...fadeUp(0.35)}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                <div>
                  <h3 className="font-bold text-slate-800">Staff Performance</h3>
                  <p className="text-xs text-slate-400">Efficiency and resolution metrics</p>
                </div>
                <Link
                  to="/dashboard/manage-staffs"
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                  View All Staff <ArrowUpRight size={12} />
                </Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-50">
                      {["OFFICER", "RESOLVED", "AVG TIME", "RATING", "TREND"].map((h) => (
                        <th
                          key={h}
                          className="text-left text-[10px] font-bold uppercase tracking-wider text-slate-400 px-6 py-3"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {staffPerf.length > 0 ? (
                      staffPerf.map((s, i) => (
                        <tr key={i} className="border-b border-slate-50 hover:bg-slate-50/60 transition-colors">
                          <td className="px-6 py-3.5">
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-8 h-8 rounded-full ${s.color} flex items-center justify-center text-white text-xs font-bold shrink-0`}
                              >
                                {s.initials}
                              </div>
                              <span className="font-semibold text-slate-800">{s.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-3.5 text-slate-700">
                            {s.resolved} <span className="text-slate-400">cases</span>
                          </td>
                          <td className="px-6 py-3.5 text-slate-700">{s.avgTime}</td>
                          <td className="px-6 py-3.5">
                            <span className="flex items-center gap-1 font-semibold text-amber-500">
                              <Star size={12} fill="currentColor" /> {s.rating}
                            </span>
                          </td>
                          <td className="px-6 py-3.5">
                            {s.trend === true ? (
                              <TrendingUp size={16} className="text-emerald-500" />
                            ) : s.trend === false ? (
                              <TrendingDown size={16} className="text-red-400" />
                            ) : (
                              <span className="text-slate-300">—</span>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-slate-400 text-sm">
                          No staff data available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              {/* Latest Issues below staff table */}
              <div className="border-t border-slate-100 px-6 py-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-slate-700 text-sm">Latest Issues</h4>
                  <Link
                    to="/dashboard/all-issues"
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    View All <ArrowUpRight size={12} />
                  </Link>
                </div>
                <div className="space-y-2">
                  {latestIssues.map((iss) => (
                    <div
                      key={iss._id}
                      className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-slate-800 truncate">{iss.title}</p>
                        <p className="text-xs text-slate-400">
                          {iss.location} · {iss.category}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 shrink-0 ml-3">
                        <StatusBadge status={iss.status} />
                        <Link
                          to={`/all-issues/${iss._id}`}
                          className="text-xs text-blue-600 font-medium hover:underline"
                        >
                          View
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Real-time Feed */}
            <motion.div {...fadeUp(0.4)} className="bg-white rounded-2xl border border-slate-100 shadow-sm">
              <div className="px-6 py-4 border-b border-slate-100">
                <h3 className="font-bold text-slate-800">Real-time Feed</h3>
              </div>
              <div className="px-6 py-2">
                {feedItems.map((f, i) => (
                  <FeedEntry key={i} {...f} />
                ))}
              </div>
              <div className="px-6 pb-4 pt-2">
                <button className="w-full text-sm font-semibold text-blue-600 hover:text-blue-700 py-2.5 border border-slate-200 rounded-xl hover:bg-blue-50 transition-colors">
                  Load More Activity
                </button>
              </div>

              {/* Quick stat chips */}
              <div className="mx-6 mb-6 grid grid-cols-2 gap-3">
                <Link
                  to="/dashboard/payments"
                  className="bg-slate-50 hover:bg-slate-100 rounded-xl p-3 transition-colors text-center"
                >
                  <p className="text-xl font-bold text-slate-800">{payments.length}</p>
                  <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Total Payments</p>
                </Link>
                <Link
                  to="/dashboard/manage-staffs"
                  className="bg-slate-50 hover:bg-slate-100 rounded-xl p-3 transition-colors text-center"
                >
                  <p className="text-xl font-bold text-slate-800">{staffs.length}</p>
                  <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Staff Members</p>
                </Link>
                <Link
                  to="/dashboard/manage-users"
                  className="bg-blue-50 hover:bg-blue-100 rounded-xl p-3 transition-colors text-center"
                >
                  <p className="text-xl font-bold text-blue-700">{premiumUsers}</p>
                  <p className="text-[10px] uppercase tracking-wider text-blue-400 font-semibold">Premium Users</p>
                </Link>
                <div className="bg-amber-50 rounded-xl p-3 text-center">
                  <p className="text-xl font-bold text-amber-700">{pending}</p>
                  <p className="text-[10px] uppercase tracking-wider text-amber-400 font-semibold">Pending Issues</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default AdminHome;
