import { NavLink } from "react-router";
import { FaHome, FaClipboardList, FaUsers, FaUserTie, FaCreditCard, FaUser } from "react-icons/fa";

const AdminMenu = () => {
  return (
    <>
      <li>
        <NavLink
          to="/dashboard/overview"
          className="is-drawer-close:tooltip is-drawer-close:tooltip-right flex mt-4"
          // data-tip="Overview"
          title="Overview"
        >
          <FaHome className="my-1.5 inline-block size-4" />
          <span className="is-drawer-close:hidden">Overview</span>
        </NavLink>
      </li>
      <li>
        <NavLink
          className="is-drawer-close:tooltip is-drawer-close:tooltip-right flex"
          // data-tip="All Issues"
          to="/dashboard/all-issues"
          title="All Issues"
        >
          <FaClipboardList className="my-1.5 inline-block size-4" />
          <span className="is-drawer-close:hidden">All Issues</span>
        </NavLink>
      </li>
      <li>
        <NavLink
          className="is-drawer-close:tooltip is-drawer-close:tooltip-right flex"
          // data-tip="Manage users"
          to="/dashboard/manage-users"
          title="Manage Users"
        >
          <FaUsers className="my-1.5 inline-block size-4" />
          <span className="is-drawer-close:hidden">Manage Users</span>
        </NavLink>
      </li>
      <li>
        <NavLink
          className="is-drawer-close:tooltip is-drawer-close:tooltip-right flex"
          // data-tip="Manage Staffs"
          to="manage-staffs"
          title="Manage Staffs"
        >
          <FaUserTie className="my-1.5 inline-block size-4" />
          <span className="is-drawer-close:hidden">Manage Staffs</span>
        </NavLink>
      </li>
      <li>
        <NavLink
          className="is-drawer-close:tooltip is-drawer-close:tooltip-right flex"
          // data-tip="Payments"
          to="/dashboard/payments"
          title="Payments"
        >
          <FaCreditCard className="my-1.5 inline-block size-4" />
          <span className="is-drawer-close:hidden">Payments</span>
        </NavLink>
      </li>
      <li>
        <NavLink
          className="is-drawer-close:tooltip is-drawer-close:tooltip-right flex"
          // data-tip="My Profile"
          to="/dashboard/myProfile"
          title="My Profile"
        >
          <FaUser className="my-1.5 inline-block size-4" />
          <span className="is-drawer-close:hidden">My Profile</span>
        </NavLink>
      </li>
    </>
  );
};

export default AdminMenu;
