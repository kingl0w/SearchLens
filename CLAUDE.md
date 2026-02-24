# SearchLens — NASA Mission Document Search Engine

A statically generated search engine over NASA mission reports and documents, built with Next.js 15, TypeScript, Tailwind CSS, and Typesense. Demonstrates build-time indexing, instant full-text search with faceted filtering, and SSG document pages. All NASA content is public domain.

## Tech Stack

### Core Framework
- **Next.js 15** (App Router) — Static export (`output: 'export'`)
- **TypeScript** — Strict mode, no `any` types
- **Tailwind CSS v4** + custom design system — No component libraries
- **Lucide React** — Icons

### Search
- **Typesense** — Search engine (self-hosted or Typesense Cloud)
- **typesense-js** — Official JS client
- Build-time indexing pipeline via `scripts/index-content.ts`
- Client-side search via Typesense search-only API key

### Content
- **Markdown files** in `content/` directory with YAML frontmatter
- **gray-matter** — Frontmatter parsing
- **marked** — Markdown to HTML conversion
- Content corpus: NASA mission reports, summaries, and technical documents (public domain via nasa.gov)

### Deployment
- **Vercel** — Frontend hosting (static export)
- **Typesense Cloud** or **Self-hosted Docker** — Search backend

---

## Architecture

### Data Flow

```
Data Pipeline (one-time or on-demand):
  NTRS API → scripts/fetch-nasa-data.ts → content/*.md (markdown with frontmatter)

Build Time:
  content/*.md → scripts/index-content.ts → Typesense collection (upsert)
  content/*.md → generateStaticParams() → /docs/[slug]/page.tsx (static HTML)

Runtime:
  User types → SearchBox (client) → Typesense API (search-only key) → Results
  User clicks result → /docs/[slug] (pre-rendered static page)
```

### Key Architectural Decisions

1. **Real NASA data from NTRS API**: Content is sourced from NASA's public Technical Reports Server API. A fetch script pulls citations with metadata and abstracts (or full text when available), then writes them as markdown files.
2. **Build-time indexing**: Content is indexed to Typesense during `npm run index` (pre-build step). No runtime indexing.
3. **Static export**: All document pages pre-rendered. Zero server-side rendering at runtime.
4. **Client-side search**: Search queries go directly from browser to Typesense (using search-only API key). No Next.js API routes needed.
5. **Faceted filtering**: Programs, categories, authors, centers, and years are Typesense facet fields, filterable in the UI.

---

## Project Structure

```
searchlens/
├── CLAUDE.md
├── content/                        # Markdown document corpus
│   ├── document-1.md
│   ├── document-2.md
│   └── ...
├── scripts/
│   ├── fetch-nasa-data.ts         # Fetches real data from NTRS API → content/*.md
│   └── index-content.ts           # Build-time Typesense indexing
├── src/
│   ├── app/
│   │   ├── layout.tsx             # Root layout, metadata
│   │   ├── page.tsx               # Homepage with featured search
│   │   ├── globals.css            # Tailwind + custom styles
│   │   ├── sitemap.ts             # Auto-generated sitemap
│   │   ├── search/
│   │   │   └── page.tsx           # Full search experience
│   │   └── docs/
│   │       └── [slug]/
│   │           └── page.tsx       # Document detail page (SSG)
│   ├── components/
│   │   ├── SearchBox.tsx          # Search input with instant results
│   │   ├── SearchResults.tsx      # Result cards with highlights
│   │   ├── FacetFilters.tsx       # Sidebar faceted filtering
│   │   ├── Pagination.tsx         # Search result pagination
│   │   ├── SiteHeader.tsx         # Global navigation
│   │   └── DocumentCard.tsx       # Reusable document preview card
│   ├── lib/
│   │   ├── typesense.ts           # Typesense client configuration
│   │   ├── content.ts             # Content loading from markdown
│   │   └── types.ts               # Shared TypeScript types
│   └── hooks/
│       └── useSearch.ts           # Custom hook for search state
├── .env.local.example
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.js
├── next.config.js
└── README.md
```

