import { readFileSync } from "node:fs";
import path from "node:path";
import { brotliDecompressSync } from "node:zlib";
import { describe, expect, it } from "vitest";
import { construireIndex, formatMillions, phraseEntrees, titreCnc, trouverEntrees, type FichierEntrees } from "./entrees";

/** Petit fichier au format de scripts/import-entrees-cnc.mjs */
function fichier(lignes: [titre: string, sortie: string, annee: number, entrees: number][]): FichierEntrees {
  return {
    source: { jeu: "", page: "", licence: "", maj: "2026-05-13", importeLe: "2026-11-28" },
    titre: lignes.map((l) => l[0]),
    sortie: lignes.map((l) => l[1]),
    annee: lignes.map((l) => l[2]),
    entrees: lignes.map((l) => l[3]),
    nationalite: lignes.map(() => ""),
  };
}

// Lignes recopiées du fichier du CNC (mise à jour du 13/05/2026)
const INDEX = construireIndex(
  fichier([
    ["UN P'TIT TRUC EN PLUS", "2024-05-01", 2024, 10716771],
    ["AVATAR : LA VOIE DE L'EAU", "2022-12-14", 2022, 7906710],
    ["AVATAR : LA VOIE DE L'EAU", "2022-12-14", 2023, 5219000],
    ["MINIONS (LES)", "2015-07-08", 2015, 6655855],
    ["STAR WARS : EPISODE 7, LE REVEIL DE LA FORCE", "2015-12-16", 2015, 7327435],
    ["AGE DE GLACE 4 : LA DERIVE DES CONTINENTS (LA)", "2012-06-27", 2012, 6635367],
    ["TAKEN 2", "2012-10-03", 2012, 2500000],
    ["TAKEN 3", "2015-01-21", 2015, 1600000],
  ])
);

describe("titreCnc", () => {
  it("remet l'article rejeté en tête", () => {
    expect(titreCnc("MINIONS (LES)")).toBe("les minions");
    expect(titreCnc("HOBBIT : UN VOYAGE INATTENDU (LE)")).toBe("le hobbit un voyage inattendu");
    expect(titreCnc("ARNACOEUR (L')")).toBe("l arnacoeur");
    expect(titreCnc("TAKEN 2")).toBe("taken 2");
  });
});

describe("trouverEntrees", () => {
  it("retrouve un film par son titre et sa sortie en salle", () => {
    expect(trouverEntrees(INDEX, { titre: "Un p'tit truc en plus", sortieSalleFR: "2024-05-01" })).toEqual({
      total: 10716771,
      parAnnee: [{ annee: 2024, entrees: 10716771 }],
    });
  });

  it("additionne les années d'un film sorti en fin d'année (Avatar 2)", () => {
    const e = trouverEntrees(INDEX, { titre: "Avatar : La Voie de l'eau", sortieSalleFR: "2022-12-14" });
    expect(e?.total).toBe(13125710);
    expect(e?.parAnnee.map((a) => a.annee)).toEqual([2022, 2023]);
  });

  it("accepte un titre CNC plus long si la sortie est le même jour (Star Wars 7, L'Âge de glace 4)", () => {
    expect(trouverEntrees(INDEX, { titre: "Star Wars : Le Réveil de la Force", sortieSalleFR: "2015-12-16" })?.total).toBe(7327435);
    expect(trouverEntrees(INDEX, { titre: "L'Âge de glace 4 : La Dérive des continents", sortieSalleFR: "2012-06-27" })?.total).toBe(
      6635367
    );
  });

  it("refuse un titre proche à une autre date, et un titre identique trop loin", () => {
    expect(trouverEntrees(INDEX, { titre: "Star Wars : Le Réveil de la Force", sortieSalleFR: "2015-12-25" })).toBeNull();
    expect(trouverEntrees(INDEX, { titre: "Les Minions", sortieSalleFR: "2015-09-01" })).toBeNull();
  });

  it("ne confond pas deux suites (Taken 2 et Taken 3)", () => {
    expect(trouverEntrees(INDEX, { titre: "Taken 3", sortieSalleFR: "2015-01-21" })?.total).toBe(1600000);
  });

  it("ne renvoie rien sans aucune date", () => {
    expect(trouverEntrees(INDEX, { titre: "Taken 2" })).toBeNull();
  });

  it("sans date française, se replie sur la date générale : titre identique et 7 jours près seulement", () => {
    expect(trouverEntrees(INDEX, { titre: "Taken 2", sortie: "2012-09-28" })?.total).toBe(2500000);
    expect(trouverEntrees(INDEX, { titre: "Taken 2", sortie: "2012-09-20" })).toBeNull();
    expect(trouverEntrees(INDEX, { titre: "Star Wars : Le Réveil de la Force", sortie: "2015-12-16" })).toBeNull();
  });
});

describe("formulation", () => {
  it("arrondit au dixième de million, avec l'accord", () => {
    expect(formatMillions(10716771)).toBe("10,7 millions");
    expect(formatMillions(1002502)).toBe("1 million");
    expect(formatMillions(1054000)).toBe("1,1 million");
    expect(formatMillions(1960000)).toBe("2 millions");
  });

  it("donne toujours les années comptées", () => {
    expect(phraseEntrees({ total: 10716771, parAnnee: [{ annee: 2024, entrees: 10716771 }] })).toBe(
      "10,7 millions d'entrées en 2024"
    );
    expect(
      phraseEntrees({
        total: 13125710,
        parAnnee: [
          { annee: 2022, entrees: 7906710 },
          { annee: 2023, entrees: 5219000 },
        ],
      })
    ).toBe("13,1 millions d'entrées en 2022 et 2023");
    expect(
      phraseEntrees({
        total: 3_000_000,
        parAnnee: [
          { annee: 2009, entrees: 1_000_000 },
          { annee: 2010, entrees: 1_000_000 },
          { annee: 2011, entrees: 1_000_000 },
        ],
      })
    ).toBe("3 millions d'entrées de 2009 à 2011");
  });
});

// Fiches témoins sur le vrai fichier ; dates de sortie en France relevées sur TMDB le 2026-11-28
describe("fichier importé", () => {
  const brut = readFileSync(path.join(__dirname, "..", "data", "publiques", "entrees-cnc.json.br"));
  const vrai = construireIndex(JSON.parse(brotliDecompressSync(brut).toString("utf-8")) as FichierEntrees);

  it.each([
    ["Un p'tit truc en plus", "2024-05-01", 10716771],
    ["Le Comte de Monte-Cristo", "2024-06-28", 9388552],
  ] as const)("%s", (titre, sortieSalleFR, total) => {
    expect(trouverEntrees(vrai, { titre, sortieSalleFR })?.total).toBe(total);
  });

  it("Météors : moins d'un million, absent, rien", () => {
    expect(trouverEntrees(vrai, { titre: "Météors", sortieSalleFR: "2025-10-08" })).toBeNull();
  });
});
