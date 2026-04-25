"use server";

import { createPublicServerSupabaseClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createProduct(formData: FormData) {
  const supabase = createPublicServerSupabaseClient();
  
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const price = parseFloat(formData.get("price") as string);
  const stock = parseInt(formData.get("stock") as string);
  const category_id = formData.get("category_id") as string;
  const thumbnail_url = formData.get("thumbnail_url") as string;
  
  // Sử dụng slug từ form nếu có, nếu không thì tạo mới
  let slug = formData.get("slug") as string;
  if (!slug) {
    slug = name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\w ]+/g, "")
      .replace(/ +/g, "-");
  }

  const { data, error } = await supabase
    .from("products")
    .insert([
      {
        name,
        slug,
        description,
        price,
        stock,
        category_id,
        thumbnail_url,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Error creating product:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/products");
  revalidatePath("/");
  return { success: true, data };
}

export async function updateProduct(id: string, formData: FormData) {
  const supabase = createPublicServerSupabaseClient();
  
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const price = parseFloat(formData.get("price") as string);
  const stock = parseInt(formData.get("stock") as string);
  const category_id = formData.get("category_id") as string;
  const thumbnail_url = formData.get("thumbnail_url") as string;
  const slug = formData.get("slug") as string;
  
  const { data, error } = await supabase
    .from("products")
    .update({
      name,
      slug,
      description,
      price,
      stock,
      category_id,
      thumbnail_url,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating product:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/products");
  revalidatePath("/");
  return { success: true, data };
}

export async function getCategories() {
  const supabase = createPublicServerSupabaseClient();
  const { data, error } = await supabase
    .from("categories")
    .select("id, name");
    
  if (error) return [];
  return data;
}

export async function deleteProduct(id: string) {
  const supabase = createPublicServerSupabaseClient();
  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting product:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/products");
  return { success: true };
}
