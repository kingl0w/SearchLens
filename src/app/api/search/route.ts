import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const params = searchParams.toString();

  const host = process.env.TYPESENSE_HOST!;
  const port = process.env.TYPESENSE_PORT ?? "8108";
  const protocol = process.env.TYPESENSE_PROTOCOL ?? "http";
  const apiKey = process.env.TYPESENSE_SEARCH_KEY!;

  const url = `${protocol}://${host}:${port}/collections/documents/documents/search?${params}`;

  try {
    const res = await fetch(url, {
      headers: { "X-TYPESENSE-API-KEY": apiKey },
      next: { revalidate: 0 },
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("Typesense proxy error:", err);
    return NextResponse.json({ error: "Search unavailable" }, { status: 503 });
  }
}
