import { slugify } from "./utils";
import { GUIDE_CHOISIR_PLATEFORME } from "./guides/choisir-plateforme";
import { GUIDE_CLASSEMENT_TOPS } from "./guides/classement-tops";
import { GUIDE_FILM_QUITTE_PLATEFORME } from "./guides/film-quitte-plateforme";
import { GUIDE_SERIES_HBO_FRANCE } from "./guides/series-hbo-france";
import { GUIDE_HARRY_POTTER_ORDRE } from "./guides/harry-potter-ordre";
import { GUIDE_MARVEL_ORDRE } from "./guides/marvel-ordre";
import { GUIDE_STAR_WARS_ORDRE } from "./guides/star-wars-ordre";
import { GUIDE_WALKING_DEAD_ORDRE } from "./guides/walking-dead-ordre";
import { GUIDE_SORTIES_AGENDA } from "./guides/sorties-dans-son-agenda";
import { GUIDE_LIRE_NOTE } from "./guides/lire-note-spectateurs";
import { GUIDE_ALTERNER_ABONNEMENTS } from "./guides/alterner-abonnements";
import { GUIDE_RETROUVER_TITRE } from "./guides/retrouver-titre-oublie";

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
  | BlocOrdre;

/**
 * Liste d'un guide « ordre de visionnage » (maquette du 2026-10-09) :
 * - `sortie` : une ligne par titre, avec vignette, regroupée par année
 *   au-delà de SEUIL_GROUPE_ANNEES titres ;
 * - `histoire` : des étapes ; un même titre peut revenir avec une autre
 *   `portion` (« Saisons 4 à 8 »).
 * `sommaire` est le libellé de la carte de sommaire en tête de page
 * (« Ordre de sortie » ou « Ordre de l'histoire » par défaut).
 */
export interface BlocOrdre {
  oeuvres: OeuvreGuide[];
  ordre: "sortie" | "histoire";
  sommaire?: string;
}

/**
 * Titre d'une liste ordonnée : la page tire de sa fiche l'année, l'affiche et
 * les plateformes du jour ; `titre` sert de repli si la fiche ne répond pas,
 * `repere` situe le titre dans l'ordre (texte, liens permis).
 */
export interface OeuvreGuide {
  type: "film" | "serie";
  id: number;
  titre: string;
  repere: string;
  /** Étape de l'ordre de l'histoire : la partie à regarder (« Saisons 1 à 3 ») */
  portion?: string;
  /** Titre dont on peut se passer : étiquette « Facultatif » */
  facultatif?: boolean;
  /** Sorti en salle, pas encore en streaming : remplace « aucune plateforme » tant qu'il n'en a pas */
  auCinema?: boolean;
}

/** Au-delà, une liste de sortie est regroupée par année, avec des raccourcis */
export const SEUIL_GROUPE_ANNEES = 12;

/** Le guide contient-il des listes d'ordre ? (mise en page dédiée) */
export function estGuideOrdre(g: Guide): boolean {
  return g.sections.some((s) => s.blocs.some((b) => "oeuvres" in b));
}

/** Ancre d'une section (sommaire, fil des ordres) */
export function ancreSection(s: SectionGuide): string {
  return slugify(s.titre);
}

/**
 * Identifiant stable d'une étape de l'ordre de l'histoire (suivi de
 * visionnage) : la progression enregistrée survit à un réordonnancement.
 */
export function idEtape(o: OeuvreGuide): string {
  return `${o.type}-${o.id}${o.portion ? `-${slugify(o.portion)}` : ""}`;
}

/** Clé de stockage de la progression d'une liste de l'histoire */
export function cleSuivi(slugGuide: string, s: SectionGuide): string {
  return `${slugGuide}-${ancreSection(s)}`;
}

