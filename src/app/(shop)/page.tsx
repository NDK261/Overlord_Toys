import Image from "next/image";
import Link from "next/link";
import { getProducts } from "@/lib/products";
import HeroVideoPlayer from "@/components/HeroVideoPlayer";
import { categories as mockCategories, flashDeals, testimonials } from "@/lib/mock-data";
import { AddToCartButton } from "@/components/product";
import { Price } from "@/components/settings/Price";
import { LocalizedText } from "@/components/settings/LocalizedText";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const { data: featuredProducts } = await getProducts({ limit: 8 });
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
      <section className="relative w-full min-h-[800px] flex items-center px-8 md:px-20 pt-20">
        <div className="absolute inset-0 bg-gradient-to-br from-[#122227] via-[#06151a] to-[#0e1e23] z-0"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#6FF7E8]/10 blur-[120px] rounded-full z-0"></div>

        <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center w-full">
          <div className="space-y-8 animate-in fade-in slide-in-from-left duration-700">
            <div className="glass-card inline-block px-4 py-1.5 rounded-full border-[#6FF7E8]/20">
              <LocalizedText
                as="span"
                className="text-[#6FF7E8] text-xs font-bold tracking-widest uppercase"
                en="Now Available: Series X Artifacts"
                vi="Đã mở bán: bộ sưu tập Series X"
              />
            </div>
            <h1 className="text-6xl md:text-8xl font-['Plus_Jakarta_Sans'] font-bold leading-tight tracking-tighter text-white">
              <LocalizedText en="Level Up Your" vi="Nâng cấp bộ sưu tập" /> <br />
              <span className="text-gradient">
                <LocalizedText en="Toy Collection." vi="đồ chơi của bạn." />
              </span>
            </h1>
            <LocalizedText
              as="p"
              className="text-xl text-white/60 max-w-lg leading-relaxed font-medium"
              en="Premium figures, building sets & limited edition collectibles engineered for the modern curator."
              vi="Mô hình cao cấp, bộ lắp ráp và đồ sưu tầm giới hạn dành cho người yêu đồ chơi hiện đại."
            />
            <div className="flex flex-wrap gap-4 pt-4">
              <Link href="/shop" className="bg-gradient-primary text-[#003732] font-bold px-10 py-5 rounded-2xl shadow-lg shadow-[#6FF7E8]/20 transition-all hover:scale-105 active:scale-95 text-sm uppercase tracking-wider">
                <LocalizedText en="Shop The Drop" vi="Mua ngay" />
              </Link>
              <Link href="/shop" className="glass-card text-white font-bold px-10 py-5 rounded-2xl border-white/10 hover:bg-white/5 transition-all text-sm uppercase tracking-wider">
                <LocalizedText en="View Best Sellers" vi="Xem bán chạy" />
              </Link>
            </div>
          </div>

          <div className="relative hidden lg:block animate-in fade-in zoom-in duration-1000">
            {heroProduct && (
              <div className="relative group">
                <div className="glass-card p-4 rounded-[2.5rem] transform rotate-3 scale-105 shadow-2xl relative z-20 overflow-hidden">
                  <div className="aspect-[4/5] relative overflow-hidden rounded-3xl">
                    <HeroVideoPlayer 
                      videoSrc="/hero-video-v3.mp4" 
                      audioSrc="/Iron_Maw_Awakening.mp3" 
                    />
                  </div>
                </div>
                <div className="absolute -bottom-10 -left-10 glass-card p-8 rounded-3xl w-72 backdrop-blur-3xl z-30 shadow-2xl border-white/10">
                  <LocalizedText
                    as="p"
                    className="text-xs text-[#6FF7E8] font-black mb-2 tracking-[0.2em] uppercase"
                    en="Limited Edition"
                    vi="Phiên bản giới hạn"
                  />
                  <p className="font-['Plus_Jakarta_Sans'] font-bold text-white text-lg">{heroProduct.name}</p>
                  <LocalizedText
                    as="p"
                    className="text-sm text-white/50 mt-1 font-medium italic"
                    en="Collector's Edition Artifact"
                    vi="Sản phẩm dành cho nhà sưu tầm"
                  />
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
            <LocalizedText
              as="h2"
              className="text-4xl font-['Plus_Jakarta_Sans'] font-bold text-gradient uppercase tracking-tight"
              en="Shop by Category"
              vi="Mua theo danh mục"
            />
            <LocalizedText
              as="p"
              className="text-white/40 font-medium"
              en="Navigate the vaults of imagination"
              vi="Khám phá các nhóm sản phẩm trong cửa hàng"
            />
          </div>
          <Link href="/shop" className="text-[#6FF7E8] font-bold flex items-center gap-2 hover:underline group">
            <LocalizedText en="Explore All" vi="Xem tất cả" /> <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {mockCategories.slice(0, 4).map((c, i) => {
            const icons = ["person_play", "swords", "widgets", "stroller"];
            
            const defaultCategoryImages: Record<string, string> = {
              'gundam': 'https://lh3.googleusercontent.com/aida-public/AB6AXuCfnuMrhlgFSE9LS-rAroY6q7rBXkTrfe9UirKbqHvvy-nDv8p9YM8CiwJf8XRYxUpXKWnEP-fugpcyjlnsNKSBmVZMITG6MDMAGH5QGoXpxgbuALbAB7Wa45TBFwXdyVp1dBffGrfcODAV095eqV_rRuUc5ZdRkJRjE6k58xdpou7o8ZbKNa3xNe_efUtIw7Gr8hXWIikbeJrx2HPdFXQPElgEVWt_bXfnZY-G06TH4_eOgVPoVf-7AJnNPvJJMR_OMQ5EDy7X7h8', 
              'one-piece': 'https://lh3.googleusercontent.com/aida-public/AB6AXuADLTTO2ztWprcz8-6UJ53sqEKrwlCLOqVWfYWTb5BpPYgQrY13VWsZdrE-CzSHU6f53_vyDx_i8j8AJux89Qjd3sh2qPZqWfxVJsfO8r8nzvT8SUzv5xUDwmxvXDEOHCfPVdvn1zHrCe4f7RmvKNuzeMurlZMH4fLR6mI8N_HIHCx2oaUFkitBXSjdNFKV6xH6SHvQa91Oa9vBq4gKf-TQfm6Jc3Jx0pRyxJzZ_T5ws0xDAiGg9FNYK_JjIJsdOv7UhZydAJqnH58',
              'lego': 'https://lh3.googleusercontent.com/aida-public/AB6AXuBDf4LaN4L6NaA6Dp756A_MbayflwUQrc_biAR8csZB4ZzSXkIwDd_-Fah1hxsSj5fk89a5e-aiDHDDAbxXImYx-3r7kyyUUhspr1Pph9ypYiCaaWnAos8w3F3KZfxqVOkzk9dCHgsUskTISmhIM_vuOqgADiv9HMpV8quSsLlkSYtaL0NzPO2_DydEM4vg0bW1HIugcsT8JeMsg62Ac-tAESkXGP6JwHpSkr0tcMRgnSY_stO-dEZ1TZXIXBylIIZK6ijujJdteW0', 
              'rc-car': 'https://lh3.googleusercontent.com/aida-public/AB6AXuADDPKje3HlvR1SxDfmAJjKY7mZ3SyODXfN4U22mAIhaGLqVWg-ImBxXdX8TvEk3Oqn1vZQyvPUXiHMyUpsWVXJmJrmkn47gnUnMy8DFJop64RIfCmLwv9ufTvdHVkn7KqBbC3aXxF4sfqs8LDEehmUGtQ_2vUHGzOdheA1AAuA7u6nvfhq8jQjv8WsgkzD2bFVucBT7132XmbVOdOXZQuq12ZhS7SYJgiprjq86NmtDhsLAJhXOrF-Mm-RMliogH7CzU7S9pK_iZs' 
            };

            // Tìm hình ảnh sản phẩm đại diện cho category, ưu tiên sản phẩm đầu tiên thuộc category này trong shop
            // Kiểm tra cả id và slug do data có thể lưu dưới 1 trong 2 dạng
            const categoryProduct = (featuredProducts || []).find(p => p.category_id === c.id || p.category_id === c.slug);
            
            // Nếu không có sản phẩm nào thuộc category, giữ nguyên fallback
            const catImage = categoryProduct?.thumbnail_url || defaultCategoryImages[c.slug] || (featuredProducts || [])[i]?.thumbnail_url;
            return (
              <Link key={c.id} href={`/shop?category=${c.id}`} className="glass-card glow-hover p-10 rounded-[2rem] transition-all duration-300 group cursor-pointer relative overflow-hidden">
                {catImage && (
                  <div className="absolute inset-0 z-0">
                    <Image src={catImage} alt={c.name} fill className="object-cover opacity-10 group-hover:opacity-30 transition-all duration-500 group-hover:scale-110 blur-[2px] group-hover:blur-0" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#06151a] via-[#06151a]/50 to-transparent opacity-90"></div>
                  </div>
                )}
                <div className="space-y-6 relative z-10">
                  <div className="w-14 h-14 bg-[#6FF7E8]/10 rounded-2xl flex items-center justify-center border border-[#6FF7E8]/20 backdrop-blur-md">
                    <span className="material-symbols-outlined text-[#6FF7E8] text-3xl">{icons[i % icons.length]}</span>
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-2xl font-['Plus_Jakarta_Sans'] font-bold text-white group-hover:text-[#6FF7E8] transition-colors drop-shadow-md">{c.name}</h3>
                    <LocalizedText
                      as="p"
                      className="text-sm text-white/60 font-medium drop-shadow-md"
                      en="Explore the collection"
                      vi="Xem bộ sưu tập"
                    />
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
          <LocalizedText
            as="h2"
            className="text-5xl font-['Plus_Jakarta_Sans'] font-bold text-gradient"
            en="Best Sellers"
            vi="Sản phẩm bán chạy"
          />
          <LocalizedText
            as="p"
            className="text-white/40 font-medium uppercase tracking-[0.3em] text-xs"
            en="Artifacts most desired by the collective"
            vi="Những món đồ được yêu thích nhất"
          />
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
                  <LocalizedText
                    as="span"
                    className="text-[10px] text-white/30 font-bold uppercase tracking-widest"
                    en="In Stock"
                    vi="Còn hàng"
                  />
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
                    <LocalizedText en="Add To Cart" vi="Thêm vào giỏ" />
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
              <LocalizedText en="Flash Deals" vi="Ưu đãi nhanh" />
              <span className="material-symbols-outlined text-3xl text-red-400">local_fire_department</span>
            </h2>
            <div className="flex items-center gap-2">
              <div className="bg-red-500/10 text-red-500 border border-red-500/20 px-4 py-2 rounded-xl font-mono font-black text-xl">02:45:18</div>
            </div>
          </div>
          <Link href="/shop" className="glass-card px-8 py-3 rounded-full text-xs font-black uppercase tracking-[0.2em] text-white hover:bg-white/5 transition-all border-white/10">
            <LocalizedText en="View All Deals" vi="Xem mọi ưu đãi" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {flashDeals.slice(0, 3).map(deal => (
            <div key={deal.id} className="glass-card p-8 rounded-[2rem] flex gap-8 group hover:border-red-500/30 transition-all bg-white/[0.01]">
              <div className="w-40 h-40 rounded-2xl overflow-hidden bg-black/20 shrink-0 relative p-4">
                <Image src={deal.thumbnail_url} alt={deal.name} fill className="object-contain transition-transform group-hover:scale-105" />
              </div>
              <div className="flex flex-col justify-between py-2 flex-1">
                <div className="space-y-2">
                  <LocalizedText
                    as="span"
                    className="text-red-500 text-[10px] font-black tracking-widest uppercase bg-red-500/10 px-3 py-1 rounded-full"
                    en="Limited Stock"
                    vi="Số lượng ít"
                  />
                  <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-xl text-white line-clamp-2 leading-tight">{deal.name}</h3>
                  <div className="flex items-center gap-3 mt-4">
                    <Price amount={deal.price * 0.8} className="text-2xl font-black text-[#6FF7E8]" />
                    <Price amount={deal.price} className="text-sm text-white/20 line-through font-medium" />
                  </div>
                </div>
                <AddToCartButton product={deal} className="bg-[#0a1f26] text-white hover:bg-red-500 hover:text-white py-3 px-6 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all w-full text-center mt-6 border border-white/5">
                  <LocalizedText en="Claim Deal" vi="Nhận ưu đãi" />
                </AddToCartButton>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- SECTION 05: MANIFESTO / FEATURES --- */}
      <section className="py-32 bg-white/[0.01] px-8 md:px-20 grid grid-cols-1 md:grid-cols-4 gap-12 border-y border-white/5">
        {[
          { icon: "verified", enTitle: "100% Authentic", viTitle: "100% chính hãng", enDesc: "Every artifact is certified of quality.", viDesc: "Mỗi sản phẩm đều được kiểm tra chất lượng." },
          { icon: "speed", enTitle: "Fast Shipping", viTitle: "Giao hàng nhanh", enDesc: "Dispatch within 24h globally.", viDesc: "Xử lý đơn trong vòng 24 giờ." },
          { icon: "keyboard_return", enTitle: "Easy Returns", viTitle: "Đổi trả dễ dàng", enDesc: "30-day hassle-free policy.", viDesc: "Chính sách hỗ trợ đổi trả trong 30 ngày." },
          { icon: "lock", enTitle: "Secure Payment", viTitle: "Thanh toán an toàn", enDesc: "Encrypted transaction protocol.", viDesc: "Quy trình thanh toán được bảo vệ." }
        ].map((feat, i) => (
          <div key={i} className="text-center space-y-6">
            <div className="w-20 h-20 mx-auto rounded-full bg-[#6FF7E8]/5 flex items-center justify-center border border-[#6FF7E8]/20 shadow-[0_0_20px_rgba(111,247,232,0.05)]">
              <span className="material-symbols-outlined text-[#6FF7E8] text-4xl">{feat.icon}</span>
            </div>
            <div className="space-y-2">
              <LocalizedText
                as="h4"
                className="font-['Plus_Jakarta_Sans'] font-bold text-white text-lg"
                en={feat.enTitle}
                vi={feat.viTitle}
              />
              <LocalizedText
                as="p"
                className="text-sm text-white/40 font-medium leading-relaxed"
                en={feat.enDesc}
                vi={feat.viDesc}
              />
            </div>
          </div>
        ))}
      </section>

      {/* --- SECTION 06: NEWSLETTER --- */}
      <section className="py-32 px-8 md:px-20">
        <div className="bg-gradient-primary rounded-[3rem] p-16 md:p-32 relative overflow-hidden flex flex-col lg:row items-center justify-between gap-20 shadow-2xl shadow-[#6FF7E8]/20">
          <div className="absolute inset-0 bg-black/20 z-0 opacity-40"></div>
          <div className="relative z-10 max-w-2xl text-center lg:text-left space-y-6">
            <LocalizedText
              as="h2"
              className="text-5xl md:text-7xl font-['Plus_Jakarta_Sans'] font-black text-[#003732] tracking-tighter leading-[0.9]"
              en="Stay in the Loop"
              vi="Nhận tin mới"
            />
            <LocalizedText
              as="p"
              className="text-[#003732]/70 text-xl font-medium leading-relaxed max-w-lg"
              en="Get exclusive deals, early access to new drops, and join a community of world-class curators."
              vi="Nhận ưu đãi riêng, xem sản phẩm mới sớm hơn và tham gia cộng đồng sưu tầm của Overlord Toys."
            />
          </div>
          <div className="relative z-10 w-full max-w-md">
            <form className="flex flex-col gap-4">
              <input
                className="bg-white/10 backdrop-blur-xl border-white/20 text-[#003732] placeholder:text-[#003732]/40 rounded-2xl px-10 py-6 w-full focus:ring-4 focus:ring-[#003732]/20 outline-none transition-all font-bold text-lg"
                placeholder="Enter your email address / Nhập email của bạn"
                type="email"
              />
              <button
                className="bg-[#003732] text-[#6FF7E8] px-12 py-6 rounded-2xl font-black uppercase tracking-[0.2em] text-sm hover:brightness-110 transition-all active:scale-95 flex items-center justify-center gap-2"
                type="submit"
              >
                <LocalizedText en="Subscribe Now" vi="Đăng ký nhận tin" /> <span className="material-symbols-outlined text-lg">edit</span>
              </button>
            </form>
            <LocalizedText
              as="p"
              className="text-[10px] text-[#003732]/50 mt-6 text-center uppercase font-black tracking-widest"
              en="Zero Spam Policy. Encrypted Transmission."
              vi="Không spam. Thông tin được bảo vệ."
            />
          </div>
        </div>
      </section>
    </div>
  );
}
