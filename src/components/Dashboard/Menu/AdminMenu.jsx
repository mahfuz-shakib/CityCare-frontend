import { NavLink } from "react-router";
import { FaHome, FaClipboardList, FaUsers, FaUserTie, FaCreditCard, FaUser } from "react-icons/fa";

const AdminMenu = () => {
  return (
    <>
      <li>
        <NavLink
          to="/dashboard/homepage"
          className="is-drawer-close:tooltip is-drawer-close:tooltip-right flex"
          data-tip="Homepage"
        >
          <FaHome className="my-1.5 inline-block size-4" />
          <span className="is-drawer-close:hidde">Home page</span>
        </NavLink>
      </li>
      <li>
        <NavLink
          className="is-drawer-close:tooltip is-drawer-close:tooltip-right flex"
          data-tip="All Issues"
          to="/dashboard/all-issues"
        >
          <FaClipboardList className="my-1.5 inline-block size-4" />
          <span className="is-drawer-close:hidde">All Issues</span>
        </NavLink>
      </li>
      <li>
        <NavLink
          className="is-drawer-close:tooltip is-drawer-close:tooltip-right flex"
          data-tip="Manage users"
          to="/dashboard/manage-users"
        >
          <FaUsers className="my-1.5 inline-block size-4" />
          <span className="is-drawer-close:hidde">Manage Users</span>
        </NavLink>
      </li>
      <li>
        <NavLink
          className="is-drawer-close:tooltip is-drawer-close:tooltip-right flex"
          data-tip="Manage Staffs"
          to="/dashboard/manage-staffs"
        >
          <FaUserTie className="my-1.5 inline-block size-4" />
          <span className="is-drawer-close:hidde">Manage Staffs</span>
        </NavLink>
      </li>
      <li>
        <NavLink
          className="is-drawer-close:tooltip is-drawer-close:tooltip-right flex"
          data-tip="Payments"
          to="/dashboard/payments"
        >
          <FaCreditCard className="my-1.5 inline-block size-4" />
          <span className="is-drawer-close:hidde">Payments</span>
        </NavLink>
      </li>
      <li>
        <NavLink
          className="is-drawer-close:tooltip is-drawer-close:tooltip-right flex"
          data-tip="My Profile"
          to="/dashboard/myProfile"
        >
          <FaUser className="my-1.5 inline-block size-4" />
          <span className="is-drawer-close:hidde">My Profile</span>
        </NavLink>
      </li>
    </>
  );
};

export default AdminMenu;






