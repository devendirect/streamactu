import type { MetadataRoute } from "next";

const BASE = process.env.SITE_URL ?? "https://streamactu.fr";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // /recherche et /surprise sont gérées par noindex (meta robots) :
        // les bloquer ici empêcherait Google de voir cette directive.
        disallow: ["/api/"],
      },
    ],
    sitemap: `${BASE}/sitemap.xml`,
  };
}
