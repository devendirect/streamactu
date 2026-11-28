/**
 * Lieux de tournage à Paris (Ville de Paris, ODbL) : rapprochement d'une fiche
 * TMDB avec les tournages déclarés, et résumé affichable. Module pur, testé ;
 * le chargement du fichier est dans lib/tournages-donnees.ts.
 *
 * Règle : rapprochement sûr ou rien.
 * - Film : titre + tournage dans les 3 ans avant la sortie + réalisateur commun.
 * - Série : titre sans « saison 2 », « bloc 3 », « ep 12 »… + tournage pendant
 *   la diffusion (2 ans avant le 1er épisode au plus tôt) + un créateur ou une
 *   société de production en commun. La Ville note les réalisateurs des
 *   épisodes et souvent une société de service locale : sans ce second indice,
 *   un homonyme passerait.
 * Aucun numéro de rue n'est affiché : les lieux peuvent être des immeubles d'habitation.
 */

import { motsRealisation, normaliser } from "./visas";

/** Fichier écrit par scripts/import-tournages-paris.mjs (rangé par colonne) */
export interface FichierTournages {
  source: { jeu: string; page: string; licence: string; maj: string; importeLe: string };
  types: string[];
  titre: string[];
  type: number[];
  annee: number[];
  realisation: string[];
  production: string[];
  adresse: string[];
  ardt: string[];
}

interface LigneTournage {
  annee: number;
  realisation: Set<string>;
  production: Set<string>;
  voie: string | null;
  arrondissement: number | null;
}

export type IndexTournages = Map<string, LigneTournage[]>;

export interface TournagesParis {
  /** Arrondissements, du plus filmé au moins filmé */
  arrondissements: number[];
  anneeMin: number;
  anneeMax: number;
  /** Rues et places les plus filmées (5 au plus), sans numéro */
  lieux: string[];
  /** Nombre de lieux de tournage déclarés */
  nbLieux: number;
}

const TYPE_FICHE: Record<string, "film" | "serie"> = {
  "Long métrage": "film",
  Téléfilm: "film",
  "Série TV": "serie",
  "Série Web": "serie",
};

/** « emily in paris saison 4 », « lupin saison 2 partie 4 », « candice renoir saison 7 ep 62 » → titre seul */
export function titreSerieSansSaison(titreNormalise: string): string {
  return titreNormalise
    .replace(/\s\b(saison|saisons|season|seasons|s\d+|ep|eps|episode|episodes|bloc|blocs|partie|part)\b.*$/, "")
    .trim();
}

// Mots trop courants dans les noms de sociétés pour prouver quoi que ce soit
const MOTS_SOCIETES_VIDES = new Set([
  "production", "productions", "prod", "prods", "film", "films", "television", "tele", "studio", "studios",
  "france", "paris", "media", "medias", "entertainment", "pictures", "group", "groupe", "company", "compagnie",
  "the", "and", "les", "des", "sas", "sarl", "international", "cinema", "series", "fiction", "fictions",
]);

/** Mots distinctifs d'une liste de sociétés (« GAUMONT PRODUCTION TÉLÉVISION » → gaumont) */
export function motsSocietes(noms: string): Set<string> {
  return new Set(
    normaliser(noms)
      .split(" ")
      .filter((m) => m.length >= 4 && !MOTS_SOCIETES_VIDES.has(m) && !/^\d+$/.test(m))
  );
}

const PETITS_MOTS = new Set(["de", "du", "des", "la", "le", "les", "et", "a", "au", "aux", "sur", "en", "sous"]);

/**
 * « 45 avenue de flandre, 75019 paris » → « Avenue de Flandre ».
 * Numéro (et bis, ter) retiré ; rien si l'adresse n'a pas de nom de voie.
 */
