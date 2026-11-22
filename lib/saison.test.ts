import { describe, expect, it } from "vitest";
import { CALCUL_SAISON, SAISONS, SCRIPT_SAISON, type Saison } from "./saison";

// Le même code que dans le navigateur
const calcul = new Function(`return ${CALCUL_SAISON}`)() as (
  cfg: Saison[],
  y: number,
  m: number,
  j: number,
  forcee: string | null
) => Saison | null;

// Toutes les saisons actives, pour tester le calendrier complet
const TOUTES = SAISONS.map((s) => ({ ...s, pret: true }));
const PRETES = SAISONS.filter((s) => s.pret);
const jour = (y: number, m: number, j: number, cfg = TOUTES, forcee: string | null = null) => calcul(cfg, y, m, j, forcee)?.id ?? null;

describe("calendrier des saisons", () => {
  it("décembre : Noël, puis le Nouvel An (fenêtre plus courte) du 30 décembre au 2 janvier", () => {
    expect(jour(2026, 12, 1)).toBe("noel");
    expect(jour(2026, 12, 29)).toBe("noel");
    expect(jour(2026, 12, 30)).toBe("nouvelan");
    expect(jour(2026, 12, 31)).toBe("nouvelan");
    expect(jour(2027, 1, 1)).toBe("nouvelan");
    expect(jour(2027, 1, 2)).toBe("nouvelan");
    expect(jour(2027, 1, 3)).toBeNull();
  });

  it("hors fenêtre : aucun thème", () => {
    expect(jour(2026, 11, 30)).toBeNull();
    expect(jour(2027, 3, 1)).toBeNull();
  });

  it("jours isolés : 1er avril, 4 mai", () => {
    expect(jour(2027, 4, 1)).toBe("avril");
    expect(jour(2027, 4, 2)).toBeNull();
    expect(jour(2027, 5, 4)).toBe("espace");
  });

  it("Pâques est calculée chaque année (5 avril 2026, 28 mars 2027, 16 avril 2028)", () => {
    // fenêtre = 8 jours avant le dimanche → lundi de Pâques
    expect(jour(2026, 4, 5)).toBe("paques");
    expect(jour(2026, 4, 6)).toBe("paques");
    expect(jour(2026, 4, 7)).toBeNull();
    expect(jour(2026, 3, 28)).toBe("paques"); // 8 jours avant le 5 avril, inclus
    expect(jour(2026, 3, 27)).toBeNull();
    expect(jour(2027, 3, 28)).toBe("paques");
    expect(jour(2027, 3, 20)).toBe("paques");
    expect(jour(2028, 4, 16)).toBe("paques");
    expect(jour(2028, 4, 17)).toBe("paques");
  });

  it("le 1er avril l'emporte sur Pâques quand elles se chevauchent (fenêtre plus courte)", () => {
    // Pâques 2029 : 1er avril (dimanche)
    expect(jour(2029, 4, 1)).toBe("avril");
    expect(jour(2029, 3, 30)).toBe("paques");
  });

  it("dates annoncées : table de l'année, sinon repli, sinon rien", () => {
    expect(jour(2027, 5, 15)).toBe("cannes"); // repli mi-mai
    const avecTable = TOUTES.map((s) =>
      s.id === "cannes" ? { ...s, fenetre: { type: "annuel" as const, defaut: [[5, 12], [5, 23]] as [[number, number], [number, number]], annees: { 2027: [[5, 11], [5, 22]] as [[number, number], [number, number]] } } } : s
    );
    expect(jour(2027, 5, 11, avecTable)).toBe("cannes");
    expect(jour(2027, 5, 23, avecTable)).toBeNull();
    expect(jour(2027, 3, 14)).toBeNull(); // cérémonies : pas de date, pas de thème
  });

  it("l'anniversaire du site n'existe qu'à partir de 2027 et gagne sur la Fête du cinéma", () => {
    expect(jour(2026, 6, 28)).not.toBe("anniv");
    expect(jour(2027, 6, 27)).toBe("anniv");
    expect(jour(2027, 6, 29)).toBe("anniv"); // la Fête du cinéma (28 juin → 1er juillet) cède la place
    expect(jour(2027, 7, 3)).toBe("anniv");
  });

  it("les saisons pas prêtes sont ignorées", () => {
    const sansValentin = SAISONS.map((s) => (s.id === "valentin" ? { ...s, pret: false } : s)).filter((s) => s.pret);
    expect(jour(2027, 2, 10, PRETES)).toBe("valentin");
    expect(jour(2027, 2, 10, sansValentin)).toBeNull(); // saison éteinte (`pret: false`) : ignorée
  });

  it("aperçu forcé : la saison demandée, ou aucune avec « 0 »", () => {
    expect(jour(2026, 7, 14, PRETES, "noel")).toBe("noel");
    expect(jour(2026, 12, 15, PRETES, "0")).toBeNull();
    expect(jour(2026, 12, 15, PRETES, "inconnue")).toBeNull();
  });
});

