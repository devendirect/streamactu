import type { Contenu, Serie, Film } from "@/types";
import { composerDescription } from "./meta";

const SITE_URL = process.env.SITE_URL ?? "https://streamactu.fr";

/**
 * Plateformes distinctes pour la description : « Netflix Standard with Ads »
 * n'apporte rien à côté de « Netflix ».
 */
function plateformesDistinctes(noms: string[]): string[] {
  const gardes: string[] = [];
  for (const nom of noms) {
    if (!gardes.some((g) => nom.startsWith(g))) gardes.push(nom);
  }
  return gardes;
}

/**
 * Meta description d'une fiche : disponibilité + extrait du synopsis, puis
 * type, année, genres et saisons quand le synopsis est court ou absent
 * (fréquent pour les stand-up et documentaires). Ces détails rendent aussi
 * uniques deux fiches sans résumé partageant la même dispo.
 */
export function descriptionFiche(contenu: Serie | Film): string {
  const dispo = plateformesDistinctes(contenu.dispo ?? []).slice(0, 2);
  const prefixe = dispo.length ? `À voir sur ${dispo.join(" et ")}. ` : "";
  const estSerie = contenu.type === "serie";
  const genres = contenu.genres.slice(0, 2).map((g) => g.nom).join(", ");
  const saisons =
    estSerie && contenu.nbSaisons > 0
      ? `, ${contenu.nbSaisons} saison${contenu.nbSaisons > 1 ? "s" : ""}`
      : "";
  const annee = contenu.annee ? ` de ${contenu.annee}` : "";
  const details = `${estSerie ? "Série" : "Film"}${annee}${genres ? ` (${genres})` : ""}${saisons}.`;
  const repli = [
    "Note des spectateurs, distribution et disponibilités en streaming en France.",
    "Note, distribution et disponibilités en streaming en France.",
    "Note, distribution et plateformes en France.",
  ];

  const synopsis = contenu.synopsis?.trim();
  if (synopsis) {
    return composerDescription(prefixe + synopsis, [details], repli);
  }
  return composerDescription(`${prefixe}${contenu.titre} : ${details.charAt(0).toLowerCase()}${details.slice(1)}`, repli);
}

/**
 * Fiche sans rien à montrer : ni résumé en français, ni plateforme en France,
 * ni vote. La route rend n'importe quel identifiant TMDB (liens de la
 * recherche), y compris des entrées annexes presque vides — « Locker Diaries:
 * Coven Academy », mini-série verticale homonyme de « Sorcières Academy ».
 * Accessible, mais pas indexée.
 */
export function fichePauvre(contenu: Serie | Film): boolean {
  return !contenu.synopsis?.trim() && !(contenu.dispo ?? []).length && contenu.nbVotes === 0;
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
  // dateCreated : propriété attendue par Google pour Movie — date complète si connue
  const date = contenu.dateSortie ?? (contenu.annee ? String(contenu.annee) : undefined);
  if (date) {
    data.dateCreated = date;
    data.datePublished = date;
  }
  if (contenu.genres.length > 0) data.genre = contenu.genres.map((g) => g.nom);
  if (!isSerie && (contenu as Film).realisateurs.length > 0) {
    data.director = (contenu as Film).realisateurs.map((nom) => ({
      "@type": "Person",
      name: nom,
    }));
  }
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

/** JSON-LD FAQPage — le texte doit refléter les questions/réponses visibles */
export function jsonLdFaq(entrees: { question: string; reponse: string }[]): string {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: entrees.map((e) => ({
      "@type": "Question",
      name: e.question,
      acceptedAnswer: { "@type": "Answer", text: e.reponse },
    })),
  };
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
