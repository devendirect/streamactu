import { readFileSync } from "node:fs";
import path from "node:path";
import { brotliDecompressSync } from "node:zlib";
import { describe, expect, it } from "vitest";
import {
  construireIndex,
  libelleDecision,
  motsRealisation,
  normaliser,
  trouverVisa,
  variantesTitreCnc,
  type FichierVisas,
} from "./visas";

/** Petit fichier au format de scripts/import-visas-cnc.mjs */
function fichier(lignes: [string, number | null, string, number, string][]): FichierVisas {
  const decisions = [...new Set(lignes.map((l) => l[4]))];
  return {
    source: { jeu: "", page: "", licence: "", maj: "2025-11-13", importeLe: "2026-11-28" },
    decisions,
    titre: lignes.map((l) => l[0]),
    annee: lignes.map((l) => l[1]),
    realisation: lignes.map((l) => l[2]),
    visa: lignes.map((l) => l[3]),
    decision: lignes.map((l) => decisions.indexOf(l[4])),
  };
}

// Lignes recopiées du fichier du CNC (mise à jour du 13/11/2025)
const INDEX = construireIndex(
  fichier([
    ["Parasite", 1982, "Charles Band", 56169, "Interdit -13 ans"],
    ["Parasite. Gisaengchung", 2019, "Bong Joon-Ho", 150985, "Avertissement"],
    ["Iron man", 2008, "Jon Favreau", 119820, "Tout public"],
    ["Iron man 2", 2010, "John Favreau", 125467, "Tout public"],
    ["Le comte de Monte-Cristo", null, "Claude Autant-Lara", 24039, "Tout public"],
    ["Le comte de Monte-Cristo", 2024, "Alexandre De La Patellière - Matthieu Delaporte", 158738, "Tout public"],
    ["Un p'tit truc en plus (ex. Un petit truc en plus)", 2024, "Victor-Artus Solaro (alias Artus)", 157339, "Tout public"],
    ["Les rivières pourpres", 2000, "Mathieu Kassovitz", 97248, "Interdit -12 ans"],
    ["Double", 2001, "Jean Martin", 1, "Interdit -16 ans - Interdit -12 ans"],
    ["Jumeaux", 1990, "Paul Durand", 2, "Tout public"],
    ["Jumeaux", 1991, "Pierre Durand", 3, "Tout public"],
    ["Sans date", null, "Anne Leblanc", 4, "Tout public"],
  ])
);

describe("normalisation", () => {
  it("retire accents, ponctuation et casse", () => {
    expect(normaliser("Avengers : L'ère d'Ultron")).toBe("avengers l ere d ultron");
    expect(normaliser("Cœur")).toBe("coeur");
  });

  it("réduit les ordinaux (« Le parrain : 2ème partie » au CNC, « Le Parrain, 2e partie » chez TMDB)", () => {
    expect(normaliser("Le parrain : 2ème partie")).toBe("le parrain 2 partie");
    expect(normaliser("Le Parrain, 2e partie")).toBe("le parrain 2 partie");
    expect(normaliser("1er de cordée")).toBe("1 de cordee");
    expect(normaliser("Kalki 2898-AD")).toBe("kalki 2898 ad");
  });

  it("donne le titre français, le titre original et la version sans parenthèses", () => {
    expect(variantesTitreCnc("Parasite. Gisaengchung")).toEqual(
      expect.arrayContaining(["parasite gisaengchung", "parasite", "gisaengchung"])
    );
    expect(variantesTitreCnc("Un p'tit truc en plus (ex. Un petit truc en plus)")).toContain("un p tit truc en plus");
  });

  it("garde les pseudonymes et écarte les particules", () => {
    expect([...motsRealisation("Victor-Artus Solaro (alias Artus)")].sort()).toEqual(["artus", "solaro", "victor"]);
    expect(motsRealisation("Gus Van Sant").has("van")).toBe(false);
  });
});

describe("libelleDecision", () => {
  it("traduit les décisions simples", () => {
    expect(libelleDecision("Tout public")).toBe("Tous publics");
    expect(libelleDecision("Interdit -12 ans")).toBe("Interdit aux moins de 12 ans");
    expect(libelleDecision("Avertissement")).toBe("Tous publics, avec avertissement");
  });

  it("n'interprète ni les décisions combinées ni la censure", () => {
    expect(libelleDecision("Interdit -16 ans - Interdit -12 ans")).toBeNull();
    expect(libelleDecision("Censure")).toBeNull();
  });
});

