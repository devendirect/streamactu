import type { SectionGuide } from "./guides";
import { slugify } from "./utils";
import { ARTICLE_2026_09_25_WEEKEND } from "./actu/2026-09-25-que-regarder-ce-week-end";
import { ARTICLE_2026_10_02_WEEKEND } from "./actu/2026-10-02-que-regarder-ce-week-end";
import { ARTICLE_2026_10_09_WEEKEND } from "./actu/2026-10-09-que-regarder-ce-week-end";
import { ARTICLE_2026_10_16_WEEKEND } from "./actu/2026-10-16-que-regarder-ce-week-end";
import { ARTICLE_2026_10_27_NOVEMBRE } from "./actu/2026-10-27-nouveautes-streaming-novembre-2026";

/**
 * Rubrique Actu (/actu/[slug]) : un article « Que regarder ce week-end »
 * publié le vendredi matin, rédigé avec Claude à partir des données du site et
 * relu par l'éditeur avant publication (décision du 2026-09-26, voir
 * docs/nommage-rubriques.md et docs/ligne-editoriale.md).
 *
 * Un article `brouillon: true` n'existe nulle part (404, ni menu, ni sitemap,
 * ni flux). Tant qu'aucun article n'est publié, la rubrique entière est
 * absente et le menu garde « Actu » pour l'accueil : on peut déployer le code
 * avant le premier article. Les articles publiés restent en ligne.
 *
 * Même format de texte que les guides : [libellé](/chemin) pour les liens
 * internes, rien d'autre.
 */
/**
 * Section d'article : comme une section de guide, avec en option le titre dont
 * elle parle. Le site en tire l'affiche, la note et les plateformes (cache des
 * fiches) : aucune adresse d'image n'est écrite dans l'article. La première
 * section avec une œuvre fournit la grande image de l'article (partage, Discover).
 */
export type SectionArticle = SectionGuide & {
  oeuvre?: { type: "film" | "serie"; id: number };
  /**
   * Rubrique de la section (article du mois : la plateforme, « Netflix »). Les
   * sections consécutives d'une même rubrique sont regroupées sous un titre
   * ancré, repris par le sommaire en tête d'article.
   */
  rubrique?: string;
};

/** Rubriques d'un article, dans l'ordre, avec leur ancre (sommaire) */
export function rubriquesArticle(article: Article): { titre: string; ancre: string }[] {
  const vues = new Set<string>();
  const rubriques: { titre: string; ancre: string }[] = [];
  for (const s of article.sections) {
    if (!s.rubrique || vues.has(s.rubrique)) continue;
    vues.add(s.rubrique);
    rubriques.push({ titre: s.rubrique, ancre: slugify(s.rubrique) });
  }
  return rubriques;
}

/**
 * Formats d'article, chacun avec son adresse fixe (voir ADRESSES_FIXES) :
 * - « week-end » : « Que regarder ce week-end », chaque vendredi ;
 * - « mois » : « Nouveautés streaming de [mois] », fin du mois précédent
 *   (décision du 2026-10-10, voir docs/idees-formats.md).
 */
export type FormatArticle = "week-end" | "mois";

export interface Article {
  slug: string;
  format: FormatArticle;
  titre: string;
  /** meta description, 120–155 caractères */
  description: string;
  /** chapeau : la réponse courte, citable telle quelle */
  chapo: string;
  publie: string; // AAAA-MM-JJ
  misAJour: string; // AAAA-MM-JJ
  sections: SectionArticle[];
  /** true : absent du site (relecture en cours) */
  brouillon?: boolean;
}

/** Tous les articles, brouillons compris (tests) */
export const TOUS_LES_ARTICLES: Article[] = [
  ARTICLE_2026_10_27_NOVEMBRE,
  ARTICLE_2026_10_16_WEEKEND,
  ARTICLE_2026_10_09_WEEKEND,
  ARTICLE_2026_10_02_WEEKEND,
  ARTICLE_2026_09_25_WEEKEND,
];

