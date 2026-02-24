import Link from "next/link";
import { Search, FileText, BookOpen, Building2, Calendar, ArrowRight } from "lucide-react";
import { getHomePageData } from "@/lib/content";
import { PROGRAMS, getProgramConfig, getProgramBadgeStyle } from "@/lib/programs";

function formatWordCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}K`;
  return n.toLocaleString();
}

const SEARCH_SUGGESTIONS = [
  { label: "moon landing", query: "moon landing" },
  { label: "Mars rover", query: "Mars rover" },
  { label: "Hubble repair", query: "Hubble repair" },
  { label: "space station assembly", query: "space station assembly" },
];

export default function HomePage() {
  const data = getHomePageData();

  return (
    <div>
      <section className="-mt-16 hero-starfield">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-36 pb-20 text-center">
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight">
            Search NASA&apos;s Mission Archives
          </h1>
          <p className="mt-4 text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Instant full-text search across{" "}
            <span className="text-white font-semibold">
              {data.totalDocuments.toLocaleString()}
            </span>{" "}
            NASA technical documents spanning 60+ years of space exploration
          </p>

          <form action="/search" role="search" aria-label="Search NASA documents" className="mt-8 max-w-xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" aria-hidden="true" />
              <input
                type="search"
                name="q"
                placeholder="Search NASA documents..."
                aria-label="Search NASA documents"
                className="w-full pl-12 pr-4 py-4 text-lg bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-nasa-orange/50 focus:border-nasa-orange/50 backdrop-blur-sm transition-shadow"
              />
            </div>
          </form>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-sm">
            <span className="text-gray-500">Try:</span>
            {SEARCH_SUGGESTIONS.map((s) => (
              <Link
                key={s.query}
                href={`/search?q=${encodeURIComponent(s.query)}`}
                className="px-3 py-1 rounded-full border border-white/15 text-gray-400 hover:text-white hover:border-white/30 transition-colors"
              >
                {s.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 text-center">
            <div>
              <p className="text-2xl font-heading font-bold text-text-primary">
                {data.totalDocuments.toLocaleString()}
              </p>
              <p className="text-sm text-text-secondary mt-0.5 flex items-center justify-center gap-1">
                <FileText className="w-3.5 h-3.5" aria-hidden="true" />
                Documents
              </p>
            </div>
            <div>
              <p className="text-2xl font-heading font-bold text-text-primary">
                {formatWordCount(data.totalWords)}
              </p>
              <p className="text-sm text-text-secondary mt-0.5 flex items-center justify-center gap-1">
                <BookOpen className="w-3.5 h-3.5" aria-hidden="true" />
                Words
              </p>
            </div>
            <div>
              <p className="text-2xl font-heading font-bold text-text-primary">
                {Object.keys(data.programs).length}
              </p>
              <p className="text-sm text-text-secondary mt-0.5">Programs</p>
            </div>
            <div>
              <p className="text-2xl font-heading font-bold text-text-primary">
                {data.centersCount}
              </p>
              <p className="text-sm text-text-secondary mt-0.5 flex items-center justify-center gap-1">
                <Building2 className="w-3.5 h-3.5" aria-hidden="true" />
                NASA Centers
              </p>
            </div>
            <div>
              <p className="text-2xl font-heading font-bold text-text-primary">
                {data.maxYear - data.minYear}+
              </p>
              <p className="text-sm text-text-secondary mt-0.5 flex items-center justify-center gap-1">
                <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
                Years of Research
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-2xl font-bold text-text-primary">
            Browse by Program
          </h2>
          <p className="mt-2 text-text-secondary">
            Explore documents from NASA&apos;s major mission programs
          </p>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {PROGRAMS.map((program) => {
              const config = getProgramConfig(program);
              const stats = data.programs[program];
              if (!stats) return null;
              const Icon = config.icon;

              return (
                <Link
                  key={program}
                  href={`/search?program=${encodeURIComponent(program)}`}
                  className={`group block rounded-lg border border-gray-200 bg-white p-4 border-l-4 ${config.border} hover:shadow-md hover:border-gray-300 transition-all`}
                >
                  <Icon className={`w-5 h-5 ${config.text} mb-2`} aria-hidden="true" />
                  <h3 className="font-heading font-semibold text-sm text-text-primary group-hover:text-instrument-blue transition-colors">
                    {program}
                  </h3>
                  <p className="mt-1 text-xs text-text-secondary">
                    {stats.count} documents
                  </p>
                  <p className="text-xs text-text-secondary font-mono">
                    {stats.minYear}&ndash;{stats.maxYear}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-heading text-2xl font-bold text-text-primary">
                Featured Documents
              </h2>
              <p className="mt-2 text-text-secondary">
                Highlights from across NASA&apos;s mission archives
              </p>
            </div>
            <Link
              href="/search"
              className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-instrument-blue hover:underline"
            >
              View all
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {data.featured.map((doc) => (
              <Link
                key={doc.slug}
                href={`/docs/${doc.slug}`}
                className="group block rounded-lg border border-gray-200 bg-white p-5 hover:shadow-md hover:border-instrument-blue/30 transition-all"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold font-heading ${getProgramBadgeStyle(doc.program)}`}
                  >
                    {doc.program}
                  </span>
                  {doc.mission && (
                    <span className="text-[11px] text-text-secondary font-mono">
                      {doc.mission}
                    </span>
                  )}
                </div>
                <h3 className="font-heading text-sm font-semibold text-text-primary group-hover:text-instrument-blue transition-colors line-clamp-2 leading-snug">
                  {doc.title}
                </h3>
                <p className="mt-2 text-xs text-text-secondary line-clamp-3 leading-relaxed">
                  {doc.excerpt}
                </p>
                <div className="mt-3 flex items-center gap-2 text-[11px] text-text-secondary font-mono">
                  {doc.year > 0 && <span>{doc.year}</span>}
                  {doc.category && (
                    <>
                      <span className="text-gray-300">&middot;</span>
                      <span>{doc.category}</span>
                    </>
                  )}
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-6 text-center sm:hidden">
            <Link
              href="/search"
              className="inline-flex items-center gap-1 text-sm font-medium text-instrument-blue hover:underline"
            >
              View all documents
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
