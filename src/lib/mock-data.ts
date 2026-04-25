import { Product } from "@/types/product";

export const products: Product[] = [
  {
    id: "1",
    name: "Cyber Rex X-1",
    slug: "cyber-rex-x-1",
    description: "Futuristic neon-lit robot toy design on a dark industrial background with cyan and magenta accents",
    price: 5680000,
    stock: 50,
    thumbnail_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuCfnuMrhlgFSE9LS-rAroY6q7rBXkTrfe9UirKbqHvvy-nDv8p9YM8CiwJf8XRYxUpXKWnEP-fugpcyjlnsNKSBmVZMITG6MDMAGH5QGoXpxgbuALbAB7Wa45TBFwXdyVp1dBffGrfcODAV095eqV_rRuUc5ZdRkJRjE6k58xdpou7o8ZbKNa3xNe_efUtIw7Gr8hXWIikbeJrx2HPdFXQPElgEVWt_bXfnZY-G06TH4_eOgVPoVf-7AJnNPvJJMR_OMQ5EDy7X7h8",
    category_id: "mecha",
    created_at: new Date().toISOString()
  },
  {
    id: "2",
    name: "Aero Glide v3",
    slug: "aero-glide-v3",
    description: "Sleek high-tech drone with glowing blue lights against a dark moody studio background with atmospheric smoke",
    price: 3290000,
    stock: 30,
    thumbnail_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuADDPKje3HlvR1SxDfmAJjKY7mZ3SyODXfN4U22mAIhaGLqVWg-ImBxXdX8TvEk3Oqn1vZQyvPUXiHMyUpsWVXJmJrmkn47gnUnMy8DFJop64RIfCmLwv9ufTvdHVkn7KqBbC3aXxF4sfqs8LDEehmUGtQ_2vUHGzOdheA1AAuA7u6nvfhq8jQjv8WsgkzD2bFVucBT7132XmbVOdOXZQuq12ZhS7SYJgiprjq86NmtDhsLAJhXOrF-Mm-RMliogH7CzU7S9pK_iZs",
    category_id: "drones",
    created_at: new Date().toISOString()
  },
  {
    id: "3",
    name: "X-01 OVERLORD PRIME",
    slug: "x-01-overlord-prime",
    description: "Close-up of a high-end designer mecha toy figure with metallic cyan details and intricate mechanical parts in a dark display room",
    price: 2450000,
    stock: 15,
    thumbnail_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuBDf4LaN4L6NaA6Dp756A_MbayflwUQrc_biAR8csZB4ZzSXkIwDd_-Fah1hxsSj5fk89a5e-aiDHDDAbxXImYx-3r7kyyUUhspr1Pph9ypYiCaaWnAos8w3F3KZfxqVOkzk9dCHgsUskTISmhIM_vuOqgADiv9HMpV8quSsLlkSYtaL0NzPO2_DydEM4vg0bW1HIugcsT8JeMsg62Ac-tAESkXGP6JwHpSkr0tcMRgnSY_stO-dEZ1TZXIXBylIIZK6ijujJdteW0",
    category_id: "mecha",
    created_at: new Date().toISOString()
  },
  {
    id: "4",
    name: "CYBER-GLOW HELMET V2",
    slug: "cyber-glow-helmet-v2",
    description: "Ultra detailed futuristic helmet prototype toy with glowing LED accents and matte black finish on a pedestal",
    price: 1820000,
    stock: 120,
    thumbnail_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuDFHW57N003EWTuophcZBgd-Gyc0cNF0MZ685aF73aN_WMguOSeNPF2HtPPYW4_JHsckvyr2nSsh8nvHcA-FiIwCMVrn8n-tUfqk6KTmMhKpxhyipSOwkrjHRI1WDx54tWD320tUIm9YbFHEY4VxQaVz2wOFxrkKrBYGOq1AV7uzEwkENa8g4nDdUHa3G3K5ePfkroBvwxqljvmha9qpFA6VRtjbi8SQELYJV2ucoYiOXLLFX5W9eXXESuo-hRdptocaY4tagO0-Xw",
    category_id: "accessories",
    created_at: new Date().toISOString()
  },
  {
    id: "5",
    name: "VOID RUNNER S-04",
    slug: "void-runner-s-04",
    description: "Minimalist sci-fi robot figurine with smooth white porcelain texture and glowing blue core in an editorial photography style",
    price: 1050000,
    stock: 200,
    thumbnail_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuADLTTO2ztWprcz8-6UJ53sqEKrwlCLOqVWfYWTb5BpPYgQrY13VWsZdrE-CzSHU6f53_vyDx_i8j8AJux89Qjd3sh2qPZqWfxVJsfO8r8nzvT8SUzv5xUDwmxvXDEOHCfPVdvn1zHrCe4f7RmvKNuzeMurlZMH4fLR6mI8N_HIHCx2oaUFkitBXSjdNFKV6xH6SHvQa91Oa9vBq4gKf-TQfm6Jc3Jx0pRyxJzZ_T5ws0xDAiGg9FNYK_JjIJsdOv7UhZydAJqnH58",
    category_id: "collectibles",
    created_at: new Date().toISOString()
  },

];

