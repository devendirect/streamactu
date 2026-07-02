import type { MetadataRoute } from "next";
import {
  formatDateURL,
  formatMoisURL,
  formatSemaineURL,
  getISOWeek,
} from "@/lib/utils";

const BASE = process.env.SITE_URL ?? "https://streamactu.fr";

export default function sitemap(): MetadataRoute.Sitemap {
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
    let sem = semCur - i;
    let annee = anneeCur;
    if (sem < 1) { annee--; sem += 52; }
    entries.push({
      url: `${BASE}/${formatSemaineURL(sem, annee)}`,
      changeFrequency: "weekly",
      priority: i === 0 ? 0.8 : 0.6,
    });
  }

  // ── 6 derniers mois ──
  for (let i = 1; i <= 6; i++) {
    const d = new Date(now);
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

  return entries;
}
