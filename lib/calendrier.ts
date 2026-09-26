/**
 * Règles du calendrier des sorties à venir (getSortiesAVenir).
 *
 * TMDB ne rattache un titre à une plateforme (watch providers) qu'une fois
 * disponible : filtrer les sorties futures par plateforme ne renvoyait presque
 * rien (0 série, 3 films sur 28 jours au 2026-09-26). On complète donc avec :
 * - les séries annoncées par le réseau d'origine de la plateforme ;
 * - les films dont la sortie numérique en France nomme la plateforme.
 * Module pur (pas d'appel réseau) pour être testé.
 */

/** Réseaux TMDB des plateformes (séries qu'elles produisent ou diffusent en premier) */
export const RESEAUX_PAR_PLATEFORME: Record<number, number[]> = {
  8: [213], // Netflix
  119: [1024], // Prime Video
  337: [2739], // Disney+
  350: [2552], // Apple TV+
  381: [285], // Canal+
  1899: [49, 3186, 8304], // HBO, HBO Max (anciens et actuels identifiants)
  582: [4330], // Paramount+
};

/**
 * Une production régionale d'un réseau (série coréenne de Netflix, par
 * exemple) ne sort pas forcément en France. On garde les séries qui ont déjà
 * un résumé en français, signe d'une sortie prévue ici, ou une popularité
 * suffisante (mesuré le 2026-09-26 : seuil 5 → 16 séries crédibles sur 44).
 */
export const POPULARITE_MIN_SERIE_ANNONCEE = 5;

export function serieAnnonceeCredible(s: { overview?: string; popularity?: number }): boolean {
  return Boolean(s.overview?.trim()) || (s.popularity ?? 0) >= POPULARITE_MIN_SERIE_ANNONCEE;
}

function normaliser(texte: string): string {
  return texte
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9+ ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Mots de la note de sortie TMDB qui désignent chaque plateforme */
const NOTES_PAR_PLATEFORME: [number, RegExp][] = [
  [8, /(^| )netflix( |$)/],
  [119, /(^| )(prime video|amazon)( |$)/],
  [337, /(^| )disney( |\+|$)/],
  [350, /(^| )apple tv( |\+|$)/],
  [381, /(^| )canal( |\+|$)/],
  [1899, /(^| )(hbo max|hbo|max)( |$)/],
  [582, /(^| )paramount( |\+|$)/],
];

/**
 * Plateforme désignée par la note d'une sortie numérique française
 * (« Canal+ », « Apple TV », « Netflix »…), ou null. Les services hors
 * périmètre (Arte.tv, MUBI, France.tv) renvoient null.
 */
export function plateformeDepuisNote(note: string | undefined): number | null {
  if (!note) return null;
  const n = normaliser(note);
  for (const [id, motif] of NOTES_PAR_PLATEFORME) {
    if (motif.test(n)) return id;
  }
  return null;
}
