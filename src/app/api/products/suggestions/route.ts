import { NextResponse } from "next/server";
import { getProducts } from "@/lib/products";

const SUGGESTION_LIMIT = 6;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search")?.trim() ?? "";

  if (search.length < 2) {
    return NextResponse.json({ suggestions: [] });
  }

  const category = searchParams.get("category") || undefined;
  const rawMaxPrice = searchParams.get("maxPrice");
  const maxPrice = rawMaxPrice ? Number.parseInt(rawMaxPrice, 10) : undefined;
  const { data, error, needsSetup } = await getProducts({
    category,
    maxPrice: Number.isFinite(maxPrice) ? maxPrice : undefined,
    search,
    limit: SUGGESTION_LIMIT,
  });

  if (error) {
    return NextResponse.json(
      { error, needsSetup, suggestions: [] },
      { status: needsSetup ? 503 : 500 }
    );
  }

  return NextResponse.json({
    suggestions: data.slice(0, SUGGESTION_LIMIT).map((product) => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      thumbnail_url: product.thumbnail_url,
      categoryName: product.category?.name ?? null,
      categorySlug: product.category?.slug ?? null,
    })),
  });
}
