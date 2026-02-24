# SearchLens

A statically generated search engine for NASA mission documents. Built with Next.js 15 (App Router, static export), TypeScript, Tailwind CSS v4, and Typesense.

SearchLens indexes 1,795 NASA documents spanning 10 programs -- Apollo, Space Shuttle, Mars Exploration, Space Telescopes, Deep Space, Space Station, Artemis, Earth Science, Aeronautics, and Propulsion & Technology -- and serves them as pre-rendered static pages with instant full-text search and faceted filtering. All NASA content is public domain, sourced from the NASA Technical Reports Server (NTRS).

---

## Architecture

```
Data Pipeline (one-time or on-demand):
  NASA NTRS API --> scripts/fetch-nasa-data.ts --> content/*.md (markdown with frontmatter)

Build Time:
  content/*.md --> scripts/index-content.ts --> Typesense collection (batch upsert)
  content/*.md --> generateStaticParams() --> /docs/[slug]/page.tsx (static HTML)

Runtime:
  User types --> SearchBox (client) --> Typesense API (search-only key) --> Results
  User clicks result --> /docs/[slug] (pre-rendered static page)
```

Key architectural decisions:

1. **Real NASA data from NTRS API** -- Content is sourced from NASA's public Technical Reports Server API. A fetch script pulls citations with metadata and abstracts, then writes them as markdown files with YAML frontmatter.
2. **Build-time indexing** -- Content is indexed to Typesense during `npm run index` (pre-build step). No runtime indexing occurs.
3. **Static export** -- All 1,795 document pages are pre-rendered at build time. Zero server-side rendering at runtime.
4. **Client-side search** -- Search queries go directly from the browser to Typesense using a search-only API key. No Next.js API routes are needed.
5. **Faceted filtering** -- Programs, categories, NASA centers, tags, and years are Typesense facet fields, filterable in the UI.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router, `output: 'export'`) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS v4 + @tailwindcss/typography |
| Search | Typesense (self-hosted or Typesense Cloud) |
| Content | Markdown with YAML frontmatter (gray-matter + marked) |
| Icons | Lucide React |
| Fonts | Space Grotesk, DM Sans, Source Serif 4, JetBrains Mono (Google Fonts) |
| Runtime | React 19 |

---

## Features

