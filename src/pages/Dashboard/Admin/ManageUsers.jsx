import React, { useState, useMemo } from "react";
import Container from "../../../container/Container";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import {
  Download, UserPlus, Eye, CreditCard, Ban, ShieldAlert, TrendingUp,
  Filter, Calendar, ChevronLeft, ChevronRight, CheckCircle2, AlertTriangle,
} from "lucide-react";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] },
});

const avatarColor = (name = "") => {
  const colors = ["bg-blue-500", "bg-violet-500", "bg-emerald-500", "bg-amber-500", "bg-rose-500", "bg-cyan-500"];
  return colors[(name.charCodeAt(0) || 0) % colors.length];
};

const relTime = (ts) => {
  if (!ts) return "—";
  const diff = Date.now() - new Date(ts).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "Just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
};

const ManageUsers = () => {
  const [accountFilter, setAccountFilter] = useState("all");
  const [subFilter, setSubFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const queryClient = useQueryClient();
  const axiosSecure = useAxiosSecure();

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["users", "citizen"],
    queryFn: async () => { const res = await axiosSecure.get("/users/?role=citizen"); return res.data; },
  });

  const handleToggleBlock = (user) => {
    const isBlocked = user.isBlocked;
    Swal.fire({
      title: "Are you sure?",
      text: `This will ${isBlocked ? "unblock" : "block"} the user.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: isBlocked ? "#2563eb" : "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: `Yes, ${isBlocked ? "Unblock" : "Block"}`,
    }).then(result => {
      if (result.isConfirmed) {
        axiosSecure.patch(`/users/${user._id}`, { isBlocked: !isBlocked })
          .then(() => {
            Swal.fire({
              title: isBlocked ? "Unblocked!" : "Blocked!",
              text: `User has been ${isBlocked ? "unblocked" : "blocked"}.`,
              icon: "success",
            });
            queryClient.invalidateQueries(["users", "citizen"]);
          })
          .catch(() => toast.error("Failed to update user status"));
      }
    });
  };

  /* ── computed ── */
  const premiumUsers = users.filter(u => u.isPremium);
  const pendingReports = users.reduce((s, u) => s + (u.pendingReports || 0), 0);
  const solvedIssues = users.reduce((s, u) => s + (u.solvedIssues || 0), 0);

  const filtered = useMemo(() => {
    return users.filter(u => {
      if (subFilter === "premium" && !u.isPremium) return false;
      if (subFilter === "free" && u.isPremium) return false;
      if (accountFilter === "blocked" && !u.isBlocked) return false;
      if (accountFilter === "active" && u.isBlocked) return false;
      return true;
    });
  }, [users, accountFilter, subFilter]);

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  React.useEffect(() => setCurrentPage(1), [accountFilter, subFilter]);

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
      <title>Manage Citizens</title>
      <Container>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">

          {/* ── Header ── */}
          <motion.div {...fadeUp(0)} className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-blue-600 mb-1">Governance Portal</p>
              <h1 className="text-3xl font-bold text-slate-900">Manage Citizens</h1>
              <p className="text-slate-500 text-sm mt-1 max-w-md">
                Manage the registered citizen database, monitor engagement metrics, and oversee subscription tiers for premium municipal services.
              </p>
            </div>
            <div className="flex gap-2.5">
              <button className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 text-sm font-semibold rounded-xl px-4 py-2.5 shadow-sm hover:bg-slate-50 transition-colors">
                <Download size={14} /> Export Directory
              </button>
              <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl px-4 py-2.5 shadow-sm transition-colors">
                <UserPlus size={14} /> Add New Citizen
              </button>
            </div>
          </motion.div>

          {/* ── 4 KPI cards ── */}
          <motion.div {...fadeUp(0.1)} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Total Citizens</p>
              <p className="text-4xl font-bold text-slate-900">{users.length.toLocaleString()}</p>
              <p className="text-xs text-emerald-600 font-semibold mt-1.5 flex items-center gap-1">
                <TrendingUp size={11} /> +14% this month
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Premium Users</p>
              <p className="text-4xl font-bold text-blue-600">{premiumUsers.length.toLocaleString()}</p>
              <p className="text-xs text-slate-400 mt-1.5">
                {users.length > 0 ? ((premiumUsers.length / users.length) * 100).toFixed(1) : 0}% of total base
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Pending Reports</p>
              <p className="text-4xl font-bold text-amber-500">{pendingReports || users.filter(u => !u.isBlocked).length}</p>
              <p className="text-xs text-amber-600 font-semibold mt-1.5 flex items-center gap-1">
                <AlertTriangle size={11} /> Urgent Review Required
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Solved Issues</p>
              <p className="text-4xl font-bold text-slate-900">{solvedIssues || users.filter(u => u.isPremium).length * 3}</p>
              <p className="text-xs text-slate-400 mt-1.5 flex items-center gap-1">
                <CheckCircle2 size={11} className="text-emerald-500" /> Last updated 2h ago
              </p>
            </div>
          </motion.div>

          {/* ── Table ── */}
          <motion.div {...fadeUp(0.2)} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            {/* Filters row */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-b border-slate-100">
              <div className="flex flex-wrap items-center gap-2">
                {/* Account type filter */}
                <div className="relative">
                  <Filter size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <select className="pl-7 pr-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                    value={accountFilter} onChange={e => setAccountFilter(e.target.value)}>
                    <option value="all">Account Type: All</option>
                    <option value="active">Active</option>
                    <option value="blocked">Blocked</option>
                  </select>
                </div>
                {/* Subscription filter */}
                <div className="relative">
                  <Calendar size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <select className="pl-7 pr-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                    value={subFilter} onChange={e => setSubFilter(e.target.value)}>
                    <option value="all">Subscription: All</option>
                    <option value="premium">Premium</option>
                    <option value="free">Free</option>
                  </select>
                </div>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                Showing {(currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, filtered.length)} of {filtered.length.toLocaleString()}
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100">
                    {["CITIZEN NAME", "ACCOUNT TYPE", "REPORTS", "SOLVED", "SUBSCRIPTION", "LAST LOGIN", "ACTIONS"].map(h => (
                      <th key={h} className="text-left text-[10px] font-bold uppercase tracking-wider text-slate-400 px-5 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginated.length === 0 ? (
                    <tr><td colSpan={7} className="text-center py-14 text-slate-400">No citizens found</td></tr>
                  ) : paginated.map((u, index) => {
                    const isBlocked = u.isBlocked;
                    const isPremium = u.isPremium;
                    const lastLogin = u.lastLogin || u.updatedAt;
                    const reports = u.reports || u.totalReports || 0;
                    const solved = u.solved || u.solvedReports || 0;
                    const isActive = !isBlocked;

                    return (
                      <motion.tr key={u._id}
                        initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.04 }}
                        className={`border-b border-slate-50 transition-colors group
                          ${isBlocked ? "bg-red-50/30 hover:bg-red-50/50" : "hover:bg-slate-50/60"}`}>

                        {/* Name */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            {u.photoURL ? (
                              <img src={u.photoURL} alt={u.displayName} className="w-10 h-10 rounded-full object-cover" />
                            ) : (
                              <div className={`w-10 h-10 rounded-full ${avatarColor(u.displayName || "")} flex items-center justify-center text-white text-sm font-bold shrink-0`}>
                                {(u.displayName || "??").slice(0, 2).toUpperCase()}
                              </div>
                            )}
                            <div>
                              <p className={`font-semibold ${isBlocked ? "text-slate-500 line-through" : "text-slate-800"}`}>
                                {u.displayName || "Unknown"}
                              </p>
                              <p className="text-xs text-slate-400">{u.email}</p>
                            </div>
                          </div>
                        </td>

                        {/* Account type */}
                        <td className="px-5 py-4">
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg
                            ${isPremium ? "bg-violet-100 text-violet-700" : "bg-slate-100 text-slate-600"}`}>
                            {isPremium ? "PREMIUM" : "BASIC"}
                          </span>
                        </td>

                        {/* Reports */}
                        <td className="px-5 py-4 font-semibold text-slate-800">{reports}</td>

                        {/* Solved */}
                        <td className="px-5 py-4 font-semibold text-slate-800">{solved}</td>

                        {/* Subscription status */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-1.5">
                            <div className={`w-2 h-2 rounded-full ${isActive ? "bg-emerald-500" : "bg-slate-300"}`} />
                            <span className={`text-xs font-medium ${isActive ? "text-slate-700" : "text-slate-400"}`}>
                              {isActive ? "Active" : "Inactive"}
                            </span>
                          </div>
                        </td>

                        {/* Last login */}
                        <td className="px-5 py-4">
                          <p className="text-xs text-slate-600">{relTime(lastLogin)}</p>
                          {u.lastIp && <p className="text-[10px] text-slate-400">IP: {u.lastIp}</p>}
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-1.5">
                            {/* View */}
                            <button className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
                              title="View user details">
                              <Eye size={13} className="text-slate-600" />
                            </button>
                            {/* Subscription */}
                            <button className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors
                              ${isBlocked ? "bg-slate-100 opacity-40 cursor-not-allowed" : "bg-slate-100 hover:bg-slate-200"}`}
                              title="Manage subscription" disabled={isBlocked}>
                              <CreditCard size={13} className="text-slate-600" />
                            </button>
                            {/* Block / Unblock */}
                            <button onClick={() => handleToggleBlock(u)}
                              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors
                                ${isBlocked ? "bg-red-200 hover:bg-red-300" : "bg-slate-100 hover:bg-red-100"}`}
                              title={isBlocked ? "Unblock user" : "Block user"}>
                              {isBlocked
                                ? <ShieldAlert size={13} className="text-red-600" />
                                : <Ban size={13} className="text-slate-500 hover:text-red-500" />}
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-2 px-6 py-4 border-t border-slate-100">
              <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 transition-colors">
                <ChevronLeft size={14} className="text-slate-600" />
              </button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(pg => (
                <button key={pg} onClick={() => setCurrentPage(pg)}
                  className={`w-8 h-8 rounded-lg text-sm font-semibold transition-colors
                    ${currentPage === pg ? "bg-blue-600 text-white" : "text-slate-600 hover:bg-slate-100"}`}>
                  {pg}
                </button>
              ))}
              {totalPages > 5 && <><span className="text-slate-400 text-sm">…</span>
                <button onClick={() => setCurrentPage(totalPages)}
                  className="w-8 h-8 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors">
                  {totalPages}
                </button></>}
              <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage >= totalPages}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 transition-colors">
                <ChevronRight size={14} className="text-slate-600" />
              </button>
            </div>
          </motion.div>

        </div>
      </Container>
    </div>
  );
};

export default ManageUsers;