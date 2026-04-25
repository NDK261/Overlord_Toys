// src/types/product.ts
// TypeScript types cho sản phẩm - ánh xạ với Supabase schema

export interface Product {
  id: string; // uuid
  name: string; // tên sản phẩm
  slug: string; // SEO-friendly URL
  description: string; // mô tả chi tiết
  price: number; // giá (VNĐ)
  stock: number; // số lượng tồn kho
  category_id: string; // liên kết category
  thumbnail_url: string; // ảnh đại diện (Supabase Storage URL)
  created_at: string; // ISO timestamp

  // Relations (khi join)
  category?: Category;
  images?: ProductImage[];
}

export interface Category {
  id: string; // uuid
  name: string; // tên danh mục (vd: "Xe đồ chơi", "Búp bê")
  slug: string; // slug danh mục
}

export interface ProductImage {
  id: string; // uuid
  product_id: string; // liên kết product
  url: string; // URL ảnh (Supabase Storage)
}

// Dùng khi tạo sản phẩm mới (không có id, created_at)
export type CreateProductInput = Omit<Product, "id" | "created_at" | "category" | "images">;

// Dùng khi cập nhật sản phẩm (tất cả field optional)
export type UpdateProductInput = Partial<CreateProductInput>;

// Kết quả trả về khi list products (có phân trang)
export interface ProductsResponse {
  data: Product[];
  total: number;
  page: number;
  pageSize: number;
}

// Filter params cho trang danh sách sản phẩm
export interface ProductFilters {
  categorySlug?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sortBy?: "price_asc" | "price_desc" | "newest" | "popular";
  page?: number;
  pageSize?: number;
}
