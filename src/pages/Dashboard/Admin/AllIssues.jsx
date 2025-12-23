import React, { memo } from "react";
import { Link } from "react-router";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useQuery, useQueryClient} from "@tanstack/react-query";
import Container from "../../../container/Container";
import { useState } from "react";
import { useRef } from "react";
import { motion } from "framer-motion";
import AvailableStaffs from "../../../components/Modal/AvailableStaffs";
import Loader from "../../../components/Loader";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const AllIssues = () => {
  const [issue, setIssue] = useState({});
  const staffModalRef = useRef();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const {
    data: issuesResponse ,
    isLoading,
  } = useQuery({
    queryKey: ["issues", "adminPage"],
    queryFn: async () => {
      const res = await axiosSecure.get("/issues");
      return res.data;
    },
  });
  const issues = issuesResponse?.data || [];

  if (isLoading) return <Loader />;
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
         }).then(async (result) => {
           if (result.isConfirmed) {
             try {
               await axiosSecure.patch(`/issues/${issue._id}`,{status});
               
               // Create timeline entry
               const timelineInfo = {
                 issueId: issue._id,
                 message: "Issue rejected by Admin",
                 updatedBy: "Admin"
               };
               await axiosSecure.post("/timelines", timelineInfo);
               
               Swal.fire({
                 title: "Reject",
                 text: `Your issue item has been rejected`,
                 icon: "success",
               });
               queryClient.invalidateQueries(["issues", "adminPage"]);
               queryClient.invalidateQueries(["timelines", issue._id]);
             } catch (err) {
               toast.error("Update failed");
               console.error(err);
             }
           }
         });
    
  };

  return (
    <Container>
            <title>All Issues</title>
        <div className="overflow-x-auto">

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
            <th>View Details</th>
          </tr>
        </thead>
        <tbody>
          {issues?.map((list, index) => {
            return (
              <motion.tr
                key={list._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={`${index % 2 ? "bg-gray-50" : "bg-violet-50"} hover:bg-blue-50 transition-colors`}
              >
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
                <td>
                  <Link
                    to={`/all-issues/${list._id}`}
                    className="btn badge badge-primary btn-xs hover:scale-101"
                  >
                    View Details
                  </Link>
                </td>
              </motion.tr>
            );
          })}
        </tbody>
      </motion.table>
      </div>
      <dialog ref={staffModalRef} className="modal modal-bottom sm:modal-middle">
        <div className={`p-2 md:p-4 rounded scale-85 md:scale-100 mx-auto`}>
          <AvailableStaffs issue={issue} staffModalRef={staffModalRef} />
        </div>
      </dialog>
    </Container>
  );
};

export default AllIssues;
