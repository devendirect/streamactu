import { readFileSync } from "node:fs";
import path from "node:path";
import { brotliDecompressSync } from "node:zlib";
import { describe, expect, it } from "vitest";
import { ancre, grouperParRegion, nbTitresLocalises, type FichierTournagesFrance, type LieuTournage, type TitreTournage } from "./lieux-tournage";

const lieu = (nom: string, region: string | null, commune?: [string, string]): LieuTournage => ({
  nom,
  coord: null,
  commune: commune ? { id: commune[0], nom: commune[1], coord: [5.37, 43.3] } : null,
  region,
});
const LIEUX: Record<string, LieuTournage> = {
  Q23482: lieu("Marseille", "Provence-Alpes-Côte d'Azur", ["Q23482", "Marseille"]),
  Q1: lieu("Vieux-Port de Marseille", "Provence-Alpes-Côte d'Azur", ["Q23482", "Marseille"]),
  Q33959: lieu("Nice", "Provence-Alpes-Côte d'Azur", ["Q33959", "Nice"]),
  Q2: lieu("Massif des Calanques", "Provence-Alpes-Côte d'Azur"),
  Q456: lieu("Lyon", "Auvergne-Rhône-Alpes", ["Q456", "Lyon"]),
  Q17070: lieu("La Réunion", "La Réunion"),
  Q142: lieu("France", null),
};
const t = (id: number, votes: number, lieux: string[], type: "film" | "serie" = "film"): TitreTournage => ({
  type,
  id,
  titre: `Titre ${id}`,
  annee: 2020,
  votes,
  lieux,
});
const TITRES = [
  t(1, 500, ["Q23482"]),
  t(2, 900, ["Q1", "Q456"]),
  t(3, 100, ["Q23482", "Q2"]),
  t(4, 50, ["Q33959"]),
  t(5, 70, ["Q2"]),
  t(6, 10, ["Q17070"], "serie"),
  t(7, 5, ["Q142"]),
];

describe("grouperParRegion", () => {
  const r = grouperParRegion(TITRES, LIEUX);

  it("classe les régions par nombre de titres, l'outre-mer à la fin", () => {
    expect(r.map((x) => [x.region, x.nbTitres])).toEqual([
      ["Provence-Alpes-Côte d'Azur", 5],
      ["Auvergne-Rhône-Alpes", 1],
      ["La Réunion", 1],
    ]);
    expect(r.at(-1)?.outreMer).toBe(true);
  });

  it("une commune a sa liste à partir de 3 titres, triée par nombre de votes, sans doublon par lieu", () => {
    const paca = r[0];
    expect(paca.communes.map((c) => [c.nom, c.titres.map((x) => x.id)])).toEqual([["Marseille", [2, 1, 3]]]);
  });

  it("les autres titres de la région, avec le nom de leurs lieux, sans répéter ceux d'une grande commune", () => {
    expect(r[0].autres.map((x) => [x.id, x.ou])).toEqual([
      [5, ["Massif des Calanques"]],
      [4, ["Nice"]],
    ]);
  });

  it("un titre tourné dans deux régions apparaît dans les deux", () => {
    expect(r[1].autres.map((x) => x.id)).toEqual([2]);
  });

  it("un lieu sans région (« France ») n'est rattaché à aucune région", () => {
    expect(r.flatMap((x) => [...x.communes.flatMap((c) => c.titres), ...x.autres]).some((x) => x.id === 7)).toBe(false);
    expect(nbTitresLocalises(TITRES, LIEUX)).toBe(6);
  });

  it("seuil réglable", () => {
    expect(grouperParRegion(TITRES, LIEUX, 1)[0].communes.map((c) => c.nom)).toEqual(["Marseille", "Nice"]);
  });
});

describe("ancre", () => {
  it("sans accents ni apostrophes", () => {
    expect(ancre("Provence-Alpes-Côte d'Azur")).toBe("provence-alpes-cote-d-azur");
    expect(ancre("Île-de-France")).toBe("ile-de-france");
  });
});

describe("fichier importé", () => {
  const brut = readFileSync(path.join(__dirname, "..", "data", "publiques", "tournages-france.json.br"));
  const f = JSON.parse(brotliDecompressSync(brut).toString("utf-8")) as FichierTournagesFrance;
  const r = grouperParRegion(f.titres, f.lieux);

  it("Paris en tête de l'Île-de-France, Marseille en tête de Provence-Alpes-Côte d'Azur", () => {
    expect(r[0].region).toBe("Île-de-France");
    expect(r[0].communes[0].nom).toBe("Paris");
    expect(r.find((x) => x.region === "Provence-Alpes-Côte d'Azur")?.communes[0].nom).toBe("Marseille");
  });

  it("chaque lieu cité par un titre existe dans le fichier", () => {
    for (const t of f.titres) for (const q of t.lieux) expect(f.lieux[q], `${t.titre} ${q}`).toBeDefined();
  });
});
