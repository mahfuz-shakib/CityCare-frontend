import SearchFilterPanel from "./SearchFilterPanel";
import { ISSUE_CATEGORIES, formatCategory } from "../constants/categories";

const filterOptions = {
  category: ISSUE_CATEGORIES,
  status: ["pending", "in-progress", "resolved", "rejected"],
  priority: ["high", "normal"],
};

const formatLabel = (value) => value.replace("-", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());

const IssueFilterBar = ({ filters, onFilterChange, className = "" }) => (
  <SearchFilterPanel
    search={filters.search}
    onSearchChange={(value) => onFilterChange("search", value)}
    searchPlaceholder="Search by title, category or location"
    onFilterChange={onFilterChange}
    filters={Object.entries(filterOptions).map(([key, options]) => ({
      key,
      value: filters[key],
      label: `Select ${formatLabel(key)}`,
      options: options.map((option) => ({ value: option, text: formatLabel(option) })),
    }))}
    className={`${className}`}
  />
);

export default IssueFilterBar;
