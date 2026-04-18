import React, { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import jsPDF from "jspdf";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from "recharts";
import {
  Download, SlidersHorizontal, Search, ChevronsUpDown,
  Zap, Star, TrendingUp, TrendingDown, CreditCard, ChevronLeft, ChevronRight, MoreVertical,
} from "lucide-react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Container from "../../../container/Container";

/* ── helpers ── */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] },
});

const formatDate = (ts) => {
  if (!ts) return "—";
  const d = new Date(ts);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};
const formatDateTime = (ts) => {
  if (!ts) return "—";
  const d = new Date(ts);
  return {
    date: d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    time: d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
  };
};

/* ── avatar initials ── */
const initials = (email = "") => email.slice(0, 2).toUpperCase();
const avatarColor = (email = "") => {
  const colors = ["bg-blue-500", "bg-violet-500", "bg-emerald-500", "bg-amber-500", "bg-rose-500", "bg-cyan-500"];
  return colors[email.charCodeAt(0) % colors.length];
};

/* ── Status chip ── */
const StatusChip = ({ status }) => {
  const s = (status || "").toLowerCase();
  if (s === "paid" || s === "success" || s === "complete")
    return <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700">SUCCESS</span>;
  if (s === "pending" || s === "processing")
    return <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-700">PENDING</span>;
  return <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-red-100 text-red-600">FAILED</span>;
};

