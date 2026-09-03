import React from "react";
import useAuth from "../hooks/useAuth";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { FaUser } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const NavProfileDropdown = ({ dropdownRef }) => {
  const { user, logOut } = useAuth();
  const [openDropdown, setOpenDropdown] = useState(false);
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
  return (
    <div>
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
      <AnimatePresence>
        {openDropdown && user && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="absolute right-0 w-48 bg-white border border-blue-300 rounded-lg shadow-lg overflow-hidden z-[2100]"
          >
            <Link
              to="/dashboard/myProfile"
              onClick={() => setOpenDropdown(false)}
              className="block px-4 py-2 hover:bg-blue-100"
            >
              {user.displayName}
            </Link>
            <Link
              to="/dashboard/overview"
              onClick={() => setOpenDropdown(false)}
              className="block px-4 py-2 hover:bg-blue-100"
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
  );
};

export default NavProfileDropdown;
