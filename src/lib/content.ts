import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";
import type { DocumentFull, DocumentMeta, ProgramStats, TocHeading } from "./types";

const contentDir = path.join(process.cwd(), "content");

//generate heading IDs for TOC anchor links
marked.use({
  renderer: {
    heading({ text, depth }: { text: string; depth: number }) {
      const id = text
        .replace(/<[^>]*>/g, "")
        .toLowerCase()
        .replace(/[^\w]+/g, "-")
        .replace(/^-|-$/g, "");
      return `<h${depth} id="${id}">${text}</h${depth}>\n`;
    },
  },
});

export function getAllSlugs(): string[] {
  if (!fs.existsSync(contentDir)) return [];
  return fs
    .readdirSync(contentDir)
    .filter((file) => file.endsWith(".md"))
    .map((file) => file.replace(/\.md$/, ""));
}

export const getDocumentSlugs = getAllSlugs;

export function getDocumentCount(): number {
  return getAllSlugs().length;
}

export function getDocumentBySlug(slug: string): DocumentFull | null {
  const filePath = path.join(contentDir, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;

  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContent);

  const body = marked(content) as string;
  const wordCount = content.split(/\s+/).filter(Boolean).length;

  return {
    title: data.title ?? slug,
    slug: data.slug ?? slug,
    body,
    excerpt: data.excerpt ?? content.slice(0, 200),
    program: data.program ?? "",
    category: data.category ?? "",
    tags: data.tags ?? [],
    year: data.year ?? 0,
    mission: data.mission,
    authors: data.authors ?? [],
    center: data.center,
    ntrs_id: data.ntrs_id,
    pdf_url: data.pdf_url,
    word_count: wordCount,
  };
}

//frontmatter only, no body rendering
export function getDocumentMetaBySlug(slug: string): DocumentMeta | null {
  const filePath = path.join(contentDir, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;

  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data } = matter(fileContent);

  return {
    title: data.title ?? slug,
    slug: data.slug ?? slug,
    excerpt: data.excerpt ?? "",
    program: data.program ?? "",
    category: data.category ?? "",
    tags: data.tags ?? [],
    year: data.year ?? 0,
    mission: data.mission,
    authors: data.authors ?? [],
    center: data.center,
    ntrs_id: data.ntrs_id,
    pdf_url: data.pdf_url,
  };
}

export function getAllDocuments(): DocumentFull[] {
  return getAllSlugs()
    .map(getDocumentBySlug)
    .filter((doc): doc is DocumentFull => doc !== null);
}

export function getDocumentsByProgram(program: string): DocumentFull[] {
  return getAllDocuments().filter((doc) => doc.program === program);
}

export function extractHeadings(html: string): TocHeading[] {
  const regex = /<h([23])\s+id="([^"]+)"[^>]*>(.*?)<\/h[23]>/gi;
  const headings: TocHeading[] = [];
  let match;
  while ((match = regex.exec(html)) !== null) {
    headings.push({
      level: parseInt(match[1]),
      id: match[2],
      text: match[3].replace(/<[^>]*>/g, ""),
    });
  }
  return headings;
}

export function getRelatedDocuments(
  doc: DocumentFull,
  count: number = 3
): DocumentMeta[] {
  const slugs = getAllSlugs().sort();
  const related: DocumentMeta[] = [];
  const seen = new Set<string>([doc.slug]);

  for (const slug of slugs) {
    if (related.length >= count) break;
    const meta = getDocumentMetaBySlug(slug);
    if (!meta || meta.program !== doc.program || seen.has(meta.slug)) continue;
    seen.add(meta.slug);
    related.push(meta);
  }

  return related;
}

export function getHomePageData(): {
  totalDocuments: number;
  totalWords: number;
  programs: Record<string, ProgramStats>;
  centersCount: number;
  minYear: number;
  maxYear: number;
  featured: DocumentMeta[];
} {
  const slugs = getAllSlugs();
  let totalWords = 0;
  let minYear = Infinity;
  let maxYear = -Infinity;
  const programStats: Record<string, ProgramStats> = {};
  const centers = new Set<string>();
  const docsByProgram: Record<string, DocumentMeta[]> = {};

  for (const slug of slugs) {
    const filePath = path.join(contentDir, `${slug}.md`);
    if (!fs.existsSync(filePath)) continue;
    const raw = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(raw);

    totalWords += content.split(/\s+/).filter(Boolean).length;

    const year: number = data.year ?? 0;
    const program: string = data.program ?? "";
    const center: string | undefined = data.center;

    if (year > 0) {
      minYear = Math.min(minYear, year);
      maxYear = Math.max(maxYear, year);
    }

    if (program) {
      if (!programStats[program]) {
        programStats[program] = { count: 0, minYear: Infinity, maxYear: -Infinity };
      }
      programStats[program].count++;
      if (year > 0) {
        programStats[program].minYear = Math.min(programStats[program].minYear, year);
        programStats[program].maxYear = Math.max(programStats[program].maxYear, year);
      }

      if (!docsByProgram[program]) docsByProgram[program] = [];
      docsByProgram[program].push({
        title: data.title ?? slug,
        slug: data.slug ?? slug,
        excerpt: data.excerpt ?? "",
        program,
        category: data.category ?? "",
        tags: data.tags ?? [],
        year,
        mission: data.mission,
        authors: data.authors ?? [],
        center,
        ntrs_id: data.ntrs_id,
        pdf_url: data.pdf_url,
      });
    }

    if (center) centers.add(center);
  }

  //one featured doc from each of the 6 largest programs
  const topPrograms = Object.entries(programStats)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 6)
    .map(([name]) => name);

  const featured: DocumentMeta[] = [];
  const featuredSlugs = new Set<string>();
  for (const program of topPrograms) {
    const candidates = docsByProgram[program] ?? [];
    const best =
      candidates.find((d) => d.mission && d.excerpt.length > 50 && !featuredSlugs.has(d.slug)) ??
      candidates.find((d) => !featuredSlugs.has(d.slug));
    if (best) {
      featuredSlugs.add(best.slug);
      featured.push(best);
    }
  }

  return {
    totalDocuments: slugs.length,
    totalWords,
    programs: programStats,
    centersCount: centers.size,
    minYear: minYear === Infinity ? 0 : minYear,
    maxYear: maxYear === -Infinity ? 0 : maxYear,
    featured,
  };
}

export function getAdjacentDocuments(
  currentSlug: string
): { prev: DocumentMeta | null; next: DocumentMeta | null } {
  const slugs = getAllSlugs().sort();
  const index = slugs.indexOf(currentSlug);

  const prevSlug = index > 0 ? slugs[index - 1] : null;
  const nextSlug = index < slugs.length - 1 ? slugs[index + 1] : null;

  return {
    prev: prevSlug ? getDocumentMetaBySlug(prevSlug) : null,
    next: nextSlug ? getDocumentMetaBySlug(nextSlug) : null,
  };
}
