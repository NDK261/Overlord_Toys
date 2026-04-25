import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * Tạo một instance Supabase client dùng cho Client Components (Trình duyệt).
 * File này không được chứa bất kỳ import nào từ "next/headers".
 */
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);

export function hasPublicSupabaseEnv() {
  return Boolean(supabaseUrl && supabaseAnonKey);
}
