import { createPublicServerSupabaseClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AccountFormWrapper, SecurityFormWrapper } from "./AccountClientWrappers";
import { UserProfile } from "@/hooks/useUser";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const supabase = createPublicServerSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login?callbackUrl=/account");
  }

  // Fetch profile on server
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", session.user.id)
    .single();

  return (
    <>
      <div className="mb-12">
        <span className="text-xs font-bold tracking-[0.3em] uppercase text-primary-container mb-2 block animate-pulse font-mono">Collector Access // Secured</span>
        <h1 className="text-5xl md:text-6xl font-black text-gradient font-headline tracking-tighter">
          My Account
        </h1>
      </div>

      <div className="glass-card rounded-2xl p-6 md:p-10 border border-white/5 bg-[#0A1010]/50 shadow-2xl">
        <header className="mb-10">
          <h3 className="text-2xl font-bold text-on-surface font-headline flex items-center gap-3">
            <span className="w-1.5 h-6 bg-primary-container rounded-full shadow-[0_0_10px_rgba(111,247,232,0.5)]"></span>
            Personal Information
          </h3>
          <p className="text-on-surface-variant text-sm mt-2 font-medium">Manage your core vault identity and contact protocols.</p>
        </header>

        <AccountFormWrapper 
          initialProfile={profile as UserProfile} 
          userEmail={session.user.email || ""} 
        />

        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent my-16"></div>

        <header className="mb-10">
          <h3 className="text-2xl font-bold text-on-surface font-headline flex items-center gap-3">
            <span className="w-1.5 h-6 bg-[#1F7EA1] rounded-full shadow-[0_0_10px_rgba(31,126,161,0.5)]"></span>
            Security Protocols
          </h3>
          <p className="text-on-surface-variant text-sm mt-2 font-medium">Strengthen your vault encryption with a new security key.</p>
        </header>

        <SecurityFormWrapper />
      </div>
    </>
  );
}
