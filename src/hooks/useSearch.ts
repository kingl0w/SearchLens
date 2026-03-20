"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { searchApi } from "@/lib/search-api";
import type { FacetGroup, SearchHit } from "@/lib/types";

const PER_PAGE = 12;
const DEBOUNCE_MS = 300;
const FACET_FIELDS = "program,category,tags,year,authors,center";

export interface ActiveFacets {
  [field: string]: string[];
}

export interface UseSearchOptions {
  initialQuery?: string;
  initialPage?: number;
  initialFacets?: ActiveFacets;
}

export interface UseSearchReturn {
  query: string;
  setQuery: (q: string) => void;
  results: SearchHit[];
  facets: FacetGroup[];
  activeFacets: ActiveFacets;
  toggleFacet: (field: string, value: string) => void;
  clearFacets: () => void;
  page: number;
  setPage: (p: number) => void;
  totalPages: number;
  totalFound: number;
  isLoading: boolean;
  error: string | null;
}

const NUMERICAL_FIELDS = new Set(["year", "word_count", "ntrs_id"]);

function buildFilterBy(activeFacets: ActiveFacets): string {
  const parts: string[] = [];
  for (const [field, values] of Object.entries(activeFacets)) {
    if (values.length === 0) continue;
    if (NUMERICAL_FIELDS.has(field)) {
      parts.push(`${field}:=[${values.join(",")}]`);
    } else {
      const escaped = values.map((v) => "`" + v + "`");
      parts.push(`${field}:=[${escaped.join(",")}]`);
    }
  }
  return parts.join(" && ");
}

export function useSearch(options: UseSearchOptions = {}): UseSearchReturn {
  const {
    initialQuery = "",
    initialPage = 1,
    initialFacets = {},
  } = options;

  const [query, setQueryRaw] = useState(initialQuery);
  const [results, setResults] = useState<SearchHit[]>([]);
  const [facets, setFacets] = useState<FacetGroup[]>([]);
  const [activeFacets, setActiveFacets] = useState<ActiveFacets>(initialFacets);
  const [page, setPageRaw] = useState(initialPage);
  const [totalFound, setTotalFound] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const didInitRef = useRef(false);

  const executeSearch = useCallback(
    async (q: string, pg: number, af: ActiveFacets) => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setIsLoading(true);
      setError(null);

      try {
        const filterBy = buildFilterBy(af);
        const isBrowse = !q;

        const response = await searchApi(
          {
            q: q || "*",
            query_by: "title,body,excerpt",
            facet_by: FACET_FIELDS,
            highlight_full_fields: "title,body",
            highlight_start_tag: "<mark>",
            highlight_end_tag: "</mark>",
            per_page: PER_PAGE,
            page: pg,
            ...(filterBy ? { filter_by: filterBy } : {}),
            ...(isBrowse ? { sort_by: "year:desc" } : {}),
          },
          { signal: controller.signal },
        );

        if (controller.signal.aborted) return;

        const hits: SearchHit[] = (response.hits ?? []).map((hit) => ({
          document: {
            title: String(hit.document.title ?? ""),
            slug: String(hit.document.slug ?? ""),
            body: String(hit.document.body ?? ""),
            excerpt: String(hit.document.excerpt ?? ""),
            program: String(hit.document.program ?? ""),
            category: String(hit.document.category ?? ""),
            tags: (hit.document.tags as string[]) ?? [],
            year: Number(hit.document.year ?? 0),
            mission: hit.document.mission ? String(hit.document.mission) : undefined,
            authors: (hit.document.authors as string[]) ?? [],
            center: hit.document.center ? String(hit.document.center) : undefined,
            ntrs_id: hit.document.ntrs_id ? Number(hit.document.ntrs_id) : undefined,
            word_count: Number(hit.document.word_count ?? 0),
          },
          highlights: (hit.highlights ?? []).map((h) => ({
            field: String(h.field),
            snippet: h.snippet ?? "",
            matched_tokens: (h.matched_tokens ?? []).flat(),
          })),
        }));

        const facetGroups: FacetGroup[] = (response.facet_counts ?? []).map(
          (fc) => ({
            field_name: String(fc.field_name),
            counts: fc.counts.map((c) => ({
              value: c.value,
              count: c.count,
            })),
          }),
        );

        setResults(hits);
        setFacets(facetGroups);
        setTotalFound(response.found);
        setTotalPages(Math.ceil(response.found / PER_PAGE));
      } catch (err: unknown) {
        if (controller.signal.aborted) return;
        if (err instanceof DOMException && err.name === "AbortError") return;
        if (err instanceof Error) {
          const msg = err.message.toLowerCase();
          if (msg.includes("abort") || msg.includes("cancel")) return;
        }

        const message =
          err instanceof Error ? err.message : "Search failed";
        setError(message);
        setResults([]);
        setFacets([]);
        setTotalFound(0);
        setTotalPages(0);
      } finally {
        if (!controller.signal.aborted || abortRef.current === controller) {
          setIsLoading(false);
        }
      }
    },
    [],
  );

  useEffect(() => {
    if (didInitRef.current) return;
    didInitRef.current = true;
    executeSearch(initialQuery, initialPage, initialFacets);

    return () => {
      didInitRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setQuery = useCallback(
    (q: string) => {
      setQueryRaw(q);
      setPageRaw(1);

      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        executeSearch(q, 1, activeFacets);
      }, DEBOUNCE_MS);
    },
    [activeFacets, executeSearch],
  );

  const setPage = useCallback(
    (p: number) => {
      setPageRaw(p);
      executeSearch(query, p, activeFacets);
    },
    [query, activeFacets, executeSearch],
  );

  const toggleFacet = useCallback(
    (field: string, value: string) => {
      setActiveFacets((prev) => {
        const current = prev[field] ?? [];
        const next = current.includes(value)
          ? current.filter((v) => v !== value)
          : [...current, value];
        const updated = { ...prev, [field]: next };

        setPageRaw(1);
        executeSearch(query, 1, updated);
        return updated;
      });
    },
    [query, executeSearch],
  );

  const clearFacets = useCallback(() => {
    setActiveFacets({});
    setPageRaw(1);
    executeSearch(query, 1, {});
  }, [query, executeSearch]);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      abortRef.current?.abort();
    };
  }, []);

  return {
    query,
    setQuery,
    results,
    facets,
    activeFacets,
    toggleFacet,
    clearFacets,
    page,
    setPage,
    totalPages,
    totalFound,
    isLoading,
    error,
  };
}
