"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function getPageNumbers(current: number, total: number): (number | "ellipsis")[] {
  const pages: (number | "ellipsis")[] = [];

  // Always show first page
  pages.push(1);

  const rangeStart = Math.max(2, current - 2);
  const rangeEnd = Math.min(total - 1, current + 2);

  if (rangeStart > 2) pages.push("ellipsis");

  for (let i = rangeStart; i <= rangeEnd; i++) {
    pages.push(i);
  }

  if (rangeEnd < total - 1) pages.push("ellipsis");

  // Always show last page (if more than 1)
  if (total > 1) pages.push(total);

  return pages;
}

const btnBase =
  "inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors";
const btnNav =
  `${btnBase} gap-1 border border-gray-200 bg-white px-3.5 py-2.5 text-text-primary shadow-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white`;
const btnPage =
  `${btnBase} h-11 min-w-11 px-2.5 py-2 tabular-nums`;

export default function Pagination({
  page,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const isFirst = page <= 1;
  const isLast = page >= totalPages;
  const pages = getPageNumbers(page, totalPages);

  function handleChange(next: number) {
    onPageChange(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <nav
      aria-label="Search results pagination"
      className="mt-8 flex items-center justify-center gap-1.5"
    >
      <button
        type="button"
        disabled={isFirst}
        onClick={() => handleChange(page - 1)}
        className={`${btnNav} mr-2`}
        aria-label="Previous page"
      >
        <ChevronLeft size={16} aria-hidden="true" />
        <span className="hidden sm:inline">Previous</span>
      </button>

      {/* Mobile: show only current page + first/last */}
      <span className="flex items-center gap-1.5 sm:hidden">
        {page > 1 && (
          <>
            <button
              type="button"
              onClick={() => handleChange(1)}
              aria-label="Page 1"
              className={`${btnPage} text-text-primary hover:bg-gray-100`}
            >
              1
            </button>
            {page > 2 && (
              <span className="flex h-11 w-5 items-center justify-center text-sm text-text-secondary" aria-hidden="true">
                &hellip;
              </span>
            )}
          </>
        )}
        <button
          type="button"
          aria-label={`Page ${page}`}
          aria-current="page"
          className={`${btnPage} bg-instrument-blue text-white shadow-sm`}
        >
          {page}
        </button>
        {page < totalPages && (
          <>
            {page < totalPages - 1 && (
              <span className="flex h-11 w-5 items-center justify-center text-sm text-text-secondary" aria-hidden="true">
                &hellip;
              </span>
            )}
            <button
              type="button"
              onClick={() => handleChange(totalPages)}
              aria-label={`Page ${totalPages}`}
              className={`${btnPage} text-text-primary hover:bg-gray-100`}
            >
              {totalPages}
            </button>
          </>
        )}
      </span>

      {/* Desktop: full page numbers */}
      <span className="hidden items-center gap-1.5 sm:flex">
        {pages.map((p, i) =>
          p === "ellipsis" ? (
            <span
              key={`ellipsis-${i}`}
              className="flex h-11 w-11 items-center justify-center text-sm text-text-secondary"
              aria-hidden="true"
            >
              &hellip;
            </span>
          ) : (
            <button
              key={p}
              type="button"
              onClick={() => handleChange(p)}
              aria-label={`Page ${p}`}
              aria-current={p === page ? "page" : undefined}
              className={`${btnPage} ${
                p === page
                  ? "bg-instrument-blue text-white shadow-sm"
                  : "text-text-primary hover:bg-gray-100"
              }`}
            >
              {p}
            </button>
          ),
        )}
      </span>

      <button
        type="button"
        disabled={isLast}
        onClick={() => handleChange(page + 1)}
        className={`${btnNav} ml-2`}
        aria-label="Next page"
      >
        <span className="hidden sm:inline">Next</span>
        <ChevronRight size={16} aria-hidden="true" />
      </button>
    </nav>
  );
}
