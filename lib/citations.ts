/**
 * « Sur StreamActu » : articles Actu et guides qui parlent d'un titre, affichés
 * sur sa fiche. C'est du contenu propre au site (choix éditoriaux relus), là
 * où le reste de la fiche reprend TMDB comme des dizaines d'autres sites.
 *
 * Index calculé une fois, à partir des données du dépôt : sections d'articles
 * (`oeuvre`), listes ordonnées des guides, et liens [libellé](/film/…-id) des
 * textes. Les brouillons n'existent pas (ARTICLES ne contient que les publiés).
 */

import { ARTICLES, cheminArticle, type Article } from "./actu";
import { GUIDES, liensInternes, oeuvresDesSections, textesGuide, textesSections, type Guide } from "./guides";

export interface Citation {
  titre: string;
  chemin: string;
  /** « choix » : le titre a sa section (article) ou sa place dans un ordre (guide) ; « mention » : un lien dans le texte */
  role: "choix" | "mention";
}

export interface CitationsOeuvre {
  /** Du plus récent au plus ancien */
  articles: Citation[];
  guides: Citation[];
}

/** « /serie/tulsa-king-153312 » → « serie-153312 » ; null pour une autre adresse */
export function cleDepuisChemin(chemin: string): string | null {
  const m = chemin.match(/^\/(film|serie)\/[^/?#]*-(\d+)$/);
  return m ? `${m[1]}-${m[2]}` : null;
}

function clesTextes(textes: string[]): Set<string> {
  const cles = new Set<string>();
  for (const t of textes)
    for (const lien of liensInternes(t)) {
      const cle = cleDepuisChemin(lien);
      if (cle) cles.add(cle);
    }
  return cles;
}

type Index = Map<string, CitationsOeuvre>;

function ajouter(index: Index, cle: string, genre: "articles" | "guides", citation: Citation) {
  const entree = index.get(cle) ?? { articles: [], guides: [] };
  entree[genre].push(citation);
  index.set(cle, entree);
}

/** Index complet, exporté pour les tests (articles et guides injectables) */
export function construireIndex(articles: Article[], guides: Guide[], chemin: (a: Article) => string = cheminArticle): Index {
  const index: Index = new Map();
  for (const a of articles) {
    const choix = new Set(a.sections.flatMap((s) => (s.oeuvre ? [`${s.oeuvre.type}-${s.oeuvre.id}`] : [])));
    const mentions = clesTextes([a.chapo, ...textesSections(a.sections)]);
    for (const cle of new Set([...choix, ...mentions]))
      ajouter(index, cle, "articles", { titre: a.titre, chemin: chemin(a), role: choix.has(cle) ? "choix" : "mention" });
  }
  for (const g of guides) {
    const choix = new Set(oeuvresDesSections(g.sections).map((o) => `${o.type}-${o.id}`));
    const mentions = clesTextes(textesGuide(g));
    for (const cle of new Set([...choix, ...mentions]))
      ajouter(index, cle, "guides", { titre: g.titre, chemin: `/guides/${g.slug}`, role: choix.has(cle) ? "choix" : "mention" });
  }
  return index;
}

let INDEX: Index | null = null;

/** Articles publiés et guides qui citent ce titre, ou null s'il n'est cité nulle part */
export function citationsOeuvre(type: "film" | "serie", id: number): CitationsOeuvre | null {
  INDEX ??= construireIndex(ARTICLES, GUIDES);
  return INDEX.get(`${type}-${id}`) ?? null;
}
