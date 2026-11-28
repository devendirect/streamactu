/**
 * Fréquentation des salles de cinéma en France, estimations mensuelles du CNC.
 * Pas de jeu de données ouvert : chiffres recopiés à la main des communiqués
 * (un chiffre n'est pas protégé, le communiqué est cité en lien).
 *
 * Le CNC révise ses estimations d'un communiqué à l'autre (janvier 2026 :
 * 15,89 puis 15,55). On garde toujours la version la plus récente : le tableau
 * du dernier communiqué remplace les mois qu'il couvre.
 *
 * Mise à jour : une fois par mois, dans les premiers jours du mois (le CNC
 * publie le mois écoulé), en même temps que l'article « Nouveautés du mois ».
 * Bilan de l'année : communiqué de fin décembre.
 */

export interface MoisFrequentation {
  /** AAAA-MM */
  mois: string;
  /** Millions d'entrées, tel qu'écrit par le CNC */
  entrees: number;
  /** Évolution sur un an, en %, telle qu'écrite par le CNC */
  evolution: number;
  /** Communiqué d'où vient la valeur retenue (le plus récent qui la donne) */
  source: string;
}

const CNC_NOV_2025 =
  "https://www.cnc.fr/professionnels/communiques-de-presse/plus-de-14-millions-dentrees-en-novembre-dans-les-salles-de-cinema_2505636";
const CNC_BILAN_2025 =
  "https://www.cnc.fr/professionnels/communiques-de-presse/malgre-une-annee-en-demiteinte-avec-pres-de-157-millions-dentrees-dans-ses-salles-de-cinema-la-france-demeure-largement-le-premier-marche-europeen_2519012";
const CNC_OCT_2026 =
  "https://www.cnc.fr/professionnels/communiques-de-presse/la-frequentation-au-mois-doctobre-2026-depasse-les-14-millions-dentrees_2693688";

/** Relevé le 2026-11-28 (communiqués du 04/12/2025, du 30/12/2025 et du 03/11/2026) */
export const FREQUENTATION_MOIS: MoisFrequentation[] = [
  { mois: "2025-11", entrees: 14.12, evolution: -20.8, source: CNC_NOV_2025 },
  { mois: "2025-12", entrees: 20.73, evolution: 0.9, source: CNC_BILAN_2025 },
  // Tableau révisé du communiqué du 03/11/2026
  { mois: "2026-01", entrees: 15.55, evolution: 12.5, source: CNC_OCT_2026 },
  { mois: "2026-02", entrees: 17.45, evolution: 22.0, source: CNC_OCT_2026 },
  { mois: "2026-03", entrees: 13.22, evolution: 3.9, source: CNC_OCT_2026 },
  { mois: "2026-04", entrees: 15.96, evolution: 34.8, source: CNC_OCT_2026 },
  { mois: "2026-05", entrees: 15.16, evolution: 34.9, source: CNC_OCT_2026 },
  { mois: "2026-06", entrees: 13.22, evolution: 16.2, source: CNC_OCT_2026 },
  { mois: "2026-07", entrees: 17.31, evolution: 21.0, source: CNC_OCT_2026 },
  { mois: "2026-08", entrees: 20.4, evolution: 104.8, source: CNC_OCT_2026 },
  { mois: "2026-09", entrees: 8.88, evolution: -7.3, source: CNC_OCT_2026 },
  { mois: "2026-10", entrees: 14.66, evolution: 17.1, source: CNC_OCT_2026 },
];

/** Bilans annuels (communiqué de fin d'année) */
export const FREQUENTATION_ANNEES: { annee: number; entrees: number; evolution: number; source: string }[] = [
  { annee: 2025, entrees: 156.79, evolution: -13.6, source: CNC_BILAN_2025 },
];

const MOIS_NOMS = [
  "janvier", "février", "mars", "avril", "mai", "juin",
  "juillet", "août", "septembre", "octobre", "novembre", "décembre",
];

/** « 14,66 » ; « 20,4 » */
const nombre = (n: number) => n.toLocaleString("fr-FR", { maximumFractionDigits: 2 });

/** Dernier mois connu, ou null */
export function dernierMois(liste: MoisFrequentation[] = FREQUENTATION_MOIS): MoisFrequentation | null {
  return [...liste].sort((a, b) => a.mois.localeCompare(b.mois)).at(-1) ?? null;
}

/**
 * « En octobre 2026, les salles de cinéma françaises ont enregistré 14,66
 * millions d'entrées, en hausse de 17,1 % sur un an (estimation du CNC). »
 * Ajoute « le meilleur mois de l'année » si aucun mois connu de la même année
 * ne fait mieux (seulement à partir du deuxième mois de l'année).
 */
export function phraseFrequentation(m: MoisFrequentation, liste: MoisFrequentation[] = FREQUENTATION_MOIS): string {
  const [annee, mm] = m.mois.split("-");
  const nomMois = `${MOIS_NOMS[Number(mm) - 1]} ${annee}`;
  const sens =
    m.evolution > 0
      ? `en hausse de ${nombre(m.evolution)} % sur un an`
      : m.evolution < 0
        ? `en baisse de ${nombre(Math.abs(m.evolution))} % sur un an`
        : "stable sur un an";
  const memeAnnee = liste.filter((x) => x.mois.startsWith(`${annee}-`) && x.mois <= m.mois);
  // Seulement si tous les mois depuis janvier sont connus (2025 ne commence qu'en novembre ici)
  const complet = memeAnnee.length === Number(mm);
  const meilleur = complet && memeAnnee.length > 1 && memeAnnee.every((x) => x.entrees <= m.entrees);
  return `En ${nomMois}, les salles de cinéma françaises ont enregistré ${nombre(m.entrees)} millions d'entrées, ${sens}${
    meilleur ? `, le meilleur mois de l'année` : ""
  } (estimation du CNC).`;
}
