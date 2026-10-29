/**
 * « Quel abonnement ce mois-ci ? » : à partir des titres à voir de Ma liste
 * (déjà vus exclus) et des abonnements cochés, dit quels abonnements garder,
 * lesquels mettre en pause, et quelle plateforme prendre ensuite, mois après
 * mois, pour couvrir le plus de titres. Module pur, testé.
 */

export interface TitreRotation {
  /** « serie-1399 », « film-27205 » */
  cle: string;
  /** Plateformes suivies (ids) où le titre est inclus dans l'abonnement en France */
  plateformes: number[];
  /** Un nouvel épisode sort ce mois-ci (séries) */
  episodeCeMois: boolean;
}

export interface ChoixPlateforme {
  id: number;
  /** Titres de la liste couverts par cette plateforme */
  cles: string[];
  /** Parmi eux, séries avec un nouvel épisode ce mois-ci */
  avecEpisode: number;
}

export interface PlanRotation {
  /** Abonnements cochés qui ont au moins un titre de la liste */
  aGarder: ChoixPlateforme[];
  /** Abonnements cochés sans aucun titre de la liste */
  enPause: number[];
  /** Plateformes à prendre, dans l'ordre : la première ce mois-ci, puis une par mois (3 au plus) */
  aPrendre: ChoixPlateforme[];
  /** Titres disponibles sur aucune plateforme suivie */
  nullePart: string[];
}

const MAX_A_PRENDRE = 3;

function choix(id: number, titres: TitreRotation[]): ChoixPlateforme {
  const couverts = titres.filter((t) => t.plateformes.includes(id));
  return { id, cles: couverts.map((t) => t.cle), avecEpisode: couverts.filter((t) => t.episodeCeMois).length };
}

/**
 * `ordre` : toutes les plateformes suivies, dans l'ordre du site (départage
 * final). `prix` : prix mensuel connu, le moins cher passe devant à égalité.
 */
export function planRotation(
  titres: TitreRotation[],
  abonnements: number[],
  ordre: number[],
  prix: Partial<Record<number, number>> = {}
): PlanRotation {
  const nullePart = titres.filter((t) => t.plateformes.length === 0).map((t) => t.cle);

  const aGarder: ChoixPlateforme[] = [];
  const enPause: number[] = [];
  for (const id of ordre.filter((id) => abonnements.includes(id))) {
    const c = choix(id, titres);
    if (c.cles.length > 0) aGarder.push(c);
    else enPause.push(id);
  }
  aGarder.sort((a, b) => b.cles.length - a.cles.length || b.avecEpisode - a.avecEpisode);

  // Couverture gloutonne des titres que les abonnements gardés ne couvrent pas
  let restants = titres.filter((t) => t.plateformes.length > 0 && !t.plateformes.some((id) => abonnements.includes(id)));
  const candidates = ordre.filter((id) => !abonnements.includes(id));
  const aPrendre: ChoixPlateforme[] = [];
  while (restants.length > 0 && aPrendre.length < MAX_A_PRENDRE) {
    const meilleur = candidates
      .filter((id) => !aPrendre.some((c) => c.id === id))
      .map((id) => choix(id, restants))
      .filter((c) => c.cles.length > 0)
      .sort(
        (a, b) =>
          b.cles.length - a.cles.length ||
          b.avecEpisode - a.avecEpisode ||
          (prix[a.id] ?? Infinity) - (prix[b.id] ?? Infinity) ||
          ordre.indexOf(a.id) - ordre.indexOf(b.id)
      )[0];
    if (!meilleur) break;
    aPrendre.push(meilleur);
    restants = restants.filter((t) => !meilleur.cles.includes(t.cle));
  }

  return { aGarder, enPause, aPrendre, nullePart };
}
