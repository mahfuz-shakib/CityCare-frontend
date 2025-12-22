import { NavLink } from "react-router";
import { FaHome, FaClipboardList, FaUser } from "react-icons/fa";

const StaffMenu = () => {
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
          data-tip="AssignedIssues"
          to="/dashboard/assigned-issues"
        >
          <FaClipboardList className="my-1.5 inline-block size-4" />
          <span className="is-drawer-close:hidde">Assigned Issues</span>
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

export default StaffMenu;






