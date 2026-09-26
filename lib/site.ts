/**
 * Identité du site, partagée par les pages légales, le JSON-LD et les llms.
 */

export const SITE_URL = process.env.SITE_URL ?? "https://streamactu.fr";

export const CONTACT_EMAIL = "contact@streamactu.fr";

/** Dépôt public du code (licence MIT), transféré dans l'organisation devendirect le 2026-09-26 */
export const REPO_URL = "https://github.com/devendirect/streamactu";

/** @id de l'Organization JSON-LD : les autres schémas y renvoient */
export const ORG_ID = `${SITE_URL}/#organization`;

/** Hébergeur (LCEN art. 6-III) : coordonnées vérifiées au registre national le 2026-09-25 */
export const HEBERGEUR = {
  nom: "IONOS SARL",
  adresse: "7 place de la Gare, 57200 Sarreguemines, France",
  telephone: "09 70 80 89 11",
  siren: "431 303 775",
};
