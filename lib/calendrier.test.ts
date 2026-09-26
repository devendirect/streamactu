import { describe, it, expect } from "vitest";
import { plateformeDepuisNote, serieAnnonceeCredible } from "./calendrier";

describe("plateformeDepuisNote", () => {
  it("reconnaît les notes réelles des sorties numériques françaises", () => {
    expect(plateformeDepuisNote("Canal+")).toBe(381);
    expect(plateformeDepuisNote("CANAL+")).toBe(381);
    expect(plateformeDepuisNote("Apple TV")).toBe(350);
    expect(plateformeDepuisNote("Apple TV+")).toBe(350);
    expect(plateformeDepuisNote("Netflix")).toBe(8);
    expect(plateformeDepuisNote("Prime Video")).toBe(119);
    expect(plateformeDepuisNote("Disney+")).toBe(337);
    expect(plateformeDepuisNote("HBO Max")).toBe(1899);
    expect(plateformeDepuisNote("Paramount+")).toBe(582);
  });
  it("ignore les services hors périmètre et les notes vides", () => {
    for (const note of ["Arte.tv", "MUBI", "France.tv", "France•tv", "arte.tv (Young european cinema)", "", undefined]) {
      expect(plateformeDepuisNote(note), String(note)).toBeNull();
    }
  });
  it("ne confond pas un mot qui contient le nom d'une plateforme", () => {
    expect(plateformeDepuisNote("Maximum Films")).toBeNull();
    expect(plateformeDepuisNote("Canalside Pictures")).toBeNull();
  });
});

describe("serieAnnonceeCredible", () => {
  it("garde une série avec un résumé en français", () => {
    expect(serieAnnonceeCredible({ overview: "Une famille déchirée…", popularity: 1 })).toBe(true);
  });
  it("garde une série populaire même sans résumé", () => {
    expect(serieAnnonceeCredible({ overview: "", popularity: 8 })).toBe(true);
  });
  it("écarte une production confidentielle sans résumé", () => {
    expect(serieAnnonceeCredible({ overview: "  ", popularity: 1 })).toBe(false);
    expect(serieAnnonceeCredible({})).toBe(false);
  });
});
