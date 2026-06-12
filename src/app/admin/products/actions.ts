"use server";

import { createPublicServerSupabaseClient } from "@/lib/supabase/server";
import { createAdminClient, verifyAdmin } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export async function createProduct(formData: FormData) {
  try {
    await verifyAdmin();
    const supabase = createAdminClient();
    
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = parseFloat(formData.get("price") as string);
    const stock = parseInt(formData.get("stock") as string);
    const category_id = formData.get("category_id") as string;
    const thumbnail_url = formData.get("thumbnail_url") as string;
    const detailImagesJson = formData.get("detail_images") as string;
    const detailImages = detailImagesJson ? JSON.parse(detailImagesJson) : [];
    
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

    // Insert detail images
    if (detailImages && detailImages.length > 0) {
      const imageRecords = detailImages.map((url: string, index: number) => ({
        product_id: data.id,
        url,
        display_order: index,
      }));
      const { error: imgError } = await supabase
        .from("product_images")
        .insert(imageRecords);
        
      if (imgError) {
        console.error("Error inserting product details images:", imgError);
      }
    }

    revalidatePath("/admin/products");
    revalidatePath("/");
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateProduct(id: string, formData: FormData) {
  try {
    await verifyAdmin();
    const supabase = createAdminClient();
    
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = parseFloat(formData.get("price") as string);
    const stock = parseInt(formData.get("stock") as string);
    const category_id = formData.get("category_id") as string;
    const thumbnail_url = formData.get("thumbnail_url") as string;
    const slug = formData.get("slug") as string;
    const detailImagesJson = formData.get("detail_images") as string;
    const detailImages = detailImagesJson ? JSON.parse(detailImagesJson) : [];
    
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

    // Update detail images: Delete existing first
    const { error: delError } = await supabase
      .from("product_images")
      .delete()
      .eq("product_id", id);

    if (delError) {
      console.error("Error deleting old detail images:", delError);
    }

    // Re-insert new detail images
    if (detailImages && detailImages.length > 0) {
      const imageRecords = detailImages.map((url: string, index: number) => ({
        product_id: id,
        url,
        display_order: index,
      }));
      const { error: insError } = await supabase
        .from("product_images")
        .insert(imageRecords);
        
      if (insError) {
        console.error("Error inserting updated detail images:", insError);
      }
    }

    revalidatePath("/admin/products");
    revalidatePath("/");
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
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
  try {
    await verifyAdmin();
    const supabase = createAdminClient();
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
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

