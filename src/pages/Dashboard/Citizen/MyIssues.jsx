import { useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import useAuth from "../../../hooks/useAuth";
import Loader from "../../../components/Loader";
import Container from "../../../container/Container";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import UpdateIssueForm from "../../../components/Form/UpdateIssueForm";
import { Link } from "react-router";
import { FaClock, FaEye, FaPlus, FaRegEdit } from "react-icons/fa";
import { MdDelete, MdLocationPin } from "react-icons/md";
import IssuePriorityBadge from "../../../components/IssuePriorityBadge";
import IssueStatusBadge from "../../../components/IssueStatusBadge";
import IssueCategoryBadge from "../../../components/IssueCategoryBadge";
import IssueFilterBar from "../../../components/IssueFilterBar";
import Pagination from "../../../components/Pagination";
import PageHeader from "../../../components/PageHeader";
import useAuthDB from "../../../hooks/useAuthDB";

const MyIssues = () => {
  const { user, loading } = useAuth();
  const { User } = useAuthDB();
  const [filters, setFilters] = useState({ email: user?.email, category: "", status: "", priority: "", search: "" });
  const [updateItem, setUpdateItem] = useState({});
  const [currentPage, setCurrentPage] = useState(1);

  const modalRef = useRef();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const pageSize = 6;
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

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [filters.category, filters.status, filters.priority, filters.search]);

  const handleUpdate = (item) => {
    setUpdateItem(item);
    modalRef.current.showModal();
    queryClient.invalidateQueries({ queryKey });
  };

  const handleDelete = (item) => {
    if (User?.isBlocked) {
      Swal.fire({
        title: "Account blocked",
        text: "Contact with Citycare authority",
      });
      return;
    }
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
        <PageHeader
          eyebrow="Citizen Portal"
          title="My Issues"
          description="Track and manage all the issues you've reported. View their status, priority, and take action when needed."
          actions={
            <Link
              to="/dashboard/report-issue"
              className="btn bg-primary text-white hidden md:flex items-center gap-2 hover:shadow-2xl"
            >
              <FaPlus /> Report New Issue
            </Link>
          }
        />
      </div>

      <IssueFilterBar filters={filters} onFilterChange={(key, value) => setFilters({ ...filters, [key]: value })} />

      {!user.email || loading || isLoading ? (
        <Loader />
      ) : myIssues.length ? (
        <div>
          <div className="overflow-x-auto mb-12">
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
                  <th>Assigned Staff</th>
                  <th>Status</th>
                  <th>Priority</th>
                  <th>Actions</th>
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
                      <div className="flex items-center gap-6">
                        <button
                          title="Edit Issue"
                          onClick={() => handleUpdate(list)}
                          className={`text-2xl ${list.status === "pending" ? "cursor-pointer hover:scale-105" : "cursor-not-allowed"}`}
                          disabled={list.status !== "pending"}
                        >
                          <FaRegEdit />
                        </button>

                        <button
                          title="Delete Issue"
                          onClick={() => handleDelete(list)}
                          className="text-2xl cursor-pointer text-red-700 hover:scale-105"
                        >
                          <MdDelete />
                        </button>

                        <Link
                          title="View Details"
                          to={`/all-issues/${list._id}`}
                          className="text-2xl cursor-pointer hover:scale-105 hover:underline"
                        >
                          <FaEye />
                        </Link>
                      </div>
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

      <dialog ref={modalRef} className="modal modal-bottom sm:modal-middle">
        <div className={`p-2 md:p-4 rounded scale-85 md:scale-100 mx-auto`}>
          <UpdateIssueForm updateItem={updateItem} modalRef={modalRef} />
        </div>
      </dialog>
    </Container>
  );
};

export default MyIssues;
