import { describe, it, expect } from "vitest";
import {
  slugify,
  idDepuisSlug,
  horizonFuturISO,
  formatDateFR,
  formatDateURL,
  parseDateURL,
  formatMoisURL,
  parseMoisURL,
  formatSemaineURL,
  parseSemaineURL,
  bornesMois,
  bornesSemaine,
  getISOWeek,
  decalerSemaineISO,
  formatDuree,
  scoreBayesien,
  libelleComptes,
  toISO,
} from "./utils";

describe("slugify / idDepuisSlug", () => {
  it("normalise accents, apostrophes et espaces", () => {
    expect(slugify("L'Étrange Noël de M. Jack")).toBe("l-etrange-noel-de-m-jack");
  });
  it("extrait l'id TMDB en fin de slug", () => {
    expect(idDepuisSlug("stranger-things-66732")).toBe(66732);
    expect(idDepuisSlug("the-100-100")).toBe(100);
    expect(idDepuisSlug("sans-id")).toBeNull();
  });
});

describe("dates jour", () => {
  it("formate et reparse une date en aller-retour", () => {
    const d = new Date(Date.UTC(2026, 6, 4));
    expect(formatDateURL(d)).toBe("4-juillet-2026");
    expect(toISO(parseDateURL("4-juillet-2026")!)).toBe("2026-07-04");
  });
  it("formate sans accents (août → aout)", () => {
    expect(formatDateURL("2026-08-31")).toBe("31-aout-2026");
    expect(formatDateURL("2026-12-01")).toBe("1-decembre-2026");
  });
  it("lit les deux formes : sans accents, accentuée brute ou percent-encodée", () => {
    expect(toISO(parseDateURL("1-aout-2026")!)).toBe("2026-08-01");
    expect(toISO(parseDateURL("1-août-2026")!)).toBe("2026-08-01");
    expect(toISO(parseDateURL("1-ao%C3%BBt-2026")!)).toBe("2026-08-01");
  });
  it("rejette les dates invalides et les non-dates", () => {
    expect(parseDateURL("31-juin-2026")).toBeNull();
    expect(parseDateURL("north-star")).toBeNull();
    expect(parseDateURL("netflix")).toBeNull();
  });
  it("formate en français", () => {
    expect(formatDateFR("2026-07-04")).toBe("4 juillet 2026");
  });
});

describe("mois", () => {
  it("formate sans accents et reparse en aller-retour", () => {
    expect(formatMoisURL(2, 2026)).toBe("fevrier-2026");
    expect(formatMoisURL(8, 2026)).toBe("aout-2026");
    expect(formatMoisURL(12, 2026)).toBe("decembre-2026");
    for (let m = 1; m <= 12; m++) {
      expect(formatMoisURL(m, 2026)).toMatch(/^[a-z]+-2026$/);
      expect(parseMoisURL(formatMoisURL(m, 2026))).toEqual({ mois: m, annee: 2026 });
    }
  });
  it("lit encore les anciennes formes accentuées", () => {
    expect(parseMoisURL("février-2026")).toEqual({ mois: 2, annee: 2026 });
    expect(parseMoisURL("f%C3%A9vrier-2026")).toEqual({ mois: 2, annee: 2026 });
  });
  it("rejette les slugs non-mois", () => {
    expect(parseMoisURL("prime-video")).toBeNull();
    expect(parseMoisURL("semaine-27-2026")).toBeNull();
  });
  it("calcule les bornes, années bissextiles comprises", () => {
    expect(bornesMois(2, 2028)).toEqual({ debut: "2028-02-01", fin: "2028-02-29" });
    expect(bornesMois(2, 2026)).toEqual({ debut: "2026-02-01", fin: "2026-02-28" });
  });
});

describe("semaines ISO", () => {
  it("calcule le numéro de semaine aux bords d'année", () => {
    // 2026-01-01 est un jeudi → semaine 1 de 2026
    expect(getISOWeek(new Date(Date.UTC(2026, 0, 1)))).toEqual({ semaine: 1, annee: 2026 });
    // 2027-01-01 est un vendredi → appartient à la semaine 53 de 2026
    expect(getISOWeek(new Date(Date.UTC(2027, 0, 1)))).toEqual({ semaine: 53, annee: 2026 });
  });
  it("borne une semaine du lundi au dimanche", () => {
    expect(bornesSemaine(27, 2026)).toEqual({ debut: "2026-06-29", fin: "2026-07-05" });
  });
  it("gère les années à 53 semaines dans les décalages (2026 en a 53)", () => {
    expect(decalerSemaineISO(53, 2026, 1)).toEqual({ semaine: 1, annee: 2027 });
    expect(decalerSemaineISO(1, 2027, -1)).toEqual({ semaine: 53, annee: 2026 });
    // et les années à 52 : pas de semaine 53 fantôme
    expect(decalerSemaineISO(1, 2026, -1)).toEqual({ semaine: 52, annee: 2025 });
  });
  it("formate et reparse une URL de semaine", () => {
    expect(formatSemaineURL(27, 2026)).toBe("semaine-27-2026");
    expect(parseSemaineURL("semaine-27-2026")).toEqual({ semaine: 27, annee: 2026 });
    expect(parseSemaineURL("semaine-54-2026")).toBeNull();
    expect(parseSemaineURL("semaine-x-2026")).toBeNull();
  });
});

describe("affichage", () => {
  it("formate les durées", () => {
    expect(formatDuree(138)).toBe("2h 18min");
    expect(formatDuree(60)).toBe("1h");
    expect(formatDuree(45)).toBe("45min");
    expect(formatDuree(0)).toBe("");
  });
  it("accorde les comptes de contenus", () => {
    expect(libelleComptes(3, 1)).toBe("3 séries et 1 film");
    expect(libelleComptes(1, 0)).toBe("1 série");
    expect(libelleComptes(0, 2)).toBe("2 films");
    expect(libelleComptes(0, 0)).toBe("");
  });
});

describe("horizonFuturISO", () => {
  it("borne le futur à 28 jours, débordement de mois compris", () => {
    expect(horizonFuturISO(new Date(Date.UTC(2026, 6, 4)))).toBe("2026-08-01");
  });
});

describe("scoreBayesien", () => {
  it("tire les notes à faible volume vers la moyenne", () => {
    // 9,0 avec 12 votes ne doit pas battre 8,4 avec 50 000 votes
    expect(scoreBayesien(9, 12)).toBeLessThan(scoreBayesien(8.4, 50000));
  });
  it("converge vers la note quand les votes sont nombreux", () => {
    expect(scoreBayesien(8.4, 50000)).toBeCloseTo(8.4, 1);
  });
  it("retourne le prior sans votes", () => {
    expect(scoreBayesien(10, 0)).toBe(7);
  });
});
