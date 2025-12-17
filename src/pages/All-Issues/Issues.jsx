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
      const res = await axiosSecure.get(`/issues/?${params}`);
      return res.data;
    },
  });
  // if (isLoading) return <p>loading....</p>;

  return (
    <Container>
      <h2 className="text-3xl font-bold text-center">All Issues</h2>
      <div className="mt-12 mx-auto w-fit">
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
      </div>
      <div className="flex flex-col md:flex-row justify-center gap-5 md:gap-12 mb-12 mt-6 px-3 md:bg-primary/10 py-2 rounded-lg mx-4">
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
      <div className="grid md:grid-cols-3 gap-6">
        {isLoading?<p>Loading....</p>:
        issues.map((issue) => (
          <IssueCard key={issue._id} issue={issue} />
        ))}
      </div>
    </Container>
  );
};

export default Issues;
