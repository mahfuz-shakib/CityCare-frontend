import { NavLink } from "react-router";
import { FaHome, FaPlusCircle, FaClipboardList, FaCreditCard, FaUser } from "react-icons/fa";

const CitizenMenu = () => {
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
          data-tip="ReportIssues"
          to="/dashboard/report-issue"
        >
          <FaPlusCircle className="my-1.5 inline-block size-4" />
          <span className="is-drawer-close:hidde">Report Issues</span>
        </NavLink>
      </li>
      <li>
        <NavLink
          className="is-drawer-close:tooltip is-drawer-close:tooltip-right flex"
          data-tip="MyIssues"
          to="/dashboard/my-issues"
        >
          <FaClipboardList className="my-1.5 inline-block size-4" />
          <span className="is-drawer-close:hidde">My Issues</span>
        </NavLink>
      </li>
      <li>
        <NavLink
          className="is-drawer-close:tooltip is-drawer-close:tooltip-right flex"
          data-tip="Payment History"
          to="/dashboard/payment-history"
        >
          <FaCreditCard className="my-1.5 inline-block size-4" />
          <span className="is-drawer-close:hidde">Payment History</span>
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

export default CitizenMenu;






