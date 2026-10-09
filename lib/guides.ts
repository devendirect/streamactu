import { slugify } from "./utils";
import { GUIDE_CHOISIR_PLATEFORME } from "./guides/choisir-plateforme";
import { GUIDE_CLASSEMENT_TOPS } from "./guides/classement-tops";
import { GUIDE_FILM_QUITTE_PLATEFORME } from "./guides/film-quitte-plateforme";
import { GUIDE_SERIES_HBO_FRANCE } from "./guides/series-hbo-france";
import { GUIDE_HARRY_POTTER_ORDRE } from "./guides/harry-potter-ordre";
import { GUIDE_MARVEL_ORDRE } from "./guides/marvel-ordre";
import { GUIDE_STAR_WARS_ORDRE } from "./guides/star-wars-ordre";
import { GUIDE_WALKING_DEAD_ORDRE } from "./guides/walking-dead-ordre";

/**
 * Guides éditoriaux (/guides/[slug]) : contenus durables, signés « l'éditeur
 * de StreamActu.fr », rédigés avec l'aide de Claude et relus (voir
 * /a-propos#ia). Chaque guide s'appuie sur une donnée du site ; les faits
 * extérieurs sont sourcés et datés.
 *
 * Le texte des blocs accepte un seul marquage en ligne : [libellé](/chemin),
 * un lien interne. Tout le reste est du texte brut.
 *
 * Contraintes vérifiées par lib/guides.test.ts : slugs uniques, titre affiché
 * ≤ 60 caractères, description 120–155, liens internes vers des routes connues.
 */
export type BlocGuide =
  | { p: string }
  | { ul: string[] }
  | { ol: string[] }
  | { table: { entetes: string[]; lignes: string[][] } }
  | { oeuvres: OeuvreGuide[] };

/**
 * Titre d'une liste ordonnée (ordre de visionnage) : la page tire de sa fiche
 * l'année et les plateformes du jour ; `titre` sert de repli si la fiche ne
 * répond pas, `repere` situe le titre dans l'ordre (texte, liens permis).
 */
export interface OeuvreGuide {
  type: "film" | "serie";
  id: number;
  titre: string;
  repere: string;
}

export interface SectionGuide {
  titre: string;
  blocs: BlocGuide[];
}

export interface Guide {
  slug: string;
  titre: string;
  /** meta description, 120–155 caractères */
  description: string;
  /** chapeau : la réponse courte, citable telle quelle */
  chapo: string;
  publie: string; // AAAA-MM-JJ
  misAJour: string; // AAAA-MM-JJ
  sections: SectionGuide[];
  faq: { q: string; r: string }[];
  /** Sources extérieures citées (titre + URL), affichées en fin de guide */
  sources?: { titre: string; url: string }[];
}

export const GUIDES: Guide[] = [
  GUIDE_CHOISIR_PLATEFORME,
  GUIDE_SERIES_HBO_FRANCE,
  GUIDE_FILM_QUITTE_PLATEFORME,
  GUIDE_CLASSEMENT_TOPS,
  GUIDE_STAR_WARS_ORDRE,
  GUIDE_MARVEL_ORDRE,
  GUIDE_WALKING_DEAD_ORDRE,
  GUIDE_HARRY_POTTER_ORDRE,
];

/** En dessous, la page /guides reste en noindex : une liste d'un ou deux liens est trop maigre */
export const MIN_GUIDES_INDEX = 3;

export function trouverGuide(slug: string): Guide | undefined {
  return GUIDES.find((g) => g.slug === slug);
}

/** Tous les textes d'un guide, pour le temps de lecture et les tests */
export function textesGuide(g: Guide): string[] {
  const blocs = g.sections.flatMap((s) => [
    s.titre,
    ...s.blocs.flatMap((b) =>
      "p" in b
        ? [b.p]
        : "ul" in b
          ? b.ul
          : "ol" in b
            ? b.ol
            : "oeuvres" in b
              ? b.oeuvres.flatMap((o) => [`[${o.titre}](${cheminOeuvreGuide(o)})`, o.repere])
              : [...b.table.entetes, ...b.table.lignes.flat()]
    ),
  ]);
  return [g.titre, g.chapo, ...blocs, ...g.faq.flatMap((f) => [f.q, f.r])];
}

/** Adresse de la fiche, tirée du titre en français (même slug que lib/tmdb.ts) */
export function cheminOeuvreGuide(o: OeuvreGuide): string {
  return `/${o.type}/${slugify(o.titre)}-${o.id}`;
}

/** Œuvres des listes ordonnées d'un guide, sans doublon */
export function oeuvresDesSections(sections: SectionGuide[]): OeuvreGuide[] {
  const vues = new Map<string, OeuvreGuide>();
  for (const s of sections)
    for (const b of s.blocs) if ("oeuvres" in b) for (const o of b.oeuvres) vues.set(`${o.type}-${o.id}`, o);
  return [...vues.values()];
}

export function minutesDeLecture(g: Guide): number {
  const mots = textesGuide(g).join(" ").split(/\s+/).length;
  return Math.max(1, Math.round(mots / 220));
}

/** Liens internes [libellé](/chemin) présents dans un texte */
export function liensInternes(texte: string): string[] {
  return [...texte.matchAll(/\[[^\]]+\]\((\/[^)\s]*)\)/g)].map((m) => m[1]);
}
