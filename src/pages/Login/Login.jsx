import React, { use, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { FaEye } from "react-icons/fa6";
import { FaEyeSlash } from "react-icons/fa6";
import { toast } from "react-toastify";
import { FcGoogle } from "react-icons/fc";
import { motion, easeInOut } from "framer-motion";
import Container from "../../container/Container";
import { useForm } from "react-hook-form";
import { AuthContext } from "../../providers/AuthContext";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useMutation, useQueryClient } from "@tanstack/react-query";
const Login = () => {
  const { signInWithGoogle, signInUser } = use(AuthContext);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { data, mutateAsync } = useMutation({
    mutationFn: async (payload) => axiosSecure.post("/users", payload),
  });
  console.log(errors);
  const onSubmit = (data) => {
    console.log(data);
    const email = data?.email;
    const password = data?.password;
    signInUser(email, password)
      .then((res) => {
        console.log(res.user);
        toast.success("Login Successfully");
        navigate(location.state ? location.state : "/");
      })
      .catch((err) => {
        if (err.code.slice(5) == "invalid-credential") {
          setError("Invalid email or password");
          toast.error("Invalid email or password");
        } else {
          setError(err.code.slice(5));
          toast.error(err.code.slice(5));
        }
      });
  };

  // login by google
  const handleGoogleAuth = () => {
    signInWithGoogle()
      .then(async (res) => {
        const userInfo = { displayName: res.user.displayName, email: res.user.email, image: res.user.photoURL };
        console.log(res.user);
        toast.success("Login Successful");
        await mutateAsync(userInfo);
      queryClient.invalidateQueries();

        navigate(location.state ? location.state : "/");
      })
      .catch((err) => {
        toast.error(err.code);
      });
  };

  return (
  <div className="min-h-screen flex justify-center items-center bg-slate-50">
    <title>Login</title>

    <Container>
      <div className="md:flex justify-center items-center">
        <motion.div
          initial={{ x: 150, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1, ease: easeInOut }}
          viewport={{ once: true }}
          className="md:w-1/2"
        >
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-3xl font-semibold text-slate-800">
              Welcome Back
            </h1>
            <p className="text-slate-500">
              Sign in to your account
            </p>
          </div>

          {/* Card */}
          <div className="card w-full max-w-sm mx-auto bg-white shadow-lg">
            <div className="card-body">

              <form onSubmit={handleSubmit(onSubmit)}>
                <fieldset className="fieldset space-y-4">

                  {/* Email */}
                  <div>
                    <label className="label text-slate-700">Email</label>
                    <input
                      type="email"
                      {...register("email", {
                        required: "Email is required",
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

                  {/* Password */}
                  <div>
                    <label className="label text-slate-700">
                      Password
                    </label>

                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        {...register("password", {
                          required: "Password is required",
                        })}
                        className="input input-bordered w-full border-slate-300 focus:border-sky-500"
                        placeholder="Enter password"
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
                    Sign In
                  </button>
                </fieldset>
              </form>

              {error && (
                <p className="text-red-500 text-sm mt-2">
                  {error}
                </p>
              )}

              {/* Divider */}
              <div className="flex justify-center items-center gap-2 my-4">
                <span className="h-px w-24 bg-slate-300"></span>
                <span className="text-sm text-slate-500">
                  Or continue with
                </span>
                <span className="h-px w-24 bg-slate-300"></span>
              </div>

              {/* Google Login */}
              <button
                onClick={handleGoogleAuth}
                className="btn w-full border border-slate-300 bg-white hover:bg-slate-100"
              >
                <FcGoogle className="text-xl" />
                Sign in with Google
              </button>

              {/* Footer */}
              <p className="text-center text-slate-600 mt-4">
                New here?{" "}
                <Link
                  to="/register"
                  className="text-sky-600 hover:text-sky-700 underline"
                >
                  Create an account
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

export default Login;
