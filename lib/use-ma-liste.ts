"use client";

import { useCallback, useEffect, useState } from "react";
import type { MediaType } from "@/types";

export interface ElementListe {
  id: number;
  type: MediaType;
  titre: string;
  slug: string;
  poster: string | null;
  note: number;
  annee: number;
  ajouteLe: string; // ISO — pour trier du plus récent au plus ancien
}

const CLE = "sa-ma-liste";
const EVENEMENT = "sa-ma-liste-change";

function lire(): ElementListe[] {
  try {
    const brut = localStorage.getItem(CLE);
    if (!brut) return [];
    const data = JSON.parse(brut);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function ecrire(liste: ElementListe[]): void {
  try {
    localStorage.setItem(CLE, JSON.stringify(liste));
  } catch {
    // stockage plein ou indisponible — l'état en mémoire reste correct
  }
  // Synchronise toutes les instances du hook sur la page
  window.dispatchEvent(new Event(EVENEMENT));
}

/**
 * Liste personnelle en localStorage, sans compte.
 * Premier rendu identique serveur/client (liste vide), restauration
 * post-montage — voir la leçon d'hydratation des jeux.
 */
export function useMaListe() {
  const [liste, setListe] = useState<ElementListe[]>([]);
  const [restaure, setRestaure] = useState(false);

  useEffect(() => {
    const sync = () => setListe(lire());
    sync();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- marqueur de restauration, un seul re-rendu
    setRestaure(true);
    window.addEventListener(EVENEMENT, sync);
    window.addEventListener("storage", sync); // autres onglets
    return () => {
      window.removeEventListener(EVENEMENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const basculer = useCallback((element: Omit<ElementListe, "ajouteLe">) => {
    const courante = lire();
    const present = courante.some((e) => e.id === element.id && e.type === element.type);
    ecrire(
      present
        ? courante.filter((e) => !(e.id === element.id && e.type === element.type))
        : [...courante, { ...element, ajouteLe: new Date().toISOString() }]
    );
  }, []);

  const retirer = useCallback((id: number, type: MediaType) => {
    ecrire(lire().filter((e) => !(e.id === id && e.type === type)));
  }, []);

  const contient = useCallback(
    (id: number, type: MediaType) => liste.some((e) => e.id === id && e.type === type),
    [liste]
  );

  return { liste, restaure, basculer, retirer, contient };
}
