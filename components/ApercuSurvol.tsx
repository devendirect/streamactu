"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { MediaType } from "@/types";
import Icone from "@/components/Icone";
import BoutonMaListe from "@/components/BoutonMaListe";

interface Apercu {
  id: number;
  type: MediaType;
  titre: string;
  slug: string;
  poster: string | null;
  backdrop: string | null;
  note: number;
  annee: number;
  meta: string;
  genres: string[];
  pf: { nom: string; couleur: string } | null;
}

const LARGEUR = 340;
const DELAI = 420;
// Cartes concernées : affiches des rangées et des grilles, jamais le Top 10 ni les paysages
const CARTES = ".rangee:not(.top10) .rangee__piste:not(.rangee__piste--paysage) [data-carte], [data-grille] [data-carte]";

/**
 * Aperçu agrandi au survol d'une affiche (desktop seulement) : la carte
 * s'ouvre sur place après un court délai, avec l'image de fond, Ma liste, la
 * note et les genres. Monté une fois dans le layout ; inerte au tactile et
 * sous 900 px. Les cartes restent des liens : l'aperçu n'est qu'un raccourci.
 */
export default function ApercuSurvol() {
  const [donnees, setDonnees] = useState<Apercu | null>(null);
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0, ox: 0 });
  const boite = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const souris = window.matchMedia("(hover: hover) and (min-width: 901px)");
    let attente: number | undefined;
    let cache: number | undefined;
    let survolee: Element | null = null;

    const masquer = () => {
      window.clearTimeout(attente);
      setVisible(false);
      survolee = null;
    };

    const montrer = (carte: HTMLElement) => {
      let d: Apercu;
      try {
        // Un titre présent dans plusieurs rangées ne porte son JSON qu'une fois (attributsCarte)
        const brut =
          carte.dataset.apercu ??
          document.querySelector<HTMLElement>(`[data-apercu][data-cle="${carte.dataset.cle}"]`)?.dataset.apercu;
        d = JSON.parse(brut ?? "");
      } catch {
        return;
      }
      const image = carte.querySelector("a > span") ?? carte;
      const r = image.getBoundingClientRect();
      const x = Math.min(Math.max(r.left + r.width / 2 - LARGEUR / 2, 12), window.innerWidth - LARGEUR - 12);
      const y = Math.max(76, Math.min(r.top + r.height / 2 - 150, window.innerHeight - 330));
      setPosition({ x, y, ox: r.left + r.width / 2 - x });
      setDonnees(d);
      setVisible(true);
    };

    const survol = (e: MouseEvent) => {
      if (!souris.matches) return;
      const cible = e.target as Element;
      if (boite.current?.contains(cible)) {
        window.clearTimeout(cache);
        return;
      }
      const carte = cible.closest<HTMLElement>(CARTES);
      if (carte && carte !== survolee) {
        survolee = carte;
        window.clearTimeout(attente);
        window.clearTimeout(cache);
        attente = window.setTimeout(() => montrer(carte), DELAI);
      }
      if (!carte) {
        window.clearTimeout(attente);
        cache = window.setTimeout(masquer, 120);
      }
    };

    document.addEventListener("mouseover", survol);
    window.addEventListener("scroll", masquer, { passive: true });
    return () => {
      window.clearTimeout(attente);
      window.clearTimeout(cache);
      document.removeEventListener("mouseover", survol);
      window.removeEventListener("scroll", masquer);
    };
  }, []);

  if (!donnees) return null;
  const fiche = `/${donnees.type}/${donnees.slug}`;
  const image = donnees.backdrop ?? donnees.poster;

  return (
    <div
      ref={boite}
      // Caché : ni focus ni lecteur d'écran
      inert={!visible}
      onMouseLeave={() => setVisible(false)}
      className={`apercu ${visible ? "est-visible" : ""}`}
      style={{ left: position.x, top: position.y, ["--ox" as string]: `${position.ox}px` }}
    >
      <div className="relative aspect-video bg-surface">
        {image && <Image src={image} alt="" fill sizes="340px" className="object-cover" />}
        <span aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-[rgba(28,28,32,0.85)] to-transparent to-55%" />
        <span className="absolute right-3.5 bottom-3 left-3.5 z-[1] line-clamp-2 text-lg leading-tight font-extrabold">
          {donnees.titre}
        </span>
      </div>
      <div className="px-4 pt-3.5 pb-[18px]">
        <div className="flex items-center gap-2">
          <Link
            href={`${fiche}#ou-regarder`}
            aria-label={`Où regarder ${donnees.titre}`}
            className="grid size-10 place-items-center rounded-full border-[1.5px] border-white bg-white text-fond"
          >
            <Icone nom="externe" taille={18} />
          </Link>
          <BoutonMaListe contenu={donnees} variante="rond" className="!size-10 !min-w-10 !border-[1.5px] !border-white/45" />
          <Link
            href={fiche}
            aria-label={`Voir la fiche de ${donnees.titre}`}
            className="ml-auto grid size-10 place-items-center rounded-full border-[1.5px] border-white/45 transition-colors duration-200 hover:border-white"
          >
            <Icone nom="bas" taille={20} />
          </Link>
        </div>
        <p className="mt-3 flex flex-wrap items-center gap-x-2.5 gap-y-1.5 text-[13.5px] text-texte-doux">
          {donnees.note > 0 && (
            <span className="inline-flex items-center gap-1 font-bold text-white">
              <Icone nom="etoile" taille={13} className="fill-current text-ambre" />
              {donnees.note.toFixed(1).replace(".", ",")}
            </span>
          )}
          <span>{donnees.meta}</span>
          {donnees.pf && (
            <span className="inline-flex items-center gap-1.5 font-semibold">
              <span
                aria-hidden="true"
                className="size-2 rounded-full shadow-[0_0_0_1px_rgba(245,245,247,0.22)]"
                style={{ background: donnees.pf.couleur }}
              />
              {donnees.pf.nom}
            </span>
          )}
        </p>
        {donnees.genres.length > 0 && (
          <p className="mt-2 flex flex-wrap gap-2 text-[13.5px] text-white">
            {donnees.genres.map((g, i) => (
              <span key={g} className="inline-flex gap-2">
                {i > 0 && (
                  <span aria-hidden="true" className="text-texte-2">
                    •
                  </span>
                )}
                {g}
              </span>
            ))}
          </p>
        )}
      </div>
    </div>
  );
}
