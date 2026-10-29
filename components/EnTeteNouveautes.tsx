import Image from "next/image";
import type { ReactNode } from "react";
import type { Plateforme } from "@/types";
import Faisceau from "@/components/Faisceau";

interface Props {
  titre: string;
  intro: string;
  /** Image de fond de la scène (une affiche de la page), sinon le noir éclairé seul */
  fond?: string | null;
  /** Plateforme de la page : bloc de marque (carré de couleur et initiale) au-dessus du titre */
  marque?: Plateforme;
  /** Sous le texte : segments, liens de navigation */
  children?: ReactNode;
}

/**
 * En-tête des pages de listes (jour, semaine, mois, plateformes, tops,
 * genres, calendrier) : une scène éclairée sous l'en-tête fixe, faisceau
 * adouci. Rendu côté serveur : le h1 et le paragraphe restent indexables.
 */
export default function EnTeteNouveautes({ titre, intro, fond, marque, children }: Props) {
  return (
    <header className="scene -mt-entete flex min-h-[380px] flex-col justify-end px-gouttiere pt-[clamp(130px,18vh,190px)] pb-[34px]">
      {fond && (
        <div className="scene__fond">
          <Image src={fond} alt="" fill sizes="100vw" loading="eager" fetchPriority="high" className="object-cover object-[65%_20%] brightness-[0.62] saturate-[0.9]" />
        </div>
      )}
      <Faisceau doux />
      {marque && (
        <span
          aria-hidden="true"
          className={`mb-4 grid size-[52px] place-items-center rounded-xl text-2xl font-black shadow-[0_14px_24px_-12px_rgba(0,0,0,0.9)] ${
            marque.slug === "apple-tv-plus" || marque.slug === "canal-plus" ? "text-[#111]" : "text-white"
          }`}
          style={{ background: marque.couleur }}
        >
          {marque.nom[0]}
        </span>
      )}
      <h1 className="max-w-[24ch] text-[clamp(34px,4.6vw,64px)] leading-none font-black tracking-[-0.03em]">{titre}</h1>
      <p className="mt-3 max-w-[62ch] text-[clamp(16px,1.2vw,18px)] text-texte-doux">{intro}</p>
      {children && <div className="mt-5">{children}</div>}
    </header>
  );
}
