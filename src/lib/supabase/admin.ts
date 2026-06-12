import { createClient } from "@supabase/supabase-js";
import { createPublicServerSupabaseClient } from "./server";

export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseServiceRoleKey) {
    console.warn("WARNING: SUPABASE_SERVICE_ROLE_KEY is not set in environment variables. Falling back to anon key (which will likely fail due to RLS).");
  }

  return createClient(supabaseUrl, supabaseServiceRoleKey || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export async function verifyAdmin() {
  const supabase = createPublicServerSupabaseClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    throw new Error("Unauthorized: Phiên đăng nhập không hợp lệ.");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profileError || profile?.role !== "admin") {
    throw new Error("Unauthorized: Bạn không có quyền truy cập quản trị viên.");
  }
}

