import React, { use, useState } from "react";
import { Link, useNavigate } from "react-router";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import { motion, easeInOut } from "framer-motion";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Container from "../../container/Container";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from '../../hooks/useAxiosSecure'
const Login = () => {
  const { signInUser, signInWithGoogle, loading, setLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState("");
  const queryClient = useQueryClient();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  /* ---------------- GOOGLE USER SAVE ---------------- */

  const { mutateAsync: saveUserToDB } = useMutation({
    mutationFn: (payload) =>
      axiosSecure.post(`/users`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });

  /* ---------------- EMAIL LOGIN ---------------- */
  const onSubmit = async ({ email, password }) => {
    setAuthError("");
    try {
      await signInUser(email, password);
      toast.success("Login successful");
      navigate(location.state || "/", { replace: true });
    } catch (err) {
      console.log(err.code);
      const message = err.code?.includes("invalid-credential")
        ? "Invalid email or password"
        : err.code?.includes("user-not-found")
          ? "User not found. Try with registered credential."
          : "Login failed. Try again.";
      setAuthError(message);
      toast.error(message);
    }
  };

  /* ---------------- GOOGLE LOGIN ---------------- */
  const handleGoogleAuth = async () => {
    setLoading(true);
    try {
      const res = await signInWithGoogle();
      const user = res.user;

      navigate(location.state || "/", { replace: true });
      toast.success("Login successful");
      
      await saveUserToDB({
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
      });

      queryClient.invalidateQueries({ queryKey: ["users"] });
    } catch (err) {
      console.error(err);
      toast.error("Google login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <Container>
        <motion.div
          initial={{ x: 150, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: easeInOut }}
          className="w-full max-w-sm mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-3xl font-semibold text-slate-800">Welcome Back</h1>
            <p className="text-slate-500">Sign in to your account</p>
          </div>

          {/* Card */}
          <div className="card bg-white shadow-xl">
            <div className="card-body space-y-4">
              {/* Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Email */}
                <div>
                  <label className="label text-slate-700">Email</label>
                  <input
                    type="email"
                    {...register("email", { required: "Email is required" })}
                    className="input input-bordered w-full"
                    placeholder="Enter your email"
                  />
                  {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
                </div>

                {/* Password */}
                <div>
                  <label className="label text-slate-700">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      {...register("password", { required: "Password is required" })}
                      className="input input-bordered w-full"
                      placeholder="Enter password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-3 text-slate-500 z-1"
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
                </div>

                <button
                  disabled={loading}
                  className="btn w-full bg-sky-600 hover:bg-sky-700 text-white disabled:opacity-60"
                >
                  {loading ? "Signing in..." : "Sign In"}
                </button>
              </form>

              {authError && <p className="text-sm text-red-500 text-center">{authError}</p>}

              {/* Divider */}
              <div className="flex items-center gap-2">
                <span className="flex-1 h-px bg-slate-300" />
                <span className="text-sm text-slate-500">Or continue with</span>
                <span className="flex-1 h-px bg-slate-300" />
              </div>

              {/* Google */}
              <button
                onClick={handleGoogleAuth}
                disabled={loading}
                className="btn w-full border bg-white hover:bg-slate-100"
              >
                <FcGoogle className="text-xl" />
                Continue with Google
              </button>

              {/* Footer */}
              <p className="text-center text-slate-600 text-sm">
                New here?{" "}
                <Link to="/register" className="text-sky-600 hover:underline">
                  Create an account
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </Container>
    </div>
  );
};

export default Login;
