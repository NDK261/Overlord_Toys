import { hasPublicSupabaseEnv } from "@/lib/supabase/client";
import { createPublicServerSupabaseClient } from "@/lib/supabase/server";
import { productMatchesSearch } from "@/lib/search";
import type { Product } from "@/types/product";

interface ProductQueryResult<T> {
  data: T;
  error: string | null;
  needsSetup: boolean;
}

type ProductImage = {
  id: string;
  product_id: string;
  url: string;
  display_order: number;
};

type CategoryRelation = {
  name: string;
  slug: string;
};

type ProductRow = Pick<
  Product,
  | "id"
  | "name"
  | "slug"
  | "description"
  | "price"
  | "stock"
  | "category_id"
  | "thumbnail_url"
  | "created_at"
> & {
  product_images?: ProductImage[];
  categories?: CategoryRelation | null;
};

const baseProductSelect =
  "id, name, slug, description, price, stock, category_id, thumbnail_url, created_at, product_images(id, product_id, url, display_order)";
const productSelect = `${baseProductSelect}, categories(name, slug)`;
const productSelectWithCategoryFilter = `${baseProductSelect}, categories!inner(name, slug)`;

function transformProductRow(row: ProductRow): Product {
  const { product_images, categories, ...product } = row;
  const images = (product_images || []).sort(
    (a, b) => (a.display_order ?? 0) - (b.display_order ?? 0)
  );

  return {
    ...product,
    category: categories
      ? {
          id: product.category_id,
          name: categories.name,
          slug: categories.slug,
        }
      : undefined,
    images,
  } as Product;
}

function getSetupError(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "Khong the ket noi Supabase luc nay.";
}

export interface GetProductsOptions {
  limit?: number;
  category?: string;
  maxPrice?: number;
  search?: string;
}

function normalizeProductSearch(search?: string) {
  const trimmed = search?.trim().replace(/\s+/g, " ");

  if (!trimmed) {
    return null;
  }

  return trimmed
    .replace(/[,%()\\_%]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 80);
}

export async function getProducts(
  options?: GetProductsOptions
): Promise<ProductQueryResult<Product[]>> {
  if (!hasPublicSupabaseEnv()) {
    return {
      data: [],
      error: "Ban chua cau hinh NEXT_PUBLIC_SUPABASE_URL va NEXT_PUBLIC_SUPABASE_ANON_KEY.",
      needsSetup: true,
    };
  }

  try {
    const supabase = createPublicServerSupabaseClient();
    const selectQuery = options?.category
      ? productSelectWithCategoryFilter
      : productSelect;

    let query = supabase
      .from("products")
      .select(selectQuery)
      .order("created_at", { ascending: false });

    const searchTerm = normalizeProductSearch(options?.search);

    if (options?.category) {
      query = query.eq("categories.slug", options.category);
    }

    if (options?.maxPrice !== undefined) {
      query = query.lte("price", options.maxPrice);
    }

    if (!searchTerm && typeof options?.limit === "number") {
      query = query.limit(options.limit);
    }

    const { data, error } = await query.returns<ProductRow[]>();

    if (error) {
      return {
        data: [],
        error:
          error.message ||
          "Khong lay duoc danh sach san pham. Kiem tra bang products va chinh sach SELECT public.",
        needsSetup: false,
      };
    }

    const products = (data ?? []).map(transformProductRow);
    const filteredProducts = searchTerm
      ? products.filter((product) => productMatchesSearch(product, searchTerm))
      : products;

    return {
      data:
        searchTerm && typeof options?.limit === "number"
          ? filteredProducts.slice(0, options.limit)
          : filteredProducts,
      error: null,
      needsSetup: false,
    };
  } catch (error) {
    return {
      data: [],
      error: getSetupError(error),
      needsSetup: false,
    };
  }
}

export async function getProductBySlug(
  slug: string
): Promise<ProductQueryResult<Product | null>> {
  if (!hasPublicSupabaseEnv()) {
    return {
      data: null,
      error: "Ban chua cau hinh NEXT_PUBLIC_SUPABASE_URL va NEXT_PUBLIC_SUPABASE_ANON_KEY.",
      needsSetup: true,
    };
  }

  try {
    const supabase = createPublicServerSupabaseClient();
    const { data, error } = await supabase
      .from("products")
      .select(productSelect)
      .eq("slug", slug)
      .maybeSingle<ProductRow>();

    if (error) {
      return {
        data: null,
        error: error.message || "Khong lay duoc chi tiet san pham.",
        needsSetup: false,
      };
    }

    return {
      data: data ? transformProductRow(data) : null,
      error: null,
      needsSetup: false,
    };
  } catch (error) {
    return {
      data: null,
      error: getSetupError(error),
      needsSetup: false,
    };
  }
}
