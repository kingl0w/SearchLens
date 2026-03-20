"use client";

import { memo, useMemo } from "react";
import Link from "next/link";
import { Clock, FileText } from "lucide-react";
import type { SearchHit } from "@/lib/types";

// Badge text uses darker shades for WCAG AA contrast on /15 backgrounds
const PROGRAM_COLORS: Record<string, { bg: string; text: string; dot: string; border: string }> = {
  Apollo:                   { bg: "bg-program-apollo/15",     text: "text-amber-800",          dot: "bg-program-apollo",     border: "border-l-program-apollo" },
  "Space Shuttle":          { bg: "bg-program-shuttle/20",    text: "text-gray-600",           dot: "bg-program-shuttle",    border: "border-l-program-shuttle" },
  "Mars Exploration":       { bg: "bg-program-mars/15",       text: "text-red-700",            dot: "bg-program-mars",       border: "border-l-program-mars" },
  "Space Telescopes":       { bg: "bg-program-telescopes/15", text: "text-violet-700",         dot: "bg-program-telescopes", border: "border-l-program-telescopes" },
  "Deep Space":             { bg: "bg-program-deep-space/15", text: "text-teal-700",           dot: "bg-program-deep-space", border: "border-l-program-deep-space" },
  "Space Station":          { bg: "bg-program-station/15",    text: "text-blue-700",           dot: "bg-program-station",    border: "border-l-program-station" },
  Artemis:                  { bg: "bg-program-artemis/15",    text: "text-orange-700",         dot: "bg-program-artemis",    border: "border-l-program-artemis" },
  "Earth Science":          { bg: "bg-program-earth/15",      text: "text-green-700",          dot: "bg-program-earth",      border: "border-l-program-earth" },
  Aeronautics:              { bg: "bg-program-aeronautics/15",text: "text-slate-700",          dot: "bg-program-aeronautics",border: "border-l-program-aeronautics" },
  "Propulsion & Technology":{ bg: "bg-program-propulsion/15", text: "text-amber-700",          dot: "bg-program-propulsion", border: "border-l-program-propulsion" },
};

function getProgramColors(program: string) {
  return (
    PROGRAM_COLORS[program] ?? {
      bg: "bg-gray-100",
      text: "text-text-secondary",
      dot: "bg-gray-400",
      border: "border-l-gray-300",
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

const ResultCard = memo(function ResultCard({ hit }: ResultCardProps) {
  const { document: doc, highlights } = hit;
  const colors = getProgramColors(doc.program);
  const readTime = Math.max(1, Math.ceil(doc.word_count / 238));

  const titleHtml = useMemo(
    () => getHighlightSnippet(highlights, "title", doc.title, 300),
    [highlights, doc.title],
  );
  const bodyHtml = useMemo(
    () =>
      getHighlightSnippet(
        highlights,
        "body",
        doc.excerpt || doc.body.replace(/<[^>]*>/g, ""),
        200,
      ),
    [highlights, doc.excerpt, doc.body],
  );

  return (
    <Link
      href={`/docs/${doc.slug}`}
      className={`group block rounded-lg border border-gray-200 border-l-[3px] ${colors.border} bg-white p-5 shadow-sm transition-all hover:border-gray-300 hover:shadow-md`}
    >
      <div className="mb-3 flex flex-wrap items-center gap-2 text-xs">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${colors.bg} ${colors.text}`}
        >
          <span
            className={`inline-block h-1.5 w-1.5 rounded-full ${colors.dot}`}
            aria-hidden="true"
          />
          {doc.program}
        </span>
        <span className="text-text-secondary">{doc.category}</span>
      </div>

      <h3
        className="mb-2 font-heading text-lg font-semibold leading-snug text-text-primary group-hover:text-instrument-blue transition-colors [&_mark]:bg-search-highlight [&_mark]:px-0.5"
        dangerouslySetInnerHTML={{ __html: titleHtml }}
      />

      <div className="mb-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-text-primary">
        {doc.mission && (
          <span className="font-mono font-medium">{doc.mission}</span>
        )}
        {doc.year > 0 && (
          <span className="font-mono tabular-nums">{doc.year}</span>
        )}
      </div>

      <p
        className="mb-3 text-sm leading-relaxed text-text-secondary line-clamp-2 [&_mark]:bg-search-highlight [&_mark]:px-0.5"
        dangerouslySetInnerHTML={{ __html: bodyHtml }}
      />

      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-text-secondary">
        <span className="inline-flex items-center gap-1">
          <Clock size={12} aria-hidden="true" />
          {readTime} min read
        </span>
        <span className="inline-flex items-center gap-1">
          <FileText size={12} aria-hidden="true" />
          {doc.word_count.toLocaleString()} words
        </span>
        {doc.authors.length > 0 && (
          <>
            <span className="text-gray-300" aria-hidden="true">&middot;</span>
            <span className="truncate max-w-[180px] sm:max-w-[260px]">
              {doc.authors.slice(0, 2).join(", ")}
              {doc.authors.length > 2 && ` +${doc.authors.length - 2}`}
            </span>
          </>
        )}
      </div>
    </Link>
  );
});

function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-lg border border-gray-200 border-l-[3px] border-l-gray-300 bg-white p-5">
      <div className="mb-3 flex gap-2">
        <div className="h-5 w-24 rounded-full bg-gray-200" />
        <div className="h-5 w-16 rounded bg-gray-100" />
      </div>
      <div className="mb-2 h-6 w-3/4 rounded bg-gray-200" />
      <div className="mb-2 flex gap-3">
        <div className="h-4 w-20 rounded bg-gray-100" />
        <div className="h-4 w-12 rounded bg-gray-100" />
      </div>
      <div className="mb-1 h-4 w-full rounded bg-gray-100" />
      <div className="mb-3 h-4 w-2/3 rounded bg-gray-100" />
      <div className="flex gap-3">
        <div className="h-3.5 w-20 rounded bg-gray-100" />
        <div className="h-3.5 w-20 rounded bg-gray-100" />
        <div className="h-3.5 w-32 rounded bg-gray-100" />
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

  if (hits.length === 0 && !query && !hasActiveFilters) {
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
