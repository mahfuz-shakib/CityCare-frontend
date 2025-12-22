import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Container from "../../container/Container";
import IssueCard from "../../components/IssueCard";
import Loader from "../../components/Loader";

const Issues = () => {
  const [filters, setFilters] = useState({ category: "", status: "", priority: "", search: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 9; // 9 items per page (3 columns x 3 rows)
  const axiosSecure = useAxiosSecure();
  
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

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [filters.category, filters.status, filters.priority, filters.search]);

  const paginationButtons = useMemo(() => {
    if (pagination.totalPages <= 1) return [];
    const pages = Array.from({ length: pagination.totalPages }, (_, i) => i + 1);
    return pages.filter(page => {
      return page === 1 || 
             page === pagination.totalPages || 
             (page >= currentPage - 1 && page <= currentPage + 1);
    });
  }, [pagination.totalPages, currentPage]);

  return (
    <Container>
            <title>All Issues</title>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-4xl font-bold text-center mb-4 text-gray-800 mt-8 md:mt-12">All Issues</h2>
        <p className="text-center text-gray-600 mb-8">Browse and filter through all reported issues</p>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="mt-8 mx-auto w-fit"
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
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="flex flex-col md:flex-row justify-center gap-4 md:gap-6 mb-12 mt-8 px-4 md:bg-gradient-to-r md:from-blue-50 md:to-indigo-50 py-4 rounded-xl shadow-sm mx-4"
      >
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
          <option value="working">Working</option>
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
      </motion.div>
      
      {isLoading ? (
        <Loader />
      ) : issues.length > 0 ? (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
          >
            {issues.map((issue, index) => (
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
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
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
                        className={`btn ${currentPage === page ? 'btn-primary' : 'btn-outline'}`}
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
                onClick={() => setCurrentPage(prev => Math.min(pagination.totalPages, prev + 1))}
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
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <p className="text-gray-500 text-xl">No issues found matching your criteria</p>
          <p className="text-gray-400 text-sm mt-2">Try adjusting your filters</p>
        </motion.div>
      )}
    </Container>
  );
};

export default Issues;
