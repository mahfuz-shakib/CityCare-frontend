import { Search, SlidersHorizontal } from "lucide-react";

const SearchFilterPanel = ({
  search,
  onSearchChange,
  searchPlaceholder = "Search...",
  filters = [],
  onFilterChange,
  className = "",
}) => (
  <div
    className={`flex flex-col gap-3 rounded-lg bg-surface-container-low px-3 py-3 md:flex-row md:flex-wrap md:items-center ${className}`}
  >
    <label className="input w-full rounded-full border-slate-200 bg-white md:w-72">
      <Search className="h-[1em] text-slate-400" />
      <input
        type="search"
        value={search || ""}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder={searchPlaceholder}
      />
    </label>
    {filters.map(({ key, label, options }) => (
      <label className="relative w-full md:w-auto" key={key}>
        <SlidersHorizontal
          className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-slate-400"
          size={14}
        />
        <select
          value={filters.find((filter) => filter.key === key)?.value || ""}
          onChange={(event) => onFilterChange(key, event.target.value)}
          className="select select-bordered w-full rounded-2xl border-slate-200 bg-white pl-9 md:w-48"
        >
          <option value="">{label}</option>
          {options.map(({ value, text }) => (
            <option value={value} key={value}>
              {text}
            </option>
          ))}
        </select>
      </label>
    ))}
  </div>
);

export default SearchFilterPanel;
