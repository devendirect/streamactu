import Image from "next/image";
import Link from "next/link";
import type { Contenu } from "@/types";
import { altAffiche } from "@/lib/utils";
import { metaContenu } from "@/components/CarteAffiche";
import Icone from "@/components/Icone";

interface Props {
  contenu: Contenu;
  priorite?: boolean;
}

/** Carte en ligne (lignes de classement) : petite affiche, titre, méta et genres, note */
export default function CarteContenu({ contenu, priorite = false }: Props) {
  const { type, titre, slug, poster, note, genres, plateforme } = contenu;
  const genresLabel = genres
    .slice(0, 3)
    .map((g) => g.nom)
    .join(" · ");

  return (
    <Link
      href={`/${type}/${slug}`}
      className="group flex items-center gap-4 border-t border-trait py-3.5 transition-colors duration-200 hover:bg-white/[0.025]"
    >
      <span className="relative h-[80px] w-[54px] shrink-0 overflow-hidden rounded-md bg-surface">
        {poster && <Image src={poster} alt={altAffiche(titre, type)} fill sizes="54px" className="object-cover" priority={priorite} />}
      </span>

      <span className="min-w-0 flex-1">
        <span className="block truncate text-[17px] leading-tight font-semibold tracking-[-0.01em] transition-colors duration-200 group-hover:text-white">
          {titre}
        </span>
        <span className="mt-1 flex items-center gap-1.5 text-[13px] text-texte-2">
          {plateforme && (
            <span
              aria-hidden="true"
              className="size-2 flex-none rounded-full shadow-[0_0_0_1px_rgba(245,245,247,0.22)]"
              style={{ background: plateforme.couleur }}
            />
          )}
          <span className="truncate">
            {plateforme ? `${plateforme.nom} · ` : ""}
            {metaContenu(contenu)}
            {genresLabel ? ` · ${genresLabel}` : ""}
          </span>
        </span>
      </span>

      {note > 0 && (
        <span className="tabular inline-flex shrink-0 items-center gap-1 text-sm font-bold whitespace-nowrap">
          <Icone nom="etoile" taille={14} className="fill-current text-ambre" />
          {note.toFixed(1).replace(".", ",")}
          <span className="sr-only">sur 10</span>
        </span>
      )}
    </Link>
  );
}
