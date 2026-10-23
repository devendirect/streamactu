/**
 * Calendrier des épisodes de la saison en cours, sur la fiche série.
 *
 * TMDB donne la date de diffusion d'origine. En France, un épisode peut
 * sortir le lendemain (Disney+ : soirée américaine = nuit française). On ne
 * décale une date que pour un réseau dont le décalage a été constaté sur la
 * plateforme française ; sinon la date est affichée comme date d'origine.
 * Module pur (pas d'appel réseau) pour être testé.
 */

import type { SaisonEpisodes } from "@/types";
import { formatJourSemaineFR, parseISO, toISO } from "./utils";

/**
 * Décalage constaté entre la date TMDB et la sortie en France, par réseau
 * d'origine, quand la série est sur la plateforme de ce réseau en France.
 * Chaque ligne cite sa preuve : dates relues par l'éditeur dans un article.
 */
export const DECALAGES_FRANCE: Record<number, { plateforme: number; jours: number; preuve: string }> = {
  213: { plateforme: 8, jours: 0, preuve: "Le piège, TYSON (article du 16/10/2026)" },
  1024: { plateforme: 119, jours: 0, preuve: "Kill Jackie, Paul, la série (article du 2/10/2026)" },
  2739: { plateforme: 337, jours: 1, preuve: "VisionQuest, 13/10 aux États-Unis, 14/10 en France (article du 16/10/2026)" },
  2552: { plateforme: 350, jours: 0, preuve: "Slow Horses, Dark Matter (article du 16/10/2026)" },
  8304: { plateforme: 1899, jours: 0, preuve: "Paolo (article du 25/09/2026)" },
  4330: { plateforme: 582, jours: 0, preuve: "Tulsa King, MobLand, Avatar : Les Sept Refuges (article du 16/10/2026)" },
};

/** Fenêtre (jours) autour d'aujourd'hui : hors de celle-ci, pas de calendrier */
export const FENETRE_CALENDRIER = 60;

/**
 * Décalage applicable en France, ou null si inconnu (date d'origine affichée
 * comme telle). Il faut que la série soit sur la plateforme du réseau en France.
 */
export function decalageFrance(
  reseaux: number[],
  plateformesFR: number[]
): { jours: number; plateforme: number } | null {
  for (const r of reseaux) {
    const d = DECALAGES_FRANCE[r];
    if (d && plateformesFR.includes(d.plateforme)) return { jours: d.jours, plateforme: d.plateforme };
  }
  return null;
}

/** Saison à détailler, d'après le prochain et le dernier épisode diffusés (détail TMDB) */
export function saisonADetailler(
  prochain: { season_number: number; air_date: string | null } | null | undefined,
  dernier: { season_number: number; air_date: string | null } | null | undefined,
  aujourdhui: string
): number | null {
  if (prochain?.air_date && ecartJours(aujourdhui, prochain.air_date) <= FENETRE_CALENDRIER) {
    return prochain.season_number;
  }
  if (dernier?.air_date && ecartJours(dernier.air_date, aujourdhui) <= FENETRE_CALENDRIER) {
    return dernier.season_number;
  }
  return null;
}

export interface Sortie {
  /** Numéros des épisodes sortis ce jour-là */
  numeros: number[];
  /** YYYY-MM-DD, date française si le décalage est connu, sinon d'origine */
  date: string;
}

export interface CalendrierSaison {
  saison: number;
  /** « saison 4 », ou « partie 4 » quand la plateforme découpe ainsi (Lupin) */
  libelleSaison: string;
  /** true : dates françaises ; false : dates d'origine (pays du réseau) */
  datesFrance: boolean;
  nbEpisodes: number;
  disponibles: number;
  /** Prochaine sortie (un ou plusieurs épisodes le même jour), si la saison continue */
  prochaine: Sortie | null;
  /** Date du dernier épisode de la saison, si tous les épisodes sont datés */
  fin: string | null;
  /** Sorties groupées par jour, dans l'ordre */
  sorties: Sortie[];
}

/**
 * Calendrier d'une saison à la date du jour, ou null s'il n'y a rien d'utile
 * à afficher (aucun épisode daté dans la fenêtre).
 */