export function nomVoie(adresse: string): string | null {
  const avantVirgule = adresse
    .split(",")[0]
    .toLowerCase()
    .replace(/[^a-z0-9à-ÿ'’\s/-]/g, " ") // « bois* de boulogne »
    .replace(/\b([dl])['’]\s+/g, "$1'") // « rue de l' amiral hamelin »
    .replace(/\s+/g, " ")
    .trim();
  const sansNumero = avantVirgule
    .replace(/^[\d\s/-]+(bis|ter|quater|[a-d])?\b\s*/, "")
    .replace(/\b75\d{3}\b.*$/, "")
    .trim();
  if (sansNumero.length < 4 || !/[a-zà-ÿ]{3}/.test(sansNumero)) return null;
  return sansNumero
    .split(" ")
    .map((mot, i) =>
      mot
        .split("-")
        .map((p) => {
          const elision = p.match(/^([dl]['’])(.+)$/);
          if (elision) return elision[1] + elision[2].charAt(0).toUpperCase() + elision[2].slice(1);
          return i > 0 && PETITS_MOTS.has(p) ? p : p.charAt(0).toUpperCase() + p.slice(1);
        })
        .join("-")
    )
    .join(" ");
}

/** « 75019 » → 19 ; « 75116 » → 16 ; autre chose → null */
export function arrondissement(codePostal: string): number | null {
  const m = codePostal.trim().match(/^75(\d{3})$/);
  if (!m) return null;
  const n = Number(m[1]) % 100;
  return n >= 1 && n <= 20 ? n : null;
}

/** 1 → « 1er », 16 → « 16e » */
export function libelleArrondissement(n: number): string {
  return n === 1 ? "1er" : `${n}e`;
}

export function construireIndex(f: FichierTournages): IndexTournages {
  const index: IndexTournages = new Map();
  for (let i = 0; i < f.titre.length; i++) {
    const fiche = TYPE_FICHE[f.types[f.type[i]]];
    if (!fiche) continue;
    const titre = normaliser(f.titre[i]);
    const cle = `${fiche}:${fiche === "serie" ? titreSerieSansSaison(titre) : titre}`;
    const ligne: LigneTournage = {
      annee: f.annee[i],
      realisation: motsRealisation(f.realisation[i]),
      production: motsSocietes(f.production[i]),
      voie: nomVoie(f.adresse[i]),
      arrondissement: arrondissement(f.ardt[i]),
    };
    const liste = index.get(cle);
    if (liste) liste.push(ligne);
    else index.set(cle, [ligne]);
  }
  return index;
}

function candidats(index: IndexTournages, fiche: "film" | "serie", titres: (string | undefined)[]): LigneTournage[] {
  const cles = new Set(
    titres
      .filter((t): t is string => !!t)
      .map((t) => normaliser(t))
      .map((t) => (fiche === "serie" ? titreSerieSansSaison(t) : t))
      .filter(Boolean)
  );
  return [...cles].flatMap((c) => index.get(`${fiche}:${c}`) ?? []);
}

function resumer(lignes: LigneTournage[]): TournagesParis | null {
  if (lignes.length === 0) return null;
  const parArdt = new Map<number, number>();
  const parVoie = new Map<string, { nom: string; n: number }>();
  for (const l of lignes) {
    if (l.arrondissement) parArdt.set(l.arrondissement, (parArdt.get(l.arrondissement) ?? 0) + 1);
    if (l.voie) {
      const cle = normaliser(l.voie);
      const v = parVoie.get(cle);
      if (v) v.n++;
      else parVoie.set(cle, { nom: l.voie, n: 1 });
    }
  }
  const annees = lignes.map((l) => l.annee);
  return {
    arrondissements: [...parArdt].sort((a, b) => b[1] - a[1] || a[0] - b[0]).map(([n]) => n),
    anneeMin: Math.min(...annees),
    anneeMax: Math.max(...annees),
    lieux: [...parVoie.values()].sort((a, b) => b.n - a.n || a.nom.localeCompare(b.nom, "fr")).slice(0, 5).map((v) => v.nom),
    nbLieux: lignes.length,
  };
}

export interface FilmTournage {
  titre: string;
  titreOriginal?: string;
  /** Années de sortie connues (TMDB, salle en France) */
  annees: number[];
  realisateurs: string[];
}

export function tournagesFilm(index: IndexTournages, film: FilmTournage): TournagesParis | null {
  const annees = film.annees.filter((a) => a > 0);
  if (annees.length === 0 || film.realisateurs.length === 0) return null;
  const debut = Math.min(...annees) - 3;
  const fin = Math.max(...annees);
  const motsFilm = film.realisateurs.map(motsRealisation);
  const realOk = (l: LigneTournage) => motsFilm.some((mots) => [...mots].some((m) => l.realisation.has(m)));
  const lignes = candidats(index, "film", [film.titre, film.titreOriginal]).filter((l) => l.annee >= debut && l.annee <= fin);
  // Une ligne au moins doit confirmer le réalisateur ; on garde alors aussi les
  // lignes du même titre sans réalisateur saisi, jamais celles d'un autre réalisateur
  if (!lignes.some(realOk)) return null;
  return resumer(lignes.filter((l) => l.realisation.size === 0 || realOk(l)));
}

export interface SerieTournage {
  titre: string;
  titreOriginal?: string;
  anneeDebut: number;
  /** Année du dernier épisode diffusé ; absente → jusqu'à aujourd'hui */
  anneeFin?: number;
  createurs: string[];
  societes: string[];
}

export function tournagesSerie(index: IndexTournages, serie: SerieTournage, anneeCourante: number): TournagesParis | null {
  if (!serie.anneeDebut) return null;
  const debut = serie.anneeDebut - 2;
  const fin = Math.max(serie.anneeFin ?? anneeCourante, serie.anneeDebut);
  const lignes = candidats(index, "serie", [serie.titre, serie.titreOriginal]).filter(
    (l) => l.annee >= debut && l.annee <= fin
  );
  const createurs = serie.createurs.map(motsRealisation);
  const societes = motsSocietes(serie.societes.join(" "));
  const confirme = lignes.some(
    (l) =>
      createurs.some((mots) => [...mots].some((m) => l.realisation.has(m))) ||
      [...societes].some((m) => l.production.has(m))
  );
  return confirme ? resumer(lignes) : null;
}
