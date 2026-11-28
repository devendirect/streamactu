/**
 * Entrées en salle en France (CNC, films ayant dépassé un million d'entrées
 * sur une année civile, depuis 2003) : rapprochement d'une fiche film TMDB et
 * formulation. Module pur, testé ; le chargement est dans lib/entrees-donnees.ts.
 *
 * Le fichier du CNC n'a pas de réalisateur : le rapprochement repose sur la
 * date de sortie en salle en France (TMDB, type 3), présente des deux côtés.
 * - Titre identique (article rejeté remis en tête) et sortie à 14 jours près ;
 * - ou sortie à 3 jours près et mots significatifs de l'un tous dans l'autre
 *   (« Star Wars : Le Réveil de la Force » ⊂ « STAR WARS : EPISODE 7, LE REVEIL DE LA FORCE »).
 * Plus d'un film candidat → rien.
 *
 * Un film n'est listé une année que s'il y a dépassé le million : on donne les
 * entrées des années listées, jamais un « total » de carrière.
 */

import { normaliser } from "./visas";

/** Fichier écrit par scripts/import-entrees-cnc.mjs (rangé par colonne) */
export interface FichierEntrees {
  source: { jeu: string; page: string; licence: string; maj: string; importeLe: string };
  titre: string[];
  sortie: string[];
  annee: number[];
  entrees: number[];
  nationalite: string[];
}

interface FilmCnc {
  titre: string;
  mots: Set<string>;
  sortie: string;
  parAnnee: { annee: number; entrees: number }[];
}

export type IndexEntrees = FilmCnc[];

export interface EntreesFrance {
  total: number;
  /** Années listées par le CNC, dans l'ordre */
  parAnnee: { annee: number; entrees: number }[];
}

/** « MINIONS (LES) » → « les minions » ; « HOBBIT : UN VOYAGE INATTENDU (LE) » → « le hobbit un voyage inattendu » */
export function titreCnc(titre: string): string {
  const m = titre.match(/^(.*?)\s*\((LE|LA|LES|L'|L’|UN|UNE)\)\s*(.*)$/i);
  const remis = m ? `${m[2]}${/'|’$/.test(m[2]) ? "" : " "}${m[1]} ${m[3]}` : titre;
  return normaliser(remis);
}

const MOTS_VIDES = new Set(["le", "la", "les", "l", "un", "une", "des", "de", "du", "d", "et", "a", "the", "of"]);

function motsSignificatifs(titreNormalise: string): Set<string> {
  return new Set(titreNormalise.split(" ").filter((m) => m && !MOTS_VIDES.has(m)));
}

const inclus = (a: Set<string>, b: Set<string>) => [...a].every((m) => b.has(m));

function ecartJours(a: string, b: string): number {
  return Math.abs(Date.parse(`${a}T12:00:00Z`) - Date.parse(`${b}T12:00:00Z`)) / 86400000;
}

export function construireIndex(f: FichierEntrees): IndexEntrees {
  const films = new Map<string, FilmCnc>();
  for (let i = 0; i < f.titre.length; i++) {
    const titre = titreCnc(f.titre[i]);
    const cle = `${titre}|${f.sortie[i]}`;
    let film = films.get(cle);
    if (!film) {
      film = { titre, mots: motsSignificatifs(titre), sortie: f.sortie[i], parAnnee: [] };
      films.set(cle, film);
    }
    film.parAnnee.push({ annee: f.annee[i], entrees: f.entrees[i] });
  }
  for (const film of films.values()) film.parAnnee.sort((a, b) => a.annee - b.annee);
  return [...films.values()];
}

export interface FilmARapprocher {
  titre: string;
  titreOriginal?: string;
  /** Première sortie en salle en France, AAAA-MM-JJ (TMDB, type 3) */
  sortieSalleFR?: string;
  /** Sortie TMDB générale : seulement en repli, titre identique et 7 jours près */
  sortie?: string;
}

export function trouverEntrees(index: IndexEntrees, film: FilmARapprocher): EntreesFrance | null {
  // Sans date française (Dumbo, Volver chez TMDB), la date générale, avec des règles plus strictes
  const repli = !film.sortieSalleFR;
  const sortie = film.sortieSalleFR ?? film.sortie;
  if (!sortie) return null;
  const titres = [film.titre, film.titreOriginal].filter((t): t is string => !!t).map(normaliser);
  const retenus = index.filter((f) => {
    const ecart = ecartJours(f.sortie, sortie);
    if (ecart > (repli ? 7 : 14)) return false;
    if (titres.includes(f.titre)) return true;
    if (repli || ecart > 3) return false;
    return titres.some((t) => {
      const mots = motsSignificatifs(t);
      return Math.min(mots.size, f.mots.size) >= 2 && (inclus(mots, f.mots) || inclus(f.mots, mots));
    });
  });
  if (retenus.length !== 1) return null;
  const [f] = retenus;
  return { total: f.parAnnee.reduce((s, a) => s + a.entrees, 0), parAnnee: f.parAnnee };
}

/** 10 716 771 → « 10,7 millions » ; 1 002 502 → « 1 million » ; 1 054 000 → « 1,1 million » */
export function formatMillions(n: number): string {
  const m = Math.round(n / 100_000) / 10;
  const texte = m.toLocaleString("fr-FR", { maximumFractionDigits: 1 });
  return `${texte} million${m >= 2 ? "s" : ""}`;
}

/**
 * « 10,7 millions d'entrées en 2024 » ;
 * « 13,1 millions d'entrées en 2022 et 2023 » ;
 * « 26,5 millions d'entrées de 2009 à 2011 » (années consécutives).
 */
export function phraseEntrees(e: EntreesFrance): string {
  const annees = e.parAnnee.map((a) => a.annee);
  const periode =
    annees.length === 1
      ? `en ${annees[0]}`
      : annees.length === 2
        ? `en ${annees[0]} et ${annees[1]}`
        : annees.every((a, i) => i === 0 || a === annees[i - 1] + 1)
          ? `de ${annees[0]} à ${annees.at(-1)}`
          : `en ${annees.slice(0, -1).join(", ")} et ${annees.at(-1)}`;
  return `${formatMillions(e.total)} d'entrées ${periode}`;
}
