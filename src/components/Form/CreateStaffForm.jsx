import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { FaEye } from "react-icons/fa6";
import { FaEyeSlash } from "react-icons/fa6";
import { toast } from "react-toastify";
import { easeInOut, motion } from "framer-motion";
import useAuth from "../../hooks/useAuth";
import Container from "../../container/Container";
import { imageUpload } from "../../utils";
const CreateStaffForm = ({ modalRef }) => {
  const [showPassword, setShowPassword] = useState(false);
  const { createUser, updateUser } = useAuth();
  // const axiosInstance = useAxios();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const onSubmit = async (data) => {
    // const photoURL = await imageUpload(data?.image[0]);
    console.log(data);
    console.log("create-staff");
    // createUser(data?.email, data?.password).then((res) => {
    //   updateUser(data.name, photoURL).then((res) => {
    //     toast("staff Successfull");
    //     modalRef.current.close()
    //   });
    // });
  };
  return (
    <Container>
      <div className="mb-12">
        <motion.div
          initial={{ x: 150, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1, ease: easeInOut }}
          viewport={{ once: true }}
          className={`card w-full max-w-lg  mx-auto shrink-0 shadow-2xl`}
        >
          <div className="card-body max-w-lg bg-gray-500 rounded">
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
                    placeholder="Enter your full name"
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
                    placeholder="Enter your email"
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
                    placeholder="017xxxxxxx"
                  />
                  {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message} </p>}
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
                  {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message} </p>}
                </div>
                <div className="flex gap-2">
                  <div className="w-fit">
                    <form method="dialog">
                      <button className="btn bg-primary/10">Cancel</button>
                    </form>
                  </div>
                  <button className={`btn mt-4 hover:scale-101`}>Create Staff</button>
                </div>
              </fieldset>
            </form>
          </div>
        </motion.div>
      </div>
    </Container>
  );
};

export default CreateStaffForm;
