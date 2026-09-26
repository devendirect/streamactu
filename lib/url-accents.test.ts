import { describe, it, expect } from "vitest";
import { cheminSansAccents } from "./url-accents";

describe("cheminSansAccents", () => {
  it("redirige les dates et mois accentués, encodés ou non", () => {
    expect(cheminSansAccents("/31-ao%C3%BBt-2026")).toBe("/31-aout-2026");
    expect(cheminSansAccents("/31-août-2026")).toBe("/31-aout-2026");
    expect(cheminSansAccents("/netflix/f%C3%A9vrier-2026")).toBe("/netflix/fevrier-2026");
    expect(cheminSansAccents("/top/series-d%C3%A9cembre-2025")).toBe("/top/series-decembre-2025");
  });
  it("répare l'UTF-8 lu octet par octet", () => {
    // « août » envoyé brut puis réencodé en latin-1 : « aoÃ»t »
    expect(cheminSansAccents("/31-ao%C3%83%C2%BBt-2026")).toBe("/31-aout-2026");
  });
  it("laisse passer tout le reste", () => {
    expect(cheminSansAccents("/31-aout-2026")).toBeNull();
    expect(cheminSansAccents("/netflix/juin-2026")).toBeNull();
    expect(cheminSansAccents("/")).toBeNull();
    expect(cheminSansAccents("/serie/stranger-things-66732")).toBeNull();
    expect(cheminSansAccents("/recherche/%C3%A9t%C3%A9")).toBeNull();
  });
});
