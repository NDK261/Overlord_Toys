import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const cookieStore = await cookies();
    
    // 1. Tạo Response chuyển hướng trước
    const response = NextResponse.redirect(`${origin}${next}`);

    // 2. Tạo Supabase client và gắn việc ghi cookie vào Response này
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet: any[]) {
            cookiesToSet.forEach(({ name, value, options }: { name: string, value: string, options: any }) => {
              // Đồng bộ cả với cookieStore hiện tại...
              cookieStore.set(name, value, options);
              // ...và cả với đối tượng Response chuyển hướng
              response.cookies.set(name, value, options);
            });
          },
        },
      }
    );

    // 3. Thực hiện trao đổi mã xác thực lấy session
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
      return response;
    }
  }

  // Nếu có lỗi, đẩy ngược về login kèm message lỗi
  return NextResponse.redirect(`${origin}/login?error=auth-callback-failed`);
}
