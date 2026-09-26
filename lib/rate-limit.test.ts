import { describe, it, expect, vi } from "vitest";

describe("plafondIAAtteint", () => {
  it("laisse passer jusqu'au plafond du jour, puis bloque", async () => {
    vi.stubEnv("IA_PLAFOND_RETROUVER_JOUR", "3");
    vi.resetModules();
    const { plafondIAAtteint, PLAFONDS_IA_JOUR } = await import("./rate-limit");
    expect(PLAFONDS_IA_JOUR.retrouver).toBe(3);
    expect([1, 2, 3].map(() => plafondIAAtteint("retrouver"))).toEqual([false, false, false]);
    expect(plafondIAAtteint("retrouver")).toBe(true);
    // Les deux fonctions ont des compteurs séparés
    expect(plafondIAAtteint("convaincs")).toBe(false);
    vi.unstubAllEnvs();
  });

  it("ignore une valeur d'environnement invalide", async () => {
    vi.stubEnv("IA_PLAFOND_CONVAINCS_JOUR", "abc");
    vi.resetModules();
    const { PLAFONDS_IA_JOUR } = await import("./rate-limit");
    expect(PLAFONDS_IA_JOUR.convaincs).toBe(1000);
    vi.unstubAllEnvs();
  });
});
