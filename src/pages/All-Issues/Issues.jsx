import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import useAxios from "../../hooks/useAxios";
import Container from "../../container/Container";
import IssueCard from "../../components/IssueCard";
import ListingSkeleton from "../../components/ListingSkeleton";
import { useLocation } from "react-router";
import IssueFilterBar from "../../components/IssueFilterBar";
import Pagination from "../../components/Pagination";
import PageHeader from "../../components/PageHeader";

const Issues = () => {
  const location = useLocation();
  const browsedCategory = location.search.includes("category") ? location.search.slice(10) : "";
  const browsedStatus = location.search.includes("status") ? location.search.slice(8) : "";
  const [filters, setFilters] = useState({
    category: browsedCategory || "",
    status: browsedStatus || "",
    priority: "",
    search: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 9; // 9 items per page (3 columns x 3 rows)
  const axiosInstance = useAxios();
  const { data: issuesData, isLoading } = useQuery({
    queryKey: ["issues", filters, currentPage],
    queryFn: async () => {
      const params = new URLSearchParams({
        ...filters,
        page: currentPage.toString(),
        limit: pageSize.toString(),
      }).toString();
      const res = await axiosInstance.get(`/issues/?${params}`);
      return res.data;
    },
  });

  const issues = issuesData?.data || [];
  const pagination = issuesData?.pagination || { page: 1, limit: pageSize, total: 0, totalPages: 1 };

  const activeFilters = Object.entries(filters).filter(([_, value]) => value);

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [filters.category, filters.status, filters.priority, filters.search]);

  return (
    <Container>
      <title>All Issues</title>
      <PageHeader
        className="my-8"
        eyebrow="Public Service Directory"
        title="All Issues"
        description="Browse and filter through all reported infrastructure issues in the community."
      />
      <IssueFilterBar filters={filters} onFilterChange={(key, value) => setFilters({ ...filters, [key]: value })} />

      {/* Active Filters Pills */}
      {activeFilters.length > 0 && (
        <motion.div className="flex flex-wrap gap-2 my-3 justify-center">
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
        className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12 mt-3"
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
      {issues.length === 0 && (
        <div className="text-center mb-16">
          <h1 className="text-3xl font-semibold">Issues not found based on your searched value</h1>
          <p className="text-xl mt-2">Please try again!</p>
        </div>
      )}
      {/* Pagination Controls */}
      <Pagination
        currentPage={currentPage}
        totalPages={pagination.totalPages}
        totalItems={pagination.total}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
      />
    </Container>
  );
};

export default Issues;
