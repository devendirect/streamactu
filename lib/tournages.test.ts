import { readFileSync } from "node:fs";
import path from "node:path";
import { brotliDecompressSync } from "node:zlib";
import { describe, expect, it } from "vitest";
import {
  arrondissement,
  construireIndex,
  libelleArrondissement,
  motsSocietes,
  nomVoie,
  titreSerieSansSaison,
  tournagesFilm,
  tournagesSerie,
  type FichierTournages,
} from "./tournages";

type Ligne = [titre: string, type: string, annee: number, realisation: string, production: string, adresse: string, ardt: string];

/** Petit fichier au format de scripts/import-tournages-paris.mjs */
function fichier(lignes: Ligne[]): FichierTournages {
  const types = [...new Set(lignes.map((l) => l[1]))];
  return {
    source: { jeu: "", page: "", licence: "ODbL", maj: "2026-10-05", importeLe: "2026-11-28" },
    types,
    titre: lignes.map((l) => l[0]),
    type: lignes.map((l) => types.indexOf(l[1])),
    annee: lignes.map((l) => l[2]),
    realisation: lignes.map((l) => l[3]),
    production: lignes.map((l) => l[4]),
    adresse: lignes.map((l) => l[5]),
    ardt: lignes.map((l) => l[6]),
  };
}

// Inspiré des lignes réelles de la Ville de Paris
const INDEX = construireIndex(
  fichier([
    ["Emily in Paris", "Série TV", 2019, "Darren Star", "NW2020", "place de l'estrapade, 75005 paris", "75005"],
    ["EMILY IN PARIS SAISON 4", "Série TV", 2024, "ANDREW FLEMING, ERIN EHRLICH", "EIPS4", "12 rue de l'abbé grégoire, 75006 paris", "75006"],
    ["EMILY IN PARIS SAISON 4", "Série TV", 2024, "ANDREW FLEMING, ERIN EHRLICH", "EIPS4", "3 place de l'estrapade, 75005 paris", "75005"],
    ["LUPIN SAISON 2 PARTIE 4", "Série TV", 2025, "Everardo GOUT", "GAUMONT PRODUCTION TÉLÉVISION", "quai de conti, 75006 paris", "75006"],
    ["Plan B", "Série TV", 2020, "Christophe CAMPOS", "GAUMONT PRODUCTION TÉLÉVISION", "rue de rivoli, 75004 paris", "75004"],
    ["NOTRE DAME BRULE", "Long métrage", 2021, "Jean-Jacques ANNAUD", "PATHE", "parvis notre-dame - place jean-paul ii, 75004 paris", "75004"],
    ["NOTRE DAME BRULE", "Long métrage", 2021, "Jean-Jacques ANNAUD", "PATHE", "88  BOULEVARD  DE PICPUS", "75012"],
    ["The Escape", "Long métrage", 2016, "DOMINIC SAVAGE", "X", "rue de la paix, 75002 paris", "75002"],
    ["The Escape", "Court métrage", 2016, "DOMINIC SAVAGE", "X", "rue de la paix, 75002 paris", "75002"],
    ["CURIOSA", "Long métrage", 2017, "Lou JEUNET", "CURIOSA FILMS", "19b quai de bourbon, 75004 paris", "75004"],
    ["CURIOSA", "Long métrage", 2017, "", "CURIOSA FILMS", "rue de galliera, 75116 paris", "75116"],
    ["CURIOSA", "Long métrage", 2017, "Autre Réalisatrice", "AUTRE", "rue de la paix, 75002 paris", "75002"],
  ])
);

describe("outils", () => {
  it("retire saison, partie, bloc et épisodes des titres de série", () => {
    expect(titreSerieSansSaison("emily in paris saison 4")).toBe("emily in paris");
    expect(titreSerieSansSaison("lupin saison 2 partie 4")).toBe("lupin");
    expect(titreSerieSansSaison("candice renoir saison 7 ep 62 63 64")).toBe("candice renoir");
    expect(titreSerieSansSaison("lace s1 equipe b")).toBe("lace");
    expect(titreSerieSansSaison("plan b")).toBe("plan b");
  });

  it("donne le nom de voie sans numéro, avec les majuscules", () => {
    expect(nomVoie("45 avenue de flandre, 75019 paris")).toBe("Avenue de Flandre");
    expect(nomVoie("12 bis rue de l'abbé grégoire, 75006 paris")).toBe("Rue de l'Abbé Grégoire");
    expect(nomVoie("88  BOULEVARD  DE PICPUS")).toBe("Boulevard de Picpus");
    expect(nomVoie("pont de grenelle-cadets de saumur, 75015 paris")).toBe("Pont de Grenelle-Cadets de Saumur");
    expect(nomVoie("10 rue de l' amiral hamelin, 75116 paris")).toBe("Rue de l'Amiral Hamelin");
    expect(nomVoie("Bois* de Boulogne")).toBe("Bois de Boulogne");
    expect(nomVoie("parvis notre-dame - place jean-paul ii, 75004 paris")).toBe("Parvis Notre-Dame");
    expect(nomVoie("place jean-paul ii, 75004 paris")).toBe("Place Jean-Paul II");
    expect(nomVoie("rue louis xiv")).toBe("Rue Louis XIV");
    expect(nomVoie("75019")).toBeNull();
  });

  it("lit les arrondissements", () => {
    expect(arrondissement("75019")).toBe(19);
    expect(arrondissement("75116")).toBe(16);
    expect(arrondissement("93200")).toBeNull();
    expect(libelleArrondissement(1)).toBe("1er");
    expect(libelleArrondissement(16)).toBe("16e");
  });

  it("garde les mots distinctifs des sociétés", () => {
    expect([...motsSocietes("GAUMONT PRODUCTION TÉLÉVISION")]).toEqual(["gaumont"]);
    expect([...motsSocietes("Mon Voisin Productions, France Télévisions")]).toEqual(["voisin", "televisions"]);
  });
});

