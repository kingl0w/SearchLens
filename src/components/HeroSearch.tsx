"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Clock, Search, X } from "lucide-react";
import { getSearchClient, COLLECTION_NAME } from "@/lib/typesense";
import { getProgramColors } from "@/components/SearchResults";
import { useRecentSearches } from "@/hooks/useRecentSearches";

interface QuickHit {
  slug: string;
  title: string;
  program: string;
  year: number;
}

const DEBOUNCE_MS = 200;

const SUGGESTIONS = [
  { label: "moon landing", query: "moon landing" },
  { label: "Mars rover", query: "Mars rover" },
  { label: "Hubble repair", query: "Hubble repair" },
  { label: "space station assembly", query: "space station assembly" },
];

export default function HeroSearch() {
  const router = useRouter();
  const pathname = usePathname();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const clientRef = useRef<ReturnType<typeof getSearchClient> | null>(null);

  const [query, setQuery] = useState("");
  const [hits, setHits] = useState<QuickHit[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const recent = useRecentSearches();
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isNavigating, setIsNavigating] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  function getClient() {
    if (!clientRef.current) clientRef.current = getSearchClient();
    return clientRef.current;
  }

  const search = useCallback(async (q: string) => {
    if (!q.trim()) {
      setHits([]);
      setIsOpen(false);
      return;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setIsLoading(true);

    try {
      const client = getClient();
      const res = await client
        .collections(COLLECTION_NAME)
        .documents()
        .search(
          {
            q,
            query_by: "title,body,excerpt",
            per_page: 5,
            include_fields: "slug,title,program,year",
          },
          { abortSignal: controller.signal },
        );

      if (controller.signal.aborted) return;

      const results: QuickHit[] = (res.hits ?? []).map((h) => ({
        slug: String((h.document as Record<string, unknown>).slug),
        title: String((h.document as Record<string, unknown>).title),
        program: String((h.document as Record<string, unknown>).program),
        year: Number((h.document as Record<string, unknown>).year),
      }));

      setHits(results);
      setIsOpen(results.length > 0);
      setActiveIndex(-1);
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
    setIsNavigating(true);
    setIsOpen(false);
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
    if (pathname === "/search") {
      const params = new URLSearchParams(window.location.search);
      params.set("q", query);
      params.delete("page");
      router.replace(`/search?${params.toString()}`, { scroll: false });
      setIsOpen(false);
    } else {
      navigateTo(`/search?q=${encodeURIComponent(query)}`);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!isOpen || hits.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev < hits.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : hits.length - 1));
    } else if (e.key === "Escape") {
      setIsOpen(false);
      setActiveIndex(-1);
    }
  }

  // Reset isNavigating on route change
  useEffect(() => {
    setIsNavigating(false);
  }, [pathname]);

  // Outside click dismiss + cleanup
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const container = inputRef.current?.closest("[data-hero-search]");
      if (container && !container.contains(e.target as Node)) {
        setIsOpen(false);
        setIsFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => {
      document.removeEventListener("mousedown", handleClick);
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

  const showSuggestions = isFocused && !query.trim() && hits.length === 0;
  const showResults = isOpen && hits.length > 0;
  const showDropdown = showSuggestions || showResults;

  return (
    <div className="relative mt-8 max-w-xl mx-auto" data-hero-search>
      <form
        onSubmit={handleSubmit}
        role="search"
        aria-label="Search NASA documents"
      >
        <div className="relative">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
            aria-hidden="true"
          />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              setIsFocused(true);
              if (hits.length > 0 && query.trim()) setIsOpen(true);
            }}
            onBlur={() => {
              // Delay to allow click events on dropdown items
              setTimeout(() => setIsFocused(false), 200);
            }}
            placeholder="Search NASA documents..."
            aria-label="Search NASA documents"
            aria-expanded={showDropdown}
            aria-controls="hero-search-listbox"
            aria-activedescendant={
              activeIndex >= 0 ? `hero-hit-${activeIndex}` : undefined
            }
            role="combobox"
            aria-autocomplete="list"
            autoComplete="off"
            className="w-full pl-12 pr-16 py-4 text-base sm:text-lg bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-nasa-orange/50 focus:border-nasa-orange/50 backdrop-blur-sm transition-shadow"
          />

          {/* Cmd+K hint */}
          {!query && (
            <kbd className="absolute right-4 top-1/2 -translate-y-1/2 hidden rounded border border-white/20 bg-white/10 px-1.5 py-0.5 font-mono text-xs text-gray-400 sm:inline-block">
              ⌘K
            </kbd>
          )}

          {/* Loading bar */}
          {(isLoading || isNavigating) && (
            <div className="absolute bottom-0 left-3 right-3 h-0.5 overflow-hidden rounded-full">
              <div className="h-full w-1/3 rounded-full bg-nasa-orange animate-[shimmer_1s_ease-in-out_infinite]" />
            </div>
          )}
        </div>
      </form>

      {/* Dropdown — suggestions when empty, results when typing */}
      {showDropdown && (
        <ul
          id="hero-search-listbox"
          ref={listRef}
          role="listbox"
          className="absolute top-full left-0 right-0 z-50 mt-2 overflow-hidden rounded-xl border border-white/15 bg-deep-space/95 backdrop-blur-md shadow-2xl"
        >
          {showSuggestions && (
            <>
              {recent.searches.length > 0 && (
                <>
                  <li className="flex items-center justify-between px-4 pt-3 pb-1.5" role="presentation">
                    <span className="text-[11px] font-medium uppercase tracking-wider text-gray-500">
                      Recent
                    </span>
                    <button
                      type="button"
                      onClick={recent.clear}
                      className="text-[11px] font-medium text-gray-500 transition-colors hover:text-gray-300"
                    >
                      Clear
                    </button>
                  </li>
                  {recent.searches.map((q) => (
                    <li key={q} className="group flex items-center">
                      <Link
                        href={`/search?q=${encodeURIComponent(q)}`}
                        className="flex flex-1 items-center gap-3 px-4 py-2.5 text-sm text-gray-300 transition-colors hover:bg-white/5 hover:text-white"
                      >
                        <Clock className="h-3.5 w-3.5 shrink-0 text-gray-500" aria-hidden="true" />
                        {q}
                      </Link>
                      <button
                        type="button"
                        onClick={() => recent.remove(q)}
                        className="mr-2 rounded-md p-1.5 text-gray-500 opacity-0 transition-opacity hover:bg-white/10 hover:text-gray-300 group-hover:opacity-100"
                        aria-label={`Remove "${q}" from recent searches`}
                      >
                        <X size={14} />
                      </button>
                    </li>
                  ))}
                </>
              )}
              <li className="px-4 pt-3 pb-1.5 text-[11px] font-medium uppercase tracking-wider text-gray-500" role="presentation">
                Suggested
              </li>
              {SUGGESTIONS.map((s) => (
                <li key={s.query}>
                  <Link
                    href={`/search?q=${encodeURIComponent(s.query)}`}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 transition-colors hover:bg-white/5 hover:text-white"
                  >
                    <Search className="h-3.5 w-3.5 shrink-0 text-gray-500" aria-hidden="true" />
                    {s.label}
                  </Link>
                </li>
              ))}
            </>
          )}

          {showResults && (
            <>
              {hits.map((hit, i) => {
                const colors = getProgramColors(hit.program);
                const isActive = i === activeIndex;

                return (
                  <li
                    key={hit.slug}
                    id={`hero-hit-${i}`}
                    role="option"
                    aria-selected={isActive}
                    tabIndex={isActive ? 0 : -1}
                    onMouseEnter={() => setActiveIndex(i)}
                    onClick={() => navigateTo(`/docs/${hit.slug}`)}
                    className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors ${
                      isActive ? "bg-white/10" : "hover:bg-white/5"
                    }`}
                  >
                    <span
                      className={`h-2 w-2 shrink-0 rounded-full ${colors.dot}`}
                      aria-hidden="true"
                    />
                    <span className="min-w-0 flex-1 truncate text-sm text-gray-200">
                      {hit.title}
                    </span>
                    {hit.year > 0 && (
                      <span className="shrink-0 font-mono text-xs tabular-nums text-gray-500">
                        {hit.year}
                      </span>
                    )}
                  </li>
                );
              })}

              <li className="border-t border-white/10 px-4 py-2.5">
                <button
                  type="button"
                  onClick={() => {
                    if (query.trim()) {
                      navigateTo(`/search?q=${encodeURIComponent(query)}`);
                    }
                  }}
                  className="flex w-full items-center gap-2 text-xs text-gray-400 transition-colors hover:text-white"
                >
                  <Search className="h-3 w-3" aria-hidden="true" />
                  View all results for &ldquo;{query}&rdquo;
                </button>
              </li>
            </>
          )}
        </ul>
      )}
    </div>
  );
}
