import React from "react";
import { FaCheckCircle, FaClock, FaCog, FaExclamationTriangle, FaTimesCircle } from "react-icons/fa";

const statusMap = {
  pending: {
    icon: FaClock,
    className: "bg-amber-100 text-amber-700",
  },
  "in-progress": {
    icon: FaCog,
    className: "bg-blue-100 text-blue-700",
  },
  working: {
    icon: FaCog,
    className: "bg-indigo-100 text-indigo-700",
  },
  resolved: {
    icon: FaCheckCircle,
    className: "bg-emerald-100 text-emerald-700",
  },
  closed: {
    icon: FaCheckCircle,
    className: "bg-slate-100 text-slate-600",
  },
  rejected: {
    icon: FaTimesCircle,
    className: "bg-red-100 text-red-600",
  },
};

const IssueStatusBadge = ({ status }) => {
  const config = statusMap[status] || { icon: FaExclamationTriangle, className: "bg-slate-100 text-slate-600" };
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full capitalize ${config.className}`}
    >
      <Icon className="shrink-0" style={{ fontSize: "10px" }} />
      {status}
    </span>
  );
};

export default IssueStatusBadge;
