import React, { memo, useMemo } from "react";
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
import { FaClock, FaDownload } from "react-icons/fa";
import { MdLocationPin } from "react-icons/md";
import { IoMdPersonAdd } from "react-icons/io";
import { IoEyeOutline } from "react-icons/io5";

import IssuePriorityBadge from "../../../components/IssuePriorityBadge";
import IssueCategoryBadge from "../../../components/IssueCategoryBadge";
import IssueStatusBadge from "../../../components/IssueStatusBadge";

const AllIssues = () => {
  const [filters, setFilters] = useState({ category: "", status: "", priority: "", search: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [issue, setIssue] = useState({});
  const staffModalRef = useRef();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const pageSize = 6; // 9 items per page (3 columns x 3 rows)
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

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [filters.category, filters.status, filters.priority, filters.search]);

  const paginationButtons = useMemo(() => {
    if (pagination.totalPages <= 1) return [];
    const pages = Array.from({ length: pagination.totalPages }, (_, i) => i + 1);
    return pages.filter((page) => {
      return page === 1 || page === pagination.totalPages || (page >= currentPage - 1 && page <= currentPage + 1);
    });
  }, [pagination.totalPages, currentPage]);

  const handleAssignStaff = (issue) => {
    setIssue(issue);
    staffModalRef.current.showModal();
  };
  const handleReject = (issue) => {
    const status = "rejected";
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: `Yes, reject it!`,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosSecure.patch(`/issues/admin/${issue._id}`, { status });

          // Create timeline entry
          const timelineInfo = {
            issueId: issue._id,
            message: "Issue rejected by Admin",
            updatedBy: "Admin",
          };
          await axiosSecure.post("/timelines", timelineInfo);

          Swal.fire({
            title: "Reject",
            text: `Your issue item has been rejected`,
            icon: "success",
          });
          queryClient.invalidateQueries(["issues", "adminPage"]);
          queryClient.invalidateQueries(["timelines", issue._id]);
        } catch (err) {
          toast.error("Update failed");
          console.error(err);
        }
      }
    });
  };

  return (
    <Container className="px-10">
      <title>All Issues</title>
      <motion.div
        initial={{ opacity: 0, y: 0 }}
        whileInView={{ opacity: 1, y: 20 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mb-10 mt-3"
      >
        <p className="text-[11px] font-bold uppercase tracking-widest text-blue-600 mb-1">CITY CARE AUTHORITY</p>
        <h1 className="text-3xl font-bold text-slate-800 mt-1 mb-2">All Issues Management</h1>
        <div className="flex justify-between">
          <p className="text-secondary max-w-xl">
            Oversee and triage public service requests across all municipal departments. Assign technical staff and
            ensure service level agreements are met.
          </p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="btn bg-surface-container-high p-5"
          >
            <FaDownload /> Export CSV
          </motion.button>
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center  bg-white px-4 border-b border-b-slate-200  py-2 rounded-t-xl ">
          <div className="flex flex-col md:flex-row justify-center gap-4 md:gap-2">
            <label className="input mx-auto rounded-full w-full lg:w-64 ">
              <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor">
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.3-4.3"></path>
                </g>
              </svg>
              <input
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                type="search"
                required
                placeholder="Search by title, category or location"
              />
            </label>
            <div className="w-full md:w-32 ">
              <select
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                defaultValue="Filter By Category"
                className="select select-bordered "
              >
                <option value="">Category: All</option>
                <option value="road">Road</option>
                <option value="water">Water</option>
                <option value="electricity">Electricity</option>
                <option value="garbage">Garbage</option>
              </select>
            </div>
            <div className="w-full md:w-32 ">
              <select
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                defaultValue="Status All"
                className="select select-bordered "
              >
                <option value="">Status: All</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In-progress</option>
                <option value="working">Working</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <div className="w-full md:w-32 ">
              <select
                onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
                defaultValue="Priority All"
                className="select select-bordered "
              >
                <option value="">Priority: All</option>
                <option value="high">High</option>
                <option value="normal">Normal</option>
              </select>
            </div>
          </div>
          <span className="text-sm text-gray-600 px-4">
            Page {pagination.page} of {pagination.totalPages} ({pagination.total} total)
          </span>
        </div>
        {isLoading ? (
          <Loader />
        ) : (
          <div className="overflow-x-auto mb-">
            <table
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="table bg-white rounded-t-none overflow-hidden"
            >
              {/* head */}
              <thead>
                <tr className="">
                  <th>SL. </th>
                  <th>Issue</th>
                  <th>Category</th>
                  <th>Priority</th>
                  <th>Assigned Staff</th>
                  <th>Status</th>
                  <th>Reject</th>
                  <th>Details</th>
                  <th>Assign</th>
                </tr>
              </thead>
              <tbody>
                {issues?.map((list, index) => {
                  return (
                    <motion.tr
                      key={list._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      // className={`${index % 2 ? "bg-gray-50" : "bg-violet-50"} hover:bg-blue-50 transition-colors`}
                      className={`table-row transition-colors`}
                    >
                      <td>{index + 1}</td>
                      <td>
                        <div className="flex items-center gap-2">
                          <img src={list.image} alt={list.title} className="size-12 rounded" />
                          <div className="w-52">
                            <h1 className="font-bold">{list.title}</h1>
                            <span className="flex items-center text-secondary text-xs">
                              <MdLocationPin /> {list.location}
                            </span>
                            <span className="text-[10px] flex items-center text-secondary gap-1">
                              <FaClock /> {new Date(list.createdAt).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <IssueCategoryBadge category={list.category} />
                      </td>
                      <td className="opacity-75">
                        <IssuePriorityBadge priority={list.priority} />
                      </td>
                      <td>
                        {list.assignedStaff ? (
                          <div className="flex items-center">
                            <img src={list.assignedStaff.photoURL} />
                            <div>
                              <h1>{list.assignedStaff.displayName}</h1>
                              <p className="text-xs text-secondary">{list.assignedStaff.department}</p>
                            </div>
                          </div>
                        ) : (
                          <span className="flex items-center text-primary">
                            <IoMdPersonAdd />
                            Unassigned
                          </span>
                        )}
                      </td>
                      <td>
                        <IssueStatusBadge status={list.status} />
                      </td>
                      <td>
                        <button
                          onClick={() => handleReject(list)}
                          disabled={list.status !== "pending" || list.assignedStaff}
                          className="btn badge badge-secondary btn-xs hover:scale-101 w-20"
                        >
                          {list.status === "rejected" ? "Rejected" : "Reject"}
                        </button>
                      </td>
                      <td>
                        <Link to={`/all-issues/${list._id}`} className="text-2xl text-secondary hover:scale-101">
                          <IoEyeOutline />
                        </Link>
                      </td>
                      <td>
                        <button
                          onClick={() => handleAssignStaff(list)}
                          className="btn badge badge-primary btn-xs hover:scale-101 w-28"
                          disabled={list.assignedStaff || list.status === "rejected"}
                        >
                          {list.assignedStaff ? "Assigned" : "Assign Staff"}
                        </button>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {pagination.totalPages > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-wrap justify-center items-center gap-3 my-10"
        >
          <motion.button
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="btn btn-outline"
            whileHover={{ scale: currentPage === 1 ? 1 : 1.05 }}
            whileTap={{ scale: currentPage === 1 ? 1 : 0.95 }}
          >
            Previous
          </motion.button>
          <div className="flex gap-2">
            {paginationButtons.map((page, index, array) => {
              const showEllipsisBefore = index > 0 && array[index - 1] !== page - 1;
              return (
                <React.Fragment key={page}>
                  {showEllipsisBefore && <span className="px-2 text-gray-500">...</span>}
                  <motion.button
                    onClick={() => setCurrentPage(page)}
                    className={`btn ${currentPage === page ? "btn-primary" : "btn-outline"}`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {page}
                  </motion.button>
                </React.Fragment>
              );
            })}
          </div>
          <motion.button
            onClick={() => setCurrentPage((prev) => Math.min(pagination.totalPages, prev + 1))}
            disabled={currentPage === pagination.totalPages}
            className="btn btn-outline"
            whileHover={{ scale: currentPage === pagination.totalPages ? 1 : 1.05 }}
            whileTap={{ scale: currentPage === pagination.totalPages ? 1 : 0.95 }}
          >
            Next
          </motion.button>
          <span className="text-sm text-gray-600 px-4 md:hidden">
            Page {pagination.page} of {pagination.totalPages} ({pagination.total} total)
          </span>
        </motion.div>
      )}

      <dialog ref={staffModalRef} className="modal modal-bottom sm:modal-middle">
        <div className={`p-2 md:p-4 rounded scale-85 md:scale-100 mx-auto`}>
          <AvailableStaffs issue={issue} staffModalRef={staffModalRef} />
        </div>
      </dialog>
    </Container>
  );
};

export default AllIssues;
