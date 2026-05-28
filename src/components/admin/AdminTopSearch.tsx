"use client";

import {
  FormEvent,
  KeyboardEvent,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useAccountSettings } from "@/hooks/useAccountSettings";

type ProductSuggestion = {
  id: string;
  name: string;
  slug: string;
  price: number;
  thumbnail_url: string | null;
  categoryName: string | null;
};

const ADMIN_SEARCH_COPY = {
  en: {
    placeholder: "Scan products...",
    suggestions: "Product suggestions",
    loading: "Loading inventory matches...",
    empty: "No products match this keyword yet.",
    filterFor: "Filter records for",
    unclassified: "Unclassified",
  },
  vi: {
    placeholder: "T\u00ecm s\u1ea3n ph\u1ea9m...",
    suggestions: "G\u1ee3i \u00fd s\u1ea3n ph\u1ea9m",
    loading: "\u0110ang t\u1ea3i k\u1ebft qu\u1ea3 trong kho...",
    empty: "Ch\u01b0a c\u00f3 s\u1ea3n ph\u1ea9m ph\u00f9 h\u1ee3p.",
    filterFor: "L\u1ecdc b\u1ea3n ghi theo",
    unclassified: "Ch\u01b0a ph\u00e2n lo\u1ea1i",
  },
};

function formatAdminPrice(amount: number) {
  return `${new Intl.NumberFormat("vi-VN", {
    maximumFractionDigits: 0,
  }).format(amount)} VND`;
}

