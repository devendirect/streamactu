import { describe, expect, it, vi } from "vitest";

// unstable_cache n'existe qu'avec le runtime Next : on le neutralise
vi.mock("next/cache", () => ({ unstable_cache: (f: unknown) => f }));

import { type Declarations, entitesReferencees, extraireFaits, faitsVides } from "./wikidata";

const entite = (id: string, extra: object = {}) => ({ mainsnak: { datavalue: { value: { id } } }, ...extra });
const texte = (v: string) => ({ mainsnak: { datavalue: { value: v } } });
const annee = (a: number) => ({ qualifiers: { P585: [{ datavalue: { value: { time: `+${a}-02-09T00:00:00Z` } } }] } });

// D'après Parasite (Q61448040), relevé le 2026-10-23, raccourci
const PARASITE: Declarations = {
  P166: [
    entite("Q1", annee(2019)), // Palme d'or
    entite("Q2", annee(2019)), // prix de la Gilde (hors liste)
    entite("Q3", annee(2020)), // Oscar du meilleur film
    entite("Q4", annee(2020)), // Golden Globe
    entite("Q5", annee(2020)), // sans libellé français
    entite("Q6", { ...annee(2020), rank: "deprecated" }), // Oscar déprécié
    entite("Q7", annee(2020)), // BAFTA
  ],
  P915: [entite("Q10"), entite("Q11"), entite("Q12"), entite("Q13")],
  P1265: [texte("255238")],
  P10100: [texte("25357970")],
};
const LIBELLES: Record<string, string> = {
  Q1: "Palme d'or",
  Q2: "prix de la Gilde Film",
  Q3: "Oscar du meilleur film",
  Q4: "Golden Globe du meilleur film en langue étrangère",
  Q6: "Oscar du meilleur réalisateur",
  Q7: "British Academy Film Award du meilleur scénario original",
  Q10: "Séoul",
  Q11: "Jeonju",
  Q12: "Goyang",
  Q13: "Busan",
};

describe("extraireFaits", () => {
  const f = extraireFaits(PARASITE, LIBELLES, "film");

  it("prix majeurs seulement, par priorité, sans déprécié ni libellé manquant", () => {
    expect(f.prix).toEqual([
      { libelle: "Oscar du meilleur film", annee: 2020 },
      { libelle: "Palme d'or", annee: 2019 },
      { libelle: "Golden Globe du meilleur film en langue étrangère", annee: 2020 },
      { libelle: "British Academy Film Award du meilleur scénario original", annee: 2020 },
    ]);
    expect(f.autresPrix).toBe(0);
  });
  it("lieux de tournage : trois au plus", () => {
    expect(f.tournage).toEqual(["Séoul", "Jeonju", "Goyang"]);
  });
  it("liens AlloCiné (film) et SensCritique", () => {
    expect(f.allocine).toBe("https://www.allocine.fr/film/fichefilm_gen_cfilm=255238.html");
    expect(f.senscritique).toBe("https://www.senscritique.com/film/-/25357970");
  });
  it("série : identifiant AlloCiné série (P1267)", () => {
    const s = extraireFaits({ P1267: [texte("3517")] }, {}, "serie");
    expect(s.allocine).toBe("https://www.allocine.fr/series/ficheserie_gen_cserie=3517.html");
  });
  it("au-delà de cinq prix : compte des autres, sans doublon de libellé", () => {
    const claims: Declarations = {
      P166: Array.from({ length: 8 }, (_, i) => entite(`Q${100 + i}`, annee(2010 + i))),
    };
    const libelles = Object.fromEntries(
      Array.from({ length: 8 }, (_, i) => [`Q${100 + i}`, i < 2 ? "Primetime Emmy Award de la meilleure série" : `Primetime Emmy Award n°${i}`])
    );
    const s = extraireFaits(claims, libelles, "serie");
    expect(s.prix).toHaveLength(5);
    expect(s.prix.filter((p) => p.libelle === "Primetime Emmy Award de la meilleure série")).toHaveLength(1);
    expect(s.autresPrix).toBe(2);
  });
  it("rien d'utile : vide", () => {
    expect(faitsVides(extraireFaits({}, {}, "film"))).toBe(true);
  });
  it("entités à libeller : œuvres adaptées, lieux, prix, sans doublon", () => {
    expect(entitesReferencees({ P144: [entite("Q9")], P915: [entite("Q10")], P166: [entite("Q1"), entite("Q1")] })).toEqual([
      "Q9",
      "Q10",
      "Q1",
    ]);
  });
});
