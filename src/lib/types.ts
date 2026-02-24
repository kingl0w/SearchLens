export interface NTRSAuthorAffiliation {
  sequence: number;
  meta: {
    author: { name: string; orcidId?: string };
    organization: { name: string; location?: string };
  };
}

export interface NTRSDownload {
  draft: boolean;
  mimetype: string;
  name: string;
  type: string;
  links: {
    original: string;
    pdf: string;
    fulltext: string;
  };
}

export interface NTRSCenter {
  code: string;
  name: string;
  id: string;
}

export interface NTRSCitation {
  id: number;
  title: string;
  abstract: string;
  stiType: string;
  stiTypeDetails: string;
  center: NTRSCenter;
  subjectCategories: string[];
  keywords: string[] | null;
  authorAffiliations: NTRSAuthorAffiliation[];
  downloads: NTRSDownload[];
  downloadsAvailable: boolean;
  created: string;
  distributionDate: string;
  onlyAbstract: boolean;
  disseminated: string;
}

export interface NTRSSearchResponse {
  stats: { took: number; total: number; estimate: boolean; maxScore: number };
  results: NTRSCitation[];
}

export interface DocumentMeta {
  title: string;
  slug: string;
  program: string;
  category: string;
  mission?: string;
  tags: string[];
  year: number;
  excerpt: string;
  authors: string[];
  center?: string;
  ntrs_id?: number;
  pdf_url?: string;
}

export interface DocumentFull extends DocumentMeta {
  body: string;
  word_count: number;
}

export interface FacetValue {
  value: string;
  count: number;
}

export interface FacetGroup {
  field_name: string;
  counts: FacetValue[];
}

export interface SearchHit {
  document: DocumentFull;
  highlights: {
    field: string;
    snippet: string;
    matched_tokens: string[];
  }[];
}

export interface SearchResult {
  found: number;
  hits: SearchHit[];
  facet_counts?: FacetGroup[];
  page: number;
  out_of: number;
}

export interface SearchState {
  query: string;
  results: SearchResult | null;
  facets: FacetGroup[];
  loading: boolean;
  page: number;
}

export interface SearchParams {
  query: string;
  page?: number;
  per_page?: number;
  filter_by?: string;
  sort_by?: string;
  facet_by?: string;
}

export interface ProgramStats {
  count: number;
  minYear: number;
  maxYear: number;
}

export interface TocHeading {
  id: string;
  text: string;
  level: number;
}
