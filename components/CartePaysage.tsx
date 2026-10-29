import Image from "next/image";
import Link from "next/link";
import type { Contenu } from "@/types";
import { attributsCarte, metaContenu } from "@/components/CarteAffiche";
import ImageDifferee from "@/components/ImageDifferee";

interface Props {
  contenu: Contenu;
  /** Logo du titre (TMDB images/logos), posé en bas à gauche de l'image */
  logo?: string | null;
  meta?: string;
  plateformes?: number[];
  /** Carte cachée à droite de sa rangée : image chargée au défilement */
  differee?: boolean;
}

/**
 * Carte paysage (16:9) : image de fond fondue au noir par le bas, logo du
 * titre dessus quand il existe, sinon le titre écrit.
 */
export default function CartePaysage({ contenu, logo, meta, plateformes, differee = false }: Props) {
  const { type, titre, slug, backdrop, poster, plateforme } = contenu;
  const image = backdrop ?? poster;
  const Img = differee ? ImageDifferee : Image;
  // Pas de préchargement des fiches, comme CarteAffiche
  return (
    <article className="relative min-w-0" {...attributsCarte(contenu, plateformes)}>
      <Link href={`/${type}/${slug}`} prefetch={false} className="group block">
        <span className="relative block aspect-video overflow-hidden rounded-lg bg-surface">
          {image && (
            <Img
              src={image}
              alt=""
              fill
              // Largeur de .rangee__piste--paysage : clamp(240px, 24vw, 340px)
              sizes="(max-width: 1000px) 240px, (max-width: 1417px) 24vw, 340px"
              className="object-cover transition-transform duration-300 ease-salle group-hover:scale-[1.03]"
            />
          )}
          <span aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent to-55%" />
          {logo ? (
            // Logo PNG détouré : pas d'optimisation (transparence et tailles variées)
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={logo}
              alt={titre}
              loading="lazy"
              className="absolute bottom-3 left-3 z-[1] max-h-[38%] max-w-[58%] object-contain object-[left_bottom] drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]"
            />
          ) : (
            <span className="absolute right-3 bottom-3 left-3 z-[1] line-clamp-2 text-lg leading-tight font-extrabold">
              {titre}
            </span>
          )}
        </span>
        <span className="mt-2 flex items-center gap-1.5 overflow-hidden text-[13px] whitespace-nowrap text-texte-2">
          {plateforme && (
            <span
              aria-label={plateforme.nom}
              role="img"
              className="size-2 flex-none rounded-full shadow-[0_0_0_1px_rgba(245,245,247,0.22)]"
              style={{ background: plateforme.couleur }}
            />
          )}
          <span className="truncate">{meta ?? metaContenu(contenu)}</span>
        </span>
      </Link>
    </article>
  );
}
