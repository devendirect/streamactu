import type { Film, Plateforme, Serie } from "@/types";
import type { Article } from "@/lib/actu";
import { getDetailFilm, getDetailSerie } from "@/lib/tmdb";
import { plateformesDepuisFournisseurs } from "@/lib/plateformes";

/**
 * Données d'illustration des articles, tirées du cache des fiches (1 h) :
 * affiche, grande image, note, plateformes. Côté serveur seulement.
 */
export interface OeuvreArticle {
  type: "film" | "serie";
  id: number;
  titre: string;
  slug: string;
  poster: string | null;
  /** Image de fond en 1280 px : Google Discover demande au moins 1 200 px de large */
  grandeImage: string | null;
  note: number;
  nbVotes: number;
  annee: number;
  plateformes: Plateforme[];
}

export function cleOeuvre(o: { type: "film" | "serie"; id: number }): string {
  return `${o.type}-${o.id}`;
}

/** Les fiches servent l'image de fond en 780 px ; TMDB fournit la même en 1280 px */
function versionLarge(url: string | null): string | null {
  return url ? url.replace("/w780/", "/w1280/") : null;
}

async function chargerOeuvre(o: { type: "film" | "serie"; id: number }): Promise<OeuvreArticle | null> {
  try {
    const c: Film | Serie = o.type === "film" ? await getDetailFilm(o.id) : await getDetailSerie(o.id);
    return {
      type: o.type,
      id: o.id,
      titre: c.titre,
      slug: c.slug,
      poster: c.poster,
      grandeImage: versionLarge(c.backdrop),
      note: c.note,
      nbVotes: c.nbVotes,
      annee: c.annee,
      plateformes: plateformesDepuisFournisseurs(c.dispo ?? []),
    };
  } catch (err) {
    console.error(`[actu] ${o.type} ${o.id} indisponible :`, err instanceof Error ? err.message : err);
    return null;
  }
}

/** Toutes les œuvres citées par un article, indexées par cleOeuvre */
export async function oeuvresArticle(article: Article): Promise<Map<string, OeuvreArticle>> {
  const refs = article.sections.flatMap((s) => (s.oeuvre ? [s.oeuvre] : []));
  const charges = await Promise.all(refs.map(chargerOeuvre));
  return new Map(charges.filter((o): o is OeuvreArticle => o !== null).map((o) => [cleOeuvre(o), o]));
}

/** Grande image de l'article : celle de la première œuvre qui en a une */
export function imagePrincipale(article: Article, oeuvres: Map<string, OeuvreArticle>): OeuvreArticle | null {
  for (const s of article.sections) {
    const o = s.oeuvre ? oeuvres.get(cleOeuvre(s.oeuvre)) : undefined;
    if (o?.grandeImage) return o;
  }
  return null;
}

/** Grande image seule (liste /actu) : s'arrête à la première œuvre qui en a une */
export async function imageArticle(article: Article): Promise<OeuvreArticle | null> {
  for (const s of article.sections) {
    if (!s.oeuvre) continue;
    const o = await chargerOeuvre(s.oeuvre);
    if (o?.grandeImage) return o;
  }
  return null;
}
