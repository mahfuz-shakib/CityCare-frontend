import React, { use, memo } from "react";
import { Link, NavLink, useNavigate } from "react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaUser } from "react-icons/fa6";
import { toast } from "react-toastify";
import { AuthContext } from "../providers/AuthContext";
import Container from "../container/Container";
// import logo from "../../public/assets/paw_logo.png";
const Navbar = memo(() => {
  const [openDropdown, setOpenDropdown] = useState(false);
  const { user, loading, logOut } = use(AuthContext);
  // console.log(user);
  const navigate = useNavigate();
  const links = (
    <>
      <li>
        <NavLink to="/">Home</NavLink>
      </li>
      <li>
        <NavLink to="/all-issues">All Issues</NavLink>
      </li>
      <li>
        <NavLink to="/about">About</NavLink>
      </li>
      <li>
        <NavLink to="/contact">Contact</NavLink>
      </li>
    </>
  );

  const handdleLogOut = () => {
    logOut();
    setOpenDropdown(false);
    navigate("/");
    toast("Log out successfully");
  };
  return (
    <motion.div
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`shadow-md sticky top-0 z-50 bg-white backdrop-blur-sm bg-opacity-95`}
    >
      <Container>
        <div className="navbar flex justify-between items-center py-2">
          <div className="md:navbar-start flex items-center">
            <div className="dropdown">
              <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {" "}
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />{" "}
                </svg>
              </div>
              <ul
                tabIndex="-1"
                className="menu menu-sm dropdown-content bg-gray-600 text-base text-white rounded-box z-1 mt-3 w-52 p-2 shadow"
              >
                {links}
                {!user && (
                  <>
                    <li>
                      <Link to="/login" className="btn btn-outline mt21  ">
                        Login
                      </Link>
                    </li>
                    <li>
                      <Link to="/register" className="btn  mt-2 ">
                        Register
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-32 sm:w-full relative -ml-2 flex items-center gap-1"
            >
              <Link
                to="/"
                className={`text-[22px] md:text-[26px] absolute ml-9 font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent`}
              >
                CityCare
              </Link>
            </motion.button>
          </div>
          <div className="navbar-center hidden lg:flex">
            <ul className="menu menu-horizontal px-1">{links}</ul>
          </div>

          <div className={`navbar-end ${!user && "space-x-2"}`}>
            {loading ? (
              <span className="loading loading-bars loading-md"></span>
            ) : user ? (
              <>
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    referrerPolicy="no-referrer"
                    onClick={() => setOpenDropdown(!openDropdown)}
                    alt=""
                    className="size-10 rounded-full border-2 border-indigo-300 hover:cursor-pointer hover:scale-102 "
                  />
                ) : (
                  <FaUser
                    onClick={() => setOpenDropdown(!openDropdown)}
                    className="size-10 rounded-full border-2 border-indigo-300 hover:cursor-pointer hover:scale-102 "
                  />
                )}
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline  ">
                  Login
                </Link>
                <Link to="/register" className="btn hidden md:flex hover:!from-pink-500 hover:!to-yellow-600">
                  Register
                </Link>
              </>
            )}
            <AnimatePresence>
              {openDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute w-48 right-0 top-2 bg-white shadow-xl border border-gray-200 flex flex-col text-center p-2 space-y-1 rounded-lg mt-12 z-50"
                >
                  <motion.div whileHover={{ backgroundColor: "#f3f4f6" }}>
                    <Link
                      to="/dashboard/myProfile"
                      onClick={() => setOpenDropdown(false)}
                      className="block rounded py-2 px-4 transition-colors"
                    >
                      {user.displayName}
                    </Link>
                  </motion.div>
                  <motion.div whileHover={{ backgroundColor: "#f3f4f6" }}>
                    <Link
                      to="/dashboard"
                      onClick={() => setOpenDropdown(false)}
                      className="block rounded py-2 px-4 transition-colors"
                    >
                      Dashboard
                    </Link>
                  </motion.div>
                  <motion.button
                    whileHover={{ backgroundColor: "#fee2e2" }}
                    onClick={handdleLogOut}
                    className="rounded py-2 px-4 transition-colors text-red-600"
                  >
                    Log Out
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </Container>
    </motion.div>
  );
});

Navbar.displayName = "Navbar";

export default Navbar;
