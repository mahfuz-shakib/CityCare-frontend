import React from "react";
import { FaCheckCircle, FaClock, FaCog, FaExclamationTriangle } from "react-icons/fa";

const statusBadge = ({ status }) => {
  return (
    <button
      className={`badge badge-lg px-2 py-1 text-sm font-medium badge-outline  ${status === "pending" ? "status-pending" : status === "in-progress" ? "status-progress" : status === "working" ? "status-working" : status === "resolved" ? "status-resolved" : status == "closed" ? "status-closed" : "status-rejected"}`}
    >
      {status === "resolved" ? (
        <FaCheckCircle className="inline" />
      ) : status === "pending" ? (
        <FaClock className="inline" />
      ) : status === "in-progress" ? (
        <FaCog className="inline" />
      ) : (
        <FaExclamationTriangle className="inline" />
      )}
      {status}
    </button>
  );
};

export default statusBadge;
