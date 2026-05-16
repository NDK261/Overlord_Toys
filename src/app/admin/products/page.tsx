"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { deleteProduct } from "./actions";

export default function AdminProductsPage() {
  return (
    <Suspense fallback={<ProductsLoading />}>
      <AdminProductsContent />
    </Suspense>
  );
}

function ProductsLoading() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="w-8 h-8 border-4 border-[#6FF7E8]/20 border-t-[#6FF7E8] rounded-full animate-spin"></div>
    </div>
  );
}

function AdminProductsContent() {
  const searchParams = useSearchParams();
  const searchTerm = searchParams.get("q")?.trim() ?? "";
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      const { data, error } = await supabase
        .from("products")
        .select(`
          *,
          categories (name)
        `)
        .order("created_at", { ascending: false });

      if (error) {
        setError(error.message);
      } else {
        setProducts(data || []);
      }
      setLoading(false);
    }

    fetchProducts();
  }, []);

  const visibleProducts = useMemo(() => {
    const normalizedTerm = searchTerm.toLowerCase();

    if (!normalizedTerm) {
      return products;
    }

    return products.filter((product) => {
      const searchableText = [
        product.name,
        product.slug,
        product.description,
        product.categories?.name,
        product.id,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableText.includes(normalizedTerm);
    });
  }, [products, searchTerm]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this asset?")) return;

    const result = await deleteProduct(id);
    if (result.success) {
      setProducts(products.filter(p => p.id !== id));
    } else {
      alert("Error: " + result.error);
    }
  };

  if (loading) return <ProductsLoading />;

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#6FF7E8]/10 pb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-[#6FF7E8] animate-pulse"></span>
            <span className="text-[10px] font-black text-[#6FF7E8] uppercase tracking-[0.4em]">Neural Archive / Inventory</span>
          </div>
          <h1 className="text-5xl font-black text-white font-headline tracking-tighter uppercase leading-none">
            Asset <span className="text-stroke-cyan opacity-50">Database</span>
          </h1>
          <p className="text-on-surface-variant text-sm mt-3 max-w-xl font-medium leading-relaxed">
            {searchTerm
              ? `Showing ${visibleProducts.length} product records for "${searchTerm}".`
              : "Manage your digital and physical artifacts. Add new items, update specifications, and monitor availability across the network."}
          </p>
        </div>
        
        <Link 
          href="/admin/products/new"
          className="group relative px-8 py-4 bg-gradient-to-br from-[#6ff7e8] to-[#1f7ea1] rounded-xl overflow-hidden shadow-[0_0_20px_rgba(111,247,232,0.3)] transition-all hover:scale-[1.05] active:scale-[0.95]"
        >
          <div className="relative z-10 flex items-center gap-3">
            <span className="material-symbols-outlined text-[#003732] font-black">add_circle</span>
            <span className="text-sm font-black text-[#003732] uppercase tracking-widest">Initiate New Entry</span>
          </div>
        </Link>
      </div>

      {/* Products Grid/Table */}
      <div className="glass-card rounded-2xl border border-white/5 overflow-hidden bg-[#0A1010]/50 backdrop-blur-xl shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/2">
                <th className="px-6 py-6 text-[10px] font-black text-on-surface-variant uppercase tracking-[0.3em]">Asset Details</th>
                <th className="px-6 py-6 text-[10px] font-black text-on-surface-variant uppercase tracking-[0.3em]">Classification</th>
                <th className="px-6 py-6 text-[10px] font-black text-on-surface-variant uppercase tracking-[0.3em]">Valuation</th>
                <th className="px-6 py-6 text-[10px] font-black text-on-surface-variant uppercase tracking-[0.3em]">Core Stock</th>
                <th className="px-6 py-6 text-[10px] font-black text-on-surface-variant uppercase tracking-[0.3em] text-right">Terminal Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-on-surface-variant text-sm italic">
                    No records found in current sector.
                  </td>
                </tr>
              ) : visibleProducts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-on-surface-variant text-sm italic">
                    {`No product records match "${searchTerm}".`}
                  </td>
                </tr>
              ) : (
                visibleProducts.map((product) => (
                  <tr key={product.id} className="group hover:bg-[#6FF7E8]/5 transition-all">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-white/5 border border-white/10 overflow-hidden flex-shrink-0 group-hover:border-[#6FF7E8]/30 transition-all shadow-inner">
                          {product.thumbnail_url ? (
                            <img src={product.thumbnail_url} alt={product.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <span className="material-symbols-outlined text-white/20">image</span>
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-black text-white uppercase tracking-tight group-hover:text-[#6FF7E8] transition-colors">{product.name}</p>
                          <p className="text-[10px] text-on-surface-variant/60 font-mono">ID: {product.id.slice(0, 8).toUpperCase()}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[9px] font-black text-on-surface-variant uppercase tracking-[0.2em]">
                        {product.categories?.name || "Unclassified"}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-sm font-black text-white font-mono">
                        {(product.price || 0).toLocaleString('vi-VN')} VNĐ
                      </p>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${product.stock > 0 ? 'bg-[#6FF7E8]' : 'bg-red-400'}`}></div>
                        <p className={`text-[10px] font-black uppercase tracking-widest ${product.stock > 0 ? 'text-[#6FF7E8]' : 'text-red-400'}`}>
                          {product.stock} Units
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link 
                          href={`/admin/products/edit/${product.id}`}
                          className="p-2 text-on-surface-variant hover:text-[#6FF7E8] transition-colors"
                        >
                          <span className="material-symbols-outlined text-lg">edit_note</span>
                        </Link>
                        <button 
                          onClick={() => handleDelete(product.id)}
                          className="p-2 text-on-surface-variant hover:text-red-400 transition-colors"
                        >
                          <span className="material-symbols-outlined text-lg">delete_sweep</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
