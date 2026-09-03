import React, { useEffect, useRef, useState } from "react";
import Container from "../../../container/Container";
import CreateStaffForm from "../../../components/Form/CreateStaffForm";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import UpdateStaffForm from "../../../components/Form/UpdateStaffForm";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { UserPlus, Pencil, Trash2, Star, TrendingUp, BarChart2, Users, Award, Download } from "lucide-react";
import Loader from "../../../components/Loader";
import { FaCircle } from "react-icons/fa";
import { monthlyDataResolution } from "../../../utils/monthlyDataResolution";
import SearchFilterPanel from "../../../components/SearchFilterPanel";
import Pagination from "../../../components/Pagination";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import PageHeader from "../../../components/PageHeader";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] },
});
const DEPARTMENTS = [
  "All Staff",
  "Infrastructure",
  "Public Safety",
  "Environment",
  "Sanitation",
  "Transport",
  "Construction",
];
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
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;
  const createModalRef = useRef();
  const updateModalRef = useRef();
  const queryClient = useQueryClient();
  const axiosSecure = useAxiosSecure();

  const {
    data: staffsResult,
    isLoading,
    isPending,
  } = useQuery({
    queryKey: ["staffs", "admin"],
    queryFn: async () => {
      const params = new URLSearchParams({
        department: activeDept === "All Staff" ? "" : activeDept,
        search,
        page: currentPage.toString(),
        limit: pageSize.toString(),
      }).toString();
      const res = await axiosSecure.get(`/staffs/?${params}`);
      return res.data;
    },
  });

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["staffs", "admin"] });
  }, [currentPage, queryClient, activeDept, search]);

  const handleCreateStaff = () => createModalRef.current?.showModal();
  const handleUpdate = (s) => {
    setEditStaff(s);
    updateModalRef.current?.showModal();
  };
  const handleDelete = (s) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This staff member will be permanently removed.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure
          .delete(`/staffs/${s._id}`)
          .then(() => {
            Swal.fire({ title: "Deleted!", text: "Staff removed successfully.", icon: "success" });
            queryClient.invalidateQueries(["staffs"]);
          })
          .catch(() => toast.error("Failed to delete staff"));
      }
    });
  };
  /* ── derived ── */
  const staffs = staffsResult?.data || [];
  const staffChartData = monthlyDataResolution(staffs);
  const newStaffsInThisMonth = staffChartData[new Date().toISOString().slice(0, 7)];
  const pagination = staffsResult?.pagination || { page: 1, limit: pageSize, total: 0, totalPages: 1 };
  const avgRating =
    staffs.length > 0 ? (staffs.reduce((s, st) => s + (st.rating || 4.5), 0) / staffs.length).toFixed(2) : 0;
  const activeTasks = staffs.reduce((s, st) => s + (st.activeTasks || 0), 0);
  const resolvedTasks = staffs.reduce((s, st) => s + (st.resolvedTasks || 0), 0);
  const completionRate = ((resolvedTasks / activeTasks) * 100).toPrecision(2);
  console.log(resolvedTasks);

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text("Staff Directory — CityCare", 14, 15);
    doc.setFontSize(9);
    doc.setTextColor(100);
    doc.text(`Generated: ${new Date().toLocaleDateString()}   Total: ${pagination.total}`, 14, 22);
    autoTable(doc, {
      startY: 28,
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [37, 99, 235], textColor: 255, fontStyle: "bold" },
      alternateRowStyles: { fillColor: [248, 250, 252] },
      head: [["#", "Name", "Email", "Department", "Active Tasks", "Resolved Tasks", "Rating"]],
      body: staffs.map((s, i) => [
        i + 1,
        s.displayName || s.name || "—",
        s.email || "—",
        s.department || "General",
        s.activeTasks || 0,
        s.resolvedTasks || 0,
        Number(s.rating || 4.5).toFixed(1),
      ]),
    });
    doc.save("Staff_Directory_CityCare.pdf");
    toast.success("PDF downloaded successfully");
  };

  return (
    <div className="min-h-screen bg-[#f7f8fc]">
      <title>Manage Staffs</title>
      <Container className="px-4 md:px-10">
        <div className="pt-8 pb-16 space-y-6">
          {/* ── Header ── */}

          <PageHeader
            className="mb-2 mt-3"
            eyebrow="Field Workforce"
            title="Manage Staff"
            description="Supervise municipal personnel, track operational performance metrics, and optimize field assignments across city departments."
            actions={
              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportPDF}
                  className="flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-sm rounded-xl px-4 py-2.5 shadow-sm transition-colors cursor-pointer"
                >
                  <Download size={14} /> <span className="hidden md:inline">Export PDF</span>
                </button>
                <button
                  onClick={handleCreateStaff}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl px-4 py-2.5 shadow-sm transition-colors cursor-pointer"
                >
                  <UserPlus size={16} /> <span className="hidden md:inline">Add Staff Member</span>
                </button>
              </div>
            }
          />

          {/* ── 3 KPI summary cards ── */}
          <motion.div {...fadeUp(0.1)} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Total Workforce</p>
              <div className="flex flex-col md:flex-row items-end justify-between">
                <div>
                  <p className="text-4xl font-bold text-slate-900">{staffs.length}</p>
                  <p className="text-xs text-emerald-600 font-semibold mt-1 flex items-center gap-1">
                    <TrendingUp size={11} /> +{newStaffsInThisMonth}% vs last month
                  </p>
                </div>
                {/* mini bar chart visual */}
                <div className="flex items-end gap-1 h-10">
                  {Object.values(staffChartData)
                    .reverse()
                    .map((v, i) => (
                      <div
                        key={i}
                        className={`w-2 rounded ${i === 5 ? "bg-blue-600" : "bg-blue-200"}`}
                        style={{ height: `${v * 10}%`, minHeight: "4px" }}
                      />
                    ))}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 border-l-4 border-l-blue-500">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Active Tasks</p>
              <div className="flex flex-col md:flex-row items-end justify-between">
                <div>
                  <p className="text-4xl font-bold text-blue-600">{activeTasks || 0}</p>
                  <p className="text-xs text-slate-400 mt-1">{completionRate}% completion rate</p>
                </div>
                <div className="flex items-end gap-1 h-10">
                  <div
                    className="w-6 rounded bg-blue-300"
                    style={{ height: `${resolvedTasks * 10}%`, minHeight: "6px" }}
                  />
                  <div
                    className="w-6 rounded bg-blue-600"
                    style={{ height: `${activeTasks * 10}%`, minHeight: "6px" }}
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 border-l-4 border-l-amber-500">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Avg. Rating</p>
              <p className="text-4xl font-bold text-amber-500">{avgRating || 0}</p>
              <p className="text-xs text-slate-400 mt-1">Top rated municipality</p>
            </div>
          </motion.div>

          {/* ── Staff table ── */}
          <motion.div {...fadeUp(0.2)} className="table-shell mb-16">
            <div className="overflow-x-auto">
              <SearchFilterPanel
                search={search}
                onSearchChange={(value) => {
                  setSearch(value);
                  setCurrentPage(1);
                }}
                searchPlaceholder="Search staff by name or email"
                onFilterChange={(key, value) => {
                  setActiveDept(value);
                  setCurrentPage(1);
                }}
                filters={[
                  {
                    key: "department",
                    value: activeDept,
                    label: "All departments",
                    options: DEPARTMENTS.slice(1).map((department) => ({ value: department, text: department })),
                  },
                ]}
                className="rounded-none"
              />
              <table className="data-table">
                <thead>
                  <tr className="border-b border-slate-100">
                    {["STAFF MEMBER", "DEPARTMENT / ROLE", "WORKLOAD", "ACTIONS"].map((h) => (
                      <th
                        key={h}
                        className="text-left text-[10px] font-bold uppercase tracking-wider text-slate-400 px-6 py-3.5"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {isLoading || isPending ? (
                    <tr>
                      <td colSpan={5} className="text-center py-14 text-slate-400">
                        <FaCircle className="flex justify-center items-center animate-spin text-4xl" />
                      </td>
                    </tr>
                  ) : staffs.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-14 text-slate-400">
                        No staff found for this department
                      </td>
                    </tr>
                  ) : (
                    staffs.map((s, index) => {
                      const workload = s.workloadPct || s.activeTasks * 10;
                      const tasks = s.activeTasks || 0;
                      const role = s.role || s.designation || "Field Staff";
                      const dept = s.department || "General";
                      const photo = s.photoURL;

                      return (
                        <motion.tr
                          key={s._id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.04 }}
                          className="border-b border-slate-50 hover:bg-slate-50/70 transition-colors group"
                        >
                          {/* Name + photo */}
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              {photo ? (
                                <img src={photo} alt={s.displayName} className="w-10 h-10 rounded-full object-cover" />
                              ) : (
                                <div
                                  className={`w-10 h-10 rounded-full ${avatarColor(s.displayName || "")} flex items-center justify-center text-white text-sm font-bold shrink-0`}
                                >
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
                              <span
                                className={`text-xs font-bold ${workload >= 90 ? "text-red-500" : workload >= 60 ? "text-amber-500" : "text-blue-600"}`}
                              >
                                {workload}%
                              </span>
                            </div>
                            <div className="w-32 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${workload}%` }}
                                transition={{ duration: 0.8, delay: index * 0.04 }}
                                className={`h-full rounded-full ${workloadColor(workload)}`}
                              />
                            </div>
                          </td>

                          {/* Actions */}
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleUpdate(s)}
                                className="flex items-center gap-1.5 text-xs font-semibold bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                              >
                                <Pencil size={12} /> Edit
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleDelete(s)}
                                className="flex items-center gap-1.5 text-xs font-semibold bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                              >
                                <Trash2 size={12} /> Delete
                              </motion.button>
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={pagination.totalPages}
              totalItems={pagination.total}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
            />
          </motion.div>
        </div>
      </Container>

      {/* Create modal */}
      <dialog ref={createModalRef} className="modal modal-bottom sm:modal-middle">
        <div className="p-2 md:p-4 rounded mx-auto">
          <CreateStaffForm createModalRef={createModalRef} />
        </div>
      </dialog>

      {/* Update modal */}
      <dialog ref={updateModalRef} className="modal modal-bottom sm:modal-middle">
        <div className="p-2 md:p-4 rounded mx-auto">
          <UpdateStaffForm staff={editStaff} updateModalRef={updateModalRef} />
        </div>
      </dialog>
    </div>
  );
};

export default ManageStaffs;
