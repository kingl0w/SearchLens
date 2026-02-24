import type { MetadataRoute } from "next";
import { getDocumentSlugs } from "@/lib/content";

export const dynamic = "force-static";

const BASE_URL = "https://searchlens.example.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const slugs = getDocumentSlugs();
  const now = new Date();

  const docPages: MetadataRoute.Sitemap = slugs.map((slug) => ({
    url: `${BASE_URL}/docs/${slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/search`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...docPages,
  ];
}
