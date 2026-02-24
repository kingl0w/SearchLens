import type { Metadata } from "next";
import {
  DM_Sans,
  Source_Serif_4,
  Space_Grotesk,
  JetBrains_Mono,
} from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import SiteHeader from "@/components/SiteHeader";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-reading",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://searchlens.space"),
  title: {
    default: "SearchLens — NASA Document Search",
    template: "%s | SearchLens",
  },
  description:
    "Search and explore 1,600+ NASA mission reports, technical briefs, and historical documents with instant full-text search spanning 60+ years of space exploration.",
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "SearchLens — NASA Document Search",
    description:
      "Search and explore 1,600+ NASA mission reports, technical briefs, and historical documents with instant full-text search spanning 60+ years of space exploration.",
    url: "https://searchlens.space",
    siteName: "SearchLens",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SearchLens — NASA Document Search",
    description:
      "Search and explore 1,600+ NASA mission reports, technical briefs, and historical documents with instant full-text search spanning 60+ years of space exploration.",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://searchlens.space",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "SearchLens",
  url: "https://searchlens.space",
  description:
    "Search and explore NASA mission reports, technical briefs, and historical documents.",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://searchlens.space/search?q={search_term_string}",
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${sourceSerif.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
    >
      <body className="font-body bg-background text-text-primary antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-instrument-blue focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white focus:outline-none"
        >
          Skip to main content
        </a>
        <SiteHeader />
        <main id="main-content" className="pt-16">{children}</main>
        <footer className="border-t border-gray-200 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-text-secondary">
            <p>Built with ❤️</p>
            <p>NASA content is public domain</p>
          </div>
        </footer>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
