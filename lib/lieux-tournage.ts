/**
 * Lieux de tournage en France (page /lieux-de-tournage) : regroupement des
 * titres par région, puis par commune. Module pur, testé ; le chargement et
 * les plateformes du jour sont dans lib/lieux-tournage-donnees.ts.
 *
 * Données : scripts/import-tournages-france.mjs (Wikidata P915, CC0), titres
 * disponibles en streaming le jour de l'import.
 */

/** Fichier écrit par scripts/import-tournages-france.mjs */
export interface FichierTournagesFrance {
  source: { jeu: string; page: string; licence: string; maj: string; importeLe: string; titresWikidata: number };
  titres: TitreTournage[];
  lieux: Record<string, LieuTournage>;
}

export interface TitreTournage {
  type: "film" | "serie";
  id: number;
  titre: string;
  annee: number | null;
  votes: number;
  /** Identifiants Wikidata des lieux de tournage en France */
  lieux: string[];
}

export interface LieuTournage {
  nom: string;
  coord: [number, number] | null;
  commune: { id: string; nom: string; coord: [number, number] | null } | null;
  region: string | null;
}

/** Régions et départements d'outre-mer : section à part, en fin de page */
export const OUTRE_MER = ["La Réunion", "Guadeloupe", "Martinique", "Guyane", "Mayotte"];

export interface TitreGroupe extends TitreTournage {
  /** Lieux du titre dans ce groupe (communes, ou lieux sans commune), pour « autres lieux » */
  ou: string[];
}

export interface GroupeCommune {
  id: string;
  nom: string;
  coord: [number, number] | null;
  titres: TitreGroupe[];
}

export interface RegionTournage {
  region: string;
  outreMer: boolean;
  /** Titres distincts tournés dans la région */
  nbTitres: number;
  /** Communes d'au moins `seuil` titres, de la plus filmée à la moins filmée */
  communes: GroupeCommune[];
  /** Titres de la région tournés ailleurs que dans ces communes */
  autres: TitreGroupe[];
}

/** Ancre d'une région ou d'une commune (« provence-alpes-cote-d-azur ») */
export function ancre(nom: string): string {
  return nom
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const parVotes = (a: TitreTournage, b: TitreTournage) => b.votes - a.votes || a.titre.localeCompare(b.titre, "fr");

/**
 * Titres par région, puis par commune. Un titre tourné dans plusieurs régions
 * ou communes apparaît dans chacune. Une commune n'a sa propre liste qu'à partir
 * de `seuil` titres ; les autres titres de la région vont dans « autres », avec
 * le nom de leurs lieux.
 */
export function grouperParRegion(
  titres: TitreTournage[],
  lieux: Record<string, LieuTournage>,
  seuil = 3
): RegionTournage[] {
  const regions = new Map<string, Map<string, { nom: string; coord: [number, number] | null; titres: Map<string, TitreGroupe> }>>();
  const sansCommune = new Map<string, Map<string, TitreGroupe>>();
  const parRegion = new Map<string, Set<string>>();

  for (const t of titres) {
    const cleTitre = `${t.type}-${t.id}`;
    for (const q of t.lieux) {
      const l = lieux[q];
      if (!l?.region) continue;
      (parRegion.get(l.region) ?? parRegion.set(l.region, new Set()).get(l.region)!).add(cleTitre);
      if (l.commune) {
        const communes = regions.get(l.region) ?? regions.set(l.region, new Map()).get(l.region)!;
        const c = communes.get(l.commune.id) ?? communes.set(l.commune.id, { nom: l.commune.nom, coord: l.commune.coord, titres: new Map() }).get(l.commune.id)!;
        const g = c.titres.get(cleTitre) ?? { ...t, ou: [] };
        if (!g.ou.includes(l.commune.nom)) g.ou.push(l.commune.nom);
        c.titres.set(cleTitre, g);
      } else {
        const autres = sansCommune.get(l.region) ?? sansCommune.set(l.region, new Map()).get(l.region)!;
        const g = autres.get(cleTitre) ?? { ...t, ou: [] };
        if (!g.ou.includes(l.nom)) g.ou.push(l.nom);
        autres.set(cleTitre, g);
      }
    }
  }

  const resultat: RegionTournage[] = [];
  for (const [region, cles] of parRegion) {
    const communes = [...(regions.get(region) ?? new Map())];
    const grandes = communes
      .filter(([, c]) => c.titres.size >= seuil)
      .map(([id, c]) => ({ id, nom: c.nom, coord: c.coord, titres: [...c.titres.values()].sort(parVotes) }))
      .sort((a, b) => b.titres.length - a.titres.length || a.nom.localeCompare(b.nom, "fr"));
    const dansGrandes = new Set(grandes.flatMap((c) => c.titres.map((t) => `${t.type}-${t.id}`)));

    // Autres : petites communes et lieux sans commune, hors titres déjà listés dans une grande commune
    const autres = new Map<string, TitreGroupe>();
    const ajouter = (cle: string, g: TitreGroupe) => {
      if (dansGrandes.has(cle)) return;
      const deja = autres.get(cle);
      if (deja) for (const o of g.ou) { if (!deja.ou.includes(o)) deja.ou.push(o); }
      else autres.set(cle, { ...g, ou: [...g.ou] });
    };
    for (const [, c] of communes) if (c.titres.size < seuil) for (const [cle, g] of c.titres) ajouter(cle, g);
    for (const [cle, g] of sansCommune.get(region) ?? new Map()) ajouter(cle, g);

    resultat.push({
      region,
      outreMer: OUTRE_MER.includes(region),
      nbTitres: cles.size,
      communes: grandes,
      autres: [...autres.values()].sort(parVotes),
    });
  }
  return resultat.sort(
    (a, b) => Number(a.outreMer) - Number(b.outreMer) || b.nbTitres - a.nbTitres || a.region.localeCompare(b.region, "fr")
  );
}

/** Nombre de titres distincts ayant au moins un lieu de tournage rattaché à une région */
export function nbTitresLocalises(titres: TitreTournage[], lieux: Record<string, LieuTournage>): number {
  return titres.filter((t) => t.lieux.some((q) => lieux[q]?.region)).length;
}
