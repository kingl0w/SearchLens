import type { Metadata } from "next";
import { Suspense } from "react";
import SearchPageContent from "./SearchPageContent";

export const metadata: Metadata = {
  title: "Search — SearchLens",
  description:
    "Search across our full document library with instant results and faceted filtering.",
};

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-6 h-[54px] animate-pulse rounded-xl bg-gray-200" />
          <div className="flex gap-8">
            <div className="hidden w-[280px] shrink-0 lg:block">
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-4 w-20 rounded bg-gray-200" />
                    <div className="h-8 w-full rounded bg-gray-100" />
                    <div className="h-8 w-full rounded bg-gray-100" />
                    <div className="h-8 w-full rounded bg-gray-100" />
                  </div>
                ))}
              </div>
            </div>
            <div className="min-w-0 flex-1 space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="h-[160px] animate-pulse rounded-lg bg-gray-100"
                />
              ))}
            </div>
          </div>
        </div>
      }
    >
      <SearchPageContent />
    </Suspense>
  );
}
