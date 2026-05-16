"use client";

import { FormEvent, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface ProductSearchFormProps {
  className?: string;
  inputClassName?: string;
  placeholder?: string;
}

export function ProductSearchForm({
  className = "relative",
  inputClassName = "w-full rounded-xl border border-[#6FF7E8]/20 bg-[#0a1f26]/50 py-2 pl-10 pr-10 text-sm text-[#EAFAF8] placeholder:text-[#EAFAF8]/30 outline-none transition-all focus:border-[#6FF7E8] focus:ring-1 focus:ring-[#6FF7E8]",
  placeholder = "Search toys...",
}: ProductSearchFormProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentSearch = searchParams.get("search") ?? "";
  const [value, setValue] = useState(currentSearch);

  useEffect(() => {
    setValue(currentSearch);
  }, [currentSearch]);

  const buildShopUrl = (term: string) => {
    const params =
      pathname === "/shop"
        ? new URLSearchParams(searchParams.toString())
        : new URLSearchParams();

    if (term) {
      params.set("search", term);
    } else {
      params.delete("search");
    }

    params.delete("page");
    const queryString = params.toString();

    return queryString ? `/shop?${queryString}` : "/shop";
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    router.push(buildShopUrl(value.trim()));
  };

  const handleClear = () => {
    setValue("");
    router.push(buildShopUrl(""));
  };

  return (
    <form className={className} onSubmit={handleSubmit}>
      <button
        aria-label="Search products"
        className="absolute left-3 top-1/2 flex -translate-y-1/2 items-center text-[#6FF7E8]/50 transition-colors hover:text-[#6FF7E8]"
        type="submit"
      >
        <span className="material-symbols-outlined text-lg">search</span>
      </button>
      <input
        aria-label="Search products"
        className={inputClassName}
        onChange={(event) => setValue(event.target.value)}
        placeholder={placeholder}
        type="text"
        value={value}
      />
      {value.trim().length > 0 && (
        <button
          aria-label="Clear product search"
          className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center text-[#EAFAF8]/40 transition-colors hover:text-[#EAFAF8]"
          onClick={handleClear}
          type="button"
        >
          <span className="material-symbols-outlined text-lg">close</span>
        </button>
      )}
    </form>
  );
}