- **Instant full-text search** with highlighted matching text snippets
- **Faceted filtering** by program, category, NASA center, tags, and year
- **URL state sync** -- search queries and filters are reflected in the URL for shareable links
- **1,795 statically generated document pages** with reading-optimized layout
- **Table of contents** with scroll tracking on document pages
- **Previous/next document navigation** within programs
- **Related documents** shown on each document page
- **Mobile responsive** with slide-out filter drawer on small screens
- **Loading skeletons** for search results
- **JSON-LD structured data** on document pages
- **Auto-generated sitemap** via `src/app/sitemap.ts`
- **Custom 404 page**
- **Debounced search input** (300ms)
- **Keyboard navigation** and ARIA labels for accessibility

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm
- Typesense instance (self-hosted via Docker or [Typesense Cloud](https://cloud.typesense.org))

### Setup

1. **Clone and install dependencies**

   ```bash
   git clone <repository-url>
   cd SearchLens
   npm install
   ```

2. **Fetch NASA data**

   Pull documents from the NASA Technical Reports Server API. This runs 28 queries across 10 programs, deduplicates results, sanitizes content, and writes markdown files to `content/`.

   ```bash
   npm run fetch-data
   ```

3. **Configure environment variables**

   Copy the example file and fill in your Typesense credentials.

   ```bash
   cp .env.local.example .env.local
   ```

   See the [Environment Variables](#environment-variables) section below for details.

4. **Index content to Typesense**

   Reads all markdown files from `content/`, strips HTML, and batch-upserts documents to Typesense (40 per batch).

   ```bash
   npm run index
   ```

5. **Start the development server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

6. **Build for production**

   ```bash
   npm run build
   ```

   The static export is written to the `out/` directory.

---

## Project Structure

```
searchlens/
├── content/                           # 1,795 Markdown documents with YAML frontmatter
├── scripts/
│   ├── fetch-nasa-data.ts             # NTRS API data fetcher (28 queries, 10 programs)
│   └── index-content.ts               # Build-time Typesense indexing (batch upsert)
├── src/
│   ├── app/
│   │   ├── layout.tsx                 # Root layout, metadata, font loading
│   │   ├── page.tsx                   # Homepage with hero, stats, featured documents
│   │   ├── globals.css                # Tailwind v4 config + design system tokens
│   │   ├── sitemap.ts                 # Auto-generated sitemap
│   │   ├── not-found.tsx              # Custom 404 page
│   │   ├── search/
│   │   │   ├── page.tsx               # Search page (server component wrapper)
│   │   │   ├── SearchPageContent.tsx   # Client-side search with URL state sync
│   │   │   └── loading.tsx            # Search page loading skeleton
│   │   └── docs/
│   │       └── [slug]/
│   │           └── page.tsx           # Document detail page (SSG via generateStaticParams)
│   ├── components/
│   │   ├── SearchBox.tsx              # Search input with debounced instant results
│   │   ├── SearchResults.tsx          # Result cards with highlighted snippets
│   │   ├── FacetFilters.tsx           # Sidebar faceted filtering (collapsible)
│   │   ├── Pagination.tsx             # Search result pagination
│   │   ├── SiteHeader.tsx             # Global navigation header
│   │   ├── DocumentCard.tsx           # Reusable document preview card
│   │   └── TableOfContents.tsx        # Document page TOC with scroll tracking
│   ├── hooks/
│   │   └── useSearch.ts               # Custom hook for search state management
│   └── lib/
│       ├── typesense.ts               # Typesense client configuration
│       ├── content.ts                 # Markdown content loading and parsing
│       ├── types.ts                   # Shared TypeScript types (NTRS, documents, search)
│       └── programs.ts                # Program config (icons, badge styles, colors)
├── .env.local.example                 # Environment variable template
├── package.json
├── tsconfig.json
├── postcss.config.js
└── next.config.js                     # Static export configuration
```

---

## Data Pipeline

### Step 1: Fetch NASA Data

```bash
npm run fetch-data
```

The `scripts/fetch-nasa-data.ts` script:

- Queries the NASA NTRS public API (`https://ntrs.nasa.gov/api/citations`)
- Runs 28 search queries across 10 NASA programs
- Deduplicates citations by NTRS ID
- Extracts metadata: title, authors, abstract, NASA center, publication year, document type
- Sanitizes and normalizes content
- Writes each document as a markdown file with YAML frontmatter to `content/`

### Step 2: Index to Typesense

```bash
npm run index
```

The `scripts/index-content.ts` script:

- Reads all markdown files from `content/`
- Parses frontmatter with gray-matter
- Strips HTML tags from body content
- Creates or updates the Typesense `documents` collection
- Batch-upserts documents (40 per batch)

The indexing step also runs automatically as a prebuild hook (`npm run build` triggers `npm run prebuild`).

---

## Typesense Schema

```typescript
{
  name: 'documents',
  fields: [
    { name: 'title',      type: 'string' },
    { name: 'slug',       type: 'string' },
    { name: 'body',       type: 'string' },
    { name: 'excerpt',    type: 'string' },
    { name: 'program',    type: 'string',   facet: true },
    { name: 'category',   type: 'string',   facet: true },
    { name: 'tags',       type: 'string[]', facet: true },
    { name: 'year',       type: 'int32',    facet: true },
    { name: 'mission',    type: 'string',   optional: true },
    { name: 'authors',    type: 'string[]', facet: true },
    { name: 'center',     type: 'string',   facet: true, optional: true },
    { name: 'ntrs_id',    type: 'int32',    optional: true },
    { name: 'word_count', type: 'int32' },
  ],
  default_sorting_field: 'year'
}
```

---

## Environment Variables

Create a `.env.local` file based on `.env.local.example`:

```bash
# Typesense admin credentials (used for indexing only -- never expose to client)
TYPESENSE_HOST=xxx.a1.typesense.net    # or localhost for self-hosted
TYPESENSE_PORT=443                      # 8108 for self-hosted
TYPESENSE_PROTOCOL=https                # http for self-hosted
TYPESENSE_ADMIN_API_KEY=xxx             # Full access key

# Typesense public credentials (safe for client-side search)
NEXT_PUBLIC_TYPESENSE_SEARCH_KEY=xxx    # Search-only API key
NEXT_PUBLIC_TYPESENSE_HOST=xxx          # Public host
NEXT_PUBLIC_TYPESENSE_PORT=443
NEXT_PUBLIC_TYPESENSE_PROTOCOL=https
```

Variables prefixed with `NEXT_PUBLIC_` are embedded in the client bundle. Only the search-only API key is exposed -- it has read-only access and cannot modify or delete data.

---

## Design System

### Aesthetic

Clean, technical, and authoritative. Dark header and hero evoking deep space, bright content areas for readability, accent colors pulled from NASA mission patches.

### Colors

| Token | Value | Usage |
|-------|-------|-------|
| Content background | `#fafafa` | Page and card backgrounds |
| Deep space | `#0a0e1a` | Header, hero, sidebar |
| NASA orange | `#e05230` | Primary accent, CTAs |
| Instrument blue | `#2563eb` | Links, data elements |
| Primary text | `#111827` | Body text |
| Secondary text | `#6b7280` | Metadata, captions |
| Search highlight | `#fef08a` | Matched text background |

### Program Badge Colors

Each of the 10 programs has a dedicated color used consistently across badges, borders, and icons:

- **Apollo** -- gold
- **Space Shuttle** -- silver/gray
- **Mars Exploration** -- red
- **Space Telescopes** -- purple
- **Deep Space** -- teal
- **Space Station** -- blue
- **Artemis** -- orange
- **Earth Science** -- green
- **Aeronautics** -- slate
- **Propulsion & Technology** -- amber

### Typography

| Role | Font | Usage |
|------|------|-------|
| Headings | Space Grotesk | Geometric, technical feel |
| UI text | DM Sans | Navigation, labels, metadata |
| Document reading | Source Serif 4 | Long-form content |
| Technical data | JetBrains Mono | Mission IDs, dates, code |

---

## Scripts Reference

| Command | Description |
|---------|------------|
| `npm run dev` | Start Next.js development server |
| `npm run build` | Build static export (runs indexing first via prebuild) |
| `npm run start` | Serve the production build locally |
| `npm run lint` | Run Next.js linting |
| `npm run fetch-data` | Fetch documents from NASA NTRS API |
| `npm run index` | Index content to Typesense |

---

## Deployment

### Static Frontend

The Next.js static export (`output: 'export'`) generates a fully static site in the `out/` directory. This can be deployed to any static hosting provider:

- **Vercel** -- Automatic deployment from Git. Vercel detects the Next.js static export configuration.
- **Netlify** -- Set the build command to `npm run build` and the publish directory to `out`.
- **Any static host** -- Upload the `out/` directory.

### Search Backend

Typesense must be running and accessible from client browsers.

**Typesense Cloud** (recommended for production):
- Create a cluster at [cloud.typesense.org](https://cloud.typesense.org)
- Use the provided host, port (443), and API keys in your environment variables

**Self-hosted with Docker**:

```bash
docker run -d \
  -p 8108:8108 \
  -v /tmp/typesense-data:/data \
  typesense/typesense:27.1 \
  --data-dir /data \
  --api-key=your-admin-api-key \
  --enable-cors
```

When self-hosting, set `TYPESENSE_PORT=8108` and `TYPESENSE_PROTOCOL=http` in your environment variables.

---

## License and Credits

All NASA documents included in this project are **public domain**, sourced from the [NASA Technical Reports Server (NTRS)](https://ntrs.nasa.gov). NASA content is not subject to copyright protection in the United States per [NASA Media Usage Guidelines](https://www.nasa.gov/nasa-brand-center/images-and-media/).

Application source code is open source.