export function AdminTopSearch() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { settings } = useAccountSettings();
  const copy = ADMIN_SEARCH_COPY[settings.shopping.language];
  const inputRef = useRef<HTMLInputElement>(null);
  const blurTimerRef = useRef<number | null>(null);
  const isFocusedRef = useRef(false);
  const componentId = useId();
  const isProductsPage = pathname.startsWith("/admin/products");
  const currentQuery = isProductsPage ? searchParams.get("q") ?? "" : "";
  const suggestionsId = `${componentId}-admin-product-search-suggestions`;
  const [value, setValue] = useState(currentQuery);
  const [suggestions, setSuggestions] = useState<ProductSuggestion[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasFocus, setHasFocus] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const trimmedValue = value.trim();
  const canSuggest = trimmedValue.length >= 2;
  const visibleSuggestions = useMemo(
    () => suggestions.slice(0, 5),
    [suggestions]
  );

  useEffect(() => {
    setValue(currentQuery);
    setSuggestions([]);
    setIsLoading(false);
    setIsOpen(false);
    setActiveIndex(-1);
  }, [currentQuery]);

  useEffect(() => {
    return () => {
      if (blurTimerRef.current) {
        window.clearTimeout(blurTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    setActiveIndex(-1);

    if (!canSuggest || !hasFocus) {
      setSuggestions([]);
      setIsLoading(false);
      return;
    }

    let ignore = false;
    const timer = window.setTimeout(async () => {
      setIsLoading(true);

      try {
        const params = new URLSearchParams({ search: trimmedValue });
        const response = await fetch(`/api/products/suggestions?${params}`);
        const payload: { suggestions?: ProductSuggestion[] } =
          await response.json();

        if (!ignore && isFocusedRef.current) {
          setSuggestions(payload.suggestions ?? []);
          setIsOpen(true);
        }
      } catch {
        if (!ignore) {
          setSuggestions([]);
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }, 180);

    return () => {
      ignore = true;
      window.clearTimeout(timer);
    };
  }, [canSuggest, hasFocus, trimmedValue]);

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

  const goToFilteredProducts = (term: string) => {
    inputRef.current?.blur();
    isFocusedRef.current = false;
    setHasFocus(false);
    setIsOpen(false);
    router.push(buildProductsUrl(term.trim()));
  };

  const goToProductEditor = (suggestion: ProductSuggestion) => {
    setValue(suggestion.name);
    inputRef.current?.blur();
    isFocusedRef.current = false;
    setHasFocus(false);
    setIsOpen(false);
    router.push(`/admin/products/edit/${suggestion.id}`);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    goToFilteredProducts(value);
  };

  const handleClear = () => {
    setValue("");
    setSuggestions([]);
    inputRef.current?.blur();
    isFocusedRef.current = false;
    setHasFocus(false);
    setIsOpen(false);
    router.push(buildProductsUrl(""));
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || visibleSuggestions.length === 0) {
      if (event.key === "Escape") setIsOpen(false);
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((current) =>
        current >= visibleSuggestions.length - 1 ? 0 : current + 1
      );
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((current) =>
        current <= 0 ? visibleSuggestions.length - 1 : current - 1
      );
    }

    if (event.key === "Enter" && activeIndex >= 0) {
      event.preventDefault();
      goToProductEditor(visibleSuggestions[activeIndex]);
    }

    if (event.key === "Escape") {
      setIsOpen(false);
    }
  };

  const showDropdown = isOpen && canSuggest && hasFocus;

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
        aria-activedescendant={
          activeIndex >= 0
            ? `${componentId}-admin-product-suggestion-${activeIndex}`
            : undefined
        }
        aria-autocomplete="list"
        aria-controls={suggestionsId}
        aria-expanded={showDropdown}
        aria-label="Search product records"
        className="ml-2 w-full border-none bg-transparent pr-7 text-sm text-on-surface outline-none placeholder:text-on-surface-variant/40 focus:ring-0"
        onBlur={() => {
          isFocusedRef.current = false;
          blurTimerRef.current = window.setTimeout(() => {
            setHasFocus(false);
            setIsOpen(false);
          }, 120);
        }}
        onChange={(event) => {
          setValue(event.target.value);
          setIsOpen(isFocusedRef.current);
        }}
        onFocus={() => {
          if (blurTimerRef.current) {
            window.clearTimeout(blurTimerRef.current);
          }
          isFocusedRef.current = true;
          setHasFocus(true);
          if (canSuggest) setIsOpen(true);
        }}
        onKeyDown={handleKeyDown}
        placeholder={copy.placeholder}
        ref={inputRef}
        role="combobox"
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

      {showDropdown && (
        <div
          className="absolute left-0 right-0 top-full z-[90] mt-2 overflow-hidden rounded-xl border border-outline-variant/20 bg-surface-container-lowest shadow-[0_18px_45px_rgba(0,0,0,0.45)]"
          id={suggestionsId}
          role="listbox"
        >
          <div className="border-b border-outline-variant/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-on-surface-variant">
            {copy.suggestions}
          </div>

          {isLoading ? (
            <p className="px-4 py-3 text-xs text-on-surface-variant">
              {copy.loading}
            </p>
          ) : visibleSuggestions.length > 0 ? (
            visibleSuggestions.map((suggestion, index) => (
              <button
                aria-selected={index === activeIndex}
                className={`flex w-full items-center gap-3 px-4 py-3 text-left transition-colors ${
                  index === activeIndex
                    ? "bg-primary-container/10"
                    : "hover:bg-white/5"
                }`}
                id={`${componentId}-admin-product-suggestion-${index}`}
                key={suggestion.id}
                onMouseDown={(event) => event.preventDefault()}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => goToProductEditor(suggestion)}
                role="option"
                type="button"
              >
                <span className="h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-white/5">
                  {suggestion.thumbnail_url ? (
                    <img
                      alt={suggestion.name}
                      className="h-full w-full object-cover"
                      src={suggestion.thumbnail_url}
                    />
                  ) : (
                    <span className="material-symbols-outlined flex h-full w-full items-center justify-center text-white/20">
                      image
                    </span>
                  )}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-xs font-black text-on-surface">
                    {suggestion.name}
                  </span>
                  <span className="mt-0.5 block truncate text-[10px] text-on-surface-variant">
                    {suggestion.categoryName ?? copy.unclassified} -{" "}
                    {formatAdminPrice(suggestion.price)}
                  </span>
                </span>
              </button>
            ))
          ) : (
            <p className="px-4 py-3 text-xs text-on-surface-variant">
              {copy.empty}
            </p>
          )}

          <button
            className="flex w-full items-center justify-between border-t border-outline-variant/10 px-4 py-3 text-left text-xs font-bold text-primary-container transition-colors hover:bg-primary-container/10"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => goToFilteredProducts(value)}
            type="button"
          >
            <span>
              {copy.filterFor} "{trimmedValue}"
            </span>
            <span className="material-symbols-outlined text-base">arrow_forward</span>
          </button>
        </div>
      )}
    </form>
  );
}
