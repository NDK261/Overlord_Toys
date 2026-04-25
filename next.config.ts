import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "via.placeholder.com",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "bandai-hobby.net",
      },
      {
        protocol: "https",
        hostname: "p-bandai.com",
      },
      {
        protocol: "https",
        hostname: "blogger.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "www.hlj.com",
      },
      {
        protocol: "https",
        hostname: "onepiece.b-cdn.net",
      },
      {
        protocol: "https",
        hostname: "onepiece.store",
      },
      {
        protocol: "https",
        hostname: "ae01.alicdn.com",
      },
      {
        protocol: "https",
        hostname: "bizweb.dktcdn.net",
      },
      {
        protocol: "https",
        hostname: "i1.haypley.com",
      },
      {
        protocol: "https",
        hostname: "s13emagst.akamaized.net",
      },
      {
        protocol: "https",
        hostname: "c.cdnmp.net",
      },
    ],
  },
};

export default nextConfig;
