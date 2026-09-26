import { describe, it, expect } from "vitest";
import type { Contenu, Film, Serie } from "@/types";
import {
  DESCRIPTION_MAX,
  DESCRIPTION_MIN,
  TITRE_MAX,
  composerDescription,
  comptesUniques,
  metaAccueil,
  metaAnneePlateforme,
  metaGenre,
  metaGenrePlateforme,
  metaHubPlateforme,
  metaJour,
  metaMois,
  metaMoisPlateforme,
  metaProchainesSorties,
  metaProchainesSortiesPlateforme,
  metaSemaine,
  metaSeriesOuFilms,
  metaTop,
  introComptes,
  periodeSemaine,
  titreAffiche,
  type TitreDescription,
} from "./meta";
import { descriptionFiche } from "./seo";

// Données simulées : noms réels des plateformes et genres, titres courts et
// très longs pour pousser les gabarits dans leurs extrêmes.
const PLATEFORMES = ["Netflix", "Prime Video", "Disney+", "Apple TV+", "Canal+", "HBO Max", "Paramount+"];
const GENRES: [string, string][] = [
  ["Science-fiction", "Futurs proches, espace lointain et dystopies — la SF sous toutes ses formes."],
  ["Action", "Poursuites, cascades et gros bras : l'adrénaline en flux continu."],
  ["Western", "Duels, plaines et hors-la-loi — le western classique et ses relectures modernes."],
  ["Documentaire", "Le réel raconté : enquêtes, portraits, nature et faits divers."],
];

let id = 0;
function contenu(titre: string, type: "serie" | "film" = "serie", nbVotes = 100): Contenu {
  return {
    id: ++id, type, titre, slug: `x-${id}`, poster: null, backdrop: null, note: 7, nbVotes,
    annee: 2026, genres: [], synopsis: "",
  };
}
const COURT = [contenu("Dune", "film", 900), contenu("You", "serie", 800)];
const LONG = [
  contenu("L'Envers du sport : Mister T, l'icône tous risques et ses années de gloire", "serie", 900),
  contenu("Le Seigneur des anneaux : Les Anneaux de pouvoir", "serie", 800),
];
const JEUX: [string, Contenu[], Contenu[]][] = [
  ["vide", [], []],
  ["un seul", [COURT[1]], []],
  ["courts", [COURT[1]], [COURT[0]]],
  ["longs", LONG, []],
  ["beaucoup", Array.from({ length: 48 }, (_, i) => contenu(`Série ${i}`)), Array.from({ length: 37 }, (_, i) => contenu(`Film ${i}`, "film"))],
];

function verifier(nom: string, m: TitreDescription) {
  const titre = titreAffiche(m.titre);
  expect(titre.length, `${nom} titre : « ${titre} »`).toBeLessThanOrEqual(TITRE_MAX);
  expect(m.description.length, `${nom} description : « ${m.description} »`).toBeGreaterThanOrEqual(DESCRIPTION_MIN);
  expect(m.description.length, `${nom} description : « ${m.description} »`).toBeLessThanOrEqual(DESCRIPTION_MAX);
}

describe("assemblage", () => {
  it("n'ajoute le suffixe que s'il tient", () => {
    expect(titreAffiche("À propos")).toBe("À propos | StreamActu.fr");
    const long = "Prochaines sorties streaming : les 4 semaines à venir";
    expect(titreAffiche(long)).toBe(long);
  });
  it("prend la première variante qui tient", () => {
    const base = "x".repeat(140);
    expect(composerDescription(base, ["y".repeat(20), "court."])).toBe(`${base} court.`);
  });
  it("coupe une base trop longue sur un mot", () => {
    const d = composerDescription("mot ".repeat(60).trim());
    expect(d.length).toBeLessThanOrEqual(DESCRIPTION_MAX);
    expect(d.endsWith("mot…")).toBe(true);
  });
  it("compte une seule fois un titre présent sur deux plateformes", () => {
    const c = comptesUniques([
      { series: [COURT[1]], films: [COURT[0]] },
      { series: [COURT[1]], films: [] },
    ]);
    expect(c.series).toHaveLength(1);
    expect(c.films).toHaveLength(1);
  });
});

