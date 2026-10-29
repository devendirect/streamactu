/**
 * Offre la moins chère de chaque plateforme suivie, prix mensuel normal en
 * France (hors promotion de bienvenue et hors offres groupées des opérateurs).
 * Relevé à la main sur les pages officielles : à revoir chaque trimestre,
 * comme les guides. Une plateforme absente n'affiche pas de prix.
 */

export interface PrixAbonnement {
  /** Nom de l'offre tel que la plateforme l'écrit */
  offre: string;
  /** Euros par mois */
  prix: number;
  /** Page officielle où le prix a été lu */
  source: string;
  /** Offre qui couvre tout le catalogue, quand la moins chère n'en donne qu'une partie (Canal+) */
  complete?: { offre: string; prix: number; manque: string };
}

export const PRIX_RELEVES_LE = "2026-10-28";

export const PRIX_ABONNEMENTS: Partial<Record<number, PrixAbonnement>> = {
  // « Standard avec pub : 7,99 € par mois »
  8: { offre: "Standard avec pub", prix: 7.99, source: "https://help.netflix.com/fr/node/24926" },
  // « Standard avec pub » : 5,99 € les 6 premiers mois, puis 6,99 €
  337: { offre: "Standard avec pub", prix: 6.99, source: "https://www.disneyplus.com/fr-fr" },
  // « 9,99 € par mois après sept jours d'essai gratuit »
  350: { offre: "Apple TV", prix: 9.99, source: "https://www.apple.com/fr/apple-tv/" },
  // « Basic avec pub : 6,99 €/mois »
  1899: { offre: "Basic avec pub", prix: 6.99, source: "https://www.hbomax.com/fr/fr" },
  // « Abonnez-vous à partir de 7,99 € / mois » (offre non nommée sur la page)
  582: { offre: "Paramount+", prix: 7.99, source: "https://www.paramountplus.com/fr/" },
  // Prime Video (119) et Canal+ (381) : pages illisibles par l'outil, relevés par l'éditeur le 2026-10-28
  // Prime Video est inclus dans Amazon Prime : 6,99 €/mois ou 69,90 €/an
  119: { offre: "Amazon Prime", prix: 6.99, source: "https://www.primevideo.com/" },
  // Sans engagement : « CANAL+ SÉRIES : 6,99 €/mois », séries seulement ; « CANAL+ : 24,99 €/mois », films compris
  381: {
    offre: "CANAL+ Séries",
    prix: 6.99,
    source: "https://www.canalplus.com/",
    complete: { offre: "CANAL+", prix: 24.99, manque: "films" },
  },
};

/** 7.99 → « 7,99 € » */
export function formatPrix(prix: number): string {
  return `${prix.toFixed(2).replace(".", ",")} €`;
}
