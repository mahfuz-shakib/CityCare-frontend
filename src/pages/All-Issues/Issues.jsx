import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Container from "../../container/Container";
import IssueCard from "../../components/IssueCard";

const Issues = () => {
  const [filters, setFilters] = useState({ category: "", status: "", priority: "", search: "" });
  const axiosSecure = useAxiosSecure();
  const { data: issues = [], isLoading } = useQuery({
    queryKey: ["issues", filters],
    queryFn: async () => {
      const params = new URLSearchParams(filters).toString();
      const res = await axiosSecure.get(`/issues?${params}`);
      return res.data;
    },
  });
  return (
    <Container>
      <h2 className="text-3xl font-bold text-center mb-10">Latest Resolved Issues</h2>

      <div className="grid md:grid-cols-3 gap-6">
        {issues.map((issue) => (
          <IssueCard key={issue._id} issue={issue} />
        ))}
      </div>
    </Container>
  );
};

export default Issues;
