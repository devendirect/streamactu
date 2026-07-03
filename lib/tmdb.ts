import { unstable_cache } from "next/cache";
import type {
  Contenu,
  Serie,
  Film,
  PersonneCasting,
  Video,
  NouveautesParPlateforme,
  ResultatRecherche,
  ReponseTMDB,
  TMDBSerie,
  TMDBSerieDetail,
  TMDBFilm,
  TMDBFilmDetail,
  TMDBCredits,
  TMDBVideos,
  TMDBGenreList,
  Genre,
} from "@/types";
import { PLATEFORMES } from "@/lib/plateformes";
import { slugify, bornesMois, bornesSemaine } from "@/lib/utils";

const BASE = "https://api.themoviedb.org/3";
export const TMDB_IMG = "https://image.tmdb.org/t/p";

// ──────────────────────────────────────────────
// Client HTTP
// ──────────────────────────────────────────────

function buildUrl(
  path: string,
  params: Record<string, string | number | boolean> = {}
): string {
  const url = new URL(`${BASE}${path}`);
  url.searchParams.set("api_key", process.env.TMDB_API_KEY!);
  url.searchParams.set("language", "fr-FR");
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, String(v));
  }
  return url.toString();
}

async function tmdbGet<T>(
  path: string,
  params: Record<string, string | number | boolean> = {},
  ttl = 3600
): Promise<T> {
  const res = await fetch(buildUrl(path, params), {
    next: { revalidate: ttl },
    signal: AbortSignal.timeout(10000),
  });
  if (!res.ok) {
    throw new Error(`TMDB ${res.status} sur ${path}`);
  }
  return res.json() as Promise<T>;
}

// ──────────────────────────────────────────────
// Images
// ──────────────────────────────────────────────

export type PosterSize = "w185" | "w342" | "w500" | "w780" | "original";

export function posterUrl(
  path: string | null,
  size: PosterSize = "w342"
): string | null {
  return path ? `${TMDB_IMG}/${size}${path}` : null;
}

// ──────────────────────────────────────────────
// Genres (cache 7 jours)
// ──────────────────────────────────────────────

export const getGenresTv = unstable_cache(
  async (): Promise<Record<number, string>> => {
    const data = await tmdbGet<TMDBGenreList>("/genre/tv/list", {}, 604800);
    return Object.fromEntries(data.genres.map((g) => [g.id, g.name]));
  },
  ["genres-tv"],
  { revalidate: 604800 }
);

export const getGenresFilm = unstable_cache(
  async (): Promise<Record<number, string>> => {
    const data = await tmdbGet<TMDBGenreList>("/genre/movie/list", {}, 604800);
    return Object.fromEntries(data.genres.map((g) => [g.id, g.name]));
  },
  ["genres-film"],
  { revalidate: 604800 }
);

// ──────────────────────────────────────────────
// Mappers TMDB → types internes
// ──────────────────────────────────────────────

function mapGenreIds(ids: number[], ref: Record<number, string>): Genre[] {
  return ids.map((id) => ({ id, nom: ref[id] ?? "" })).filter((g) => g.nom);
}

function mapSerie(item: TMDBSerie, genres: Record<number, string>): Contenu {
  return {
    id: item.id,
    type: "serie",
    titre: item.name,
    slug: `${slugify(item.name)}-${item.id}`,
    poster: posterUrl(item.poster_path),
    backdrop: posterUrl(item.backdrop_path, "w780"),
    note: Math.round(item.vote_average * 10) / 10,
    nbVotes: item.vote_count,
    annee: item.first_air_date ? new Date(item.first_air_date).getFullYear() : 0,
    genres: mapGenreIds(item.genre_ids, genres),
    synopsis: item.overview,
    premiereDiffusion: item.first_air_date || undefined,
  };
}

