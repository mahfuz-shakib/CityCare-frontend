import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({ currentPage, totalPages, totalItems = 0, pageSize = 1, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1).filter(
    (page) => page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1),
  );
  const firstItem = (currentPage - 1) * pageSize + 1;
  const lastItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="flex flex-wrap justify-between items-center gap-3 mb-8 mt-6 px-3">
      <span className="text-sm text-gray-600">
        Showing {firstItem}-{lastItem} of {totalItems}
      </span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="btn btn-outline btn-sm rounded-2xl gap-1"
        >
          <ChevronLeft size={15} /> Previous
        </button>
        {pages.map((page, index) => (
          <span className="flex items-center gap-2" key={page}>
            {index > 0 && pages[index - 1] !== page - 1 && <span className="text-gray-500">...</span>}
            <button
              type="button"
              onClick={() => onPageChange(page)}
              className={`btn btn-sm rounded-2xl min-w-9 ${currentPage === page ? "btn-primary" : "btn-outline"}`}
            >
              {page}
            </button>
          </span>
        ))}
        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="btn btn-outline btn-sm rounded-2xl gap-1"
        >
          Next <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
