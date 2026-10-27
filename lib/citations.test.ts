import { describe, expect, it } from "vitest";
import type { Article } from "./actu";
import { citationsOeuvre, cleDepuisChemin, construireIndex } from "./citations";

function article(slug: string, extra: Partial<Article> = {}): Article {
  return {
    slug,
    format: "week-end",
    titre: `Article ${slug}`,
    description: "",
    chapo: "",
    publie: "2026-10-16",
    misAJour: "2026-10-16",
    sections: [],
    ...extra,
  };
}

describe("cleDepuisChemin", () => {
  it("fiches film et série, rien d'autre", () => {
    expect(cleDepuisChemin("/serie/tulsa-king-153312")).toBe("serie-153312");
    expect(cleDepuisChemin("/film/l-amour-de-ta-vie-1381078")).toBe("film-1381078");
    expect(cleDepuisChemin("/netflix")).toBeNull();
    expect(cleDepuisChemin("/genre/policier/max")).toBeNull();
  });
});

describe("construireIndex", () => {
  const avecSection = article("a", {
    sections: [
      { titre: "Tulsa King", oeuvre: { type: "serie", id: 153312 }, blocs: [{ p: "Texte." }] },
      { titre: "Et aussi", blocs: [{ ul: ["[MobLand](/serie/mobland-247718) : épisodes.", "[Tulsa King](/serie/tulsa-king-153312) encore"] }] },
    ],
  });
  const index = construireIndex([avecSection], [], (a) => `/actu/${a.slug}`);

  it("section dédiée : « choix », même si le titre est aussi en lien", () => {
    expect(index.get("serie-153312")?.articles).toEqual([{ titre: "Article a", chemin: "/actu/a", role: "choix" }]);
  });
  it("simple lien : « mention »", () => {
    expect(index.get("serie-247718")?.articles[0].role).toBe("mention");
  });
  it("titre absent : rien", () => {
    expect(index.get("film-1")).toBeUndefined();
  });
});

describe("citationsOeuvre (données du dépôt)", () => {
  it("Tulsa King : choisi dans l'article du 16 octobre, cité dans celui de novembre", () => {
    const c = citationsOeuvre("serie", 153312)!;
    expect(c.articles.some((a) => a.titre.includes("16 au 18 octobre 2026") && a.role === "choix")).toBe(true);
    expect(c.articles.some((a) => a.titre.includes("novembre 2026") && a.role === "mention")).toBe(true);
  });
  it("Iron Man : dans le guide Marvel", () => {
    const c = citationsOeuvre("film", 1726)!;
    expect(c.guides.some((g) => g.chemin === "/guides/marvel-ordre" && g.role === "choix")).toBe(true);
  });
  it("articles du plus récent au plus ancien", () => {
    const c = citationsOeuvre("serie", 247718)!;
    const titres = c.articles.map((a) => a.titre);
    expect(titres.length).toBeGreaterThan(1);
    expect(titres.indexOf(titres.find((t) => t.includes("16 au 18"))!)).toBeLessThan(
      titres.indexOf(titres.find((t) => t.includes("9 au 11"))!)
    );
  });
});
