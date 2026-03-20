"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Telescope } from "lucide-react";
import CommandSearch from "@/components/CommandSearch";

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

        {!isHome && <CommandSearch />}

        <Link
          href="/search"
          className={`text-sm font-medium shrink-0 transition-colors ${
            isHome
              ? "text-gray-300 hover:text-white"
              : "text-text-secondary hover:text-text-primary"
          }`}
        >
          Browse
        </Link>
      </nav>
    </header>
  );
}
