import { sendGAEvent } from "@next/third-parties/google";

/** Clé localStorage du choix de consentement — partagée avec ConsentAnalytics */
export const CLE_CONSENT = "sa-consent-analytics";

/**
 * Envoie un événement GA4 — silencieux sans consentement (le tag n'est alors
 * jamais chargé, on évite juste le warning console de sendGAEvent).
 * À n'appeler que depuis des composants client.
 */
export function evenementGA(
  nom: string,
  params: Record<string, string | number> = {}
) {
  if (typeof window === "undefined") return;
  if (localStorage.getItem(CLE_CONSENT) !== "granted") return;
  sendGAEvent("event", nom, params);
}