function mapFilm(item: TMDBFilm, genres: Record<number, string>): Contenu {
  return {
    id: item.id,
    type: "film",
    titre: item.title,
    slug: `${slugify(item.title)}-${item.id}`,
    poster: posterUrl(item.poster_path),
    backdrop: posterUrl(item.backdrop_path, "w780"),
    note: Math.round(item.vote_average * 10) / 10,
    nbVotes: item.vote_count,
    annee: item.release_date ? new Date(item.release_date).getFullYear() : 0,
    genres: mapGenreIds(item.genre_ids, genres),
    synopsis: item.overview,
  };
}

// ──────────────────────────────────────────────
// Nouveautés par jour (cache 1h)
// ──────────────────────────────────────────────

export const getNouveautesJour = unstable_cache(
  async (dateISO: string): Promise<NouveautesParPlateforme[]> => {
    const [genresTv, genresFilm] = await Promise.all([
      getGenresTv(),
      getGenresFilm(),
    ]);

    const resultats = await Promise.all(
      PLATEFORMES.map(async (plateforme) => {
        const base = {
          with_watch_providers: plateforme.id,
          watch_region: "FR",
          "vote_count.gte": 5,
          sort_by: "popularity.desc",
        };

        const [tvData, filmData] = await Promise.all([
          tmdbGet<ReponseTMDB<TMDBSerie>>("/discover/tv", {
            ...base,
            "air_date.gte": dateISO,
            "air_date.lte": dateISO,
          }),
          tmdbGet<ReponseTMDB<TMDBFilm>>("/discover/movie", {
            ...base,
            "primary_release_date.gte": dateISO,
            "primary_release_date.lte": dateISO,
          }),
        ]);

        return {
          plateforme,
          series: tvData.results.slice(0, 12).map((s) => mapSerie(s, genresTv)),
          films: filmData.results.slice(0, 12).map((f) => mapFilm(f, genresFilm)),
        };
      })
    );

    return resultats.filter((r) => r.series.length > 0 || r.films.length > 0);
  },
  ["nouveautes-jour"],
  { revalidate: 3600 }
);

// ──────────────────────────────────────────────
// Nouveautés par mois (cache 24h)
// ──────────────────────────────────────────────

export const getNouveautesMois = unstable_cache(
  async (mois: number, annee: number): Promise<NouveautesParPlateforme[]> => {
    const { debut, fin } = bornesMois(mois, annee);
    const [genresTv, genresFilm] = await Promise.all([
      getGenresTv(),
      getGenresFilm(),
    ]);

    return Promise.all(
      PLATEFORMES.map(async (plateforme) => {
        const base = {
          with_watch_providers: plateforme.id,
          watch_region: "FR",
          sort_by: "popularity.desc",
          "vote_count.gte": 5,
        };

        const [tvData, filmData] = await Promise.all([
          tmdbGet<ReponseTMDB<TMDBSerie>>("/discover/tv", {
            ...base,
            "air_date.gte": debut,
            "air_date.lte": fin,
          }),
          tmdbGet<ReponseTMDB<TMDBFilm>>("/discover/movie", {
            ...base,
            "primary_release_date.gte": debut,
            "primary_release_date.lte": fin,
          }),
        ]);

        return {
          plateforme,
          series: tvData.results.map((s) => mapSerie(s, genresTv)),
          films: filmData.results.map((f) => mapFilm(f, genresFilm)),
        };
      })
    );
  },
  ["nouveautes-mois"],
  { revalidate: 86400 }
);

// ──────────────────────────────────────────────
// Nouveautés par semaine (cache 1h)
// ──────────────────────────────────────────────

