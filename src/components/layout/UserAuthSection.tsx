"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

export default function UserAuthSection() {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        // Lấy role từ bảng profiles
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .single();
        setRole(profile?.role ?? 'customer');
      }
      setLoading(false);
    };

    getInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        setUser(session.user);
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .single();
        setRole(profile?.role ?? 'customer');
      } else {
        setUser(null);
        setRole(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setShowMenu(false);
    setRole(null);
    router.push("/login");
    router.refresh();
  };

  if (loading) {
    return (
      <div className="w-8 h-8 rounded-full bg-white/5 animate-pulse" />
    );
  }

  if (!user) {
    return (
      <Link 
        href="/login" 
        className="text-on-surface hover:text-[#6FF7E8] transition-all flex items-center gap-2 group"
      >
        <span className="material-symbols-outlined group-hover:scale-110 transition-transform">person</span>
        <span className="text-xs font-bold uppercase tracking-widest hidden md:inline">Login</span>
      </Link>
    );
  }

  return (
    <div className="relative">
      <button 
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center gap-2 text-on-surface hover:text-[#6FF7E8] transition-all group"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#6FF7E8] to-[#1F7EA1] p-[1px]">
          <div className="w-full h-full rounded-full bg-[#06151a] flex items-center justify-center overflow-hidden">
             {user.user_metadata?.avatar_url ? (
               <img src={user.user_metadata.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
             ) : (
               <span className="material-symbols-outlined text-[18px]">person</span>
             )}
          </div>
        </div>
        <span className="material-symbols-outlined text-[16px] transition-transform duration-300" style={{ transform: showMenu ? 'rotate(180deg)' : 'none' }}>
          expand_more
        </span>
      </button>

      {/* DROPDOWN MENU */}
      {showMenu && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setShowMenu(false)}
          />
          <div className="absolute top-full right-0 mt-3 w-56 z-50 bg-[#0a1f26]/95 border border-[#6FF7E8]/30 rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-xl p-2 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="px-3 py-2 border-b border-white/5 mb-1">
              <p className="text-[10px] font-black text-[#6FF7E8] uppercase tracking-widest">Signed in as</p>
              <p className="text-xs text-white truncate font-medium">{user.email}</p>
              {role === 'admin' && (
                <span className="inline-block mt-1 px-2 py-0.5 bg-[#6FF7E8]/10 text-[#6FF7E8] text-[9px] font-bold rounded uppercase tracking-widest">Administrator</span>
              )}
            </div>
            
            {role === 'admin' && (
              <Link 
                href="/admin" 
                onClick={() => setShowMenu(false)}
                className="flex items-center gap-2 px-3 py-2 text-xs text-[#6FF7E8] hover:bg-[#6FF7E8]/10 rounded-lg transition-colors font-bold"
              >
                <span className="material-symbols-outlined text-[16px]">dashboard</span>
                Dashboard
              </Link>
            )}

            <Link 
              href="/account" 
              onClick={() => setShowMenu(false)}
              className="flex items-center gap-2 px-3 py-2 text-xs text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">account_circle</span>
              Profile
            </Link>
            
            <Link 
              href="/account/orders" 
              onClick={() => setShowMenu(false)}
              className="flex items-center gap-2 px-3 py-2 text-xs text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">package_2</span>
              My Orders
            </Link>

            <Link 
              href="/account/settings" 
              onClick={() => setShowMenu(false)}
              className="flex items-center gap-2 px-3 py-2 text-xs text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">settings</span>
              Settings
            </Link>

            <button 
              onClick={handleSignOut}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors mt-1 border-t border-white/5"
            >
              <span className="material-symbols-outlined text-[16px]">logout</span>
              Sign Out
            </button>
          </div>
        </>
      )}
    </div>
  );
}
