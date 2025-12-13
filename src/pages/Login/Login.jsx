import React, { use, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { FaEye } from "react-icons/fa6";
import { FaEyeSlash } from "react-icons/fa6";
import { toast } from "react-toastify";
import { FcGoogle } from "react-icons/fc";
import { motion, easeInOut} from "framer-motion";
import { AuthContext } from "../../providers/AuthContext";
import Container from "../../container/Container";
import useAxios from "../../hooks/useAxios";
const Login = () => {
  const { signInWithGoogle, signInUser } = use(AuthContext);
  const axiosInstance = useAxios();
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // login by email/passsword
  const handleSignIn = (e) => {
    e.preventDefault();
    console.log("login clicked");
    const email = e.target.email.value;
    const password = e.target.password.value;
    setError("");
    // login by email/passsword
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
    setError("");
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
        toast.success("Login Successfully");
        navigate(location.state ? location.state : "/");
      })
      .catch((err) => {
        setError(err.code);
        toast.error(err.code);
      });
  };

  return (
    <div className={`min-h-screen flex justify-center items-center `}>
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
            <div className="text-center ">
              <h1 className="text-3xl font-semibold  my-3 text-white">Welcome Back</h1>
              <p className="text-gray-50 mb-4">Sign in to your PawMart account</p>
            </div>
            <div className={`card w-full max-w-sm mx-auto shrink-0 shadow-2xl  `}>
              <div className="card-body">
                <form onSubmit={handleSignIn}>
                  <fieldset className="fieldset">
                    <label className="label">Email</label>
                    <input type="email" name="email" className="input-field" placeholder="Enter your email" />
                    <label className="label">Enter your password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        id="password"
                        className="input-field"
                        placeholder="Password"
                      />
                      <button
                        onClick={() => setShowPassword(!showPassword)}
                        type="button"
                        className="text-base text-gray-700 absolute top-3 right-6 hover:cursor-pointer z-10"
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                    {/* <Link to="/forgotPassword" className="link link-hover mt-2">
                      Forgot password?
                    </Link> */}
                    <button className={`btn text-white mt-4 hover:bg-gray-500`}>Sign in</button>
                  </fieldset>
                </form>
                {error && <p className="text-red-500">{error}</p>}
                <div className="flex justify-center items-center gap-2 my-1">
                  <h1 className="h-px w-24 bg-gray-300"></h1>
                  <h1 className="text-sm text-gray-500">Or continue with</h1>
                  <h1 className="h-px w-24 bg-gray-300"></h1>
                </div>
                <button onClick={handleGoogleAuth} className="btn mb-1">
                  <FcGoogle className="text-xl"></FcGoogle>
                  Sign in with Google
                </button>
                <p className="text-center">
                  New to our website?{" "}
                  <Link to="/register" className="text-blue-500 underline">
                    Sign Up Here
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
