import Link from "next/link";
import type { ReactNode } from "react";
import Icone from "@/components/Icone";

interface Props {
  /** Fil d'Ariane, sans la page courante */
  ariane: { href: string; label: string }[];
  titre: string;
  /** Période d'un article (« 23 au 25 octobre 2026 ») : fait partie du h1, en capitales de salle sous le titre */
  periode?: string;
  /** Ligne en capitales de salle hors du h1 (adresse fixe : « Édition du 9 au 11 octobre 2026 ») */
  edition?: string;
  /** Lignes de méta : date, signature, mention IA */
  meta?: ReactNode;
  chapo?: string;
}

/**
 * En-tête des pages de lecture (articles, guides, pages du site) : fond
 * sombre à halo bordeaux, h1 sur 20 caractères de large au plus, chapô.
 */
export default function TeteLecture({ ariane, titre, periode, edition, meta, chapo }: Props) {
  const salle = "font-salle mt-3 block text-[clamp(26px,3vw,40px)] leading-none font-extrabold tracking-[0.01em] text-lumiere";
  return (
    <header className="tete-texte -mt-entete px-gouttiere pt-[clamp(120px,16vh,170px)] pb-[clamp(30px,4vw,44px)]">
      <nav aria-label="Fil d'Ariane" className="mb-3.5 flex flex-wrap items-center gap-1.5 text-sm text-texte-2">
        {ariane.map((a, i) => (
          <span key={a.href} className="inline-flex items-center gap-1.5">
            {i > 0 && <Icone nom="droite" taille={14} className="opacity-60" />}
            <Link href={a.href} className="transition-colors duration-200 hover:text-texte">
              {a.label}
            </Link>
          </span>
        ))}
      </nav>
      <h1 className="max-w-[20ch] text-[clamp(36px,5vw,68px)] leading-none font-black tracking-[-0.03em]">
        {titre}
        {periode && (
          <>
            <span className="sr-only"> : </span>
            <span className={salle}>{periode}</span>
          </>
        )}
      </h1>
      {edition && <p className={salle}>{edition}</p>}
      {meta && <div className="mt-3.5 space-y-1 text-[14.5px] text-texte-2">{meta}</div>}
      {chapo && <p className="mt-4 max-w-[64ch] text-[clamp(17px,1.4vw,20px)] leading-[1.55] text-[#E6E6EA]">{chapo}</p>}
    </header>
  );
}
