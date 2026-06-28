import type { MetadataRoute } from "next";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://streamactu.fr";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/recherche", "/surprise"],
      },
    ],
    sitemap: `${BASE}/sitemap.xml`,
  };
}
