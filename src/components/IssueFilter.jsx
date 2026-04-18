import React, { useMemo, useState } from "react";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";

const IssueFilter = () => {
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

  return <div></div>;
};

export default IssueFilter;
