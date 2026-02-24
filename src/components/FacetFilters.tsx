"use client";

import { useState } from "react";
import { ChevronDown, X } from "lucide-react";
import type { FacetGroup } from "@/lib/types";
import type { ActiveFacets } from "@/hooks/useSearch";
import { getProgramColors } from "@/components/SearchResults";

const FACET_LABELS: Record<string, string> = {
  program: "Program",
  category: "Category",
  center: "NASA Center",
  tags: "Tags",
  year: "Year",
  authors: "Authors",
};

const DEFAULT_VISIBLE = 8;
const DISPLAY_FACETS = ["program", "category", "center", "tags", "year"];

interface ActivePillsProps {
  activeFacets: ActiveFacets;
  onToggle: (field: string, value: string) => void;
  onClearAll: () => void;
}

export function ActivePills({ activeFacets, onToggle, onClearAll }: ActivePillsProps) {
  const allActive = Object.entries(activeFacets).flatMap(([field, values]) =>
    values.map((v) => ({ field, value: v })),
  );
  if (allActive.length === 0) return null;

  return (
    <div role="list" aria-label="Active filters" className="mb-4 flex flex-wrap items-center gap-2">
      {allActive.map(({ field, value }) => (
        <button
          role="listitem"
          key={`${field}-${value}`}
          type="button"
          onClick={() => onToggle(field, value)}
          aria-label={`Remove filter: ${value}`}
          className="group inline-flex items-center gap-1 rounded-full bg-instrument-blue/10 px-2.5 py-1 text-xs font-medium text-instrument-blue transition-colors hover:bg-instrument-blue/20"
        >
          <span className="max-w-[160px] truncate">{value}</span>
          <X
            size={12}
            className="opacity-60 group-hover:opacity-100"
            aria-hidden="true"
          />
        </button>
      ))}
      <button
        type="button"
        onClick={onClearAll}
        className="text-xs font-medium text-text-secondary hover:text-nasa-orange"
      >
        Clear all
      </button>
    </div>
  );
}

interface FacetGroupSectionProps {
  group: FacetGroup;
  activeValues: string[];
  onToggle: (field: string, value: string) => void;
}

function FacetGroupSection({
  group,
  activeValues,
  onToggle,
}: FacetGroupSectionProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [showAll, setShowAll] = useState(false);

  const label = FACET_LABELS[group.field_name] ?? group.field_name;
  const visibleCounts = showAll
    ? group.counts
    : group.counts.slice(0, DEFAULT_VISIBLE);
  const hasMore = group.counts.length > DEFAULT_VISIBLE;
  const isProgramFacet = group.field_name === "program";

  return (
    <div className="border-b border-gray-100 pb-3 last:border-b-0 last:pb-0">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-2 text-left"
        aria-expanded={isOpen}
      >
        <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
          {label}
        </span>
        <ChevronDown
          size={14}
          className={`text-text-secondary transition-transform ${isOpen ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>

      {isOpen && (
        <div className="flex flex-col gap-0.5">
          {visibleCounts.map(({ value, count }) => {
            const isActive = activeValues.includes(value);
            const programColors = isProgramFacet
              ? getProgramColors(value)
              : null;

            return (
              <label
                key={value}
                className={`group flex w-full cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors ${
                  isActive
                    ? "bg-instrument-blue/10 text-instrument-blue"
                    : "text-text-primary hover:bg-gray-50"
                }`}
              >
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={() => onToggle(group.field_name, value)}
                  className="sr-only"
                  aria-label={`${value} (${count})`}
                />
                <span
                  aria-hidden="true"
                  className={`flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded border transition-colors ${
                    isActive
                      ? "border-instrument-blue bg-instrument-blue"
                      : "border-gray-300 group-hover:border-gray-400"
                  }`}
                >
                  {isActive && (
                    <svg
                      width="8"
                      height="6"
                      viewBox="0 0 8 6"
                      fill="none"
                      className="text-white"
                    >
                      <path
                        d="M1 3L3 5L7 1"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </span>

                {programColors && (
                  <span
                    className={`h-2 w-2 shrink-0 rounded-full ${programColors.dot}`}
                    aria-hidden="true"
                  />
                )}

                <span className="min-w-0 flex-1 truncate">{value}</span>

                <span className="shrink-0 rounded-full bg-gray-100 px-1.5 py-0.5 text-xs tabular-nums text-text-secondary">
                  {count}
                </span>
              </label>
            );
          })}

          {hasMore && (
            <button
              type="button"
              onClick={() => setShowAll(!showAll)}
              className="mt-1 px-2 text-left text-xs font-medium text-instrument-blue hover:underline"
            >
              {showAll
                ? "Show less"
                : `+${group.counts.length - DEFAULT_VISIBLE} more`}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

interface FacetFiltersProps {
  facets: FacetGroup[];
  activeFacets: ActiveFacets;
  onToggle: (field: string, value: string) => void;
  onClearAll: () => void;
}

export default function FacetFilters({
  facets,
  activeFacets,
  onToggle,
  onClearAll,
}: FacetFiltersProps) {
  const orderedFacets = DISPLAY_FACETS.map((name) =>
    facets.find((f) => f.field_name === name),
  ).filter((f): f is FacetGroup => f != null && f.counts.length > 0);

  if (orderedFacets.length === 0) return null;

  return (
    <nav aria-label="Filter results" className="flex flex-col gap-1">
      {orderedFacets.map((group) => (
        <FacetGroupSection
          key={group.field_name}
          group={group}
          activeValues={activeFacets[group.field_name] ?? []}
          onToggle={onToggle}
        />
      ))}
    </nav>
  );
}
