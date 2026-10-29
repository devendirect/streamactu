import { describe, expect, it } from "vitest";
import { planRotation, type TitreRotation } from "./rotation";

// Netflix 8, Prime Video 119, Disney+ 337, Apple TV 350
const ORDRE = [8, 119, 337, 350];
const t = (cle: string, plateformes: number[], episodeCeMois = false): TitreRotation => ({ cle, plateformes, episodeCeMois });

describe("planRotation", () => {
  it("garde les abonnements utiles, met en pause les autres", () => {
    const plan = planRotation([t("a", [8]), t("b", [8, 119])], [8, 337], ORDRE);
    expect(plan.aGarder.map((c) => [c.id, c.cles])).toEqual([[8, ["a", "b"]]]);
    expect(plan.enPause).toEqual([337]);
    expect(plan.aPrendre).toEqual([]);
  });

  it("propose la plateforme qui couvre le plus de titres non couverts, puis la suivante", () => {
    const plan = planRotation(
      [t("a", [119]), t("b", [119, 337]), t("c", [337]), t("d", [350]), t("e", [8])],
      [8],
      ORDRE
    );
    expect(plan.aPrendre.map((c) => [c.id, c.cles])).toEqual([
      [119, ["a", "b"]],
      [337, ["c"]],
      [350, ["d"]],
    ]);
  });

  it("à égalité : les nouveaux épisodes du mois, puis le prix, puis l'ordre du site", () => {
    expect(planRotation([t("a", [119]), t("b", [337], true)], [], ORDRE).aPrendre[0].id).toBe(337);
    expect(planRotation([t("a", [119]), t("b", [337])], [], ORDRE, { 119: 6.99, 337: 5.99 }).aPrendre[0].id).toBe(337);
    expect(planRotation([t("a", [119]), t("b", [337])], [], ORDRE).aPrendre[0].id).toBe(119);
  });

  it("titres disponibles nulle part, et trois plateformes à prendre au plus", () => {
    const plan = planRotation([t("x", []), t("a", [8]), t("b", [119]), t("c", [337]), t("d", [350])], [], ORDRE);
    expect(plan.nullePart).toEqual(["x"]);
    expect(plan.aPrendre).toHaveLength(3);
  });
});
