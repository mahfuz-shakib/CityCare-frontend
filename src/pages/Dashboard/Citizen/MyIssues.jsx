import { useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState, useRef, useMemo } from "react";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import useAuth from "../../../hooks/useAuth";
import Loader from "../../../components/Loader";
import Container from "../../../container/Container";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import UpdateIssueForm from "../../../components/Form/UpdateIssueForm";
import { Link } from "react-router";
import { FaClock, FaPlus, FaRegEdit } from "react-icons/fa";
import { MdDelete, MdLocationPin, MdNavigateBefore, MdNavigateNext } from "react-icons/md";
import IssuePriorityBadge from "../../../components/IssuePriorityBadge";
import IssueStatusBadge from "../../../components/IssueStatusBadge";
import IssueCategoryBadge from "../../../components/IssueCategoryBadge";

const MyIssues = () => {
  const { user, loading } = useAuth();
  const [filters, setFilters] = useState({ email: user?.email, category: "", status: "", priority: "", search: "" });
  const [updateItem, setUpdateItem] = useState({});
  const [currentPage, setCurrentPage] = useState(1);

  const modalRef = useRef();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const pageSize = 6; // 9 items per page (3 columns x 3 rows)
  const queryKey = ["issues", filters, currentPage, "citizenPage"];
  const { data: issuesResponse, isLoading } = useQuery({
    queryKey,
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
  const myIssues = issuesResponse?.data || [];

  const pagination = issuesResponse?.pagination || { page: 1, limit: pageSize, total: 0, totalPages: 1 };

  const activeFilters = Object.entries(filters).filter(([_, value]) => value);

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

  const handleUpdate = (item) => {
    setUpdateItem(item);
    modalRef.current.showModal();
    queryClient.invalidateQueries({ queryKey });
  };

  const handleDelete = (item) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure
          .delete(`/issues/${item._id}`)
          .then(() => {
            Swal.fire({
              title: "Deleted!",
              text: "Your issue item has been deleted.",
              icon: "success",
            });
            queryClient.invalidateQueries({ queryKey });
          })
          .catch((err) => {
            toast.error("Failed to delete issue");
            console.error(err);
          });
      }
    });
  };
  return (
    <Container>
      <title>My Issues</title>

      <div className="  rounded-xl my-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="flex justify-between items-center">
            <h1 className="text-4xl font-bold text-slate-800 mb-3">My Issues</h1>

            <Link
              to="/dashboard/report-issue"
              className="btn bg-primary text-white hidden md:flex items-center gap-2 hover:shadow-2xl"
            >
              {" "}
              <FaPlus /> Report New Issue
            </Link>
          </div>
          <p className=" text-slate-600 leading-relaxed">
            Track and manage all the issues you've reported. View their status, priority, and take action when needed.
          </p>
        </motion.div>
      </div>

      <div className="flex flex-col md:flex-row justify-center gap-5 md:gap-12 my-6 px-3 bg-surface-container-low py-2 rounded-lg ">
        <label className="input rounded-full w-full lg:w-md ">
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
        <select
          onChange={(e) => setFilters({ ...filters, category: e.target.value })}
          defaultValue="Select Category"
          className="w-full md:w-64 select select-bordered "
        >
          <option value="">Select Category</option>
          <option value="road">Road</option>
          <option value="water">Water</option>
          <option value="electricity">Electricity</option>
          <option value="garbage">Garbage</option>
        </select>
        <select
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          defaultValue="Select Status"
          className="w-full md:w-64 select select-bordered "
        >
          <option value="">Select Status</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In-progress</option>
          <option value="resolved">Resolved</option>
          <option value="closed">Closed</option>
          <option value="rejected">Rejected</option>
        </select>
        <select
          onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
          defaultValue="Select Priority"
          className="w-full md:w-64 select select-bordered "
        >
          <option value="">Select Priority</option>
          <option value="high">High</option>
          <option value="normal">Normal</option>
        </select>
      </div>
      {/* Active Filters Pills */}
      {activeFilters.length > 0 && (
        <motion.div className="flex flex-wrap gap-2 mb-6 justify-center">
          {activeFilters.map(([key, value]) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-2 bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium"
            >
              {key.charAt(0).toUpperCase() + key.slice(1)}: {value}
              <button
                onClick={() => setFilters({ ...filters, [key]: "" })}
                className="ml-1 text-indigo-600 hover:text-indigo-800"
              >
                ✕
              </button>
            </motion.div>
          ))}
        </motion.div>
      )}

      {!user.email || loading || isLoading ? (
        <Loader />
      ) : myIssues.length ? (
        <div>
          <div className="overflow-x-auto mb-16">
            <motion.table
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="table table-border overflow-hidden"
            >
              {/* head */}
              <thead>
                <tr className="table-header">
                  <th>SL.</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Assigned Staff</th>
                  <th>Status</th>
                  <th>Priority</th>
                  <th>Edit</th>
                  <th>Delete</th>
                  <th>View Details</th>
                </tr>
              </thead>
              <tbody>
                {myIssues?.map((list, index) => (
                  <motion.tr
                    key={list._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    // className={`${index % 2 ? "bg-gray-100" : "bg-white"} hover:bg-gray-50 transition-colors`}
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
                    <td>
                      {list.assignedStaff ? (
                        <div className="flex items-center text-pretty">
                          <img src={list.assignedStaff.photoURL} />
                          <h1>{list.assignedStaff.displayName}</h1>
                        </div>
                      ) : (
                        <span className="flex items-center text-secondary opacity-80">Unassigned</span>
                      )}
                    </td>
                    <td>
                      <IssueStatusBadge status={list.status} />
                    </td>
                    <td>
                      <IssuePriorityBadge priority={list.priority} />
                    </td>
                    <td>
                      <button
                        onClick={() => handleUpdate(list)}
                        className="btn text-2xl cursor-pointer hover:scale-105"
                        disabled={list.status !== "pending"}
                      >
                        <FaRegEdit />
                      </button>
                    </td>
                    <td>
                      <button
                        onClick={() => handleDelete(list)}
                        className="btn text-2xl cursor-pointer text-crimson hover:scale-105"
                      >
                        <MdDelete />
                      </button>
                    </td>
                    <td>
                      <Link
                        to={`/all-issues/${list._id}`}
                        className=" text-primary font-semibold cursor-pointer hover:scale-101 hover:underline"
                      >
                        View Details
                      </Link>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </motion.table>
          </div>
          {pagination.totalPages > 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-wrap justify-end items-center gap-3  mb-8"
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
              <span className="text-sm text-gray-600 px-4">
                Page {pagination.page} of {pagination.totalPages} ({pagination.total} total)
              </span>
            </motion.div>
          )}
        </div>
      ) : (
        <p className="my-18 text-3xl font-bold">No reported issues found</p>
      )}

      <dialog ref={modalRef} className="modal modal-bottom sm:modal-middle">
        <div className={`p-2 md:p-4 rounded scale-85 md:scale-100 mx-auto`}>
          <UpdateIssueForm updateItem={updateItem} modalRef={modalRef} />
        </div>
      </dialog>
    </Container>
  );
};

export default MyIssues;
