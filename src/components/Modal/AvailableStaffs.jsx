import React from "react";
import { toast } from "react-toastify";
import { easeInOut, motion } from "framer-motion";
import Container from "../../container/Container";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
const AvailableStaffs = ({ issue, staffModalRef }) => {

  const queryClient = useQueryClient();
  const axiosSecure = useAxiosSecure();
  const { data: staffs, isLoading } = useQuery({
    queryKey: ["staffs"],
    queryFn: async () => {
      const res = await axiosSecure.get("/staffs");
      return res.data;
    },
  });
  const handleAssign = (staff) => {
    const assignedStaff = {
      displayName: staff.displayName,
      email: staff.email,
      phone: staff.phone,
    };
    axiosSecure
      .patch(`/issues/${issue._id}`, {assignedStaff})
      .then((data) => {
        console.log(data.data);
        toast.success("Assigned successful");
        staffModalRef.current.close();
        queryClient.invalidateQueries(["issues", "adminPage"]);
      })
      .catch((err) => {
        toast.error("Updated failed");
        console.log(err);
      });
  };
  return (
    <Container>
      <motion.div
        initial={{ x: 150, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1, ease: easeInOut }}
        viewport={{ once: true }}
        className={`card w-full md:min-w-5xl shrink-0 shadow-2xl`}
      >
        <div className="card-body bg-white rounded">
          <h1 className="text-center  md:text-xl font-bold text-wrap">Update Staff Info.</h1>

          <motion.table
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="table max-w-6xl mx-auto"
          >
            <thead>
              <tr className="bg-green-50">
                <th>SL.No. </th>
                <th>Staff Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {staffs?.map((list, index) => {
                return (
                  <tr key={list._id} className={`${index % 2 ? "bg-gray-50" : "bg-violet-50"}`}>
                    <td>{index + 1}</td>
                    <td>
                      <div className="font-bold">{list.displayName}</div>
                    </td>
                    <td>{list.email}</td>
                    <td>{list.phone}</td>
                    <td>
                      <button
                        onClick={() => handleAssign(list)}
                        className="btn badge badge-primary btn-xs hover:scale-101"
                      >
                        Assign
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </motion.table>
          <div className="w-fit mx-auto ">
            <form method="dialog">
              <button className="btn bg-primary/10">Cancel</button>
            </form>
          </div>
        </div>
      </motion.div>
    </Container>
  );
};

export default AvailableStaffs;
