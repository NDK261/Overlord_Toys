import { createPublicServerSupabaseClient } from "@/lib/supabase/server";
import ProductForm from "../../new/ProductForm";
import { notFound } from "next/navigation";

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const supabase = createPublicServerSupabaseClient();
  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!product) {
    notFound();
  }

  return (
    <div className="p-6">
      <ProductForm initialData={product} />
    </div>
  );
}
