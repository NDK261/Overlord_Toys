"use client";

import { FormEvent, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function AdminTopSearch() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isProductsPage = pathname.startsWith("/admin/products");
  const currentQuery = isProductsPage ? searchParams.get("q") ?? "" : "";
  const [value, setValue] = useState(currentQuery);

  useEffect(() => {
    setValue(currentQuery);
  }, [currentQuery]);

  const buildProductsUrl = (term: string) => {
    const params = isProductsPage
      ? new URLSearchParams(searchParams.toString())
      : new URLSearchParams();

    if (term) {
      params.set("q", term);
    } else {
      params.delete("q");
    }

    const queryString = params.toString();
    return queryString ? `/admin/products?${queryString}` : "/admin/products";
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    router.push(buildProductsUrl(value.trim()));
  };

  const handleClear = () => {
    setValue("");
    router.push(buildProductsUrl(""));
  };

  return (
    <form
      className="relative flex w-full items-center rounded-full border border-outline-variant/15 bg-surface-container-lowest px-4 py-2 transition-all focus-within:border-primary-container/40 md:w-64"
      onSubmit={handleSubmit}
    >
      <button
        aria-label="Search product records"
        className="flex items-center text-on-surface-variant/60 transition-colors hover:text-cyan-300"
        type="submit"
      >
        <span className="material-symbols-outlined text-lg">search</span>
      </button>
      <input
        aria-label="Search product records"
        className="ml-2 w-full border-none bg-transparent pr-7 text-sm text-on-surface outline-none placeholder:text-on-surface-variant/40 focus:ring-0"
        onChange={(event) => setValue(event.target.value)}
        placeholder="Scan products..."
        type="text"
        value={value}
      />
      {value.trim().length > 0 && (
        <button
          aria-label="Clear product search"
          className="absolute right-4 top-1/2 flex -translate-y-1/2 items-center text-on-surface-variant/50 transition-colors hover:text-on-surface"
          onClick={handleClear}
          type="button"
        >
          <span className="material-symbols-outlined text-base">close</span>
        </button>
      )}
    </form>
  );
}
