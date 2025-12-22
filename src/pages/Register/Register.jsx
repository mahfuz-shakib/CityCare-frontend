import React, { use, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { FaEye } from "react-icons/fa6";
import { FaEyeSlash } from "react-icons/fa6";
import { toast } from "react-toastify";
import { easeInOut, motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import { AuthContext } from "../../providers/AuthContext";
import Container from "../../container/Container";
import { imageUpload } from "../../utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { createUser, signInWithGoogle, updateUser } = use(AuthContext);
  const queryClient = useQueryClient();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { data, mutateAsync } = useMutation({
    mutationFn: async (payload) => axiosSecure.post("/users", payload),
  });
  const onSubmit = async (data) => {
    const photoURL = await imageUpload(data?.image[0]);
    const userInfo = {
      displayName: data.name,
      photoURL,
      email: data.email,
    };

    createUser(data.email, data.password)
      .then(async (res) => {
        console.log(res);
        toast.success("Registration Successful");
        await mutateAsync(userInfo);
        updateUser(data.name, photoURL).then((response) => {
          console.log(response);
        });
      queryClient.invalidateQueries();
        navigate("/");
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };

  const handleGoogleAuth = async () => {
    signInWithGoogle()
      .then(async (res) => {
        console.log(res);
        toast.success("Registration Successful");
        const userInfo = { displayName: res.user?.displayName, email: res.user?.email, photoURL: res.user?.photoURL };
        await mutateAsync(userInfo);
        navigate("/");
      })
      .catch((err) => {
        toast.error(err.code);
      });
  };

 return (
  <div className="min-h-screen flex justify-center items-center bg-slate-50">
    <title>Register</title>

    <Container>
      <div className="md:flex justify-center items-center gap-36 mb-12">

        {/* Left Content */}
        <motion.div
          initial={{ x: -150, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1, ease: easeInOut }}
          viewport={{ once: true }}
          className="my-10 text-center"
        >
          <h1 className="text-3xl md:text-5xl font-semibold text-slate-800 mb-3">
            Join <span className="text-sky-600">CityCare</span>
          </h1>
          <p className="text-slate-500">
            Create your citizen account
          </p>
        </motion.div>

        {/* Form Card */}
        <motion.div
          initial={{ x: 150, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1, ease: easeInOut }}
          viewport={{ once: true }}
        >
          <div className="card w-full max-w-sm mx-auto bg-white shadow-lg">
            <div className="card-body">

              <form onSubmit={handleSubmit(onSubmit)}>
                <fieldset className="fieldset space-y-4">

                  {/* Name */}
                  <div>
                    <label className="label text-slate-700">Full Name</label>
                    <input
                      type="text"
                      {...register("name", {
                        required: "Name is required",
                        minLength: { value: 3, message: "Minimum 3 characters" },
                        maxLength: { value: 25, message: "Maximum 25 characters" },
                      })}
                      className="input input-bordered w-full border-slate-300 focus:border-sky-500"
                      placeholder="Enter your full name"
                    />
                    {errors.name && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="label text-slate-700">Email</label>
                    <input
                      type="email"
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: "Enter a valid email",
                        },
                      })}
                      className="input input-bordered w-full border-slate-300 focus:border-sky-500"
                      placeholder="Enter your email"
                    />
                    {errors.email && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  {/* Profile Image */}
                  <div>
                    <label className="label text-slate-700">Profile Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      {...register("image", { required: "Image is required" })}
                      className="block w-full text-sm text-slate-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-md file:border-0
                        file:text-sm file:font-semibold
                        file:bg-sky-50 file:text-sky-700
                        hover:file:bg-sky-100
                        bg-slate-100 border border-dashed border-slate-300
                        rounded-md cursor-pointer py-2"
                    />
                    {errors.image && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.image.message}
                      </p>
                    )}
                  </div>

                  {/* Password */}
                  <div>
                    <label className="label text-slate-700">Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        {...register("password", {
                          required: "Password is required",
                          pattern: {
                            value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/,
                            message:
                              "At least 1 uppercase, 1 lowercase & 1 number",
                          },
                        })}
                        className="input input-bordered w-full border-slate-300 focus:border-sky-500"
                        placeholder="Create a password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute top-3 right-4 text-slate-500 hover:text-slate-700"
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.password.message}
                      </p>
                    )}
                  </div>

                  {/* Submit */}
                  <button className="btn w-full bg-sky-600 hover:bg-sky-700 text-white">
                    Create Account
                  </button>
                </fieldset>
              </form>

              {/* Divider */}
              <div className="flex justify-center items-center gap-2 my-4">
                <span className="h-px w-24 bg-slate-300"></span>
                <span className="text-sm text-slate-500">
                  Or continue with
                </span>
                <span className="h-px w-24 bg-slate-300"></span>
              </div>

              {/* Google */}
              <button
                onClick={handleGoogleAuth}
                className="btn w-full bg-white border border-slate-300 hover:bg-slate-100"
              >
                <FcGoogle className="text-xl" />
                Sign up with Google
              </button>

              {/* Footer */}
              <p className="text-center text-slate-600 mt-4">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-sky-600 hover:text-sky-700 underline"
                >
                  Login here
                </Link>
              </p>

            </div>
          </div>
        </motion.div>
      </div>
    </Container>
  </div>
);

};

export default Register;
