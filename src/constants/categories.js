export const ISSUE_CATEGORIES = [
  "infrastructure",
  "public safety",
  "environment",
  "sanitation",
  "transport",
  "construction",
];

export const LEGACY_CATEGORY_MAP = {
  road: "transport",
  water: "infrastructure",
  electricity: "infrastructure",
  garbage: "sanitation",
  waste: "sanitation",
  safety: "public safety",
};

export const normalizeCategory = (category = "") => {
  const value = String(category).toLowerCase();
  return LEGACY_CATEGORY_MAP[value] || value;
};

export const formatCategory = (category = "") =>
  normalizeCategory(category).replace(/\b\w/g, (letter) => letter.toUpperCase());
