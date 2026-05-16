// src/middleware.ts
// Bảo vệ các route /admin/* bằng Supabase Auth
// Chạy trước mỗi request đến các route được match

import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });
  type CookieToSet = {
    name: string;
    value: string;
    options?: Parameters<typeof response.cookies.set>[2];
  };

  // Khởi tạo Supabase server client trong middleware
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: CookieToSet[]) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Lấy session hiện tại
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const pathname = request.nextUrl.pathname;
  const isAccountRoute = pathname.startsWith("/account");
  const isProfileRoute = pathname === "/profile";

  // Bảo vệ route /admin/*
  if (pathname.startsWith("/admin")) {
    // Chưa đăng nhập → redirect về trang login
    if (!session) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Đã đăng nhập nhưng không phải admin → redirect về trang chủ
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", session.user.id)
      .single();

    if (profile?.role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // Protect customer account routes before the client app renders.
  if ((isAccountRoute || isProfileRoute) && !session) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect signed-in users away from auth pages.
  if (session && (pathname === "/login" || pathname === "/register")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return response;
}

// Chỉ chạy middleware với các route sau
export const config = {
  matcher: [
    "/admin/:path*", // Tất cả route /admin
    "/account/:path*",
    "/login",
    "/register",
    "/profile",
  ],
};
