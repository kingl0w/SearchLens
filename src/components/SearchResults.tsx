"use client";

import Link from "next/link";
import { FileText } from "lucide-react";
import type { SearchHit } from "@/lib/types";

const PROGRAM_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  Apollo:                   { bg: "bg-program-apollo/15",     text: "text-program-apollo",     dot: "bg-program-apollo" },
  "Space Shuttle":          { bg: "bg-program-shuttle/20",    text: "text-program-shuttle",    dot: "bg-program-shuttle" },
  "Mars Exploration":       { bg: "bg-program-mars/15",       text: "text-program-mars",       dot: "bg-program-mars" },
  "Space Telescopes":       { bg: "bg-program-telescopes/15", text: "text-program-telescopes", dot: "bg-program-telescopes" },
  "Deep Space":             { bg: "bg-program-deep-space/15", text: "text-program-deep-space", dot: "bg-program-deep-space" },
  "Space Station":          { bg: "bg-program-station/15",    text: "text-program-station",    dot: "bg-program-station" },
  Artemis:                  { bg: "bg-program-artemis/15",    text: "text-program-artemis",    dot: "bg-program-artemis" },
  "Earth Science":          { bg: "bg-program-earth/15",      text: "text-program-earth",      dot: "bg-program-earth" },
  Aeronautics:              { bg: "bg-program-aeronautics/15",text: "text-program-aeronautics",dot: "bg-program-aeronautics" },
  "Propulsion & Technology":{ bg: "bg-program-propulsion/15", text: "text-program-propulsion", dot: "bg-program-propulsion" },
};

function getProgramColors(program: string) {
  return (
    PROGRAM_COLORS[program] ?? {
      bg: "bg-gray-100",
      text: "text-text-secondary",
      dot: "bg-gray-400",
    }
  );
}

export { PROGRAM_COLORS, getProgramColors };

//only allow <mark> tags — strip everything else
function sanitizeHighlight(html: string): string {
  return html.replace(/<\/?(?!mark\b)[^>]+>/g, "");
}

function getHighlightSnippet(
  highlights: SearchHit["highlights"],
  field: string,
  fallback: string,
  maxLen = 200,
): string {
  const h = highlights.find((hl) => hl.field === field);
  if (h?.snippet) return sanitizeHighlight(h.snippet);
  if (fallback.length <= maxLen) return fallback;
  return fallback.slice(0, maxLen) + "...";
}

interface ResultCardProps {
  hit: SearchHit;
}

function ResultCard({ hit }: ResultCardProps) {
  const { document: doc, highlights } = hit;
  const colors = getProgramColors(doc.program);

  const titleHtml = getHighlightSnippet(highlights, "title", doc.title, 300);
  const bodyHtml = getHighlightSnippet(
    highlights,
    "body",
    doc.excerpt || doc.body.replace(/<[^>]*>/g, ""),
    200,
  );

  return (
    <Link
      href={`/docs/${doc.slug}`}
      className="group block rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition-all hover:border-instrument-blue/30 hover:shadow-md"
    >
      <div className="mb-2.5 flex flex-wrap items-center gap-2 text-xs">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 font-medium ${colors.bg} ${colors.text}`}
        >
          <span
            className={`inline-block h-1.5 w-1.5 rounded-full ${colors.dot}`}
            aria-hidden="true"
          />
          {doc.program}
        </span>
        <span className="text-text-secondary">{doc.category}</span>
        <span className="font-mono text-text-secondary">{doc.year}</span>
        {doc.mission && (
          <span className="rounded border border-gray-200 bg-gray-50 px-1.5 py-0.5 font-mono text-text-secondary">
            {doc.mission}
          </span>
        )}
      </div>

      <h3
        className="mb-1.5 font-heading text-base font-semibold text-text-primary group-hover:text-instrument-blue [&_mark]:bg-search-highlight [&_mark]:px-0.5"
        dangerouslySetInnerHTML={{ __html: titleHtml }}
      />

      <p
        className="mb-3 text-sm leading-relaxed text-text-secondary [&_mark]:bg-search-highlight [&_mark]:px-0.5"
        dangerouslySetInnerHTML={{ __html: bodyHtml }}
      />

      <div className="flex items-center gap-3 text-xs text-text-secondary">
        <span className="inline-flex items-center gap-1">
          <FileText size={12} aria-hidden="true" />
          {doc.word_count.toLocaleString()} words
        </span>
        {doc.authors.length > 0 && (
          <span className="truncate max-w-[260px]">
            {doc.authors.slice(0, 3).join(", ")}
            {doc.authors.length > 3 && ` +${doc.authors.length - 3}`}
          </span>
        )}
      </div>
    </Link>
  );
}

function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-lg border border-gray-200 bg-white p-5">
      <div className="mb-2.5 flex gap-2">
        <div className="h-5 w-24 rounded-full bg-gray-200" />
        <div className="h-5 w-20 rounded bg-gray-100" />
        <div className="h-5 w-12 rounded bg-gray-100" />
      </div>
      <div className="mb-1.5 h-5 w-3/4 rounded bg-gray-200" />
      <div className="mb-1 h-4 w-full rounded bg-gray-100" />
      <div className="mb-3 h-4 w-2/3 rounded bg-gray-100" />
      <div className="flex gap-3">
        <div className="h-4 w-20 rounded bg-gray-100" />
        <div className="h-4 w-36 rounded bg-gray-100" />
      </div>
    </div>
  );
}

interface SearchResultsProps {
  hits: SearchHit[];
  isLoading: boolean;
  query: string;
  totalFound: number;
  hasActiveFilters?: boolean;
}

export default function SearchResults({
  hits,
  isLoading,
  query,
  totalFound,
  hasActiveFilters = false,
}: SearchResultsProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  if ((query || hasActiveFilters) && totalFound === 0) {
    return (
      <div className="flex flex-col items-center py-16 text-center">
        <div className="mb-4 rounded-full bg-gray-100 p-4">
          <FileText size={32} className="text-text-secondary" aria-hidden="true" />
        </div>
        <h3 className="mb-1 font-heading text-lg font-semibold text-text-primary">
          No results found
        </h3>
        <p className="max-w-md text-sm text-text-secondary">
          {query
            ? <>No documents match &ldquo;{query}&rdquo;. Try different keywords or clear your filters.</>
            : <>No documents match your current filters. Try removing some filters.</>
          }
        </p>
      </div>
    );
  }

  if (!query && !hasActiveFilters && hits.length === 0) {
    return null;
  }

  return (
    <div role="list" aria-label="Search results" className="flex flex-col gap-3">
      {hits.map((hit) => (
        <div role="listitem" key={hit.document.slug}>
          <ResultCard hit={hit} />
        </div>
      ))}
    </div>
  );
}
