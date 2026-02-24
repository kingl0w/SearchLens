import Link from "next/link";
import { Telescope, Search, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <Telescope className="mb-6 h-16 w-16 text-gray-300" aria-hidden="true" />
      <h1 className="font-heading text-3xl font-bold text-text-primary sm:text-4xl">
        Page not found
      </h1>
      <p className="mt-3 max-w-md text-text-secondary">
        The document you&apos;re looking for may have been moved or doesn&apos;t
        exist. Try searching our archives instead.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/search"
          className="inline-flex items-center gap-2 rounded-lg bg-instrument-blue px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-instrument-blue/90"
        >
          <Search className="h-4 w-4" aria-hidden="true" />
          Search documents
        </Link>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-text-primary transition-colors hover:bg-gray-50"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to home
        </Link>
      </div>
    </div>
  );
}
