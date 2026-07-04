import type { MetadataRoute } from "next";
import type { NouveautesParPlateforme } from "@/types";
import { getCompteJour, getNouveautesSemaine, getSortiesAVenir } from "@/lib/tmdb";
import { PLATEFORMES } from "@/lib/plateformes";
import { GENRES_SEO } from "@/lib/genres";
import {
  decalerSemaineISO,
  formatDateURL,
  formatMoisURL,
  formatSemaineURL,
  getISOWeek,
  toISO,
} from "@/lib/utils";

const BASE = process.env.SITE_URL ?? "https://streamactu.fr";
// En dessous de ce nombre de sorties, une page jour est jugée trop maigre
// pour être poussée à Google
const MIN_SORTIES_JOUR = 3;

// Régénération quotidienne garantie, indépendamment des déploiements :
// les fenêtres (30 jours, semaines, mois) doivent glisser chaque jour.
export const revalidate = 86400;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  // ── Accueil (aujourd'hui) ──
  entries.push({
    url: BASE,
    changeFrequency: "daily",
    priority: 1.0,
    lastModified: now,
  });

  // ── 30 derniers jours — les jours creux sont écartés ──
  // (2 appels légers par jour, cache 24h ; en cas d'échec du comptage,
  // le jour est inclus quand même — on préfère une page maigre à un trou)
  const jours = await Promise.all(
    Array.from({ length: 30 }, (_, k) => {
      const d = new Date(now);
      d.setUTCDate(d.getUTCDate() - (k + 1));
      return getCompteJour(toISO(d))
        .catch(() => MIN_SORTIES_JOUR)
        .then((compte) => ({ d, position: k + 1, compte }));
    })
  );
  for (const { d, position, compte } of jours) {
    if (compte < MIN_SORTIES_JOUR) continue;
    entries.push({
      url: `${BASE}/${formatDateURL(d)}`,
      changeFrequency: "weekly",
      priority: position <= 7 ? 0.9 : 0.7,
      lastModified: d,
    });
  }

  // ── 12 dernières semaines ──
  const { semaine: semCur, annee: anneeCur } = getISOWeek(now);
  for (let i = 0; i < 12; i++) {
    const { semaine, annee } = decalerSemaineISO(semCur, anneeCur, -i);
    entries.push({
      url: `${BASE}/${formatSemaineURL(semaine, annee)}`,
      changeFrequency: "weekly",
      priority: i === 0 ? 0.8 : 0.6,
    });
  }

  // ── 6 derniers mois ──
  for (let i = 1; i <= 6; i++) {
    const d = new Date(now);
    d.setUTCDate(15); // évite le débordement de fin de mois (ex. 31 → mois suivant)
    d.setUTCMonth(d.getUTCMonth() - i);
    entries.push({
      url: `${BASE}/${formatMoisURL(d.getUTCMonth() + 1, d.getUTCFullYear())}`,
      changeFrequency: "monthly",
      priority: i === 1 ? 0.7 : 0.5,
    });
  }

  // ── Prochaines sorties ──
  entries.push({
    url: `${BASE}/prochaines-sorties`,
    changeFrequency: "daily",
    priority: 0.8,
    lastModified: now,
  });

  // ── Tops (3 derniers mois révolus + année en cours) ──
  for (let i = 1; i <= 3; i++) {
    const d = new Date(now);
    d.setUTCDate(15);
    d.setUTCMonth(d.getUTCMonth() - i);
    const mois = formatMoisURL(d.getUTCMonth() + 1, d.getUTCFullYear());
    entries.push(
      { url: `${BASE}/top/series-${mois}`, changeFrequency: "monthly", priority: i === 1 ? 0.7 : 0.5 },
      { url: `${BASE}/top/films-${mois}`, changeFrequency: "monthly", priority: i === 1 ? 0.7 : 0.5 }
    );
  }
  const anneeCourante = now.getUTCFullYear();
  entries.push(
    { url: `${BASE}/top/series-${anneeCourante}`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE}/top/films-${anneeCourante}`, changeFrequency: "weekly", priority: 0.7 }
  );

  // ── Pages plateforme (hub + types + prochaines sorties + 3 mois d'archives) ──
  // Les prochaines-sorties d'une plateforme sans rien d'annoncé sont exclues
  // (elles sont noindex) ; en cas d'échec du fetch, on inclut tout (fail-open).
  let aVenir: NouveautesParPlateforme[] = [];
  try {
    aVenir = await getSortiesAVenir();
  } catch {
    // fail-open
  }

  for (const pf of PLATEFORMES) {
    entries.push({
      url: `${BASE}/${pf.slug}`,
      changeFrequency: "daily",
      priority: 0.9,
      lastModified: now,
    });
    entries.push(
      { url: `${BASE}/${pf.slug}/series`, changeFrequency: "weekly", priority: 0.7 },
      { url: `${BASE}/${pf.slug}/films`, changeFrequency: "weekly", priority: 0.7 }
    );

    const pfAVenir = aVenir.find((p) => p.plateforme.id === pf.id);
    const aDesSortiesAVenir =
      aVenir.length === 0 || // comptage indisponible → fail-open
      (pfAVenir?.series.length ?? 0) + (pfAVenir?.films.length ?? 0) > 0;
    if (aDesSortiesAVenir) {
      entries.push({
        url: `${BASE}/${pf.slug}/prochaines-sorties`,
        changeFrequency: "daily",
        priority: 0.6,
      });
    }
    for (let i = 1; i <= 3; i++) {
      const d = new Date(now);
      d.setUTCDate(15);
      d.setUTCMonth(d.getUTCMonth() - i);
      entries.push({
        url: `${BASE}/${pf.slug}/${formatMoisURL(d.getUTCMonth() + 1, d.getUTCFullYear())}`,
        changeFrequency: "monthly",
        priority: 0.5,
      });
    }
  }

  // ── Genres (hubs uniquement — les croisements genre×plateforme sont
  // découverts par le maillage interne et se 404-ent quand ils sont maigres) ──
  for (const g of GENRES_SEO) {
    entries.push({
      url: `${BASE}/genre/${g.slug}`,
      changeFrequency: "weekly",
      priority: 0.6,
    });
  }

  // ── Pages statiques ──
  entries.push(
    { url: `${BASE}/mentions-legales`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${BASE}/jeux`, changeFrequency: "daily", priority: 0.5 }
  );

  // ── Fiches des sorties récentes (4 dernières semaines) ──
  // Réutilise le cache des pages semaine ; en cas d'échec TMDB, le sitemap
  // de base reste servi.
  try {
    const semaines = [0, 1, 2, 3].map((i) => decalerSemaineISO(semCur, anneeCur, -i));
    const donnees = await Promise.all(
      semaines.map((s) => getNouveautesSemaine(s.semaine, s.annee))
    );

    const vues = new Set<string>();
    for (const plateformes of donnees) {
      for (const pf of plateformes) {
        for (const contenu of [...pf.series, ...pf.films]) {
          const url = `${BASE}/${contenu.type}/${contenu.slug}`;
          if (vues.has(url)) continue;
          vues.add(url);
          entries.push({ url, changeFrequency: "weekly", priority: 0.6 });
        }
      }
    }
  } catch {
    // TMDB indisponible — on n'ajoute pas les fiches cette fois-ci.
  }

  return entries;
}