describe("script de saison", () => {
  it("est du JavaScript valide, sans dépendance au module", () => {
    expect(() => new Function(SCRIPT_SAISON)).not.toThrow();
  });

  it("pose data-saison et data-variante pour une saison forcée", () => {
    const attrs: Record<string, string> = {};
    const doc = { documentElement: { setAttribute: (k: string, v: string) => (attrs[k] = v) } };
    const stock: Record<string, string> = { saison: "noel" };
    const sessionStorage = { getItem: (k: string) => stock[k] ?? null, setItem: (k: string, v: string) => (stock[k] = v) };
    const localStorage = { getItem: () => null, setItem: () => undefined };
    new Function("document", "location", "sessionStorage", "localStorage", SCRIPT_SAISON)(doc, { search: "" }, sessionStorage, localStorage);
    expect(attrs).toEqual({ "data-saison": "noel", "data-variante": "1" });
  });

  // Joue le script avec un jour forcé et des stockages simulés ; renvoie les attributs posés sur <html>
  const jouer = (forcee: string, session: Record<string, string> = {}, local: Record<string, string> = {}) => {
    const attrs: Record<string, string> = {};
    const doc = { documentElement: { setAttribute: (k: string, v: string) => (attrs[k] = v) } };
    const sessionStorage = { getItem: (k: string) => ({ saison: forcee, ...session })[k] ?? null, setItem: () => undefined };
    const localStorage = { getItem: (k: string) => local[k] ?? null, setItem: () => undefined };
    new Function("document", "location", "sessionStorage", "localStorage", SCRIPT_SAISON)(doc, { search: "" }, sessionStorage, localStorage);
    return attrs;
  };

  it("effets désactivés par le visiteur : data-effets=off dès le premier affichage", () => {
    expect(jouer("noel", {}, { "effets-saison": "off" })).toMatchObject({ "data-saison": "noel", "data-effets": "off" });
    expect(jouer("noel")).not.toHaveProperty("data-effets");
  });

  it("saison déjà jouée dans la session : la page démarre au calme", () => {
    expect(jouer("noel", { "effets-vus": "noel" })).toHaveProperty("data-calme", "1");
    expect(jouer("noel", { "effets-vus": "halloween" })).not.toHaveProperty("data-calme");
  });

  it("le Nouvel An n'est jamais calmé (compte à rebours et feux de minuit)", () => {
    expect(jouer("nouvelan", { "effets-vus": "nouvelan" })).not.toHaveProperty("data-calme");
  });

  it("reste muet hors période", () => {
    const attrs: Record<string, string> = {};
    const doc = { documentElement: { setAttribute: (k: string, v: string) => (attrs[k] = v) } };
    const stock: Record<string, string> = { saison: "0" };
    const sessionStorage = { getItem: (k: string) => stock[k] ?? null, setItem: (k: string, v: string) => (stock[k] = v) };
    new Function("document", "location", "sessionStorage", "localStorage", SCRIPT_SAISON)(doc, { search: "" }, sessionStorage, { getItem: () => null, setItem: () => undefined });
    expect(attrs).toEqual({});
  });
});
