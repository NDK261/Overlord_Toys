import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * Tạo một instance Supabase client dùng cho Server Components, Route Handlers, hoặc Server Actions.
 * Tận dụng @supabase/ssr để quản lý session thông qua Cookies.
 */
export function createPublicServerSupabaseClient() {
  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      async getAll() {
        const cookieStore = await cookies();
        return cookieStore.getAll();
      },
      async setAll(cookiesToSet: any[]) {
        try {
          const cookieStore = await cookies();
          cookiesToSet.forEach(({ name, value, options }: { name: string, value: string, options: any }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Có thể bỏ qua nếu được gọi từ Server Component thuần túy
        }
      },
    },
  });
}
