import { NavLink } from "react-router";
import { FaHome, FaClipboardList, FaUser } from "react-icons/fa";

const StaffMenu = () => {
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
          // data-tip="AssignedIssues"
          to="/dashboard/assigned-issues"
          title="Assigned Issues"
        >
          <FaClipboardList className="my-1.5 inline-block size-4" />
          <span className="is-drawer-close:hidden">Assigned Issues</span>
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

export default StaffMenu;
