import React, { use } from "react";
import { Link, NavLink, useNavigate } from "react-router";
import { useState } from "react";
import { FaUser } from "react-icons/fa6";
import { toast } from "react-toastify";
import { AuthContext } from "../providers/AuthContext";
import Container from "../container/Container";
// import logo from "../../public/assets/paw_logo.png";
const Navbar = () => {
  const [openDropdown, setOpenDropdown] = useState(false);
  const { user, loading, logOut } = use(AuthContext);
  console.log(user);
  const navigate = useNavigate();
  const links = (
    <>
      <li>
        <NavLink to="/">Home</NavLink>
      </li>
      <li>
        <NavLink to="/allIssues">All Issues</NavLink>
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
    <div className={`shadow-sm sticky top-0 z-1000 bg-gray-100`}>
      {/* sticky top-0 z-1000 */}
      <Container>
        <div className="navbar  flex justify-between items-center">
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
            <button className="w-32 sm:w-full relative -ml-2 flex items-center gap-1 hover:scale-102 ">
              {/* <img src={logo} alt="pawmart" className="h-12 hidden sm:block" /> */}
              <Link to="/" className={` text-[22px] md:text-[26px] absolute ml-9 font-semibold`}>
                CityCare
              </Link>
            </button>
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
            {openDropdown && (
              <div className="absolute w-48 right-0 bg-grad flex flex-col text-center p-3 space-y-2 rounded mt-36 z-50">
                <Link
                  to="/myprofile"
                  onClick={() => setOpenDropdown(false)}
                  className="rounded py-1 hover:bg-fuchsia-400"
                >
                  {user.displayName}
                </Link>
                <button onClick={handdleLogOut} className="rounded py-1 hover:bg-fuchsia-400">
                  Log Out
                </button>
              </div>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Navbar;
