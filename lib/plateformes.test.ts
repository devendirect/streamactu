import { readFileSync } from "node:fs";
import { describe, it, expect } from "vitest";
import { PLATEFORMES, filtreFournisseurs, plateformesDepuisFournisseurs } from "./plateformes";

describe("filtreFournisseurs", () => {
  it("interroge les deux identifiants de Paramount+", () => {
    expect(filtreFournisseurs(582)).toBe("582|531");
    expect(filtreFournisseurs(8)).toBe("8");
    expect(filtreFournisseurs([8, 582])).toBe("8|582|531");
  });
});

describe("plateformesDepuisFournisseurs", () => {
  it("reconnaît les variantes, sans doublon, dans l'ordre", () => {
    const pf = plateformesDepuisFournisseurs(["Netflix", "Netflix Standard with Ads", "HBO Max Amazon Channel", "Paramount Plus"]);
    expect(pf.map((p) => p.slug)).toEqual(["netflix", "hbo-max", "paramount-plus"]);
  });
  it("ignore les chaînes qui contiennent « Max » sans être HBO Max", () => {
    expect(plateformesDepuisFournisseurs(["Action Max Amazon Channel", "TFOU Max Amazon Channel", "Premiere Max"])).toEqual([]);
  });
});

describe("filtre « Mes abonnements » des guides d'ordre", () => {
  it("a ses règles CSS pour chaque plateforme suivie", () => {
    const css = readFileSync("app/globals.css", "utf8");
    for (const p of PLATEFORMES) {
      expect(css, p.nom).toContain(`[data-abo-${p.id}] [data-ligne~="${p.id}"] { opacity: 1; }`);
      expect(css, p.nom).toContain(`[data-abo-${p.id}] [data-pf="${p.id}"]`);
    }
  });
});
