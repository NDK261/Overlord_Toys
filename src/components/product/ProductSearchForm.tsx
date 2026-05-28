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
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useAccountSettings } from "@/hooks/useAccountSettings";
import { formatAccountPrice } from "@/lib/account-settings";

interface ProductSearchFormProps {
  className?: string;
  inputClassName?: string;
  placeholder?: string;
  placeholderEn?: string;
  placeholderVi?: string;
}

type ProductSuggestion = {
  id: string;
  name: string;
  slug: string;
  price: number;
  thumbnail_url: string | null;
  categoryName: string | null;
  categorySlug: string | null;
};

const SEARCH_LABELS = {
  en: {
    placeholder: "Search toys...",
    suggestions: "Product suggestions",
    viewAll: "View all results",
    noMatches: "No direct product matches",
    loading: "Scanning products...",
  },
  vi: {
    placeholder: "T\u00ecm \u0111\u1ed3 ch\u01a1i...",
    suggestions: "G\u1ee3i \u00fd s\u1ea3n ph\u1ea9m",
    viewAll: "Xem t\u1ea5t c\u1ea3 k\u1ebft qu\u1ea3",
    noMatches: "Ch\u01b0a c\u00f3 g\u1ee3i \u00fd ph\u00f9 h\u1ee3p",
    loading: "\u0110ang t\u00ecm s\u1ea3n ph\u1ea9m...",
  },
};

export function ProductSearchForm({
  className = "relative",
  inputClassName = "w-full rounded-xl border border-[#6FF7E8]/20 bg-[#0a1f26]/50 py-2 pl-10 pr-10 text-sm text-[#EAFAF8] placeholder:text-[#EAFAF8]/30 outline-none transition-all focus:border-[#6FF7E8] focus:ring-1 focus:ring-[#6FF7E8]",
  placeholder,
  placeholderEn,
  placeholderVi,
}: ProductSearchFormProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { settings } = useAccountSettings();
  const inputRef = useRef<HTMLInputElement>(null);
  const blurTimerRef = useRef<number | null>(null);
  const isFocusedRef = useRef(false);
  const componentId = useId();
  const currentSearch = searchParams.get("search") ?? "";
  const language = settings.shopping.language;
  const labels = SEARCH_LABELS[language];
  const suggestionsId = `${componentId}-product-search-suggestions`;
  const resolvedPlaceholder =
    placeholder ??
    (language === "vi" ? placeholderVi : placeholderEn) ??
    labels.placeholder;

  const [value, setValue] = useState(currentSearch);
  const [suggestions, setSuggestions] = useState<ProductSuggestion[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasFocus, setHasFocus] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const trimmedValue = value.trim();
  const canSuggest = trimmedValue.length >= 2;

  useEffect(() => {
    setValue(currentSearch);
    setSuggestions([]);
    setIsLoading(false);
    setIsOpen(false);
    setActiveIndex(-1);
  }, [currentSearch]);

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
      const params = new URLSearchParams({ search: trimmedValue });

      if (pathname === "/shop") {
        const category = searchParams.get("category");
        const maxPrice = searchParams.get("maxPrice");

        if (category) params.set("category", category);
        if (maxPrice) params.set("maxPrice", maxPrice);
      }

      setIsLoading(true);

      try {
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
  }, [canSuggest, hasFocus, pathname, searchParams, trimmedValue]);

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

  const visibleSuggestions = useMemo(
    () => suggestions.slice(0, 6),
    [suggestions]
  );

  const goToSearch = (term: string) => {
    inputRef.current?.blur();
    isFocusedRef.current = false;
    setHasFocus(false);
    setIsOpen(false);
    router.push(buildShopUrl(term.trim()));
  };

  const goToProduct = (suggestion: ProductSuggestion) => {
    setValue(suggestion.name);
    inputRef.current?.blur();
    isFocusedRef.current = false;
    setHasFocus(false);
    setIsOpen(false);
    router.push(`/product/${suggestion.slug}`);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    goToSearch(value);
  };

  const handleClear = () => {
    setValue("");
    setSuggestions([]);
    inputRef.current?.blur();
    isFocusedRef.current = false;
    setHasFocus(false);
    setIsOpen(false);
    router.push(buildShopUrl(""));
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
      goToProduct(visibleSuggestions[activeIndex]);
    }

    if (event.key === "Escape") {
      setIsOpen(false);
    }
  };

  const showDropdown = isOpen && canSuggest && hasFocus;

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
        aria-activedescendant={
          activeIndex >= 0
            ? `${componentId}-product-suggestion-${activeIndex}`
            : undefined
        }
        aria-autocomplete="list"
        aria-controls={suggestionsId}
        aria-expanded={showDropdown}
        aria-label="Search products"
        className={inputClassName}
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
        placeholder={resolvedPlaceholder}
        ref={inputRef}
        role="combobox"
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

      {showDropdown && (
        <div
          className="absolute left-0 right-0 top-full z-[80] mt-2 overflow-hidden rounded-xl border border-[#6FF7E8]/20 bg-[#06151a]/95 shadow-[0_18px_45px_rgba(0,0,0,0.55)] backdrop-blur-xl"
          id={suggestionsId}
          role="listbox"
        >
          <div className="border-b border-white/5 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#6FF7E8]/70">
            {labels.suggestions}
          </div>

          {isLoading ? (
            <p className="px-4 py-3 text-xs text-[#EAFAF8]/60">
              {labels.loading}
            </p>
          ) : visibleSuggestions.length > 0 ? (
            visibleSuggestions.map((suggestion, index) => (
              <button
                aria-selected={index === activeIndex}
                className={`flex w-full items-center gap-3 px-4 py-3 text-left transition-colors ${
                  index === activeIndex
                    ? "bg-[#6FF7E8]/10"
                    : "hover:bg-[#6FF7E8]/5"
                }`}
                id={`${componentId}-product-suggestion-${index}`}
                key={suggestion.id}
                onMouseDown={(event) => event.preventDefault()}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => goToProduct(suggestion)}
                role="option"
                type="button"
              >
                <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-white/5">
                  {suggestion.thumbnail_url ? (
                    <Image
                      alt={suggestion.name}
                      className="h-full w-full object-cover"
                      height={44}
                      src={suggestion.thumbnail_url}
                      width={44}
                    />
                  ) : (
                    <span className="material-symbols-outlined flex h-full w-full items-center justify-center text-white/25">
                      image
                    </span>
                  )}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-bold text-[#EAFAF8]">
                    {suggestion.name}
                  </span>
                  <span className="mt-0.5 flex items-center gap-2 text-[11px] text-[#EAFAF8]/55">
                    {suggestion.categoryName && (
                      <span className="truncate">{suggestion.categoryName}</span>
                    )}
                    <span>{formatAccountPrice(suggestion.price, language)}</span>
                  </span>
                </span>
              </button>
            ))
          ) : (
            <p className="px-4 py-3 text-xs text-[#EAFAF8]/60">
              {labels.noMatches}
            </p>
          )}

          <button
            className="flex w-full items-center justify-between border-t border-white/5 px-4 py-3 text-left text-xs font-bold text-[#6FF7E8] transition-colors hover:bg-[#6FF7E8]/10"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => goToSearch(value)}
            type="button"
          >
            <span>
              {labels.viewAll}: "{trimmedValue}"
            </span>
            <span className="material-symbols-outlined text-base">arrow_forward</span>
          </button>
        </div>
      )}
    </form>
  );
}
