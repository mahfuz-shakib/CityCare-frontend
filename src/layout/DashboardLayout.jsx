import React, { memo, useRef } from "react";
import { Link, Outlet, useNavigation } from "react-router";
import { motion } from "framer-motion";
import useRole from "../hooks/useRole";
import AdminMenu from "../components/Dashboard/Menu/AdminMenu";
import StaffMenu from "../components/Dashboard/Menu/StaffMenu";
import CitizenMenu from "../components/Dashboard/Menu/CitizenMenu";
import Loader from "../components/Loader";
import Container from "../container/Container";
import { AuthContext } from "../providers/AuthContext";
import { FaUser } from "react-icons/fa";
import NavProfileDropdown from "../components/NavProfileDropdown";
import useAuth from "../hooks/useAuth";
import ListingSkeleton from "../components/ListingSkeleton";

const DashboardLayout = () => {
  const { role, roleLoading } = useRole();
  const { loading: authLoading } = useAuth();
  const dropdownRef = useRef(null);
  const renderMenu = () => {
    if (role === "admin") {
      return <AdminMenu />;
    } else if (role === "staff") {
      return <StaffMenu />;
    } else {
      return <CitizenMenu />;
    }
  };
  return (
    <div className="min-h-screen">
      <div className="drawer lg:drawer-open">
        <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content">
          {/* Navbar */}
          <motion.nav
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="navbar w-full flex justify-between items-center bg-gradient-to-r from-blue-50 to-indigo-50 shadow-sm"
          >
            <div className="flex justify-between items-center">
              <label htmlFor="my-drawer-4" aria-label="open sidebar" className="btn btn-square btn-ghost">
                {/* Sidebar toggle icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  strokeWidth="2"
                  fill="none"
                  stroke="currentColor"
                  className="my-1.5 inline-block size-4"
                >
                  <path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z"></path>
                  <path d="M9 4v16"></path>
                  <path d="M14 10l2 2l-2 2"></path>
                </svg>
              </label>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="px-4 font-semibold text-gray-700"
              >
                CityCare Dashboard
              </motion.div>
            </div>
            <div className="mr-12 relative" ref={dropdownRef}>
              <NavProfileDropdown dropdownRef={dropdownRef} />
            </div>
          </motion.nav>
          {/* Page content here */}
          <motion.div
            className="min-h-[calc(100vh-374px)] px-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            {authLoading || roleLoading ? <ListingSkeleton /> : <Outlet />}
          </motion.div>
        </div>

        <div className="drawer-side is-drawer-close:overflow-visible">
          <label htmlFor="my-drawer-4" aria-label="close sidebar" className="drawer-overlay"></label>
          <motion.div
            initial={{ x: -100 }}
            animate={{ x: 0 }}
            transition={{ duration: 0.3 }}
            className="flex min-h-full flex-col items-start bg-gradient-to-b from-blue-50 to-indigo-100 is-drawer-close:w-48 is-drawer-open:w-64 shadow-lg"
          >
            {/* Sidebar content here */}
            <ul className="menu w-full grow p-4">
              {/* List item */}
              <motion.li initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <Link to="/" className="bg-surface-container-low">
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent mb-2 hover:text-indigo-700 hover:scale-102">
                    CityCare
                  </h3>
                </Link>
              </motion.li>
              {renderMenu()}
            </ul>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default memo(DashboardLayout);
