import React from "react";

const IssueCategoryBadge = ({ category }) => {
  return (
    <button className="badge badge-lg px-3 py-1 text-sm font-medium badge-outline bg-cyan-50 text-cyan-800">
      {category}
    </button>
  );
};

export default IssueCategoryBadge;
