"use client";

import { useState } from "react";
import { UserProfile } from "@/hooks/useUser";

interface AccountFormProps {
  initialProfile: UserProfile | null;
  userEmail: string;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
}

export function AccountForm({ initialProfile, userEmail, updateProfile }: AccountFormProps) {
  const [formData, setFormData] = useState({
    full_name: initialProfile?.full_name || "",
    phone: initialProfile?.phone || "",
    address: initialProfile?.address || ""
  });
  
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

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

  return (
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
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/70 px-1 ml-1">Email <span className="text-[#6FF7E8]/50 ml-2">{"// Immutable"}</span></label>
          <input 
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-on-surface-variant cursor-not-allowed opacity-50 outline-none" 
            disabled 
            type="email" 
            value={userEmail} 
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
  );
}
