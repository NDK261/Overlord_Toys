"use client";

import { Suspense } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { AdminTopSearch } from "@/components/admin/AdminTopSearch";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="bg-surface overflow-x-hidden font-body text-on-surface min-h-screen">
      {/* SideNavBar */}
      <aside className="h-screen w-64 fixed left-0 top-0 bg-[#06151a] backdrop-blur-xl flex flex-col py-8 z-50 border-r border-outline-variant/10 shadow-[0_0_40px_rgba(78,219,205,0.05)]">
        <div className="px-8 mb-12">
          <h1 className="text-2xl font-black bg-gradient-to-r from-[#6FF7E8] to-[#1F7EA1] bg-clip-text text-transparent font-headline tracking-tighter">OVERLORD</h1>
          <p className="text-[10px] tracking-[0.2em] text-on-surface-variant/50 font-headline uppercase mt-1">Neural Archive</p>
        </div>
        
        <nav className="flex-1 flex flex-col gap-1">
          <Link href="/admin" className={`${pathname === "/admin" ? 'text-cyan-300 font-bold border-r-2 border-cyan-400 bg-[#28373d]/20' : 'text-on-surface/70 hover:bg-[#28373d]/40 group'} flex items-center gap-4 px-8 py-4 transition-all duration-300`}>
            <span className={`material-symbols-outlined ${pathname !== "/admin" && 'group-hover:text-cyan-400'}`}>dashboard</span>
            <span className="font-headline tracking-wide text-sm">Dashboard</span>
          </Link>
          <Link href="/admin/products" className={`${pathname?.includes("/admin/products") ? 'text-cyan-300 font-bold border-r-2 border-cyan-400 bg-[#28373d]/20' : 'text-on-surface/70 hover:bg-[#28373d]/40 group'} flex items-center gap-4 px-8 py-4 transition-all duration-300`}>
            <span className={`material-symbols-outlined ${!pathname?.includes("/admin/products") && 'group-hover:text-cyan-400'}`}>inventory_2</span>
            <span className="font-headline tracking-wide text-sm">Products</span>
          </Link>
          <Link href="/admin/orders" className={`${pathname?.includes("/admin/orders") ? 'text-cyan-300 font-bold border-r-2 border-cyan-400 bg-[#28373d]/20' : 'text-on-surface/70 hover:bg-[#28373d]/40 group'} flex items-center gap-4 px-8 py-4 transition-all duration-300`}>
            <span className={`material-symbols-outlined ${!pathname?.includes("/admin/orders") && 'group-hover:text-cyan-400'}`}>shopping_cart</span>
            <span className="font-headline tracking-wide text-sm">Orders</span>
          </Link>
          <Link href="/admin/customers" className={`${pathname?.includes("/admin/customers") ? 'text-cyan-300 font-bold border-r-2 border-cyan-400 bg-[#28373d]/20' : 'text-on-surface/70 hover:bg-[#28373d]/40 group'} flex items-center gap-4 px-8 py-4 transition-all duration-300`}>
            <span className={`material-symbols-outlined ${!pathname?.includes("/admin/customers") && 'group-hover:text-cyan-400'}`}>groups</span>
            <span className="font-headline tracking-wide text-sm">Customers</span>
          </Link>
          <Link href="/admin/analytics" className={`${pathname?.includes("/admin/analytics") ? 'text-cyan-300 font-bold border-r-2 border-cyan-400 bg-[#28373d]/20' : 'text-on-surface/70 hover:bg-[#28373d]/40 group'} flex items-center gap-4 px-8 py-4 transition-all duration-300`}>
            <span className={`material-symbols-outlined ${!pathname?.includes("/admin/analytics") && 'group-hover:text-cyan-400'}`}>monitoring</span>
            <span className="font-headline tracking-wide text-sm">Analytics</span>
          </Link>
        </nav>

        <div className="mt-auto px-6 border-t border-outline-variant/10 pt-6">
          <div className="flex items-center gap-3 mb-6 px-2">
            <div className="w-10 h-10 rounded-full border border-primary/20 p-0.5">
              <Image width={40} height={40} alt="Admin User" className="w-full h-full rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDSpDoiivnwOtSDb3XE52L5AinqCvsD90Z8aBicnSp11-eGf4sdScZJNKU2rLE-A-QGBUUGIrSWjh7Po-mKnbRXQIJxIC6ZFxea7wcF1xJ432YjzRrA9JV0I7OsmXVCPibyv_QhzLL6FsxRfF4qYrcPV2oetQFWAsSU9o4xvw5AtK3ic6PJkb1XPZW20GTOBb_a1fl6OEqUoM5XAUSVd_pniQwDnABxBDZ_5yfOTTvVNLIFTzsaNxEwXtlrPWD5q1jRXKFAdoGm9Rg"/>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-on-surface">Admin User</span>
              <span className="text-[10px] text-on-surface-variant">Core Access</span>
            </div>
          </div>
          <button className="w-full flex items-center gap-4 px-2 py-3 text-on-surface/70 hover:text-error transition-colors cursor-pointer">
            <span className="material-symbols-outlined">logout</span>
            <span className="font-headline tracking-wide text-sm">Logout</span>
          </button>
        </div>
      </aside>

      {/* TopAppBar */}
      <header className="sticky top-0 w-full z-40 bg-[#06151a]/80 backdrop-blur-md flex flex-wrap md:flex-nowrap justify-between items-center px-6 md:px-12 py-6 ml-0 md:ml-64 max-w-full md:max-w-[calc(100%-16rem)] border-b border-outline-variant/10">
        <div className="flex flex-col mb-4 md:mb-0">
          <h2 className="text-2xl font-bold font-headline text-on-surface tracking-tight capitalize">
            {pathname === "/admin" ? "Dashboard" : pathname?.split('/').pop()}
          </h2>
          <nav className="flex items-center gap-2 text-[11px] uppercase tracking-[0.1em] text-on-surface-variant/60">
            <span>Admin</span>
            <span className="material-symbols-outlined text-[10px]">chevron_right</span>
            <span className="text-cyan-400 capitalize">{pathname === "/admin" ? "Dashboard" : pathname?.split('/').pop()}</span>
          </nav>
        </div>
        
        <div className="flex items-center gap-4 md:gap-8 w-full md:w-auto">
          <Suspense
            fallback={
              <div className="relative flex items-center bg-surface-container-lowest border border-outline-variant/15 rounded-full px-4 py-2 w-full md:w-64">
                <span className="material-symbols-outlined text-on-surface-variant/60 text-lg">search</span>
                <input className="bg-transparent border-none focus:ring-0 text-sm text-on-surface placeholder:text-on-surface-variant/40 w-full ml-2 outline-none" placeholder="Scan products..." type="text" disabled />
              </div>
            }
          >
            <AdminTopSearch />
          </Suspense>
          <div className="flex items-center gap-2 md:gap-4">
            <button className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-surface-variant transition-colors text-on-surface-variant relative">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-2 right-2 w-2 h-2 bg-primary-container rounded-full"></span>
            </button>
            <button className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-surface-variant transition-colors text-on-surface-variant">
              <span className="material-symbols-outlined">settings</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="ml-0 md:ml-64 px-6 md:px-12 py-8 min-h-[calc(100vh-140px)]">
        {children}
      </main>

      {/* Footer */}
      <footer className="w-full py-6 ml-0 md:ml-64 bg-surface-container-lowest border-t border-outline-variant/5 flex justify-between px-6 md:px-12 items-center text-[10px] uppercase tracking-widest text-on-surface-variant/40 max-w-full md:max-w-[calc(100%-16rem)]">
        <div>
          <span className="text-cyan-500 font-bold">OVERLORD</span> © 2026 Admin Panel
        </div>
        <div className="flex gap-4 md:gap-8">
          <Link href="#" className="hover:text-cyan-300 transition-colors">Privacy Policy</Link>
          <Link href="#" className="hover:text-cyan-300 transition-colors">System Status</Link>
          <Link href="#" className="hover:text-cyan-300 transition-colors">Support</Link>
        </div>
      </footer>
    </div>
  );
}
