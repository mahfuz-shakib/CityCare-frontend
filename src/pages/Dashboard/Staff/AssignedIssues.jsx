import React, { useState } from "react";
import { motion } from "framer-motion";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import Container from "../../../container/Container";
import Loader from "../../../components/Loader";
import { toast } from "react-toastify";

const STATUS_ORDER = ["pending", "in-progress", "working", "resolved", "closed"];
const getNextStatus = (currentStatus) => {
  const currentIndex = STATUS_ORDER.indexOf(currentStatus);
  if (currentIndex === -1 || currentIndex === STATUS_ORDER.length - 1) return null;
  return STATUS_ORDER[currentIndex + 1];
};

const AssignedIssues = () => {
  const { user } = useAuth();
  const [filters, setFilters] = useState({ staffEmail: user?.email, status: "", priority: "" });
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const queryKey = ["issues", filters];
  const { data: issuesResponse, isLoading } = useQuery({
    queryKey,
    queryFn: async () => {
      const params = new URLSearchParams(filters).toString();
      const res = await axiosSecure.get(`/issues/?${params}`);
      return res.data;
    },
  });
  const issues = issuesResponse?.data || [];

  const handleStatus = async (issue, newStatus) => {
    if (!newStatus || newStatus !== getNextStatus(issue.status)) {
      toast.error("Invalid status change. You can only advance to the next status in order.");
      return;
    }
    try {
      await axiosSecure.patch(`/issues/${issue._id}`, { status: newStatus });
      
      // Create timeline entry
      const timelineInfo = {
        issueId: issue._id,
        message: `Status changed to ${newStatus}`,
        updatedBy: "Staff"
      };
      await axiosSecure.post("/timelines", timelineInfo);
      
      toast.success("Status changed successfully!");
      queryClient.invalidateQueries({ queryKey });
      queryClient.invalidateQueries(["timelines", issue._id]);
    } catch (err) {
      toast.error("Status change failed. Please try again.");
      console.error(err);
    }
  };
  if (isLoading) return <Loader />;
  return (
    <Container>
      <div className="flex flex-col md:flex-row justify-center gap-5 md:gap-12 mb-12 mt-6 px-3 md:bg-primary/10 py-2 rounded-lg mx-4">
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
      <motion.table
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="table max-w-6xl mx-auto"
      >
        {/* head */}
        <thead>
          <tr className="bg-green-50">
            <th>SL. No. </th>
            <th>Title</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Action</th>
            {/* <th>View</th> */}
          </tr>
        </thead>
        <tbody>
          {issues?.map((list, index) => {
            return (
              <motion.tr key={list._id} className={`${index % 2 ? "bg-gray-50" : "bg-violet-50"}`}>
                <td>{index + 1}</td>
                <td>
                  <div className="font-bold">{list.title}</div>
                </td>
                <td className="opacity-75">{list.priority}</td>
                <td>
                  <button className="badge badge-secondary btn-xs">{list.status}</button>
                </td>
                <td>
                  <div className="dropdown dropdown-center">
                    <button
                      tabIndex={0}
                      role="button"
                      className="btn btn-sm m-1"
                      disabled={!getNextStatus(list.status)}
                    >
                      Change Status ⬇️
                    </button>
                    {getNextStatus(list.status) && (
                      <ul
                        tabIndex="-1"
                        className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm"
                      >
                        <li>
                          <a onClick={() => handleStatus(list, getNextStatus(list.status))}>
                            {getNextStatus(list.status)}
                          </a>
                        </li>
                      </ul>
                    )}
                  </div>
                </td>
                {/* <td>
                  <button className="btn badge badge-secondary btn-xs hover:scale-101">Details</button>
                </td> */}
              </motion.tr>
            );
          })}
        </tbody>
      </motion.table>
    </Container>
  );
};

export default AssignedIssues;
