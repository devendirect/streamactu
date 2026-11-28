import { describe, expect, it } from "vitest";
import { comparer, jourParis, moinsMois } from "./releve-logique.mjs";

const set = (...ids) => new Set(ids);
const attente = (entrees) => new Map(entrees);

describe("comparer", () => {
  it("un titre nouveau est mis en attente, pas encore annoncé", () => {
    const r = comparer({ confirmes: set(1, 2), attente: new Map(), releve: set(1, 2, 3), aujourdhui: "2026-12-02" });
    expect(r.evenements).toEqual([]);
    expect(r.attente.get(3)).toEqual({ changement: "arrivee", vuLe: "2026-12-02" });
  });

  it("confirmé au deuxième relevé, daté du premier jour vu", () => {
    const r = comparer({
      confirmes: set(1, 2),
      attente: attente([[3, { changement: "arrivee", vuLe: "2026-12-02" }]]),
      releve: set(1, 2, 3),
      aujourdhui: "2026-12-03",
    });
    expect(r.evenements).toEqual([{ tmdbId: 3, evenement: "arrivee", jour: "2026-12-02" }]);
    expect(r.ajouter).toEqual([{ tmdbId: 3, depuis: "2026-12-02" }]);
    expect(r.attente.size).toBe(0);
  });

  it("clignotement d'un jour : arrivée vue puis démentie, oubliée", () => {
    const r = comparer({
      confirmes: set(1, 2),
      attente: attente([[3, { changement: "arrivee", vuLe: "2026-12-02" }]]),
      releve: set(1, 2),
      aujourdhui: "2026-12-03",
    });
    expect(r.evenements).toEqual([]);
    expect(r.attente.size).toBe(0);
  });

  it("départ : en attente le premier jour, confirmé le deuxième, daté du premier", () => {
    const base = { confirmes: set(1, 2, 3, 4, 5, 6, 7, 8, 9, 10), aujourdhui: "2026-12-02" };
    const j1 = comparer({ ...base, attente: new Map(), releve: set(1, 2, 3, 4, 5, 6, 7, 8, 9) });
    expect(j1.statut).toBe("ok");
    expect(j1.attente.get(10)).toEqual({ changement: "depart", vuLe: "2026-12-02" });
    const j2 = comparer({ ...base, attente: j1.attente, releve: set(1, 2, 3, 4, 5, 6, 7, 8, 9), aujourdhui: "2026-12-03" });
    expect(j2.evenements).toEqual([{ tmdbId: 10, evenement: "depart", jour: "2026-12-02" }]);
    expect(j2.retirer).toEqual([10]);
  });

  it("clignotement d'un départ : absent un jour, revenu le lendemain, oublié", () => {
    const r = comparer({
      confirmes: set(1, 2, 3),
      attente: attente([[3, { changement: "depart", vuLe: "2026-12-02" }]]),
      releve: set(1, 2, 3),
      aujourdhui: "2026-12-03",
    });
    expect(r.evenements).toEqual([]);
    expect(r.attente.size).toBe(0);
  });

  it("garde-fou : plus de 10 % de titres en moins, aucun départ traité ni oublié ; les arrivées le sont", () => {
    const confirmes = set(...Array.from({ length: 100 }, (_, i) => i + 1));
    const releve = set(...Array.from({ length: 80 }, (_, i) => i + 1), 500);
    const r = comparer({
      confirmes,
      attente: attente([
        [95, { changement: "depart", vuLe: "2026-12-01" }],
        [500, { changement: "arrivee", vuLe: "2026-12-01" }],
      ]),
      releve,
      aujourdhui: "2026-12-02",
    });
    expect(r.statut).toBe("garde_fou");
    expect(r.retirer).toEqual([]);
    expect(r.evenements).toEqual([{ tmdbId: 500, evenement: "arrivee", jour: "2026-12-01" }]);
    // Le départ en attente est gardé tel quel, sans nouvelle attente pour les 19 autres absents
    expect(r.attente.get(95)).toEqual({ changement: "depart", vuLe: "2026-12-01" });
    expect(r.attente.size).toBe(1);
  });

  it("10 % pile : pas de garde-fou", () => {
    const confirmes = set(...Array.from({ length: 10 }, (_, i) => i + 1));
    const r = comparer({ confirmes, attente: new Map(), releve: set(1, 2, 3, 4, 5, 6, 7, 8, 9), aujourdhui: "2026-12-02" });
    expect(r.statut).toBe("ok");
  });

  it("relevé en échec : rien ne change, l'attente est gardée", () => {
    const a = attente([[3, { changement: "arrivee", vuLe: "2026-12-01" }]]);
    const r = comparer({ confirmes: set(1), attente: a, releve: null, aujourdhui: "2026-12-02" });
    expect(r).toMatchObject({ statut: "echec", evenements: [], ajouter: [], retirer: [] });
    expect(r.attente.get(3)).toEqual({ changement: "arrivee", vuLe: "2026-12-01" });
  });

  it("un jour sans relevé entre deux passages : le changement reste confirmable", () => {
    const r = comparer({
      confirmes: set(1),
      attente: attente([[2, { changement: "arrivee", vuLe: "2026-12-01" }]]),
      releve: set(1, 2),
      aujourdhui: "2026-12-03",
    });
    expect(r.evenements).toEqual([{ tmdbId: 2, evenement: "arrivee", jour: "2026-12-01" }]);
  });
});

describe("dates", () => {
  it("jour à Paris, y compris juste après minuit heure de Paris", () => {
    expect(jourParis(new Date("2026-12-01T23:30:00Z"))).toBe("2026-12-02");
    expect(jourParis(new Date("2026-07-01T21:59:00Z"))).toBe("2026-07-01");
  });
  it("six mois en arrière, fin de mois comprise", () => {
    expect(moinsMois("2026-12-02", 6)).toBe("2026-06-02");
    expect(moinsMois("2026-08-31", 6)).toBe("2026-02-28");
    expect(moinsMois("2027-03-15", 6)).toBe("2026-09-15");
  });
});