export function calendrierSaison(
  saison: SaisonEpisodes,
  aujourdhui: string,
  decalage: number | null
): CalendrierSaison | null {
  const dates = saison.episodes
    .filter((e) => e.date)
    .map((e) => ({ numero: e.numero, date: ajouterJours(e.date!, decalage ?? 0) }))
    .sort((a, b) => a.date.localeCompare(b.date) || a.numero - b.numero);
  if (!dates.some((e) => Math.abs(ecartJours(aujourdhui, e.date)) <= FENETRE_CALENDRIER)) return null;

  const sorties: Sortie[] = [];
  for (const e of dates) {
    const derniere = sorties.at(-1);
    if (derniere?.date === e.date) derniere.numeros.push(e.numero);
    else sorties.push({ numeros: [e.numero], date: e.date });
  }

  const nbEpisodes = saison.episodes.length;
  const toutesDatees = dates.length === nbEpisodes;
  return {
    saison: saison.saison,
    libelleSaison: /^(saison|partie) \d+$/i.test(saison.nom ?? "") ? saison.nom!.toLowerCase() : `saison ${saison.saison}`,
    datesFrance: decalage !== null,
    nbEpisodes,
    disponibles: dates.filter((e) => e.date <= aujourdhui).length,
    prochaine: sorties.find((s) => s.date > aujourdhui) ?? null,
    fin: toutesDatees && dates.length > 0 ? dates.at(-1)!.date : null,
    sorties,
  };
}

/** Calendrier d'une fiche série : saison en cours, décalage français si connu */
export function calendrierSerie(
  episodesSaison: SaisonEpisodes | undefined,
  reseaux: number[],
  plateformesFR: number[],
  aujourdhui: string
): (CalendrierSaison & { plateforme: number | null }) | null {
  if (!episodesSaison) return null;
  const decalage = decalageFrance(reseaux, plateformesFR);
  const cal = calendrierSaison(episodesSaison, aujourdhui, decalage?.jours ?? null);
  return cal ? { ...cal, plateforme: decalage?.plateforme ?? null } : null;
}

/** « mercredi 28 octobre 2026 » */
function jourDate(iso: string): string {
  const j = formatJourSemaineFR(iso);
  return j.charAt(0).toLowerCase() + j.slice(1);
}

/**
 * Phrase du calendrier, reprise dans la fiche et la description meta.
 * Avec `plateforme` (nom), les dates sont françaises ; sans, ce sont les
 * dates d'origine, et la phrase le dit.
 */
export function phraseCalendrier(cal: CalendrierSaison, plateforme: string | null): string {
  const ou = cal.datesFrance && plateforme ? ` sur ${plateforme} en France` : "";
  const origine = cal.datesFrance ? "" : " (date de diffusion d'origine ; en France, date non connue)";
  const saison = `de la ${cal.libelleSaison}`;
  if (cal.prochaine) {
    const deja = cal.datesFrance ? "déjà disponibles" : "déjà diffusés";
    const total = cal.disponibles > 0 ? ` ${cal.disponibles} sur ${cal.nbEpisodes} ${deja}.` : "";
    const fin =
      cal.fin && cal.fin !== cal.prochaine.date ? ` Fin de la saison le ${jourDate(cal.fin)}.` : "";
    return `${libelleEpisodes(cal.prochaine.numeros)} ${saison} le ${jourDate(cal.prochaine.date)}${ou}${origine}.${total}${fin}`;
  }
  const derniere = cal.sorties.at(-1)!;
  const verbe = cal.datesFrance ? "sont sortis" : "ont été diffusés";
  const quand =
    cal.sorties.length === 1 ? `le ${jourDate(derniere.date)}` : `le dernier le ${jourDate(derniere.date)}`;
  return `Les ${cal.nbEpisodes} épisodes ${saison} ${verbe}${ou}, ${quand}${origine}.`;
}

/** [5] → « Épisode 5 » ; [5, 6] → « Épisodes 5 et 6 » ; [1, 2, 3] → « Épisodes 1 à 3 » */
export function libelleEpisodes(numeros: number[]): string {
  if (numeros.length === 1) return `Épisode ${numeros[0]}`;
  if (numeros.length === 2) return `Épisodes ${numeros[0]} et ${numeros[1]}`;
  return `Épisodes ${numeros[0]} à ${numeros.at(-1)}`;
}

/** Nombre de jours de a à b (positif si b est après a) */
function ecartJours(a: string, b: string): number {
  return Math.round((parseISO(b).getTime() - parseISO(a).getTime()) / 86_400_000);
}

function ajouterJours(iso: string, jours: number): string {
  if (!jours) return iso;
  const d = parseISO(iso);
  d.setUTCDate(d.getUTCDate() + jours);
  return toISO(d);
}
