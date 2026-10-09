"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * Étapes vues d'une liste « ordre de l'histoire » (suivi de visionnage des
 * guides d'ordre), en localStorage, sans compte. On enregistre les
 * identifiants d'étapes (idEtape), pas des positions : la progression survit
 * à une modification de l'ordre, et les étapes retirées sont ignorées.
 *
 * Premier rendu identique serveur/client (rien de vu), restauration après
 * le montage ; toutes les instances d'une même clé restent synchronisées
 * (liste, carte de progression, compteur du sommaire).
 */

const EVENEMENT = "sa-vues-change";

function cleStockage(cle: string): string {
  return `sa-vues-${cle}`;
}

function lire(cle: string): string[] {
  try {
    const data = JSON.parse(localStorage.getItem(cleStockage(cle)) ?? "[]");
    return Array.isArray(data) ? data.filter((x): x is string => typeof x === "string") : [];
  } catch {
    return [];
  }
}

function ecrire(cle: string, ids: string[]): void {
  try {
    localStorage.setItem(cleStockage(cle), JSON.stringify(ids));
  } catch {
    // stockage indisponible : la progression vaut pour cette page seulement
  }
  window.dispatchEvent(new Event(EVENEMENT));
}

export function useEtapesVues(cle: string, etapes: string[]) {
  const [vues, setVues] = useState<string[]>([]);
  const [monte, setMonte] = useState(false);

  useEffect(() => {
    const sync = () => setVues(lire(cle));
    sync();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- marqueur de montage, un seul re-rendu
    setMonte(true);
    window.addEventListener(EVENEMENT, sync);
    window.addEventListener("storage", sync); // autres onglets
    return () => {
      window.removeEventListener(EVENEMENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, [cle]);

  /** Une valeur par étape, dans l'ordre de la liste */
  const vu = etapes.map((id) => vues.includes(id));

  const basculer = useCallback(
    (id: string) => {
      const actuelles = lire(cle);
      ecrire(cle, actuelles.includes(id) ? actuelles.filter((x) => x !== id) : [...actuelles, id]);
    },
    [cle]
  );
  const reinitialiser = useCallback(() => ecrire(cle, []), [cle]);

  return { monte, vu, nombre: vu.filter(Boolean).length, basculer, reinitialiser };
}
