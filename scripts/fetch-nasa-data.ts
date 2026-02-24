import fs from "fs";
import path from "path";
import type { NTRSCitation, NTRSSearchResponse } from "../src/lib/types";

const NTRS_SEARCH_URL = "https://ntrs.nasa.gov/api/citations/search";
const NTRS_BASE = "https://ntrs.nasa.gov/api/citations";
const CONTENT_DIR = path.join(process.cwd(), "content");
const DELAY_MS = 200;
const FULL_TEXT = process.argv.includes("--full-text");

interface QueryGroup {
  program: string;
  queries: { q: string; size: number }[];
}

const QUERY_GROUPS: QueryGroup[] = [
  {
    program: "Apollo",
    queries: [
      { q: "Apollo", size: 100 },
      { q: "Apollo spacecraft systems", size: 100 },
      { q: "lunar module descent", size: 50 },
    ],
  },
  {
    program: "Space Shuttle",
    queries: [
      { q: "Space Shuttle", size: 100 },
      { q: "Space Shuttle thermal protection", size: 100 },
      { q: "shuttle reentry", size: 50 },
    ],
  },
  {
    program: "Mars Exploration",
    queries: [
      { q: "Mars rover", size: 100 },
      { q: "Mars exploration surface", size: 100 },
      { q: "Mars atmosphere landing", size: 50 },
      { q: "Perseverance Ingenuity Mars", size: 50 },
    ],
  },
  {
    program: "Space Telescopes",
    queries: [
      { q: "Hubble Space Telescope", size: 100 },
      { q: "James Webb Space Telescope", size: 100 },
      { q: "Chandra X-ray Observatory", size: 50 },
      { q: "Kepler exoplanet", size: 50 },
    ],
  },
  {
    program: "Deep Space",
    queries: [
      { q: "Voyager spacecraft interstellar", size: 100 },
      { q: "Cassini Saturn mission", size: 100 },
      { q: "New Horizons Pluto", size: 50 },
    ],
  },
  {
    program: "Space Station",
    queries: [
      { q: "International Space Station", size: 100 },
      { q: "ISS crew operations research", size: 100 },
    ],
  },
  {
    program: "Artemis",
    queries: [
      { q: "Artemis lunar", size: 100 },
      { q: "Space Launch System SLS", size: 50 },
      { q: "Orion spacecraft", size: 50 },
    ],
  },
  {
    program: "Earth Science",
    queries: [
      { q: "Earth observation satellite climate", size: 100 },
      { q: "Landsat Earth imaging", size: 50 },
    ],
  },
  {
    program: "Aeronautics",
    queries: [
      { q: "X-plane experimental aircraft", size: 100 },
      { q: "supersonic flight research", size: 50 },
    ],
  },
  {
    program: "Propulsion & Technology",
    queries: [
      { q: "ion propulsion spacecraft", size: 50 },
      { q: "solar electric propulsion", size: 50 },
      { q: "nuclear thermal propulsion", size: 50 },
    ],
  },
];

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}

function extractYear(citation: NTRSCitation): number {
  const dateStr = citation.distributionDate || citation.created;
  if (!dateStr) return 0;
  const match = dateStr.match(/^(\d{4})/);
  return match ? parseInt(match[1], 10) : 0;
}

function extractAuthors(citation: NTRSCitation): string[] {
  if (!citation.authorAffiliations?.length) return [];
  return citation.authorAffiliations
    .sort((a, b) => a.sequence - b.sequence)
    .map((a) => a.meta?.author?.name)
    .filter((name): name is string => Boolean(name));
}

function extractMission(title: string): string | undefined {
  const patterns: [RegExp, string][] = [
    [/\bApollo\s+(\d+)\b/i, "Apollo $1"],
    [/\bSTS-(\d+)\b/i, "STS-$1"],
    [/\bGemini\s+(\w+)\b/i, "Gemini $1"],
    [/\bMercury[\s-](\w+)\b/i, "Mercury $1"],
    [/\bCuriosity\b/i, "Curiosity"],
    [/\bPerseverance\b/i, "Perseverance"],
    [/\bIngenuity\b/i, "Ingenuity"],
    [/\bOpportunity\b/i, "Opportunity"],
    [/\bSpirit\b/i, "Spirit"],
    [/\bVoyager\s*([12])\b/i, "Voyager $1"],
    [/\bCassini\b/i, "Cassini"],
    [/\bNew\s+Horizons\b/i, "New Horizons"],
    [/\bJuno\b/i, "Juno"],
    [/\bOrion\b/i, "Orion"],
    [/\bArtemis\s+(\w+)\b/i, "Artemis $1"],
    [/\bHubble\b/i, "Hubble"],
    [/\bJames\s+Webb\b/i, "James Webb"],
    [/\bJWST\b/i, "JWST"],
    [/\bChandra\b/i, "Chandra"],
    [/\bKepler\b/i, "Kepler"],
    [/\bLandsat\s*(\d*)\b/i, "Landsat$1"],
  ];
  for (const [re, replacement] of patterns) {
    const match = title.match(re);
    if (match) return title.replace(re, replacement).match(re) ? replacement.replace(/\$(\d)/g, (_, i) => match[parseInt(i)] || "") : undefined;
  }
  return undefined;
}

function buildTags(citation: NTRSCitation): string[] {
  const tags = new Set<string>();
  if (citation.subjectCategories) {
    for (const cat of citation.subjectCategories) tags.add(cat);
  }
  if (citation.keywords) {
    for (const kw of citation.keywords) tags.add(kw);
  }
  return [...tags].slice(0, 15);
}

