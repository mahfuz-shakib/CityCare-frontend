import React from "react";
import { formatCategory } from "../constants/categories";

const IssueCategoryBadge = ({ category, className = "" }) => {
  return (
    <span
      className={`inline-flex items-center rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-bold capitalize text-primary ${className}`}
    >
      {category ? formatCategory(category) : "Uncategorized"}
    </span>
  );
};

export default IssueCategoryBadge;
