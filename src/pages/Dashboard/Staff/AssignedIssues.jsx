import React, { useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import Container from "../../../container/Container";
import Loader from "../../../components/Loader";
import { FaClock, FaEye, FaPlus, FaRegEdit } from "react-icons/fa";
import { MdDelete, MdLocationPin, MdNavigateBefore, MdNavigateNext } from "react-icons/md";
import IssuePriorityBadge from "../../../components/IssuePriorityBadge";
import IssueStatusBadge from "../../../components/IssueStatusBadge";
import IssueCategoryBadge from "../../../components/IssueCategoryBadge";
import IssueFilterBar from "../../../components/IssueFilterBar";
import { Link } from "react-router";
import Pagination from "../../../components/Pagination";
import PageHeader from "../../../components/PageHeader";

const AssignedIssues = () => {
  const { user } = useAuth();
  const [filters, setFilters] = useState({
    staffEmail: user?.email,
    category: "",
    status: "",
    priority: "",
    search: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;
  const axiosSecure = useAxiosSecure();
  const queryKey = ["issues", filters, currentPage];
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
  const assignedIssues = issuesResponse?.data || [];
  const pagination = issuesResponse?.pagination || { page: 1, total: assignedIssues.length, totalPages: 1 };

  return (
    <Container>
      <title>Assigned Issues</title>
      <div className="my-8">

      <PageHeader
        eyebrow="Staff Workspace"
        title="Assigned Issues"
        description="Review, prioritize, and update the public issues assigned to your team."
      />
      
      {!user.email || isLoading ? (
        <Loader />
      ) : assignedIssues.length ? (
        <div className="mt-6">
          <IssueFilterBar
        filters={filters}
        onFilterChange={(key, value) => {
          setFilters({ ...filters, [key]: value });
          setCurrentPage(1);
        }}
      />
          <div className="overflow-x-auto mb-16">
            <motion.table
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="data-table"
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
          <Pagination
            currentPage={currentPage}
            totalPages={pagination.totalPages}
            totalItems={pagination.total}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
          />
        </div>
      ) : (
        <p className="my-18 text-3xl font-bold">No reported issues found</p>
      )}
      </div>
    </Container>
  );
};

export default AssignedIssues;
