import Image from "next/image";
import Link from "next/link";
import { cache } from "react";
import type { Contenu } from "@/types";
import ImageDifferee from "@/components/ImageDifferee";
import { altAffiche, isNouvelleSerieCheck } from "@/lib/utils";

/** Ligne de méta par défaut d'une carte : « Nouvelle série », « Saison 3 », « Film · 2026 » */
export function metaContenu(c: Contenu): string {
  if (c.type === "film") return c.annee ? `Film · ${c.annee}` : "Film";
  if (isNouvelleSerieCheck(c.saisonActuelle, c.premiereDiffusion)) return "Nouvelle série";
  return c.saisonActuelle ? `Saison ${c.saisonActuelle}` : "Série";
}

/** Cartes de rangée dont l'image est chargée d'emblée ; au-delà, au défilement (ImageDifferee) */
export const CARTES_IMMEDIATES = 6;

/**
 * Titres dont l'aperçu est déjà dans la page (une requête serveur) : un titre
 * présent dans trois rangées ne porte son JSON qu'une fois, les autres cartes
 * le retrouvent par data-cle. Côté client, cache() ne mémorise rien : chaque
 * carte porte alors le sien.
 */
const apercusEmis = cache(() => new Set<string>());

/**
 * Données lues par l'aperçu au survol (components/ApercuSurvol.tsx) et par
 * les puces de filtre : type et plateformes de la carte.
 */
export function attributsCarte(c: Contenu, plateformes: number[] = c.plateforme ? [c.plateforme.id] : []) {
  const cle = `${c.type}-${c.id}`;
  const emis = apercusEmis();
  const premier = !emis.has(cle);
  emis.add(cle);
  return {
    "data-carte": "",
    "data-cle": cle,
    "data-type": c.type,
    "data-pfs": plateformes.join(" "),
    ...(premier ? { "data-apercu": apercu(c) } : {}),
  };
}

function apercu(c: Contenu): string {
  return JSON.stringify({
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
  });
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
  /** Carte cachée à droite de sa rangée : image chargée au défilement */
  differee?: boolean;
}

/**
 * Carte affiche (2:3) : coins 8 px, fond `surface` pendant le chargement,
 * titre sur une ligne, méta en gris avec la pastille de la plateforme.
 */
export default function CarteAffiche({ contenu, priorite = false, badge, meta, plateformes, differee = false }: Props) {
  const { type, titre, slug, poster, plateforme } = contenu;
  const Img = differee ? ImageDifferee : Image;
  // prefetch={false} : une page d'affiches déclenchait plus de 30 préchargements de
  // fiches au chargement de l'accueil, logos compris (Lighthouse du 29/10)
  return (
    <article className="relative min-w-0" {...attributsCarte(contenu, plateformes)}>
      <Link href={`/${type}/${slug}`} prefetch={false} className="group block">
        <span className="relative block aspect-[2/3] overflow-hidden rounded-lg bg-surface">
          {poster && (
            <Img
              src={poster}
              alt={altAffiche(titre, type)}
              fill
              // Largeur de .rangee__piste : clamp(132px, 13vw, 190px)
              sizes="(max-width: 1015px) 132px, (max-width: 1462px) 13vw, 190px"
              preload={priorite}
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
