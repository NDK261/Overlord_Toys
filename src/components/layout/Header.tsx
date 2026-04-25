"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import CartLink from "@/components/layout/CartLink";
import UserAuthSection from "@/components/layout/UserAuthSection";

export default function Header() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === '/shop') {
      return pathname === '/shop' || pathname.startsWith('/category') || pathname.startsWith('/product');
    }
    return pathname === path;
  };

  const getLinkClasses = (path: string) => {
    const active = isActive(path);
    return `transition-all duration-300 font-medium pb-1 ${
      active 
        ? "text-[#6FF7E8] font-bold border-b-2 border-[#6FF7E8] shadow-[0_2px_10px_rgba(111,247,232,0.2)]" 
        : "text-[#EAFAF8]/70 hover:text-[#6FF7E8]"
    }`;
  };

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-8 py-4 w-full max-w-none bg-[#06151a]/80 backdrop-blur-xl border-b border-[#6FF7E8]/10 shadow-[0_0_20px_rgba(111,247,232,0.05)] font-['Plus_Jakarta_Sans'] tracking-tight">
      <div className="flex items-center gap-12">
        <Link className="text-2xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-[#6FF7E8] to-[#1F7EA1] hover:opacity-80 transition-opacity" href="/">OVERLORD TOYS</Link>
        <nav className="hidden md:flex items-center gap-8">
          <Link className={getLinkClasses('/shop')} href="/shop">Shop All</Link>

          {/* CATEGORIES MASTER DROPDOWN */}
          <div className="relative group px-2 py-4 -my-4">
            <button className={`transition-colors flex items-center gap-1 font-medium bg-transparent ${pathname.startsWith('/category') ? 'text-[#6FF7E8]' : 'text-[#EAFAF8]/70 hover:text-[#6FF7E8]'}`}>
              Categories <span className="material-symbols-outlined text-[16px] group-hover:rotate-180 transition-transform duration-300">expand_more</span>
            </button>
            
            {/* WIDE MEGA MENU CONTAINER */}
            <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 w-[600px] cursor-default">
              <div className="bg-[#0a1f26]/95 border border-[#6FF7E8]/30 rounded-xl shadow-[0_4px_30px_rgba(0,0,0,0.8)] p-6 backdrop-blur-xl grid grid-cols-3 gap-6">
                
                {/* COLUMN 1 */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 mb-2 border-b border-[#6FF7E8]/20 pb-2">
                    <span className="material-symbols-outlined text-[#6FF7E8] text-[18px]">smart_toy</span>
                    <span className="text-sm uppercase text-[#6FF7E8] font-bold">Gundam</span>
                  </div>
                  <Link href="/shop?category=gundam-1-48" className="text-sm text-[#EAFAF8]/80 hover:text-[#6FF7E8] hover:bg-[#6FF7E8]/10 px-2 py-1 -ml-2 rounded-md transition-colors font-medium">Kích thước 1/48</Link>
                  <Link href="/shop?category=gundam-1-144" className="text-sm text-[#EAFAF8]/80 hover:text-[#6FF7E8] hover:bg-[#6FF7E8]/10 px-2 py-1 -ml-2 rounded-md transition-colors font-medium">Kích thước 1/144</Link>
                  
                  <div className="flex items-center gap-2 mt-4 mb-2 border-b border-[#6FF7E8]/20 pb-2">
                    <span className="material-symbols-outlined text-[#6FF7E8] text-[18px]">toys</span>
                    <span className="text-sm uppercase text-[#6FF7E8] font-bold">RC Car</span>
                  </div>
                  <Link href="/shop?category=rc-car" className="text-sm text-[#EAFAF8]/80 hover:text-[#6FF7E8] hover:bg-[#6FF7E8]/10 px-2 py-1 -ml-2 rounded-md transition-colors font-medium">Tất cả RC Car</Link>
                </div>

                {/* COLUMN 2 */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 mb-2 border-b border-[#6FF7E8]/20 pb-2">
                    <span className="material-symbols-outlined text-[#6FF7E8] text-[18px]">sailing</span>
                    <span className="text-sm uppercase text-[#6FF7E8] font-bold">One Piece</span>
                  </div>
                  <Link href="/shop?category=one-piece-figure" className="text-sm text-[#EAFAF8]/80 hover:text-[#6FF7E8] hover:bg-[#6FF7E8]/10 px-2 py-1 -ml-2 rounded-md transition-colors font-medium">Figure One Piece</Link>
                  <Link href="/shop?category=one-piece-3d-lamps" className="text-sm text-[#EAFAF8]/80 hover:text-[#6FF7E8] hover:bg-[#6FF7E8]/10 px-2 py-1 -ml-2 rounded-md transition-colors font-medium">One Piece 3D Lamps</Link>
                  <Link href="/shop?category=one-piece-wall-arts" className="text-sm text-[#EAFAF8]/80 hover:text-[#6FF7E8] hover:bg-[#6FF7E8]/10 px-2 py-1 -ml-2 rounded-md transition-colors font-medium">One Piece Wall Arts</Link>
                </div>

                {/* COLUMN 3 */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 mb-2 border-b border-[#6FF7E8]/20 pb-2">
                    <span className="material-symbols-outlined text-[#6FF7E8] text-[18px]">extension</span>
                    <span className="text-sm uppercase text-[#6FF7E8] font-bold">Lego</span>
                  </div>
                  <Link href="/shop?category=lego-super-car" className="text-sm text-[#EAFAF8]/80 hover:text-[#6FF7E8] hover:bg-[#6FF7E8]/10 px-2 py-1 -ml-2 rounded-md transition-colors font-medium">Lego Super Car</Link>
                  <Link href="/shop?category=lego-ninjago" className="text-sm text-[#EAFAF8]/80 hover:text-[#6FF7E8] hover:bg-[#6FF7E8]/10 px-2 py-1 -ml-2 rounded-md transition-colors font-medium">Lego Ninja Go</Link>
                  <Link href="/shop?category=lego-harry-potter" className="text-sm text-[#EAFAF8]/80 hover:text-[#6FF7E8] hover:bg-[#6FF7E8]/10 px-2 py-1 -ml-2 rounded-md transition-colors font-medium">Lego Harry Potter</Link>
                </div>

              </div>
            </div>
          </div>

          <Link className={getLinkClasses('/about')} href="/about">About Us</Link>
          
          <div className="h-6 w-px bg-[#6FF7E8]/20 mx-2" />
          <Link className={getLinkClasses('/account/orders')} href="/account/orders">Track Order</Link>
        </nav>
      </div>
      <div className="flex items-center gap-6">
        <div className="relative hidden lg:block">
          <input className="bg-[#0a1f26]/50 border border-[#6FF7E8]/20 focus:ring-1 focus:ring-[#6FF7E8] focus:border-[#6FF7E8] rounded-xl pl-10 pr-4 py-2 w-64 text-sm transition-all text-[#EAFAF8] placeholder:text-[#EAFAF8]/30" placeholder="Search toys..." type="text"/>
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#6FF7E8]/40 text-lg">search</span>
        </div>
        <div className="flex items-center gap-4">
          <CartLink />
          <UserAuthSection />
        </div>
      </div>
    </header>
  );
}
