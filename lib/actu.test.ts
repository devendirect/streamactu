import { describe, it, expect } from "vitest";
import {
  ACTU_PUBLIEE,
  ARTICLES,
  ARTICLES_PAR_PAGE,
  NAV_ACCUEIL,
  NB_PAGES_ACTU,
  TOUS_LES_ARTICLES,
  ADRESSES_FIXES,
  EDITIONS_COURANTES,
  FORMATS,
  articlesDeLaPage,
  cheminFixe,
  cheminArticle,
  cheminPageActu,
  editionCourante,
  periodeArticle,
} from "./actu";
import { liensInternes, textesGuide, type Guide } from "./guides";
import { DESCRIPTION_MAX, DESCRIPTION_MIN, TITRE_MAX, titreAffiche } from "./meta";
import { PLATEFORMES } from "./plateformes";

const PLATEFORMES_SLUGS = new Set(PLATEFORMES.map((p) => p.slug));

/** Routes vers lesquelles un article peut pointer (forme seulement) */
function routeConnue(lien: string): boolean {
  const chemin = lien.split("#")[0];
  if (["/", "/prochaines-sorties", "/actu", "/guides", "/retrouver"].includes(chemin)) return true;
  const [, a, b] = chemin.split("/");
  if (a === "film" || a === "serie") return /^[a-z0-9-]+-\d+$/.test(b ?? "");
  if (a === "guides" || a === "actu" || a === "genre") return Boolean(b);
  if (PLATEFORMES_SLUGS.has(a)) return !b || ["series", "films", "prochaines-sorties"].includes(b);
  return false;
}

describe("rubrique Actu", () => {
  it("n'expose jamais un brouillon", () => {
    expect(ARTICLES.some((a) => a.brouillon)).toBe(false);
    expect(ACTU_PUBLIEE).toBe(ARTICLES.length > 0);
  });

  it("garde « Actu » pour l'accueil tant que rien n'est publié, puis « Sorties » + « Actu »", () => {
    if (ACTU_PUBLIEE) {
      expect(NAV_ACCUEIL).toEqual([
        { href: "/", label: "Sorties" },
        { href: "/actu", label: "Actu" },
      ]);
    } else {
      expect(NAV_ACCUEIL).toEqual([{ href: "/", label: "Actu" }]);
    }
  });

  it("découpe la liste en pages de 12, la page 1 étant /actu", () => {
    expect(articlesDeLaPage(1)).toEqual(ARTICLES.slice(0, ARTICLES_PAR_PAGE));
    expect(articlesDeLaPage(0)).toEqual([]);
    expect(articlesDeLaPage(NB_PAGES_ACTU + 1)).toEqual([]);
    expect(articlesDeLaPage(1.5)).toEqual([]);
    expect(cheminPageActu(1)).toBe("/actu");
    expect(cheminPageActu(3)).toBe("/actu/page/3");
    const toutes = Array.from({ length: NB_PAGES_ACTU }, (_, i) => articlesDeLaPage(i + 1)).flat();
    expect(toutes).toEqual(ARTICLES);
  });

  it("sert le dernier article de chaque format à son adresse fixe, les autres à leur date", () => {
    for (const f of FORMATS) {
      const derniers = ARTICLES.filter((a) => a.format === f);
      expect(editionCourante(f)).toBe(derniers[0]);
      if (derniers[0]) expect(cheminArticle(derniers[0])).toBe(cheminFixe(f));
      for (const a of derniers.slice(1)) expect(cheminArticle(a)).toBe(`/actu/${a.slug}`);
    }
    expect(EDITIONS_COURANTES.length).toBeLessThanOrEqual(FORMATS.length);
    expect(cheminFixe("week-end")).toBe("/actu/que-regarder-ce-week-end");
    expect(cheminFixe("mois")).toBe("/actu/nouveautes-streaming-du-mois");
  });

  it("n'a aucun slug qui masque une adresse fixe", () => {
    const fixes = new Set(Object.values(ADRESSES_FIXES).map((f) => f.slug));
    expect(TOUS_LES_ARTICLES.some((a) => fixes.has(a.slug))).toBe(false);
  });

  it("donne aux slugs datés le préfixe de leur format (IndexNow en déduit l'adresse fixe)", () => {
    const prefixes = { "week-end": "que-regarder-ce-week-end-", mois: "nouveautes-streaming-" } as const;
    for (const a of TOUS_LES_ARTICLES) expect(a.slug.startsWith(prefixes[a.format]), a.slug).toBe(true);
  });

  it("a des slugs uniques", () => {
    expect(new Set(TOUS_LES_ARTICLES.map((a) => a.slug)).size).toBe(TOUS_LES_ARTICLES.length);
  });

  // Brouillons compris : un brouillon doit être publiable tel quel
  for (const a of TOUS_LES_ARTICLES) {
    describe(a.slug, () => {
      const commeGuide = { ...a, faq: [] } as unknown as Guide;
      it("respecte les longueurs de titre et de description", () => {
        expect(titreAffiche(a.titre).length).toBeLessThanOrEqual(TITRE_MAX);
        expect(a.description.length).toBeGreaterThanOrEqual(DESCRIPTION_MIN);
        expect(a.description.length).toBeLessThanOrEqual(DESCRIPTION_MAX);
      });
      if (a.format === "week-end") {
        it("porte sa période dans le titre (« … : 9 au 11 octobre 2026 »), reprise par l'adresse fixe", () => {
          expect(periodeArticle(a)).toMatch(/^\d{1,2}(er)?( [a-zéû]+)? au \d{1,2}(er)? [a-zéû]+ \d{4}$/);
        });
        it("paraît un vendredi (rendez-vous du week-end)", () => {
          expect(new Date(`${a.publie}T12:00:00Z`).getUTCDay()).toBe(5);
        });
      } else {
        it("porte son mois dans le titre (« … : novembre 2026 ») et paraît le mois d'avant", () => {
          const m = periodeArticle(a).match(/^([a-zéû]+) (\d{4})$/);
          expect(m, a.titre).not.toBeNull();
          const mois = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
          const idx = mois.indexOf(m![1]);
          expect(idx).toBeGreaterThanOrEqual(0);
          const avant = new Date(Date.UTC(Number(m![2]), idx - 1, 1)).toISOString().slice(0, 7);
          expect(a.publie.slice(0, 7)).toBe(avant);
        });
      }
      it("a une date de mise à jour postérieure à la publication", () => {
        expect(a.misAJour >= a.publie).toBe(true);
      });
      it("ne pointe que vers des routes connues", () => {
        const liens = textesGuide(commeGuide).flatMap(liensInternes);
        expect(liens.length).toBeGreaterThan(0);
        for (const l of liens) expect(routeConnue(l), l).toBe(true);
      });
      it("ouvre sur un titre illustrable, sans œuvre en double", () => {
        // La première section fournit la grande image (partage, Discover)
        expect(a.sections[0].oeuvre, "oeuvre de la première section").toBeDefined();
        const cles = a.sections.flatMap((s) => (s.oeuvre ? [`${s.oeuvre.type}-${s.oeuvre.id}`] : []));
        expect(new Set(cles).size).toBe(cles.length);
      });
      it("n'utilise pas de tiret long", () => {
        for (const t of textesGuide(commeGuide)) expect(t, t).not.toContain("—");
      });
    });
  }
});
