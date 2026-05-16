import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { getProducts } from "@/lib/products";
import { AddToCartButton } from "@/components/product";
import { FilterSidebar } from "./FilterSidebar";
import { Price } from "@/components/settings/Price";

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await searchParams;
  const category = typeof resolvedParams.category === "string" ? resolvedParams.category : undefined;
  const maxPrice = typeof resolvedParams.maxPrice === "string" ? parseInt(resolvedParams.maxPrice) : undefined;

  const { data: products } = await getProducts({ category, maxPrice });

  return (
    <div className="px-8 py-12 max-w-[1600px] mx-auto">
      {/* Title Section */}
      <section className="mb-12">
        <nav className="mb-4 text-xs font-label uppercase tracking-widest text-on-surface-variant flex items-center gap-2">
          <Link className="hover:text-primary-fixed" href="/">Home</Link>
          <span className="material-symbols-outlined text-[10px]">chevron_right</span>
          <span className="text-primary-fixed">Shop</span>
        </nav>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-6xl md:text-7xl font-headline font-extrabold tracking-tighter text-gradient">All Products</h1>
            <p className="text-on-surface-variant mt-2 font-body">Showing {products.length} meticulously engineered artifacts</p>
          </div>
          <div className="flex gap-4">
            <button className="glass-card px-6 py-3 rounded-xl flex items-center gap-2 text-sm font-label uppercase tracking-widest hover:bg-white/10 transition-all">
              <span className="material-symbols-outlined text-primary-container">sort</span>
              Latest Arrivals
            </button>
          </div>
        </div>
      </section>

      <div className="flex flex-col md:flex-row gap-12">
        {/* Sidebar */}
        <Suspense fallback={<aside className="w-full md:w-64 shrink-0 animate-pulse bg-white/5 rounded-r-2xl h-[500px]" />}>
          <FilterSidebar />
        </Suspense>

        {/* Product Grid */}
        <div className="flex-1">
          {products.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center border-2 border-white/5 border-dashed rounded-3xl opacity-50">
               <span className="material-symbols-outlined text-4xl mb-2">inventory_2</span>
               <p className="font-headline font-bold text-lg">No Artifacts Found</p>
               <p className="text-xs text-on-surface-variant uppercase tracking-widest">Adjust your scan protocols</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((p, i) => (
                <div key={p.id} className={`glass-card rounded-2xl overflow-hidden group glow-hover flex flex-col ${i === 1 || i === 7 ? 'md:col-span-2' : ''}`}>
                  <Link href={`/product/${p.slug}`} className={`relative ${i === 1 || i === 7 ? 'aspect-video' : 'aspect-square'} overflow-hidden bg-surface-container-low block`}>
                    <Image src={p.thumbnail_url} alt={p.name} width={800} height={800} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    {i === 0 && (
                      <div className="absolute top-4 left-4">
                        <span className="bg-primary-container text-on-primary text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">In Stock</span>
                      </div>
                    )}
                    {i === 1 && (
                      <div className="absolute top-4 left-4">
                        <span className="bg-primary-container text-on-primary text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">Collector's Choice</span>
                      </div>
                    )}
                  </Link>
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-1 text-primary-container">
                        <span className="material-symbols-outlined text-sm">star</span>
                        <span className="text-xs font-bold">4.9</span>
                      </div>
                      <span className="text-[10px] text-on-surface-variant font-medium uppercase tracking-widest">{Math.floor(Math.random()*200)+10} Sold</span>
                    </div>
                    <Link href={`/product/${p.slug}`}>
                      <h3 className={`font-headline ${i === 1 || i === 7 ? 'text-2xl' : 'text-lg'} font-bold leading-tight mb-2 group-hover:text-primary-container transition-colors line-clamp-2`}>{p.name}</h3>
                    </Link>
                    <div className="mt-auto pt-4 flex items-end justify-between">
                      <div className="flex flex-col">
                        <Price amount={p.price} className={`${i === 1 || i === 7 ? 'text-3xl' : 'text-2xl'} font-headline font-extrabold text-primary tracking-tighter`} />
                      </div>
                      <AddToCartButton
                        ariaLabel={`Them ${p.name} vao gio hang`}
                        className="bg-gradient-primary text-on-primary p-3 rounded-xl hover:scale-105 active:scale-95 transition-all"
                        iconName={i === 7 ? "shopping_bag" : "add_shopping_cart"}
                        product={p}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination (Hide if empty) */}
          {products.length > 0 && (
            <div className="mt-20 flex justify-center items-center gap-4">
              <button className="glass-card w-12 h-12 rounded-full flex items-center justify-center hover:bg-primary-container hover:text-on-primary transition-all text-on-surface">
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              <button className="glass-card w-12 h-12 rounded-full flex items-center justify-center bg-primary-container text-on-primary font-bold">1</button>
              <button className="glass-card w-12 h-12 rounded-full flex items-center justify-center hover:bg-primary-container hover:text-on-primary transition-all font-bold text-on-surface">2</button>
              <button className="glass-card w-12 h-12 rounded-full flex items-center justify-center hover:bg-primary-container hover:text-on-primary transition-all font-bold text-on-surface">3</button>
              <span className="text-on-surface-variant">...</span>
              <button className="glass-card w-12 h-12 rounded-full flex items-center justify-center hover:bg-primary-container hover:text-on-primary transition-all text-on-surface">
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
