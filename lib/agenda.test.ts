import { describe, expect, it } from "vitest";
import { evenementFilm, evenementsSerie } from "./agenda";
import type { CalendrierSaison } from "./episodes";

const SITE = "https://streamactu.fr";

const cal = (datesFrance: boolean, plateforme: number | null): CalendrierSaison & { plateforme: number | null } => ({
  saison: 2,
  libelleSaison: "saison 2",
  datesFrance,
  nbEpisodes: 4,
  disponibles: 2,
  prochaine: { numeros: [3, 4], date: "2026-11-04" },
  fin: "2026-11-04",
  sorties: [
    { numeros: [1], date: "2026-10-01" },
    { numeros: [2], date: "2026-10-25" },
    { numeros: [3, 4], date: "2026-11-04" },
  ],
  plateforme,
});

describe("evenementsSerie", () => {
  it("garde la semaine écoulée et la suite, un événement par jour, UID stable", () => {
    const ev = evenementsSerie({ id: 1399, titre: "Lupin", slug: "lupin-1399", calendrier: cal(true, 8) }, "2026-10-28", SITE);
    expect(ev.map((e) => e.date)).toEqual(["2026-10-25", "2026-11-04"]);
    expect(ev[1].uid).toBe("streamactu-serie-1399-s2e3@streamactu.fr");
    expect(ev[1].titre).toBe("Lupin : saison 2, épisodes 3 et 4");
    expect(ev[1].description).toContain("sur Netflix en France");
  });

  it("dit quand la date est celle d'origine", () => {
    const [e] = evenementsSerie({ id: 1, titre: "X", slug: "x-1", calendrier: cal(false, null) }, "2026-11-01", SITE);
    expect(e.description).toContain("Date de diffusion d'origine");
  });

  it("rien sans calendrier", () => {
    expect(evenementsSerie({ id: 1, titre: "X", slug: "x-1", calendrier: null }, "2026-11-01", SITE)).toEqual([]);
  });
});

describe("evenementFilm", () => {
  it("nomme la plateforme si la sortie la donne, sinon parle d'achat ou location", () => {
    expect(evenementFilm({ id: 2, titre: "F", slug: "f-2", sortieNumerique: { date: "2026-12-01", plateforme: 337 } }, SITE)[0].titre).toBe(
      "F (film, sur Disney+)"
    );
    expect(evenementFilm({ id: 2, titre: "F", slug: "f-2", sortieNumerique: { date: "2026-12-01", plateforme: null } }, SITE)[0].description).toContain(
      "achat ou location"
    );
    expect(evenementFilm({ id: 2, titre: "F", slug: "f-2", sortieNumerique: null }, SITE)).toEqual([]);
  });
});
