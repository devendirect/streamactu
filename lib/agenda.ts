/**
 * Événements des calendriers à ajouter à son agenda (/calendrier/*.ics), à
 * partir des données déjà calculées pour les pages : sorties à venir, et
 * calendrier de la saison en cours des fiches séries. Module pur, testé.
 */

import type { Contenu } from "@/types";
import type { CalendrierSaison } from "./episodes";
import type { EvenementICS } from "./ics";
import { libelleEpisodes } from "./episodes";
import { PLATEFORME_PAR_ID } from "./plateformes";

const DOMAINE_UID = "streamactu.fr";
/** Sorties déjà passées gardées dans le flux : l'agenda garde la trace de la semaine écoulée */
const JOURS_PASSES = 7;

const uid = (cle: string) => `streamactu-${cle}@${DOMAINE_UID}`;

/** Sorties à venir (nouvelles séries et films), déjà regroupées par jour pour la page */
export function evenementsSorties(jours: { dateISO: string; contenus: Contenu[] }[], siteUrl: string): EvenementICS[] {
  return jours.flatMap(({ dateISO, contenus }) =>
    contenus.map((c) => {
      const ou = c.plateforme ? ` sur ${c.plateforme.nom}` : "";
      return {
        uid: uid(`sortie-${c.type}-${c.id}`),
        date: dateISO,
        titre: `${c.titre} (${c.type === "serie" ? "série" : "film"}${ou})`,
        description: `${c.type === "serie" ? "Nouvelle série annoncée" : "Film annoncé"}${ou} en France. La date peut encore bouger. Fiche : ${siteUrl}/${c.type}/${c.slug}`,
        url: `${siteUrl}/${c.type}/${c.slug}`,
      };
    })
  );
}

/** Épisodes de la saison en cours d'une série, un événement par jour de sortie */
export function evenementsSerie(
  serie: { id: number; titre: string; slug: string; calendrier: (CalendrierSaison & { plateforme: number | null }) | null },
  aujourdhui: string,
  siteUrl: string
): EvenementICS[] {
  const cal = serie.calendrier;
  if (!cal) return [];
  const depuis = decaler(aujourdhui, -JOURS_PASSES);
  const plateforme = cal.datesFrance && cal.plateforme ? PLATEFORME_PAR_ID[cal.plateforme]?.nom : null;
  const quand = plateforme
    ? `Date de sortie sur ${plateforme} en France.`
    : "Date de diffusion d'origine : en France, l'épisode peut arriver le lendemain ou plus tard.";
  const url = `${siteUrl}/serie/${serie.slug}`;
  return cal.sorties
    .filter((s) => s.date >= depuis)
    .map((s) => ({
      uid: uid(`serie-${serie.id}-s${cal.saison}e${s.numeros[0]}`),
      date: s.date,
      titre: `${serie.titre} : ${cal.libelleSaison}, ${libelleEpisodes(s.numeros).toLowerCase()}`,
      description: `${quand} Fiche : ${url}`,
      url,
    }));
}

/** Sortie numérique française à venir d'un film (achat, location ou plateforme nommée) */
export function evenementFilm(
  film: { id: number; titre: string; slug: string; sortieNumerique: { date: string; plateforme: number | null } | null },
  siteUrl: string
): EvenementICS[] {
  if (!film.sortieNumerique) return [];
  const plateforme = film.sortieNumerique.plateforme ? PLATEFORME_PAR_ID[film.sortieNumerique.plateforme]?.nom : null;
  const url = `${siteUrl}/film/${film.slug}`;
  return [
    {
      uid: uid(`film-${film.id}-numerique`),
      date: film.sortieNumerique.date,
      titre: plateforme ? `${film.titre} (film, sur ${plateforme})` : `${film.titre} (film, sortie numérique)`,
      description: `${plateforme ? `Arrivée annoncée sur ${plateforme} en France.` : "Sortie numérique en France : achat ou location, pas forcément dans un abonnement."} Fiche : ${url}`,
      url,
    },
  ];
}

function decaler(iso: string, jours: number): string {
  const d = new Date(`${iso}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + jours);
  return d.toISOString().slice(0, 10);
}
