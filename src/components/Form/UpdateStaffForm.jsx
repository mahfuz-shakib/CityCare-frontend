import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { easeInOut, motion } from "framer-motion";
import Container from "../../container/Container";
import { imageUpload } from "../../utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
const UpdateStaffForm = ({ staff, updateModalRef }) => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { data, mutateAsync } = useMutation({
    mutationFn: async (payload) => axiosSecure.patch(`/staffs/${staff._id}`, payload),
  });
  const onSubmit = async (data) => {
    let imageURL = staff.photoURL; // Default to existing image
    if (data?.image && data.image[0]) {
      imageURL = await imageUpload(data.image[0]);
    }
    console.log(data);
    console.log("create-staff");
    const staffInfo = {
      displayName: data.name,
      photoURL: imageURL,
      email: data.email,
      password: data.password,
      phone: data.phone,
    };
    const res = await mutateAsync(staffInfo);
    console.log(res.data);
    if (res.data) {
      toast.success("Staff updated successfully");
      queryClient.invalidateQueries(["staffs"]);
      updateModalRef.current.close();
    }
  };
  return (
    <Container>
      <motion.div
        initial={{ x: 150, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1, ease: easeInOut }}
        viewport={{ once: true }}
        className={`card w-full max-w-lg md:!min-w-md  mx-auto shrink-0 shadow-2xl`}
      >
        <div className="card-body bg-white rounded">
        <h1 className="text-center  md:text-xl font-bold text-wrap">Update Staff Info.</h1>
          <form onSubmit={handleSubmit(onSubmit)}>
            <fieldset className="fieldset">
              <div>
                <label className="label">Name</label>
                <input
                  type="text"
                  id="name"
                  {...register("name", {
                    required: "Name must be required",
                    minLength: { value: 3, message: "Name atleast 3 character" },
                    maxLength: { value: 25, message: "Name atmost 25 character" },
                  })}
                  defaultValue={staff.displayName}
                  className="input-field md:w-full"
                />
                {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message} </p>}
              </div>

              <div>
                <label className="label">Email</label>
                <input
                  type="email"
                  id="email"
                  {...register("email", {
                    required: "email must be required",
                    pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Please enter a valid email" },
                  })}
                  className="input-field md:w-full"
                  defaultValue={staff.email}
                  readOnly
                />
                {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message} </p>}
              </div>

              <div>
                <label className="label">Phone Number</label>
                <input
                  type="text"
                  id="text"
                  {...register("phone", {
                    required: "phone number must be required",
                    minLength: { value: 11, message: "Number must be 11 digits" },
                    maxLength: { value: 11, message: "Number must be 11 digits" },
                  })}
                  className="input-field md:w-full"
                  defaultValue={staff.phone}
                />
                {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone.message} </p>}
              </div>

              <div>
                <label className="label">Profile Image</label>
                <input
                  type="file"
                  id="image"
                  accept="image/*"
                  {...register("image")}
                  className="block w-full text-sm text-gray-500
                                  file:mr-4 file:py-2 file:px-4
                                  file:rounded-md file:border-0
                                  file:text-sm file:font-semibold
                                file:bg-lime-50 file:text-lime-700
                                hover:file:bg-lime-100
                                bg-gray-100 border border-dashed border-lime-300 rounded-md cursor-pointer
                                  focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-lime-400
                                  py-2"
                />
                {/* <p className="mt-1 text-xs text-gray-400">PNG, JPG or JPEG (max 2MB)</p> */}
              </div>

              <div className="flex gap-2 mt-4 justify-between">
                <div className="w-fit">
                  <form method="dialog">
                    <button className="btn bg-primary/10">Cancel</button>
                  </form>
                </div>
                <button className={`btn  hover:scale-101`}>Update Staff</button>
              </div>
            </fieldset>
          </form>
        </div>
      </motion.div>
    </Container>
  );
};

export default UpdateStaffForm;
