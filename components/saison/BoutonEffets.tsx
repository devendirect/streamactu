"use client";
import { useSyncExternalStore } from "react";
import { abonner, basculerEffets, effetsActifs, effetsActifsServeur } from "@/components/saison/effets";

/**
 * Bouton unique « Effets de saison » de l'en-tête : coupe tous les effets (neige, particules, passages,
 * feux…) ou les remet en rejouant le spectacle. Masqué par app/saison.css tant qu'aucune saison n'est active.
 */
export default function BoutonEffets({ className = "" }: { className?: string }) {
  const actifs = useSyncExternalStore(abonner, effetsActifs, effetsActifsServeur);
  const libelle = actifs ? "Désactiver les effets de saison" : "Activer les effets de saison";
  return (
    <button type="button" data-bouton-effets aria-pressed={actifs} aria-label={libelle} title={libelle} onClick={basculerEffets} className={className}>
      <svg viewBox="0 0 24 24" width="21" height="21" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" aria-hidden="true">
        <path d="M10 3 L12 10 L19 12 L12 14 L10 21 L8 14 L1 12 L8 10 Z" />
        <path d="M19 2.5 L19.9 5 L22.4 5.9 L19.9 6.8 L19 9.3 L18.1 6.8 L15.6 5.9 L18.1 5 Z" />
      </svg>
      {!actifs && <span aria-hidden="true" className="effets-barre" />}
    </button>
  );
}
