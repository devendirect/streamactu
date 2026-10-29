/**
 * Faits calculés pour les fiches, à partir des données TMDB déjà chargées :
 * classification française, statut d'une série, durée d'une saison ou de la série.
 * Chaque fonction renvoie null quand la donnée manque : la fiche n'affiche
 * alors rien (jamais de « non disponible »). Module pur, testé.
 */

import type { EpisodeDate } from "@/types";

/** Classification française normalisée : tous publics, ou âge minimum */
export type Classification = "TP" | "10" | "12" | "16" | "18";

const VALEURS: Record<string, Classification> = { TP: "TP", U: "TP", "10": "10", "12": "12", "16": "16", "18": "18" };

/** Valeur TMDB (« U », « TP », « 12 »…) → classification, ou null (vide, « NR ») */
export function normaliserClassification(brut: string | undefined): Classification | null {
  return VALEURS[(brut ?? "").trim().toUpperCase()] ?? null;
}

/**
 * Film : certification française tirée des dates de sortie, en préférant la
 * sortie en salle (type 3), puis numérique (4), télévision (6), vidéo (5).
 */
export function classificationFilm(sorties: { type: number; certification?: string }[]): Classification | null {
  for (const type of [3, 4, 6, 5, 1, 2]) {
    for (const s of sorties) {
      if (s.type !== type) continue;
      const c = normaliserClassification(s.certification);
      if (c) return c;
    }
  }
  return null;
}

/** « Tous publics » ; « Déconseillé aux moins de 12 ans » */
export function libelleClassification(c: Classification): string {
  return c === "TP" ? "Tous publics" : `Déconseillé aux moins de ${c} ans`;
}

/** Statut TMDB d'une série : seuls « Ended » et « Canceled » sont repris, le reste ne dit rien de sûr */
export type StatutSerie = "terminee" | "arretee";

export function statutSerie(status: string | undefined): StatutSerie | null {
  return status === "Ended" ? "terminee" : status === "Canceled" ? "arretee" : null;
}

/** Durée totale d'une saison (minutes), seulement si tous ses épisodes ont une durée */
export function dureeSaison(episodes: EpisodeDate[]): number | null {
  if (episodes.length === 0 || episodes.some((e) => !e.duree)) return null;
  return episodes.reduce((total, e) => total + e.duree!, 0);
}

/** Durée d'une saison : ses épisodes déjà diffusés et leur durée totale (minutes) */
export interface DureeSaison {
  saison: number;
  minutes: number;
  nbEpisodes: number;
}

/**
 * Durées de la série, épisodes déjà diffusés seulement (saison 0 « épisodes
 * spéciaux » exclue). Une saison n'a de durée que si tous ses épisodes
 * diffusés en ont une ; le total n'existe que si toutes les saisons diffusées
 * en ont une. Une saison pas encore diffusée est ignorée.
 */
export function dureesSerie(
  saisons: { saison: number; episodes: EpisodeDate[] }[],
  aujourdhui: string
): { parSaison: DureeSaison[]; total: { minutes: number; nbEpisodes: number } | null } {
  const parSaison: DureeSaison[] = [];
  let complet = true;
  for (const { saison, episodes } of saisons) {
    if (saison === 0) continue;
    const diffuses = episodes.filter((e) => e.date && e.date <= aujourdhui);
    if (diffuses.length === 0) continue;
    const minutes = dureeSaison(diffuses);
    if (minutes === null) complet = false;
    else parSaison.push({ saison, minutes, nbEpisodes: diffuses.length });
  }
  const total =
    complet && parSaison.length > 0
      ? {
          minutes: parSaison.reduce((t, s) => t + s.minutes, 0),
          nbEpisodes: parSaison.reduce((t, s) => t + s.nbEpisodes, 0),
        }
      : null;
  return { parSaison, total };
}

/** 395 → « 6 h 35 » ; 120 → « 2 h » ; 45 → « 45 min » */
export function formatDureeLongue(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m} min`;
  return m > 0 ? `${h} h ${String(m).padStart(2, "0")}` : `${h} h`;
}
