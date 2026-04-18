import React, { useRef, useState } from "react";
import Container from "../../../container/Container";
import CreateStaffForm from "../../../components/Form/CreateStaffForm";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import UpdateStaffForm from "../../../components/Form/UpdateStaffForm";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import {
  UserPlus, Pencil, Trash2, Star, TrendingUp, ChevronLeft, ChevronRight,
  BarChart2, Users, Award,
} from "lucide-react";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] },
});

const DEPARTMENTS = ["All Staff", "Infrastructure", "Public Safety", "Environment", "Sanitation", "Transport"];

/* workload color */
const workloadColor = (pct) => {
  if (pct >= 90) return "bg-red-500";
  if (pct >= 60) return "bg-amber-500";
  return "bg-blue-500";
};

/* avatar */
const avatarColor = (name = "") => {
  const palette = ["bg-blue-500", "bg-violet-500", "bg-emerald-500", "bg-amber-500", "bg-rose-500"];
  return palette[(name.charCodeAt(0) || 0) % palette.length];
};

const ManageStaffs = () => {
  const [editStaff, setEditStaff] = useState({});
  const [activeDept, setActiveDept] = useState("All Staff");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const modalRef = useRef();
  const updateModalRef = useRef();
  const queryClient = useQueryClient();
  const axiosSecure = useAxiosSecure();

  const { data: staffs = [], isLoading } = useQuery({
    queryKey: ["staffs"],
    queryFn: async () => { const res = await axiosSecure.get("/staffs"); return res.data; },
  });

  const handleCreateStaff = () => modalRef.current?.showModal();
  const handleUpdate = (s) => { setEditStaff(s); updateModalRef.current?.showModal(); };
  const handleDelete = (s) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This staff member will be permanently removed.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete",
    }).then(result => {
      if (result.isConfirmed) {
        axiosSecure.delete(`/staffs/${s._id}`)
          .then(() => {
            Swal.fire({ title: "Deleted!", text: "Staff removed successfully.", icon: "success" });
            queryClient.invalidateQueries(["staffs"]);
          })
          .catch(() => toast.error("Failed to delete staff"));
      }
    });
  };

  /* ── derived ── */
  const filtered = activeDept === "All Staff"
    ? staffs
    : staffs.filter(s => (s.department || "").toLowerCase() === activeDept.toLowerCase());

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  /* ── aggregate stats ── */
  const avgRating = staffs.length > 0
    ? (staffs.reduce((s, st) => s + (st.rating || 4.5), 0) / staffs.length).toFixed(2)
    : "—";
  const activeTasks = staffs.reduce((s, st) => s + (st.activeTasks || 0), 0);
  const completionRate = 94.2; // can be derived from real data if available

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
      <title>Manage Staffs</title>
      <Container>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">

          {/* ── Header ── */}
          <motion.div {...fadeUp(0)} className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-blue-600 mb-1">Field Workforce</p>
              <h1 className="text-3xl font-bold text-slate-900">Manage Staff</h1>
              <p className="text-slate-500 text-sm mt-1 max-w-md">
                Supervise municipal personnel, track operational performance metrics, and optimize field assignments across city departments.
              </p>
            </div>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              onClick={handleCreateStaff}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl px-5 py-3 shadow-sm transition-colors">
              <UserPlus size={16} /> Add Staff Member
            </motion.button>
          </motion.div>

          {/* ── 3 KPI summary cards ── */}
          <motion.div {...fadeUp(0.1)} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Total Workforce</p>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-4xl font-bold text-slate-900">{staffs.length.toLocaleString()}</p>
                  <p className="text-xs text-emerald-600 font-semibold mt-1 flex items-center gap-1">
                    <TrendingUp size={11} /> +12% vs last month
                  </p>
                </div>
                {/* mini bar chart visual */}
                <div className="flex items-end gap-1 h-10">
                  {[3, 5, 4, 7, 6, 8, 9].map((v, i) => (
                    <div key={i} className={`w-2 rounded-sm ${i === 6 ? "bg-blue-600" : "bg-blue-200"}`}
                      style={{ height: `${v * 10}%`, minHeight: "4px" }} />
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 border-l-4 border-l-blue-500">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Active Tasks</p>
              <p className="text-4xl font-bold text-blue-600">{activeTasks || 482}</p>
              <p className="text-xs text-slate-400 mt-1">{completionRate}% completion rate</p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 border-l-4 border-l-amber-500">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Avg. Rating</p>
              <p className="text-4xl font-bold text-amber-500">{avgRating}</p>
              <p className="text-xs text-slate-400 mt-1">Top rated municipality</p>
            </div>
          </motion.div>

          {/* ── Dept filter pills ── */}
          <motion.div {...fadeUp(0.15)} className="flex flex-wrap gap-2">
            {DEPARTMENTS.map(dept => (
              <button key={dept} onClick={() => { setActiveDept(dept); setCurrentPage(1); }}
                className={`text-sm font-semibold px-4 py-2 rounded-full transition-all
                  ${activeDept === dept ? "bg-blue-600 text-white shadow-sm" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"}`}>
                {dept}
              </button>
            ))}
          </motion.div>

          {/* ── Staff table ── */}
          <motion.div {...fadeUp(0.2)} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100">
                    {["STAFF MEMBER", "DEPARTMENT / ROLE", "WORKLOAD", "RATING", "ACTIONS"].map(h => (
                      <th key={h} className="text-left text-[10px] font-bold uppercase tracking-wider text-slate-400 px-6 py-3.5">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginated.length === 0 ? (
                    <tr><td colSpan={5} className="text-center py-14 text-slate-400">No staff found for this department</td></tr>
                  ) : paginated.map((s, index) => {
                    const workload = s.workloadPct || Math.floor(Math.random() * 60 + 30);
                    const tasks = s.activeTasks || Math.floor(Math.random() * 20 + 3);
                    const rating = s.rating || (4.5 + Math.random() * 0.5).toFixed(1);
                    const role = s.role || s.designation || "Field Staff";
                    const dept = s.department || "General";
                    const photo = s.photoURL;

                    return (
                      <motion.tr key={s._id}
                        initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.04 }}
                        className="border-b border-slate-50 hover:bg-slate-50/70 transition-colors group">

                        {/* Name + photo */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {photo ? (
                              <img src={photo} alt={s.displayName} className="w-10 h-10 rounded-full object-cover" />
                            ) : (
                              <div className={`w-10 h-10 rounded-full ${avatarColor(s.displayName || "")} flex items-center justify-center text-white text-sm font-bold shrink-0`}>
                                {(s.displayName || "??").slice(0, 2).toUpperCase()}
                              </div>
                            )}
                            <div>
                              <p className="font-semibold text-slate-800">{s.displayName || s.name}</p>
                              <p className="text-xs text-slate-400">{s.email}</p>
                            </div>
                          </div>
                        </td>

                        {/* Dept / Role */}
                        <td className="px-6 py-4">
                          <p className="font-semibold text-slate-800">{dept}</p>
                          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{role}</p>
                        </td>

                        {/* Workload */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className="text-xs text-slate-600 whitespace-nowrap">{tasks} Active Tasks</span>
                            <span className={`text-xs font-bold ${workload >= 90 ? "text-red-500" : workload >= 60 ? "text-amber-500" : "text-blue-600"}`}>
                              {workload}%
                            </span>
                          </div>
                          <div className="w-32 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                            <motion.div initial={{ width: 0 }} animate={{ width: `${workload}%` }}
                              transition={{ duration: 0.8, delay: index * 0.04 }}
                              className={`h-full rounded-full ${workloadColor(workload)}`} />
                          </div>
                        </td>

                        {/* Rating */}
                        <td className="px-6 py-4">
                          <span className="flex items-center gap-1 font-bold text-amber-500">
                            <Star size={13} fill="currentColor" /> {Number(rating).toFixed(1)}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                              onClick={() => handleUpdate(s)}
                              className="flex items-center gap-1.5 text-xs font-semibold bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-1.5 rounded-lg transition-colors">
                              <Pencil size={12} /> Edit
                            </motion.button>
                            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                              onClick={() => handleDelete(s)}
                              className="flex items-center gap-1.5 text-xs font-semibold bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1.5 rounded-lg transition-colors">
                              <Trash2 size={12} /> Delete
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100">
              <p className="text-xs text-slate-400">
                Showing 1 to {paginated.length} of {filtered.length.toLocaleString()} staff members
              </p>
              <div className="flex items-center gap-1.5">
                <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
                  className="w-7 h-7 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 transition-colors">
                  <ChevronLeft size={14} className="text-slate-600" />
                </button>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(pg => (
                  <button key={pg} onClick={() => setCurrentPage(pg)}
                    className={`w-7 h-7 rounded-lg text-xs font-semibold transition-colors
                      ${currentPage === pg ? "bg-blue-600 text-white" : "text-slate-600 hover:bg-slate-100"}`}>
                    {pg}
                  </button>
                ))}
                <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage >= totalPages}
                  className="w-7 h-7 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 transition-colors">
                  <ChevronRight size={14} className="text-slate-600" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </Container>

      {/* Create modal */}
      <dialog ref={modalRef} className="modal modal-bottom sm:modal-middle">
        <div className="p-2 md:p-4 rounded mx-auto">
          <h2 className="text-center font-bold mb-3 text-slate-800">Staff Information</h2>
          <CreateStaffForm modalRef={modalRef} />
        </div>
      </dialog>

      {/* Update modal */}
      <dialog ref={updateModalRef} className="modal modal-bottom sm:modal-middle">
        <div className="p-2 md:p-4 rounded mx-auto">
          <UpdateStaffForm staff={editStaff} updateModalRef={updateModalRef} />
          <div className="w-fit mx-auto mt-3">
            <form method="dialog">
              <button className="btn bg-slate-100 hover:bg-slate-200 border-none text-slate-600 text-sm">Cancel</button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default ManageStaffs;