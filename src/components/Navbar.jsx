import React, { memo, use, useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { FaUser } from "react-icons/fa6";
import { toast } from "react-toastify";
import { AuthContext } from "../providers/AuthContext";
import Container from "../container/Container";

const Navbar = memo(() => {
  const { user, loading, logOut } = use(AuthContext);
  const [openDropdown, setOpenDropdown] = useState(false);
  // const [activeLabel, setActiveLabel] = useState("/");
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogOut = async () => {
    await logOut();
    setOpenDropdown(false);
    navigate("/");
    toast.success("Logged out successfully");
  };

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/all-issues", label: "All Issues" },
    { to: "/map-view", label: "Map" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
  ];

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.4 }}
      className="sticky  top-0 z-50 bg-white/95 backdrop-blur shadow-sm"
    >
      <Container>
        <div className="navbar py-2">
          {/* LEFT */}
          <div className="navbar-start">
            <div className="dropdown lg:hidden">
              <label tabIndex={0} className="btn btn-ghost">
                ☰
              </label>
              <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 p-2 shadow bg-white rounded-box w-52">
                {navLinks.map(({ to, label }) => (
                  <li key={to}>
                    <NavLink to={to} className={({ isActive }) => (isActive ? "text-sky-600 font-medium" : "")}>
                      {label}
                    </NavLink>
                  </li>
                ))}
                {!user && (
                  <>
                    <li>
                      <Link to="/login">Login</Link>
                    </li>
                    <li>
                      <Link to="/register">Register</Link>
                    </li>
                  </>
                )}
              </ul>
            </div>

            <Link
              to="/"
              className="text-2xl font-bold bg-gradient-to-r from-sky-600 to-indigo-600 bg-clip-text text-transparent"
            >
              CityCare
            </Link>
          </div>

          {/* CENTER */}
          <div className=" navbar-center hidden lg:flex">
            <ul className="menu relative menu-horizontal gap-1">
              {navLinks.map(({ to, label }) => (
                <li key={to}>
                  <NavLink to={to} className={({ isActive }) => (isActive ? `text-sky-600 font-medium ` : "")}>
                    {label}
                  </NavLink>
                  {/* {(label===activeLabel) && <div className="w-full absolute top-8.5 border-b-3 border-sky-600"></div>} */}
                </li>
              ))}
            </ul>
          </div>

          {/* RIGHT */}
          <div className="navbar-end gap-2 relative" ref={dropdownRef}>
            {loading ? (
              <span className="loading loading-spinner loading-sm" />
            ) : user ? (
              <button onClick={() => setOpenDropdown((p) => !p)}>
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || "User avatar"}
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 cursor-pointer rounded-full border border-slate-300"
                  />
                ) : (
                  <FaUser className="w-10 h-10 p-2 rounded-full border border-slate-300" />
                )}
              </button>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline btn-sm">
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary btn-sm hidden md:flex">
                  Register
                </Link>
              </>
            )}

            <AnimatePresence>
              {openDropdown && user && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="absolute right-0 mt-12 w-48 bg-white border rounded-lg shadow-lg"
                >
                  <Link
                    to="/dashboard/myProfile"
                    onClick={() => setOpenDropdown(false)}
                    className="block px-4 py-2 hover:bg-slate-100"
                  >
                    {user.displayName}
                  </Link>
                  <Link
                    to="/dashboard"
                    onClick={() => setOpenDropdown(false)}
                    className="block px-4 py-2 hover:bg-slate-100"
                  >
                    Dashboard
                  </Link>
                  <button onClick={handleLogOut} className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50">
                    Log Out
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </Container>
    </motion.nav>
  );
});

Navbar.displayName = "Navbar";
export default Navbar;
