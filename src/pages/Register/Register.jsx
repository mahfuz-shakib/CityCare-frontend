import React, { use, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import { toast } from "react-toastify";
import { motion, easeInOut } from "framer-motion";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { AuthContext } from "../../providers/AuthContext";
import Container from "../../container/Container";
import { imageUpload } from "../../utils";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const Register = () => {
  const { createUser, signInWithGoogle, updateUser } = use(AuthContext);

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  /* ---------------- SAVE USER ---------------- */
  const saveUserMutation = useMutation({
    mutationFn: (payload) => axiosSecure.post("/users", payload),
  });

  /* ---------------- EMAIL REGISTER ---------------- */
  const onSubmit = async (formData) => {
    setLoading(true);

    try {
      // Upload image
      const photoURL = await imageUpload(formData.image[0]);

      // Firebase create
      const res = await createUser(formData.email, formData.password);

      // Update firebase profile
      await updateUser(formData.name, photoURL);

      // Save to DB
      await saveUserMutation.mutateAsync({
        displayName: formData.name,
        email: formData.email,
        image: photoURL,
      });

      queryClient.invalidateQueries({ queryKey: ["users"] });

      toast.success("Account created successfully");
      navigate("/", { replace: true });
    } catch (err) {
      toast.error(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- GOOGLE REGISTER ---------------- */
  const handleGoogleAuth = async () => {
    setLoading(true);

    try {
      const res = await signInWithGoogle();
      const user = res.user;

      await saveUserMutation.mutateAsync({
        displayName: user.displayName,
        email: user.email,
        image: user.photoURL,
      });

      queryClient.invalidateQueries({ queryKey: ["users"] });

      toast.success("Registration successful");
      navigate("/", { replace: true });
    } catch {
      toast.error("Google signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <Container>
        <div className="flex flex-col md:flex-row items-center gap-28">

          {/* Left Content */}
          <motion.div
            initial={{ x: -150, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: easeInOut }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-semibold text-slate-800 mb-3">
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
            transition={{ duration: 0.8, ease: easeInOut }}
          >
            <div className="card w-full max-w-sm bg-white shadow-xl">
              <div className="card-body space-y-4">

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                  {/* Name */}
                  <div>
                    <label className="label text-slate-700">Full Name</label>
                    <input
                      {...register("name", {
                        required: "Name is required",
                        minLength: { value: 3, message: "Minimum 3 characters" },
                      })}
                      className="input input-bordered w-full"
                      placeholder="Enter your full name"
                    />
                    {errors.name && (
                      <p className="text-xs text-red-500 mt-1">
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
                          message: "Invalid email address",
                        },
                      })}
                      className="input input-bordered w-full"
                      placeholder="Enter your email"
                    />
                    {errors.email && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  {/* Image */}
                  <div>
                    <label className="label text-slate-700">Profile Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      {...register("image", { required: "Image is required" })}
                      className="file-input file-input-bordered w-full"
                    />
                    {errors.image && (
                      <p className="text-xs text-red-500 mt-1">
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
                              "Min 6 chars, uppercase, lowercase & number",
                          },
                        })}
                        className="input input-bordered w-full"
                        placeholder="Create a password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-3 text-slate-500"
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.password.message}
                      </p>
                    )}
                  </div>

                  <button
                    disabled={loading}
                    className="btn w-full bg-sky-600 hover:bg-sky-700 text-white disabled:opacity-60"
                  >
                    {loading ? "Creating..." : "Create Account"}
                  </button>
                </form>

                {/* Divider */}
                <div className="flex items-center gap-2">
                  <span className="flex-1 h-px bg-slate-300" />
                  <span className="text-sm text-slate-500">
                    Or continue with
                  </span>
                  <span className="flex-1 h-px bg-slate-300" />
                </div>

                {/* Google */}
                <button
                  onClick={handleGoogleAuth}
                  disabled={loading}
                  className="btn w-full border bg-white hover:bg-slate-100"
                >
                  <FcGoogle className="text-xl" />
                  Sign up with Google
                </button>

                {/* Footer */}
                <p className="text-center text-sm text-slate-600">
                  Already have an account?{" "}
                  <Link to="/login" className="text-sky-600 hover:underline">
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
