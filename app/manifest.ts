import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "StreamActu.fr",
    short_name: "StreamActu",
    description:
      "Nouveautés streaming quotidiennes : séries et films disponibles ce soir sur les grandes plateformes françaises.",
    start_url: "/",
    display: "standalone",
    background_color: "#0A0A0B",
    theme_color: "#0A0A0B", // aligné sur le fond des pages et le viewport
    // Symbole B (épingle noire sur ambre) ; la version masquable a des coins
    // carrés, le système l'arrondit lui-même. Dossier /icones/ et non /icons/ :
    // sur le serveur Plesk, /icons/ est réservé par Apache (404, constaté le 29/10)
    icons: [
      {
        src: "/icones/symbole-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icones/symbole-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icones/symbole-masquable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
