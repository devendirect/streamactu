"use client";
import { useEffect, useState } from "react";
import PastillePlateforme from "@/components/PastillePlateforme";
import { EVENEMENT_ABONNEMENTS, ecrireAbonnements, lireAbonnements } from "@/lib/abonnements";
import { PLATEFORMES } from "@/lib/plateformes";

type Type = "tout" | "serie" | "film";

/**
 * Puces de filtre des rangées (Tout, Séries, Films, puis plateformes). Elles
 * masquent les cartes de la zone `[data-rangees]` qui suit, et les rangées
 * devenues vides ; rien n'est retiré du HTML. Les plateformes choisies sont
 * celles de « Mes abonnements » (lib/abonnements.ts), communes à tout le site.
 */
export default function FiltresRangees({ cible = "[data-rangees]" }: { cible?: string }) {
  const [type, setType] = useState<Type>("tout");
  const [pfs, setPfs] = useState<number[]>([]);

  useEffect(() => {
    const sync = () => setPfs(lireAbonnements());
    sync();
    window.addEventListener(EVENEMENT_ABONNEMENTS, sync);
    window.addEventListener("storage", sync); // autres onglets
    return () => {
      window.removeEventListener(EVENEMENT_ABONNEMENTS, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  useEffect(() => {
    const zone = document.querySelector(cible);
    if (!zone) return;
    zone.querySelectorAll<HTMLElement>("[data-carte]").forEach((c) => {
      const pfsCarte = (c.dataset.pfs ?? "").split(" ").filter(Boolean).map(Number);
      c.hidden =
        (type !== "tout" && c.dataset.type !== type) ||
        (pfs.length > 0 && pfsCarte.length > 0 && !pfsCarte.some((p) => pfs.includes(p)));
    });
    // Une rangée sans carte visible disparaît, avec son bandeau s'il en a un
    zone.querySelectorAll<HTMLElement>("[data-rangee]").forEach((r) => {
      const vide = r.querySelector("[data-carte]:not([hidden])") === null && r.querySelector("[data-carte]") !== null;
      (r.closest<HTMLElement>("[data-rangee-bloc]") ?? r).hidden = vide;
    });
  }, [type, pfs, cible]);

  const basculer = (id: number) => ecrireAbonnements(pfs.includes(id) ? pfs.filter((x) => x !== id) : [...pfs, id]);

  return (
    <div
      role="toolbar"
      aria-label="Filtrer les rangées"
      className="flex items-center gap-2 overflow-x-auto px-gouttiere [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {(
        [
          ["tout", "Tout"],
          ["serie", "Séries"],
          ["film", "Films"],
        ] as const
      ).map(([v, label]) => (
        <button key={v} type="button" aria-pressed={type === v} onClick={() => setType(v)} className="puce puce--filtre">
          {label}
        </button>
      ))}
      <span aria-hidden="true" className="mx-1.5 h-[22px] w-px flex-none bg-trait" />
      {PLATEFORMES.map((pf) => (
        <button
          key={pf.id}
          type="button"
          aria-pressed={pfs.includes(pf.id)}
          onClick={() => basculer(pf.id)}
          className="puce puce--filtre"
        >
          <PastillePlateforme pf={pf} />
        </button>
      ))}
      {pfs.length > 0 && (
        <button
          type="button"
          onClick={() => ecrireAbonnements([])}
          className="flex-none px-1.5 text-sm font-semibold whitespace-nowrap text-ambre"
        >
          Toutes les plateformes
        </button>
      )}
    </div>
  );
}
