import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FaEye } from "react-icons/fa6";
import { FaEyeSlash } from "react-icons/fa6";
import { toast } from "react-toastify";
import { easeInOut, motion } from "framer-motion";
import Container from "../../container/Container";
import { imageUpload } from "../../utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
const CreateStaffForm = ({ createModalRef }) => {
  const [showPassword, setShowPassword] = useState(false);
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { data, mutateAsync } = useMutation({
    mutationFn: async (payload) => axiosSecure.post("/staffs", payload),
  });

  const onSubmit = async (data) => {
    const photoURL = await imageUpload(data?.image[0]);

    const staffInfo = {
      displayName: data.name,
      photoURL,
      email: data.email,
      password: data.password,
      phone: data.phone,
      department: data.department,
    };
    console.log(staffInfo);
    const res = await mutateAsync(staffInfo);
    console.log(res.data);
    if (res.data.currentStaff?.insertedId) {
      toast.success("Staff creation successful");
      queryClient.invalidateQueries(["staffs"]);
      createModalRef.current.close();
    }
  };
  return (
    <Container>
      <div className="mb-12">
        <motion.div
          initial={{ x: 150, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1, ease: easeInOut }}
          viewport={{ once: true }}
          className={`card w-full max-w-lg md:!min-w-md  mx-auto shrink-0 shadow-2xl`}
        >
          <div className="card-body bg-white rounded">
            <h1 className="text-center text-lg font-bold">Add New Staff Member</h1>
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
                    placeholder="Enter staff name"
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
                    placeholder="Enter staff email"
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
                      placeholder="017xxxxxxx"
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
                    >
                      <option value="" className="">
                        Select Department
                      </option>
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

                <div>
                  <label className="label">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      {...register("password", {
                        required: "password must be required",
                        pattern: {
                          value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/,
                          message: "Password must be atleast one uppercase, lowercase character and digit respectively",
                        },
                      })}
                      className="input-field md:w-full"
                      placeholder="Create a password"
                    />
                    <button
                      onClick={() => setShowPassword(!showPassword)}
                      type="button"
                      className="text-base text-gray-700  absolute top-3 right-6 hover:cursor-pointer z-10"
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 w-full text-xs text-red-500 text-wrap">{errors.password.message} </p>
                  )}
                </div>

                <div className="mt-4">
                  <button className="btn w-full bg-primary hover:bg-primary/90 text-white">Create New Staff</button>
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
      </div>
    </Container>
  );
};

export default CreateStaffForm;
