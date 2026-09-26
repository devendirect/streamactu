import type { Metadata } from "next";
import type { Contenu } from "@/types";
import {
  bornesSemaine,
  formatDateFR,
  formatJourSemaineFR,
  formatMoisFR,
  libelleComptes,
} from "./utils";

/**
 * Titres et meta descriptions de toutes les pages. Fonctions pures : les
 * longueurs sont vérifiées dans meta.test.ts pour chaque gabarit.
 *
 * Cibles (alertes Bing/Google) : titre affiché ≤ 60 caractères, suffixe
 * compris ; description entre 120 et 155 caractères.
 */

export const SUFFIXE_TITRE = " | StreamActu.fr";
export const TITRE_MAX = 60;
export const DESCRIPTION_MIN = 120;
export const DESCRIPTION_MAX = 155;

const OG_IMAGES = ["/og-default.png"];
const PLATEFORMES_PHRASE = "Netflix, Prime Video, Disney+ et les autres plateformes";

// ──────────────────────────────────────────────
// Assemblage
// ──────────────────────────────────────────────

/** Titre tel qu'il s'affiche : suffixe seulement s'il tient dans la limite */
export function titreAffiche(titre: string): string {
  return titre.length + SUFFIXE_TITRE.length <= TITRE_MAX ? titre + SUFFIXE_TITRE : titre;
}

/** Valeur `title` pour Next : `absolute` quand le suffixe ne tient pas */
export function titreMeta(titre: string): Metadata["title"] {
  return titre.length + SUFFIXE_TITRE.length <= TITRE_MAX ? titre : { absolute: titre };
}

/**
 * Description = base, puis pour chaque groupe la première variante qui tient
 * encore sous DESCRIPTION_MAX (les variantes vont de la plus riche à la plus
 * courte).
 */
export function composerDescription(base: string, ...groupes: string[][]): string {
  let texte = base.length > DESCRIPTION_MAX ? couper(base, DESCRIPTION_MAX) : base;
  for (const variantes of groupes) {
    const choix = variantes.find((v) => texte.length + 1 + v.length <= DESCRIPTION_MAX);
    if (choix) texte += " " + choix;
  }
  return texte;
}

function couper(texte: string, max: number): string {
  const coupe = texte.slice(0, max - 1);
  const espace = coupe.lastIndexOf(" ");
  return (espace > 60 ? coupe.slice(0, espace) : coupe).replace(/[\s,;:.]+$/, "") + "…";
}

/** Metadata commune : titre, description, Open Graph, canonical */
export function metadonnees(
  titre: string,
  description: string,
  canonical: string,
  extra: Partial<Metadata> = {}
): Metadata {
  return {
    title: titreMeta(titre),
    description,
    openGraph: { title: titreAffiche(titre), description, images: OG_IMAGES },
    alternates: { canonical },
    ...extra,
  };
}

// ──────────────────────────────────────────────
// Aides de rédaction
// ──────────────────────────────────────────────

/** "août 2026" → "d'août 2026" ; "juin 2026" → "de juin 2026" */
export function deMois(mois: number, annee: number): string {
  const label = formatMoisFR(mois, annee).toLowerCase();
  return /^[aeiou]/.test(label) ? `d'${label}` : `de ${label}`;
}

function moisMinuscule(mois: number, annee: number): string {
  return formatMoisFR(mois, annee).toLowerCase();
}

function jourMinuscule(date: Date): string {
  const label = formatJourSemaineFR(date);
  return label.charAt(0).toLowerCase() + label.slice(1);
}

/** Contenus distincts (un titre présent sur deux plateformes compte une fois) */
export function contenusUniques(listes: Contenu[][]): Contenu[] {
  const vus = new Set<string>();
  const uniques: Contenu[] = [];
  for (const c of listes.flat()) {
    const cle = `${c.type}-${c.id}`;
    if (vus.has(cle)) continue;
    vus.add(cle);
    uniques.push(c);
  }
  return uniques;
}

