/**
 * Entrées en salle d'une fiche film, à partir de data/publiques/entrees-cnc.json.br
 * (scripts/import-entrees-cnc.mjs). Fichier absent → null : pas de ligne.
 */

import type { Film } from "@/types";
import { chargerDonneesPubliques } from "@/lib/donnees-publiques";
import { construireIndex, trouverEntrees, type EntreesFrance, type FichierEntrees } from "@/lib/entrees";

export interface SourceEntrees {
  page: string;
  maj: string;
}

export function entreesFilm(film: Film): { entrees: EntreesFrance; source: SourceEntrees } | null {
  const donnees = chargerDonneesPubliques("entrees-cnc.json.br", (f: FichierEntrees) => ({
    index: construireIndex(f),
    source: { page: f.source.page, maj: f.source.maj },
  }));
  if (!donnees) return null;
  const entrees = trouverEntrees(donnees.index, {
    titre: film.titre,
    titreOriginal: film.titreOriginal,
    sortieSalleFR: film.sortieSalleFR,
    sortie: film.dateSortie,
  });
  return entrees ? { entrees, source: donnees.source } : null;
}