describe("longueurs de chaque gabarit", () => {
  it("accueil, prochaines sorties", () => {
    verifier("accueil", metaAccueil());
    verifier("prochaines sorties", metaProchainesSorties());
  });

  it("pages plateforme", () => {
    for (const pf of PLATEFORMES) {
      verifier(`hub ${pf}`, metaHubPlateforme(pf));
      verifier(`prochaines ${pf}`, metaProchainesSortiesPlateforme(pf));
      for (const [cas, series, films] of JEUX) {
        verifier(`séries ${pf} ${cas}`, metaSeriesOuFilms(pf, "series", series));
        verifier(`films ${pf} ${cas}`, metaSeriesOuFilms(pf, "films", films));
        verifier(`année ${pf} ${cas}`, metaAnneePlateforme(pf, 2026, series.length, films.length, [...series, ...films]));
        verifier(`séries ${pf} ${cas} total réel`, metaSeriesOuFilms(pf, "series", series, 152));
        verifier(`films ${pf} ${cas} total réel`, metaSeriesOuFilms(pf, "films", films, 1));
        for (let m = 1; m <= 12; m++) {
          verifier(`mois ${pf} ${m} ${cas}`, metaMoisPlateforme(pf, m, 2026, series, films));
          verifier(`mois ${pf} ${m} ${cas} totaux`, metaMoisPlateforme(pf, m, 2026, series, films, { series: 152, films: 48 }));
        }
      }
    }
  });

  it("jours, semaines, mois", () => {
    const jours = ["2026-09-30", "2026-02-01", "2026-08-31", "2026-12-25"];
    for (const [cas, series, films] of JEUX) {
      for (const iso of jours) {
        const d = new Date(iso + "T12:00:00Z");
        verifier(`jour ${iso} ${cas}`, metaJour(d, false, series, films));
        verifier(`jour futur ${iso}`, metaJour(d, true, [], []));
      }
      for (const [s, a] of [[1, 2026], [36, 2026], [53, 2026], [26, 2026]]) {
        verifier(`semaine ${s} ${cas}`, metaSemaine(s, a, false, series, films));
        verifier(`semaine future ${s}`, metaSemaine(s, a, true, [], []));
      }
      for (let m = 1; m <= 12; m++) verifier(`mois ${m} ${cas}`, metaMois(m, 2026, series, films));
    }
  });

  it("genres et genre × plateforme", () => {
    for (const [nom, intro] of GENRES) {
      verifier(`genre ${nom}`, metaGenre(nom, intro));
      for (const pf of PLATEFORMES) verifier(`genre ${nom} ${pf}`, metaGenrePlateforme(nom, intro, pf));
    }
  });

  it("tops", () => {
    for (const type of ["serie", "film"] as const) {
      for (const contenus of [[], COURT, LONG]) {
        verifier(`top ${type} année`, metaTop(type, { portee: "annee", annee: 2026 }, contenus));
        for (let m = 1; m <= 12; m++) {
          verifier(`top ${type} ${m}`, metaTop(type, { portee: "mois", mois: m, annee: 2026 }, contenus));
        }
      }
    }
  });
});

