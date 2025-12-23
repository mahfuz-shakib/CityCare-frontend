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
const MyIssues = () => {
  const { user, loading } = useAuth();
  const [filters, setFilters] = useState({ email: user?.email, category: "", status: "", priority: "", search: "" });
  const [updateItem, setUpdateItem] = useState({});
  const modalRef = useRef();
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
  const myIssues = issuesResponse?.data || [];

  const handleUpdate = (item) => {
    setUpdateItem(item);
    modalRef.current.showModal();
    queryClient.invalidateQueries({ queryKey });
  };

  const handleDelete = (item) => {
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

      <div className=" rounded-xl py-10 mb-8">
        <h1 className="text-4xl font-bold text-slate-800 mb-3">
          My Issues
        </h1>
        <p className="text-lg text-slate-600 leading-relaxed">
          Track and manage all the issues you've reported. View their status, priority, and take action when needed.
        </p>
      </div>
     
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

      {!user.email || loading || isLoading ? (
        <Loader />
      ) : myIssues.length ? (
        <div className="overflow-x-auto pb-16">
        <motion.table
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
                className="table"
        >
          {/* head */}
          <thead>
            <tr className="bg-green-50">
              <th>SL. No. </th>
              <th>Title</th>
              <th>Reported At</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Edit</th>
              <th>Delete</th>
              <th>View Details</th>
            </tr>
          </thead>
          <tbody>
            {myIssues?.map((list, index) =>
                <motion.tr
                  key={list._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className={`${index % 2 ? "bg-gray-50" : "bg-violet-50"} hover:bg-blue-50 transition-colors`}
                >
                  <td>{index + 1}</td>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="avatar">
                        <div className="mask mask-squircle h-12 w-12">
                          <img src={list.image} alt={list.title} />
                        </div>
                      </div>
                      <div>
                        <div className="font-bold">{list.title}</div>
                        <div className="text-sm opacity-50">({list.location})</div>
                      </div>
                    </div>
                  </td>

                  <td>{new Date(list.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button className="badge badge-secondary btn-xs">{list.status}</button>
                  </td>
                  <td className="opacity-75">{list.priority}</td>
                  <td>
                    <button
                      onClick={() => handleUpdate(list)}
                      className="btn badge badge-primary btn-xs cursor-pointer hover:scale-101"
                      disabled={list.status !== "pending"}
                    >
                      Edit
                    </button>
                  </td>
                  <td>
                    <button
                      onClick={() => handleDelete(list)}
                      className="btn badge badge-secondary btn-xs cursor-pointer hover:scale-101"
                    >
                      Delete
                    </button>
                  </td>
                  <td>
                    <Link
                      to={`/all-issues/${list._id}`}
                      className="btn badge badge-primary btn-xs cursor-pointer hover:scale-101"
                    >
                      Details
                    </Link>
                  </td>
                </motion.tr>
              
            )}
          </tbody>
        </motion.table>
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