/* ── Purpose chip ── */
const PurposeChip = ({ purpose }) => {
  const isBoost = purpose?.toLowerCase().includes("boost");
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-lg
      ${isBoost ? "bg-violet-100 text-violet-700" : "bg-blue-50 text-blue-700"}`}>
      {isBoost ? <Zap size={11} fill="currentColor" /> : <Star size={11} />}
      {purpose || "Unknown"}
    </span>
  );
};

/* ── Invoice PDF (unchanged logic) ── */
const downloadInvoicePDF = (payment) => {
  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageWidth = pdf.internal.pageSize.getWidth();
  let y = 20;
  pdf.setFillColor(34, 197, 94);
  pdf.rect(0, 0, pageWidth, 50, "F");
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(28);
  pdf.setTextColor(255, 255, 255);
  pdf.text("PAYMENT INVOICE", pageWidth / 2, 20, { align: "center" });
  pdf.setFontSize(12);
  pdf.text("CityCare - City Issue Management", pageWidth / 2, 32, { align: "center" });
  pdf.setTextColor(0, 0, 0);
  y = 60;
  pdf.setFont("helvetica", "bold"); pdf.setFontSize(14);
  pdf.text("INVOICE DETAILS", 20, y); y += 10;
  pdf.setFont("helvetica", "normal"); pdf.setFontSize(10);
  [
    ["Transaction ID:", payment.sessionId || payment.id || "N/A"],
    ["Date:", new Date(payment.createdAt || payment.created).toLocaleString()],
    ["Customer Email:", payment.customerEmail || "N/A"],
  ].forEach(([label, val]) => {
    pdf.setTextColor(100, 100, 100); pdf.text(label, 20, y);
    pdf.setTextColor(0, 0, 0); pdf.setFont("helvetica", "bold"); pdf.text(val, 65, y);
    pdf.setFont("helvetica", "normal"); y += 8;
  });
  y += 5;
  pdf.setFillColor(240, 253, 250);
  pdf.rect(20, y, pageWidth - 40, 25, "F");
  pdf.setFontSize(10); pdf.setTextColor(100, 100, 100); pdf.text("TOTAL AMOUNT", 30, y + 8);
  pdf.setFont("helvetica", "bold"); pdf.setFontSize(18); pdf.setTextColor(22, 163, 74);
  pdf.text(`${payment.amount || (payment.amount_total / 100) || 0} ${(payment.currency || "BDT").toUpperCase()}`, 30, y + 20);
  y += 35;
  pdf.save(`invoice-${payment.sessionId || payment.id || "payment"}.pdf`);
};

const Payments = () => {
  const axiosSecure = useAxiosSecure();
  const [filters, setFilters] = useState({ purpose: "all", status: "all", search: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [chartView, setChartView] = useState("daily"); // daily | weekly
  const pageSize = 10;

  const { data, isLoading } = useQuery({
    queryKey: ["payments", "admin"],
    queryFn: async () => { const res = await axiosSecure.get("/payments"); return res.data; },
  });
  const payments = data || [];

  /* ── stats ── */
  const totalRevenue = payments.reduce((s, p) => s + (p.amount || p.amount_total / 100 || 0), 0);
  const subPayments = payments.filter(p => p.purpose?.toLowerCase().includes("subscription") || p.metadata?.userId);
  const boostPayments = payments.filter(p => p.purpose?.toLowerCase().includes("boost") || p.metadata?.issueId);
  const subRevenue = subPayments.reduce((s, p) => s + (p.amount || p.amount_total / 100 || 0), 0);
  const boostRevenue = boostPayments.reduce((s, p) => s + (p.amount || p.amount_total / 100 || 0), 0);

  /* ── bar chart data ── */
  const chartData = useMemo(() => {
    const days = 30;
    return Array.from({ length: days }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (days - 1 - i));
      const label = `${d.getDate()} ${d.toLocaleString("default", { month: "short" })}`;
      const dayPayments = payments.filter(p => {
        const pd = new Date(p.createdAt || p.created || 0);
        return pd.toDateString() === d.toDateString();
      });
      return {
        label,
        amount: dayPayments.reduce((s, p) => s + (p.amount || p.amount_total / 100 || 0), 0),
        isToday: i === days - 1,
      };
    });
  }, [payments]);

  /* ── filtered & paginated ── */
  const filtered = useMemo(() => {
    return payments
      .filter(p => {
        if (filters.purpose !== "all") {
          const pl = String((p.purpose || "").toLowerCase());
          const match =
            (filters.purpose === "boost" && (pl.includes("boost") || p.metadata?.issueId)) ||
            (filters.purpose === "subscription" && (pl.includes("subscription") || p.metadata?.userId)) ||
            (filters.purpose === "unknown" && pl === "unknown");
          if (!match) return false;
        }
        if (filters.status !== "all") {
          const s = String((p.paymentStatus || p.status || "paid").toLowerCase());
          if (s !== filters.status) return false;
        }
        if (filters.search) {
          const s = filters.search.toLowerCase();
          return (
            (p.customerEmail || "").toLowerCase().includes(s) ||
            (p.sessionId || p.id || "").toLowerCase().includes(s) ||
            (p.metadata?.issueTitle || "").toLowerCase().includes(s)
          );
        }
        return true;
      })
      .sort((a, b) => new Date(b.createdAt || b.created || 0) - new Date(a.createdAt || a.created || 0));
  }, [payments, filters]);

  React.useEffect(() => setCurrentPage(1), [filters]);
  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginatedData = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-50">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-10 h-10 border-[3px] border-blue-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f8fc]">
      <title>Payments Dashboard</title>
      <Container>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">

          {/* ── Header ── */}
          <motion.div {...fadeUp(0)} className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-blue-600 mb-1">Financial Oversight</p>
              <h1 className="text-3xl font-bold text-slate-900">Payments Dashboard</h1>
            </div>
            <div className="flex items-center gap-2.5">
              <button className="flex items-center gap-2 bg-white border border-slate-200 text-slate-600 text-sm font-medium rounded-xl px-4 py-2.5 shadow-sm hover:bg-slate-50 transition-colors">
                📅 Oct 1, 2023 – Oct 31, 2023
              </button>
              <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl px-4 py-2.5 shadow-sm transition-colors">
                <Download size={14} /> Export to CSV
              </button>
            </div>
          </motion.div>

          {/* ── 3 KPI cards ── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: CreditCard, label: "Total Revenue This Month", value: `tk ${totalRevenue.toLocaleString("en-BD", { minimumFractionDigits: 2 })}`, sub: null, trend: "+12.4%", trendUp: true, color: "bg-blue-600" },
              { icon: Star, label: "Subscription Earnings", value: `tk ${subRevenue.toLocaleString("en-BD", { minimumFractionDigits: 2 })}`, sub: `from ${subPayments.length} active members`, trend: "+8.1%", trendUp: true, color: "bg-indigo-500" },
              { icon: Zap, label: "Priority Boost Earnings", value: `tk ${boostRevenue.toLocaleString("en-BD", { minimumFractionDigits: 2 })}`, sub: `from ${boostPayments.length} issue boosts`, trend: "+24.0%", trendUp: true, color: "bg-violet-500" },
            ].map((c, i) => (
              <motion.div key={c.label} {...fadeUp(0.05 + i * 0.05)} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${c.color}`}>
                    <c.icon size={16} className="text-white" />
                  </div>
                  <span className={`flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full ${c.trendUp ? "text-emerald-600 bg-emerald-50" : "text-red-500 bg-red-50"}`}>
                    {c.trendUp ? <TrendingUp size={10} /> : <TrendingDown size={10} />} {c.trend}
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-medium mb-1">{c.label}</p>
                <p className="text-2xl font-bold text-slate-900">{c.value}</p>
                {c.sub && <p className="text-xs text-slate-400 mt-1">{c.sub}</p>}
                {/* mini progress bar */}
                <div className="w-full bg-slate-100 rounded-full h-1 mt-3 overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: "70%" }}
                    transition={{ duration: 1, delay: 0.6 + i * 0.1 }} className={`h-full rounded-full ${c.color}`} />
                </div>
              </motion.div>
            ))}
          </div>

          {/* ── Revenue Trends bar chart ── */}
          <motion.div {...fadeUp(0.2)} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
            <div className="flex items-start justify-between mb-1">
              <div>
                <h3 className="font-bold text-slate-800">Revenue Trends</h3>
                <p className="text-xs text-slate-400">Daily collection performance over time</p>
              </div>
              <div className="flex bg-slate-100 rounded-lg p-1 gap-1">
                {["daily", "weekly"].map(v => (
                  <button key={v} onClick={() => setChartView(v)}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-md transition-all capitalize
                      ${chartView === v ? "bg-blue-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
                    {v}
                  </button>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData} barCategoryGap="20%">
                <XAxis dataKey="label" axisLine={false} tickLine={false}
                  tick={{ fontSize: 10, fill: "#94a3b8" }}
                  interval={Math.floor(chartData.length / 6)} />
                <YAxis hide />
                <Tooltip formatter={(v) => [`৳${v}`, "Revenue"]}
                  contentStyle={{ borderRadius: 10, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", fontSize: 12 }} />
                <Bar dataKey="amount" radius={[3, 3, 0, 0]}>
                  {chartData.map((d, i) => (
                    <Cell key={i} fill={d.isToday ? "#2563eb" : "#bfdbfe"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="flex items-center gap-5 mt-2 text-xs text-slate-500 font-medium">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block" />Total Revenue</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-200 inline-block" />Projected Growth</span>
            </div>
          </motion.div>

          {/* ── Transactions table ── */}
          <motion.div {...fadeUp(0.25)} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            {/* Table header + filters */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-800 text-base">Recent Transactions</h3>
              <div className="flex items-center gap-2">
                {/* Search */}
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    placeholder="Search…"
                    className="pl-8 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl w-48 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    value={filters.search}
                    onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
                  />
                </div>
                {/* Purpose filter */}
                <select className="text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  value={filters.purpose} onChange={e => setFilters(f => ({ ...f, purpose: e.target.value }))}>
                  <option value="all">All types</option>
                  <option value="boost">Boost</option>
                  <option value="subscription">Subscription</option>
                  <option value="unknown">Unknown</option>
                </select>
                {/* Status filter */}
                <select className="text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  value={filters.status} onChange={e => setFilters(f => ({ ...f, status: e.target.value }))}>
                  <option value="all">All status</option>
                  <option value="paid">Paid</option>
                  <option value="unpaid">Unpaid</option>
                </select>
                <SlidersHorizontal size={16} className="text-slate-400" />
                <ChevronsUpDown size={16} className="text-slate-400" />
              </div>
            </div>

            {/* Column headers */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100">
                    {["DATE & TIME", "USER", "DESCRIPTION", "AMOUNT (TK)", "METHOD", "STATUS", ""].map(h => (
                      <th key={h} className="text-left text-[10px] font-bold uppercase tracking-wider text-slate-400 px-5 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.length === 0 ? (
                    <tr><td colSpan={7} className="text-center py-12 text-slate-400">No transactions found</td></tr>
                  ) : paginatedData.map((p) => {
                    const { date, time } = formatDateTime(p.createdAt || p.created);
                    const purpose = p.purpose || (p.metadata?.issueId ? "Priority Boost" : p.metadata?.userId ? "Premium Subscription" : "Unknown");
                    const issueRef = p.metadata?.issueId ? `#${String(p.metadata.issueId).slice(-4).toUpperCase()}` : "";
                    const payStatus = p.paymentStatus || p.status || "paid";
                    const method = p.paymentMethod || (p.metadata?.issueId ? "Bank Transfer" : "Visa •• 4242");

                    return (
                      <tr key={p._id || p.sessionId} className="border-b border-slate-50 hover:bg-slate-50/60 transition-colors group">
                        <td className="px-5 py-4">
                          <p className="font-medium text-slate-700">{date}</p>
                          <p className="text-xs text-slate-400">{time}</p>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2.5">
                            <div className={`w-8 h-8 rounded-full ${avatarColor(p.customerEmail)} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                              {initials(p.customerEmail)}
                            </div>
                            <div>
                              <p className="font-semibold text-slate-800 text-xs">{p.customerEmail?.split("@")[0] || "Unknown"}</p>
                              <p className="text-xs text-slate-400">{p.customerEmail}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <PurposeChip purpose={purpose} />
                          {issueRef && <p className="text-[11px] text-slate-400 mt-0.5">{issueRef}</p>}
                        </td>
                        <td className="px-5 py-4 font-bold text-slate-800">
                          {(p.amount || p.amount_total / 100 || 0).toLocaleString("en-BD", { minimumFractionDigits: 2 })}
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-1.5 text-xs text-slate-600">
                            <CreditCard size={12} className="text-slate-400" />
                            {method.toUpperCase()}
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <StatusChip status={payStatus} />
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => downloadInvoicePDF(p)}
                              className="w-7 h-7 rounded-lg bg-blue-50 hover:bg-blue-100 flex items-center justify-center transition-colors"
                              title="Download Invoice">
                              <Download size={12} className="text-blue-600" />
                            </button>
                            <button className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors">
                              <MoreVertical size={12} className="text-slate-500" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100">
              <p className="text-xs text-slate-400">Showing {paginatedData.length} of {filtered.length} transactions</p>
              <div className="flex items-center gap-1.5">
                <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
                  className="flex items-center gap-1 text-xs font-semibold text-slate-600 border border-slate-200 rounded-lg px-3 py-1.5 hover:bg-slate-50 disabled:opacity-40 transition-colors">
                  <ChevronLeft size={13} /> Previous
                </button>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(pg => (
                  <button key={pg} onClick={() => setCurrentPage(pg)}
                    className={`w-7 h-7 rounded-lg text-xs font-semibold transition-colors
                      ${currentPage === pg ? "bg-blue-600 text-white" : "text-slate-600 hover:bg-slate-100"}`}>
                    {pg}
                  </button>
                ))}
                {totalPages > 5 && <span className="text-slate-400 text-xs">…</span>}
                <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
                  className="flex items-center gap-1 text-xs font-semibold text-slate-600 border border-slate-200 rounded-lg px-3 py-1.5 hover:bg-slate-50 disabled:opacity-40 transition-colors">
                  Next <ChevronRight size={13} />
                </button>
              </div>
            </div>
          </motion.div>

        </div>
      </Container>
    </div>
  );
};

export default Payments;