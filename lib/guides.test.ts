import { describe, it, expect } from "vitest";
import { GUIDES, liensInternes, textesGuide } from "./guides";
import { DESCRIPTION_MAX, DESCRIPTION_MIN, TITRE_MAX, titreAffiche } from "./meta";
import { PLATEFORMES } from "./plateformes";
import { parseMoisURL } from "./utils";

const PLATEFORMES_SLUGS = new Set(PLATEFORMES.map((p) => p.slug));
const STATIQUES = new Set(["/", "/a-propos", "/mentions-legales", "/contact", "/guides", "/jeux", "/prochaines-sorties"]);

/** Le lien mène-t-il à une route qui existe ? (forme seulement, pas le contenu) */
function routeConnue(lien: string): boolean {
  const chemin = lien.split("#")[0];
  if (STATIQUES.has(chemin)) return true;
  const [, a, b] = chemin.split("/");
  if (a === "guides") return GUIDES.some((g) => g.slug === b);
  if (a === "top") {
    const m = b?.match(/^(series|films)-(.+)$/);
    return Boolean(m && (/^\d{4}$/.test(m[2]) || parseMoisURL(m[2])));
  }
  if (a === "film" || a === "serie") return /-\d+$/.test(b ?? "");
  if (a === "genre") return Boolean(b);
  if (PLATEFORMES_SLUGS.has(a)) return !b || ["series", "films", "prochaines-sorties"].includes(b) || /^\d{4}$/.test(b) || Boolean(parseMoisURL(b));
  return false;
}

describe("guides", () => {
  it("ont des slugs uniques", () => {
    expect(new Set(GUIDES.map((g) => g.slug)).size).toBe(GUIDES.length);
  });

  for (const g of GUIDES) {
    describe(g.slug, () => {
      it("respecte les longueurs de titre et de description", () => {
        expect(titreAffiche(g.titre).length).toBeLessThanOrEqual(TITRE_MAX);
        expect(g.description.length).toBeGreaterThanOrEqual(DESCRIPTION_MIN);
        expect(g.description.length).toBeLessThanOrEqual(DESCRIPTION_MAX);
      });
      it("a des dates valides, mise à jour ≥ publication", () => {
        expect(g.publie).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        expect(g.misAJour >= g.publie).toBe(true);
      });
      it("ne pointe que vers des routes connues", () => {
        const liens = textesGuide(g).flatMap(liensInternes);
        expect(liens.length).toBeGreaterThan(0);
        for (const l of liens) expect(routeConnue(l), l).toBe(true);
      });
      it("n'utilise pas de tiret long", () => {
        for (const t of textesGuide(g)) expect(t, t).not.toContain("—");
      });
      it("cite ses sources extérieures en https", () => {
        for (const s of g.sources ?? []) expect(s.url).toMatch(/^https:\/\//);
      });
    });
  }
});