describe("séries", () => {
  const emily = { titre: "Emily in Paris", anneeDebut: 2020, anneeFin: 2025, createurs: ["Darren Star"], societes: ["Jax Media"] };

  it("regroupe toutes les saisons d'Emily in Paris, confirmées par le créateur", () => {
    expect(tournagesSerie(INDEX, emily, 2026)).toEqual({
      arrondissements: [5, 6],
      anneeMin: 2019,
      anneeMax: 2024,
      lieux: ["Place de l'Estrapade", "Rue de l'Abbé Grégoire"],
      nbLieux: 3,
    });
  });

  it("confirme Lupin par la société de production (Gaumont)", () => {
    const v = tournagesSerie(INDEX, { titre: "Lupin", anneeDebut: 2021, createurs: ["George Kay"], societes: ["Gaumont"] }, 2026);
    expect(v?.arrondissements).toEqual([6]);
  });

  it("refuse un homonyme sans créateur ni société en commun (Plan B canadien)", () => {
    expect(
      tournagesSerie(INDEX, { titre: "Plan B", anneeDebut: 2017, anneeFin: 2023, createurs: ["Jean-François Asselin"], societes: ["KO24"] }, 2026)
    ).toBeNull();
  });

  it("refuse des tournages hors de la période de diffusion", () => {
    expect(tournagesSerie(INDEX, { ...emily, anneeDebut: 2010, anneeFin: 2012 }, 2026)).toBeNull();
  });
});

describe("films", () => {
  it("retrouve un film par titre, années et réalisateur", () => {
    const v = tournagesFilm(INDEX, { titre: "Notre-Dame brûle", annees: [2022], realisateurs: ["Jean-Jacques Annaud"] });
    expect(v).toMatchObject({ arrondissements: [4, 12], anneeMin: 2021, nbLieux: 2 });
    expect(v?.lieux).toContain("Boulevard de Picpus");
  });

  it("refuse sans réalisateur commun, ou un tournage trop ancien", () => {
    expect(tournagesFilm(INDEX, { titre: "Notre-Dame brûle", annees: [2022], realisateurs: ["Autre Personne"] })).toBeNull();
    expect(tournagesFilm(INDEX, { titre: "Notre-Dame brûle", annees: [2030], realisateurs: ["Jean-Jacques Annaud"] })).toBeNull();
  });

  it("garde les lignes sans réalisateur une fois le film confirmé, jamais celles d'un autre réalisateur (Curiosa)", () => {
    const v = tournagesFilm(INDEX, { titre: "Curiosa", annees: [2019], realisateurs: ["Lou Jeunet"] });
    expect(v?.arrondissements).toEqual([4, 16]);
  });

  it("ignore les courts métrages", () => {
    expect(tournagesFilm(INDEX, { titre: "The Escape", annees: [2017], realisateurs: ["Dominic Savage"] })?.nbLieux).toBe(1);
  });

  it("ne cherche pas un film parmi les séries", () => {
    expect(tournagesFilm(INDEX, { titre: "Lupin", annees: [2025], realisateurs: ["Everardo Gout"] })).toBeNull();
  });
});

// Fiches réelles sur le vrai fichier importé ; données TMDB relevées le 2026-11-28
describe("fichier importé", () => {
  const brut = readFileSync(path.join(__dirname, "..", "data", "publiques", "tournages-paris.json.br"));
  const vrai = construireIndex(JSON.parse(brotliDecompressSync(brut).toString("utf-8")) as FichierTournages);

  it.each([
    ["Emily in Paris", 2020, 2025, ["Darren Star"], ["MTV Entertainment Studios", "Jax Media", "Darren Star Productions"]],
    ["Lupin", 2021, 2026, ["George Kay", "François Uzan"], ["Gaumont", "Carrousel Studios"]],
    ["Dix pour cent", 2015, 2020, ["Dominique Besnehard", "Fanny Herrero"], ["France Télévisions", "Mon Voisin Productions"]],
  ] as const)("série %s : tournages trouvés", (titre, anneeDebut, anneeFin, createurs, societes) => {
    const v = tournagesSerie(vrai, { titre, anneeDebut, anneeFin, createurs: [...createurs], societes: [...societes] }, 2026);
    expect(v?.nbLieux).toBeGreaterThan(20);
  });

  it("The Crown : société de service locale, rien de sûr, rien d'affiché", () => {
    expect(
      tournagesSerie(vrai, { titre: "The Crown", anneeDebut: 2016, anneeFin: 2023, createurs: ["Peter Morgan"], societes: ["Left Bank Pictures"] }, 2026)
    ).toBeNull();
  });

  it.each([
    ["Notre-Dame brûle", [2022, 2022], ["Jean-Jacques Annaud"]],
    ["Tout simplement noir", [2020, 2020], ["John Wax", "Jean-Pascal Zadi"]],
    ["Le Redoutable", [2017, 2017], ["Michel Hazanavicius"]],
    ["Stella est amoureuse", [2022, 2022], ["Sylvie Verheyde"]],
    ["Murder Mystery 2", [2023], ["Jeremy Garelick"]],
  ] as const)("film %s : tournages trouvés", (titre, annees, realisateurs) => {
    expect(tournagesFilm(vrai, { titre, annees: [...annees], realisateurs: [...realisateurs] })?.nbLieux).toBeGreaterThan(5);
  });
});
