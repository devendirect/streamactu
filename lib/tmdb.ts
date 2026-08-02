import { unstable_cache } from "next/cache";
import type {
  Contenu,
  Serie,
  Film,
  PersonneCasting,
  Video,
  NouveautesParPlateforme,
  NouveautesAnnee,
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
import { PLATEFORMES, PLATEFORME_PAR_ID } from "@/lib/plateformes";
import {
  slugify,
  bornesMois,
  bornesSemaine,
  decalerSemaineISO,
  getISOWeek,
  scoreBayesien,
} from "@/lib/utils";

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
  url.searchParams.set("language", "fr-FR");
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, String(v));
  }
  return url.toString();
}

// ── Limiteur de concurrence global ────────────
// Le build Next parallélise fortement (workers × Promise.all de 14 requêtes) :
// sans garde-fou, des dizaines de connexions simultanées partent vers TMDB,
// qui répond 429 en rafale. On sérialise à N requêtes simultanées par
// processus (le build utilise plusieurs workers — les retries font le reste).
const MAX_CONCURRENCE = 4;
let requetesEnCours = 0;
const fileAttente: (() => void)[] = [];

async function acquerirSlot(): Promise<void> {
  if (requetesEnCours < MAX_CONCURRENCE) {
    requetesEnCours++;
    return;
  }
  await new Promise<void>((resolve) => fileAttente.push(resolve));
  // le slot est transmis directement par libererSlot, sans repasser par le compteur
}

function libererSlot(): void {
  const suivant = fileAttente.shift();
  if (suivant) suivant();
  else requetesEnCours--;
}

const MAX_TENTATIVES = 4;

async function tmdbGet<T>(
  path: string,
  params: Record<string, string | number | boolean> = {},
  ttl = 3600
): Promise<T> {
  // Authentification par Bearer token (API Read Access Token) : la clé ne
  // transite plus dans les URLs, donc plus dans les logs. Repli sur l'ancienne
  // clé v3 en query string si le token n'est pas configuré.
  const token = process.env.TMDB_API_TOKEN;
  const headers: Record<string, string> = { Accept: "application/json" };
  const url = new URL(buildUrl(path, params));
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  } else {
    url.searchParams.set("api_key", process.env.TMDB_API_KEY!);
  }

  // Relances sur erreur transitoire (429, 5xx, réseau/timeout) : backoff
  // exponentiel avec jitter pour désynchroniser les vagues du build, et
  // respect du Retry-After envoyé par TMDB sur les 429.
  for (let tentative = 1; tentative <= MAX_TENTATIVES; tentative++) {
    let res: Response;
    await acquerirSlot();
    try {
      res = await fetch(url.toString(), {
        headers,
        next: { revalidate: ttl },
        signal: AbortSignal.timeout(10000),
      });
    } catch (err) {
      if (tentative === MAX_TENTATIVES) throw err;
      console.error(
        `[tmdb] échec réseau sur ${path} (tentative ${tentative}) :`,
        err instanceof Error ? err.message : err
      );
      await attendre(delaiBackoff(tentative));
      continue;
    } finally {
      libererSlot();
    }

    if (res.ok) return res.json() as Promise<T>;

    const transitoire = res.status === 429 || res.status >= 500;
    if (!transitoire || tentative === MAX_TENTATIVES) {
      throw new Error(`TMDB ${res.status} sur ${path}`);
    }

    const retryAfter = Number(res.headers.get("retry-after"));
    const delai =
      res.status === 429 && retryAfter > 0
        ? retryAfter * 1000 + Math.random() * 500
        : delaiBackoff(tentative);
    console.error(
      `[tmdb] ${res.status} sur ${path} (tentative ${tentative}/${MAX_TENTATIVES}), relance dans ${Math.round(delai)}ms`
    );
    await attendre(delai);
  }

  // Jamais atteint (la boucle lance ou retourne), mais TypeScript l'exige
  throw new Error(`TMDB inaccessible sur ${path}`);
}

/** Backoff exponentiel avec jitter : ~600ms, ~1,2s, ~2,4s */
function delaiBackoff(tentative: number): number {
  return 300 * 2 ** tentative + Math.random() * 400;
}

