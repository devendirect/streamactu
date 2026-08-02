import type { Plateforme } from "@/types";

// Slugs longs : ce sont les formes des requêtes réelles (« prime video », « disney plus »)
// et ils servent d'URLs publiques (/netflix, /prime-video, …).
export const PLATEFORMES: Plateforme[] = [
  { id: 8,    nom: "Netflix",     slug: "netflix",       couleur: "var(--platform-netflix)" },
  { id: 119,  nom: "Prime Video", slug: "prime-video",   couleur: "var(--platform-prime)" },
  { id: 337,  nom: "Disney+",     slug: "disney-plus",   couleur: "var(--platform-disney)" },
  { id: 350,  nom: "Apple TV+",   slug: "apple-tv-plus", couleur: "var(--platform-apple)" },
  { id: 381,  nom: "Canal+",      slug: "canal-plus",    couleur: "var(--platform-canal)" },
  // « HBO Max » est la forme cherchée : Google Trends FR 08/2026 ne renvoie
  // que « hbo max », jamais « max » seul. Le slug a suivi le 2 août 2026 —
  // l'ancien /max est redirigé en 308 par next.config.ts, avec ses sous-routes.
  { id: 1899, nom: "HBO Max",     slug: "hbo-max",       couleur: "var(--platform-max)" },
  { id: 582,  nom: "Paramount+",  slug: "paramount-plus", couleur: "var(--platform-paramount)" },
];

export const PLATEFORME_PAR_ID: Record<number, Plateforme> = Object.fromEntries(
  PLATEFORMES.map((p) => [p.id, p])
);

export const PLATEFORME_PAR_SLUG: Record<string, Plateforme> = Object.fromEntries(
  PLATEFORMES.map((p) => [p.slug, p])
);
