/**
 * Plafonds quotidiens GLOBAUX des appels à l'IA, tous visiteurs confondus.
 * Les limites par IP ne protègent pas d'un afflux de visiteurs (après une
 * mention ou un lien très vu) : ces plafonds bornent la facture Anthropic.
 * Réglables sans rebuild par variables d'environnement.
 * Module sans effet de bord : importable depuis une page (rate-limit.ts lance
 * un setInterval au chargement).
 */

function entierPositif(valeur: string | undefined, defaut: number): number {
  const n = Number.parseInt(valeur ?? "", 10);
  return Number.isFinite(n) && n > 0 ? n : defaut;
}

export const PLAFONDS_IA_JOUR = {
  retrouver: entierPositif(process.env.IA_PLAFOND_RETROUVER_JOUR, 300),
  convaincs: entierPositif(process.env.IA_PLAFOND_CONVAINCS_JOUR, 1000),
};
