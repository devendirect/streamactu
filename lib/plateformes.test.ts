import { readFileSync } from "node:fs";
import { describe, it, expect } from "vitest";
import { ARCOM_REFERENCEMENT, ARCOM_VERIFIE_LE, PLATEFORMES, filtreFournisseurs, plateformesDepuisFournisseurs } from "./plateformes";

describe("référencement Arcom", () => {
  it("chaque plateforme suivie a été vérifiée sur le portail de l'Arcom", () => {
    // Une plateforme ajoutée au site doit d'abord être cherchée dans la liste de l'Arcom
    for (const pf of PLATEFORMES) expect(ARCOM_REFERENCEMENT[pf.id], pf.nom).toBeDefined();
  });
  it("vérification de moins de 6 mois (à refaire sur le portail, puis changer la date)", () => {
    const ageJours = (Date.now() - Date.parse(`${ARCOM_VERIFIE_LE}T12:00:00Z`)) / 86400000;
    expect(ageJours).toBeLessThan(183);
  });
});

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
