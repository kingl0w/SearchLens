import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  Clock,
  FileText,
  ExternalLink,
  Download,
  Users,
  Building2,
  ChevronLeft,
  ChevronRight,
  BookOpen,
} from "lucide-react";
import {
  getDocumentSlugs,
  getDocumentBySlug,
  extractHeadings,
  getRelatedDocuments,
  getAdjacentDocuments,
} from "@/lib/content";
import { getProgramBadgeStyle } from "@/lib/programs";
import TableOfContents from "@/components/TableOfContents";

const BASE_URL = "https://searchlens.example.com";

function formatAuthors(authors: string[]): string {
  if (authors.length === 0) return "";
  if (authors.length === 1) return authors[0];
  if (authors.length === 2) return `${authors[0]} and ${authors[1]}`;
  return `${authors.slice(0, -1).join(", ")}, and ${authors[authors.length - 1]}`;
}

interface DocPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getDocumentSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: DocPageProps): Promise<Metadata> {
  const { slug } = await params;
  const doc = getDocumentBySlug(slug);
  if (!doc) return { title: "Not Found" };

  const url = `${BASE_URL}/docs/${slug}`;

  return {
    title: `${doc.title} — SearchLens`,
    description: doc.excerpt,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: doc.title,
      description: doc.excerpt,
      url,
      type: "article",
      siteName: "SearchLens",
      authors: doc.authors,
    },
  };
}

export default async function DocPage({ params }: DocPageProps) {
  const { slug } = await params;
  const doc = getDocumentBySlug(slug);
  if (!doc) notFound();

  const headings = extractHeadings(doc.body);
  const related = getRelatedDocuments(doc, 3);
  const { prev, next } = getAdjacentDocuments(slug);
  const readTime = Math.max(1, Math.ceil(doc.word_count / 238));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: doc.title,
    description: doc.excerpt,
    datePublished: String(doc.year),
    author: doc.authors.map((name) => ({
      "@type": "Person",
      name,
    })),
    publisher: {
      "@type": "Organization",
      name: "NASA",
    },
    url: `${BASE_URL}/docs/${slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href="/search"
          className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-instrument-blue transition-colors"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          Back to search
        </Link>

        <div className="mt-6 lg:grid lg:grid-cols-[1fr_240px] lg:gap-10">
          <article className="min-w-0">
            <header>
              <div className="flex flex-wrap items-center gap-2 mb-4">
                {doc.program && (
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold font-heading ${getProgramBadgeStyle(doc.program)}`}
                  >
                    {doc.program}
                  </span>
                )}
                {doc.category && (
                  <span className="text-xs text-text-secondary font-mono">
                    {doc.category}
                  </span>
                )}
              </div>

              <h1 className="font-heading text-3xl sm:text-4xl lg:text-[2.5rem] font-bold leading-tight tracking-tight text-text-primary">
                {doc.title}
              </h1>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-4 text-sm text-text-secondary">
                {doc.mission && (
                  <span className="font-mono font-medium text-text-primary">
                    {doc.mission}
                  </span>
                )}
                {doc.year > 0 && (
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
                    {doc.year}
                  </span>
                )}
                <span className="inline-flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                  {readTime} min read
                </span>
                <span className="inline-flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5" aria-hidden="true" />
                  {doc.word_count.toLocaleString()} words
                </span>
              </div>

              {doc.authors.length > 0 && (
                <div className="flex items-start gap-1.5 mt-3 text-sm text-text-secondary">
                  <Users className="w-3.5 h-3.5 mt-0.5 shrink-0" aria-hidden="true" />
                  <span>{formatAuthors(doc.authors)}</span>
                </div>
              )}

              {doc.center && (
                <div className="flex items-center gap-1.5 mt-1.5 text-sm text-text-secondary">
                  <Building2 className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  <span>{doc.center}</span>
                </div>
              )}

              <div className="flex flex-wrap items-center gap-3 mt-5">
                {doc.ntrs_id && (
                  <a
                    href={`https://ntrs.nasa.gov/citations/${doc.ntrs_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-instrument-blue hover:underline"
                  >
                    View on NASA NTRS
                    <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                  </a>
                )}
                {doc.pdf_url && (
                  <a
                    href={doc.pdf_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-instrument-blue hover:underline"
                  >
                    Download PDF
                    <Download className="w-3.5 h-3.5" aria-hidden="true" />
                  </a>
                )}
              </div>
            </header>

            <hr className="my-8 border-gray-200" />

            <div
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: doc.body }}
            />

            {related.length > 0 && (
              <>
                <hr className="my-10 border-gray-200" />
                <section>
                  <h2 className="font-heading text-xl font-semibold flex items-center gap-2 mb-5">
                    <BookOpen className="w-5 h-5 text-text-secondary" aria-hidden="true" />
                    Related {doc.program} Documents
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {related.map((rel) => (
                      <Link
                        key={rel.slug}
                        href={`/docs/${rel.slug}`}
                        className="group block rounded-lg border border-gray-200 p-4 hover:border-instrument-blue/40 hover:shadow-sm transition-all"
                      >
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold font-heading mb-2 ${getProgramBadgeStyle(rel.program)}`}
                        >
                          {rel.program}
                        </span>
                        <h3 className="font-heading text-sm font-semibold text-text-primary group-hover:text-instrument-blue transition-colors line-clamp-2 leading-snug">
                          {rel.title}
                        </h3>
                        <p className="mt-1.5 text-xs text-text-secondary line-clamp-2">
                          {rel.excerpt}
                        </p>
                        <div className="mt-2 flex items-center gap-2 text-[11px] text-text-secondary font-mono">
                          {rel.year > 0 && <span>{rel.year}</span>}
                          {rel.category && (
                            <>
                              <span className="text-gray-300">&middot;</span>
                              <span>{rel.category}</span>
                            </>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              </>
            )}

            {(prev || next) && (
              <nav className="mt-12 pt-8 border-t border-gray-200 flex justify-between gap-4">
                {prev ? (
                  <Link
                    href={`/docs/${prev.slug}`}
                    className="group flex items-start gap-2 max-w-[45%] text-left"
                  >
                    <ChevronLeft className="w-5 h-5 mt-0.5 text-text-secondary group-hover:text-instrument-blue transition-colors shrink-0" aria-hidden="true" />
                    <div>
                      <span className="text-xs text-text-secondary">
                        Previous
                      </span>
                      <span className="block text-sm font-heading font-medium text-text-primary group-hover:text-instrument-blue transition-colors line-clamp-2">
                        {prev.title}
                      </span>
                    </div>
                  </Link>
                ) : (
                  <div />
                )}
                {next ? (
                  <Link
                    href={`/docs/${next.slug}`}
                    className="group flex items-start gap-2 max-w-[45%] text-right ml-auto"
                  >
                    <div>
                      <span className="text-xs text-text-secondary">Next</span>
                      <span className="block text-sm font-heading font-medium text-text-primary group-hover:text-instrument-blue transition-colors line-clamp-2">
                        {next.title}
                      </span>
                    </div>
                    <ChevronRight className="w-5 h-5 mt-0.5 text-text-secondary group-hover:text-instrument-blue transition-colors shrink-0" aria-hidden="true" />
                  </Link>
                ) : (
                  <div />
                )}
              </nav>
            )}
          </article>

          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <TableOfContents headings={headings} />
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
