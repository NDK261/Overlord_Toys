"use client";

// src/hooks/useUser.ts
// Custom hook quản lý session người dùng qua Supabase Auth

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client"; // Sử dụng client chuẩn
import type { User, Session } from "@supabase/supabase-js";

export interface UserProfile {
  id: string;
  full_name: string | null;
  phone: string | null;
  address: string | null;
  role: "user" | "admin";
}

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();
      
      if (!error && data) {
        setProfile(data);
      } else if (error && error.code === 'PGRST116') {
        // Profile chưa tồn tại, có thể là user mới
        setProfile(null);
      }
    } catch (err) {
      console.error("Lỗi fetch profile:", err);
    }
  };

  useEffect(() => {
    // 1. Lấy session hiện tại
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id);
      setLoading(false);
    });

    // 2. Lắng nghe thay đổi auth state
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  /** Cập nhật thông tin profile */
  async function updateProfile(updates: Partial<UserProfile>) {
    if (!user) throw new Error("Chưa đăng nhập");

    const { error } = await supabase
      .from("profiles")
      .upsert({
        id: user.id,
        ...updates,
        updated_at: new Date().toISOString(),
      });

    if (error) throw error;
    
    // Refresh local state
    await fetchProfile(user.id);
  }

  /** Cập nhật mật khẩu */
  async function updatePassword(newPassword: string) {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });
    if (error) throw error;
  }

  /** Đăng nhập bằng Email + Password */
  async function signIn(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  }

  /** Đăng ký tài khoản mới */
  async function signUp(email: string, password: string, fullName: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    });
    return { data, error };
  }

  /** Đăng xuất */
  async function signOut() {
    await supabase.auth.signOut();
    setProfile(null);
    setUser(null);
  }

  /** Kiểm tra có phải admin không */
  const isAdmin = profile?.role === "admin";

  /** Kiểm tra đã đăng nhập */
  const isAuthenticated = !!user;

  return {
    user,
    profile,
    session,
    loading,
    isAdmin,
    isAuthenticated,
    signIn,
    signUp,
    signOut,
    updateProfile,
    updatePassword,
    refreshProfile: () => user && fetchProfile(user.id)
  };
}
