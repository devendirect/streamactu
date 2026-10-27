"use client";
import Link from "next/link";
import { useRef, type ReactNode } from "react";
import Icone from "@/components/Icone";

interface Props {
  titre: string;
  /** Lien du titre (« Voir tout ») */
  href?: string;
  /** Petite ligne à côté du titre (compte, période) */
  sous?: ReactNode;
  /** Cartes paysage (16:9) plutôt qu'affiches */
  paysage?: boolean;
  /** Titre en capitales de salle (rangée posée sur le velours) */
  salle?: boolean;
  /** Niveau du titre : 1 pour la rangée qui porte le h1 de la page */
  niveau?: 1 | 2;
  className?: string;
  /** Cartes rendues par le serveur */
  children: ReactNode;
}

/**
 * Rangée horizontale d'affiches : défilement tactile aimanté, flèches en
 * desktop (visibles au survol ou au focus de la rangée), titre lien.
 * Les cartes restent dans le HTML : la rangée se lit sans JavaScript.
 */
export default function Rangee({ titre, href, sous, paysage = false, salle = false, niveau = 2, className = "", children }: Props) {
  const Titre = niveau === 1 ? "h1" : "h2";
  const piste = useRef<HTMLDivElement>(null);

  const defiler = (sens: 1 | -1) => {
    const el = piste.current;
    if (!el) return;
    const calme = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: sens * el.clientWidth * 0.85, behavior: calme ? "auto" : "smooth" });
  };

  const classeTitre = salle
    ? "font-salle text-[clamp(22px,2vw,28px)] font-extrabold tracking-[0.01em] text-lumiere"
    : "text-[clamp(19px,1.6vw,23px)] font-bold tracking-[-0.01em]";

  return (
    <section data-rangee aria-label={titre} className={`rangee mb-rangee ${className}`}>
      <div className="mb-3 flex items-baseline gap-3.5 px-gouttiere max-[760px]:flex-wrap max-[760px]:gap-y-0.5">
        <Titre className={`leading-[1.2] ${classeTitre}`}>
          {href ? (
            <Link href={href} className="lien-fleche font-[inherit]">
              {titre}
              <Icone nom="droite" taille={18} />
            </Link>
          ) : (
            titre
          )}
        </Titre>
        {sous && <p className="text-sm text-texte-2 max-[760px]:basis-full">{sous}</p>}
        <div className="rangee__fleches ml-auto flex gap-1.5 max-[760px]:hidden">
          {([-1, 1] as const).map((sens) => (
            <button
              key={sens}
              type="button"
              onClick={() => defiler(sens)}
              aria-label={sens < 0 ? `Défiler ${titre} vers la gauche` : `Défiler ${titre} vers la droite`}
              className={`grid size-9 place-items-center rounded-full border transition-colors duration-200 hover:bg-white/10 ${
                salle ? "border-lumiere/30" : "border-trait hover:border-white/40"
              }`}
            >
              <Icone nom={sens < 0 ? "gauche" : "droite"} taille={20} />
            </button>
          ))}
        </div>
      </div>
      <div ref={piste} className={`rangee__piste ${paysage ? "rangee__piste--paysage" : ""}`}>
        {children}
      </div>
    </section>
  );
}
