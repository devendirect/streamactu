import { describe, expect, it } from "vitest";
import { decalageHeure, etatNouvelAn, partiesParis, texteRestant } from "./nouvelan";

// Paris est à UTC+1 en hiver : 23:00 UTC = minuit à Paris
const utc = (iso: string) => new Date(iso);

describe("heure de Paris", () => {
  it("lit la date et l'heure vues de Paris", () => {
    expect(partiesParis(utc("2026-12-31T22:30:15Z"))).toEqual({ y: 2026, m: 12, j: 31, h: 23, mi: 30, s: 15 });
    expect(partiesParis(utc("2026-12-31T23:00:00Z"))).toEqual({ y: 2027, m: 1, j: 1, h: 0, mi: 0, s: 0 });
  });
});

describe("compte à rebours du Nouvel An", () => {
  it("décompte jusqu'à minuit à Paris", () => {
    expect(etatNouvelAn(utc("2026-12-31T22:00:00Z"))).toEqual({ phase: "avant", annee: 2027, restant: 3600 });
    expect(etatNouvelAn(utc("2026-12-31T22:59:59Z"))).toEqual({ phase: "avant", annee: 2027, restant: 1 });
    // le 30 décembre à 12:00 à Paris : un jour et demi
    expect(etatNouvelAn(utc("2026-12-30T11:00:00Z")).restant).toBe(129600);
  });

  it("bascule pile à minuit à Paris, pas à minuit UTC", () => {
    expect(etatNouvelAn(utc("2026-12-31T22:59:59Z")).phase).toBe("avant");
    expect(etatNouvelAn(utc("2026-12-31T23:00:00Z"))).toEqual({ phase: "apres", annee: 2027, restant: 0 });
    expect(etatNouvelAn(utc("2027-01-02T10:00:00Z")).phase).toBe("apres");
  });
});

describe("texte du compte à rebours", () => {
  it("garde la plus grande unité sans zéro devant", () => {
    expect(texteRestant(129600)).toBe("1 j 12 h 00 min 00 s");
    expect(texteRestant(18765)).toBe("5 h 12 min 45 s");
    expect(texteRestant(765)).toBe("12 min 45 s");
    expect(texteRestant(45)).toBe("45 s");
    expect(texteRestant(0)).toBe("0 s");
  });
});

describe("aperçu ?heure=", () => {
  const maintenant = Date.parse("2026-11-22T11:00:00Z");
  it("sans paramètre : pas de décalage", () => {
    expect(decalageHeure("", maintenant)).toBe(0);
    expect(decalageHeure("?saison=nouvelan", maintenant)).toBe(0);
  });
  it("une heure de Paris sans décalage est lue en heure d'hiver (+01:00)", () => {
    const d = decalageHeure("?saison=nouvelan&heure=2026-12-31T23:59:30", maintenant);
    expect(new Date(maintenant + d).toISOString()).toBe("2026-12-31T22:59:30.000Z");
  });
  it("accepte un décalage explicite et ignore une valeur invalide", () => {
    expect(new Date(maintenant + decalageHeure("?heure=2026-12-31T22:59:30Z", maintenant)).toISOString()).toBe("2026-12-31T22:59:30.000Z");
    expect(decalageHeure("?heure=n-importe-quoi", maintenant)).toBe(0);
  });
});
