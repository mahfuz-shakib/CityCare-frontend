import React, { memo, useRef } from "react";
import { Link, NavLink, useLocation } from "react-router";
import { FaUser } from "react-icons/fa6";
import Container from "../container/Container";
import useAuth from "../hooks/useAuth";
import NavProfileDropdown from "./NavProfileDropdown";
import { motion } from "framer-motion";

const Navbar = memo(() => {
  const { user, loading } = useAuth();
  // const [activeLabel, setActiveLabel] = useState("/");
  const location = useLocation();
  const dropdownRef = useRef(null);
  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/all-issues", label: "All Issues" },
    { to: "/map-view", label: "Map" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
  ];
  if (location.pathname.startsWith("/dashboard")) return;

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
              <NavProfileDropdown dropdownRef={dropdownRef} />
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
          </div>
        </div>
      </Container>
    </motion.nav>
  );
});

Navbar.displayName = "Navbar";
export default Navbar;
