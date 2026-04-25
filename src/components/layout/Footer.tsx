import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#06151a] grid grid-cols-1 md:grid-cols-4 gap-12 px-12 py-20 border-t border-white/5 w-full font-['Inter'] text-sm uppercase tracking-widest">
      <div className="space-y-6">
        <Link className="text-lg font-bold text-[#EAFAF8]" href="/">OVERLORD TOYS</Link>
        <p className="normal-case text-on-surface-variant tracking-normal max-w-xs">Engineered for collectors who demand the highest tier of craftsmanship and rarity.</p>
        <div className="flex gap-4">
          <a className="w-10 h-10 glass-card rounded-full flex items-center justify-center hover:text-[#6FF7E8] transition-colors" href="#"><span className="material-symbols-outlined text-lg">public</span></a>
          <a className="w-10 h-10 glass-card rounded-full flex items-center justify-center hover:text-[#6FF7E8] transition-colors" href="#"><span className="material-symbols-outlined text-lg">camera</span></a>
          <a className="w-10 h-10 glass-card rounded-full flex items-center justify-center hover:text-[#6FF7E8] transition-colors" href="#"><span className="material-symbols-outlined text-lg">play_circle</span></a>
        </div>
      </div>
      <div className="space-y-6">
        <h5 className="text-[#6FF7E8] font-bold">Navigation</h5>
        <ul className="space-y-4">
          <li><Link className="text-[#EAFAF8]/40 hover:text-[#6FF7E8] transition-colors duration-200" href="/shop">Shop All</Link></li>
          <li><Link className="text-[#EAFAF8]/40 hover:text-[#6FF7E8] transition-colors duration-200" href="/category/pre-orders">Pre-orders</Link></li>
          <li><Link className="text-[#EAFAF8]/40 hover:text-[#6FF7E8] transition-colors duration-200" href="/category/exclusives">Exclusives</Link></li>
          <li><Link className="text-[#EAFAF8]/40 hover:text-[#6FF7E8] transition-colors duration-200" href="/category/new-arrivals">New Arrivals</Link></li>
        </ul>
      </div>
      <div className="space-y-6">
        <h5 className="text-[#6FF7E8] font-bold">Support</h5>
        <ul className="space-y-4">
          <li><Link className="text-[#EAFAF8]/40 hover:text-[#6FF7E8] transition-colors duration-200" href="/about">Authenticity</Link></li>
          <li><Link className="text-[#EAFAF8]/40 hover:text-[#6FF7E8] transition-colors duration-200" href="/shipping">Shipping</Link></li>
          <li><Link className="text-[#EAFAF8]/40 hover:text-[#6FF7E8] transition-colors duration-200" href="/returns">Returns</Link></li>
          <li><Link className="text-[#EAFAF8]/40 hover:text-[#6FF7E8] transition-colors duration-200" href="/privacy">Privacy</Link></li>
        </ul>
      </div>
      <div className="space-y-6">
        <h5 className="text-[#6FF7E8] font-bold">Accepted Assets</h5>
        <div className="flex flex-wrap gap-4">
          <div className="glass-card px-4 py-2 rounded-lg opacity-40 hover:opacity-100 transition-opacity flex items-center">
            <span className="material-symbols-outlined text-xl">payments</span>
            <span className="ml-2 text-[10px]">VISA</span>
          </div>
          <div className="glass-card px-4 py-2 rounded-lg opacity-40 hover:opacity-100 transition-opacity flex items-center">
            <span className="material-symbols-outlined text-xl">contactless</span>
            <span className="ml-2 text-[10px]">PAYOS</span>
          </div>
          <div className="glass-card px-4 py-2 rounded-lg opacity-40 hover:opacity-100 transition-opacity flex items-center">
            <span className="material-symbols-outlined text-xl">credit_card</span>
            <span className="ml-2 text-[10px]">MASTERCARD</span>
          </div>
        </div>
        <p className="text-[10px] text-on-surface-variant mt-8 normal-case tracking-normal">© 2026 OVERLORD TOYS. ENGINEERED FOR COLLECTORS.</p>
      </div>
    </footer>
  );
}
