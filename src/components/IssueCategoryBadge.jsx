import React from "react";

const IssueCategoryBadge = ({ category }) => {
  return (
    <span className="inline-flex items-center text-[11px] font-bold px-2.5 py-1 rounded-full capitalize bg-sky-100 text-sky-700">
      {category}
    </span>
  );
};

export default IssueCategoryBadge;
