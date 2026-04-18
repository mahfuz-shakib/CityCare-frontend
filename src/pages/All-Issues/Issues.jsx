import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Container from "../../container/Container";
import IssueCard from "../../components/IssueCard";
import Loader from "../../components/Loader";
import { FaArrowLeft } from "react-icons/fa6";
import { useNavigate } from "react-router";
import ListingSkeleton from "../../components/ListingSkeleton";

const Issues = () => {
  const [filters, setFilters] = useState({ category: "", status: "", priority: "", search: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 9; // 9 items per page (3 columns x 3 rows)
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const { data: response, isLoading } = useQuery({
    queryKey: ["issues", filters, currentPage],
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

  const issues = response?.data || [];
  const pagination = response?.pagination || { page: 1, limit: pageSize, total: 0, totalPages: 1 };

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

  return (
    <Container>
      <title>All Issues</title>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        {/* <h2 className="text-3xl md:text-5xl font-bold text-center mb-4 text-gray-800 mt-8 md:mt-12">All <span className="text-sky-600">Issues</span></h2> */}
        <p className="text-center text-xl mt- font-semibold text-gra-600 my-8">
          Browse and filter through all reported issues
        </p>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="flex flex-col md:flex-row justify-center gap-4 md:gap-6 my-8 px-4 md:bg-gradient-to-r md:from-blue-50 md:to-indigo-50 py-2 rounded-md shadow-sm"
      >
        <label className="input mx-auto rounded-full w-full lg:w-md ">
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
          defaultValue="Filter By Category"
          className="w-full md:w-64 select select-bordered "
        >
          <option value="">Filter By Category</option>
          <option value="road">Road</option>
          <option value="water">Water</option>
          <option value="electricity">Electricity</option>
          <option value="garbage">Garbage</option>
        </select>
        <select
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          defaultValue="Filter By Status"
          className="w-full md:w-64 select select-bordered "
        >
          <option value="">Filter By Status</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In-progress</option>
          <option value="working">Working</option>
          <option value="resolved">Resolved</option>
          <option value="closed">Closed</option>
          <option value="rejected">Rejected</option>
        </select>
        <select
          onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
          defaultValue="Filter By Priority"
          className="w-full md:w-64 select select-bordered "
        >
          <option value="">Filter By Priority</option>
          <option value="high">High</option>
          <option value="normal">Normal</option>
        </select>
      </motion.div>

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

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
      >
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => <ListingSkeleton key={i} />)
          : issues.map((issue, index) => (
              <motion.div
                key={issue._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <IssueCard issue={issue} />
              </motion.div>
            ))}
      </motion.div>

      {/* Pagination Controls */}
      {pagination.totalPages > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-wrap justify-center items-center gap-3  mb-8"
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
    </Container>
  );
};

export default Issues;
