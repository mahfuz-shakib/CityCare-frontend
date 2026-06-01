import React, { useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import Container from "../../../container/Container";
import Loader from "../../../components/Loader";
import { FaClock, FaEye, FaFilter, FaPlus, FaRegEdit } from "react-icons/fa";
import { MdDelete, MdLocationPin, MdNavigateBefore, MdNavigateNext } from "react-icons/md";
import IssuePriorityBadge from "../../../components/IssuePriorityBadge";
import IssueStatusBadge from "../../../components/IssueStatusBadge";
import IssueCategoryBadge from "../../../components/IssueCategoryBadge";
import { Link } from "react-router";

const AssignedIssues = () => {
  const { user } = useAuth();
  const [filters, setFilters] = useState({
    staffEmail: user?.email,
    category: "",
    status: "",
    priority: "",
    search: "",
  });
  const axiosSecure = useAxiosSecure();
  const queryKey = ["issues", filters];
  const { data: issuesResponse, isLoading } = useQuery({
    queryKey,
    queryFn: async () => {
      const params = new URLSearchParams(filters).toString();
      const res = await axiosSecure.get(`/issues/?${params}`);
      return res.data;
    },
  });
  const assignedIssues = issuesResponse?.data || [];
  
  if (isLoading) return <Loader />;
  return (
    <Container>
      <title>Assigned Issues</title>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row gap-5 mt-6 px-3 bg-surface-container-low py-2 rounded-t-lg "
      >
        <label className="input rounded-full w-full lg:w-60 ">
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
        <div className="relative">
          <FaFilter className="absolute text-sm text-gray-600 left-2 top-1/2 -translate-y-1/2 z-1" />
          <select
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            defaultValue="Select Category"
            className="pl-7 w-full md:w-42 select select-bordered rounded-2xl"
          >
            <option value="">Select Category</option>
            <option value="road">Road</option>
            <option value="water">Water</option>
            <option value="electricity">Electricity</option>
            <option value="garbage">Garbage</option>
          </select>
        </div>
        <div className="relative">
          <FaFilter className="absolute text-sm text-gray-600 left-2 top-1/2 -translate-y-1/2 z-1" />
          <select
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            defaultValue="Select Status"
            className="pl-7 w-full md:w-42 select select-bordered rounded-2xl"
          >
            <option value="">Select Status</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In-progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        <div className="relative">
          <FaFilter className="absolute text-sm text-gray-600 left-2 top-1/2 -translate-y-1/2 z-1" />
          <select
            onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
            defaultValue="Select Priority"
            className="pl-7 w-full md:w-42 select select-bordered rounded-2xl"
          >
            <option value="">Select Priority</option>
            <option value="high">High</option>
            <option value="normal">Normal</option>
          </select>
        </div>
      </motion.div>
      {!user.email || isLoading ? (
        <Loader />
      ) : assignedIssues.length ? (
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
                  <th>Status</th>
                  <th>Priority</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {assignedIssues?.map((list, index) => (
                  <motion.tr
                    key={list._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    // className={`${index % 2 ? "bg-gray-100" : "bg-white"} hover:bg-gray-50 transition-colors`}
                    className={`table-row transition-colors`}
                  >
                    <td>{index + 1}</td>
                    <td className="w-96">
                      <div className="w-52 md:w-76 flex items-center gap-2">
                        <img src={list.image} alt={list.title} className="size-12 rounded" />
                        <div className="">
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
                      <IssueStatusBadge status={list.status} />
                    </td>
                    <td>
                      <IssuePriorityBadge priority={list.priority} />
                    </td>
                    <td>
                      <Link
                        title="View Details"
                        to={`/dashboard/assigned-issues/${list._id}`}
                        className="flex items-center gap-2 cursor-pointer hover:scale-102 hover:underline"
                      >
                        <FaEye /> View Details
                      </Link>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </motion.table>
          </div>
          {/* {pagination.totalPages > 1 && (
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
          )} */}
        </div>
      ) : (
        <p className="my-18 text-3xl font-bold">No reported issues found</p>
      )}
    </Container>
  );
};

export default AssignedIssues;
