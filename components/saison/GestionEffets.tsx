"use client";
import { useEffect } from "react";
import { DUREE_BOUCLE, EVENEMENT_REJOUER, appliquerPref, dejaVu, marquerVu, notifier } from "@/components/saison/effets";

/**
 * Pilote le mode calme des effets de saison (voir effets.ts) : une boucle de spectacle, puis le calme.
 * Rien à l'écran. Le Nouvel An est exempté : son compte à rebours et ses feux ne se calment jamais.
 */
export default function GestionEffets() {
  useEffect(() => {
    const h = document.documentElement;
    const saison = h.getAttribute("data-saison");
    if (!saison) return;
    appliquerPref();
    if (saison === "nouvelan") return;

    let minuteur = 0;
    const lancer = (forcer: boolean) => {
      window.clearTimeout(minuteur);
      if (!forcer && dejaVu(saison)) {
        h.setAttribute("data-calme", "1");
        notifier();
        return;
      }
      // les scènes se montent un instant après le chargement : on laisse une marge
      minuteur = window.setTimeout(() => {
        h.setAttribute("data-calme", "1");
        marquerVu(saison);
        notifier();
      }, DUREE_BOUCLE + 1500);
    };
    const rejouer = () => lancer(true);

    lancer(false);
    window.addEventListener(EVENEMENT_REJOUER, rejouer);
    return () => {
      window.clearTimeout(minuteur);
      window.removeEventListener(EVENEMENT_REJOUER, rejouer);
    };
  }, []);

  return null;
}
