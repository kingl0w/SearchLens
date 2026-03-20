import Link from "next/link";
import { Search, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <p className="mb-3 font-mono text-sm text-text-secondary">404</p>
      <h1 className="font-heading text-2xl font-bold text-text-primary sm:text-3xl">
        Document not found
      </h1>
      <p className="mt-3 max-w-sm text-sm text-text-secondary leading-relaxed">
        This document may have been moved or renamed.
        Try searching by keyword instead.
      </p>

      <form
        action="/search"
        role="search"
        aria-label="Search documents"
        className="mt-6 w-full max-w-md"
      >
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary"
            aria-hidden="true"
          />
          <input
            type="search"
            name="q"
            placeholder="Search NASA documents..."
            aria-label="Search NASA documents"
            autoFocus
            className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-12 pr-4 text-base text-text-primary shadow-sm outline-none transition-shadow placeholder:text-text-secondary/60 focus:border-instrument-blue focus:ring-2 focus:ring-instrument-blue/20"
          />
        </div>
      </form>

      <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-sm">
        <span className="text-text-secondary">Try:</span>
        {["moon landing", "Mars rover", "Hubble repair"].map((q) => (
          <Link
            key={q}
            href={`/search?q=${encodeURIComponent(q)}`}
            className="rounded-full border border-gray-200 px-3 py-1 text-xs text-text-secondary transition-colors hover:border-gray-300 hover:text-text-primary"
          >
            {q}
          </Link>
        ))}
      </div>

      <Link
        href="/"
        className="mt-8 inline-flex items-center gap-1.5 text-sm text-text-secondary transition-colors hover:text-instrument-blue"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to home
      </Link>
    </div>
  );
}
