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
import useAxios from "../../hooks/useAxios";
const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { setUser, createUser, signInWithGoogle, updateUser } = use(AuthContext);
  const axiosInstance = useAxios();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  console.log(errors);
  const onSubmit = (data) => console.log(data);

  //register by email/password
  // const handleRegister = (e) => {
  //   e.preventDefault();
  //   const name = e.target.name.value || "";
  //   const email = e.target.email.value || "";
  //   const photoURL = e.target.photo.value || "";
  //   const password = e.target.password.value || "";
  //   const confirmPassword = e.target.confirmPassword.value || "";
  //   const err = formValidation({ name, email, photoURL, password, confirmPassword });
  //   console.log({ name, email, photoURL, password, err });
  //   if (err) {
  //     setError(err);
  //     return;
  //   }

  //   setError("");
  //   //create user by email/password
  //   createUser(email, password)
  //     .then((res) => {
  //       const user = res.user;
  //       console.log(user);
  //       updateUser(user, name, photoURL);
  //       setUser({ ...user, displayName: name, photoURL: photoURL });
  //       axiosInstance
  //         .post("/users", { name, email, photoURL })
  //         .then((data) => {
  //           console.log(data);
  //         })
  //         .catch((err) => {
  //           console.log(err);
  //         });
  //       toast.success("Registration Successful");
  //       e.target.reset();
  //       navigate("/");
  //     })
  //     .catch((err) => {
  //       setError(err.code.slice(5));
  //       console.log(err.code.slice(5));
  //       toast.error(err.code.slice(5));
  //     });
  // };

  // google login
  const handleGoogleAuth = async () => {
    signInWithGoogle()
      .then((res) => {
        console.log(res.user);
        axiosInstance
          .post("/users", { name: res.user.displayName, email: res.user.email, photoURL: res.user.photoURL })
          .then((data) => {
            console.log(data);
          })
          .catch((err) => {
            console.log(err);
          });
        toast.success("Registration Successfully");
        navigate("/");
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.code);
      });
  };

  return (
    <div className={`min-h-screen flex justify-center items-center`}>
      <title>Register</title>

      <Container>
        <div className="md:flex justify-center items-center gap-36 mb-12">
          <motion.div
            initial={{ x: -150, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1, ease: easeInOut }}
            viewport={{ once: true }}
            className=" my-10"
          >
            <div className="text-center ">
              <h1 className="text-3xl md:text-5xl font-semibold  my-3 text-yellow-400">Join CityCare</h1>
              <p className="text-gray-500 mb-4">Create your account</p>
            </div>
          </motion.div>
          <motion.div
            initial={{ x: 150, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1, ease: easeInOut }}
            viewport={{ once: true }}
            className=""
          >
            <div className={`card w-full max-w-sm mx-auto shrink-0 shadow-2xl`}>
              <div className="card-body">
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
                        className="input-field"
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
                        className="input-field"
                        placeholder="Enter your email"
                      />
                      {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message} </p>}
                    </div>
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
                    <p className="mt-1 text-xs text-gray-400">PNG, JPG or JPEG (max 2MB)</p>
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
                              message:
                                "Password must be atleast one uppercase, lowercase character and digit respectively",
                            },
                          })}
                          className="input-field"
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
                    </div>
                    <button className={`btn mt-4 hover:scale-101`}>Create Account</button>
                  </fieldset>
                </form>
                <div className="flex justify-center items-center gap-2 my-1">
                  <h1 className="h-px w-24 bg-gray-300"></h1>
                  <h1 className="text-sm text-gray-500">Or continue with</h1>
                  <h1 className="h-px w-24 bg-gray-300"></h1>
                </div>
                <button onClick={handleGoogleAuth} className="btn mb-1">
                  <FcGoogle className="text-xl"></FcGoogle>
                  Sign Up with Google
                </button>
                <p className="text-center">
                  Already have an account?{" "}
                  <Link to="/login" className="text-blue-500 underline">
                    Login in Here
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
