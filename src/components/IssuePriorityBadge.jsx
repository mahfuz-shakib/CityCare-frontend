import React from "react";

const IssuePriorityBadge = ({ priority }) => {
  return (
    <button
      className={`w-18 badge badge-lg px-2 py-1 text-sm  badge-outlin  ${priority === "high" ? "priority-high" : priority === "medium" ? "priority-medium" : priority === "normal" ? "priority-normal" : ""}`}
    >
      {priority}
    </button>
  );
};

export default IssuePriorityBadge;