/** Comptes séries / films distincts sur un ensemble de plateformes */
export function comptesUniques(plateformes: { series: Contenu[]; films: Contenu[] }[]): {
  series: Contenu[];
  films: Contenu[];
} {
  return {
    series: contenusUniques(plateformes.map((p) => p.series)),
    films: contenusUniques(plateformes.map((p) => p.films)),
  };
}

/** Titres les plus votés, pour citer des exemples connus */
function exemples(contenus: Contenu[], n = 2): string[] {
  return [...contenus]
    .sort((a, b) => b.nbVotes - a.nbVotes)
    .slice(0, n)
    .map((c) => c.titre);
}

/** Variantes « Parmi eux : X et Y. » → « Parmi eux : X. » selon la place restante */
function variantesExemples(intro: string, contenus: Contenu[]): string[] {
  // « Parmi eux » → « Parmi elles » quand il n'y a que des séries
  if (intro === "Parmi eux :" && contenus.length > 0 && contenus.every((c) => c.type === "serie")) {
    intro = "Parmi elles :";
  }
  const [a, b] = exemples(contenus);
  if (!a) return [];
  return b ? [`${intro} ${a} et ${b}.`, `${intro} ${a}.`] : [`${intro} ${a}.`];
}

// ──────────────────────────────────────────────
// Gabarits
// ──────────────────────────────────────────────

export interface TitreDescription {
  titre: string;
  description: string;
}

export function metaAccueil(): TitreDescription {
  return {
    titre: "Nouveautés streaming du jour en France",
    description:
      "Retrouvez chaque jour les nouvelles séries et films disponibles sur Netflix, Prime Video, Disney+, Apple TV+, Canal+, HBO Max et Paramount+.",
  };
}

export function metaHubPlateforme(nom: string): TitreDescription {
  return {
    titre: `Nouveautés ${nom} de la semaine`,
    description: composerDescription(
      `Les séries et films ajoutés cette semaine au catalogue ${nom} en France, triés par note des spectateurs.`,
      ["Mis à jour chaque jour, avec les archives mois par mois.", "Mis à jour chaque jour."]
    ),
  };
}

export function metaJour(date: Date, futur: boolean, series: Contenu[], films: Contenu[]): TitreDescription {
  const titre = `Nouveautés streaming du ${formatDateFR(date)}`;
  const jour = jourMinuscule(date);
  if (futur) {
    return {
      titre,
      description: composerDescription(
        `Les épisodes et sorties annoncés le ${jour} sur ${PLATEFORMES_PHRASE} en France.`,
        ["Programme susceptible de changer d'ici là."]
      ),
    };
  }
  const comptes = libelleComptes(series.length, films.length);
  if (!comptes) {
    return {
      titre,
      description: composerDescription(
        `Les séries et films sortis le ${jour} sur ${PLATEFORMES_PHRASE} en France.`,
        [
          "Aucune sortie recensée ce jour-là : les jours voisins sont accessibles depuis la page.",
          "Aucune sortie recensée ce jour-là.",
        ]
      ),
    };
  }
  return {
    titre,
    description: composerDescription(
      `${majuscule(comptes)} sorti${accord(series.length, films.length)} le ${jour} sur ${PLATEFORMES_PHRASE}.`,
      variantesExemples("Parmi eux :", [...series, ...films]),
      ["Classés par plateforme.", "Par plateforme."]
    ),
  };
}

/** "du 22 au 28 juin 2026", "du 31 août au 6 septembre 2026", "du 28 décembre 2026 au 3 janvier 2027" */
export function periodeSemaine(semaine: number, annee: number): string {
  const { debut, fin } = bornesSemaine(semaine, annee);
  const d = new Date(debut + "T12:00:00Z");
  const f = new Date(fin + "T12:00:00Z");
  const complet = formatDateFR(f);
  if (d.getUTCFullYear() !== f.getUTCFullYear()) return `du ${formatDateFR(d)} au ${complet}`;
  if (d.getUTCMonth() !== f.getUTCMonth()) {
    const sansAnnee = formatDateFR(d).replace(/ \d{4}$/, "");
    return `du ${sansAnnee} au ${complet}`;
  }
  return `du ${d.getUTCDate()} au ${complet}`;
}

