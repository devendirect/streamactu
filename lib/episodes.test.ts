import { describe, expect, it } from "vitest";
import { calendrierSaison, calendrierSerie, decalageFrance, libelleEpisodes, phraseCalendrier, saisonADetailler } from "./episodes";
import { formatJourSemaineFR } from "./utils";

// VisionQuest saison 1 : dates TMDB (États-Unis) relevées le 2026-10-23
const VISIONQUEST = {
  saison: 1,
  episodes: [
    { numero: 1, date: "2026-10-13", duree: 50 },
    { numero: 2, date: "2026-10-13", duree: 48 },
    { numero: 3, date: "2026-10-20", duree: 47 },
    { numero: 4, date: "2026-10-20", duree: 52 },
    { numero: 5, date: "2026-10-27", duree: 49 },
    { numero: 6, date: "2026-10-27", duree: 51 },
    { numero: 7, date: "2026-11-03", duree: 50 },
    { numero: 8, date: "2026-11-10", duree: 58 },
  ],
};

describe("decalageFrance", () => {
  it("Disney+ : un jour, si la série est sur Disney+ en France", () => {
    expect(decalageFrance([2739], [337])).toEqual({ jours: 1, plateforme: 337 });
  });
  it("réseau connu mais série ailleurs en France : inconnu", () => {
    expect(decalageFrance([2739], [8])).toBeNull();
  });
  it("réseau sans décalage constaté (Sky Atlantic) : inconnu", () => {
    expect(decalageFrance([1063], [1899])).toBeNull();
  });
  it("Netflix : même jour", () => {
    expect(decalageFrance([213], [8])).toEqual({ jours: 0, plateforme: 8 });
  });
});

describe("calendrierSaison", () => {
  it("VisionQuest au 23 octobre : épisodes 5 et 6 le mercredi 28 en France", () => {
    const c = calendrierSaison(VISIONQUEST, "2026-10-23", 1)!;
    expect(c.datesFrance).toBe(true);
    expect(c.disponibles).toBe(4);
    expect(c.prochaine).toEqual({ numeros: [5, 6], date: "2026-10-28" });
    expect(formatJourSemaineFR(c.prochaine!.date)).toBe("Mercredi 28 octobre 2026");
    expect(c.fin).toBe("2026-11-11");
    expect(c.sorties).toHaveLength(5);
  });

  it("jour de sortie : l'épisode du jour est disponible, pas « prochain »", () => {
    const c = calendrierSaison(VISIONQUEST, "2026-10-28", 1)!;
    expect(c.disponibles).toBe(6);
    expect(c.prochaine?.numeros).toEqual([7]);
  });

  it("décalage inconnu : dates d'origine", () => {
    const c = calendrierSaison(VISIONQUEST, "2026-10-23", null)!;
    expect(c.datesFrance).toBe(false);
    expect(c.prochaine?.date).toBe("2026-10-27");
  });

  it("saison terminée récemment : pas de prochain épisode", () => {
    const c = calendrierSaison(VISIONQUEST, "2026-11-20", 1)!;
    expect(c.prochaine).toBeNull();
    expect(c.disponibles).toBe(8);
  });

  it("saison lointaine : rien à afficher", () => {
    expect(calendrierSaison(VISIONQUEST, "2027-06-01", 1)).toBeNull();
  });

  it("épisodes sans date : pas de date de fin", () => {
    const c = calendrierSaison(
      { saison: 1, episodes: [{ numero: 1, date: "2026-10-23", duree: null }, { numero: 2, date: null, duree: null }] },
      "2026-10-23",
      0
    )!;
    expect(c.fin).toBeNull();
    expect(c.nbEpisodes).toBe(2);
    expect(c.disponibles).toBe(1);
  });

  it("décalage qui change de mois", () => {
    const c = calendrierSaison({ saison: 2, episodes: [{ numero: 1, date: "2026-10-31", duree: null }] }, "2026-10-23", 1)!;
    expect(c.prochaine?.date).toBe("2026-11-01");
  });
});

describe("saisonADetailler", () => {
  it("prochain épisode proche : sa saison", () => {
    expect(saisonADetailler({ season_number: 4, air_date: "2026-10-30" }, null, "2026-10-23")).toBe(4);
  });
  it("prochain épisode lointain, dernier récent : saison du dernier", () => {
    expect(
      saisonADetailler({ season_number: 3, air_date: "2027-09-01" }, { season_number: 2, air_date: "2026-10-01" }, "2026-10-23")
    ).toBe(2);
  });
  it("série à l'arrêt : rien", () => {
    expect(saisonADetailler(null, { season_number: 5, air_date: "2020-05-01" }, "2026-10-23")).toBeNull();
  });
});

describe("libelleEpisodes", () => {
  it("un, deux, plusieurs", () => {
    expect(libelleEpisodes([5])).toBe("Épisode 5");
    expect(libelleEpisodes([5, 6])).toBe("Épisodes 5 et 6");
    expect(libelleEpisodes([1, 2, 3, 4])).toBe("Épisodes 1 à 4");
  });
});

describe("phraseCalendrier", () => {
  it("dates françaises, saison en cours", () => {
    const c = calendrierSerie(VISIONQUEST, [2739], [337], "2026-10-23")!;
    expect(c.plateforme).toBe(337);
    expect(phraseCalendrier(c, "Disney+")).toBe(
      "Épisodes 5 et 6 de la saison 1 le mercredi 28 octobre 2026 sur Disney+ en France. 4 sur 8 déjà disponibles. Fin de la saison le mercredi 11 novembre 2026."
    );
  });
  it("dates d'origine : la phrase le dit", () => {
    const c = calendrierSerie(VISIONQUEST, [1063], [1899], "2026-10-23")!;
    expect(phraseCalendrier(c, null)).toBe(
      "Épisodes 5 et 6 de la saison 1 le mardi 27 octobre 2026 (date de diffusion d'origine ; en France, date non connue). 4 sur 8 déjà diffusés. Fin de la saison le mardi 10 novembre 2026."
    );
  });
  it("saison finie", () => {
    const c = calendrierSerie(VISIONQUEST, [2739], [337], "2026-11-20")!;
    expect(phraseCalendrier(c, "Disney+")).toBe(
      "Les 8 épisodes de la saison 1 sont sortis sur Disney+ en France, le dernier le mercredi 11 novembre 2026."
    );
  });
  it("pas de saison en cours : rien", () => {
    expect(calendrierSerie(undefined, [2739], [337], "2026-10-23")).toBeNull();
  });
  it("saison sortie d'un bloc, nommée « Partie » par la plateforme", () => {
    const lupin = {
      saison: 3,
      nom: "Partie 4",
      episodes: [1, 2, 3].map((numero) => ({ numero, date: "2026-10-23", duree: null })),
    };
    const c = calendrierSerie(lupin, [213], [8], "2026-10-23")!;
    expect(phraseCalendrier(c, "Netflix")).toBe(
      "Les 3 épisodes de la partie 4 sont sortis sur Netflix en France, le vendredi 23 octobre 2026."
    );
  });
  it("saison finie, dates d'origine", () => {
    const c = calendrierSerie(VISIONQUEST, [1063], [1899], "2026-11-20")!;
    expect(phraseCalendrier(c, null)).toBe(
      "Les 8 épisodes de la saison 1 ont été diffusés, le dernier le mardi 10 novembre 2026 (date de diffusion d'origine ; en France, date non connue)."
    );
  });
});
