import type { Contenu, NouveautesParPlateforme, Plateforme } from "@/types";
import { editionCourante } from "./actu";
import { plateformesDepuisFournisseurs } from "./plateformes";
import { getDetailFilm, getDetailSerie, getImagesUne, getNouveautesSemaine } from "./tmdb";
import { getISOWeek, scoreBayesien } from "./utils";

/**
 * Données de l'accueil « La salle obscure » : la une et les rangées sont
 * tirées des caches existants (nouveautés de la semaine, sorties à venir,
 * fiches), sans nouvel appel sauf les images de la une.
 */

/** Titres de toutes les plateformes, chacun avec sa plateforme, sans doublon (la première trouvée garde le titre) */
export function aplatir(donnees: NouveautesParPlateforme[], quoi: "series" | "films" | "tout" = "tout"): Contenu[] {
  const vus = new Set<string>();
  const sortie: Contenu[] = [];
  for (const { plateforme, series, films } of donnees) {
    const liste = quoi === "series" ? series : quoi === "films" ? films : [...series, ...films];
    for (const c of liste) {
      const cle = `${c.type}-${c.id}`;
      if (vus.has(cle)) continue;
      vus.add(cle);
      sortie.push({ ...c, plateforme: c.plateforme ?? plateforme });
    }
  }
  return sortie;
}

/** Mieux notés d'abord, la note pondérée par le nombre de votes (même règle que les tops) */
export function parScore(contenus: Contenu[]): Contenu[] {
  return [...contenus].sort((a, b) => scoreBayesien(b.note, b.nbVotes) - scoreBayesien(a.note, a.nbVotes));
}

/** Top 10 des séries de la semaine (accueil, pastille de rang des fiches) */
export function top10Series(seriesSemaine: Contenu[]): Contenu[] {
  return parScore(seriesSemaine).slice(0, 10);
}

/** Rang d'une série dans le Top 10 de la semaine en cours (1 à 10), sinon null */
export async function rangSemaine(id: number, maintenant: Date = new Date()): Promise<number | null> {
  const { semaine, annee } = getISOWeek(maintenant);
  try {
    const rang = top10Series(aplatir(await getNouveautesSemaine(semaine, annee), "series")).findIndex((c) => c.id === id);
    return rang >= 0 ? rang + 1 : null;
  } catch {
    // La pastille est un bonus : la fiche s'affiche sans
    return null;
  }
}

export interface DiapoUne {
  contenu: Contenu;
  /** Grande image de fond (w1280), sinon celle du contenu */
  fond: string | null;
  /** Logo du titre, s'il existe */
  logo: string | null;
  /** Première plateforme suivie où le titre est disponible */
  plateforme: Plateforme | null;
}

const MAX_DIAPOS = 4;

/**
 * La une : les œuvres de l'édition courante de « Que regarder ce week-end »
 * (décision du 2026-10-27), sinon les séries les mieux notées de la semaine.
 * Quatre titres au plus.
 */
export async function getUne(seriesSemaine: Contenu[]): Promise<DiapoUne[]> {
  const article = editionCourante("week-end");
  const oeuvres = article
    ? article.sections.flatMap((s) => (s.oeuvre ? [s.oeuvre] : []))
    : parScore(seriesSemaine).map((c) => ({ type: c.type, id: c.id }));
  const uniques = oeuvres.filter((o, i) => oeuvres.findIndex((x) => x.type === o.type && x.id === o.id) === i).slice(0, MAX_DIAPOS);

  const diapos = await Promise.all(
    uniques.map(async (o): Promise<DiapoUne | null> => {
      try {
        const [contenu, images] = await Promise.all([
          o.type === "serie" ? getDetailSerie(o.id) : getDetailFilm(o.id),
          getImagesUne(o.type, o.id),
        ]);
        const plateforme = plateformesDepuisFournisseurs(contenu.dispo ?? [])[0] ?? contenu.plateforme ?? null;
        // Champs de carte seulement : la une est un composant client, la fiche entière
        // (casting, saisons, épisodes) partirait dans la page
        const { id, type, titre, slug, poster, backdrop, note, nbVotes, annee, genres, synopsis, saisonActuelle, premiereDiffusion } =
          contenu;
        return {
          contenu: { id, type, titre, slug, poster, backdrop, note, nbVotes, annee, genres, synopsis, saisonActuelle, premiereDiffusion },
          fond: images.fond ?? backdrop,
          logo: images.logo,
          plateforme,
        };
      } catch (err) {
        console.error(`[accueil] une : ${o.type}/${o.id} indisponible :`, err instanceof Error ? err.message : err);
        return null;
      }
    })
  );
  return diapos.filter((d): d is DiapoUne => d !== null && d.fond !== null);
}
