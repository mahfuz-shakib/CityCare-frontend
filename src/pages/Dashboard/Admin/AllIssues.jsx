import React from "react";
import { Link } from "react-router";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Container from "../../../container/Container";
import { useState } from "react";
import { useRef } from "react";
import { motion } from "framer-motion";
import AvailableStaffs from "../../../components/Modal/AvailableStaffs";
import Loader from "../../../components/Loader";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Download, Eye, UserPlus, XCircle, MapPin, Clock } from "lucide-react";

import IssuePriorityBadge from "../../../components/IssuePriorityBadge";
import IssueCategoryBadge from "../../../components/IssueCategoryBadge";
import IssueStatusBadge from "../../../components/IssueStatusBadge";
import IssueFilterBar from "../../../components/IssueFilterBar";
import Pagination from "../../../components/Pagination";
import PageHeader from "../../../components/PageHeader";

/* ── animation helper ── */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] },
});

const AllIssues = () => {
  const [filters, setFilters] = useState({ category: "", status: "", priority: "", search: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [issue, setIssue] = useState({});
  const staffModalRef = useRef();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const pageSize = 6;

  const { data: issuesResponse, isLoading } = useQuery({
    queryKey: ["issues", filters, currentPage, "adminPage"],
    queryFn: async () => {
      const params = new URLSearchParams({
        ...filters,
        page: currentPage.toString(),
        limit: pageSize.toString(),
      }).toString();
      const res = await axiosSecure.get(`/issues/?${params}`);
      return res.data;
    },
  });

  const issues = issuesResponse?.data || [];
  const pagination = issuesResponse?.pagination || { page: 1, limit: pageSize, total: 0, totalPages: 1 };

  // Fetch all issues (unpaginated) only for export
  const { data: allIssuesResponse } = useQuery({
    queryKey: ["issues", "all-export"],
    queryFn: async () => {
      const res = await axiosSecure.get(`/issues/?limit=10000`);
      return res.data;
    },
  });
  const allIssues = allIssuesResponse?.data || [];

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text("All Issues — CityCare", 14, 15);
    doc.setFontSize(9);
    doc.setTextColor(100);
    doc.text(`Generated: ${new Date().toLocaleDateString()}   Total: ${allIssues.length}`, 14, 22);
    autoTable(doc, {
      startY: 28,
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [37, 99, 235], textColor: 255, fontStyle: "bold" },
      alternateRowStyles: { fillColor: [248, 250, 252] },
      head: [["#", "Title", "Category", "Priority", "Status", "Location", "Assigned Staff", "Date"]],
      body: allIssues.map((issue, i) => [
        i + 1,
        issue.title || "—",
        issue.category || "—",
        issue.priority || "—",
        issue.status || "—",
        issue.location || "—",
        issue.assignedStaff?.displayName || "Unassigned",
        issue.createdAt ? new Date(issue.createdAt).toLocaleDateString() : "—",
      ]),
    });
    doc.save("All_Issues_CityCare.pdf");
    toast.success("PDF downloaded successfully");
  };

  React.useEffect(() => {
    setCurrentPage(1);
  }, [filters.category, filters.status, filters.priority, filters.search]);

  const handleAssignStaff = (issue) => {
    setIssue(issue);
    staffModalRef.current.showModal();
  };

  const handleReject = (issue) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#2563eb",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, reject it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosSecure.patch(`/issues/admin/${issue._id}`, { status: "rejected" });
          Swal.fire({ title: "Rejected", text: "The issue has been rejected.", icon: "success" });
          queryClient.invalidateQueries(["issues", "adminPage"]);
        } catch (err) {
          toast.error("Update failed");
          console.error(err);
        }
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#f7f8fc]">
      <title>All Issues</title>
      <Container className="px-4 md:px-10">
        <div className="pt-8 pb-16 space-y-6">
          {/* ── Page Header ── */}
          <PageHeader
            eyebrow="City Care Authority"
            title="All Issues Management"
            description="Oversee and triage public service requests across all municipal departments. Assign technical staff and ensure service level agreements are met."
            actions={
              <button
                onClick={handleExportPDF}
                className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 cursor-pointer"
              >
                <Download size={14} /> Export PDF
              </button>
            }
          />

          {/* ── Table Card ── */}
          <motion.div {...fadeUp(0.1)} className="table-shell">
            <IssueFilterBar
              filters={filters}
              onFilterChange={(key, value) => setFilters({ ...filters, [key]: value })}
              className="mt-0 rounded-none border-b border-slate-100"
            />

            {/* ── Table ── */}
            {isLoading ? (
              <div className="flex justify-center items-center py-20">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-10 h-10 border-[3px] border-blue-600 border-t-transparent rounded-full"
                />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="data-table">
                  <thead>
                    <tr className="border-b border-slate-100">
                      {["#", "Issue", "Category", "Priority", "Assigned Staff", "Status", "Actions"].map((h) => (
                        <th
                          key={h}
                          className="text-left text-[10px] font-bold uppercase tracking-wider text-slate-400 px-5 py-3"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {issues.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="text-center py-14 text-slate-400">
                          No issues found
                        </td>
                      </tr>
                    ) : (
                      issues.map((list, index) => (
                        <motion.tr
                          key={list._id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.04 }}
                          className="border-b border-slate-50 hover:bg-slate-50/60 transition-colors group"
                        >
                          {/* # */}
                          <td className="px-5 py-4 text-slate-400 text-xs font-medium">
                            {(currentPage - 1) * pageSize + index + 1}
                          </td>

                          {/* Issue */}
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={list.image}
                                alt={list.title}
                                className="w-12 h-12 rounded-xl object-cover shrink-0"
                              />
                              <div className="min-w-0">
                                <p className="font-semibold text-slate-800 truncate max-w-45">{list.title}</p>
                                <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                                  <MapPin size={10} /> {list.location}
                                </p>
                                <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                                  <Clock size={10} /> {new Date(list.createdAt).toLocaleString()}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Category */}
                          <td className="px-5 py-4">
                            <IssueCategoryBadge category={list.category} />
                          </td>

                          {/* Priority */}
                          <td className="px-5 py-4">
                            <IssuePriorityBadge priority={list.priority} />
                          </td>

                          {/* Assigned Staff */}
                          <td className="px-5 py-4">
                            {list.assignedStaff ? (
                              <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-xs font-bold shrink-0">
                                  {(list.assignedStaff.displayName || "?").slice(0, 2).toUpperCase()}
                                </div>
                                <div>
                                  <p className="text-xs font-semibold text-slate-800">
                                    {list.assignedStaff.displayName}
                                  </p>
                                  <p className="text-[10px] text-slate-400">{list.assignedStaff.department}</p>
                                </div>
                              </div>
                            ) : (
                              <span className="flex items-center gap-1 text-xs text-slate-400">
                                <UserPlus size={12} /> Unassigned
                              </span>
                            )}
                          </td>

                          {/* Status */}
                          <td className="px-5 py-4">
                            <IssueStatusBadge status={list.status} />
                          </td>

                          {/* Actions */}
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-1.5">
                              {/* View */}
                              <Link
                                to={`/all-issues/${list._id}`}
                                className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
                                title="View details"
                              >
                                <Eye size={13} className="text-slate-600" />
                              </Link>

                              {/* Assign Staff */}
                              <button
                                onClick={() => handleAssignStaff(list)}
                                disabled={!!list.assignedStaff || list.status === "rejected"}
                                className="flex items-center gap-1 text-xs font-semibold bg-blue-50 hover:bg-blue-100 text-blue-700 px-2.5 py-1.5 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                                title="Assign staff"
                              >
                                <UserPlus size={12} />
                                {list.assignedStaff ? "Assigned" : "Assign"}
                              </button>

                              {/* Reject */}
                              <button
                                onClick={() => handleReject(list)}
                                disabled={list.status !== "pending" || !!list.assignedStaff}
                                className="flex items-center gap-1 text-xs font-semibold bg-red-50 hover:bg-red-100 text-red-600 px-2.5 py-1.5 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                                title="Reject issue"
                              >
                                <XCircle size={12} />
                                {list.status === "rejected" ? "Rejected" : "Reject"}
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* ── Pagination ── */}
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

      {/* Assign Staff Modal */}
      <dialog ref={staffModalRef} className="modal modal-bottom sm:modal-middle">
        <div className="p-2 md:p-4 rounded scale-85 md:scale-100 mx-auto">
          <AvailableStaffs issue={issue} staffModalRef={staffModalRef} />
        </div>
      </dialog>
    </div>
  );
};

export default AllIssues;
