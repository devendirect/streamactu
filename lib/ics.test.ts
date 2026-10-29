import { describe, expect, it } from "vitest";
import { calendrierICS, echapperTexte, plierLigne } from "./ics";

describe("echapperTexte", () => {
  it("échappe les caractères réservés", () => {
    expect(echapperTexte("Lupin, partie 4; épisode\\1\nsuite")).toBe("Lupin\\, partie 4\\; épisode\\\\1\\nsuite");
  });
});

describe("plierLigne", () => {
  it("laisse une ligne courte telle quelle", () => {
    expect(plierLigne("SUMMARY:Lupin")).toBe("SUMMARY:Lupin");
  });

  it("plie à 75 octets sans couper un caractère accentué", () => {
    const ligne = `DESCRIPTION:${"é".repeat(80)}`;
    const morceaux = plierLigne(ligne).split("\r\n");
    expect(morceaux.length).toBeGreaterThan(1);
    for (const m of morceaux) expect(Buffer.byteLength(m, "utf8")).toBeLessThanOrEqual(75);
    expect(morceaux.slice(1).every((m) => m.startsWith(" "))).toBe(true);
    expect(morceaux.map((m, i) => (i === 0 ? m : m.slice(1))).join("")).toBe(ligne);
  });
});

describe("calendrierICS", () => {
  it("écrit des événements journée entière avec UID stable et fin exclusive", () => {
    const ics = calendrierICS({
      nom: "Netflix",
      description: "Sorties à venir",
      maintenant: new Date("2026-10-28T09:05:03.120Z"),
      evenements: [{ uid: "streamactu-serie-1-s1e1@streamactu.fr", date: "2026-12-31", titre: "Série, épisode 1", url: "https://streamactu.fr/serie/x-1" }],
    });
    expect(ics.startsWith("BEGIN:VCALENDAR\r\nVERSION:2.0\r\n")).toBe(true);
    expect(ics.endsWith("END:VCALENDAR\r\n")).toBe(true);
    expect(ics).toContain("UID:streamactu-serie-1-s1e1@streamactu.fr\r\n");
    expect(ics).toContain("DTSTAMP:20261028T090503Z\r\n");
    expect(ics).toContain("DTSTART;VALUE=DATE:20261231\r\nDTEND;VALUE=DATE:20270101\r\n");
    expect(ics).toContain("SUMMARY:Série\\, épisode 1\r\n");
    expect(ics).not.toMatch(/[^\r]\n/);
  });
});