export const getNouveautesSemaine = unstable_cache(
  async (semaine: number, annee: number): Promise<NouveautesParPlateforme[]> => {
    const { debut, fin } = bornesSemaine(semaine, annee);
    const [genresTv, genresFilm] = await Promise.all([getGenresTv(), getGenresFilm()]);

    return Promise.all(
      PLATEFORMES.map(async (plateforme) => {
        const base = {
          with_watch_providers: plateforme.id,
          watch_region: "FR",
          sort_by: "popularity.desc",
          "vote_count.gte": 5,
        };
        const [tvData, filmData] = await Promise.all([
          tmdbGet<ReponseTMDB<TMDBSerie>>("/discover/tv", {
            ...base,
            "air_date.gte": debut,
            "air_date.lte": fin,
          }),
          tmdbGet<ReponseTMDB<TMDBFilm>>("/discover/movie", {
            ...base,
            "primary_release_date.gte": debut,
            "primary_release_date.lte": fin,
          }),
        ]);
        return {
          plateforme,
          series: tvData.results.map((s) => mapSerie(s, genresTv)),
          films: filmData.results.map((f) => mapFilm(f, genresFilm)),
        };
      })
    );
  },
  ["nouveautes-semaine"],
  { revalidate: 3600 }
);

// ──────────────────────────────────────────────
// Détail série
// ──────────────────────────────────────────────

export const getDetailSerie = unstable_cache(
  async (id: number): Promise<Serie> => {
    const [detail, credits, videos] = await Promise.all([
      tmdbGet<TMDBSerieDetail>(`/tv/${id}`),
      tmdbGet<TMDBCredits>(`/tv/${id}/credits`),
      tmdbGet<TMDBVideos>(`/tv/${id}/videos`),
    ]);

    const trailer = trouverTrailer(videos.results);
    const casting = mapCasting(credits.cast);
    const genres = detail.genres.map((g) => ({ id: g.id, nom: g.name }));

    const derniereS = detail.seasons.at(-1);

    return {
      id: detail.id,
      type: "serie",
      titre: detail.name,
      slug: `${slugify(detail.name)}-${detail.id}`,
      poster: posterUrl(detail.poster_path),
      backdrop: posterUrl(detail.backdrop_path, "w780"),
      note: Math.round(detail.vote_average * 10) / 10,
      nbVotes: detail.vote_count,
      annee: detail.first_air_date ? new Date(detail.first_air_date).getFullYear() : 0,
      genres,
      synopsis: detail.overview,
      nbSaisons: detail.number_of_seasons,
      nbEpisodes: detail.number_of_episodes,
      saisonActuelle: derniereS?.season_number,
      saisons: detail.seasons.map((s) => ({
        numero: s.season_number,
        nom: s.name,
        nbEpisodes: s.episode_count,
        dateDiffusion: s.air_date,
      })),
      casting,
      trailer,
    };
  },
  ["detail-serie"],
  { revalidate: 3600 }
);

// ──────────────────────────────────────────────
// Détail film
// ──────────────────────────────────────────────

export const getDetailFilm = unstable_cache(
  async (id: number): Promise<Film> => {
    const [detail, credits, videos] = await Promise.all([
      tmdbGet<TMDBFilmDetail>(`/movie/${id}`),
      tmdbGet<TMDBCredits>(`/movie/${id}/credits`),
      tmdbGet<TMDBVideos>(`/movie/${id}/videos`),
    ]);

    const trailer = trouverTrailer(videos.results);
    const casting = mapCasting(credits.cast);
    const genres = detail.genres.map((g) => ({ id: g.id, nom: g.name }));

    return {
      id: detail.id,
      type: "film",
      titre: detail.title,
      slug: `${slugify(detail.title)}-${detail.id}`,
      poster: posterUrl(detail.poster_path),
      backdrop: posterUrl(detail.backdrop_path, "w780"),
      note: Math.round(detail.vote_average * 10) / 10,
      nbVotes: detail.vote_count,
      annee: detail.release_date ? new Date(detail.release_date).getFullYear() : 0,
      genres,
      synopsis: detail.overview,
      duree: detail.runtime,
      casting,
      trailer,
    };
  },
  ["detail-film"],
  { revalidate: 3600 }
);

// ──────────────────────────────────────────────
// Recherche
// ──────────────────────────────────────────────

