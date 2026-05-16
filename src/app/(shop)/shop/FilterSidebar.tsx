"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Price } from "@/components/settings/Price";

export function FilterSidebar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category") || "";
  const initialPrice = searchParams.get("maxPrice") ? parseInt(searchParams.get("maxPrice") as string) : 15000000;
  
  const [maxPrice, setMaxPrice] = useState(initialPrice);

  useEffect(() => {
    setMaxPrice(searchParams.get("maxPrice") ? parseInt(searchParams.get("maxPrice") as string) : 15000000);
  }, [searchParams]);

  const handleApplyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("maxPrice", maxPrice.toString());
    router.push(`/shop?${params.toString()}`);
  };

  const getCategoryUrl = (catSlug: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (catSlug) {
      params.set("category", catSlug);
    } else {
      params.delete("category");
    }
    return `/shop?${params.toString()}`;
  };

  const isActive = (catSlug: string) => currentCategory === catSlug;

  return (
    <aside className="w-full md:w-64 shrink-0">
      <div className="flex flex-col border-r border-white/5 py-8 bg-[#06151a]/40 backdrop-blur-md rounded-r-2xl sticky top-24">
        {/* Title */}
        <div className="px-6 mb-8">
          <h3 className="font-body text-xs uppercase tracking-widest text-primary-container font-bold mb-1">FILTER ARCHIVE</h3>
          <p className="text-[10px] text-on-surface-variant uppercase tracking-tighter">Refine by Protocol</p>
        </div>
        
        {/* Category Nav */}
        <nav className="space-y-2 mb-8 px-2">
          {/* All Items */}
          <Link href={getCategoryUrl("")} scroll={false} className={`flex items-center gap-3 px-4 py-3 active:translate-x-1 transition-all mb-2 rounded-md ${isActive("") ? "bg-gradient-to-r from-primary-container/20 to-transparent text-primary-container border-l-4 border-primary-container font-bold" : "text-on-surface-variant hover:text-primary-container hover:bg-white/5"}`}>
            <span className="material-symbols-outlined text-primary-container">category</span>
            <span className="font-body text-xs uppercase tracking-widest whitespace-nowrap font-bold">All Items</span>
          </Link>

          {/* Gundam Accordion */}
          <details className="group" open={currentCategory.includes("gundam")}>
            <summary className="flex items-center justify-between cursor-pointer text-on-surface-variant hover:text-primary-container px-4 py-3 hover:bg-white/5 transition-all rounded-md list-none [&::-webkit-details-marker]:hidden">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary-container">smart_toy</span>
                <span className="font-body text-xs uppercase tracking-widest font-bold text-primary-container">Gundam</span>
              </div>
              <span className="material-symbols-outlined text-sm group-open:-rotate-180 transition-transform duration-300">expand_more</span>
            </summary>
            <div className="flex flex-col gap-2 pl-11 pr-4 py-2 border-l border-white/5 ml-6">
              <Link scroll={false} href={getCategoryUrl("gundam-1-48")} className={`text-[11px] py-1 transition-colors uppercase tracking-widest ${isActive("gundam-1-48") ? "text-primary font-bold" : "text-on-surface-variant hover:text-primary-container"}`}><span className="opacity-50 mr-1">/</span> Kích thước 1/48</Link>
              <Link scroll={false} href={getCategoryUrl("gundam-1-144")} className={`text-[11px] py-1 transition-colors uppercase tracking-widest ${isActive("gundam-1-144") ? "text-primary font-bold" : "text-on-surface-variant hover:text-primary-container"}`}><span className="opacity-50 mr-1">/</span> Kích thước 1/144</Link>
            </div>
          </details>

          {/* One Piece Accordion */}
          <details className="group border-t border-white/5" open={currentCategory.includes("one-piece")}>
            <summary className="flex items-center justify-between cursor-pointer text-on-surface-variant hover:text-primary-container px-4 py-3 hover:bg-white/5 transition-all rounded-md list-none [&::-webkit-details-marker]:hidden">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary-container">sailing</span>
                <span className="font-body text-xs uppercase tracking-widest font-bold text-primary-container">One Piece</span>
              </div>
              <span className="material-symbols-outlined text-sm group-open:-rotate-180 transition-transform duration-300">expand_more</span>
            </summary>
            <div className="flex flex-col gap-2 pl-11 pr-4 py-2 border-l border-white/5 ml-6">
              <Link scroll={false} href={getCategoryUrl("one-piece-figure")} className={`text-[11px] py-1 transition-colors uppercase tracking-widest ${isActive("one-piece-figure") ? "text-primary font-bold" : "text-on-surface-variant hover:text-primary-container"}`}><span className="opacity-50 mr-1">/</span> Figure One Piece</Link>
              <Link scroll={false} href={getCategoryUrl("one-piece-3d-lamps")} className={`text-[11px] py-1 transition-colors uppercase tracking-widest ${isActive("one-piece-3d-lamps") ? "text-primary font-bold" : "text-on-surface-variant hover:text-primary-container"}`}><span className="opacity-50 mr-1">/</span> One Piece 3D Lamps</Link>
              <Link scroll={false} href={getCategoryUrl("one-piece-wall-arts")} className={`text-[11px] py-1 transition-colors uppercase tracking-widest ${isActive("one-piece-wall-arts") ? "text-primary font-bold" : "text-on-surface-variant hover:text-primary-container"}`}><span className="opacity-50 mr-1">/</span> One Piece Wall Arts</Link>
            </div>
          </details>

          {/* Lego Accordion */}
          <details className="group border-t border-white/5" open={currentCategory.includes("lego")}>
            <summary className="flex items-center justify-between cursor-pointer text-on-surface-variant hover:text-primary-container px-4 py-3 hover:bg-white/5 transition-all rounded-md list-none [&::-webkit-details-marker]:hidden">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary-container">extension</span>
                <span className="font-body text-xs uppercase tracking-widest font-bold text-primary-container">Lego</span>
              </div>
              <span className="material-symbols-outlined text-sm group-open:-rotate-180 transition-transform duration-300">expand_more</span>
            </summary>
            <div className="flex flex-col gap-2 pl-11 pr-4 py-2 border-l border-white/5 ml-6">
              <Link scroll={false} href={getCategoryUrl("lego-super-car")} className={`text-[11px] py-1 transition-colors uppercase tracking-widest ${isActive("lego-super-car") ? "text-primary font-bold" : "text-on-surface-variant hover:text-primary-container"}`}><span className="opacity-50 mr-1">/</span> Lego Super Car</Link>
              <Link scroll={false} href={getCategoryUrl("lego-ninjago")} className={`text-[11px] py-1 transition-colors uppercase tracking-widest ${isActive("lego-ninjago") ? "text-primary font-bold" : "text-on-surface-variant hover:text-primary-container"}`}><span className="opacity-50 mr-1">/</span> Lego Ninja Go</Link>
              <Link scroll={false} href={getCategoryUrl("lego-harry-potter")} className={`text-[11px] py-1 transition-colors uppercase tracking-widest ${isActive("lego-harry-potter") ? "text-primary font-bold" : "text-on-surface-variant hover:text-primary-container"}`}><span className="opacity-50 mr-1">/</span> Lego Harry Potter</Link>
            </div>
          </details>

          {/* RC Car */}
          <Link scroll={false} href={getCategoryUrl("rc-car")} className={`flex items-center justify-between px-4 py-3 transition-all rounded-md border-t border-white/5 ${isActive("rc-car") ? "bg-white/5 text-primary-container" : "text-on-surface-variant hover:text-primary-container hover:bg-white/5"}`}>
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary-container">toys</span>
              <span className="font-body text-xs uppercase tracking-widest font-bold text-primary-container">RC Car</span>
            </div>
          </Link>
        </nav>
        
        {/* Price Form */}
        <div className="px-6 space-y-8 mt-2">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Price Protocol</span>
              <Price amount={maxPrice} className="text-[10px] text-primary-container font-mono" />
            </div>
            <input 
              className="w-full h-1 bg-surface-container-highest rounded-lg appearance-none cursor-pointer accent-primary-container" 
              max="15000000" 
              min="0" 
              step="100000"
              type="range" 
              value={maxPrice}
              onChange={(e) => setMaxPrice(parseInt(e.target.value))}
            />
            <div className="flex justify-between mt-2 text-[10px] font-bold text-on-surface-variant">
              <Price amount={0} />
              <Price amount={15000000} />
            </div>
          </div>
          <button 
            type="button"
            onClick={handleApplyFilters}
            className="w-full bg-gradient-primary text-on-primary py-3 rounded-xl font-headline font-bold text-sm tracking-tight hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-primary-container/20">
            Apply Filters
          </button>
        </div>
      </div>
    </aside>
  );
}
