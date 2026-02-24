"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { SlidersHorizontal, X } from "lucide-react";
import { useSearch } from "@/hooks/useSearch";
import type { ActiveFacets } from "@/hooks/useSearch";
import SearchBox from "@/components/SearchBox";
import SearchResults from "@/components/SearchResults";
import FacetFilters from "@/components/FacetFilters";
import { ActivePills } from "@/components/FacetFilters";
import Pagination from "@/components/Pagination";

const PER_PAGE = 12;
const URL_FACET_FIELDS = ["program", "category", "center", "tags", "year"];

function facetsFromParams(params: URLSearchParams): ActiveFacets {
  const facets: ActiveFacets = {};
  for (const field of URL_FACET_FIELDS) {
    const raw = params.get(field);
    if (raw) {
      facets[field] = raw.split(",").filter(Boolean);
    }
  }
  return facets;
}

function paramsFromState(
  query: string,
  page: number,
  activeFacets: ActiveFacets,
): URLSearchParams {
  const params = new URLSearchParams();
  if (query) params.set("q", query);
  if (page > 1) params.set("page", String(page));
  for (const field of URL_FACET_FIELDS) {
    const values = activeFacets[field];
    if (values && values.length > 0) {
      params.set(field, values.join(","));
    }
  }
  return params;
}

export default function SearchPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const initialQuery = searchParams.get("q") ?? "";
  const initialPage = Number(searchParams.get("page") ?? "1") || 1;
  const initialFacets = facetsFromParams(searchParams);

  const search = useSearch({
    initialQuery,
    initialPage,
    initialFacets,
  });

  const [drawerOpen, setDrawerOpen] = useState(false);
  const drawerCloseRef = useRef<HTMLButtonElement>(null);
  const isFirstRender = useRef(true);

  const syncUrl = useCallback(
    (q: string, pg: number, af: ActiveFacets) => {
      const params = paramsFromState(q, pg, af);
      const qs = params.toString();
      const url = qs ? `${pathname}?${qs}` : pathname;
      router.replace(url, { scroll: false });
    },
    [pathname, router],
  );

  //sync URL whenever search state changes (skip initial render)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    syncUrl(search.query, search.page, search.activeFacets);
  }, [search.query, search.page, search.activeFacets, syncUrl]);

  useEffect(() => {
    if (!drawerOpen) return;
    drawerCloseRef.current?.focus();
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setDrawerOpen(false);
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [drawerOpen]);

  //lock body scroll when drawer is open
  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  const hasResults = search.results.length > 0;
  const hasQuery = search.query.length > 0;
  const hasFilters = Object.values(search.activeFacets).some(
    (v) => v.length > 0,
  );
  const startResult = (search.page - 1) * PER_PAGE + 1;
  const endResult = Math.min(search.page * PER_PAGE, search.totalFound);

  return (
    <div className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
      <div className="sticky top-16 z-30 -mx-4 bg-background/95 px-4 pb-4 pt-6 backdrop-blur-sm sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <SearchBox
          query={search.query}
          onQueryChange={search.setQuery}
          totalFound={search.totalFound}
          isLoading={search.isLoading}
          autoFocus
        />
      </div>

      <div className="mb-4 flex items-start gap-3">
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-text-primary shadow-sm transition-colors hover:bg-gray-50 lg:hidden"
          aria-label="Open filters"
        >
          <SlidersHorizontal size={16} aria-hidden="true" />
          Filters
          {hasFilters && (
            <span className="ml-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-instrument-blue text-xs font-semibold text-white">
              {Object.values(search.activeFacets).flat().length}
            </span>
          )}
        </button>

        <div className="min-w-0 flex-1 overflow-x-auto">
          <ActivePills
            activeFacets={search.activeFacets}
            onToggle={search.toggleFacet}
            onClearAll={search.clearFacets}
          />
        </div>
      </div>

      <div className="flex gap-8">
        <aside className="hidden w-[280px] shrink-0 lg:block">
          <div className="sticky top-[100px]">
            <FacetFilters
              facets={search.facets}
              activeFacets={search.activeFacets}
              onToggle={search.toggleFacet}
              onClearAll={search.clearFacets}
            />
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          {(hasQuery || hasFilters) && hasResults && !search.isLoading && (
            <p className="mb-4 text-sm text-text-secondary">
              Showing{" "}
              <span className="font-medium tabular-nums text-text-primary">
                {startResult}&ndash;{endResult}
              </span>{" "}
              of{" "}
              <span className="font-medium tabular-nums text-text-primary">
                {search.totalFound.toLocaleString()}
              </span>{" "}
              results
              {hasQuery && (
                <>
                  {" "}
                  for{" "}
                  <span className="font-medium text-text-primary">
                    &lsquo;{search.query}&rsquo;
                  </span>
                </>
              )}
            </p>
          )}

          {search.error && (
            <div role="alert" className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {search.error}
            </div>
          )}

          <SearchResults
            hits={search.results}
            isLoading={search.isLoading}
            query={search.query}
            totalFound={search.totalFound}
            hasActiveFilters={hasFilters}
          />

          <Pagination
            page={search.page}
            totalPages={search.totalPages}
            onPageChange={search.setPage}
          />
        </div>
      </div>

      {drawerOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/40 lg:hidden"
            onClick={() => setDrawerOpen(false)}
            aria-hidden="true"
          />

          <div
            role="dialog"
            aria-modal="true"
            aria-label="Filter results"
            className="fixed inset-y-0 left-0 z-50 flex w-[300px] max-w-[85vw] flex-col bg-white shadow-xl lg:hidden"
          >
            <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
              <h2 className="font-heading text-sm font-semibold text-text-primary">
                Filters
              </h2>
              <button
                ref={drawerCloseRef}
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="rounded-md p-1 text-text-secondary transition-colors hover:bg-gray-100 hover:text-text-primary"
                aria-label="Close filters"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4">
              <FacetFilters
                facets={search.facets}
                activeFacets={search.activeFacets}
                onToggle={(field, value) => {
                  search.toggleFacet(field, value);
                }}
                onClearAll={() => {
                  search.clearFacets();
                  setDrawerOpen(false);
                }}
              />
            </div>

            <div className="border-t border-gray-100 px-4 py-3">
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="w-full rounded-lg bg-instrument-blue px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-instrument-blue/90"
              >
                Show results
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
