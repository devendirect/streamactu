/**
 * Visas d'exploitation du CNC : rapprochement d'un film TMDB avec la liste
 * officielle, et lecture de la décision de classification. Module pur, testé ;
 * le chargement du fichier est dans lib/visas-donnees.ts.
 *
 * Règle : rapprochement sûr ou rien. Le titre doit correspondre, l'année être
 * à un an près, et le réalisateur concorder. Deux visas candidats → rien.
 */

/** Fichier écrit par scripts/import-visas-cnc.mjs (rangé par colonne) */
export interface FichierVisas {
  source: { jeu: string; page: string; licence: string; maj: string; importeLe: string };
  decisions: string[];
  titre: string[];
  annee: (number | null)[];
  realisation: string[];
  visa: number[];
  decision: number[];
}

export interface VisaCNC {
  numero: number;
  annee: number | null;
  /** « Interdit aux moins de 12 ans »… ; null si la décision n'est pas lisible sans ambiguïté */
  classification: string | null;
}

interface LigneVisa {
  annee: number | null;
  realisation: Set<string>;
  visa: number;
  decision: string;
}

export type IndexVisas = Map<string, LigneVisa[]>;

/** Minuscules, sans accents ni ponctuation, ordinaux réduits (« 2ème », « 2e » → « 2 »), espaces simples */
export function normaliser(s: string): string {
  return s
    .toLowerCase()
    .replace(/œ/g, "oe")
    .replace(/æ/g, "ae")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/\b(\d+)(?:eme|er|ere|e|nd|nde)\b/g, "$1")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

/**
 * Titres à comparer pour une ligne du CNC : titre français, puis titre original
 * après un point (« Parasite. Gisaengchung »), avec et sans les parenthèses
 * (« Un p'tit truc en plus (ex. Un petit truc en plus) »).
 */
export function variantesTitreCnc(titre: string): string[] {
  const sansParentheses = titre.replace(/\([^)]*\)/g, " ");
  const variantes = new Set<string>();
  for (const base of [titre, sansParentheses]) {
    variantes.add(normaliser(base));
    for (const partie of base.split(/\.\s+/)) variantes.add(normaliser(partie));
  }
  variantes.delete("");
  return [...variantes];
}

// Particules trop courantes pour départager deux réalisateurs
const PARTICULES = new Set(["van", "von", "der", "den", "del", "les", "des", "dos", "das", "mac"]);

/** Mots significatifs des noms de réalisateurs (« Victor-Artus Solaro (alias Artus) » → victor, artus, solaro) */
export function motsRealisation(s: string): Set<string> {
  return new Set(
    normaliser(s.replace(/\balias\b/gi, " "))
      .split(" ")
      .filter((m) => m.length >= 3 && !PARTICULES.has(m))
  );
}

const CLASSIFICATIONS: Record<string, string> = {
  "Tout public": "Tous publics",
  Avertissement: "Tous publics, avec avertissement",
  "Interdit -12 ans": "Interdit aux moins de 12 ans",
  "Interdit -13 ans": "Interdit aux moins de 13 ans",
  "Interdit -16 ans": "Interdit aux moins de 16 ans",
  "Interdit -18 ans": "Interdit aux moins de 18 ans",
  "Interdit mineurs": "Interdit aux mineurs",
  "Interdit -13 ans - Avertissement": "Interdit aux moins de 13 ans, avec avertissement",
};

/**
 * Décision du CNC → libellé affichable. Les décisions combinées
 * (« Interdit -16 ans - Interdit -12 ans », sans date ni ordre) et la censure
 * ne sont pas interprétées : null.
 */
export function libelleDecision(decision: string): string | null {
  return CLASSIFICATIONS[decision.trim()] ?? null;
}

export function construireIndex(f: FichierVisas): IndexVisas {
  const index: IndexVisas = new Map();
  for (let i = 0; i < f.titre.length; i++) {
    const ligne: LigneVisa = {
      annee: f.annee[i],
      realisation: motsRealisation(f.realisation[i]),
      visa: f.visa[i],
      decision: f.decisions[f.decision[i]] ?? "",
    };
    for (const v of variantesTitreCnc(f.titre[i])) {
      const liste = index.get(v);
      if (liste) liste.push(ligne);
      else index.set(v, [ligne]);
    }
  }
  return index;
}

export interface FilmARapprocher {
  titre: string;
  titreOriginal?: string;
  /** Années de référence : sortie TMDB et sortie en salle en France */
  annees: number[];
  realisateurs: string[];
}

/** Visa du film, ou null si absent ou ambigu */
export function trouverVisa(index: IndexVisas, film: FilmARapprocher): VisaCNC | null {
  const titres = new Set([film.titre, film.titreOriginal ?? ""].map(normaliser).filter(Boolean));
  const candidats = new Map<number, LigneVisa>();
  for (const t of titres) for (const l of index.get(t) ?? []) candidats.set(l.visa, l);
  if (candidats.size === 0) return null;

  const annees = film.annees.filter((a) => a > 0);
  const anneeOk = (l: LigneVisa) => l.annee !== null && annees.some((a) => Math.abs(a - l.annee!) <= 1);
  const motsFilm = film.realisateurs.map(motsRealisation);
  const realOk = (l: LigneVisa) => motsFilm.some((mots) => [...mots].some((m) => l.realisation.has(m)));

  // Sans réalisateur connu côté TMDB, l'année seule doit suffire ; sinon le
  // réalisateur est exigé, et une ligne sans année n'est acceptée que par lui
  const retenus = [...candidats.values()].filter((l) =>
    motsFilm.length === 0 ? anneeOk(l) : realOk(l) && (l.annee === null || anneeOk(l))
  );
  if (retenus.length !== 1) return null;
  const [l] = retenus;
  return { numero: l.visa, annee: l.annee, classification: libelleDecision(l.decision) };
}