---

## Typesense Schema

```typescript
{
  name: 'documents',
  fields: [
    { name: 'title', type: 'string' },
    { name: 'slug', type: 'string' },
    { name: 'body', type: 'string' },
    { name: 'excerpt', type: 'string' },
    { name: 'program', type: 'string', facet: true },        // Apollo, Space Shuttle, Mars Exploration, Space Telescopes, Deep Space, Space Station, Artemis, Earth Science, Aeronautics, Propulsion & Technology
    { name: 'category', type: 'string', facet: true },        // Technical Report, Conference Paper, etc. (from NTRS stiTypeDetails)
    { name: 'tags', type: 'string[]', facet: true },
    { name: 'year', type: 'int32', facet: true },
    { name: 'mission', type: 'string', optional: true },      // Apollo 11, STS-1, Curiosity, etc.
    { name: 'authors', type: 'string[]', facet: true },        // Author names from NTRS
    { name: 'center', type: 'string', facet: true, optional: true },  // NASA center (Ames, JPL, etc.)
    { name: 'ntrs_id', type: 'int32', optional: true },       // Original NTRS citation ID
    { name: 'word_count', type: 'int32' },
  ],
  default_sorting_field: 'year'
}
```

---

## Environment Variables

```
TYPESENSE_HOST=xxx.a1.typesense.net    # or localhost for self-hosted
TYPESENSE_PORT=443                      # 8108 for self-hosted
TYPESENSE_PROTOCOL=https                # http for self-hosted
TYPESENSE_ADMIN_API_KEY=xxx             # Full access (indexing only, never expose)
NEXT_PUBLIC_TYPESENSE_SEARCH_KEY=xxx    # Search-only key (safe for client)
NEXT_PUBLIC_TYPESENSE_HOST=xxx          # Public host for client-side search
NEXT_PUBLIC_TYPESENSE_PORT=443
NEXT_PUBLIC_TYPESENSE_PROTOCOL=https
```

---

## Design System

### Aesthetic Direction
Clean, technical, authoritative. Think NASA.gov meets Stripe docs — precision engineering aesthetic. Dark header/sidebar evoking deep space, bright content area for readability, accent colors pulled from mission patches.

### Colors
- Background: `#fafafa` (content), `#0a0e1a` (sidebar/header — deep space)
- Primary accent: `#e05230` (NASA orange/red — inspired by mission patches)
- Secondary accent: `#2563eb` (instrument blue — data/technical elements)
- Text: `#111827` (primary), `#6b7280` (secondary)
- Search highlight: `#fef08a` (yellow-200 background on matched text)
- Category badges: use distinct colors per program (Apollo gold, Shuttle silver, Mars red, Telescopes purple, Deep Space teal, Station blue, Artemis orange, Earth green, Aeronautics slate, Propulsion amber)

### Typography
- Headings: Space Grotesk — geometric, technical feel
- Body: DM Sans for UI, Source Serif 4 for document reading
- Monospace: JetBrains Mono for mission IDs, dates, technical data

### Key UI Patterns
- Search input prominently centered on homepage with dark space-themed hero
- Search results show highlighted matching text snippets with color-coded program badges
- Facet filters in collapsible sidebar on search page (program, category, tags, year)
- Document pages have clean reading layout with mission metadata header
- Program badges are consistently color-coded across the entire app
- Responsive: sidebar collapses to top filters on mobile

---

## Code Standards

- All components use TypeScript with explicit prop types
- No `any` types — use proper generics and utility types
- Custom hooks for complex state (useSearch, useFacets)
- Debounced search input (300ms)
- Error boundaries around search components
- Loading skeletons for search results
- Accessible: ARIA labels, keyboard navigation, focus management
- All content pages have unique metadata via generateMetadata
