import type { Contenu } from "@/types";
import type { SortiesJour } from "@/components/ListeSortiesParJour";
import { formatJourSemaineFR, scoreBayesien } from "./utils";

/**
 * Phrases de synthèse calculées depuis les données affichées sur la page.
 * Elles parlent de « cette liste » : les listes TMDB sont plafonnées (20 titres
 * par requête), un compte affiché n'est donc pas un total exhaustif.
 */

const parScore = (a: Contenu, b: Contenu) =>
  scoreBayesien(b.note, b.nbVotes) - scoreBayesien(a.note, a.nbVotes);

function note(c: Contenu): string {
  return c.note.toFixed(1).replace(".", ",");
}

function pluriel(n: number, singulier: string, plurielForme = `${singulier}s`): string {
  return `${n} ${n > 1 ? plurielForme : singulier}`;
}

function meilleur(contenus: Contenu[]): Contenu | undefined {
  return [...contenus].filter((c) => c.nbVotes > 0).sort(parScore)[0];
}

/** Séries dont le premier épisode est sorti entre deux dates ISO (bornes incluses) */
function lancements(series: Contenu[], debutISO: string, finISO: string): Contenu[] {
  return series.filter(
    (s) => s.premiereDiffusion && s.premiereDiffusion >= debutISO && s.premiereDiffusion <= finISO
  );
}

/** Page /{plateforme}/series : nouvelles séries vs nouvelles saisons, la mieux notée */
export function syntheseSeries(series: Contenu[], depuisISO: string, jusquaISO: string): string | null {
  if (series.length === 0) return null;
  const nouvelles = lancements(series, depuisISO, jusquaISO).length;
  const suites = series.length - nouvelles;
  const phrases: string[] = [];
  if (nouvelles > 0 && suites > 0) {
    phrases.push(
      `Dans cette liste, ${pluriel(nouvelles, "série vient", "séries viennent")} d'être lancée${nouvelles > 1 ? "s" : ""} et ${pluriel(suites, "autre revient", "autres reviennent")} avec une nouvelle saison ou de nouveaux épisodes.`
    );
  } else if (nouvelles > 0) {
    phrases.push(`Toutes les séries de cette liste viennent d'être lancées : aucune nouvelle saison d'une série déjà connue.`);
  } else {
    phrases.push(`Toutes les séries de cette liste sont des séries déjà lancées qui reviennent avec de nouveaux épisodes.`);
  }
  const top = meilleur(series);
  if (top) phrases.push(`La mieux notée par les spectateurs : ${top.titre} (${note(top)}/10 sur TMDB).`);
  return phrases.join(" ");
}

/** Page /{plateforme}/films : genre dominant, le mieux noté */
export function syntheseFilms(films: Contenu[]): string | null {
  if (films.length === 0) return null;
  const parGenre = new Map<string, number>();
  for (const f of films) for (const g of f.genres) parGenre.set(g.nom, (parGenre.get(g.nom) ?? 0) + 1);
  const [genre, nb] = [...parGenre.entries()].sort((a, b) => b[1] - a[1])[0] ?? [];
  const phrases: string[] = [];
  if (genre && nb && nb > 1) {
    phrases.push(`Genre le plus représenté dans cette liste : ${genre.toLowerCase()}, avec ${nb} films sur ${films.length}.`);
  }
  const top = meilleur(films);
  if (top) phrases.push(`Le mieux noté par les spectateurs : ${top.titre} (${note(top)}/10 sur TMDB).`);
  return phrases.length ? phrases.join(" ") : null;
}

/** Page /{plateforme}/prochaines-sorties : prochaine date, nombre de jours */
export function syntheseCalendrier(jours: SortiesJour[]): string | null {
  const premier = jours[0];
  if (!premier || premier.contenus.length === 0) return null;
  const titres = premier.contenus.slice(0, 2).map((c) => c.titre);
  const date = formatJourSemaineFR(premier.dateISO);
  const phraseDate = `Prochaine sortie annoncée : ${titres.join(" et ")}, le ${date.charAt(0).toLowerCase()}${date.slice(1)}.`;
  if (jours.length === 1) return phraseDate;
  return `${phraseDate} Des sorties sont prévues sur ${jours.length} jours différents d'ici quatre semaines.`;
}

/** Archive /{plateforme}/{mois} : lancements du mois, le mieux noté */
export function syntheseMois(
  series: Contenu[],
  films: Contenu[],
  debutISO: string,
  finISO: string,
  labelMois: string
): string | null {
  const phrases: string[] = [];
  const nouvelles = lancements(series, debutISO, finISO);
  if (nouvelles.length > 0) {
    const exemple = [...nouvelles].sort(parScore)[0];
    phrases.push(
      nouvelles.length > 1
        ? `${nouvelles.length} séries de cette liste ont été lancées en ${labelMois}, dont ${exemple.titre} ; les autres reviennent avec une nouvelle saison ou de nouveaux épisodes.`
        : `Une seule série de cette liste a été lancée en ${labelMois} : ${exemple.titre}.`
    );
  }
  const top = meilleur([...series, ...films]);
  if (top) {
    phrases.push(
      `Le titre le mieux noté du mois : ${top.titre} (${top.type === "serie" ? "série" : "film"}, ${note(top)}/10 sur TMDB).`
    );
  }
  return phrases.length ? phrases.join(" ") : null;
}

/** Page jour : répartition par plateforme */
export function syntheseJour(
  parPlateforme: { nom: string; nb: number }[],
  labelJour: string
): string | null {
  const actives = parPlateforme.filter((p) => p.nb > 0).sort((a, b) => b.nb - a.nb);
  if (actives.length === 0) return null;
  const jour = labelJour.charAt(0).toLowerCase() + labelJour.slice(1);
  if (actives.length === 1) {
    return `Le ${jour}, les sorties recensées ici viennent toutes de ${actives[0].nom} (${pluriel(actives[0].nb, "titre")}).`;
  }
  const [premiere] = actives;
  return `Le ${jour}, ${actives.length} plateformes ont des sorties recensées ici ; ${premiere.nom} en compte le plus (${pluriel(premiere.nb, "titre")}).`;
}
