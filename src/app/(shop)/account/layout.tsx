"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@/hooks/useUser";

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, profile, loading } = useUser();

  const displayName = profile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || "Collector";
  const avatarUrl = user?.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${displayName}&background=6FF7E8&color=003732`;

  return (
    <div className="flex min-h-[calc(100vh-80px)] max-w-[1600px] mx-auto w-full relative">
      {/* SideNavBar */}
      <aside className="hidden md:flex w-72 flex-col bg-surface-container-low/50 backdrop-blur-3xl border-r border-white/5 font-['Inter'] text-sm tracking-wide pt-12 sticky top-[80px] h-screen overflow-y-auto z-10 custom-scrollbar">
        <div className="px-8 mb-10">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-full overflow-hidden border-2 border-primary-container/30 p-0.5 ${loading ? 'animate-pulse bg-white/5' : ''}`}>
              {!loading && (
                <img alt="Collector Profile Avatar" className="w-full h-full object-cover rounded-full" src={avatarUrl}/>
              )}
            </div>
            <div>
              <div className="text-on-surface font-bold text-lg truncate max-w-[150px]">
                {loading ? "Loading..." : displayName}
              </div>
              <div className="text-primary-container/70 text-xs font-label">
                {profile?.role === 'admin' ? 'Security Administrator' : 'Elite Tier Status'}
              </div>
            </div>
          </div>
        </div>
        
        <nav className="flex flex-col flex-1">
          <Link href="/account" className={`${pathname === "/account" ? 'bg-primary-container/10 text-primary-container border-r-2 border-primary-container font-bold' : 'text-on-surface-variant hover:bg-white/5'} py-3 px-6 transition-all ease-in-out hover:translate-x-1 duration-200 flex items-center gap-3`}>
            <span className="material-symbols-outlined">person</span>
            Profile
          </Link>
          <Link href="/account/orders" className={`${pathname?.includes("/account/orders") ? 'bg-primary-container/10 text-primary-container border-r-2 border-primary-container font-bold' : 'text-on-surface-variant hover:bg-white/5'} py-3 px-6 transition-all ease-in-out hover:translate-x-1 duration-200 flex items-center gap-3`}>
            <span className="material-symbols-outlined">receipt_long</span>
            My Orders
          </Link>

          <Link href="/account/settings" className={`${pathname === "/account/settings" ? 'bg-primary-container/10 text-primary-container border-r-2 border-primary-container font-bold' : 'text-on-surface-variant hover:bg-white/5'} py-3 px-6 transition-all ease-in-out hover:translate-x-1 duration-200 flex items-center gap-3`}>
            <span className="material-symbols-outlined">settings</span>
            Settings
          </Link>
        </nav>
        
        <div className="p-6 mt-auto">
          <button className="w-full py-3 bg-gradient-to-r from-primary-container/20 to-blue-500/20 border border-primary-container/30 rounded-xl text-primary-container font-bold hover:from-primary-container/30 hover:to-blue-500/30 transition-all">
            Upgrade to VIP
          </button>
        </div>
      </aside>

      {/* Main Content Canvas */}
      <main className="flex-1 p-8 pt-12 pb-24 min-w-0">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