/** Cartes du sommaire en tête d'un guide d'ordre : une par liste, vers sa section */
export function sommaireOrdres(
  g: Guide
): { ancre: string; libelle: string; valeur: string; ordre: BlocOrdre["ordre"]; cleSuivi: string; etapes: string[] }[] {
  return g.sections.flatMap((s) =>
    s.blocs.flatMap((b) => {
      if (!("oeuvres" in b)) return [];
      const n = b.oeuvres.length;
      const types = new Set(b.oeuvres.map((o) => o.type));
      const valeur =
        b.ordre === "histoire"
          ? `${n} étapes`
          : `${n} ${types.size > 1 ? "titres" : types.has("film") ? "films" : "séries"}`;
      const libelle = b.sommaire ?? (b.ordre === "sortie" ? "Ordre de sortie" : "Ordre de l'histoire");
      return [
        {
          ancre: ancreSection(s),
          libelle,
          valeur,
          ordre: b.ordre,
          cleSuivi: cleSuivi(g.slug, s),
          etapes: b.ordre === "histoire" ? b.oeuvres.map(idEtape) : [],
        },
      ];
    })
  );
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
  GUIDE_ALTERNER_ABONNEMENTS,
  GUIDE_LIRE_NOTE,
  GUIDE_SORTIES_AGENDA,
  GUIDE_RETROUVER_TITRE,
];

/** En dessous, la page /guides reste en noindex : une liste d'un ou deux liens est trop maigre */
export const MIN_GUIDES_INDEX = 3;

export function trouverGuide(slug: string): Guide | undefined {
  return GUIDES.find((g) => g.slug === slug);
}

/** Tous les textes d'un guide, pour le temps de lecture et les tests */
export function textesGuide(g: Guide): string[] {
  return [g.titre, g.chapo, ...textesSections(g.sections), ...g.faq.flatMap((f) => [f.q, f.r])];
}

/** Textes des sections (guides et articles Actu), liens [libellé](/chemin) compris */
export function textesSections(sections: SectionGuide[]): string[] {
  return sections.flatMap((s) => [
    s.titre,
    ...s.blocs.flatMap((b) =>
      "p" in b
        ? [b.p]
        : "ul" in b
          ? b.ul
          : "ol" in b
            ? b.ol
            : "oeuvres" in b
              ? b.oeuvres.flatMap((o) => [`[${o.titre}](${cheminOeuvreGuide(o)})`, o.portion ?? "", o.repere])
              : [...b.table.entetes, ...b.table.lignes.flat()]
    ),
  ]);
}

/** Adresse de la fiche, tirée du titre en français (même slug que lib/tmdb.ts) */
export function cheminOeuvreGuide(o: OeuvreGuide): string {
  return `/${o.type}/${slugify(o.titre)}-${o.id}`;
}

/** Date de guide avec heure et fuseau (JSON-LD, Open Graph, sitemap), comme horodatageArticle */
export function horodatageGuide(jour: string): string {
  return `${jour}T12:00:00Z`;
}

/** Œuvres des listes ordonnées d'un guide, sans doublon */
export function oeuvresDesSections(sections: SectionGuide[]): OeuvreGuide[] {
  const vues = new Map<string, OeuvreGuide>();
  for (const s of sections)
    for (const b of s.blocs) if ("oeuvres" in b) for (const o of b.oeuvres) vues.set(`${o.type}-${o.id}`, o);
  return [...vues.values()];
}

/**
 * Ancre de chaque titre dans la première liste de sortie où il figure, avec
 * son numéro (« 02 ») : les étapes de l'ordre de l'histoire y renvoient.
 * Clé : `${type}-${id}`.
 */
export type AncresOrdre = Map<string, { ancre: string; numero: string; bloc: BlocOrdre }>;

export function ancresOrdre(sections: SectionGuide[]): AncresOrdre {
  const ancres: AncresOrdre = new Map();
  for (const s of sections)
    for (const b of s.blocs)
      if ("oeuvres" in b && b.ordre === "sortie")
        b.oeuvres.forEach((o, i) => {
          const cle = `${o.type}-${o.id}`;
          if (!ancres.has(cle)) ancres.set(cle, { ancre: `t-${cle}`, numero: String(i + 1).padStart(2, "0"), bloc: b });
        });
  return ancres;
}

export function minutesDeLecture(g: Guide): number {
  const mots = textesGuide(g).join(" ").split(/\s+/).length;
  return Math.max(1, Math.round(mots / 220));
}

/** Liens internes [libellé](/chemin) présents dans un texte */
export function liensInternes(texte: string): string[] {
  return [...texte.matchAll(/\[[^\]]+\]\((\/[^)\s]*)\)/g)].map((m) => m[1]);
}
