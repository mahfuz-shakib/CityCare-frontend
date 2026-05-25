import React, { useEffect } from "react";
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
    reset,
  } = useForm({
    defaultValues: {
      name: staff?.displayName || "",
      email: staff?.email || "",
      phone: staff?.phone || "",
      department: staff?.department || "",
    },
  });

  useEffect(() => {
    if (staff._id) {
      reset({ name: staff.displayName, email: staff.email, phone: staff.phone, department: staff.department });
    }
  }, [reset, staff]);
  const { data, mutateAsync, } = useMutation({
    mutationFn: async (payload) => axiosSecure.patch(`/staffs/${staff._id}`, payload),
  });
  const onSubmit = async (data) => {
    let imageURL = staff.photoURL; // Default to existing image
    if (data?.image && data.image[0]) {
      imageURL = await imageUpload(data.image[0]);
    }
    const staffInfo = {
      displayName: data.name,
      photoURL: imageURL,
      email: data.email,
      department: data.department,
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
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1, ease: easeInOut }}
        className={`card w-full max-w-lg md:!min-w-md mx-auto shrink-0 shadow-2xl `}
      >
        <div className="card-body bg-white rounded">
          <h1 className="text-center  md:text-xl font-bold text-wrap">Update Staff Information</h1>
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
                  readOnly
                />
                {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message} </p>}
              </div>

              <div className="grid  grid-cols-1 md:grid-cols-2 gap-5">
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
                  />
                  {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone.message} </p>}
                </div>
                <div>
                  <label className="label">Department</label>
                  <select
                    name="department"
                    id=""
                    {...register("department", { required: "department must be required" })}
                    className="w-full py-3 text-gray-500 select rounded scroll-auto"
                    key={staff?._id}
                  >
                    <option value="Infrastructure">Infrastructure</option>
                    <option value="Public Safety">Public Safety</option>
                    <option value="Environment">Environment</option>
                    <option value="Sanitation">Sanitation</option>
                    <option value="Transport">Transport</option>
                    <option value="Construction">Construction</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="label">Profile Image</label>
                <input
                  type="file"
                  id="image"
                  accept="image/*"
                  {...register("image")}
                  className="block w-full file-input file:bg-surface-container-high file:text-primary"
                />
                <p className="mt-1 text-[10px] text-gray-400">PNG, JPG or JPEG (max 2MB)</p>
              </div>

              <div className="mt-4">
                <button className="btn w-full bg-primary hover:bg-primary/90 text-white">Update Staff info.</button>
              </div>
            </fieldset>
          </form>
          <div className="absolute top-6 -right-8">
            <form method="dialog">
              <button className="w-fit md:w-32 text-red-500 text-2xl cursor-pointer hover:scale-102 hover:text-red-600">
                X
              </button>
            </form>
          </div>
        </div>
      </motion.div>
    </Container>
  );
};

export default UpdateStaffForm;