function attendre(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
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
// Compte des sorties d'un jour (cache 24h) — 2 appels légers, toutes
// plateformes confondues. Sert au sitemap pour écarter les jours creux.
// ──────────────────────────────────────────────

const TOUS_PROVIDERS = PLATEFORMES.map((p) => p.id).join("|");

export const getCompteJour = unstable_cache(
  async (dateISO: string): Promise<number> => {
    const base = {
      with_watch_providers: TOUS_PROVIDERS,
      watch_region: "FR",
      "vote_count.gte": 5,
    };
    const [tv, film] = await Promise.all([
      tmdbGet<ReponseTMDB<TMDBSerie>>("/discover/tv", {
        ...base,
        "air_date.gte": dateISO,
        "air_date.lte": dateISO,
      }, 86400),
      tmdbGet<ReponseTMDB<TMDBFilm>>("/discover/movie", {
        ...base,
        "primary_release_date.gte": dateISO,
        "primary_release_date.lte": dateISO,
      }, 86400),
    ]);
    return tv.total_results + film.total_results;
  },
  ["compte-jour"],
  { revalidate: 86400 }
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

/**
 * Vue « année » d'une plateforme : agrège les 12 mois de l'année (bornés au
 * mois en cours pour l'année courante) et en tire un palmarès annuel trié par
 * note pondérée, plus le détail mois par mois qui sert de maillage vers les
 * archives mensuelles.
 *
 * Réutilise les caches de getNouveautesMois — aucun appel TMDB supplémentaire
 * une fois les mois en cache, et le limiteur de concurrence encaisse la montée
 * en charge du premier rendu.
 */
export async function getNouveautesAnnee(
  plateformeId: number,
  annee: number,
  max = 20
): Promise<NouveautesAnnee | null> {
  const now = new Date();
  const dernierMois =
    annee === now.getUTCFullYear() ? now.getUTCMonth() + 1 : 12;
  if (annee > now.getUTCFullYear() || dernierMois < 1) return null;

  const parMois = await Promise.all(
    Array.from({ length: dernierMois }, (_, i) =>
      getNouveautesMois(i + 1, annee)
    )
  );

  const plateforme = PLATEFORME_PAR_ID[plateformeId];
  if (!plateforme) return null;

  const mois: NouveautesAnnee["mois"] = [];
  const series: Contenu[] = [];
  const films: Contenu[] = [];
  const vusSeries = new Set<number>();
  const vusFilms = new Set<number>();

  // Du plus récent au plus ancien : l'archive la plus fraîche en tête de liste.
  for (let i = parMois.length - 1; i >= 0; i--) {
    const data = parMois[i].find((p) => p.plateforme.id === plateformeId);
    if (!data) continue;
    if (data.series.length + data.films.length === 0) continue;

    mois.push({
      mois: i + 1,
      annee,
      nbSeries: data.series.length,
      nbFilms: data.films.length,
    });

    // Un titre peut ressortir sur deux mois consécutifs (date de sortie
    // révisée chez TMDB) : on ne le compte qu'une fois dans le palmarès.
    for (const s of data.series) {
      if (vusSeries.has(s.id)) continue;
      vusSeries.add(s.id);
      series.push(s);
    }
    for (const f of data.films) {
      if (vusFilms.has(f.id)) continue;
      vusFilms.add(f.id);
      films.push(f);
    }
  }

  const parNote = (a: Contenu, b: Contenu) =>
    scoreBayesien(b.note, b.nbVotes) - scoreBayesien(a.note, a.nbVotes);

  return {
    plateforme,
    annee,
    mois,
    series: [...series].sort(parNote).slice(0, max),
    films: [...films].sort(parNote).slice(0, max),
    totalSeries: series.length,
    totalFilms: films.length,
  };
}

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
// Sorties récentes d'une plateforme (N dernières semaines, dédupliquées,
// récent d'abord). Réutilise les caches semaine — aucun appel propre.
// ──────────────────────────────────────────────

export async function getSortiesRecentesPlateforme(
  plateformeId: number,
  nbSemaines = 4
): Promise<{ series: Contenu[]; films: Contenu[] }> {
  const { semaine, annee } = getISOWeek(new Date());
  const semaines = Array.from({ length: nbSemaines }, (_, i) =>
    decalerSemaineISO(semaine, annee, -i)
  );
  const donnees = await Promise.all(
    semaines.map((s) => getNouveautesSemaine(s.semaine, s.annee))
  );

  const vus = new Set<number>();
  const series: Contenu[] = [];
  const films: Contenu[] = [];
  for (const plateformes of donnees) {
    const data = plateformes.find((p) => p.plateforme.id === plateformeId);
    if (!data) continue;
    for (const s of data.series) {
      if (!vus.has(s.id)) { vus.add(s.id); series.push(s); }
    }
    for (const f of data.films) {
      if (!vus.has(f.id)) { vus.add(f.id); films.push(f); }
    }
  }
  return { series, films };
}

// ──────────────────────────────────────────────
// Disponibilité streaming FR (watch providers)
// ──────────────────────────────────────────────

interface TMDBProviders {
  results: {
    FR?: {
      flatrate?: { provider_id: number; provider_name: string }[];
    };
  };
}

/** Plateformes FR (abonnement) où un contenu est disponible. [] si aucune ou en cas d'erreur. */
export async function getProvidersFR(
  media: "movie" | "tv",
  id: number
): Promise<string[]> {
  try {
    const providers = await tmdbGet<TMDBProviders>(`/${media}/${id}/watch/providers`);
    return providers.results?.FR?.flatrate?.map((p) => p.provider_name) ?? [];
  } catch (err) {
    console.error(`[tmdb] providers indisponibles pour ${media}/${id} :`, err instanceof Error ? err.message : err);
    return [];
  }
}

// ──────────────────────────────────────────────
// Détail série
// ──────────────────────────────────────────────

export const getDetailSerie = unstable_cache(
  async (id: number): Promise<Serie> => {
    const [detail, credits, videos, dispo] = await Promise.all([
      tmdbGet<TMDBSerieDetail>(`/tv/${id}`),
      tmdbGet<TMDBCredits>(`/tv/${id}/credits`),
      tmdbGet<TMDBVideos>(`/tv/${id}/videos`),
      getProvidersFR("tv", id),
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
      dateSortie: detail.first_air_date || undefined,
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
      dispo,
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
    const [detail, credits, videos, dispo] = await Promise.all([
      tmdbGet<TMDBFilmDetail>(`/movie/${id}`),
      tmdbGet<TMDBCredits>(`/movie/${id}/credits`),
      tmdbGet<TMDBVideos>(`/movie/${id}/videos`),
      getProvidersFR("movie", id),
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
      dateSortie: detail.release_date || undefined,
      genres,
      synopsis: detail.overview,
      duree: detail.runtime,
      casting,
      realisateurs: (credits.crew ?? [])
        .filter((c) => c.job === "Director")
        .map((c) => c.name),
      trailer,
      dispo,
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
// Sorties à venir (28 prochains jours, cache 6h)
// Périmètre : nouvelles séries (first_air_date) et films (primary_release_date)
// — les dates sont fiables, contrairement aux retours de saisons.
// Pas de filtre sur les votes : les contenus futurs n'en ont pas encore.
// ──────────────────────────────────────────────

export const getSortiesAVenir = unstable_cache(
  async (): Promise<NouveautesParPlateforme[]> => {
    const now = new Date();
    const demain = new Date(now);
    demain.setUTCDate(now.getUTCDate() + 1);
    const fin = new Date(now);
    fin.setUTCDate(now.getUTCDate() + 28);
    const debutISO = demain.toISOString().slice(0, 10);
    const finISO = fin.toISOString().slice(0, 10);

    const [genresTv, genresFilm] = await Promise.all([getGenresTv(), getGenresFilm()]);

    return Promise.all(
      PLATEFORMES.map(async (plateforme) => {
        const base = {
          with_watch_providers: plateforme.id,
          watch_region: "FR",
        };
        const [tvData, filmData] = await Promise.all([
          tmdbGet<ReponseTMDB<TMDBSerie>>("/discover/tv", {
            ...base,
            sort_by: "first_air_date.asc",
            "first_air_date.gte": debutISO,
            "first_air_date.lte": finISO,
          }, 21600),
          tmdbGet<ReponseTMDB<TMDBFilm>>("/discover/movie", {
            ...base,
            sort_by: "primary_release_date.asc",
            "primary_release_date.gte": debutISO,
            "primary_release_date.lte": finISO,
          }, 21600),
        ]);

        return {
          plateforme,
          series: tvData.results.slice(0, 20).map((s) => ({
            ...mapSerie(s, genresTv),
            plateforme,
            dateSortie: s.first_air_date || undefined,
          })),
          films: filmData.results.slice(0, 20).map((f) => ({
            ...mapFilm(f, genresFilm),
            plateforme,
            dateSortie: f.release_date || undefined,
          })),
        };
      })
    );
  },
  ["sorties-a-venir"],
  { revalidate: 21600 }
);

// ──────────────────────────────────────────────
// Top annuel (cache 24h) — contenus les mieux notés de l'année,
// disponibles en streaming FR (abonnement)
// ──────────────────────────────────────────────

export const getTopAnnee = unstable_cache(
  async (type: "serie" | "film", annee: number): Promise<Contenu[]> => {
    const [genresTv, genresFilm] = await Promise.all([getGenresTv(), getGenresFilm()]);
    const base = {
      sort_by: "vote_average.desc",
      "vote_count.gte": 200,
      watch_region: "FR",
      with_watch_monetization_types: "flatrate",
    };

    // Re-tri bayésien des résultats reçus : le tri brut de TMDB fait passer
    // un 8,6 à 210 votes devant un 8,4 à 50 000 (même logique que les tops mensuels)
    const trier = (contenus: Contenu[]) =>
      contenus
        .sort((a, b) => scoreBayesien(b.note, b.nbVotes) - scoreBayesien(a.note, a.nbVotes))
        .slice(0, 20);

    if (type === "serie") {
      const data = await tmdbGet<ReponseTMDB<TMDBSerie>>("/discover/tv", {
        ...base,
        first_air_date_year: annee,
      }, 86400);
      return trier(data.results.map((s) => mapSerie(s, genresTv)));
    }

    const data = await tmdbGet<ReponseTMDB<TMDBFilm>>("/discover/movie", {
      ...base,
      primary_release_year: annee,
    }, 86400);
    return trier(data.results.map((f) => mapFilm(f, genresFilm)));
  },
  ["top-annee"],
  { revalidate: 86400 }
);

/**
 * Top du mois : agrège les nouveautés du mois toutes plateformes, note
 * pondérée. Réutilise les caches de getNouveautesMois — aucun appel TMDB
 * supplémentaire. Utilisé par la page top et llms-full.txt.
 */
export async function getTopMois(
  type: "serie" | "film",
  mois: number,
  annee: number,
  max = 20
): Promise<Contenu[]> {
  const plateformes = await getNouveautesMois(mois, annee);
  const vus = new Set<number>();
  const contenus: Contenu[] = [];

  for (const pf of plateformes) {
    for (const c of type === "serie" ? pf.series : pf.films) {
      if (vus.has(c.id)) continue;
      vus.add(c.id);
      contenus.push(c);
    }
  }

  return contenus
    .sort(
      (a, b) =>
        scoreBayesien(b.note, b.nbVotes) - scoreBayesien(a.note, a.nbVotes)
    )
    .slice(0, max);
}

// ──────────────────────────────────────────────
// Contenus par genre (cache 24h) — pages /genre/[slug]
// Catalogue disponible en streaming FR, trié par popularité.
// ──────────────────────────────────────────────

export const getContenusGenre = unstable_cache(
  async (
    idsTv: number[],
    idsFilm: number[],
    plateformeId?: number
  ): Promise<{ series: Contenu[]; films: Contenu[] }> => {
    const [genresTv, genresFilm] = await Promise.all([getGenresTv(), getGenresFilm()]);

    const provider: Record<string, string | number> = plateformeId
      ? { with_watch_providers: plateformeId }
      : { with_watch_monetization_types: "flatrate" };
    const base = {
      watch_region: "FR",
      ...provider,
      sort_by: "popularity.desc",
      "vote_count.gte": 50,
    };

    const [tvData, filmData] = await Promise.all([
      idsTv.length > 0
        ? tmdbGet<ReponseTMDB<TMDBSerie>>("/discover/tv", {
            ...base,
            with_genres: idsTv.join("|"),
          }, 86400)
        : Promise.resolve({ results: [] as TMDBSerie[] }),
      idsFilm.length > 0
        ? tmdbGet<ReponseTMDB<TMDBFilm>>("/discover/movie", {
            ...base,
            with_genres: idsFilm.join("|"),
          }, 86400)
        : Promise.resolve({ results: [] as TMDBFilm[] }),
    ]);

    return {
      series: tvData.results.slice(0, 20).map((s) => mapSerie(s, genresTv)),
      films: filmData.results.slice(0, 20).map((f) => mapFilm(f, genresFilm)),
    };
  },
  ["contenus-genre"],
  { revalidate: 86400 }
);

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

  const dispo = await getProvidersFR(isFilm ? "movie" : "tv", match.id);

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
