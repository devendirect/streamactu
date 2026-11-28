/**
 * Tournages à Paris d'une fiche, à partir de data/publiques/tournages-paris.json.br
 * (scripts/import-tournages-paris.mjs). Fichier absent → null : pas de bloc.
 */

import type { Film, Serie } from "@/types";
import { chargerDonneesPubliques } from "@/lib/donnees-publiques";
import {
  construireIndex,
  tournagesFilm,
  tournagesSerie,
  type FichierTournages,
  type TournagesParis,
} from "@/lib/tournages";

export interface SourceTournages {
  page: string;
  maj: string;
}

export function tournagesParis(contenu: Film | Serie): { tournages: TournagesParis; source: SourceTournages } | null {
  const donnees = chargerDonneesPubliques("tournages-paris.json.br", (f: FichierTournages) => ({
    index: construireIndex(f),
    source: { page: f.source.page, maj: f.source.maj },
  }));
  if (!donnees) return null;
  const tournages =
    contenu.type === "film"
      ? tournagesFilm(donnees.index, {
          titre: contenu.titre,
          titreOriginal: contenu.titreOriginal,
          annees: [contenu.annee, contenu.anneeSalleFR ?? 0],
          realisateurs: contenu.realisateurs,
        })
      : tournagesSerie(
          donnees.index,
          {
            titre: contenu.titre,
            titreOriginal: contenu.titreOriginal,
            anneeDebut: contenu.annee,
            anneeFin: contenu.derniereDiffusion ? new Date(contenu.derniereDiffusion).getFullYear() : undefined,
            createurs: contenu.createurs ?? [],
            societes: contenu.societes ?? [],
          },
          new Date().getFullYear()
        );
  return tournages ? { tournages, source: donnees.source } : null;
}
