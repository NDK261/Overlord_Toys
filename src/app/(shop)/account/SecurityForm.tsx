"use client";

import { useState } from "react";

interface SecurityFormProps {
  updatePassword: (password: string) => Promise<void>;
}

export function SecurityForm({ updatePassword }: SecurityFormProps) {
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  
  const [passwordStatus, setPasswordStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

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

  return (
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
  );
}
