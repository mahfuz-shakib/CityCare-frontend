import React from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import Container from "../../../container/Container";
import { useState } from "react";
import { useRef } from "react";
import { motion } from "framer-motion";

const AllIssues = () => {
  const [isDisabled, setIsDisabled] = useState(false);
  const [issue, setIssue] = useState({});
  const modalRef = useRef();
  const axiosSecure = useAxiosSecure();
  const {
    data: issues = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["issues"],
    queryFn: async () => {
      const res = await axiosSecure.get("/issues");
      return res.data;
    },
  });
  if (isLoading) return <p>loading....</p>;
  const handleAssignStaff = (issue) => {
    setIssue(issue);
    modalRef.current.showModal();
  };

  return (
    <Container>
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
            <th>Status</th>
            <th>Priority</th>
            <th>Assigned Staff</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {issues?.map((list, index) => {
            if (list.status !== "pending") {
              setIsDisabled(true);
            }
            return (
              <tr key={list._id} className={`${index % 2 ? "bg-gray-50" : "bg-violet-50"}`}>
                <td>{index + 1}</td>
                <td>
                  <div className="font-bold">{list.title}</div>
                </td>
                <td>
                  <button className="badge badge-secondary btn-xs">{list.status}</button>
                </td>
                <td className="opacity-75">{list.priority}</td>
                <td >{list.assignedStaff}</td>
                <td>
                  <button
                    onClick={() => handleAssignStaff(list)}
                    className="btn badge badge-primary btn-xs hover:scale-101"
                    disabled={isDisabled}
                  >
                    Assign Staff
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </motion.table>
      <dialog ref={modalRef} className="modal modal-bottom sm:modal-middle">
        <div className={`p-2 md:p-4 rounded scale-85 md:scale-100 mx-auto`}>
          <h1 className="text-center font-bold mb-2 md:mb-3">Update Information</h1>
          {/* <UpdateIssueForm issue={issue} modalRef={modalRef} refetch={refetch} /> */}
          <div className="w-fit mx-auto ">
            <form method="dialog">
              <button className="btn bg-primary/10">Cancel</button>
            </form>
          </div>
        </div>
      </dialog>
    </Container>
  );
};

export default AllIssues;
