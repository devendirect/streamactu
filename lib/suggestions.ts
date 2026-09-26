import type { Contenu, Film, Plateforme, Serie } from "@/types";
import { GENRE_PAR_SLUG, slugPourGenreId, type GenreSEO } from "@/lib/genres";
import { plateformesDepuisFournisseurs } from "@/lib/plateformes";
import { getContenusGenre, getSortiesRecentesPlateforme } from "@/lib/tmdb";

/** Même seuil que /genre/[genre]/[plateforme] : en dessous, la page fait 404 */
export const MIN_TITRES_GENRE_PLATEFORME = 5;
const MAX_SUGGESTIONS = 6;

export interface SuggestionsFiche {
  /** null : repli sur les nouveautés de la plateforme (genre sans page genre) */
  genre: GenreSEO | null;
  plateforme: Plateforme;
  contenus: Contenu[];
  /** true si la page /genre/{genre}/{plateforme} existe (assez de titres) */
  pageGenreExiste: boolean;
}

/**
 * Titres du même genre disponibles sur la même plateforme, pour le bas des
 * fiches : données de la page genre × plateforme (même cache, 24 h), aucun
 * texte généré. Premier genre du titre qui a une page genre, première
 * plateforme suivie où il est disponible. null si rien d'utile à montrer.
 */
export async function suggestionsFiche(contenu: Serie | Film): Promise<SuggestionsFiche | null> {
  const plateforme = plateformesDepuisFournisseurs(contenu.dispo ?? [])[0];
  if (!plateforme) return null;

  for (const g of contenu.genres.slice(0, 2)) {
    const slug = slugPourGenreId(g.id);
    const genre = slug ? GENRE_PAR_SLUG[slug] : undefined;
    if (!genre) continue;
    try {
      const { series, films } = await getContenusGenre(genre.idsTv, genre.idsFilm, plateforme.id);
      const total = series.length + films.length;
      // Le type de la fiche d'abord : une série appelle d'autres séries
      const memeType = contenu.type === "serie" ? series : films;
      const autreType = contenu.type === "serie" ? films : series;
      const contenus = [...memeType, ...autreType]
        .filter((c) => !(c.id === contenu.id && c.type === contenu.type))
        .slice(0, MAX_SUGGESTIONS);
      if (contenus.length === 0) continue;
      return { genre, plateforme, contenus, pageGenreExiste: total >= MIN_TITRES_GENRE_PLATEFORME };
    } catch (err) {
      console.error(`[suggestions] ${genre.slug}/${plateforme.slug} indisponible :`, err instanceof Error ? err.message : err);
      return null;
    }
  }

  // Repli (téléréalité, stand-up… : genres sans page genre) : autres
  // nouveautés de la même plateforme, même cache que ses pages séries/films
  try {
    const { series, films } = await getSortiesRecentesPlateforme(plateforme.id);
    const memeType = contenu.type === "serie" ? series : films;
    const autreType = contenu.type === "serie" ? films : series;
    const contenus = [...memeType, ...autreType]
      .filter((c) => !(c.id === contenu.id && c.type === contenu.type))
      .slice(0, MAX_SUGGESTIONS);
    return contenus.length > 0 ? { genre: null, plateforme, contenus, pageGenreExiste: false } : null;
  } catch (err) {
    console.error(`[suggestions] nouveautés ${plateforme.slug} indisponibles :`, err instanceof Error ? err.message : err);
    return null;
  }
}