export function metaSemaine(
  semaine: number,
  annee: number,
  futur: boolean,
  series: Contenu[],
  films: Contenu[]
): TitreDescription {
  const periode = periodeSemaine(semaine, annee);
  const titre = `Nouveautés streaming ${periode}`;
  if (futur) {
    return {
      titre,
      description: composerDescription(
        `Les épisodes et sorties annoncés ${periode} sur ${PLATEFORMES_PHRASE} en France.`,
        ["Programme susceptible de changer."]
      ),
    };
  }
  const comptes = libelleComptes(series.length, films.length) || "Les séries et films";
  return {
    titre,
    description: composerDescription(
      `${majuscule(comptes)} sorti${accord(series.length, films.length)} ${periode} sur ${PLATEFORMES_PHRASE}.`,
      variantesExemples("Parmi eux :", [...series, ...films]),
      ["Classés par plateforme.", "Par plateforme."]
    ),
  };
}

export function metaMois(mois: number, annee: number, series: Contenu[], films: Contenu[]): TitreDescription {
  const comptes = libelleComptes(series.length, films.length) || "Les séries et films";
  return {
    titre: `Nouveautés streaming ${deMois(mois, annee)}`,
    description: composerDescription(
      `Le récap ${deMois(mois, annee)} : ${comptes.charAt(0).toLowerCase() + comptes.slice(1)} arrivé${accord(series.length, films.length)} sur ${PLATEFORMES_PHRASE}.`,
      variantesExemples("Parmi eux :", [...series, ...films]),
      ["Classés par plateforme.", "Par plateforme."]
    ),
  };
}

export function metaSeriesOuFilms(nom: string, type: "series" | "films", contenus: Contenu[]): TitreDescription {
  const estSeries = type === "series";
  const n = contenus.length;
  // accord : « 12 séries ajoutées… triées », « 1 film ajouté… trié »
  const fin = `${estSeries ? "e" : ""}${n > 1 ? "s" : ""}`;
  const base =
    n > 0
      ? `${n} ${estSeries ? "série" : "film"}${n > 1 ? "s" : ""} ajouté${fin} au catalogue ${nom} en France ces quatre dernières semaines, trié${fin} par note.`
      : `Les ${estSeries ? "nouvelles séries" : "nouveaux films"} ajouté${estSeries ? "es" : "s"} au catalogue ${nom} en France ces quatre dernières semaines.`;
  return {
    titre: estSeries ? `Nouvelles séries ${nom}` : `Nouveaux films ${nom}`,
    description: composerDescription(base, variantesExemples("À voir :", contenus), [
      "Mis à jour chaque jour à partir des données TMDB.",
      "Mis à jour chaque jour.",
    ]),
  };
}

export function metaProchainesSortiesPlateforme(nom: string): TitreDescription {
  return {
    titre: `Prochaines sorties ${nom}`,
    description: composerDescription(
      `Le calendrier des prochaines sorties ${nom} en France : nouvelles séries et films annoncés sur les quatre semaines à venir.`,
      ["Actualisé plusieurs fois par jour."]
    ),
  };
}

export function metaMoisPlateforme(
  nom: string,
  mois: number,
  annee: number,
  series: Contenu[],
  films: Contenu[]
): TitreDescription {
  const comptes = libelleComptes(series.length, films.length) || "Les séries et films";
  return {
    titre: `Nouveautés ${nom} ${deMois(mois, annee)}`,
    description: composerDescription(
      `${majuscule(comptes)} arrivé${accord(series.length, films.length)} sur ${nom} en ${moisMinuscule(mois, annee)} en France, trié${accord(series.length, films.length)} par note des spectateurs.`,
      variantesExemples("Parmi eux :", [...series, ...films]),
      ["Avec les liens vers les autres mois.", "Archives par mois."],
      ["Données TMDB et JustWatch."]
    ),
  };
}

