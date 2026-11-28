import { describe, expect, it, vi } from "vitest";

// unstable_cache n'existe qu'avec le runtime Next : on le neutralise
vi.mock("next/cache", () => ({ unstable_cache: (f: unknown) => f }));

import { type Declarations, entitesReferencees, extraireFaits, faitsVides, identiteTmdb, phraseOeuvreSource } from "./wikidata";

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
  it("entités à libeller : aussi les auteurs des œuvres adaptées", () => {
    expect(entitesReferencees({ P144: [entite("Q9")] }, { Q9: { P50: [entite("Q38337")] } })).toEqual(["Q9", "Q38337"]);
  });
  it("grand prix du Festival de Cannes (libellé Wikidata en minuscule)", () => {
    const s = extraireFaits({ P166: [entite("Q844804", annee(2019))] }, { Q844804: "grand prix du Festival de Cannes" }, "film");
    expect(s.prix).toEqual([{ libelle: "grand prix du Festival de Cannes", annee: 2019 }]);
  });
  it("UniFrance : films seulement", () => {
    expect(extraireFaits({ P3961: [texte("56620")] }, {}, "film").unifrance).toBe("https://www.unifrance.org/film/56620");
    expect(extraireFaits({ P3961: [texte("56620")] }, {}, "serie").unifrance).toBeNull();
    expect(faitsVides(extraireFaits({ P3961: [texte("56620")] }, {}, "film"))).toBe(false);
  });
});

describe("identiteTmdb", () => {
  it("confirme l'élément qui porte l'identifiant TMDB de la fiche (P4947 film, P4983 série)", () => {
    expect(identiteTmdb({ P4947: [texte("1309400")] }, "film", 1309400)).toBe("confirme");
    expect(identiteTmdb({ P4983: [texte("96677")] }, "serie", 96677)).toBe("confirme");
  });
  it("« autre » pour un élément d'une autre fiche TMDB", () => {
    expect(identiteTmdb({ P4947: [texte("42")] }, "film", 1309400)).toBe("autre");
  });
  it("« absent » sans identifiant TMDB (la BD Q109043201 donnée par TMDB pour Les Enfants de la Résistance)", () => {
    expect(identiteTmdb({ P50: [entite("Q1")] }, "film", 1309400)).toBe("absent");
    // Un identifiant de série ne vaut pas pour un film
    expect(identiteTmdb({ P4983: [texte("1309400")] }, "film", 1309400)).toBe("absent");
  });
});

// D'après Le Comte de Monte-Cristo (2024, Q119998666) → roman Q191838, relevé le 2026-11-28, raccourci
describe("œuvres adaptées", () => {
  const temps = (t: string) => ({ mainsnak: { datavalue: { value: { time: t } } } });
  const claims: Declarations = { P144: [entite("Q191838"), entite("Q99")] };
  const sources: Record<string, Declarations> = {
    Q191838: { P50: [entite("Q38337")], P577: [temps("+1846-01-01T00:00:00Z"), temps("+1844-08-28T00:00:00Z")], P268: [texte("119526826")] },
    Q99: {}, // personnage : ni auteur ni date
  };
  const libelles = { Q191838: "Le Comte de Monte-Cristo", Q38337: "Alexandre Dumas", Q99: "Edmond Dantès" };
  const f = extraireFaits(claims, libelles, "film", sources);

  it("auteur, première publication et identifiant BnF de l'œuvre écrite", () => {
    expect(f.adapteDe[0]).toEqual({ libelle: "Le Comte de Monte-Cristo", auteurs: ["Alexandre Dumas"], annee: 1844, bnf: "119526826" });
  });
  it("personnage : libellé seul", () => {
    expect(f.adapteDe[1]).toEqual({ libelle: "Edmond Dantès", auteurs: [], annee: null, bnf: null });
  });
  it("phrase : « d' » devant une voyelle, « de » sinon, auteurs joints", () => {
    expect(phraseOeuvreSource(f.adapteDe[0])).toBe("Le Comte de Monte-Cristo, d'Alexandre Dumas (1844)");
    expect(phraseOeuvreSource(f.adapteDe[1])).toBe("Edmond Dantès");
    expect(
      phraseOeuvreSource({ libelle: "Les Enfants de la Résistance", auteurs: ["Vincent Dugomier", "Benoît Ers"], annee: null, bnf: null })
    ).toBe("Les Enfants de la Résistance, de Vincent Dugomier et Benoît Ers");
  });
});
