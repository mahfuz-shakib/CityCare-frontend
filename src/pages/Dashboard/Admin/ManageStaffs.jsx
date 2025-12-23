import React, { useRef } from "react";
import Container from "../../../container/Container";
import CreateStaffForm from "../../../components/Form/CreateStaffForm";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { motion } from "framer-motion";
import UpdateStaffForm from "../../../components/Form/UpdateStaffForm";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const ManageStaffs = () => {
  const [staff,setStaff]=useState({})
  const modalRef = useRef();
  const updateModalRef = useRef();
  const queryClient = useQueryClient();

  const axiosSecure = useAxiosSecure();
  const { data: staffs, isLoading } = useQuery({
    queryKey: ["staffs"],
    queryFn: async () => {
      const res = await axiosSecure.get("/staffs");
      return res.data;
    },
  });
  const { data, mutateAsync:deleteStaff } = useMutation({
    mutationFn: async (id) => axiosSecure.delete(`/staffs/${id}`),
  });
  const handleCreateStaff = () => {
    modalRef.current.showModal();
  };
  const handleUpdate = (staff) => {
    setStaff(staff);
    updateModalRef.current.showModal();
  };
 const handleDelete = (staff) => {
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
           .delete(`/staffs/${staff._id}`)
           .then(() => {
             Swal.fire({
               title: "Deleted!",
               text: "Staff has been deleted successfully.",
               icon: "success",
             });
      queryClient.invalidateQueries(["staffs"]);

           })
           .catch((err) => {
             toast.error("Failed to delete staff");
             console.error(err);
           });
       }
     });
   };
  return (
    <Container>
            <title>Manage Staffs</title>

      <div>
      <div className="text-right my-6">
        <button onClick={handleCreateStaff} className="btn btn-primary">
          Create New staff
        </button>
      </div>
      <dialog ref={modalRef} className="modal modal-bottom sm:modal-middle">
        <div className={`p-2 md:p-4 rounded scale-85 md:scale-100 mx-auto`}>
          <h1 className="text-center font-bold mb-2 md:mb-3">Staff Information</h1>
          <CreateStaffForm modalRef={modalRef} />
        </div>
      </dialog>
      </div>
      <div>
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
                    <th>Staff Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Action</th>
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
                        <td>
                          {list.email}
                        </td>
                        <td >{list.phone}</td>
                        <td>
                          <button
                            onClick={() => handleUpdate(list)}
                            className="btn badge badge-primary btn-xs hover:scale-101"
                          >
                            Update
                          </button>
                        </td>
                        <td>
                          <button
                            onClick={() => handleDelete(list)}
                            className="btn badge badge-secondary btn-xs hover:scale-101"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </motion.table>
              <dialog ref={updateModalRef} className="modal modal-bottom sm:modal-middle">
                <div className={`p-2 md:p-4 rounded scale-85 md:scale-100 mx-auto`}>
                  <UpdateStaffForm staff={staff} updateModalRef={updateModalRef}  />
                  <div className="w-fit mx-auto ">
                    <form method="dialog">
                      <button className="btn bg-primary/10">Cancel</button>
                    </form>
                  </div>
                </div>
              </dialog>
      </div>
    </Container>
  );
};

export default ManageStaffs;
