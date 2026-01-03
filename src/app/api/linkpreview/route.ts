import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const apiKey = process.env.LINKPREVIEW_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Missing LINKPREVIEW_API_KEY" },
      { status: 500 }
    );
  }

  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");

  if (!q) {
    return NextResponse.json(
      { error: "Missing query parameter q" },
      { status: 400 }
    );
  }

  const query = q.trim();
  const allowed =
    query.startsWith("https://amazon.com") ||
    query.startsWith("https://a.co") ||
    query.startsWith("https://www.amazon.com") ||
    query.startsWith("https://www.a.co");
  if (!allowed) {
    return NextResponse.json(
      {
        error:
          'Only Amazon links are supported. Use a link starting with "https://amazon.com" or "https://a.co".',
      },
      { status: 400 }
    );
  }

  try {
    const url = `https://api.linkpreview.net/?q=${encodeURIComponent(query)}`;
    const res = await fetch(url, {
      headers: {
        "X-Linkpreview-Api-Key": apiKey,
      },
      cache: "no-store",
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      return NextResponse.json(
        {
          error: "Failed to fetch link preview",
          details: data,
        },
        { status: res.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to fetch link preview",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
