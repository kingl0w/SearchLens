import { Client } from "typesense";
import type { CollectionCreateSchema } from "typesense/lib/Typesense/Collections";

export const COLLECTION_NAME = "documents";

export const documentSchema: CollectionCreateSchema = {
  name: COLLECTION_NAME,
  fields: [
    { name: "title", type: "string" },
    { name: "slug", type: "string" },
    { name: "body", type: "string" },
    { name: "excerpt", type: "string" },
    { name: "program", type: "string", facet: true },
    { name: "category", type: "string", facet: true },
    { name: "tags", type: "string[]", facet: true },
    { name: "year", type: "int32", facet: true },
    { name: "mission", type: "string", optional: true },
    { name: "authors", type: "string[]", facet: true },
    { name: "center", type: "string", facet: true, optional: true },
    { name: "ntrs_id", type: "int32", optional: true },
    { name: "word_count", type: "int32" },
  ],
  default_sorting_field: "year",
};

// server-side only — used by index script and API route
export function getAdminClient(): Client {
  const host = process.env.TYPESENSE_HOST;
  const apiKey = process.env.TYPESENSE_ADMIN_API_KEY ?? process.env.TYPESENSE_API_KEY;

  if (!host || !apiKey) {
    throw new Error(
      "Missing TYPESENSE_HOST or TYPESENSE_ADMIN_API_KEY env vars."
    );
  }

  return new Client({
    nodes: [
      {
        host,
        port: Number(process.env.TYPESENSE_PORT ?? 8108),
        protocol: process.env.TYPESENSE_PROTOCOL ?? "http",
      },
    ],
    apiKey,
    connectionTimeoutSeconds: 5,
  });
}