export function metaAnneePlateforme(
  nom: string,
  annee: number,
  totalSeries: number,
  totalFilms: number,
  meilleurs: Contenu[]
): TitreDescription {
  const comptes = libelleComptes(totalSeries, totalFilms) || "Les séries et films";
  return {
    titre: `Nouveautés ${nom} ${annee}`,
    description: composerDescription(
      `${majuscule(comptes)} arrivé${accord(totalSeries, totalFilms)} sur ${nom} en France en ${annee} : les mieux noté${accord(totalSeries, totalFilms)} d'abord, puis le détail mois par mois.`,
      variantesExemples("Parmi eux :", meilleurs),
      ["Mis à jour chaque jour."]
    ),
  };
}

export function metaGenre(nom: string, intro: string): TitreDescription {
  return {
    titre: `${nom} : séries et films en streaming`,
    description: composerDescription(intro, [
      `Séries et films disponibles sur ${PLATEFORMES_PHRASE} en France.`,
      "Séries et films disponibles sur Netflix, Prime Video, Disney+ et ailleurs en France.",
      "Séries et films disponibles en streaming en France.",
      "À voir en streaming en France.",
    ]),
  };
}

export function metaGenrePlateforme(nomGenre: string, intro: string, nomPlateforme: string): TitreDescription {
  return {
    titre: `${nomGenre} sur ${nomPlateforme} : séries et films`,
    description: composerDescription(intro, [
      `La sélection ${nomGenre.toLowerCase()} du catalogue ${nomPlateforme} en France, séries et films.`,
      `Séries et films du catalogue ${nomPlateforme} en France.`,
      `Au catalogue ${nomPlateforme} en France.`,
    ]),
  };
}

export type PeriodeTop = { portee: "mois"; mois: number; annee: number } | { portee: "annee"; annee: number };

export function metaTop(type: "serie" | "film", periode: PeriodeTop, contenus: Contenu[]): TitreDescription {
  const estSeries = type === "serie";
  const nomType = estSeries ? "séries" : "films";
  const accord = estSeries ? "es" : "s";
  const label =
    periode.portee === "mois" ? moisMinuscule(periode.mois, periode.annee) : String(periode.annee);
  const base =
    periode.portee === "mois"
      ? `Les ${nomType} sorti${accord} en ${label} les mieux noté${accord} en streaming par abonnement en France, selon la note TMDB pondérée par le nombre de votes.`
      : `Les ${nomType} de ${label} les mieux noté${accord} en streaming par abonnement en France, selon la note TMDB pondérée par le nombre de votes.`;
  const premier = contenus[0]?.titre;
  return {
    titre: `Top ${nomType} ${label} : les mieux noté${accord}`,
    description: composerDescription(base, premier ? [`En tête : ${premier}.`] : []),
  };
}

export function metaProchainesSorties(): TitreDescription {
  return {
    titre: "Prochaines sorties streaming : les 4 semaines à venir",
    description:
      "Sorties streaming à venir en France : les séries et films annoncés sur Netflix, Prime Video, Disney+, Apple TV+, Canal+, HBO Max et Paramount+.",
  };
}

/**
 * Accord du participe avec « 3 séries et 1 film » : féminin s'il n'y a que des
 * séries, pluriel dès deux titres. Sans titre (« Les séries et films ») : "s".
 */
export function accord(nbSeries: number, nbFilms: number): string {
  const total = nbSeries + nbFilms;
  if (total === 0) return "s";
  return `${nbFilms === 0 ? "e" : ""}${total > 1 ? "s" : ""}`;
}

function majuscule(texte: string): string {
  return texte.charAt(0).toUpperCase() + texte.slice(1);
}