function yamlStr(s: string): string {
  const cleaned = s
    .replace(/[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/g, "")
    .replace(/\n/g, " ")
    .replace(/\r/g, "")
    .trim();
  return `"${cleaned.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
}

function yamlStrArray(arr: string[]): string {
  if (arr.length === 0) return "[]";
  return `[${arr.map((s) => yamlStr(s)).join(", ")}]`;
}

async function searchNTRS(
  query: string,
  size: number
): Promise<NTRSCitation[]> {
  const body = JSON.stringify({
    q: query,
    page: { size },
    disseminated: "DOCUMENT_AND_METADATA",
  });

  const res = await fetch(NTRS_SEARCH_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  });

  if (!res.ok) {
    console.error(`  API error for "${query}": ${res.status} ${res.statusText}`);
    return [];
  }

  const data = (await res.json()) as NTRSSearchResponse;
  return data.results ?? [];
}

async function fetchFullText(citation: NTRSCitation): Promise<string | null> {
  if (!citation.downloads?.length) return null;

  const dl = citation.downloads.find((d) => d.links?.fulltext);
  if (!dl) return null;

  try {
    const url = `${NTRS_BASE.replace("/api/citations", "")}${dl.links.fulltext}`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const text = await res.text();
    //only use if substantially longer than the abstract
    if (text.length > (citation.abstract?.length ?? 0) * 1.5) {
      return text.slice(0, 50_000);
    }
    return null;
  } catch {
    return null;
  }
}

//strip control characters from text (preserves newlines + tabs)
function sanitize(s: string): string {
  return s.replace(/[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/g, "");
}

function citationToMarkdown(
  citation: NTRSCitation,
  program: string,
  bodyText: string
): string {
  const slug = slugify(citation.title);
  const year = extractYear(citation);
  const authors = extractAuthors(citation);
  const mission = extractMission(citation.title);
  const tags = buildTags(citation);
  const category = citation.stiTypeDetails || citation.stiType || "Technical Document";
  const center = citation.center?.name;
  const excerpt = (citation.abstract || bodyText).slice(0, 200).replace(/\n/g, " ").trim();
  const pdfUrl =
    citation.downloads?.find((d) => d.links?.pdf)?.links?.pdf
      ? `https://ntrs.nasa.gov${citation.downloads.find((d) => d.links?.pdf)!.links.pdf}`
      : undefined;

  const frontmatter = [
    "---",
    `title: ${yamlStr(citation.title)}`,
    `slug: ${yamlStr(slug)}`,
    `program: ${yamlStr(program)}`,
    `category: ${yamlStr(category)}`,
    ...(mission ? [`mission: ${yamlStr(mission)}`] : []),
    `tags: ${yamlStrArray(tags)}`,
    `year: ${year}`,
    `excerpt: ${yamlStr(excerpt)}`,
    `authors: ${yamlStrArray(authors)}`,
    ...(center ? [`center: ${yamlStr(center)}`] : []),
    `ntrs_id: ${citation.id}`,
    ...(pdfUrl ? [`pdf_url: ${yamlStr(pdfUrl)}`] : []),
    "---",
  ].join("\n");

  return `${frontmatter}\n\n${sanitize(bodyText).trim()}\n`;
}

async function main() {
  console.log("=== SearchLens — NTRS Data Fetch ===\n");
  if (FULL_TEXT) console.log("Full-text download ENABLED (slower)\n");

  if (!fs.existsSync(CONTENT_DIR)) fs.mkdirSync(CONTENT_DIR, { recursive: true });
  const examplePath = path.join(CONTENT_DIR, "example-document.md");
  if (fs.existsSync(examplePath)) fs.unlinkSync(examplePath);

  //deduplicate across queries by NTRS ID and slug
  const seenIds = new Set<number>();
  const seenSlugs = new Set<string>();
  const programCounts: Record<string, number> = {};

  for (const group of QUERY_GROUPS) {
    console.log(`\nFetching ${group.program} documents...`);
    let groupCount = 0;

    for (const query of group.queries) {
      await sleep(DELAY_MS);
      const results = await searchNTRS(query.q, query.size);
      console.log(`  "${query.q}" → ${results.length} results`);

      for (const citation of results) {
        if (seenIds.has(citation.id)) continue;
        seenIds.add(citation.id);

        const abstract = citation.abstract ?? "";
        if (abstract.length < 100) continue;

        let slug = slugify(citation.title);
        if (!slug) continue;
        if (seenSlugs.has(slug)) {
          slug = `${slug}-${citation.id}`;
        }
        seenSlugs.add(slug);

        let bodyText = abstract;
        if (FULL_TEXT) {
          await sleep(DELAY_MS);
          const fullText = await fetchFullText(citation);
          if (fullText) bodyText = fullText;
        }

        const md = citationToMarkdown(citation, group.program, bodyText);
        fs.writeFileSync(path.join(CONTENT_DIR, `${slug}.md`), md, "utf-8");
        groupCount++;
      }
    }

    programCounts[group.program] = groupCount;
    console.log(`  → ${groupCount} unique documents saved for ${group.program}`);
  }

  console.log("\n=== Summary ===");
  console.log("-".repeat(45));
  let total = 0;
  for (const [program, count] of Object.entries(programCounts)) {
    console.log(`  ${program.padEnd(25)} ${String(count).padStart(5)}`);
    total += count;
  }
  console.log("-".repeat(45));
  console.log(`  ${"TOTAL".padEnd(25)} ${String(total).padStart(5)}`);
  console.log(`\nTotal: ${total} unique documents saved to content/`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
