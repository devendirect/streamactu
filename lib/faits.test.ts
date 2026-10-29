import { describe, expect, it } from "vitest";
import {
  classificationFilm,
  dureeSaison,
  dureesSerie,
  formatDureeLongue,
  libelleClassification,
  normaliserClassification,
  statutSerie,
} from "./faits";

describe("classification française", () => {
  it("valeurs TMDB reconnues, le reste ignoré", () => {
    expect(normaliserClassification("U")).toBe("TP");
    expect(normaliserClassification("TP")).toBe("TP");
    expect(normaliserClassification("16")).toBe("16");
    expect(normaliserClassification("NR")).toBeNull();
    expect(normaliserClassification("")).toBeNull();
    expect(normaliserClassification(undefined)).toBeNull();
  });

  // Dates de sortie FR relevées sur TMDB le 2026-10-23
  it("film : la sortie en salle d'abord (Pulp Fiction)", () => {
    expect(
      classificationFilm([
        { type: 1, certification: "" },
        { type: 3, certification: "12" },
        { type: 4, certification: "" },
        { type: 6, certification: "12" },
      ])
    ).toBe("12");
  });
  it("film : à défaut, la sortie numérique (La Maison des Femmes)", () => {
    expect(
      classificationFilm([
        { type: 3, certification: "" },
        { type: 4, certification: "TP" },
        { type: 6, certification: "TP" },
      ])
    ).toBe("TP");
  });
  it("film sans certification (Météors, Tony) : rien", () => {
    expect(classificationFilm([{ type: 3, certification: "" }, { type: 4, certification: "" }])).toBeNull();
    expect(classificationFilm([{ type: 4, certification: "NR" }])).toBeNull();
  });
  it("libellés", () => {
    expect(libelleClassification("TP")).toBe("Tous publics");
    expect(libelleClassification("12")).toBe("Déconseillé aux moins de 12 ans");
  });
});

describe("statutSerie", () => {
  it("terminée, arrêtée, sinon rien", () => {
    expect(statutSerie("Ended")).toBe("terminee");
    expect(statutSerie("Canceled")).toBe("arretee");
    expect(statutSerie("Returning Series")).toBeNull();
    expect(statutSerie("In Production")).toBeNull();
    expect(statutSerie(undefined)).toBeNull();
  });
});

describe("durée d'une saison", () => {
  const ep = (duree: number | null, numero = 1) => ({ numero, date: null, duree });
  it("somme si toutes les durées sont connues", () => {
    expect(dureeSaison([ep(50), ep(48, 2), ep(47, 3)])).toBe(145);
  });
  it("une durée manquante : rien", () => {
    expect(dureeSaison([ep(50), ep(null, 2)])).toBeNull();
    expect(dureeSaison([])).toBeNull();
  });
  it("format", () => {
    expect(formatDureeLongue(395)).toBe("6 h 35");
    expect(formatDureeLongue(125)).toBe("2 h 05");
    expect(formatDureeLongue(120)).toBe("2 h");
    expect(formatDureeLongue(45)).toBe("45 min");
  });
});

describe("durées de la série", () => {
  const AUJ = "2026-10-28";
  const ep = (numero: number, date: string | null, duree: number | null) => ({ numero, date, duree });
  it("total des épisodes diffusés, saison 0 et saisons à venir ignorées", () => {
    const r = dureesSerie(
      [
        { saison: 0, episodes: [ep(1, "2020-01-01", 30)] },
        { saison: 1, episodes: [ep(1, "2021-01-01", 50), ep(2, "2021-01-08", 45)] },
        { saison: 2, episodes: [ep(1, "2026-10-20", 60), ep(2, "2026-11-03", null)] },
        { saison: 3, episodes: [ep(1, null, null)] },
      ],
      AUJ
    );
    expect(r.parSaison).toEqual([
      { saison: 1, minutes: 95, nbEpisodes: 2 },
      { saison: 2, minutes: 60, nbEpisodes: 1 },
    ]);
    expect(r.total).toEqual({ minutes: 155, nbEpisodes: 3 });
  });
  it("une durée manquante dans une saison diffusée : la saison n'a pas de durée, et pas de total", () => {
    const r = dureesSerie(
      [
        { saison: 1, episodes: [ep(1, "2021-01-01", 50)] },
        { saison: 2, episodes: [ep(1, "2022-01-01", 50), ep(2, "2022-01-08", null)] },
      ],
      AUJ
    );
    expect(r.parSaison).toEqual([{ saison: 1, minutes: 50, nbEpisodes: 1 }]);
    expect(r.total).toBeNull();
  });
  it("rien de diffusé : rien", () => {
    expect(dureesSerie([{ saison: 1, episodes: [ep(1, "2027-01-01", 50)] }], AUJ)).toEqual({ parSaison: [], total: null });
  });
});
