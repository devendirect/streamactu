import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

const nextConfig: NextConfig = {
  // Déploiement VPS/Plesk : build autonome (.next/standalone + server.js).
  // ⚠️ Après le build, copier public/ et .next/static dans le dossier standalone.
  output: "standalone",

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.tmdb.org",
        pathname: "/t/p/**",
      },
    ],
    minimumCacheTTL: 604800,
    formats: ["image/avif", "image/webp"],
  },

  async redirects() {
    return [
      // Renommage du slug « max » → « hbo-max » (2 août 2026) : la plateforme
      // n'est cherchée que sous « hbo max », jamais « max » seul. Les anciennes
      // URLs sont indexées — hub, films/series, prochaines sorties, archives
      // mensuelles et récaps annuels — d'où le wildcard sur les sous-routes.
      // 308 et non 301 : Next préserve la méthode HTTP ; Google le traite comme
      // un permanent et transfère le signal.
      { source: "/max", destination: "/hbo-max", permanent: true },
      { source: "/max/:sous*", destination: "/hbo-max/:sous*", permanent: true },
    ];
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              `script-src 'self' 'unsafe-inline' https://www.googletagmanager.com${isDev ? " 'unsafe-eval'" : ""}`,
              "style-src 'self' 'unsafe-inline'",
              "font-src 'self'",
              "img-src 'self' https://image.tmdb.org data:",
              "frame-src https://www.youtube-nocookie.com",
              "connect-src 'self' https://www.google-analytics.com https://*.google-analytics.com https://*.analytics.google.com",
              "frame-ancestors 'none'",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
