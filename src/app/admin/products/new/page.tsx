import Link from "next/link";
import ProductForm from "./ProductForm";

export default async function AdminNewProductPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Section */}
      <div className="flex items-center gap-4">
        <Link 
          href="/admin/products" 
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white hover:bg-[#6FF7E8] hover:text-[#003732] transition-all"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </Link>
        <div>
          <h1 className="text-4xl font-black text-white font-headline tracking-tighter uppercase">
            Thêm sản phẩm <span className="text-[#6FF7E8]">New Archive</span>
          </h1>
          <p className="text-on-surface-variant text-sm mt-1">Khởi tạo một thực thể mới vào kho lưu trữ Overlord.</p>
        </div>
      </div>

      {/* Main Form Content */}
      <ProductForm />
    </div>
  );
}
