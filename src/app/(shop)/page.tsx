import Image from "next/image";
import Link from "next/link";
import { getProducts } from "@/lib/products";
import { categories as mockCategories, flashDeals, testimonials } from "@/lib/mock-data";
import { AddToCartButton } from "@/components/product";
import { Price } from "@/components/settings/Price";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const { data: allProducts } = await getProducts();
  const featuredProducts = (allProducts || []).slice(0, 8);
  const heroProduct = featuredProducts[0];

  return (
    <div className="bg-[#06151a] min-h-screen text-[#d4e5ec] font-['Inter'] selection:bg-[#6FF7E8]/30 overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;700;800&family=Inter:wght@400;500;700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200');

        .glass-card {
            background: rgba(255, 255, 255, 0.03);
            backdrop-filter: blur(16px);
            border: 1px solid rgba(255, 255, 255, 0.12);
        }
        .glow-hover:hover {
            box-shadow: 0 0 25px rgba(111, 247, 232, 0.15);
            transform: translateY(-4px);
        }
        .text-gradient {
            background: linear-gradient(90deg, #6FF7E8, #1F7EA1);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        .bg-gradient-primary {
            background: linear-gradient(90deg, #6FF7E8, #1F7EA1);
        }
      `}</style>

      {/* --- SECTION 01: HERO --- */}
      <section className="relative w-full min-h-[800px] flex items-center overflow-hidden px-8 md:px-20 pt-20">
        <div className="absolute inset-0 bg-gradient-to-br from-[#122227] via-[#06151a] to-[#0e1e23] z-0"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#6FF7E8]/10 blur-[120px] rounded-full z-0"></div>

        <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center w-full">
          <div className="space-y-8 animate-in fade-in slide-in-from-left duration-700">
            <div className="glass-card inline-block px-4 py-1.5 rounded-full border-[#6FF7E8]/20">
              <span className="text-[#6FF7E8] text-xs font-bold tracking-widest uppercase">Now Available: Series X Artifacts</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-['Plus_Jakarta_Sans'] font-bold leading-tight tracking-tighter text-white">
              Level Up Your <br />
              <span className="text-gradient">Toy Collection.</span>
            </h1>
            <p className="text-xl text-white/60 max-w-lg leading-relaxed font-medium">
              Premium figures, building sets & limited edition collectibles engineered for the modern curator.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Link href="/shop" className="bg-gradient-primary text-[#003732] font-bold px-10 py-5 rounded-2xl shadow-lg shadow-[#6FF7E8]/20 transition-all hover:scale-105 active:scale-95 text-sm uppercase tracking-wider">
                Shop The Drop
              </Link>
              <Link href="/shop" className="glass-card text-white font-bold px-10 py-5 rounded-2xl border-white/10 hover:bg-white/5 transition-all text-sm uppercase tracking-wider">
                View Best Sellers
              </Link>
            </div>
          </div>

          <div className="relative hidden lg:block animate-in fade-in zoom-in duration-1000">
            {heroProduct && (
              <div className="relative group">
                <div className="glass-card p-4 rounded-[2.5rem] transform rotate-3 scale-105 shadow-2xl relative z-20 overflow-hidden">
                  <div className="aspect-[4/5] relative">
                    <Image
                      src={heroProduct.thumbnail_url}
                      alt={heroProduct.name}
                      fill
                      className="rounded-3xl object-cover"
                      priority
                    />
                  </div>
                </div>
                <div className="absolute -bottom-10 -left-10 glass-card p-8 rounded-3xl w-72 backdrop-blur-3xl z-30 shadow-2xl border-white/10">
                  <p className="text-xs text-[#6FF7E8] font-black mb-2 tracking-[0.2em] uppercase">Limited Edition</p>
                  <p className="font-['Plus_Jakarta_Sans'] font-bold text-white text-lg">{heroProduct.name}</p>
                  <p className="text-sm text-white/50 mt-1 font-medium italic">Collector&apos;s Edition Artifact</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* --- SECTION 02: CATEGORY GRID --- */}
      <section className="py-32 px-8 md:px-20 space-y-12">
        <div className="flex items-end justify-between">
          <div className="space-y-2">
            <h2 className="text-4xl font-['Plus_Jakarta_Sans'] font-bold text-gradient uppercase tracking-tight">Shop by Category</h2>
            <p className="text-white/40 font-medium">Navigate the vaults of imagination</p>
          </div>
          <Link href="/shop" className="text-[#6FF7E8] font-bold flex items-center gap-2 hover:underline group">
            Explore All <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {mockCategories.slice(0, 4).map((c, i) => {
            const icons = ["person_play", "swords", "widgets", "stroller"];
            const emojies = ["🦸", "⚔️", "🧱", "🎪"];
            return (
              <Link key={c.id} href={`/shop?category=${c.id}`} className="glass-card glow-hover p-10 rounded-[2rem] transition-all duration-300 group cursor-pointer relative overflow-hidden">
                <div className="absolute -right-4 -top-4 text-8xl opacity-5 group-hover:opacity-10 transition-opacity translate-x-4 -translate-y-4">
                  {emojies[i % emojies.length]}
                </div>
                <div className="space-y-6">
                  <div className="w-14 h-14 bg-[#6FF7E8]/10 rounded-2xl flex items-center justify-center border border-[#6FF7E8]/20">
                    <span className="material-symbols-outlined text-[#6FF7E8] text-3xl">{icons[i % icons.length]}</span>
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-2xl font-['Plus_Jakarta_Sans'] font-bold text-white">{c.name}</h3>
                    <p className="text-sm text-white/40 font-medium">Explore the collection</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* --- SECTION 03: BEST SELLERS --- */}
      <section className="py-32 bg-[#0a1f26] px-8 md:px-20 space-y-16">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <h2 className="text-5xl font-['Plus_Jakarta_Sans'] font-bold text-gradient">Best Sellers</h2>
          <p className="text-white/40 font-medium uppercase tracking-[0.3em] text-xs">Artifacts most desired by the collective</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {featuredProducts.slice(0, 4).map((product) => (
            <div key={product.id} className="glass-card glow-hover rounded-[2rem] overflow-hidden group p-4 border-white/5 bg-white/[0.02]">
              <Link href={`/product/${product.slug}`} className="block relative aspect-square rounded-2xl overflow-hidden bg-black/20">
                <Image
                  src={product.thumbnail_url}
                  alt={product.name}
                  fill
                  className="w-full h-full object-contain p-6 group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-red-500 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">-15%</div>
              </Link>
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex text-[#e2c55d] text-xs">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    ))}
                  </div>
                  <span className="text-[10px] text-white/30 font-bold uppercase tracking-widest">In Stock</span>
                </div>
                <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-white truncate text-lg">{product.name}</h3>
                <div className="flex items-center gap-3 mt-1">
                  <Price amount={product.price} className="text-2xl font-black text-[#6FF7E8]" />
                </div>
                <div className="pt-2">
                  <AddToCartButton
                    product={product}
                    className="w-full bg-gradient-primary text-[#003732] py-4 rounded-xl text-xs font-black uppercase tracking-widest hover:brightness-110 transition-all active:scale-[0.98] shadow-lg shadow-[#6FF7E8]/10"
                    ariaLabel={`Add ${product.name} to cart`}
                  >
                    Add To Cart
                  </AddToCartButton>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- SECTION 04: FLASH DEALS --- */}
      <section className="py-32 px-8 md:px-20 space-y-16">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <h2 className="text-4xl font-['Plus_Jakarta_Sans'] font-bold text-white flex items-center gap-3">
              Flash Deals <span className="text-3xl">🔥</span>
            </h2>
            <div className="flex items-center gap-2">
              <div className="bg-red-500/10 text-red-500 border border-red-500/20 px-4 py-2 rounded-xl font-mono font-black text-xl">02:45:18</div>
            </div>
          </div>
          <Link href="/shop" className="glass-card px-8 py-3 rounded-full text-xs font-black uppercase tracking-[0.2em] text-white hover:bg-white/5 transition-all border-white/10">View All Deals</Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {flashDeals.slice(0, 3).map(deal => (
            <div key={deal.id} className="glass-card p-8 rounded-[2rem] flex gap-8 group hover:border-red-500/30 transition-all bg-white/[0.01]">
              <div className="w-40 h-40 rounded-2xl overflow-hidden bg-black/20 shrink-0 relative p-4">
                <Image src={deal.thumbnail_url} alt={deal.name} fill className="object-contain transition-transform group-hover:scale-105" />
              </div>
              <div className="flex flex-col justify-between py-2 flex-1">
                <div className="space-y-2">
                  <span className="text-red-500 text-[10px] font-black tracking-widest uppercase bg-red-500/10 px-3 py-1 rounded-full">Limited Stock</span>
                  <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-xl text-white line-clamp-2 leading-tight">{deal.name}</h3>
                  <div className="flex items-center gap-3 mt-4">
                    <Price amount={deal.price * 0.8} className="text-2xl font-black text-[#6FF7E8]" />
                    <Price amount={deal.price} className="text-sm text-white/20 line-through font-medium" />
                  </div>
                </div>
                <AddToCartButton product={deal} className="bg-[#0a1f26] text-white hover:bg-red-500 hover:text-white py-3 px-6 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all w-full text-center mt-6 border border-white/5">
                  Claim Deal
                </AddToCartButton>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- SECTION 05: MANIFESTO / FEATURES --- */}
      <section className="py-32 bg-white/[0.01] px-8 md:px-20 grid grid-cols-1 md:grid-cols-4 gap-12 border-y border-white/5">
        {[
          { icon: "verified", title: "100% Authentic", desc: "Every artifact is certified of quality." },
          { icon: "speed", title: "Fast Shipping", desc: "Dispatch within 24h globally." },
          { icon: "keyboard_return", title: "Easy Returns", desc: "30-day hassle-free policy." },
          { icon: "lock", title: "Secure Payment", desc: "Encrypted transaction protocol." }
        ].map((feat, i) => (
          <div key={i} className="text-center space-y-6">
            <div className="w-20 h-20 mx-auto rounded-full bg-[#6FF7E8]/5 flex items-center justify-center border border-[#6FF7E8]/20 shadow-[0_0_20px_rgba(111,247,232,0.05)]">
              <span className="material-symbols-outlined text-[#6FF7E8] text-4xl">{feat.icon}</span>
            </div>
            <div className="space-y-2">
              <h4 className="font-['Plus_Jakarta_Sans'] font-bold text-white text-lg">{feat.title}</h4>
              <p className="text-sm text-white/40 font-medium leading-relaxed">{feat.desc}</p>
            </div>
          </div>
        ))}
      </section>

      {/* --- SECTION 06: NEWSLETTER --- */}
      <section className="py-32 px-8 md:px-20">
        <div className="bg-gradient-primary rounded-[3rem] p-16 md:p-32 relative overflow-hidden flex flex-col lg:row items-center justify-between gap-20 shadow-2xl shadow-[#6FF7E8]/20">
          <div className="absolute inset-0 bg-black/20 z-0 opacity-40"></div>
          <div className="relative z-10 max-w-2xl text-center lg:text-left space-y-6">
            <h2 className="text-5xl md:text-7xl font-['Plus_Jakarta_Sans'] font-black text-[#003732] tracking-tighter leading-[0.9]">Stay in the Loop</h2>
            <p className="text-[#003732]/70 text-xl font-medium leading-relaxed max-w-lg">Get exclusive deals, early access to new drops, and join a community of world-class curators.</p>
          </div>
          <div className="relative z-10 w-full max-w-md">
            <form className="flex flex-col gap-4">
              <input
                className="bg-white/10 backdrop-blur-xl border-white/20 text-[#003732] placeholder:text-[#003732]/40 rounded-2xl px-10 py-6 w-full focus:ring-4 focus:ring-[#003732]/20 outline-none transition-all font-bold text-lg"
                placeholder="Enter your email address"
                type="email"
              />
              <button
                className="bg-[#003732] text-[#6FF7E8] px-12 py-6 rounded-2xl font-black uppercase tracking-[0.2em] text-sm hover:brightness-110 transition-all active:scale-95 flex items-center justify-center gap-2"
                type="submit"
              >
                Subscribe Now <span className="material-symbols-outlined text-lg">edit</span>
              </button>
            </form>
            <p className="text-[10px] text-[#003732]/50 mt-6 text-center uppercase font-black tracking-widest">Zero Spam Policy. Encrypted Transmission.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
