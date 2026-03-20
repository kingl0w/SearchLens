import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getHomePageData } from "@/lib/content";
import { PROGRAMS, getProgramConfig } from "@/lib/programs";
import HeroSearch from "@/components/HeroSearch";

export default function HomePage() {
  const data = getHomePageData();

  return (
    <div>
      <section className="-mt-16 hero-starfield">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-36 pb-14 text-center">
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight">
            Search NASA&apos;s Mission Archives
          </h1>
          <p className="mt-4 text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Instant full-text search across{" "}
            <span className="text-white font-semibold">
              {data.totalDocuments.toLocaleString()}
            </span>{" "}
            NASA technical documents spanning{" "}
            <span className="text-white font-semibold">
              {Object.keys(data.programs).length} programs
            </span>{" "}
            and 60+ years of space exploration
          </p>

          <HeroSearch />
        </div>
      </section>

      <section className="py-10 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-baseline justify-between mb-5">
            <h2 className="font-heading text-lg font-bold text-text-primary">
              Programs
            </h2>
            <Link
              href="/search"
              className="text-xs font-medium text-text-secondary hover:text-instrument-blue transition-colors"
            >
              Browse all
            </Link>
          </div>

          <div className="flex flex-wrap gap-2">
            {PROGRAMS.map((program) => {
              const config = getProgramConfig(program);
              const stats = data.programs[program];
              if (!stats) return null;
              const Icon = config.icon;

              return (
                <Link
                  key={program}
                  href={`/search?program=${encodeURIComponent(program)}`}
                  className="group inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3.5 py-2 text-sm transition-all hover:border-gray-300 hover:shadow-sm"
                >
                  <Icon className={`w-4 h-4 ${config.text} shrink-0`} aria-hidden="true" />
                  <span className="font-medium text-text-primary group-hover:text-instrument-blue transition-colors">
                    {program}
                  </span>
                  <span className="text-xs text-text-secondary tabular-nums">
                    {stats.count}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-heading text-2xl font-bold text-text-primary">
                Featured Documents
              </h2>
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
            {data.featured.map((doc) => {
              const progConfig = getProgramConfig(doc.program);
              return (
                <Link
                  key={doc.slug}
                  href={`/docs/${doc.slug}`}
                  className={`group block rounded-lg border border-gray-200 border-l-[3px] ${progConfig.border} bg-white p-5 shadow-sm hover:shadow-md hover:border-gray-300 transition-all`}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${progConfig.badge}`}
                    >
                      {doc.program}
                    </span>
                    {doc.category && (
                      <span className="text-[11px] text-text-secondary">
                        {doc.category}
                      </span>
                    )}
                  </div>
                  <h3 className="font-heading text-base font-semibold text-text-primary group-hover:text-instrument-blue transition-colors line-clamp-2 leading-snug">
                    {doc.title}
                  </h3>
                  <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-text-primary">
                    {doc.mission && (
                      <span className="font-mono font-medium">{doc.mission}</span>
                    )}
                    {doc.year > 0 && (
                      <span className="font-mono tabular-nums">{doc.year}</span>
                    )}
                  </div>
                  <p className="mt-2 text-xs text-text-secondary line-clamp-2 leading-relaxed">
                    {doc.excerpt}
                  </p>
                </Link>
              );
            })}
          </div>

          <div className="mt-6 text-center sm:hidden">
            <Link
              href="/search"
              className="inline-flex items-center gap-1 text-sm font-medium text-instrument-blue hover:underline"
            >
              View all
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
