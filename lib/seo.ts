import type { Contenu, Serie, Film } from "@/types";

const SITE_URL = process.env.SITE_URL ?? "https://streamactu.fr";

/**
 * Tronque un texte pour les meta descriptions sans couper en plein mot.
 */
export function extraitMeta(
  texte: string | null | undefined,
  max = 160
): string | undefined {
  if (!texte) return undefined;
  if (texte.length <= max) return texte;
  const coupe = texte.slice(0, max - 1);
  const dernierEspace = coupe.lastIndexOf(" ");
  return (dernierEspace > 60 ? coupe.slice(0, dernierEspace) : coupe).trimEnd() + "…";
}

/**
 * JSON-LD Movie / TVSeries pour les fiches — éligibilité aux résultats
 * enrichis Google (note, genres, casting).
 */
export function jsonLdFiche(contenu: Serie | Film): string {
  const isSerie = contenu.type === "serie";

  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": isSerie ? "TVSeries" : "Movie",
    name: contenu.titre,
    url: `${SITE_URL}/${contenu.type}/${contenu.slug}`,
  };

  if (contenu.synopsis) data.description = contenu.synopsis;
  if (contenu.poster) data.image = contenu.poster;
  if (contenu.annee) data.datePublished = String(contenu.annee);
  if (contenu.genres.length > 0) data.genre = contenu.genres.map((g) => g.nom);
  if (contenu.casting.length > 0) {
    data.actor = contenu.casting
      .slice(0, 6)
      .map((p) => ({ "@type": "Person", name: p.nom }));
  }
  if (contenu.note > 0 && contenu.nbVotes > 0) {
    data.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: contenu.note,
      bestRating: 10,
      worstRating: 0,
      ratingCount: contenu.nbVotes,
    };
  }
  if (isSerie) {
    const serie = contenu as Serie;
    if (serie.nbSaisons) data.numberOfSeasons = serie.nbSaisons;
    if (serie.nbEpisodes) data.numberOfEpisodes = serie.nbEpisodes;
  }
  if (contenu.dispo && contenu.dispo.length > 0) {
    data.potentialAction = {
      "@type": "WatchAction",
      target: `https://www.themoviedb.org/${isSerie ? "tv" : "movie"}/${contenu.id}/watch?locale=FR`,
    };
  }

  // < : empêche un éventuel "</script>" dans un synopsis TMDB de casser la page
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

/** JSON-LD ItemList pour les pages de classement (tops) */
export function jsonLdClassement(nom: string, url: string, contenus: Contenu[]): string {
  const data = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: nom,
    url: `${SITE_URL}${url}`,
    numberOfItems: contenus.length,
    itemListElement: contenus.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.titre,
      url: `${SITE_URL}/${c.type}/${c.slug}`,
    })),
  };
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
