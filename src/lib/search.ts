import type { Product } from "@/types/product";

export type SearchableProduct = Pick<
  Product,
  "id" | "name" | "slug" | "description" | "price" | "thumbnail_url"
> & {
  category?: {
    name?: string | null;
    slug?: string | null;
  } | null;
};

const SYNONYM_GROUPS = [
  [
    "toy",
    "toys",
    "do choi",
    "collectible",
    "collectibles",
    "hang suu tam",
    "artifact",
    "artifacts",
  ],
  [
    "figure",
    "figurine",
    "action figure",
    "model",
    "models",
    "mo hinh",
    "tuong",
    "nhan vat",
    "statue",
  ],
  [
    "gundam",
    "gunpla",
    "mecha",
    "sci fi",
    "sci-fi",
    "cyber",
    "robot",
    "nguoi may",
    "mo hinh lap rap",
    "lap rap",
  ],
  [
    "lego",
    "brick",
    "bricks",
    "building set",
    "xep hinh",
    "bo lap rap",
  ],
  ["one piece", "anime", "manga", "hai tac", "luffy", "zoro", "nami"],
  [
    "rc car",
    "remote control car",
    "radio control car",
    "car",
    "cars",
    "xe",
    "xe dieu khien",
    "xe mo hinh",
    "sieu xe",
  ],
  [
    "drone",
    "drones",
    "flycam",
    "aircraft",
    "may bay",
    "may bay dieu khien",
    "do choi bay",
  ],
  [
    "helmet",
    "helmets",
    "accessory",
    "accessories",
    "phu kien",
    "mu",
    "mu bao hiem",
  ],
  ["lamp", "lamps", "light", "lights", "den", "den ngu", "den 3d"],
  [
    "wall art",
    "wall arts",
    "poster",
    "tranh",
    "tranh treo tuong",
    "decor",
    "decoration",
    "trang tri",
  ],
  [
    "pre order",
    "pre-order",
    "dat truoc",
    "limited",
    "limited edition",
    "phien ban gioi han",
  ],
].map((group) => group.map(normalizeSearchText));

export function normalizeSearchText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\u0111/g, "d")
    .replace(/\u0110/g, "D")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getSearchTokens(value: string) {
  return normalizeSearchText(value)
    .split(" ")
    .filter((token) => token.length >= 3 || token === "rc" || token === "xe");
}

export function getExpandedSearchTerms(search: string) {
  const normalized = normalizeSearchText(search).slice(0, 80);
  if (!normalized) return [];

  const terms = new Set<string>([normalized, ...getSearchTokens(normalized)]);

  for (const group of SYNONYM_GROUPS) {
    const matched = group.some(
      (term) => terms.has(term) || normalized.includes(term)
    );

    if (matched) {
      group.forEach((term) => terms.add(term));
    }
  }

  return Array.from(terms)
    .filter((term) => term.length >= 2)
    .sort((a, b) => b.length - a.length);
}

export function buildProductSearchText(product: SearchableProduct) {
  return normalizeSearchText(
    [
      product.name,
      product.slug,
      product.description,
      product.category?.name,
      product.category?.slug,
    ]
      .filter(Boolean)
      .join(" ")
  );
}

export function productMatchesSearch(product: SearchableProduct, search: string) {
  const terms = getExpandedSearchTerms(search);
  if (!terms.length) return true;

  const haystack = buildProductSearchText(product);
  return terms.some((term) => haystack.includes(term));
}
