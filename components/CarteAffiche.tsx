import Image from "next/image";
import Link from "next/link";
import type { Contenu } from "@/types";
import { altAffiche, isNouvelleSerieCheck } from "@/lib/utils";

/** Ligne de méta par défaut d'une carte : « Nouvelle série », « Saison 3 », « Film · 2026 » */
export function metaContenu(c: Contenu): string {
  if (c.type === "film") return c.annee ? `Film · ${c.annee}` : "Film";
  if (isNouvelleSerieCheck(c.saisonActuelle, c.premiereDiffusion)) return "Nouvelle série";
  return c.saisonActuelle ? `Saison ${c.saisonActuelle}` : "Série";
}

/**
 * Données lues par l'aperçu au survol (components/ApercuSurvol.tsx) et par
 * les puces de filtre : type et plateformes de la carte.
 */
export function attributsCarte(c: Contenu, plateformes: number[] = c.plateforme ? [c.plateforme.id] : []) {
  return {
    "data-carte": "",
    "data-type": c.type,
    "data-pfs": plateformes.join(" "),
    "data-apercu": JSON.stringify({
      id: c.id,
      type: c.type,
      titre: c.titre,
      slug: c.slug,
      poster: c.poster,
      backdrop: c.backdrop,
      note: c.note,
      annee: c.annee,
      meta: metaContenu(c),
      genres: c.genres.slice(0, 3).map((g) => g.nom),
      pf: c.plateforme ? { nom: c.plateforme.nom, couleur: c.plateforme.couleur } : null,
    }),
  };
}

interface Props {
  contenu: Contenu;
  priorite?: boolean;
  /** Badge ambre en haut à gauche (« Nouveau ») */
  badge?: string;
  /** Remplace la ligne de méta par défaut */
  meta?: string;
  /** Plateformes de la carte (ids TMDB), pour les filtres ; par défaut celle du contenu */
  plateformes?: number[];
}

/**
 * Carte affiche (2:3) : coins 8 px, fond `surface` pendant le chargement,
 * titre sur une ligne, méta en gris avec la pastille de la plateforme.
 */
export default function CarteAffiche({ contenu, priorite = false, badge, meta, plateformes }: Props) {
  const { type, titre, slug, poster, plateforme } = contenu;
  return (
    <article className="relative min-w-0" {...attributsCarte(contenu, plateformes)}>
      <Link href={`/${type}/${slug}`} className="group block">
        <span className="relative block aspect-[2/3] overflow-hidden rounded-lg bg-surface">
          {poster && (
            <Image
              src={poster}
              alt={altAffiche(titre, type)}
              fill
              sizes="(max-width: 760px) 40vw, 190px"
              priority={priorite}
              className="object-cover transition-transform duration-300 ease-salle group-hover:scale-[1.03]"
            />
          )}
          {badge && (
            <span className="absolute top-2 left-2 z-[1] rounded-[4px] bg-ambre px-2 py-[3px] text-xs font-bold text-sur-ambre">
              {badge}
            </span>
          )}
        </span>
        <span className="block pt-2">
          <span className="block truncate text-sm leading-[1.3] font-semibold transition-colors duration-200 group-hover:text-white">
            {titre}
          </span>
          <span className="mt-0.5 flex items-center gap-1.5 overflow-hidden text-[13px] whitespace-nowrap text-texte-2">
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
        </span>
      </Link>
    </article>
  );
}
