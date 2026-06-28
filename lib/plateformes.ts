import type { Plateforme } from "@/types";

export const PLATEFORMES: Plateforme[] = [
  { id: 8,    nom: "Netflix",     slug: "netflix",    couleur: "var(--platform-netflix)" },
  { id: 119,  nom: "Prime Video", slug: "prime",      couleur: "var(--platform-prime)" },
  { id: 337,  nom: "Disney+",     slug: "disney",     couleur: "var(--platform-disney)" },
  { id: 350,  nom: "Apple TV+",   slug: "apple",      couleur: "var(--platform-apple)" },
  { id: 381,  nom: "Canal+",      slug: "canal",      couleur: "var(--platform-canal)" },
  { id: 1899, nom: "Max",         slug: "max",         couleur: "var(--platform-max)" },
  { id: 582,  nom: "Paramount+",  slug: "paramount",  couleur: "var(--platform-paramount)" },
];

export const PLATEFORME_PAR_ID: Record<number, Plateforme> = Object.fromEntries(
  PLATEFORMES.map((p) => [p.id, p])
);

export const PLATEFORME_PAR_SLUG: Record<string, Plateforme> = Object.fromEntries(
  PLATEFORMES.map((p) => [p.slug, p])
);