describe("trouverVisa", () => {
  it("départage des homonymes par l'année et le réalisateur (Parasite)", () => {
    const v = trouverVisa(INDEX, {
      titre: "Parasite",
      titreOriginal: "기생충",
      annees: [2019],
      realisateurs: ["Bong Joon Ho"],
    });
    expect(v).toEqual({ numero: 150985, annee: 2019, classification: "Tous publics, avec avertissement" });
  });

  it("corrige la classification TMDB (Iron Man : 12 chez TMDB, tous publics au CNC)", () => {
    expect(trouverVisa(INDEX, { titre: "Iron Man", annees: [2008], realisateurs: ["Jon Favreau"] })?.numero).toBe(119820);
  });

  it("accepte un an d'écart (sortie à l'étranger l'année précédente)", () => {
    expect(trouverVisa(INDEX, { titre: "Les Rivières pourpres", annees: [1999], realisateurs: ["Mathieu Kassovitz"] })?.numero).toBe(
      97248
    );
  });

  it("refuse au-delà d'un an d'écart", () => {
    expect(trouverVisa(INDEX, { titre: "Les Rivières pourpres", annees: [2003], realisateurs: ["Mathieu Kassovitz"] })).toBeNull();
  });

  it("ne confond pas un remake avec l'ancienne version sans date (Monte-Cristo 2024)", () => {
    const v = trouverVisa(INDEX, {
      titre: "Le Comte de Monte-Cristo",
      annees: [2024],
      realisateurs: ["Matthieu Delaporte", "Alexandre de La Patellière"],
    });
    expect(v?.numero).toBe(158738);
  });

  it("retrouve un titre sous son ancien nom et son pseudonyme (Un p'tit truc en plus, Artus)", () => {
    expect(trouverVisa(INDEX, { titre: "Un p'tit truc en plus", annees: [2024], realisateurs: ["Artus"] })?.numero).toBe(157339);
  });

  it("accepte une ligne sans année si le réalisateur concorde", () => {
    expect(trouverVisa(INDEX, { titre: "Sans date", annees: [1950], realisateurs: ["Anne Leblanc"] })?.numero).toBe(4);
  });

  it("refuse sans réalisateur concordant", () => {
    expect(trouverVisa(INDEX, { titre: "Iron Man", annees: [2008], realisateurs: ["Quelqu'un d'autre"] })).toBeNull();
  });

  it("sans réalisateur côté TMDB, se contente de l'année mais refuse les doublons", () => {
    expect(trouverVisa(INDEX, { titre: "Iron Man", annees: [2008], realisateurs: [] })?.numero).toBe(119820);
    expect(trouverVisa(INDEX, { titre: "Jumeaux", annees: [1990], realisateurs: [] })).toBeNull();
  });

  it("garde le visa sans classification quand la décision est combinée", () => {
    expect(trouverVisa(INDEX, { titre: "Double", annees: [2001], realisateurs: ["Jean Martin"] })).toEqual({
      numero: 1,
      annee: 2001,
      classification: null,
    });
  });

  it("ne renvoie rien pour un film absent", () => {
    expect(trouverVisa(INDEX, { titre: "Météors", annees: [2025], realisateurs: ["Hubert Charuel"] })).toBeNull();
  });
});

// Fiches témoins de docs/seo-geo/plan-donnees-publiques.md, sur le vrai fichier
// importé. Les réalisateurs sont ceux de TMDB (relevés le 2026-11-28).
describe("fichier importé (fiches témoins)", () => {
  const brut = readFileSync(path.join(__dirname, "..", "data", "publiques", "visas-cnc.json.br"));
  const vrai = construireIndex(JSON.parse(brotliDecompressSync(brut).toString("utf-8")) as FichierVisas);

  it.each([
    ["Parasite", "기생충", [2019], ["Bong Joon-ho"], 150985],
    ["Iron Man", undefined, [2008], ["Jon Favreau"], 119820],
    ["Le Parrain, 2e partie", "The Godfather Part II", [1974, 1975], ["Francis Ford Coppola"], 43950],
    // Ancien titre français au CNC : retrouvé par le titre original et la sortie en France (1948)
    ["La Maison du docteur Edwardes", "Spellbound", [1945, 1948], ["Alfred Hitchcock"], 5212],
    ["Un p'tit truc en plus", undefined, [2024], ["Artus"], 157339],
    ["Le Comte de Monte-Cristo", undefined, [2024], ["Matthieu Delaporte", "Alexandre de La Patellière"], 158738],
  ] as const)("%s → visa %i", (titre, titreOriginal, annees, realisateurs, numero) => {
    expect(trouverVisa(vrai, { titre, titreOriginal, annees: [...annees], realisateurs: [...realisateurs] })?.numero).toBe(numero);
  });

  it.each([
    ["Météors", [2025], ["Hubert Charuel"]],
    ["La Maison des Femmes", [2026], ["Mélisa Godet"]],
    ["Les Enfants de la Résistance", [2026], ["Christophe Barratier"]],
  ] as const)("%s : absent du fichier, rien", (titre, annees, realisateurs) => {
    expect(trouverVisa(vrai, { titre, annees: [...annees], realisateurs: [...realisateurs] })).toBeNull();
  });
});
