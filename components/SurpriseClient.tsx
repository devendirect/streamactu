"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Contenu } from "@/types";
import Faisceau from "@/components/Faisceau";
import Icone from "@/components/Icone";
import BoutonMaListe from "@/components/BoutonMaListe";
import { metaContenu } from "@/components/CarteAffiche";

type FiltreType = "tous" | "serie" | "film";

const FILTRES: { label: string; value: FiltreType }[] = [
  { label: "Tout", value: "tous" },
  { label: "Séries", value: "serie" },
  { label: "Films", value: "film" },
];

interface SurpriseClientProps {
  initialContenu: Contenu;
}

/**
 * À la surprise : un titre tiré au hasard, sur une carte qui se retourne
 * en 3D à chaque nouveau tirage (sans rebond ; instantané sous reduced-motion).
 */
export default function SurpriseClient({ initialContenu }: SurpriseClientProps) {
  const [contenu, setContenu] = useState<Contenu>(initialContenu);
  const [filtre, setFiltre] = useState<FiltreType>("tous");
  const [loading, setLoading] = useState(false);
  // Change à chaque nouveau titre : relance le rallumage du projecteur
  const [tour, setTour] = useState(0);
  // Le faisceau vise l'emplacement de la carte (stable d'un tirage à l'autre)
  const emplacement = useRef<HTMLDivElement>(null);

  async function autreSuggestion() {
    setLoading(true);
    try {
      // Le projecteur reste baissé un court instant, même si la réponse est immédiate
      const pause = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 400;
      const [res] = await Promise.all([fetch(`/api/surprise?type=${filtre}`), new Promise((r) => setTimeout(r, pause))]);
      const data = (await res.json()) as Contenu;
      setContenu(data);
      setTour((t) => t + 1);
    } catch {
      // silently fail — keep current content
    } finally {
      setLoading(false);
    }
  }

  const href = `/${contenu.type}/${contenu.slug}`;

  return (
    <div className="scene -mt-entete flex min-h-[calc(100dvh-1px)] flex-col items-center px-gouttiere pt-[clamp(110px,15vh,160px)] pb-12 text-center">
      {/* Deux classes identiques en alternance : le rallumage repart à chaque tirage sans remonter le faisceau */}
      <div aria-hidden="true" data-eteint={loading || undefined} className={`surprise__lumiere ${tour === 0 ? "" : tour % 2 ? "revele-a" : "revele-b"}`}>
        <Faisceau cible={emplacement} />
      </div>
      <h1 className="text-[clamp(34px,4.6vw,64px)] leading-none font-black tracking-[-0.03em]">À la surprise</h1>
      <p className="mt-3 max-w-[46ch] text-texte-doux">Un titre tiré au hasard parmi les plateformes suivies. Pas convaincu ? Relancez le tirage.</p>

      <div role="group" aria-label="Type de titre" className="segments mt-6">
        {FILTRES.map((f) => (
          <button key={f.value} type="button" onClick={() => setFiltre(f.value)} aria-pressed={filtre === f.value}>
            {f.label}
          </button>
        ))}
      </div>

      {/* La carte se retourne à chaque tirage (clé = titre tiré) */}
      <div ref={emplacement} className="mt-8 [perspective:1200px]">
        <Link
          key={`${contenu.type}-${contenu.id}`}
          href={href}
          className="surprise__carte group relative block h-[330px] w-[220px] overflow-hidden rounded-[14px] bg-surface shadow-[0_-14px_50px_-12px_rgba(255,236,196,0.3),0_24px_60px_rgba(0,0,0,0.7)]"
        >
          {contenu.poster && (
            <Image
              src={contenu.poster}
              alt={contenu.titre}
              fill
              sizes="220px"
              preload
              className={`object-cover transition-[filter,transform] duration-300 ease-salle group-hover:scale-[1.03] ${loading ? "brightness-[0.3]" : ""}`}
            />
          )}
        </Link>
      </div>

      <div className="mt-6 max-w-[46ch]" aria-live="polite">
        <h2 className="text-[clamp(22px,2.2vw,30px)] font-extrabold tracking-[-0.02em]">
          <Link href={href} className="transition-colors duration-200 hover:text-white">
            {contenu.titre}
          </Link>
        </h2>
        <p className="mt-1 flex flex-wrap items-center justify-center gap-x-2.5 text-sm text-texte-2">
          {metaContenu(contenu)}
          {contenu.note > 0 && (
            <span className="inline-flex items-center gap-1 font-bold text-white">
              <Icone nom="etoile" taille={13} className="fill-current text-ambre" />
              {contenu.note.toFixed(1).replace(".", ",")}
            </span>
          )}
        </p>
        {contenu.synopsis && (
          <p className="mt-3 line-clamp-3 text-[15px] leading-[1.55] text-texte-doux">{contenu.synopsis}</p>
        )}
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
        <Link href={`${href}#ou-regarder`} className="btn-blanc">
          <Icone nom="externe" taille={20} />
          Où regarder
        </Link>
        <button type="button" onClick={autreSuggestion} disabled={loading} className="btn-verre disabled:opacity-60">
          <Icone nom="de" taille={20} />
          {loading ? "Tirage…" : "Autre tirage"}
        </button>
        <BoutonMaListe contenu={contenu} variante="rond" />
      </div>
    </div>
  );
}
