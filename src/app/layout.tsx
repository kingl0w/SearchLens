import type { Metadata } from "next";
import {
  DM_Sans,
  Source_Serif_4,
  Space_Grotesk,
  JetBrains_Mono,
} from "next/font/google";
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
  title: "SearchLens",
  description:
    "Search and explore NASA mission reports, technical briefs, and historical documents. All NASA content is public domain.",
  metadataBase: new URL("https://searchlens.example.com"),
  icons: {
    icon: "/favicon.svg",
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
      </body>
    </html>
  );
}
