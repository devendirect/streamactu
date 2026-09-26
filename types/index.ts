export type MediaType = "serie" | "film";

// ──────────────────────────────────────────────
// Plateformes
// ──────────────────────────────────────────────

export interface Plateforme {
  id: number;    // TMDB watch_provider_id
  nom: string;
  slug: string;
  couleur: string;
}

// ──────────────────────────────────────────────
// Contenu commun
// ──────────────────────────────────────────────

export interface Genre {
  id: number;
  nom: string;
}

export interface PersonneCasting {
  id: number;
  nom: string;
  personnage: string;
  photo: string | null;
}

export interface Video {
  key: string;   // identifiant YouTube
  nom: string;
  type: string;  // "Trailer" | "Teaser" | …
  site: string;  // "YouTube"
}

export interface SaisonResume {
  numero: number;
  nom: string;
  nbEpisodes: number;
  dateDiffusion: string | null;
}

/** Fiche légère — utilisée dans les listes et cartes */
export interface Contenu {
  id: number;
  type: MediaType;
  titre: string;
  slug: string;
  poster: string | null;
  backdrop: string | null;
  note: number;
  nbVotes: number;
  annee: number;
  genres: Genre[];
  synopsis: string;
  plateforme?: Plateforme;
  saisonActuelle?: number;
  premiereDiffusion?: string; // first_air_date YYYY-MM-DD — pour détecter les nouvelles séries
  dispo?: string[]; // plateformes FR (flatrate TMDB) — renseigné sur les fiches détail
  dateSortie?: string; // YYYY-MM-DD — renseigné sur les sorties à venir (groupement par jour)
}

/** Fiche complète d'une série */
export interface Serie extends Contenu {
  type: "serie";
  nbSaisons: number;
  nbEpisodes: number;
  saisonActuelle?: number;
  saisons: SaisonResume[];
  casting: PersonneCasting[];
  trailer: Video | null;
}

/** Fiche complète d'un film */
export interface Film extends Contenu {
  type: "film";
  duree: number;   // minutes
  casting: PersonneCasting[];
  realisateurs: string[];
  trailer: Video | null;
}

// ──────────────────────────────────────────────
// Vues agrégées
// ──────────────────────────────────────────────

export interface NouveautesParPlateforme {
  plateforme: Plateforme;
  series: Contenu[];
  films: Contenu[];
}

/** Vue « année » d'une plateforme : le palmarès annuel + le détail mois par mois. */
export interface NouveautesAnnee {
  plateforme: Plateforme;
  annee: number;
  /** Un item par mois ayant au moins un contenu, du plus récent au plus ancien. */
  mois: { mois: number; annee: number; nbSeries: number; nbFilms: number }[];
  series: Contenu[];
  films: Contenu[];
  totalSeries: number;
  totalFilms: number;
}

export type ModeAffichage = "liste" | "rails" | "grille";

export type ContexteTemporel =
  | { mode: "jour"; dateISO: string }
  | { mode: "semaine"; semaine: number; annee: number }
  | { mode: "mois"; mois: number; annee: number };

export interface RetrouveurResultat {
  titre: string;
  type: "film" | "serie";
  annee: number;
  note: number;
  poster: string | null;
  genres: string[];
  dispo: string[];      // noms des plateformes FR (flatrate TMDB)
  slug: string;
  pourquoi: string;    // explication de Claude
}

export interface ResultatRecherche {
  id: number;
  type: MediaType;
  titre: string;
  slug: string;
  poster: string | null;
  note: number;
  annee: number;
}

// ──────────────────────────────────────────────
// Types bruts TMDB (réponses API)
// ──────────────────────────────────────────────

export interface ReponseTMDB<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export interface TMDBSerie {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  vote_count: number;
  first_air_date: string;
  genre_ids: number[];
  popularity?: number;
}

export interface TMDBSerieDetail {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  vote_count: number;
  first_air_date: string;
  number_of_seasons: number;
  number_of_episodes: number;
  genres: { id: number; name: string }[];
  seasons: {
    season_number: number;
    name: string;
    episode_count: number;
    air_date: string | null;
  }[];
}

export interface TMDBFilm {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  vote_count: number;
  release_date: string;
  genre_ids: number[];
  popularity?: number;
}

/** /movie/{id}/release_dates : type 4 = sortie numérique */
export interface TMDBReleaseDates {
  results: {
    iso_3166_1: string;
    release_dates: { type: number; release_date: string; note?: string }[];
  }[];
}

export interface TMDBFilmDetail {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  vote_count: number;
  release_date: string;
  runtime: number;
  genres: { id: number; name: string }[];
}

export interface TMDBCredits {
  cast: {
    id: number;
    name: string;
    character: string;
    profile_path: string | null;
    order: number;
  }[];
  crew?: {
    name: string;
    job: string;
  }[];
}

export interface TMDBVideos {
  results: {
    key: string;
    name: string;
    type: string;
    site: string;
    official: boolean;
  }[];
}

export interface TMDBGenreList {
  genres: { id: number; name: string }[];
}
