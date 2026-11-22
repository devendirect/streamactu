/**
 * Compte à rebours du Nouvel An : minuit à Paris (1er janvier 00:00, Europe/Paris), identique
 * pour tous les visiteurs. Fonctions pures, testées dans lib/nouvelan.test.ts ; l'affichage est
 * dans components/nouvelan/CalqueNouvelAn.tsx.
 */

export interface PartiesParis {
  y: number;
  m: number;
  j: number;
  h: number;
  mi: number;
  s: number;
}

/** Date et heure d'un instant, vues de Paris */
export function partiesParis(d: Date): PartiesParis {
  const out = { y: 0, m: 0, j: 0, h: 0, mi: 0, s: 0 };
  const cle: Record<string, keyof PartiesParis> = { year: "y", month: "m", day: "j", hour: "h", minute: "mi", second: "s" };
  new Intl.DateTimeFormat("fr-FR", {
    timeZone: "Europe/Paris",
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hourCycle: "h23",
  })
    .formatToParts(d)
    .forEach((p) => {
      const k = cle[p.type];
      if (k) out[k] = Number(p.value);
    });
  return out;
}

export interface EtatNouvelAn {
  /** « avant » : décembre, minuit pas passé ; « apres » : minuit est passé (1er et 2 janvier) */
  phase: "avant" | "apres";
  /** Année qui commence (2027 pour le Nouvel An 2026 → 2027) */
  annee: number;
  /** Secondes avant minuit (0 une fois passé) */
  restant: number;
}

export function etatNouvelAn(d: Date): EtatNouvelAn {
  const p = partiesParis(d);
  if (p.m === 12) {
    // Heure « murale » de Paris : pas de changement d'heure entre le 30 décembre et le 1er janvier
    const cible = Date.UTC(p.y + 1, 0, 1);
    const mur = Date.UTC(p.y, 11, p.j, p.h, p.mi, p.s);
    return { phase: "avant", annee: p.y + 1, restant: Math.max(0, Math.round((cible - mur) / 1000)) };
  }
  return { phase: "apres", annee: p.y, restant: 0 };
}

const deux = (n: number) => String(n).padStart(2, "0");

/** « 1 j 05 h 12 min 45 s », « 5 h 12 min 45 s », « 12 min 45 s », « 45 s » : l'unité de tête sans zéro devant */
export function texteRestant(restant: number): string {
  const s = Math.max(0, Math.floor(restant));
  const j = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const mi = Math.floor((s % 3600) / 60);
  const se = s % 60;
  if (j > 0) return `${j} j ${deux(h)} h ${deux(mi)} min ${deux(se)} s`;
  if (h > 0) return `${h} h ${deux(mi)} min ${deux(se)} s`;
  if (mi > 0) return `${mi} min ${deux(se)} s`;
  return `${se} s`;
}

/**
 * Aperçu : ?heure=2026-12-31T23:59:30 fait vivre le site à cette heure (heure de Paris, hiver, sauf
 * décalage donné). Renvoie le décalage en ms à ajouter à l'heure réelle, ou 0 si absent ou invalide.
 */
export function decalageHeure(recherche: string, maintenant: number): number {
  const m = recherche.match(/[?&]heure=([0-9T:.+\-Z]+)/);
  if (!m) return 0;
  const brut = decodeURIComponent(m[1]);
  const t = Date.parse(/(Z|[+-]\d\d:\d\d)$/.test(brut) ? brut : `${brut}+01:00`);
  return Number.isNaN(t) ? 0 : t - maintenant;
}
