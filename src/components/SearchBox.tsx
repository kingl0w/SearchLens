"use client";

import { useRef } from "react";
import { Search, X } from "lucide-react";

interface SearchBoxProps {
  query: string;
  onQueryChange: (q: string) => void;
  totalFound: number;
  isLoading: boolean;
  autoFocus?: boolean;
}

export default function SearchBox({
  query,
  onQueryChange,
  totalFound,
  isLoading,
  autoFocus = false,
}: SearchBoxProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="relative w-full">
      <div className="relative">
        <Search
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary"
          size={20}
          aria-hidden="true"
        />
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search NASA documents..."
          autoFocus={autoFocus}
          aria-label="Search NASA documents"
          className="w-full rounded-xl border border-gray-200 bg-white py-3.5 pl-12 pr-28 font-body text-base text-text-primary shadow-sm outline-none transition-shadow placeholder:text-text-secondary/60 focus:border-instrument-blue focus:ring-2 focus:ring-instrument-blue/20"
        />

        <div className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-2">
          {query && !isLoading && (
            <span className="text-sm text-text-secondary tabular-nums">
              {totalFound.toLocaleString()} result{totalFound !== 1 ? "s" : ""}
            </span>
          )}
          {query && isLoading && (
            <span className="text-sm text-text-secondary">Searching...</span>
          )}

          {query && (
            <button
              type="button"
              onClick={() => onQueryChange("")}
              className="rounded-md p-2 -mr-1 text-text-secondary transition-colors hover:bg-gray-100 hover:text-text-primary"
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}

          {!query && (
            <kbd className="hidden rounded border border-gray-200 bg-gray-50 px-1.5 py-0.5 font-mono text-xs text-text-secondary sm:inline-block">
              ⌘K
            </kbd>
          )}
        </div>
      </div>
    </div>
  );
}
