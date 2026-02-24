import { config } from 'dotenv';
config({ path: '.env.local' });

import { getAllDocuments } from "../src/lib/content";
import {
  getAdminClient,
  COLLECTION_NAME,
  documentSchema,
} from "../src/lib/typesense";
import type { DocumentFull } from "../src/lib/types";


const BATCH_SIZE = 40;

interface TypesenseRecord {
  id: string;
  title: string;
  slug: string;
  body: string;
  excerpt: string;
  program: string;
  category: string;
  tags: string[];
  year: number;
  mission?: string;
  authors: string[];
  center?: string;
  ntrs_id?: number;
  word_count: number;
}

function toTypesenseRecord(doc: DocumentFull): TypesenseRecord {
  //strip HTML so typesense indexes plain text
  const plainBody = doc.body.replace(/<[^>]*>/g, "");

  const record: TypesenseRecord = {
    id: doc.slug,
    title: doc.title,
    slug: doc.slug,
    body: plainBody,
    excerpt: doc.excerpt,
    program: doc.program || "Unknown",
    category: doc.category || "Technical Document",
    tags: doc.tags.length > 0 ? doc.tags : ["Untagged"],
    year: doc.year || 2000,
    authors: doc.authors.length > 0 ? doc.authors : ["Unknown"],
    word_count: doc.word_count,
  };

  if (doc.mission) record.mission = doc.mission;
  if (doc.center) record.center = doc.center;
  if (doc.ntrs_id) record.ntrs_id = doc.ntrs_id;

  return record;
}

async function main() {
  console.log("=== SearchLens — Typesense Indexing ===\n");

  const docs = getAllDocuments();
  if (docs.length === 0) {
    console.error(
      "No documents found in content/. Run `npm run fetch-data` first."
    );
    process.exit(1);
  }
  console.log(`Found ${docs.length} documents in content/\n`);

  const client = getAdminClient();

  //drop existing collection and recreate
  try {
    await client.collections(COLLECTION_NAME).delete();
    console.log(`Dropped existing '${COLLECTION_NAME}' collection`);
  } catch (err: unknown) {
    const error = err as { httpStatus?: number };
    if (error.httpStatus === 404) {
      console.log(`Collection '${COLLECTION_NAME}' does not exist yet`);
    } else {
      throw err;
    }
  }

  await client.collections().create(documentSchema);
  console.log(`Created '${COLLECTION_NAME}' collection with schema\n`);

  const records = docs.map(toTypesenseRecord);

  const totalBatches = Math.ceil(records.length / BATCH_SIZE);
  console.log(
    `Indexing ${records.length} documents in ${totalBatches} batches...\n`
  );

  let indexed = 0;
  let errors = 0;

  for (let i = 0; i < totalBatches; i++) {
    const batch = records.slice(i * BATCH_SIZE, (i + 1) * BATCH_SIZE);

    try {
      const results = await client
        .collections(COLLECTION_NAME)
        .documents()
        .import(batch, { action: "upsert" });

      let batchErrors = 0;
      for (const result of results) {
        if (!result.success) {
          batchErrors++;
          console.error(
            `  Error indexing "${(result as { document?: string }).document ?? "unknown"}": ${result.error}`
          );
        }
      }

      indexed += batch.length - batchErrors;
      errors += batchErrors;
    } catch (err) {
      console.error(`  Batch ${i + 1}/${totalBatches} failed:`, err);
      errors += batch.length;
    }

    console.log(
      `  Batch ${i + 1}/${totalBatches} indexed (${batch.length} docs)`
    );
  }

  console.log("\n=== Indexing Complete ===");
  console.log(`Successfully indexed ${indexed} documents`);
  if (errors > 0) {
    console.warn(`${errors} documents failed to index`);
  }

  const collection = await client.collections(COLLECTION_NAME).retrieve();
  console.log(
    `Collection '${COLLECTION_NAME}' now has ${collection.num_documents} documents`
  );
}

main().catch((err) => {
  console.error("\nFatal error during indexing:", err);
  process.exit(1);
});
