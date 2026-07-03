import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "StreamActu.fr",
    short_name: "StreamActu",
    description:
      "Nouveautés streaming quotidiennes — séries et films disponibles ce soir sur les grandes plateformes françaises.",
    start_url: "/",
    display: "standalone",
    background_color: "#100E0A",
    theme_color: "#100E0A",
    icons: [
      {
        src: "/icons/repere-pwa-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/repere-pwa-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
