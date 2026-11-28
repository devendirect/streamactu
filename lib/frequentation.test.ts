import { describe, expect, it } from "vitest";
import { FREQUENTATION_MOIS, dernierMois, phraseFrequentation, type MoisFrequentation } from "./frequentation";

const m = (mois: string, entrees: number, evolution: number): MoisFrequentation => ({ mois, entrees, evolution, source: "https://x" });

describe("données", () => {
  it("un mois par entrée, sans trou ni doublon, valeurs plausibles", () => {
    const mois = FREQUENTATION_MOIS.map((x) => x.mois).sort();
    expect(new Set(mois).size).toBe(mois.length);
    for (let i = 1; i < mois.length; i++) {
      const [a, b] = [mois[i - 1], mois[i]].map((s) => Number(s.slice(0, 4)) * 12 + Number(s.slice(5)));
      expect(b - a, mois[i]).toBe(1);
    }
    for (const x of FREQUENTATION_MOIS) {
      expect(x.entrees).toBeGreaterThan(1);
      expect(x.entrees).toBeLessThan(40);
      expect(x.source).toMatch(/^https:\/\/www\.cnc\.fr\//);
    }
  });
});

describe("phraseFrequentation", () => {
  it("dernier mois connu : octobre 2026", () => {
    expect(phraseFrequentation(dernierMois()!)).toBe(
      "En octobre 2026, les salles de cinéma françaises ont enregistré 14,66 millions d'entrées, en hausse de 17,1 % sur un an (estimation du CNC)."
    );
  });

  it("baisse, et meilleur mois de l'année", () => {
    expect(phraseFrequentation(m("2026-09", 8.88, -7.3))).toContain("en baisse de 7,3 % sur un an");
    expect(phraseFrequentation(FREQUENTATION_MOIS.find((x) => x.mois === "2026-08")!)).toBe(
      "En août 2026, les salles de cinéma françaises ont enregistré 20,4 millions d'entrées, en hausse de 104,8 % sur un an, le meilleur mois de l'année (estimation du CNC)."
    );
  });

  it("pas de « meilleur mois » pour le premier mois de l'année ni pour un mois battu plus tôt", () => {
    expect(phraseFrequentation(FREQUENTATION_MOIS.find((x) => x.mois === "2026-01")!)).not.toContain("meilleur");
    expect(phraseFrequentation(FREQUENTATION_MOIS.find((x) => x.mois === "2026-10")!)).not.toContain("meilleur");
  });

  it("pas de « meilleur mois » quand les mois précédents de l'année ne sont pas connus (décembre 2025)", () => {
    expect(phraseFrequentation(FREQUENTATION_MOIS.find((x) => x.mois === "2025-12")!)).not.toContain("meilleur");
  });

  it("stable", () => {
    expect(phraseFrequentation(m("2030-03", 12, 0), [m("2030-03", 12, 0)])).toContain("stable sur un an");
  });
});