/** Articles publiés, du plus récent au plus ancien */
export const ARTICLES: Article[] = TOUS_LES_ARTICLES.filter((a) => !a.brouillon).sort((a, b) =>
  b.publie.localeCompare(a.publie)
);

/** La rubrique n'apparaît (menu, sitemap, flux, llms) qu'avec au moins un article publié */
export const ACTU_PUBLIEE = ARTICLES.length > 0;

/** En dessous, la liste /actu reste en noindex (même garde-fou que /guides) */
export const MIN_ARTICLES_INDEX = 3;

/** Articles par page de liste : /actu, puis /actu/page/2, /actu/page/3… */
export const ARTICLES_PAR_PAGE = 12;

export const NB_PAGES_ACTU = Math.max(1, Math.ceil(ARTICLES.length / ARTICLES_PAR_PAGE));

/** Articles de la page n (1 = /actu) ; [] si la page n'existe pas */
export function articlesDeLaPage(n: number): Article[] {
  if (!Number.isInteger(n) || n < 1 || n > NB_PAGES_ACTU) return [];
  return ARTICLES.slice((n - 1) * ARTICLES_PAR_PAGE, n * ARTICLES_PAR_PAGE);
}

/** Adresse de la page n de la liste */
export function cheminPageActu(n: number): string {
  return n <= 1 ? "/actu" : `/actu/page/${n}`;
}

export function trouverArticle(slug: string): Article | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}

/**
 * Adresses fixes (décision du 2026-10-09, étendue au mois le 2026-10-10) : un
 * article daté n'a pas le temps d'être indexé avant la fin de sa période, une
 * adresse stable accumule son classement d'une édition à l'autre. Chaque
 * format y sert son dernier article publié ; l'adresse datée de celui-ci y
 * renvoie par canonical, puis redevient une archive autonome quand l'article
 * suivant du même format paraît.
 */
export const ADRESSES_FIXES: Record<FormatArticle, { slug: string; libelle: string }> = {
  "week-end": { slug: "que-regarder-ce-week-end", libelle: "Ce week-end" },
  mois: { slug: "nouveautes-streaming-du-mois", libelle: "Ce mois-ci" },
};

export const FORMATS = Object.keys(ADRESSES_FIXES) as FormatArticle[];

export function cheminFixe(format: FormatArticle): string {
  return `/actu/${ADRESSES_FIXES[format].slug}`;
}

/** Dernier article publié d'un format, servi à son adresse fixe */
export function editionCourante(format: FormatArticle): Article | undefined {
  return ARTICLES.find((a) => a.format === format);
}

/** Éditions courantes publiées, une par format au plus */
export const EDITIONS_COURANTES: Article[] = FORMATS.flatMap((f) => editionCourante(f) ?? []);

/** Adresse de référence d'un article : l'adresse fixe pour l'édition courante de son format, sa date sinon */
export function cheminArticle(article: Article): string {
  return editionCourante(article.format)?.slug === article.slug ? cheminFixe(article.format) : `/actu/${article.slug}`;
}

/**
 * Date d'article avec heure et fuseau (« 2026-10-09T07:00:00Z ») : Google
 * recommande le fuseau dans le JSON-LD. 7 h UTC, le matin de la publication à
 * Paris ; même heure pour le sitemap, le flux RSS et Open Graph.
 */
export function horodatageArticle(jour: string): string {
  return `${jour}T07:00:00Z`;
}

/** Période couverte, tirée du titre (« … : 9 au 11 octobre 2026 », « … : novembre 2026 ») */
export function periodeArticle(article: Article): string {
  const i = article.titre.indexOf(" : ");
  return i >= 0 ? article.titre.slice(i + 3) : article.titre;
}

/** Entrées de menu : « Sorties » + « Actu » une fois la rubrique publiée, « Actu » pour l'accueil sinon */
export const NAV_ACCUEIL = ACTU_PUBLIEE
  ? [
      { href: "/", label: "Sorties" },
      { href: "/actu", label: "Actu" },
    ]
  : [{ href: "/", label: "Actu" }];
