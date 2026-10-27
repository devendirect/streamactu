/**
 * Plateformes du lecteur (ids TMDB), gardées dans le navigateur et communes
 * à tout le site : barre « Mes abonnements » des guides, puces de filtre de
 * l'accueil. Pas de compte : seul ce navigateur s'en souvient.
 */

export const CLE_ABONNEMENTS = "sa-subs";
export const EVENEMENT_ABONNEMENTS = "sa-subs-change";

export function lireAbonnements(): number[] {
  try {
    const data = JSON.parse(localStorage.getItem(CLE_ABONNEMENTS) ?? "[]");
    return Array.isArray(data) ? data.filter((x): x is number => typeof x === "number") : [];
  } catch {
    return [];
  }
}

export function ecrireAbonnements(ids: number[]): void {
  try {
    localStorage.setItem(CLE_ABONNEMENTS, JSON.stringify(ids));
  } catch {
    // stockage indisponible : le choix vaut pour cette page seulement
  }
  window.dispatchEvent(new Event(EVENEMENT_ABONNEMENTS));
}
