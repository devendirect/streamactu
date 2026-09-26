/**
 * Référentiel des pages genre (/genre/[slug]).
 *
 * Curation manuelle : les nomenclatures TMDB séries et films diffèrent
 * (pas de « Thriller » ni « Horreur » côté séries, « Sci-Fi & Fantasy »
 * fusionnés côté séries…). Chaque genre mappe explicitement vers les ids
 * des deux catalogues — [] quand le genre n'existe pas pour ce type.
 *
 * RÈGLE : les mappings séries doivent rester DISJOINTS entre genres —
 * deux pages qui partagent un id série afficheraient des sections Séries
 * identiques (duplicate content). Quand TMDB fusionne deux genres côté
 * séries (Action & Adventure, Sci-Fi & Fantasy), un seul de nos genres
 * reçoit l'id ; l'autre passe en films uniquement.
 *
 * Les intros sont écrites à la main, une par genre : ne pas les remplacer
 * par du texte généré en masse.
 */

export interface GenreSEO {
  slug: string;
  nom: string;
  idsTv: number[];
  idsFilm: number[];
  intro: string;
}

export const GENRES_SEO: GenreSEO[] = [
  {
    slug: "thriller",
    nom: "Thriller",
    idsTv: [9648], // « Mystère » côté séries — le crime (80) est réservé à Policier
    idsFilm: [53],
    intro: "Tension, retournements et paranoïa : les thrillers qui se dévorent en une soirée.",
  },
  {
    slug: "horreur",
    nom: "Horreur",
    idsTv: [],
    idsFilm: [27],
    intro: "Épouvante, slashers et horreur psychologique, à regarder lumières éteintes.",
  },
  {
    slug: "comedie",
    nom: "Comédie",
    idsTv: [35],
    idsFilm: [35],
    intro: "De la comédie romantique à l'humour noir, de quoi souffler entre deux drames.",
  },
  {
    slug: "drame",
    nom: "Drame",
    idsTv: [18],
    idsFilm: [18],
    intro: "Les grandes histoires, celles qui restent longtemps après le générique.",
  },
  {
    slug: "science-fiction",
    nom: "Science-fiction",
    idsTv: [10765],
    idsFilm: [878],
    intro: "Futurs proches, espace lointain et dystopies : la SF sous toutes ses formes.",
  },
  {
    slug: "fantastique",
    nom: "Fantastique",
    idsTv: [], // « Sci-Fi & Fantasy » (10765) est réservé à Science-fiction
    idsFilm: [14],
    intro: "Mondes parallèles, magie et créatures : quand le réel ne suffit plus.",
  },
  {
    slug: "action",
    nom: "Action",
    idsTv: [10759],
    idsFilm: [28],
    intro: "Poursuites, cascades et gros bras : l'adrénaline en flux continu.",
  },
  {
    slug: "aventure",
    nom: "Aventure",
    idsTv: [], // « Action & Adventure » (10759) est réservé à Action
    idsFilm: [12],
    intro: "Quêtes, explorations et grands espaces, pour voyager depuis le canapé.",
  },
  {
    slug: "animation",
    nom: "Animation",
    idsTv: [16],
    idsFilm: [16],
    intro: "Du cinéma d'animation familial aux séries adultes : le dessin n'a pas d'âge.",
  },
  {
    slug: "documentaire",
    nom: "Documentaire",
    idsTv: [99],
    idsFilm: [99],
    intro: "Le réel raconté : enquêtes, portraits, nature et faits divers.",
  },
  {
    slug: "policier",
    nom: "Policier",
    idsTv: [80],
    idsFilm: [80],
    intro: "Enquêtes, procès et crime organisé : le polar dans tous ses états.",
  },
  {
    slug: "mystere",
    nom: "Mystère",
    idsTv: [], // le mystère côté séries (9648) est réservé à Thriller
    idsFilm: [9648],
    intro: "Disparitions, secrets et énigmes à résoudre avant le dernier épisode.",
  },
  {
    slug: "romance",
    nom: "Romance",
    idsTv: [],
    idsFilm: [10749],
    intro: "Rencontres, ruptures et retrouvailles : les histoires d'amour au premier plan.",
  },
  {
    slug: "familial",
    nom: "Familial",
    idsTv: [10751],
    idsFilm: [10751],
    intro: "À regarder ensemble : des histoires qui parlent à toutes les générations.",
  },
  {
    slug: "guerre",
    nom: "Guerre",
    idsTv: [10768],
    idsFilm: [10752],
    intro: "Fronts, résistances et stratégies : la guerre vue par le cinéma et les séries.",
  },
  {
    slug: "western",
    nom: "Western",
    idsTv: [37],
    idsFilm: [37],
    intro: "Duels, plaines et hors-la-loi : le western classique et ses relectures modernes.",
  },
  {
    slug: "histoire",
    nom: "Histoire",
    idsTv: [],
    idsFilm: [36],
    intro: "Fresques et destins réels : l'Histoire racontée par le cinéma.",
  },
];

export const GENRE_PAR_SLUG: Record<string, GenreSEO> = Object.fromEntries(
  GENRES_SEO.map((g) => [g.slug, g])
);

/** id de genre TMDB (tv ou film) → slug de la page genre, si curaté */
const SLUG_PAR_ID = new Map<number, string>();
for (const g of GENRES_SEO) {
  for (const id of [...g.idsFilm, ...g.idsTv]) {
    if (!SLUG_PAR_ID.has(id)) SLUG_PAR_ID.set(id, g.slug);
  }
}

export function slugPourGenreId(id: number): string | null {
  return SLUG_PAR_ID.get(id) ?? null;
}
