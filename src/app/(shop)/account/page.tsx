import { createPublicServerSupabaseClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AccountFormWrapper, SecurityFormWrapper } from "./AccountClientWrappers";
import { AccountPageTitle, AccountSectionHeader } from "./AccountLocalized";
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
      <AccountPageTitle />

      <div className="glass-card rounded-2xl p-6 md:p-10 border border-white/5 bg-[#0A1010]/50 shadow-2xl">
        <AccountSectionHeader kind="personal" />

        <AccountFormWrapper 
          initialProfile={profile as UserProfile} 
          userEmail={session.user.email || ""} 
        />

        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent my-16"></div>

        <AccountSectionHeader kind="security" />

        <SecurityFormWrapper />
      </div>
    </>
  );
}
