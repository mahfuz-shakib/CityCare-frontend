import React, { useRef } from "react";
import Container from "../../../container/Container";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const ManageUsers = () => {
  const [user,setUser]=useState({})
  const queryClient = useQueryClient();
  const axiosSecure = useAxiosSecure();
  const { data: users, isLoading } = useQuery({
    queryKey: ["users",'citizen'],
    queryFn: async () => {
      const res = await axiosSecure.get("/users/?role=citizen");
      return res.data;
    },
  });


 const handleUpdate = (user) => {
  const status = user.isBlocked;
     Swal.fire({
       title: "Are you sure?",
       text: "You won't be able to revert this!",
       icon: "warning",
       showCancelButton: true,
       confirmButtonColor: "#3085d6",
       cancelButtonColor: "#d33",
       confirmButtonText: `Yes, ${status?"Unblock":"Block"} it!`,
     }).then((result) => {
       if (result.isConfirmed) {
         axiosSecure
           .patch(`/users/${user._id}`,{isBlocked:!status})
           .then(() => {
             Swal.fire({
               title: `${status? "Unblock":"Block"}!`,
               text: `The user has been ${status?"unblocked":"blocked"}.`,
               icon: "success",
             });
      queryClient.invalidateQueries(["users",'citizen']);

           })
           .catch((err) => {
             toast.error("Failed to update user status");
             console.error(err);
           });
       }
     });
   };
  return (
    <Container>
            <title>Manage Users</title>
        <div className="overflow-x-auto">

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
                    <th>SL.No. </th>
                    <th>Citizen Name</th>
                    <th>Email</th>
                    <th>Subscription</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users?.map((list, index) => {
                   
                    return (
                      <tr key={list._id} className={`${index % 2 ? "bg-gray-50" : "bg-violet-50"}`}>
                        <td>{index + 1}</td>
                        <td>
                          <div className="font-bold">{list.displayName}</div>
                        </td>
                        <td>
                          {list.email}
                        </td>
                        <td >
                        <button className={`btn badge ${list.isPremium?"badge-secondary":"badge-primary"}`}>
{list.isPremium?"Premium":"Free"}
                        </button>
                        </td>
                        <td>
                          <button
                            onClick={() => handleUpdate(list)}
                            className="btn badge badge-secondary btn-xs hover:scale-101"
                          >
                            {list.isBlocked?"Unblock":"Block"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </motion.table>
              </div>
    </Container>
  );
};

export default ManageUsers;
