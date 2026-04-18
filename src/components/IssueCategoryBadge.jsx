import React from "react";

const IssueCategoryBadge = ({ category }) => {
  return (
    <button className="w-18 badge badge-lg px-3 py-1 text-sm font-medium bg-sky-100 text-sky-800">
      {category}
    </button>
  );
};

export default IssueCategoryBadge;
