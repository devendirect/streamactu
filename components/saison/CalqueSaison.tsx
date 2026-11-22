"use client";
import { useEffect, useState, useSyncExternalStore, type ComponentType } from "react";
import CalqueNoel from "@/components/noel/CalqueNoel";
import CalqueNouvelAn from "@/components/nouvelan/CalqueNouvelAn";
import { Sprites } from "@/components/saison/Briques";
import Anniv from "@/components/saison/scenes/Anniv";
import Avril from "@/components/saison/scenes/Avril";
import Cannes from "@/components/saison/scenes/Cannes";
import Cinema from "@/components/saison/scenes/Cinema";
import Espace from "@/components/saison/scenes/Espace";
import Ete from "@/components/saison/scenes/Ete";
import Halloween from "@/components/saison/scenes/Halloween";
import Oscars from "@/components/saison/scenes/Oscars";
import Paques from "@/components/saison/scenes/Paques";
import Rentree from "@/components/saison/scenes/Rentree";
import Valentin from "@/components/saison/scenes/Valentin";

/**
 * Scènes de saison : une par thème intégré (lib/saison.ts). La clé est l'id de la saison.
 * Une scène reçoit le numéro de variante tirée pour le visiteur (data-variante).
 */
const SCENES: Record<string, ComponentType<{ variante: number }>> = {
  noel: CalqueNoel,
  nouvelan: CalqueNouvelAn,
  valentin: Valentin,
  avril: Avril,
  paques: Paques,
  cannes: Cannes,
  espace: Espace,
  cinema: Cinema,
  anniv: Anniv,
  ete: Ete,
  rentree: Rentree,
  halloween: Halloween,
  oscars: Oscars,
};

const sansAbonnement = () => () => {};
const lireSaison = () => document.documentElement.getAttribute("data-saison");
const lireVariante = () => Number(document.documentElement.getAttribute("data-variante")) || 1;

/**
 * Calque de saison de la une (components/accueil/UneCarrousel.tsx) : un décor transparent posé
 * par-dessus les diapositives, hors d'elles, donc il reste en place quand les images changent.
 * Au même niveau que le faisceau : sous le titre, sous les indicateurs, sans capter de clic.
 * Hors période (pas d'attribut data-saison) ou sans scène : rien n'est rendu.
 * Monté après le chargement de la page, pour ne pas concurrencer la première image.
 */
export default function CalqueSaison() {
  const saison = useSyncExternalStore(sansAbonnement, lireSaison, () => null);
  const variante = useSyncExternalStore(sansAbonnement, lireVariante, () => 1);
  const [pret, setPret] = useState(false);

  useEffect(() => {
    if (!saison) return;
    let minuteur = 0;
    const lancer = () => {
      minuteur = window.setTimeout(() => setPret(true), 1200);
    };
    if (document.readyState === "complete") lancer();
    else window.addEventListener("load", lancer, { once: true });
    return () => {
      window.clearTimeout(minuteur);
      window.removeEventListener("load", lancer);
    };
  }, [saison]);

  const Scene = saison ? SCENES[saison] : undefined;
  if (!pret || !Scene) return null;
  return (
    <div aria-hidden="true" className="calque-saison">
      <Sprites />
      <Scene variante={variante} />
    </div>
  );
}