describe("rédaction", () => {
  it("élide devant une voyelle", () => {
    expect(metaMois(8, 2026, [], []).titre).toBe("Nouveautés streaming d'août 2026");
    expect(metaMoisPlateforme("Netflix", 6, 2026, [], []).titre).toBe("Nouveautés Netflix de juin 2026");
  });
  it("cite des exemples réels quand la place le permet", () => {
    expect(metaMoisPlateforme("Netflix", 6, 2026, [COURT[1]], [COURT[0]]).description).toContain("Dune et You");
  });
  it("écrit les périodes de semaine sans répéter le mois", () => {
    expect(periodeSemaine(26, 2026)).toBe("du 22 au 28 juin 2026");
    expect(periodeSemaine(36, 2026)).toBe("du 31 août au 6 septembre 2026");
    expect(periodeSemaine(53, 2026)).toBe("du 28 décembre 2026 au 3 janvier 2027");
  });
  it("accorde séries et films", () => {
    expect(metaSeriesOuFilms("Netflix", "series", [COURT[1]]).description).toMatch(/^1 série ajoutée .* triée par note/);
    expect(metaSeriesOuFilms("Netflix", "films", COURT).description).toMatch(/^2 films ajoutés .* triés par note/);
    expect(metaMoisPlateforme("Canal+", 5, 2026, LONG, []).description).toMatch(/^2 séries arrivées sur Canal\+ en mai 2026/);
    expect(metaMoisPlateforme("Canal+", 6, 2026, [COURT[1]], []).description).toContain("Parmi elles : You.");
    expect(metaMoisPlateforme("Canal+", 5, 2026, [COURT[1]], [COURT[0]]).description).toMatch(/^1 série et 1 film arrivés/);
  });
  it("donne des descriptions différentes d'une plateforme à l'autre", () => {
    const hubs = new Set(PLATEFORMES.map((pf) => metaHubPlateforme(pf).description));
    expect(hubs.size).toBe(PLATEFORMES.length);
  });
});

describe("totaux réels (P11)", () => {
  it("préfère les totaux TMDB à la longueur des listes plafonnées", () => {
    expect(metaMoisPlateforme("Netflix", 8, 2026, LONG, [], { series: 52, films: 19 }).description).toMatch(/^52 séries et 19 films arrivés sur Netflix/);
    expect(metaJour(new Date("2026-08-31T12:00:00Z"), false, COURT, [], { series: 30, films: 4 }).description).toMatch(/^30 séries et 4 films sortis/);
  });
  it("dit quand la liste affichée est tronquée", () => {
    expect(metaSeriesOuFilms("Netflix", "series", COURT, 52).description).toContain("52 séries ajoutées au catalogue Netflix en France ces quatre dernières semaines, les 2 plus populaires affichées.");
    expect(introComptes({ series: 52, films: 19 }, 39, "arrivé", "sur Netflix en août 2026")).toBe(
      "52 séries et 19 films arrivés sur Netflix en août 2026 ; voici les 39 plus populaires, triés par note."
    );
    expect(introComptes({ series: 3, films: 0 }, 3, "arrivé", "sur Canal+ en mai 2026")).toBe(
      "3 séries arrivées sur Canal+ en mai 2026, triées par note."
    );
    expect(introComptes({ series: 0, films: 0 }, 0, "arrivé", "x")).toBe("");
  });
});

describe("fiches", () => {
  function fiche(synopsis: string, extra: Partial<Serie> = {}): Serie {
    return {
      ...contenu("Ghosts"), type: "serie", synopsis, nbSaisons: 3, nbEpisodes: 30, saisons: [], casting: [],
      genres: [{ id: 35, nom: "Comédie" }], dispo: ["Netflix", "Netflix Standard with Ads", "Canal+"], ...extra,
    } as Serie;
  }
  it("reste entre 120 et 155 caractères, synopsis long, court ou absent", () => {
    for (const synopsis of ["", "Une maison hantée.", "Un couple hérite d'un manoir. ".repeat(12)]) {
      const d = descriptionFiche(fiche(synopsis));
      expect(d.length, d).toBeGreaterThanOrEqual(DESCRIPTION_MIN);
      expect(d.length, d).toBeLessThanOrEqual(DESCRIPTION_MAX);
    }
  });
  it("ne répète pas la même plateforme avec pub", () => {
    expect(descriptionFiche(fiche("Une maison hantée."))).toMatch(/^À voir sur Netflix et Canal\+\./);
  });
  it("ajoute type, année, genres et saisons quand le synopsis est court", () => {
    expect(descriptionFiche(fiche("Une maison hantée."))).toContain("Série de 2026 (Comédie), 3 saisons.");
    const film = { ...contenu("Dune", "film"), synopsis: "", duree: 150, casting: [], realisateurs: [], dispo: [], trailer: null } as unknown as Film;
    const d = descriptionFiche(film);
    expect(d.startsWith("Dune : film de 2026.")).toBe(true);
  });
});
