import type { SectionGuide } from "./guides";
import { ARTICLE_2026_09_25_WEEKEND } from "./actu/2026-09-25-que-regarder-ce-week-end";
import { ARTICLE_2026_10_02_WEEKEND } from "./actu/2026-10-02-que-regarder-ce-week-end";

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
};

export interface Article {
  slug: string;
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
export const TOUS_LES_ARTICLES: Article[] = [ARTICLE_2026_10_02_WEEKEND, ARTICLE_2026_09_25_WEEKEND];

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

/** Entrées de menu : « Sorties » + « Actu » une fois la rubrique publiée, « Actu » pour l'accueil sinon */
export const NAV_ACCUEIL = ACTU_PUBLIEE
  ? [
      { href: "/", label: "Sorties" },
      { href: "/actu", label: "Actu" },
    ]
  : [{ href: "/", label: "Actu" }];
