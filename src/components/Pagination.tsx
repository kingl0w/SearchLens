"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  page,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const isFirst = page <= 1;
  const isLast = page >= totalPages;

  function handleChange(next: number) {
    onPageChange(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <nav aria-label="Search results pagination" className="mt-8 flex items-center justify-center gap-4">
      <button
        type="button"
        disabled={isFirst}
        onClick={() => handleChange(page - 1)}
        className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-sm font-medium text-text-primary shadow-sm transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white"
        aria-label="Previous page"
      >
        <ChevronLeft size={16} aria-hidden="true" />
        Previous
      </button>

      <span className="text-sm tabular-nums text-text-secondary">
        Page {page} of {totalPages}
      </span>

      <button
        type="button"
        disabled={isLast}
        onClick={() => handleChange(page + 1)}
        className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-sm font-medium text-text-primary shadow-sm transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white"
        aria-label="Next page"
      >
        Next
        <ChevronRight size={16} aria-hidden="true" />
      </button>
    </nav>
  );
}
