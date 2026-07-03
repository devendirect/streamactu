import type { MetadataRoute } from "next";
import { getNouveautesSemaine } from "@/lib/tmdb";
import {
  decalerSemaineISO,
  formatDateURL,
  formatMoisURL,
  formatSemaineURL,
  getISOWeek,
} from "@/lib/utils";

const BASE = process.env.SITE_URL ?? "https://streamactu.fr";

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

  // ── 30 derniers jours ──
  for (let i = 1; i <= 30; i++) {
    const d = new Date(now);
    d.setUTCDate(d.getUTCDate() - i);
    entries.push({
      url: `${BASE}/${formatDateURL(d)}`,
      changeFrequency: "weekly",
      priority: i <= 7 ? 0.9 : 0.7,
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
