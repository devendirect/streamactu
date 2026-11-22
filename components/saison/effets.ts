/**
 * Effets de saison : préférence du visiteur et mode « calme ».
 *
 * - Préférence (localStorage « effets-saison ») : effets activés par défaut ; le bouton de l'en-tête
 *   (BoutonEffets) la bascule. Désactivés : data-effets="off" sur <html>.
 * - Mode calme : à la première visite d'une saison dans la session, le spectacle joue une boucle
 *   (DUREE_BOUCLE), puis tout ce qui bouge s'éteint en fondu (data-calme sur <html>). La palette, la teinte
 *   et le décor fixe restent. Dans la même session, la page repart déjà au calme.
 * - Exceptions : le Nouvel An (compte à rebours et feux de minuit, jamais calmés) et le jeu de Pâques
 *   (interaction, pas décor). Les styles sont dans app/saison.css (classes .eff, .eff-evt).
 * L'attribut est posé tôt par le script de lib/saison.ts, puis tenu à jour par GestionEffets.
 */

const CLE_PREF = "effets-saison";
const CLE_VU = "effets-vus";
const EVT_CHANGE = "effets-change";
const EVT_REJOUER = "effets-rejouer";

/** Durée du spectacle avant le calme (les éléments qui traversent ont le temps de passer) */
export const DUREE_BOUCLE = 24000;

export type Niveau = "plein" | "calme" | "off";

export function abonner(rappel: () => void): () => void {
  window.addEventListener(EVT_CHANGE, rappel);
  window.addEventListener("storage", rappel);
  return () => {
    window.removeEventListener(EVT_CHANGE, rappel);
    window.removeEventListener("storage", rappel);
  };
}

/** Effets activés par le visiteur (par défaut oui) */
export function effetsActifs(): boolean {
  try {
    return localStorage.getItem(CLE_PREF) !== "off";
  } catch {
    return true;
  }
}

/** État courant, lu sur <html> : plein, calme (après une boucle) ou désactivé */
export function niveau(): Niveau {
  const h = document.documentElement;
  if (h.getAttribute("data-effets") === "off") return "off";
  return h.hasAttribute("data-calme") ? "calme" : "plein";
}

export const effetsActifsServeur = () => true;
export const niveauServeur = (): Niveau => "plein";

export function notifier(): void {
  window.dispatchEvent(new Event(EVT_CHANGE));
}

/** Reporte la préférence sur <html> */
export function appliquerPref(): void {
  const h = document.documentElement;
  if (effetsActifs()) h.removeAttribute("data-effets");
  else h.setAttribute("data-effets", "off");
}

/** Relance le spectacle (nouvelle boucle) : GestionEffets écoute cet événement */
export function rejouer(): void {
  document.documentElement.removeAttribute("data-calme");
  window.dispatchEvent(new Event(EVT_REJOUER));
}

/** Bouton de l'en-tête : coupe les effets, ou les remet et rejoue le spectacle */
export function basculerEffets(): void {
  try {
    localStorage.setItem(CLE_PREF, effetsActifs() ? "off" : "on");
  } catch {
    // navigateur sans stockage : le choix ne sera pas mémorisé
  }
  appliquerPref();
  if (effetsActifs()) rejouer();
  notifier();
}

export function dejaVu(saison: string): boolean {
  try {
    return sessionStorage.getItem(CLE_VU) === saison;
  } catch {
    return false;
  }
}

export function marquerVu(saison: string): void {
  try {
    sessionStorage.setItem(CLE_VU, saison);
  } catch {
    // tant pis : la prochaine page rejouera la boucle
  }
}

export const EVENEMENT_REJOUER = EVT_REJOUER;
