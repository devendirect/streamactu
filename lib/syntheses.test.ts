import { describe, it, expect } from "vitest";
import type { Contenu } from "@/types";
import { syntheseCalendrier, syntheseFilms, syntheseJour, syntheseMois, syntheseSeries } from "./syntheses";

let id = 0;
function c(titre: string, extra: Partial<Contenu> = {}): Contenu {
  return {
    id: ++id, type: "serie", titre, slug: "", poster: null, backdrop: null, note: 7, nbVotes: 100,
    annee: 2026, genres: [], synopsis: "", ...extra,
  };
}

describe("syntheseSeries", () => {
  it("sépare lancements et nouvelles saisons, cite la mieux notée", () => {
    const d = syntheseSeries(
      [
        c("Nouvelle", { premiereDiffusion: "2026-09-10", note: 8.4, nbVotes: 900 }),
        c("Ancienne", { premiereDiffusion: "2019-01-01" }),
        c("Autre", { premiereDiffusion: "2020-01-01" }),
      ],
      "2026-08-29",
      "2026-09-26"
    );
    expect(d).toContain("1 série vient d'être lancée et 2 autres reviennent");
    expect(d).toContain("La mieux notée par les spectateurs : Nouvelle (8,4/10 sur TMDB).");
  });
  it("ne dit rien sur une liste vide", () => {
    expect(syntheseSeries([], "2026-08-29", "2026-09-26")).toBeNull();
  });
});

describe("syntheseFilms", () => {
  it("donne le genre dominant", () => {
    const drame = { id: 18, nom: "Drame" };
    const d = syntheseFilms([c("A", { type: "film", genres: [drame] }), c("B", { type: "film", genres: [drame] }), c("C", { type: "film" })]);
    expect(d).toContain("drame, avec 2 films sur 3");
  });
});

describe("syntheseMois", () => {
  it("compte les séries lancées dans le mois", () => {
    const d = syntheseMois([c("X", { premiereDiffusion: "2026-07-03" }), c("Y", { premiereDiffusion: "2025-01-01" })], [], "2026-07-01", "2026-07-31", "juillet 2026");
    expect(d).toContain("Une seule série de cette liste a été lancée en juillet 2026 : X.");
  });
});

describe("syntheseCalendrier / syntheseJour", () => {
  it("annonce la prochaine date en minuscules", () => {
    const d = syntheseCalendrier([{ dateISO: "2026-10-02", contenus: [c("Dune")] }, { dateISO: "2026-10-05", contenus: [c("You")] }]);
    expect(d).toBe("Prochaine sortie annoncée : Dune, le vendredi 2 octobre 2026. Des sorties sont prévues sur 2 jours différents d'ici quatre semaines.");
  });
  it("désigne la plateforme la plus active", () => {
    const d = syntheseJour([{ nom: "Netflix", nb: 5 }, { nom: "Canal+", nb: 2 }, { nom: "Disney+", nb: 0 }], "Vendredi 25 septembre 2026");
    expect(d).toBe("Le vendredi 25 septembre 2026, 2 plateformes ont des sorties recensées ici ; Netflix en compte le plus (5 titres).");
  });
});
