const Pagination = ({ totalPages, pageCurrent, setPageCurrent }: { totalPages: number; pageCurrent: number; setPageCurrent: (page: number) => void }) => {
  const generatePageNumbers = () => {
    const pages = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (pageCurrent <= 4) {
        pages.push(1, 2, 3, 4, 5, "...", totalPages);
      } else if (pageCurrent >= totalPages - 3) {
        pages.push(1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", pageCurrent - 1, pageCurrent, pageCurrent + 1, "...", totalPages);
      }
    }

    return pages;
  };

  const handleClick = (page: number | string) => {
    if (typeof page === "number" && page !== pageCurrent) {
      setPageCurrent(page);
    }
  };

  const handlePrev = () => {
    if (pageCurrent > 1) setPageCurrent(pageCurrent - 1);
  };

  const handleNext = () => {
    if (pageCurrent < totalPages) setPageCurrent(pageCurrent + 1);
  };

  return (
    <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 dark:bg-white/[0.03]">
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
            <button
              onClick={handlePrev}
              className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              disabled={pageCurrent === 1}
            >
              <span className="sr-only">Previous</span>
              <svg className="size-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path
                  fillRule="evenodd"
                  d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            {generatePageNumbers().map((item, index) =>
              item === "..." ? (
                <span key={index} className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300">
                  ...
                </span>
              ) : (
                <button
                  key={index}
                  onClick={() => handleClick(item)}
                  className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ring-1 ring-inset ring-gray-300 ${
                    item === pageCurrent ? "z-10 bg-indigo-600 text-white" : "text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  {item}
                </button>
              )
            )}

            <button
              onClick={handleNext}
              className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              disabled={pageCurrent === totalPages}
            >
              <span className="sr-only">Next</span>
              <svg className="size-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path
                  fillRule="evenodd"
                  d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
