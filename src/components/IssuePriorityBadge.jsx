import React from "react";

const priorityMap = {
  high: "bg-red-100 text-red-600",
  medium: "bg-violet-100 text-violet-700",
  normal: "bg-slate-100 text-slate-600",
};

const IssuePriorityBadge = ({ priority }) => {
  const className = priorityMap[priority] || "bg-slate-100 text-slate-600";

  return (
    <span className={`inline-flex items-center text-[11px] font-bold px-2.5 py-1 rounded-full capitalize ${className}`}>
      {priority}
    </span>
  );
};

export default IssuePriorityBadge;