export interface MockOrder {
  id: string;
  user_id: string;
  total_amount: number;
  status: string;
  created_at: string;
  shipping_address: { name: string };
  items?: any[];
}

export const orders: MockOrder[] = [
  {
    id: 'OT-9821',
    user_id: 'user1',
    total_amount: 1250000,
    status: 'shipped',
    created_at: new Date().toISOString(),
    shipping_address: { name: 'Vance Sterling' }
  },
  {
    id: 'OT-9820',
    user_id: 'user2',
    total_amount: 850000,
    status: 'pending',
    created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
    shipping_address: { name: 'Elena Draken' }
  },
  {
    id: 'OT-9819',
    user_id: 'user3',
    total_amount: 4120000,
    status: 'shipped',
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    shipping_address: { name: 'Marcus Thorne' }
  },
  {
    id: 'OT-9818',
    user_id: 'user4',
    total_amount: 2100000,
    status: 'cancelled',
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    shipping_address: { name: 'Cora Vane' }
  }
];

export const categories = [
  { id: 'gundam-1-48', name: 'Gundam', slug: 'gundam' },
  { id: 'one-piece-figure', name: 'One Piece', slug: 'one-piece' },
  { id: 'lego-super-car', name: 'Lego', slug: 'lego' },
  { id: 'rc-car', name: 'RC Car', slug: 'rc-car' }
];

export const testimonials = [
  { id: '1', name: 'Collector A', author: 'Collector A', rating: 5, content: 'Excellent quality and details. The packaging itself is a work of art.', avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCzarMmGB9mwGYBbp-IpfhqoLSt7Y24zGLT1A2eL62M-XL7-2fXIo8_ITXDykEJsRHmoM65JvKzQaei4fX8DQuC3nG6ypMi0WDnadZTWQkyb4A_mOMQTBsJiiTEjYso5YG-ZU5xMgCpO0CEKOyaZQdKd3um82hHq7tqSwAcAQC3lMar9vuHTHj85LFi-oyrBMpwWMZcbqhL2Y5XE3TaM4GQ5fOTxuIoIFnupE6Z-sBmNEfB8ZnuIpiY_nAd4dqJZfWGLpq3UEac6GQ" },
  { id: '2', name: 'Collector B', author: 'Collector B', rating: 5, content: 'A truly breathtaking replica. Customer service was also very responsive.', avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCzarMmGB9mwGYBbp-IpfhqoLSt7Y24zGLT1A2eL62M-XL7-2fXIo8_ITXDykEJsRHmoM65JvKzQaei4fX8DQuC3nG6ypMi0WDnadZTWQkyb4A_mOMQTBsJiiTEjYso5YG-ZU5xMgCpO0CEKOyaZQdKd3um82hHq7tqSwAcAQC3lMar9vuHTHj85LFi-oyrBMpwWMZcbqhL2Y5XE3TaM4GQ5fOTxuIoIFnupE6Z-sBmNEfB8ZnuIpiY_nAd4dqJZfWGLpq3UEac6GQ" }
];

export const flashDeals = products.slice(0, 2);
