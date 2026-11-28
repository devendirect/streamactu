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

/**
 * Référencement des offres légales par l'Arcom (délibération n° 2022-06 du
 * 9 mars 2022). Portail : liste « Cinéma et audiovisuel », 251 services au
 * 2026-11-28. Le portail ne date pas les référencements : on donne la date de
 * NOTRE vérification. Nom tel qu'écrit par l'Arcom, quand il diffère du nôtre.
 * Pas de logo de l'Arcom (aucune autorisation). À revérifier tous les 6 mois.
 */
export const ARCOM_PORTAIL = "https://www.arcom.fr/sites-plateformes/cinema-et-audiovisuel";
export const ARCOM_VERIFIE_LE = "2026-11-28";
export const ARCOM_REFERENCEMENT: Record<number, { nomArcom: string }> = {
  8: { nomArcom: "Netflix" },
  119: { nomArcom: "Amazon prime video" },
  337: { nomArcom: "Disney+" },
  350: { nomArcom: "AppleTv+" },
  381: { nomArcom: "myCANAL" },
  1899: { nomArcom: "Max" },
  582: { nomArcom: "Paramount Plus" },
};

export const PLATEFORME_PAR_ID: Record<number, Plateforme> = Object.fromEntries(
  PLATEFORMES.map((p) => [p.id, p])
);

/**
 * Noms des fournisseurs TMDB (watch providers, France) rattachés à chaque
 * plateforme suivie, variantes avec publicité et chaînes Amazon/Apple
 * comprises. Correspondance exacte : plusieurs chaînes Amazon contiennent
 * « Max » (Action Max, TFOU Max, Gullimax) sans rapport avec HBO Max.
 * Relevé sur /watch/providers?watch_region=FR le 2026-09-26.
 */
const FOURNISSEURS: Record<string, number> = {
  "Netflix": 8,
  "Netflix Standard with Ads": 8,
  "Amazon Prime Video": 119,
  "Amazon Prime Video with Ads": 119,
  "Disney Plus": 337,
  "Apple TV": 350,
  "Canal+": 381,
  "Canal+ Séries": 381,
  "HBO Max": 1899,
  "HBO Max Amazon Channel": 1899,
  "Paramount Plus": 582,
  "Paramount Plus Premium": 582,
  "Paramount+ Amazon Channel": 582,
  "Paramount Plus Apple TV channel": 582,
};

/**
 * Filtre TMDB `with_watch_providers` d'une plateforme. Paramount+ existe sous
 * deux identifiants en France : 582 (chaîne Amazon, l'id historique du site)
 * et 531 (offre directe). Mesuré le 2026-09-26 : 13 séries et 26 films ne sont
 * rattachés qu'à 531. On interroge les deux (« | » = OU pour TMDB).
 */
const IDS_FOURNISSEURS: Record<number, number[]> = { 582: [582, 531] };

export function filtreFournisseurs(plateformeIds: number | number[]): string {
  const ids = Array.isArray(plateformeIds) ? plateformeIds : [plateformeIds];
  return ids.flatMap((id) => IDS_FOURNISSEURS[id] ?? [id]).join("|");
}

/** Plateformes suivies parmi les noms de fournisseurs d'une fiche, sans doublon, dans l'ordre */
export function plateformesDepuisFournisseurs(noms: string[]): Plateforme[] {
  const vues = new Set<number>();
  const resultat: Plateforme[] = [];
  for (const nom of noms) {
    const id = FOURNISSEURS[nom.trim()];
    if (id && !vues.has(id)) {
      vues.add(id);
      resultat.push(PLATEFORME_PAR_ID[id]);
    }
  }
  return resultat;
}

export const PLATEFORME_PAR_SLUG: Record<string, Plateforme> = Object.fromEntries(
  PLATEFORMES.map((p) => [p.slug, p])
);
