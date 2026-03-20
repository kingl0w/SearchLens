"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Clock, Search, X } from "lucide-react";
import { searchApi } from "@/lib/search-api";
import { getProgramColors } from "@/components/SearchResults";
import { useRecentSearches } from "@/hooks/useRecentSearches";

interface QuickHit {
  slug: string;
  title: string;
  program: string;
  year: number;
}

const DEBOUNCE_MS = 150;

const SUGGESTIONS = [
  { label: "moon landing", query: "moon landing" },
  { label: "Mars rover", query: "Mars rover" },
  { label: "Hubble repair", query: "Hubble repair" },
  { label: "space station assembly", query: "space station assembly" },
];

export default function CommandSearch() {
  const router = useRouter();
  const pathname = usePathname();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [hits, setHits] = useState<QuickHit[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const recent = useRecentSearches();

  // Open/close
  const openModal = useCallback(() => {
    setOpen(true);
    setQuery("");
    setHits([]);
    setActiveIndex(-1);
  }, []);

  const closeModal = useCallback(() => {
    setOpen(false);
    setQuery("");
    setHits([]);
    setActiveIndex(-1);
  }, []);

  // Search
  const search = useCallback(async (q: string) => {
    if (!q.trim()) {
      setHits([]);
      setActiveIndex(-1);
      return;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setIsLoading(true);

    try {
      const res = await searchApi(
        {
          q,
          query_by: "title,body,excerpt",
          per_page: 6,
          include_fields: "slug,title,program,year",
        },
        { signal: controller.signal },
      );

      if (controller.signal.aborted) return;

      const results: QuickHit[] = (res.hits ?? []).map((h) => ({
        slug: String(h.document.slug),
        title: String(h.document.title),
        program: String(h.document.program),
        year: Number(h.document.year),
      }));

      setHits(results);
      setActiveIndex(results.length > 0 ? 0 : -1);
    } catch (err: unknown) {
      if (controller.signal.aborted) return;
      if (err instanceof DOMException && err.name === "AbortError") return;
      if (err instanceof Error) {
        const msg = err.message.toLowerCase();
        if (msg.includes("abort") || msg.includes("cancel")) return;
      }
    } finally {
      if (!controller.signal.aborted) setIsLoading(false);
    }
  }, []);

  function handleInputChange(value: string) {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(value), DEBOUNCE_MS);
  }

  function navigateTo(url: string) {
    closeModal();
    router.push(url);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (activeIndex >= 0 && hits[activeIndex]) {
      recent.add(query);
      navigateTo(`/docs/${hits[activeIndex].slug}`);
      return;
    }
    if (!query.trim()) return;
    recent.add(query);
    navigateTo(`/search?q=${encodeURIComponent(query)}`);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (hits.length > 0) {
        setActiveIndex((prev) => (prev < hits.length - 1 ? prev + 1 : 0));
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (hits.length > 0) {
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : hits.length - 1));
      }
    } else if (e.key === "Escape") {
      closeModal();
    }
  }

  // Global Cmd+K listener
  useEffect(() => {
    function handleGlobalKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => {
          if (prev) return false;
          return true;
        });
      }
    }
    document.addEventListener("keydown", handleGlobalKey);
    return () => document.removeEventListener("keydown", handleGlobalKey);
  }, []);

  // Focus input when modal opens
  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  // Close on route change
  useEffect(() => {
    closeModal();
  }, [pathname, closeModal]);

  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      abortRef.current?.abort();
    };
  }, []);

  // Scroll active item into view
  useEffect(() => {
    if (activeIndex < 0 || !listRef.current) return;
    const item = listRef.current.children[activeIndex] as HTMLElement | undefined;
    item?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  const hasResults = hits.length > 0;
  const showSuggestions = !query.trim() && !hasResults;

  return (
    <>
      {/* Trigger button for header */}
      <button
        type="button"
        onClick={openModal}
        className="hidden sm:flex flex-1 max-w-lg mx-4 items-center gap-2 rounded-lg border border-gray-200 bg-gray-100 px-3 py-2 text-sm text-text-secondary transition-colors hover:border-gray-300 hover:bg-gray-50"
        aria-label="Search NASA documents"
      >
        <Search className="w-4 h-4 shrink-0" aria-hidden="true" />
        <span className="flex-1 text-left">Search NASA documents...</span>
        <kbd className="hidden rounded border border-gray-200 bg-white px-1.5 py-0.5 font-mono text-[10px] text-text-secondary sm:inline-block">
          ⌘K
        </kbd>
      </button>

      {/* Modal */}
      <div
        className={`fixed inset-0 z-[60] flex items-start justify-center pt-[15vh] sm:pt-[20vh] transition-opacity duration-150 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        role="dialog"
        aria-modal={open}
        aria-label="Search documents"
        aria-hidden={!open}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={closeModal}
          aria-hidden="true"
        />

        {/* Panel */}
        <div
          className={`relative w-full max-w-xl mx-4 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl transition-all duration-150 ${
            open ? "scale-100 opacity-100" : "scale-95 opacity-0"
          }`}
        >
          {/* Search input */}
          <form onSubmit={handleSubmit} className="relative">
            <Search
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary"
              size={20}
              aria-hidden="true"
            />
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(e) => handleInputChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search NASA documents..."
              aria-label="Search NASA documents"
              aria-expanded={hasResults || showSuggestions}
              aria-controls="cmd-search-listbox"
              aria-activedescendant={
                activeIndex >= 0 ? `cmd-hit-${activeIndex}` : undefined
              }
              role="combobox"
              aria-autocomplete="list"
              autoComplete="off"
              className="w-full border-b border-gray-200 bg-transparent py-4 pl-12 pr-12 text-base text-text-primary outline-none placeholder:text-text-secondary/60"
            />
            {query && (
              <button
                type="button"
                onClick={() => { setQuery(""); setHits([]); setActiveIndex(-1); inputRef.current?.focus(); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-text-secondary transition-colors hover:bg-gray-100 hover:text-text-primary"
                aria-label="Clear search"
              >
                <X size={16} />
              </button>
            )}
            {/* Loading bar */}
            {isLoading && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 overflow-hidden">
                <div className="h-full w-1/3 rounded-full bg-instrument-blue animate-[shimmer_1s_ease-in-out_infinite]" />
              </div>
            )}
          </form>

          {/* Results / Suggestions */}
          <ul
            id="cmd-search-listbox"
            ref={listRef}
            role="listbox"
            className="max-h-[50vh] overflow-y-auto overscroll-contain"
          >
            {showSuggestions && (
              <>
                {recent.searches.length > 0 && (
                  <>
                    <li className="flex items-center justify-between px-4 pt-3 pb-1.5" role="presentation">
                      <span className="text-[11px] font-medium uppercase tracking-wider text-text-secondary">
                        Recent
                      </span>
                      <button
                        type="button"
                        onClick={recent.clear}
                        className="text-[11px] font-medium text-text-secondary transition-colors hover:text-nasa-orange"
                      >
                        Clear
                      </button>
                    </li>
                    {recent.searches.map((q) => (
                      <li key={q} className="group flex items-center">
                        <Link
                          href={`/search?q=${encodeURIComponent(q)}`}
                          onClick={closeModal}
                          className="flex flex-1 items-center gap-3 px-4 py-2.5 text-sm text-text-primary transition-colors hover:bg-gray-50"
                        >
                          <Clock className="h-4 w-4 shrink-0 text-text-secondary" aria-hidden="true" />
                          {q}
                        </Link>
                        <button
                          type="button"
                          onClick={() => recent.remove(q)}
                          className="mr-2 rounded-md p-1.5 text-text-secondary opacity-0 transition-opacity hover:bg-gray-100 hover:text-text-primary group-hover:opacity-100"
                          aria-label={`Remove "${q}" from recent searches`}
                        >
                          <X size={14} />
                        </button>
                      </li>
                    ))}
                  </>
                )}
                <li className="px-4 pt-3 pb-1.5 text-[11px] font-medium uppercase tracking-wider text-text-secondary" role="presentation">
                  Suggested
                </li>
                {SUGGESTIONS.map((s) => (
                  <li key={s.query}>
                    <Link
                      href={`/search?q=${encodeURIComponent(s.query)}`}
                      onClick={closeModal}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-text-primary transition-colors hover:bg-gray-50"
                    >
                      <Search className="h-4 w-4 shrink-0 text-text-secondary" aria-hidden="true" />
                      {s.label}
                    </Link>
                  </li>
                ))}
              </>
            )}

            {hasResults && hits.map((hit, i) => {
              const colors = getProgramColors(hit.program);
              const isActive = i === activeIndex;

              return (
                <li
                  key={hit.slug}
                  id={`cmd-hit-${i}`}
                  role="option"
                  aria-selected={isActive}
                  tabIndex={isActive ? 0 : -1}
                  onMouseEnter={() => setActiveIndex(i)}
                  onClick={() => navigateTo(`/docs/${hit.slug}`)}
                  className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors ${
                    isActive ? "bg-instrument-blue/5" : "hover:bg-gray-50"
                  }`}
                >
                  <span
                    className={`h-2 w-2 shrink-0 rounded-full ${colors.dot}`}
                    aria-hidden="true"
                  />
                  <span className={`min-w-0 flex-1 truncate text-sm ${isActive ? "text-text-primary font-medium" : "text-text-primary"}`}>
                    {hit.title}
                  </span>
                  {hit.year > 0 && (
                    <span className="shrink-0 font-mono text-xs tabular-nums text-text-secondary">
                      {hit.year}
                    </span>
                  )}
                </li>
              );
            })}

            {query.trim() && !isLoading && hits.length === 0 && (
              <li className="px-4 py-8 text-center text-sm text-text-secondary">
                No documents match &ldquo;{query}&rdquo;. Try different keywords.
              </li>
            )}
          </ul>

          {/* Footer */}
          <div className="flex items-center justify-between border-t border-gray-200 px-4 py-2.5 text-xs text-text-secondary">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1">
                <kbd className="rounded border border-gray-200 bg-gray-50 px-1 py-0.5 font-mono text-[10px]">&uarr;&darr;</kbd>
                navigate
              </span>
              <span className="inline-flex items-center gap-1">
                <kbd className="rounded border border-gray-200 bg-gray-50 px-1 py-0.5 font-mono text-[10px]">&crarr;</kbd>
                select
              </span>
              <span className="inline-flex items-center gap-1">
                <kbd className="rounded border border-gray-200 bg-gray-50 px-1 py-0.5 font-mono text-[10px]">esc</kbd>
                close
              </span>
            </div>
            {query.trim() && hasResults && (
              <button
                type="button"
                onClick={() => navigateTo(`/search?q=${encodeURIComponent(query)}`)}
                className="text-instrument-blue hover:underline"
              >
                View all results
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
