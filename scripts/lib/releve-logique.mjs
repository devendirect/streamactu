/**
 * Comparaison d'un relevé de catalogue avec l'état confirmé, pour une
 * plateforme et un type (film ou série). Module pur : ni base, ni réseau.
 *
 * Règles (docs/seo-geo/plan-historique-dispo.md) :
 * - Anti-bruit : un changement n'est confirmé qu'au deuxième relevé qui le
 *   montre. Vu une seule fois puis démenti (« clignotement »), il est oublié.
 * - La date d'un événement est le PREMIER jour où le changement a été vu.
 * - Garde-fou : si le relevé compte plus de 10 % de titres en moins que l'état
 *   confirmé, aucun départ n'est traité ce jour-là (relevé probablement
 *   incomplet) ; les arrivées le sont.
 * - Relevé en échec (null) : rien ne change.
 */

export const SEUIL_GARDE_FOU = 0.9;

/**
 * @typedef {{ changement: "arrivee" | "depart", vuLe: string }} Attente
 * @typedef {{ tmdbId: number, evenement: "arrivee" | "depart", jour: string }} Evenement
 *
 * @param {object} p
 * @param {Set<number>} p.confirmes  titres présents confirmés
 * @param {Map<number, Attente>} p.attente  changements vus une fois
 * @param {Set<number> | null} p.releve  titres du relevé du jour, null si le relevé a échoué
 * @param {string} p.aujourdhui  AAAA-MM-JJ
 * @returns {{
 *   statut: "ok" | "echec" | "garde_fou",
 *   evenements: Evenement[],
 *   ajouter: { tmdbId: number, depuis: string }[],
 *   retirer: number[],
 *   attente: Map<number, Attente>,
 * }}
 */
export function comparer({ confirmes, attente, releve, aujourdhui }) {
  if (releve === null) {
    return { statut: "echec", evenements: [], ajouter: [], retirer: [], attente: new Map(attente) };
  }

  const gardeFou = confirmes.size > 0 && releve.size < confirmes.size * SEUIL_GARDE_FOU;
  const evenements = [];
  const ajouter = [];
  const retirer = [];
  const nouvelleAttente = new Map();

  // Arrivées : présents aujourd'hui, pas encore confirmés
  for (const id of releve) {
    if (confirmes.has(id)) continue;
    const a = attente.get(id);
    if (a?.changement === "arrivee") {
      evenements.push({ tmdbId: id, evenement: "arrivee", jour: a.vuLe });
      ajouter.push({ tmdbId: id, depuis: a.vuLe });
    } else {
      nouvelleAttente.set(id, { changement: "arrivee", vuLe: aujourdhui });
    }
  }

  // Départs : confirmés, absents aujourd'hui
  for (const id of confirmes) {
    if (releve.has(id)) continue;
    const a = attente.get(id);
    if (gardeFou) {
      // Relevé douteux : on ne confirme ni n'oublie un départ en attente
      if (a?.changement === "depart") nouvelleAttente.set(id, a);
      continue;
    }
    if (a?.changement === "depart") {
      evenements.push({ tmdbId: id, evenement: "depart", jour: a.vuLe });
      retirer.push(id);
    } else {
      nouvelleAttente.set(id, { changement: "depart", vuLe: aujourdhui });
    }
  }
  // Les autres changements en attente sont démentis par le relevé du jour : oubliés

  return { statut: gardeFou ? "garde_fou" : "ok", evenements, ajouter, retirer, attente: nouvelleAttente };
}

/** Date du jour à Paris, AAAA-MM-JJ */
export function jourParis(date = new Date()) {
  return new Intl.DateTimeFormat("fr-CA", { timeZone: "Europe/Paris" }).format(date);
}

/** AAAA-MM-JJ moins n mois (fin de mois ramenée au dernier jour valide) */
export function moinsMois(jour, n) {
  const [a, m, j] = jour.split("-").map(Number);
  const cible = new Date(Date.UTC(a, m - 1 - n, 1));
  const dernier = new Date(Date.UTC(cible.getUTCFullYear(), cible.getUTCMonth() + 1, 0)).getUTCDate();
  cible.setUTCDate(Math.min(j, dernier));
  return cible.toISOString().slice(0, 10);
}
