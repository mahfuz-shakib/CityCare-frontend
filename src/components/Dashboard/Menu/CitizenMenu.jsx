import { NavLink } from "react-router";
import { FaHome, FaPlusCircle, FaClipboardList, FaCreditCard, FaUser } from "react-icons/fa";

const CitizenMenu = () => {
  return (
    <>
      <li>
        <NavLink
          to="/dashboard/overview"
          className="is-drawer-close:tooltip is-drawer-close:tooltip-right flex mt-4"
          title="Overview"
        >
          <FaHome className="my-1.5 inline-block size-4" />
          <span className="is-drawer-close:hidden">Overview</span>
        </NavLink>
      </li>
      <li>
        <NavLink
          className="is-drawer-close:tooltip is-drawer-close:tooltip-right flex"
          // data-tip="ReportIssues"
          to="/dashboard/report-issue"
          title="Report Issue"
        >
          <FaPlusCircle className="my-1.5 inline-block size-4" />
          <span className="is-drawer-close:hidden">Report Issues</span>
        </NavLink>
      </li>
      <li>
        <NavLink
          className="is-drawer-close:tooltip is-drawer-close:tooltip-right flex"
          to="/dashboard/my-issues"
          title="My Issues"
        >
          <FaClipboardList className="my-1.5 inline-block size-4" />
          <span className="is-drawer-close:hidden">My Issues</span>
        </NavLink>
      </li>
      <li>
        <NavLink
          className="is-drawer-close:tooltip is-drawer-close:tooltip-right flex"
          to="/dashboard/payment-history"
          title="Payment History"
        >
          <FaCreditCard className="my-1.5 inline-block size-4" />
          <span className="is-drawer-close:hidden">Payment History</span>
        </NavLink>
      </li>
      <li>
        <NavLink
          className="is-drawer-close:tooltip is-drawer-close:tooltip-right flex"
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

export default CitizenMenu;
