import React from "react";

const priorityMap = {
  high: "bg-red-100 text-red-600",
  medium: "bg-violet-100 text-violet-700",
  normal: "bg-slate-100 text-slate-600",
};

const IssuePriorityBadge = ({ priority, className = "" }) => {
  const badgeClassName = priorityMap[priority] || "bg-slate-100 text-slate-600";

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold capitalize ${badgeClassName} ${className}`}
    >
      {priority || "Normal"}
    </span>
  );
};

export default IssuePriorityBadge;
