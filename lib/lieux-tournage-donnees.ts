/**
 * Données de la page /lieux-de-tournage : fichier importé (Wikidata, voir
 * scripts/import-tournages-france.mjs) et plateformes du jour de chaque titre.
 * Côté serveur ; un appel TMDB léger par titre (watch/providers, en cache),
 * relu une fois par jour avec la page.
 */

import type { Plateforme } from "@/types";
import { chargerDonneesPubliques } from "@/lib/donnees-publiques";
import { getProvidersFR } from "@/lib/tmdb";
import { plateformesDepuisFournisseurs } from "@/lib/plateformes";
import { grouperParRegion, type FichierTournagesFrance, type RegionTournage } from "@/lib/lieux-tournage";

export interface DonneesLieuxTournage {
  regions: RegionTournage[];
  /** cle « film-123 » → plateformes du jour */
  plateformes: Map<string, Plateforme[]>;
  /** Titres disponibles aujourd'hui et rattachés à une région */
  nbTitres: number;
  /** Titres Wikidata avec un lieu de tournage en France, disponibles ou non */
  nbTitresWikidata: number;
  maj: string;
}

export async function donneesLieuxTournage(): Promise<DonneesLieuxTournage | null> {
  const f = chargerDonneesPubliques("tournages-france.json.br", (x: FichierTournagesFrance) => x);
  if (!f) return null;

  const plateformes = new Map<string, Plateforme[]>();
  await Promise.all(
    f.titres.map(async (t) => {
      const pf = plateformesDepuisFournisseurs(await getProvidersFR(t.type === "film" ? "movie" : "tv", t.id));
      if (pf.length > 0) plateformes.set(`${t.type}-${t.id}`, pf);
    })
  );
  // Un titre sorti du streaming depuis l'import n'est plus affiché
  const disponibles = f.titres.filter((t) => plateformes.has(`${t.type}-${t.id}`));
  const regions = grouperParRegion(disponibles, f.lieux);
  const localises = new Set(
    regions.flatMap((r) => [...r.communes.flatMap((c) => c.titres), ...r.autres].map((t) => `${t.type}-${t.id}`))
  );
  return {
    regions,
    plateformes,
    nbTitres: localises.size,
    nbTitresWikidata: f.source.titresWikidata,
    maj: f.source.maj,
  };
}
