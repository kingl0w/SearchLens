/**
 * Client-side search via the /api/search proxy.
 * All Typesense calls go through the server — no NEXT_PUBLIC_ keys needed.
 */

export interface SearchApiParams {
  q: string;
  query_by: string;
  per_page?: number;
  page?: number;
  facet_by?: string;
  filter_by?: string;
  sort_by?: string;
  highlight_full_fields?: string;
  highlight_start_tag?: string;
  highlight_end_tag?: string;
  include_fields?: string;
}

export interface SearchApiHit {
  document: Record<string, unknown>;
  highlights?: {
    field: string;
    snippet?: string;
    matched_tokens?: (string | string[])[];
  }[];
}

export interface SearchApiResponse {
  found: number;
  hits?: SearchApiHit[];
  facet_counts?: {
    field_name: string;
    counts: { value: string; count: number }[];
  }[];
  page: number;
  out_of: number;
  error?: string;
}

export async function searchApi(
  params: SearchApiParams,
  options?: { signal?: AbortSignal },
): Promise<SearchApiResponse> {
  const url = new URL("/api/search", window.location.origin);
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, String(value));
    }
  }

  const res = await fetch(url.toString(), {
    signal: options?.signal,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `Search failed (${res.status})`);
  }

  return res.json();
}
