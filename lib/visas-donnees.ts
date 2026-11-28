/**
 * Visa CNC d'une fiche film, à partir de data/publiques/visas-cnc.json.br
 * (scripts/import-visas-cnc.mjs). Fichier absent → null : la fiche garde la
 * classification TMDB.
 */

import type { Film } from "@/types";
import { chargerDonneesPubliques } from "@/lib/donnees-publiques";
import { construireIndex, trouverVisa, type FichierVisas, type VisaCNC } from "@/lib/visas";

export interface SourceVisas {
  page: string;
  maj: string;
}

/** Visa d'un film et la source à citer, ou null */
export function visaFilm(film: Film): { visa: VisaCNC; source: SourceVisas } | null {
  const donnees = chargerDonneesPubliques("visas-cnc.json.br", (f: FichierVisas) => ({
    index: construireIndex(f),
    source: { page: f.source.page, maj: f.source.maj },
  }));
  if (!donnees) return null;
  const visa = trouverVisa(donnees.index, {
    titre: film.titre,
    titreOriginal: film.titreOriginal,
    annees: [film.annee, film.anneeSalleFR ?? 0],
    realisateurs: film.realisateurs,
  });
  return visa ? { visa, source: donnees.source } : null;
}
