import { describe, expect, it, vi } from "vitest";
import type { Contenu, NouveautesParPlateforme } from "@/types";

// Les fonctions testées n'appellent pas TMDB
vi.mock("./tmdb", () => ({ getDetailFilm: vi.fn(), getDetailSerie: vi.fn(), getImagesUne: vi.fn() }));

import { aplatir, parScore } from "./accueil";
import { PLATEFORMES } from "./plateformes";

function contenu(id: number, extra: Partial<Contenu> = {}): Contenu {
  return {
    id,
    type: "serie",
    titre: `Titre ${id}`,
    slug: `titre-${id}`,
    poster: null,
    backdrop: null,
    note: 7,
    nbVotes: 100,
    annee: 2026,
    genres: [],
    synopsis: "",
    ...extra,
  };
}

const [netflix, prime] = PLATEFORMES;

describe("aplatir", () => {
  const donnees: NouveautesParPlateforme[] = [
    { plateforme: netflix, series: [contenu(1)], films: [contenu(2, { type: "film" })] },
    { plateforme: prime, series: [contenu(1), contenu(3)], films: [] },
  ];

  it("sans doublon, la première plateforme garde le titre", () => {
    const tout = aplatir(donnees);
    expect(tout.map((c) => c.id)).toEqual([1, 2, 3]);
    expect(tout[0].plateforme?.id).toBe(netflix.id);
    expect(tout[2].plateforme?.id).toBe(prime.id);
  });

  it("séries ou films seulement", () => {
    expect(aplatir(donnees, "series").map((c) => c.id)).toEqual([1, 3]);
    expect(aplatir(donnees, "films").map((c) => c.id)).toEqual([2]);
  });

  it("même id en série et en film : deux titres distincts", () => {
    const melange: NouveautesParPlateforme[] = [
      { plateforme: netflix, series: [contenu(5)], films: [contenu(5, { type: "film" })] },
    ];
    expect(aplatir(melange)).toHaveLength(2);
  });
});

describe("parScore", () => {
  it("une note haute sur peu de votes passe après une bonne note très votée", () => {
    const rare = contenu(1, { note: 9.5, nbVotes: 3 });
    const solide = contenu(2, { note: 8.2, nbVotes: 2000 });
    expect(parScore([rare, solide]).map((c) => c.id)).toEqual([2, 1]);
  });
});
