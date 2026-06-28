import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.tmdb.org",
        pathname: "/t/p/**",
      },
    ],
    minimumCacheTTL: 604800, // 7 jours — les posters TMDB ne changent pas souvent
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
