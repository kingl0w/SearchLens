"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Search, Telescope } from "lucide-react";

export default function SiteHeader() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-colors duration-200 ${
        isHome
          ? "bg-deep-space/90 backdrop-blur-md border-b border-white/5"
          : "bg-white/90 backdrop-blur-md border-b border-gray-200"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Telescope className="w-5 h-5 text-nasa-orange" aria-hidden="true" />
          <span
            className={`font-heading font-bold text-lg ${
              isHome ? "text-white" : "text-text-primary"
            }`}
          >
            SearchLens
          </span>
        </Link>

        {!isHome && (
          <form action="/search" role="search" aria-label="Search documents" className="flex-1 max-w-lg mx-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary pointer-events-none" aria-hidden="true" />
              <input
                type="search"
                name="q"
                placeholder="Search documents..."
                aria-label="Search documents"
                className="w-full pl-9 pr-4 py-2 text-sm bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-instrument-blue/40 focus:border-instrument-blue transition-shadow text-text-primary placeholder:text-text-secondary"
              />
            </div>
          </form>
        )}

        <Link
          href="/search"
          className={`text-sm font-medium shrink-0 transition-colors ${
            isHome
              ? "text-gray-300 hover:text-white"
              : "text-text-secondary hover:text-text-primary"
          }`}
        >
          Browse Missions
        </Link>
      </nav>
    </header>
  );
}
