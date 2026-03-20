import Link from "next/link";
import { Telescope, ExternalLink } from "lucide-react";
import { getDocumentCount } from "@/lib/content";

export default function SiteFooter() {
  const docCount = getDocumentCount();

  return (
    <footer className="hero-starfield border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Link href="/" className="inline-flex items-center gap-2 group">
              <Telescope className="w-5 h-5 text-nasa-orange" aria-hidden="true" />
              <span className="font-heading font-bold text-lg text-white">
                SearchLens
              </span>
            </Link>
            <p className="mt-2 text-sm text-gray-400 max-w-xs leading-relaxed">
              Instant full-text search across{" "}
              <span className="text-gray-300 font-medium tabular-nums">
                {docCount.toLocaleString()}
              </span>{" "}
              NASA technical documents.
            </p>
          </div>

          <nav aria-label="Footer" className="flex gap-6 text-sm">
            <Link
              href="/search"
              className="text-gray-400 transition-colors hover:text-white"
            >
              Browse
            </Link>
            <a
              href="https://ntrs.nasa.gov"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-gray-400 transition-colors hover:text-white"
            >
              NASA NTRS
              <ExternalLink className="w-3 h-3" aria-hidden="true" />
            </a>
          </nav>
        </div>

        <div className="mt-8 pt-6 border-t border-white/10 text-xs text-gray-400">
          NASA content is public domain. SearchLens is not affiliated with or
          endorsed by NASA.
        </div>
      </div>
    </footer>
  );
}
