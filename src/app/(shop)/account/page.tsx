"use client";

import { useState, useEffect } from "react";
import { useUser, UserProfile } from "@/hooks/useUser";

export default function AccountPage() {
  const { user, profile, loading, updateProfile, updatePassword } = useUser();
  
  // State cho thông tin cá nhân
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    address: ""
  });
  
  // State cho mật khẩu
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [passwordStatus, setPasswordStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // Load dữ liệu từ profile vào form khi profile thay đổi
  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || "",
        phone: profile.phone || "",
        address: profile.address || ""
      });
    } else if (user?.user_metadata) {
      // Fallback lấy từ metadata nếu chưa có profile
      setFormData(prev => ({
        ...prev,
        full_name: user.user_metadata.full_name || ""
      }));
    }
  }, [profile, user]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setStatus(null);
    try {
      await updateProfile(formData);
      setStatus({ type: 'success', message: 'Hồ sơ đã được cập nhật thành công!' });
    } catch (err: any) {
      setStatus({ type: 'error', message: err.message || 'Cập nhật thất bại' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordStatus({ type: 'error', message: 'Mật khẩu xác nhận không khớp' });
      return;
    }
    
    setIsUpdatingPassword(true);
    setPasswordStatus(null);
    try {
      await updatePassword(passwordData.newPassword);
      setPasswordStatus({ type: 'success', message: 'Mật khẩu đã được thay đổi!' });
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err: any) {
      setPasswordStatus({ type: 'error', message: err.message || 'Đổi mật khẩu thất bại' });
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-container"></div>
      </div>
    );
  }

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

        <form className="space-y-8" onSubmit={handleSaveProfile}>
          {status && (
            <div className={`p-4 rounded-xl text-sm font-bold uppercase tracking-widest ${status.type === 'success' ? 'bg-[#6FF7E8]/10 text-[#6FF7E8] border border-[#6FF7E8]/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
              {status.message}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/70 px-1 ml-1">Full Name</label>
              <input 
                className="w-full bg-surface-container-highest/30 border border-white/5 rounded-xl px-4 py-4 text-on-surface focus:ring-2 focus:ring-[#6FF7E8]/30 focus:border-[#6FF7E8]/50 transition-all outline-none" 
                type="text" 
                value={formData.full_name}
                onChange={e => setFormData(f => ({ ...f, full_name: e.target.value }))}
                placeholder="Name of Collector"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/70 px-1 ml-1">Email <span className="text-[#6FF7E8]/50 ml-2">// Immutable</span></label>
              <input 
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-on-surface-variant cursor-not-allowed opacity-50 outline-none" 
                disabled 
                type="email" 
                value={user?.email || ""} 
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/70 px-1 ml-1">Phone Number</label>
              <input 
                className="w-full bg-surface-container-highest/30 border border-white/5 rounded-xl px-4 py-4 text-on-surface focus:ring-2 focus:ring-[#6FF7E8]/30 focus:border-[#6FF7E8]/50 transition-all outline-none" 
                type="tel" 
                value={formData.phone}
                onChange={e => setFormData(f => ({ ...f, phone: e.target.value }))}
                placeholder="+84..."
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/70 px-1 ml-1">Vault Address</label>
              <textarea 
                className="w-full bg-surface-container-highest/30 border border-white/5 rounded-xl px-4 py-4 text-on-surface focus:ring-2 focus:ring-[#6FF7E8]/30 focus:border-[#6FF7E8]/50 transition-all outline-none resize-none" 
                rows={3} 
                value={formData.address}
                onChange={e => setFormData(f => ({ ...f, address: e.target.value }))}
                placeholder="Shipping deployment sector..."
              ></textarea>
            </div>
          </div>
          <div className="pt-4">
            <button 
              className="group bg-gradient-primary px-10 py-4 rounded-xl text-[#003732] font-black text-xs uppercase tracking-[0.2em] flex items-center gap-3 hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(111,247,232,0.2)]" 
              type="submit"
              disabled={isSaving}
            >
              {isSaving ? "Syncing..." : "Save Changes"}
              <span className="material-symbols-outlined text-lg group-hover:rotate-180 transition-transform duration-500">sync</span>
            </button>
          </div>
        </form>

        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent my-16"></div>

        <header className="mb-10">
          <h3 className="text-2xl font-bold text-on-surface font-headline flex items-center gap-3">
            <span className="w-1.5 h-6 bg-[#1F7EA1] rounded-full shadow-[0_0_10px_rgba(31,126,161,0.5)]"></span>
            Security Protocols
          </h3>
          <p className="text-on-surface-variant text-sm mt-2 font-medium">Strengthen your vault encryption with a new security key.</p>
        </header>

        <form className="space-y-8" onSubmit={handleUpdatePassword}>
          {passwordStatus && (
            <div className={`p-4 rounded-xl text-sm font-bold uppercase tracking-widest ${passwordStatus.type === 'success' ? 'bg-[#6FF7E8]/10 text-[#6FF7E8] border border-[#6FF7E8]/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
              {passwordStatus.message}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2 md:col-span-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/70 px-1 ml-1">Current Password</label>
              <input 
                className="w-full bg-surface-container-highest/30 border border-white/5 rounded-xl px-4 py-4 text-on-surface focus:ring-2 focus:ring-[#6FF7E8]/30 outline-none" 
                placeholder="••••••••••••" 
                type="password" 
                value={passwordData.currentPassword}
                onChange={e => setPasswordData(p => ({ ...p, currentPassword: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/70 px-1 ml-1">New Password</label>
              <input 
                className="w-full bg-surface-container-highest/30 border border-white/5 rounded-xl px-4 py-4 text-on-surface focus:ring-2 focus:ring-[#6FF7E8]/30 outline-none" 
                placeholder="••••••••••••" 
                type="password" 
                value={passwordData.newPassword}
                onChange={e => setPasswordData(p => ({ ...p, newPassword: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/70 px-1 ml-1">Confirm New Password</label>
              <input 
                className="w-full bg-surface-container-highest/30 border border-white/5 rounded-xl px-4 py-4 text-on-surface focus:ring-2 focus:ring-[#6FF7E8]/30 outline-none" 
                placeholder="••••••••••••" 
                type="password" 
                value={passwordData.confirmPassword}
                onChange={e => setPasswordData(p => ({ ...p, confirmPassword: e.target.value }))}
                required
              />
            </div>
          </div>
          <div className="pt-4">
            <button 
              className="border border-white/10 hover:border-[#6FF7E8]/50 hover:bg-[#6FF7E8]/5 text-on-surface px-10 py-4 rounded-xl font-black text-xs uppercase tracking-[0.2em] transition-all disabled:opacity-50" 
              type="submit"
              disabled={isUpdatingPassword}
            >
              {isUpdatingPassword ? "Encrypting..." : "Update Security Key"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
