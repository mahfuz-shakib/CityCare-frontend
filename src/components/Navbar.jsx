import React, { memo, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router";
import { Menu, ShieldCheck, X } from "lucide-react";
import Container from "../container/Container";
import useAuth from "../hooks/useAuth";
import NavProfileDropdown from "./NavProfileDropdown";
import { motion } from "framer-motion";

const Navbar = memo(() => {
  const { user, loading } = useAuth();
  // const [activeLabel, setActiveLabel] = useState("/");
  const location = useLocation();
  const dropdownRef = useRef(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
      className="sticky top-0 z-[2000] bg-white/95 backdrop-blur shadow-sm"
    >
      <Container>
        <div className="navbar py-2">
          {/* LEFT */}
          <div className="navbar-start gap-3">
            <div className="lg:hidden">
              <button
                type="button"
                aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
                aria-expanded={mobileMenuOpen}
                onClick={() => setMobileMenuOpen((open) => !open)}
                className="btn btn-ghost btn-square text-primary"
              >
                {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
              {mobileMenuOpen && (
                <ul className="absolute left-4 right-4 top-16 z-[2100] rounded-2xl border border-slate-200 bg-white p-3 shadow-xl">
                  {navLinks.map(({ to, label }) => (
                    <li key={to}>
                      <NavLink
                        to={to}
                        onClick={() => setMobileMenuOpen(false)}
                        className={({ isActive }) =>
                          `block rounded-xl px-4 py-3 font-semibold ${isActive ? "bg-blue-50 text-primary" : "text-slate-600"}`
                        }
                      >
                        {label}
                      </NavLink>
                    </li>
                  ))}
                  {!user && (
                    <>
                      <li>
                        <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                          Login
                        </Link>
                      </li>
                      <li>
                        <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                          Register
                        </Link>
                      </li>
                    </>
                  )}
                </ul>
              )}
            </div>

            <Link to="/" className="flex items-center gap-2 text-2xl font-extrabold tracking-tight text-primary">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white shadow-sm">
                <ShieldCheck size={21} />
              </span>
              CityCare
            </Link>
          </div>

          {/* CENTER */}
          <div className=" navbar-center hidden lg:flex">
            <ul className="menu relative menu-horizontal gap-1">
              {navLinks.map(({ to, label }) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    className={({ isActive }) =>
                      `rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                        isActive ? "bg-blue-50 text-primary" : "text-slate-600 hover:bg-slate-100 hover:text-primary"
                      }`
                    }
                  >
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
