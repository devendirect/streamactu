// ──────────────────────────────────────────────
// Slugs
// ──────────────────────────────────────────────

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// ──────────────────────────────────────────────
// Dates
// ──────────────────────────────────────────────

const MOIS_FR = [
  "janvier", "février", "mars", "avril", "mai", "juin",
  "juillet", "août", "septembre", "octobre", "novembre", "décembre",
];

/** "2026-06-27" → "27 juin 2026" */
export function formatDateFR(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date + "T12:00:00Z") : date;
  return `${d.getUTCDate()} ${MOIS_FR[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

/** (6, 2026) → "juin-2026" */
export function formatMoisURL(mois: number, annee: number): string {
  return `${MOIS_FR[mois - 1]}-${annee}`;
}

/** Décode un segment d'URL potentiellement percent-encodé ("f%C3%A9vrier" → "février") */
function decoderSegment(slug: string): string {
  try {
    return decodeURIComponent(slug);
  } catch {
    return slug;
  }
}

/** "juin-2026" → { mois: 6, annee: 2026 } | null */
export function parseMoisURL(brut: string): { mois: number; annee: number } | null {
  const slug = decoderSegment(brut);
  const tiret = slug.lastIndexOf("-");
  if (tiret === -1) return null;
  const nomMois = slug.slice(0, tiret);
  const annee = parseInt(slug.slice(tiret + 1), 10);
  const moisIdx = MOIS_FR.indexOf(nomMois);
  if (moisIdx === -1 || isNaN(annee) || annee < 2000 || annee > 2100) return null;
  return { mois: moisIdx + 1, annee };
}

/** "2026" → 2026 | null (mêmes bornes que parseMoisURL) */
export function parseAnneeURL(brut: string): number | null {
  const slug = decoderSegment(brut);
  if (!/^\d{4}$/.test(slug)) return null;
  const annee = parseInt(slug, 10);
  if (annee < 2000 || annee > 2100) return null;
  return annee;
}

/** Date → "27-juin-2026" */
export function formatDateURL(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date + "T12:00:00Z") : date;
  return `${d.getUTCDate()}-${MOIS_FR[d.getUTCMonth()]}-${d.getUTCFullYear()}`;
}

/** "27-juin-2026" → Date | null */
export function parseDateURL(brut: string): Date | null {
  const slug = decoderSegment(brut);
  const parts = slug.split("-");
  if (parts.length < 3) return null;
  // le mois peut être multi-mots (ex: "north-star" n'est pas une date)
  // format attendu : {jour}-{moisFR}-{annee}
  const annee = parseInt(parts[parts.length - 1], 10);
  const nomMois = parts[parts.length - 2];
  const jour = parseInt(parts[0], 10);
  const moisIdx = MOIS_FR.indexOf(nomMois);
  if (isNaN(jour) || moisIdx === -1 || isNaN(annee)) return null;
  const d = new Date(Date.UTC(annee, moisIdx, jour));
  if (d.getUTCDate() !== jour) return null; // date invalide (ex: 31 juin)
  return d;
}

/** "2026-06-27" (ISO) → Date UTC */
export function parseISO(iso: string): Date {
  return new Date(iso + "T12:00:00Z");
}

/** Date → "2026-06-27" */
export function toISO(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/** Début et fin du mois en ISO */
export function bornesMois(mois: number, annee: number): { debut: string; fin: string } {
  const debut = `${annee}-${String(mois).padStart(2, "0")}-01`;
  const dernierJour = new Date(Date.UTC(annee, mois, 0)).getUTCDate();
  const fin = `${annee}-${String(mois).padStart(2, "0")}-${String(dernierJour).padStart(2, "0")}`;
  return { debut, fin };
}

// ──────────────────────────────────────────────
// Semaines ISO
// ──────────────────────────────────────────────

const JOURS_FR = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];

/** Date → "Vendredi 27 juin 2026" */
export function formatJourSemaineFR(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date + "T12:00:00Z") : date;
  return `${JOURS_FR[d.getUTCDay()]} ${formatDateFR(d)}`;
}

/** (6, 2026) → "Juin 2026" */
export function formatMoisFR(mois: number, annee: number): string {
  const nom = MOIS_FR[mois - 1];
  return `${nom.charAt(0).toUpperCase()}${nom.slice(1)} ${annee}`;
}

/** Calcule le numéro de semaine ISO 8601 */
export function getISOWeek(date: Date): { semaine: number; annee: number } {
  const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const semaine = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  return { semaine, annee: d.getUTCFullYear() };
}

/** Bornes ISO d'une semaine ISO (lundi–dimanche) */
export function bornesSemaine(semaine: number, annee: number): { debut: string; fin: string } {
  const jan4 = new Date(Date.UTC(annee, 0, 4));
  const lundi = new Date(jan4);
  lundi.setUTCDate(jan4.getUTCDate() - (jan4.getUTCDay() || 7) + 1 + (semaine - 1) * 7);
  const dimanche = new Date(lundi);
  dimanche.setUTCDate(lundi.getUTCDate() + 6);
  return { debut: toISO(lundi), fin: toISO(dimanche) };
}

/**
 * Horizon de navigation dans le futur : les pages jour/semaine à venir montrent
 * les diffusions programmées (épisodes des séries en cours) et sont en noindex.
 * Au-delà, les calendriers TMDB ne sont plus fiables → 404.
 */
export const HORIZON_FUTUR_JOURS = 28;

/** Date ISO du dernier jour navigable dans le futur */
export function horizonFuturISO(depuis: Date = new Date()): string {
  const d = new Date(depuis);
  d.setUTCDate(d.getUTCDate() + HORIZON_FUTUR_JOURS);
  return toISO(d);
}

/**
 * Semaine ISO décalée de `delta` semaines, calculée sur les dates réelles.
 * Gère correctement les années à 53 semaines (2026 en est une).
 */
export function decalerSemaineISO(
  semaine: number,
  annee: number,
  delta: number
): { semaine: number; annee: number } {
  const lundi = parseISO(bornesSemaine(semaine, annee).debut);
  lundi.setUTCDate(lundi.getUTCDate() + delta * 7);
  return getISOWeek(lundi);
}

/** "semaine-26-2026" */
export function formatSemaineURL(semaine: number, annee: number): string {
  return `semaine-${semaine}-${annee}`;
}

/** "semaine-26-2026" → {semaine, annee} | null */
export function parseSemaineURL(slug: string): { semaine: number; annee: number } | null {
  const match = slug.match(/^semaine-(\d{1,2})-(\d{4})$/);
  if (!match) return null;
  const semaine = parseInt(match[1], 10);
  const annee = parseInt(match[2], 10);
  if (semaine < 1 || semaine > 53) return null;
  return { semaine, annee };
}

/** "22 — 28 juin" (court, sans année) */
export function formatSemaineFR(semaine: number, annee: number): string {
  const { debut, fin } = bornesSemaine(semaine, annee);
  const d = new Date(debut + "T12:00:00Z");
  const f = new Date(fin + "T12:00:00Z");
  const jDebut = d.getUTCDate();
  const jFin = f.getUTCDate();
  const mFin = MOIS_FR[f.getUTCMonth()];
  if (d.getUTCMonth() === f.getUTCMonth()) {
    return `${jDebut} — ${jFin} ${mFin}`;
  }
  return `${jDebut} ${MOIS_FR[d.getUTCMonth()]} — ${jFin} ${mFin}`;
}

// ──────────────────────────────────────────────
// Affichage
// ──────────────────────────────────────────────

/** "stranger-things-66732" → 66732 | null */
export function idDepuisSlug(slug: string): number | null {
  const parts = slug.split("-");
  const id = parseInt(parts[parts.length - 1], 10);
  return isNaN(id) ? null : id;
}

/** minutes → "2h 18min" */
export function formatDuree(minutes: number): string {
  if (!minutes) return "";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? (m > 0 ? `${h}h ${m}min` : `${h}h`) : `${m}min`;
}

/**
 * Note pondérée par le volume de votes (moyenne bayésienne) — évite qu'un
 * contenu à 9,0 avec 12 votes écrase les classements.
 * m = poids du prior, C = note moyenne typique TMDB.
 */
export function scoreBayesien(note: number, votes: number, m = 100, C = 7): number {
  if (votes <= 0) return C;
  return (votes / (votes + m)) * note + (m / (votes + m)) * C;
}

/** Accord simple pour les intros : "3 séries et 1 film" ("" si tout est vide) */
export function libelleComptes(nbSeries: number, nbFilms: number): string {
  const parts: string[] = [];
  if (nbSeries > 0) parts.push(`${nbSeries} série${nbSeries > 1 ? "s" : ""}`);
  if (nbFilms > 0) parts.push(`${nbFilms} film${nbFilms > 1 ? "s" : ""}`);
  return parts.join(" et ");
}

export const TYPE_ICONS: Record<string, string> = { serie: "▣", film: "◈" };
export const TYPE_LABELS: Record<string, string> = { serie: "Série", film: "Film" };

/** Alt text des posters : explicite la relation image/contenu pour la recherche d'images */
export function altAffiche(titre: string, type: "serie" | "film"): string {
  return `Affiche de ${type === "serie" ? "série" : "film"} — ${titre}`;
}

export function isNouvelleSerieCheck(saisonActuelle?: number, premiereDiffusion?: string): boolean {
  if (saisonActuelle === 1) return true;
  if (!premiereDiffusion) return false;
  const diff = (Date.now() - new Date(premiereDiffusion).getTime()) / 86_400_000;
  return diff >= 0 && diff <= 180;
}

export function normaliser(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]/g, "");
}
