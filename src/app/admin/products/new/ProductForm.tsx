"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createProduct, updateProduct, getCategories } from "../actions";
import { supabase } from "@/lib/supabase/client";

export default function ProductForm({ initialData }: { initialData?: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [thumbnailUrl, setThumbnailUrl] = useState(initialData?.thumbnail_url || "");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      setError(null);

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('products')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('products')
        .getPublicUrl(filePath);

      setThumbnailUrl(publicUrl);
    } catch (err: any) {
      console.error('Upload error:', err);
      setError(err.message || "Failed to upload image.");
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  useEffect(() => {
    async function fetchCategories() {
      const data = await getCategories();
      setCategories(data);
    }
    fetchCategories();
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const result = initialData 
      ? await updateProduct(initialData.id, formData)
      : await createProduct(formData);

    if (result.success) {
      router.push("/admin/products");
    } else {
      setError(result.error || "An error occurred");
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="glass-card rounded-2xl border border-white/10 bg-[#0A1010]/50 backdrop-blur-xl shadow-2xl overflow-hidden">
        {/* Form Header */}
        <div className="px-8 py-8 border-b border-white/5 bg-white/2">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-[#6FF7E8] animate-pulse"></span>
            <span className="text-[10px] font-black text-[#6FF7E8] uppercase tracking-[0.4em]">Neural Archive / Creation</span>
          </div>
          <h2 className="text-3xl font-black text-white font-headline tracking-tighter uppercase">
            Asset <span className="text-stroke-cyan opacity-50">Initialization</span>
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8 bg-[#06151a]">
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs font-bold uppercase tracking-widest">
              Synchronization Error: {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column: Core Identity */}
            <div className="space-y-6">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#6FF7E8]">Core Identity</h3>
              
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest ml-1">Asset Name</label>
                <input
                  required
                  defaultValue={initialData?.name}
                  name="name"
                  type="text"
                  placeholder="Enter artifact name..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/10 focus:ring-1 ring-[#6FF7E8]/50 focus:border-[#6FF7E8]/30 outline-none transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest ml-1">Neural Slug (Identity)</label>
                <input
                  defaultValue={initialData?.slug}
                  name="slug"
                  type="text"
                  placeholder="neon-overlord-gold"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-mono placeholder:text-white/10 focus:ring-1 ring-[#6FF7E8]/50 focus:border-[#6FF7E8]/30 outline-none transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest ml-1">Classification</label>
                <select
                  required
                  defaultValue={initialData?.category_id}
                  name="category_id"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:ring-1 ring-[#6FF7E8]/50 focus:border-[#6FF7E8]/30 outline-none transition-all appearance-none"
                >
                  <option value="" className="bg-[#06151a]">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id} className="bg-[#06151a]">
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest ml-1">Neural Description</label>
                <textarea
                  required
                  defaultValue={initialData?.description}
                  name="description"
                  rows={4}
                  placeholder="Describe the artifact's essence..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/10 focus:ring-1 ring-[#6FF7E8]/50 focus:border-[#6FF7E8]/30 outline-none transition-all resize-none"
                />
              </div>
            </div>

            {/* Right Column: Parameters */}
            <div className="space-y-6">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#6FF7E8]">Valuation & Logistics</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest ml-1">Price (VNĐ)</label>
                  <input
                    required
                    defaultValue={initialData?.price}
                    name="price"
                    type="number"
                    placeholder="0"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-mono placeholder:text-white/10 focus:ring-1 ring-[#6FF7E8]/50 focus:border-[#6FF7E8]/30 outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest ml-1">Core Stock</label>
                  <input
                    required
                    defaultValue={initialData?.stock}
                    name="stock"
                    type="number"
                    placeholder="0"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-mono placeholder:text-white/10 focus:ring-1 ring-[#6FF7E8]/50 focus:border-[#6FF7E8]/30 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest ml-1">Visual Protocol (URL)</label>
                <input
                  required
                  value={thumbnailUrl}
                  onChange={(e) => setThumbnailUrl(e.target.value)}
                  name="thumbnail_url"
                  type="url"
                  placeholder="https://visual-archive.ai/image.png"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/10 focus:ring-1 ring-[#6FF7E8]/50 focus:border-[#6FF7E8]/30 outline-none transition-all"
                />
              </div>

              <div 
                className={`p-6 bg-white/2 border border-white/5 rounded-2xl border-dashed cursor-pointer transition-all hover:bg-white/5 hover:border-[#6FF7E8]/50 ${uploadingImage ? 'opacity-50 pointer-events-none' : ''}`}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="flex flex-col items-center justify-center gap-2 text-on-surface-variant opacity-60">
                  {uploadingImage ? (
                    <>
                      <div className="w-8 h-8 rounded-full border-2 border-[#6FF7E8]/20 border-t-[#6FF7E8] animate-spin mb-1" />
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#6FF7E8] animate-pulse">UPLOADING TO MAINFRAME...</p>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-4xl mb-1 group-hover:text-[#6FF7E8] transition-colors">cloud_upload</span>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em]">Neural Uplink Interface</p>
                      <p className="text-[8px] uppercase tracking-widest opacity-50">Click to Select Local File</p>
                    </>
                  )}
                </div>
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                />
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-white/5 flex items-center justify-between">
            <button
              type="button"
              onClick={() => router.back()}
              className="text-on-surface-variant hover:text-white text-xs font-bold uppercase tracking-widest transition-colors"
            >
              Abort Mission
            </button>
            <button
              disabled={loading}
              type="submit"
              className="px-10 py-4 bg-gradient-to-br from-[#6ff7e8] to-[#1f7ea1] rounded-xl shadow-[0_0_20px_rgba(111,247,232,0.3)] transition-all hover:scale-[1.05] active:scale-[0.95] disabled:opacity-50 disabled:scale-100"
            >
              <span className="text-sm font-black text-[#003732] uppercase tracking-widest">
                {loading ? "Processing..." : "Commit Changes"}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
