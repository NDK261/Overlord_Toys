import Image from "next/image";
import Link from "next/link";
import { getProductBySlug, getProducts } from "@/lib/products";
import { notFound } from "next/navigation";
import { AddToCartButton, ImageGallery, ProductPurchaseControls } from "@/components/product";
import { Price } from "@/components/settings/Price";
import { PreferenceGate } from "@/components/settings/PreferenceGate";
import { LocalizedText } from "@/components/settings/LocalizedText";

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const { data: product } = await getProductBySlug(resolvedParams.slug);
  const { data: relatedResult } = await getProducts({ limit: 5 });
  const relatedProducts = relatedResult.filter(p => p.id !== product?.id).slice(0, 4);

  if (!product) {
    notFound();
  }

  return (
    <div className="bg-[#06151a] min-h-screen text-[#d4e5ec] font-['Inter'] selection:bg-[#6FF7E8]/30">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;800&family=Inter:wght@400;500;600;700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200');

        .text-gradient {
          background: linear-gradient(90deg, #6FF7E8 0%, #1F7EA1 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .glass-card {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(111, 247, 232, 0.1);
        }
        .glow-border:hover {
          border-color: rgba(111, 247, 232, 0.4);
          box-shadow: 0 0 25px rgba(111, 247, 232, 0.1);
        }
        .ms {
          font-family: 'Material Symbols Outlined';
          font-weight: normal; font-style: normal; font-size: 20px;
          display: inline-block; line-height: 1; text-transform: none;
          letter-spacing: normal; word-wrap: normal; white-space: nowrap; direction: ltr;
        }
      `}</style>

      {/* --- CONTENT WRAPPER --- */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-12">
        
        {/* Breadcrumb - Subtle & Technical */}
        <nav className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#6FF7E8]/40 mb-10 animate-fade-in">
          <Link href="/" className="hover:text-[#6FF7E8] transition-colors">
            <LocalizedText en="Reliquary Home" vi="Trang chủ" />
          </Link>
          <span className="ms text-[10px]">chevron_right</span>
          <Link href="/shop" className="hover:text-[#6FF7E8] transition-colors">
            <LocalizedText en="Archives" vi="Cửa hàng" />
          </Link>
          <span className="ms text-[10px]">chevron_right</span>
          <span className="text-[#6FF7E8]">{product.name}</span>
        </nav>

        {/* --- MAIN SHOWCASE SECTION --- */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 mb-24 items-start">
          
          {/* Left: Gallery (6/12 col) */}
          <div className="lg:col-span-7 sticky top-32">
             <div className="relative">
                {/* Decorative Elements */}
                <div className="absolute -top-12 -left-12 w-64 h-64 bg-[#6FF7E8]/5 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-[#1F7EA1]/5 rounded-full blur-[100px] pointer-events-none" />
                
                <ImageGallery product={product} />
             </div>
          </div>

          {/* Right: Technical Data (5/12 col) */}
          <div className="lg:col-span-5 space-y-10 pt-4">
            
            {/* Header info */}
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#6FF7E8]/10 border border-[#6FF7E8]/20">
                <span className="w-1.5 h-1.5 rounded-full bg-[#6FF7E8] shadow-[0_0_8px_#6FF7E8]" />
                <LocalizedText
                  as="span"
                  className="text-[10px] font-bold text-[#6FF7E8] tracking-[0.2em] uppercase"
                  en="Limited Artifact"
                  vi="Sản phẩm giới hạn"
                />
              </div>
              
              <h1 className="text-3xl md:text-5xl font-['Plus_Jakarta_Sans'] font-extrabold tracking-tighter leading-[1.05] text-white">
                {product.name}
              </h1>

              <div className="flex items-center gap-8 py-2">
                <div className="flex items-center gap-1.5 text-[#6FF7E8]">
                  <span className="ms">star</span>
                  <span className="ms">star</span>
                  <span className="ms">star</span>
                  <span className="ms">star</span>
                  <span className="ms text-[#6FF7E8]/30">star</span>
                  <span className="ml-2 text-xs font-bold text-white/60">
                    4.9 <LocalizedText en="RANK" vi="ĐÁNH GIÁ" />
                  </span>
                </div>
                <div className="h-4 w-[1px] bg-white/10" />
                <div className="text-xs font-bold text-white/40 uppercase tracking-widest">
                  <LocalizedText en="Series:" vi="Bộ sưu tập:" /> <span className="text-white/80">OVERLORD_PRIME</span>
                </div>
              </div>
            </div>

            {/* Price Component */}
            <div className="py-6 border-y border-white/5 flex items-baseline gap-6">
                <span className="text-4xl font-['Plus_Jakarta_Sans'] font-extrabold text-gradient">
                 <Price amount={product.price} />
               </span>
               <span className="text-xl text-white/20 line-through font-medium">
                 <Price amount={product.price * 1.2} />
               </span>
               <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest">
                 -20% <LocalizedText en="Tier" vi="Ưu đãi" />
               </div>
            </div>

            {/* Tactical Description */}
            <p className="text-base text-white/60 leading-relaxed font-medium">
               {product.description || (
                 <LocalizedText
                   en="A high-fidelity mechanical masterpiece featuring intricate detailing and advanced articulation. Designed for elite collectors who demand the pinnacle of robotic engineering."
                   vi="Một sản phẩm cơ khí giàu chi tiết, có độ hoàn thiện cao và khả năng tạo dáng linh hoạt. Phù hợp với người sưu tầm muốn một mô hình nổi bật trong bộ sưu tập."
                 />
               )}
            </p>

            {/* Purchase Console */}
            <div className="glass-card rounded-2xl p-6 space-y-6">
               <div className="flex items-center justify-between">
                 <LocalizedText
                   as="span"
                   className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40"
                   en="Inventory Status"
                   vi="Tình trạng kho"
                 />
                 <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#6FF7E8]">
                   <LocalizedText en="Available" vi="Còn hàng" /> ({product.stock})
                 </span>
               </div>
               
               <ProductPurchaseControls product={product} />
               
               <div className="flex items-center gap-4 pt-2">
                 <div className="flex-1 h-[1px] bg-white/5" />
                 <LocalizedText
                   as="span"
                   className="text-[9px] font-bold text-white/20 uppercase tracking-[0.3em]"
                   en="Encrypted Transaction"
                   vi="Giao dịch bảo mật"
                 />
                 <div className="flex-1 h-[1px] bg-white/5" />
               </div>
            </div>

            {/* Meta Details Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="glass-card p-4 rounded-xl border-white/5 flex items-center gap-4">
                <span className="ms text-[#6FF7E8]/40">local_shipping</span>
                <div className="space-y-0.5">
                  <LocalizedText as="p" className="text-[9px] font-bold uppercase tracking-widest text-white/30" en="Deployment" vi="Giao hàng" />
                  <LocalizedText as="p" className="text-xs font-bold" en="2-4 Lunar Days" vi="2-4 ngày" />
                </div>
              </div>
              <div className="glass-card p-4 rounded-xl border-white/5 flex items-center gap-4">
                <span className="ms text-[#6FF7E8]/40">verified_user</span>
                <div className="space-y-0.5">
                  <LocalizedText as="p" className="text-[9px] font-bold uppercase tracking-widest text-white/30" en="Authenticity" vi="Nguồn gốc" />
                  <LocalizedText as="p" className="text-xs font-bold" en="Guaranteed" vi="Đảm bảo" />
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* --- TECHNICAL SPECS SECTION (Bento Grid) --- */}
        <section className="mb-40">
           <div className="flex flex-col items-center mb-10 text-center space-y-4">
             <LocalizedText
               as="h2"
               className="text-2xl md:text-4xl font-['Plus_Jakarta_Sans'] font-extrabold text-white tracking-tight"
               en="Engineering Artifacts"
               vi="Chi tiết sản phẩm"
             />
             <div className="w-24 h-1 bg-gradient-to-r from-[#6FF7E8] to-transparent rounded-full" />
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Feature 1 (Double height) */}
              <div className="md:row-span-2 glass-card rounded-[32px] p-8 flex flex-col justify-between group overflow-hidden relative border-white/5">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#6FF7E8]/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 group-hover:bg-[#6FF7E8]/10 transition-colors" />
                <div className="space-y-6 relative z-10">
                  <span className="ms text-4xl text-[#6FF7E8]">precision_manufacturing</span>
                  <LocalizedText as="h3" className="text-xl font-bold text-white" en="Full Mechanics Grade" vi="Độ hoàn thiện cơ khí cao" />
                  <LocalizedText
                    as="p"
                    className="text-white/50 leading-relaxed"
                    en="Experience a level of mechanical depth that transcends standard models. Every frame, piston, and armor plate is engineered with sub-millimeter precision for the ultimate assembly experience."
                    vi="Các chi tiết khung, khớp và lớp giáp được thiết kế tỉ mỉ để đem lại trải nghiệm lắp ráp và trưng bày tốt hơn."
                  />
                </div>
                <div className="relative z-10 mt-12 aspect-square rounded-2xl overflow-hidden grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700">
                  <Image src={product.thumbnail_url} alt="Detail" fill className="object-cover" />
                </div>
              </div>

              {/* Feature 2 */}
              <div className="glass-card rounded-[32px] p-8 space-y-4 border-white/5 group hover:border-[#6FF7E8]/30 transition-colors">
                 <span className="ms text-[#6FF7E8] text-3xl">gesture</span>
                 <LocalizedText as="h3" className="text-xl font-bold text-white" en="Elite Articulation" vi="Khả năng tạo dáng linh hoạt" />
                 <LocalizedText as="p" className="text-sm text-white/40 leading-relaxed" en="Featuring the proprietary Overlord-Joint system allowing for hyper-dynamic posing without compromising structural integrity." vi="Hệ khớp chắc chắn giúp sản phẩm tạo nhiều tư thế mà vẫn giữ được độ ổn định." />
              </div>

              {/* Feature 3 */}
              <div className="glass-card rounded-[32px] p-8 space-y-4 border-white/5 group hover:border-[#6FF7E8]/30 transition-colors">
                 <span className="ms text-[#6FF7E8] text-3xl">opacity</span>
                 <LocalizedText as="h3" className="text-xl font-bold text-white" en="Reactive Plating" vi="Thiết kế nhiều lớp" />
                 <LocalizedText as="p" className="text-sm text-white/40 leading-relaxed" en="Multi-layered armor design with sliding mechanism that exposes internal mechanical details during movement." vi="Các lớp vỏ và chi tiết bên trong được sắp xếp để sản phẩm trông sâu và giàu chi tiết hơn khi trưng bày." />
              </div>

              {/* Wide technical panel */}
              <div className="md:col-span-2 glass-card rounded-[32px] p-8 flex flex-col md:flex-row gap-12 items-center border-white/5 relative overflow-hidden">
                <div className="flex-1 space-y-6">
                  <LocalizedText as="div" className="inline-block px-3 py-1 rounded bg-white/5 border border-white/10 text-[9px] font-black tracking-[.25em] text-white/40 uppercase" en="Technical Manual" vi="Thông số kỹ thuật" />
                  <LocalizedText as="h3" className="text-2xl font-bold text-white" en="The Reliquary Standard" vi="Tiêu chuẩn Overlord" />
                  <div className="grid grid-cols-2 gap-y-6 gap-x-8">
                    <div>
                      <LocalizedText as="p" className="text-[10px] font-bold text-[#6FF7E8] uppercase tracking-widest mb-1" en="Scale Ratio" vi="Tỉ lệ" />
                      <LocalizedText as="p" className="text-white/60 text-sm" en="1:100 High Fidelity" vi="1:100 chi tiết cao" />
                    </div>
                    <div>
                      <LocalizedText as="p" className="text-[10px] font-bold text-[#6FF7E8] uppercase tracking-widest mb-1" en="Part Count" vi="Số chi tiết" />
                      <LocalizedText as="p" className="text-white/60 text-sm" en="450+ Precision Components" vi="450+ chi tiết" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-[#6FF7E8] uppercase tracking-widest mb-1">SKU_ID</p>
                      <p className="text-white/60 text-sm font-mono">ARCH-{product.id.substring(0,6)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-[#6FF7E8] uppercase tracking-widest mb-1">Build Time</p>
                      <LocalizedText as="p" className="text-white/60 text-sm" en="6-8 Standard Cycles" vi="6-8 giờ lắp ráp" />
                    </div>
                  </div>
                </div>
                <div className="w-full md:w-64 h-64 relative rounded-2xl border border-white/5 p-4 bg-black/20">
                   <div className="absolute inset-0 flex items-center justify-center opacity-10">
                     <span className="ms text-[120px]">architecture</span>
                   </div>
                   <div className="relative h-full flex flex-col justify-end">
                      <p className="text-[10px] font-mono leading-tight text-[#6FF7E8]/40">
                        {"// INITIALIZING SCAN..."}<br/>
                        {"// MECHANICAL_LAYER: OK"}<br/>
                        {"// ARTICULATION_CORE: STABLE"}<br/>
                        {"// AESTHETIC_SYNC: 99.8%"}<br/>
                      </p>
                   </div>
                </div>
              </div>
           </div>
        </section>

        {/* --- RELATED ARTIFACTS --- */}
        <PreferenceGate preference="productRecommendations">
        <section className="animate-fade-in-up">
          <div className="flex items-end justify-between mb-16 px-4">
             <div className="space-y-2">
               <LocalizedText
                 as="span"
                 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#6FF7E8]/40"
                 en="Related Items"
                 vi="Sản phẩm liên quan"
               />
               <LocalizedText
                 as="h2"
                 className="text-3xl font-['Plus_Jakarta_Sans'] font-extrabold text-white"
                 en="Recommended Archives"
                 vi="Gợi ý cho bạn"
               />
             </div>
             <Link href="/shop" className="group flex items-center gap-3 text-xs font-bold text-white/40 hover:text-[#6FF7E8] transition-all">
               <LocalizedText en="Browse All" vi="Xem tất cả" /> <span className="ms text-[14px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
             </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {relatedProducts.map(p => (
              <Link 
                href={`/product/${p.slug}`} 
                key={p.id} 
                className="glass-card rounded-[24px] overflow-hidden group hover:shadow-[0_0_40px_rgba(111,247,232,0.1)] transition-all duration-500 block border-white/5 relative"
              >
                <div className="aspect-[4/5] overflow-hidden bg-[#0c1a1f] relative">
                  <Image 
                    src={p.thumbnail_url} 
                    alt={p.name} 
                    fill 
                    className="object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#06151a] via-transparent to-transparent opacity-60" />
                </div>
                
                <div className="p-8 space-y-4">
                  <span className="text-[9px] font-black text-[#6FF7E8]/40 uppercase tracking-[0.3em]"><LocalizedText en="Code:" vi="Mã:" /> {p.slug.split('-')[0]}</span>
                  <h3 className="font-bold text-lg text-white group-hover:text-[#6FF7E8] transition-colors line-clamp-1">{p.name}</h3>
                  <div className="flex justify-between items-center pt-2">
                    <span className="font-['Plus_Jakarta_Sans'] font-extrabold text-[#6FF7E8]">
                      <Price amount={p.price} />
                    </span>
                    <AddToCartButton
                      ariaLabel={`Them ${p.name} vao gio hang`}
                      className="w-10 h-10 rounded-xl border border-[#6FF7E8]/20 flex items-center justify-center group-hover:bg-[#6FF7E8] group-hover:text-[#003732] transition-all active:scale-90"
                      iconName="add"
                      preventNavigation
                      product={p}
                    />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
        </PreferenceGate>

      </div>
    </div>
  );
}
