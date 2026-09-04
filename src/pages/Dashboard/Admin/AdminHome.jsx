import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Link } from "react-router";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from "recharts";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
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
import Container from "../../../container/Container";
import IssueStatusBadge from "../../../components/IssueStatusBadge";
import PageHeader from "../../../components/PageHeader";
import { formatCategory } from "../../../constants/categories";

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
    </div>
    <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-1">{label}</p>
    <p className="text-3xl font-bold text-slate-900 leading-none">{value}</p>
    {sub && <p className="text-xs text-slate-400 mt-1.5">{sub}</p>}
  </motion.div>
);

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
  const axiosSecure = useAxiosSecure();
  const { data: issuesData, isLoading: issuesLoading } = useQuery({
    queryKey: ["issues", "admin"],
    queryFn: async () => {
      const res = await axiosSecure.get("/issues");
      return res.data;
    },
  });
  const issues = issuesData?.data || [];
  const { data: metrics = {}, isLoading: metricsLoading } = useQuery({
    queryKey: ["issues", "metrics", "admin"],
    queryFn: async () => (await axiosSecure.get("/issues/metrics")).data,
  });

  const { data: payments = [], isLoading: paymentsLoading } = useQuery({
    queryKey: ["payments", "admin"],
    queryFn: async () => {
      const res = await axiosSecure.get("/payments");
      return res.data;
    },
  });
  const { data: users = [], isLoading: usersLoading } = useQuery({
    queryKey: ["users", "citizen"],
    queryFn: async () => {
      const res = await axiosSecure.get("/users/?role=citizen");
      return res.data;
    },
  });
  const { data: staffResult, isLoading: staffsLoading } = useQuery({
    queryKey: ["staffs"],
    queryFn: async () => {
      const res = await axiosSecure.get("/staffs");
      return res.data;
    },
  });
  const staffs = staffResult?.data || [];

  const isLoading = issuesLoading || metricsLoading || paymentsLoading || usersLoading || staffsLoading;

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

  /* ── computed stats ── */
  const totalRevenue = payments?.reduce((s, p) => s + (p.amount || 0), 0);
  const pending = issues.filter((i) => i.status === "pending").length;
  const resolved = issues.filter((i) => i.status === "resolved" || i.status === "closed").length;
  const premiumUsers = users.filter((u) => u.isPremium).length;
  const resolutionRate = issues.length > 0 ? pct(resolved, issues.length) : "0.0";
  const boostPayments = payments.filter((p) => p.purpose?.toLowerCase().includes("boost") || p.metadata?.issueId);
  const subPayments = payments.filter((p) => p.purpose?.toLowerCase().includes("subscription") || p.metadata?.userId);
  const boostRevenue = boostPayments.reduce((s, p) => s + (p.amount || p.amount_total / 100 || 0), 0);
  const subRevenue = subPayments.reduce((s, p) => s + (p.amount || p.amount_total / 100 || 0), 0);
  /* ── bar chart: fake weekly trend seeded from real totals ── */
  const categoryData = metrics.categoryStatistics || [];

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
  const latestIssues = [...issues].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 3);
  const latestPayments = [...payments]
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    .slice(0, 3);
  const latestUsers = [...users].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)).slice(0, 3);

  const handleExportPDF = () => {
    const document = new jsPDF();
    document.setFontSize(18);
    document.text("CityCare Admin Dashboard Report", 14, 18);
    document.setFontSize(10);
    document.setTextColor(100);
    document.text(`Generated: ${new Date().toLocaleString()}`, 14, 25);
    autoTable(document, {
      startY: 34,
      head: [["Metric", "Value"]],
      body: [
        ["Total issues", issues.length],
        ["Resolved issues", resolved],
        ["Pending issues", pending],
        ["Resolution rate", `${resolutionRate}%`],
        ["Total citizens", users.length],
        ["Staff members", staffs.length],
        ["Total payments", payments.length],
      ],
      theme: "grid",
      headStyles: { fillColor: [0, 55, 176] },
    });

    let nextY = document.lastAutoTable.finalY + 10;
    autoTable(document, {
      startY: nextY,
      head: [["Latest Issues", "Category", "Status"]],
      body: latestIssues.map((issue) => [issue.title, formatCategory(issue.category), issue.status]),
      theme: "grid",
      headStyles: { fillColor: [0, 55, 176] },
    });

    nextY = document.lastAutoTable.finalY + 10;
    autoTable(document, {
      startY: nextY,
      head: [["Latest Payments", "Purpose", "Status"]],
      body: latestPayments.map((payment) => [
        payment.customerEmail || "Unknown customer",
        payment.purpose || "Unknown",
        payment.paymentStatus || payment.status || "Unknown",
      ]),
      theme: "grid",
      headStyles: { fillColor: [0, 55, 176] },
    });

    nextY = document.lastAutoTable.finalY + 10;
    autoTable(document, {
      startY: nextY,
      head: [["Latest Citizens", "Email", "Account"]],
      body: latestUsers.map((user) => [
        user.displayName || "Unnamed",
        user.email || "-",
        user.isBlocked ? "Blocked" : "Active",
      ]),
      theme: "grid",
      headStyles: { fillColor: [0, 55, 176] },
    });

    document.save("citycare-admin-dashboard-report.pdf");
  };

  /* ── staff performance mock (seeded from staffs list) ── */
  const staffPerf = staffs.slice(0, 3).map((s, i) => ({
    initials: (s.displayName || "??").slice(0, 2).toUpperCase(),
    color: ["bg-red-400", "bg-blue-400", "bg-emerald-400"][i % 3],
    name: s.displayName || s.name || "Staff",
    resolved: s.resolvedTasks || 0,
    avgTime: `${s.averageDays || 4}h`,
  }));

  return (
    <div className="min-h-screen bg-[#f7f8fc]">
      <title>Admin Dashboard</title>
      <Container>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-7">
          {/* ── Page Header ── */}
          <PageHeader
            eyebrow="Operational Intelligence"
            title="Admin Dashboard Overview"
            actions={
              <div>
                <button
                  onClick={handleExportPDF}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl px-4 py-2.5 shadow-sm transition-colors cursor-pointer"
                >
                  <Download size={14} /> Export Report
                </button>
              </div>
            }
          />

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
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px_250px] gap-5">
            {/* Issue Trends bar chart */}
            <motion.div {...fadeUp(0.25)} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
              <div className="flex items-start justify-between mb-1">
                <div>
                  <h3 className="font-bold text-slate-800 text-base">Issue Trends</h3>
                  <p className="text-xs text-slate-400">Reported and resolved issues by category</p>
                </div>
                <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" />
                    Reported
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-600 inline-block" />
                    Resolved
                  </span>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={categoryData} barGap={2} barCategoryGap="24%">
                  <XAxis
                    dataKey="category"
                    tickFormatter={formatCategory}
                    interval={0}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: "#94a3b8" }}
                  />
                  <YAxis hide />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 10,
                      border: "none",
                      boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                      fontSize: 12,
                    }}
                  />
                  <Bar dataKey="reportedCount" name="Reported" fill="#2563eb" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="resolvedCount" name="Resolved" fill="#d97706" radius={[4, 4, 0, 0]} />
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
            {/* Real-time Feed */}
            <motion.div {...fadeUp(0.4)} className=" h-fit bg-white rounded-2xl border border-slate-100 shadow-sm">
              <div className="px-6 py-4 border-b border-slate-100">
                <h3 className="font-bold text-slate-800">Real-time Feed</h3>
              </div>
              <div className="mx-6 mb-6 grid gap-3">
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

          {/* ── Bottom section:*/}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-5">
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
                      {["OFFICER", "RESOLVED", "AVG TIME"].map((h) => (
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
            </motion.div>

            <motion.div
              {...fadeUp(0.35)}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
            >
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
                        <IssueStatusBadge status={iss.status} />
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
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <motion.div
              {...fadeUp(0.45)}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                <div>
                  <h3 className="font-bold text-slate-800">Latest Payments</h3>
                  <p className="text-xs text-slate-400">Most recent financial activity</p>
                </div>
                <Link to="/dashboard/payments" className="text-xs font-semibold text-blue-600 hover:text-blue-700">
                  View All
                </Link>
              </div>
              <div className="overflow-x-auto">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Customer</th>
                      <th>Purpose</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {latestPayments.length ? (
                      latestPayments.map((payment) => (
                        <tr key={payment._id || payment.sessionId || payment.id}>
                          <td className="font-medium text-slate-700">{payment.customerEmail || "Unknown"}</td>
                          <td className="capitalize text-slate-600">{payment.purpose || "Unknown"}</td>
                          <td className="capitalize text-slate-600">
                            {payment.paymentStatus || payment.status || "Unknown"}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={3} className="text-center text-slate-400">
                          No payment data
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>

            <motion.div
              {...fadeUp(0.5)}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                <div>
                  <h3 className="font-bold text-slate-800">Latest Citizens</h3>
                  <p className="text-xs text-slate-400">Recently registered community members</p>
                </div>
                <Link to="/dashboard/manage-users" className="text-xs font-semibold text-blue-600 hover:text-blue-700">
                  View All
                </Link>
              </div>
              <div className="overflow-x-auto">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Citizen</th>
                      <th>Email</th>
                      <th>Account</th>
                    </tr>
                  </thead>
                  <tbody>
                    {latestUsers.length ? (
                      latestUsers.map((citizen) => (
                        <tr key={citizen._id || citizen.email}>
                          <td className="font-medium text-slate-700">{citizen.displayName || "Unnamed"}</td>
                          <td className="text-slate-600">{citizen.email || "-"}</td>
                          <td className="text-slate-600">{citizen.isBlocked ? "Blocked" : "Active"}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={3} className="text-center text-slate-400">
                          No citizen data
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default AdminHome;
