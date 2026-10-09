"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";

/**
 * Zone des listes d'un guide d'ordre, avec la barre « Mes abonnements »
 * (maquette du 2026-10-09). Le lecteur coche ses plateformes ; la zone porte
 * alors data-filtre et data-abo-{id}, et la feuille globale (globals.css) met
 * en retrait les lignes data-ligne qu'il ne peut pas regarder. Les lignes
 * restent rendues par le serveur : rien n'est retiré du HTML.
 *
 * Avant le montage, la barre n'existe pas et rien n'est filtré (page lisible
 * sans JavaScript). Le choix est commun à tous les guides.
 */

const CLE = "sa-subs";
const EVENEMENT = "sa-subs-change";

export interface ChoixPlateforme {
  id: number;
  nom: string;
  couleur: string;
  /** Nombre de titres du guide disponibles sur cette plateforme */
  nombre: number;
}

interface Props {
  plateformes: ChoixPlateforme[];
  /** Plateformes de chaque titre distinct du guide */
  titres: number[][];
  /** « séries », « films » ou « titres » */
  unite: string;
  /** Plateformes de chaque étape des ordres de l'histoire */
  etapes: number[][];
  children: ReactNode;
}

function lire(): number[] {
  try {
    const data = JSON.parse(localStorage.getItem(CLE) ?? "[]");
    return Array.isArray(data) ? data.filter((x): x is number => typeof x === "number") : [];
  } catch {
    return [];
  }
}

function ecrire(ids: number[]): void {
  try {
    localStorage.setItem(CLE, JSON.stringify(ids));
  } catch {
    // stockage indisponible : le choix vaut pour cette page seulement
  }
  window.dispatchEvent(new Event(EVENEMENT));
}

export default function ZoneAbonnements({ plateformes, titres, unite, etapes, children }: Props) {
  const [abonnements, setAbonnements] = useState<number[]>([]);
  const [monte, setMonte] = useState(false);

  useEffect(() => {
    const sync = () => setAbonnements(lire());
    sync();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- marqueur de montage, un seul re-rendu
    setMonte(true);
    window.addEventListener(EVENEMENT, sync);
    window.addEventListener("storage", sync); // autres onglets
    return () => {
      window.removeEventListener(EVENEMENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const basculer = useCallback(
    (id: number) => ecrire(abonnements.includes(id) ? abonnements.filter((x) => x !== id) : [...abonnements, id]),
    [abonnements]
  );

  // Seules les plateformes présentes dans ce guide comptent pour le filtre
  const actifs = monte ? abonnements.filter((id) => plateformes.some((p) => p.id === id)) : [];
  const filtre = actifs.length > 0;
  const visible = (ids: number[]) => ids.some((id) => actifs.includes(id));

  const synthese = filtre
    ? `Avec vos abonnements : ${titres.filter(visible).length} ${unite} sur ${titres.length}` +
      (etapes.length > 0 ? `, ${etapes.filter(visible).length} étapes de l'histoire sur ${etapes.length}.` : ".")
    : `Touchez vos abonnements : les titres que vous ne pouvez pas regarder passent en retrait. Le chiffre indique le nombre de ${unite}.`;

  const attributs: Record<string, string> = filtre ? { "data-filtre": "" } : {};
  for (const id of actifs) attributs[`data-abo-${id}`] = "";

  return (
    <div {...attributs}>
      {monte && plateformes.length > 0 && (
        <div className="sa-sticky-bleed sticky top-0 z-[3] flex flex-col gap-2.5 border-b border-border bg-background py-3">
          <div className="flex items-baseline justify-between gap-3">
            <span className="font-mono-label text-ink-3">Mes abonnements</span>
            {filtre && (
              <button
                type="button"
                onClick={() => ecrire([])}
                className="cursor-pointer border-0 bg-transparent p-0 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-3 hover:text-foreground"
              >
                Effacer
              </button>
            )}
          </div>
          <div className="-mx-5 flex gap-1.5 overflow-x-auto px-5 sm:mx-0 sm:px-0">
            {plateformes.map((p) => {
              const actif = actifs.includes(p.id);
              return (
                <button
                  key={p.id}
                  type="button"
                  aria-pressed={actif}
                  onClick={() => basculer(p.id)}
                  className={`inline-flex min-h-9 flex-none cursor-pointer items-center gap-2 whitespace-nowrap rounded-[2px] border px-3 font-mono text-[11px] font-medium uppercase tracking-[0.1em] ${
                    actif
                      ? "border-foreground bg-[#26221A] text-foreground"
                      : "border-[rgba(236,230,216,0.16)] bg-transparent text-[#9A9282]"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className="size-2 shadow-[inset_0_0_0_1px_rgba(236,230,216,0.2)]"
                    style={{ background: p.couleur }}
                  />
                  {p.nom}
                  <span className="text-primary">{p.nombre}</span>
                </button>
              );
            })}
          </div>
          <p className="m-0 font-serif text-[15px] leading-[1.4] text-[#C4BBA9]" aria-live="polite">
            {synthese}
          </p>
        </div>
      )}
      {children}
    </div>
  );
}
