import React from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useQuery, useQueryClient} from "@tanstack/react-query";
import Container from "../../../container/Container";
import { useState } from "react";
import { useRef } from "react";
import { motion } from "framer-motion";
import AvailableStaffs from "../../../components/Modal/AvailableStaffs";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const AllIssues = () => {
  const [issue, setIssue] = useState({});
  const staffModalRef = useRef();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const {
    data: issues = [],
    isLoading,
  } = useQuery({
    queryKey: ["issues", "adminPage"],
    queryFn: async () => {
      const res = await axiosSecure.get("/issues");
      return res.data;
    },
  });
  if (isLoading) return <p>loading....</p>;
  const handleAssignStaff = (issue) => {
    setIssue(issue);
    staffModalRef.current.showModal();
  };
  const handleReject = (issue) => {
    const status = "rejected"
    Swal.fire({
           title: "Are you sure?",
           text: "You won't be able to revert this!",
           icon: "warning",
           showCancelButton: true,
           confirmButtonColor: "#3085d6",
           cancelButtonColor: "#d33",
           confirmButtonText: `Yes, reject it!`,
         }).then((result) => {
           if (result.isConfirmed) {
             axiosSecure
          .patch(`/issues/${issue._id}`,{status})
          .then((data) => {
            Swal.fire({
                           title: "Reject",
                           text: `Your issue item has been rejected`,
                           icon: "success",
                         });
            queryClient.invalidateQueries(["issues", "adminPage"]);
          })
          .catch((err) => {
            toast.error("Updated failed");
            console.log(err);
          });
           }
         });
    
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
            <th>Assign Staff</th>
            <th>Reject Issue</th>
          </tr>
        </thead>
        <tbody>
          {issues?.map((list, index) => {
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
                <td>{list.assignedStaff ? list.assignedStaff.displayName : "- - -"}</td>
                <td>
                  <button
                    onClick={() => handleAssignStaff(list)}
                    className="btn badge badge-primary btn-xs hover:scale-101"
                    disabled={list.assignedStaff}
                  >
                    Assign Staff
                  </button>
                </td>
                <td>
                  <button
                    onClick={() => handleReject(list)}
                    disabled={list.status!=="pending" ||list.assignedStaff}
                    className="btn badge badge-secondary btn-xs hover:scale-101"
                  >
                    Reject
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </motion.table>
      <dialog ref={staffModalRef} className="modal modal-bottom sm:modal-middle">
        <div className={`p-2 md:p-4 rounded scale-85 md:scale-100 mx-auto`}>
          <AvailableStaffs issue={issue} staffModalRef={staffModalRef} />
        </div>
      </dialog>
    </Container>
  );
};

export default AllIssues;