export async function rechercherContenu(query: string): Promise<ResultatRecherche[]> {
  if (!query.trim()) return [];

  const data = await tmdbGet<
    ReponseTMDB<(TMDBSerie | TMDBFilm) & { media_type: string }>
  >("/search/multi", { query, include_adult: false }, 0);

  return data.results
    .filter((r) => r.media_type === "tv" || r.media_type === "movie")
    .slice(0, 20)
    .map((r) => {
      if (r.media_type === "tv") {
        const s = r as TMDBSerie & { media_type: string };
        return {
          id: s.id,
          type: "serie" as const,
          titre: s.name,
          slug: `${slugify(s.name)}-${s.id}`,
          poster: posterUrl(s.poster_path),
          note: Math.round(s.vote_average * 10) / 10,
          annee: s.first_air_date ? new Date(s.first_air_date).getFullYear() : 0,
        };
      }
      const f = r as TMDBFilm & { media_type: string };
      return {
        id: f.id,
        type: "film" as const,
        titre: f.title,
        slug: `${slugify(f.title)}-${f.id}`,
        poster: posterUrl(f.poster_path),
        note: Math.round(f.vote_average * 10) / 10,
        annee: f.release_date ? new Date(f.release_date).getFullYear() : 0,
      };
    });
}

// ──────────────────────────────────────────────
// Tendances de la semaine (cache 24h) — chips de la page recherche
// ──────────────────────────────────────────────

export const getTendancesSemaine = unstable_cache(
  async (): Promise<string[]> => {
    const data = await tmdbGet<
      ReponseTMDB<(TMDBSerie | TMDBFilm) & { media_type: string }>
    >("/trending/all/week", {}, 86400);

    return data.results
      .filter((r) => r.media_type === "tv" || r.media_type === "movie")
      .slice(0, 4)
      .map((r) => ("title" in r ? r.title : r.name));
  },
  ["tendances-semaine"],
  { revalidate: 86400 }
);

// ──────────────────────────────────────────────
// Contenu aléatoire (pour /surprise)
// ──────────────────────────────────────────────

export async function getContenuAleatoire(type: "serie" | "film" | "tous" = "tous"): Promise<Contenu> {
  const [genresTv, genresFilm] = await Promise.all([getGenresTv(), getGenresFilm()]);
  const isFilm = type === "film" || (type === "tous" && Math.random() > 0.5);
  const page = Math.floor(Math.random() * 5) + 1;

  if (isFilm) {
    const data = await tmdbGet<ReponseTMDB<TMDBFilm>>("/discover/movie", {
      sort_by: "popularity.desc",
      watch_region: "FR",
      with_watch_monetization_types: "flatrate",
      "vote_count.gte": 100,
      page,
    }, 0);
    const item = data.results[Math.floor(Math.random() * data.results.length)];
    return mapFilm(item, genresFilm);
  }

  const data = await tmdbGet<ReponseTMDB<TMDBSerie>>("/discover/tv", {
    sort_by: "popularity.desc",
    watch_region: "FR",
    with_watch_monetization_types: "flatrate",
    "vote_count.gte": 100,
    page,
  }, 0);
  const item = data.results[Math.floor(Math.random() * data.results.length)];
  return mapSerie(item, genresTv);
}

// ──────────────────────────────────────────────
// Contenus des jeux du jour — rotation quotidienne (cache 24h)
// ──────────────────────────────────────────────

export const getContenusJeuDuJour = unstable_cache(
  async (): Promise<Contenu[]> => {
    const [genresTv, genresFilm] = await Promise.all([getGenresTv(), getGenresFilm()]);
    const [tvData, filmData] = await Promise.all([
      tmdbGet<ReponseTMDB<TMDBSerie>>("/discover/tv", {
        sort_by: "popularity.desc",
        watch_region: "FR",
        with_watch_monetization_types: "flatrate",
        "vote_count.gte": 200,
      }),
      tmdbGet<ReponseTMDB<TMDBFilm>>("/discover/movie", {
        sort_by: "popularity.desc",
        watch_region: "FR",
        with_watch_monetization_types: "flatrate",
        "vote_count.gte": 200,
      }),
    ]);

    const series = tvData.results.map((s) => mapSerie(s, genresTv));
    const films = filmData.results.map((f) => mapFilm(f, genresFilm));
    return [...series, ...films];
  },
  ["contenus-jeu-du-jour"],
  { revalidate: 86400 }
);

// ──────────────────────────────────────────────
// Helpers internes
// ──────────────────────────────────────────────

function trouverTrailer(
  videos: TMDBVideos["results"]
): Video | null {
  const priorite = ["Trailer", "Teaser", "Clip"];
  for (const type of priorite) {
    const v = videos.find((v) => v.site === "YouTube" && v.type === type && v.official);
    if (v) return { key: v.key, nom: v.name, type: v.type, site: v.site };
  }
  // fallback : n'importe quelle vidéo YouTube
  const fallback = videos.find((v) => v.site === "YouTube");
  if (fallback) return { key: fallback.key, nom: fallback.name, type: fallback.type, site: fallback.site };
  return null;
}

function mapCasting(cast: TMDBCredits["cast"]): PersonneCasting[] {
  return cast.slice(0, 8).map((p) => ({
    id: p.id,
    nom: p.name,
    personnage: p.character,
    photo: posterUrl(p.profile_path, "w185"),
  }));
}

// ──────────────────────────────────────────────
// Retrouver — enrichissement TMDB d'un titre suggéré par Claude
// ──────────────────────────────────────────────

interface TMDBMultiResult {
  id: number;
  media_type: "movie" | "tv" | "person";
  title?: string;
  name?: string;
  poster_path: string | null;
  vote_average: number;
  vote_count: number;
  release_date?: string;
  first_air_date?: string;
  genre_ids: number[];
}

interface TMDBProviders {
  results: {
    FR?: {
      flatrate?: { provider_id: number; provider_name: string }[];
    };
  };
}

export async function retrouverFiche(
  titre: string,
  typeHint: "film" | "serie",
  pourquoi: string
): Promise<import("@/types").RetrouveurResultat | null> {
  const search = await tmdbGet<{ results: TMDBMultiResult[] }>("/search/multi", {
    query: titre,
    include_adult: false,
  });

  const preferType = typeHint === "film" ? "movie" : "tv";
  const match =
    search.results.find((r) => r.media_type === preferType) ??
    search.results.find((r) => r.media_type === "movie" || r.media_type === "tv");

  if (!match || match.media_type === "person") return null;

  const isFilm = match.media_type === "movie";
  const [genresTv, genresFilm] = await Promise.all([getGenresTv(), getGenresFilm()]);
  const genreMap = isFilm ? genresFilm : genresTv;
  const genres = (match.genre_ids ?? []).map((id) => genreMap[id]).filter(Boolean);

  let dispo: string[] = [];
  try {
    const path = isFilm
      ? `/movie/${match.id}/watch/providers`
      : `/tv/${match.id}/watch/providers`;
    const providers = await tmdbGet<TMDBProviders>(path);
    dispo = providers.results?.FR?.flatrate?.map((p) => p.provider_name) ?? [];
  } catch {
    // pas bloquant si les providers échouent
  }

  const titreFinal = isFilm ? (match.title ?? titre) : (match.name ?? titre);

  return {
    titre: titreFinal,
    type: isFilm ? "film" : "serie",
    annee: new Date(isFilm ? (match.release_date ?? "") : (match.first_air_date ?? "")).getFullYear() || 0,
    note: Math.round(match.vote_average * 10) / 10,
    poster: posterUrl(match.poster_path, "w185"),
    genres,
    dispo,
    slug: `${slugify(titreFinal)}-${match.id}`,
    pourquoi,
  };
}
