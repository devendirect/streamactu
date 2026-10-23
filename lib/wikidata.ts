/**
 * Faits Wikidata d'une fiche (licence CC0) : récompenses majeures, œuvre
 * adaptée, lieux de tournage, liens vers AlloCiné et SensCritique.
 *
 * L'identifiant Wikidata vient de TMDB (external_ids) : pas de recherche par
 * titre, donc pas de confusion entre homonymes. Un élément n'est affiché que
 * s'il a un libellé français. Une panne de Wikidata ne casse jamais la fiche :
 * pas de bloc, c'est tout.
 */

import { unstable_cache } from "next/cache";

const API = "https://www.wikidata.org/w/api.php";
// Wikimedia demande un User-Agent qui identifie le client et un moyen de contact
const USER_AGENT = "StreamActuBot/1.0 (https://streamactu.fr/contact)";

/** Prix retenus, par ordre de priorité (libellés français de Wikidata) */
const PRIX_MAJEURS = [
  /^Oscar\b/,
  /^Palme d'or\b/,
  /^César\b/,
  /^Lion d'or\b/,
  /^Ours d'or\b/,
  /^Golden Globe\b/,
  /^Primetime Emmy Award\b/,
  /^British Academy (Film|Television) Award\b/,
];
export const MAX_PRIX = 5;
export const MAX_LIEUX = 3;

export interface FaitsWikidata {
  /** Prix majeurs reçus (pas les nominations), au plus MAX_PRIX */
  prix: { libelle: string; annee: number | null }[];
  /** Prix majeurs au-delà de MAX_PRIX */
  autresPrix: number;
  /** « basé sur » (P144) : roman, BD… ou personnage (VisionQuest → Vision), d'où « D'après » à l'affichage */
  adapteDe: string[];
  tournage: string[];
  allocine: string | null;
  senscritique: string | null;
}

/** Sous-ensemble utile d'une déclaration Wikidata */
interface Declaration {
  mainsnak: { datavalue?: { value: unknown } };
  qualifiers?: Record<string, { datavalue?: { value: unknown } }[]>;
  rank?: string;
}
export type Declarations = Record<string, Declaration[]>;

function valeurs(claims: Declarations, propriete: string): Declaration[] {
  return (claims[propriete] ?? []).filter((d) => d.rank !== "deprecated" && d.mainsnak.datavalue);
}

function idEntite(d: Declaration): string | null {
  const v = d.mainsnak.datavalue?.value as { id?: string } | undefined;
  return v?.id ?? null;
}

function chaine(d: Declaration): string | null {
  const v = d.mainsnak.datavalue?.value;
  return typeof v === "string" ? v : null;
}

/** Entités à libeller : œuvres adaptées, lieux et prix */
export function entitesReferencees(claims: Declarations): string[] {
  return [
    ...new Set(
      ["P144", "P915", "P166"].flatMap((p) => valeurs(claims, p).map(idEntite).filter((q): q is string => !!q))
    ),
  ];
}

/** Faits d'une fiche à partir des déclarations et des libellés français des entités citées */
export function extraireFaits(
  claims: Declarations,
  libelles: Record<string, string>,
  type: "film" | "serie"
): FaitsWikidata {
  const prixMajeurs = valeurs(claims, "P166")
    .map((d) => {
      const libelle = libelles[idEntite(d) ?? ""];
      const temps = d.qualifiers?.P585?.[0]?.datavalue?.value as { time?: string } | undefined;
      const annee = temps?.time ? Number(temps.time.slice(1, 5)) : null;
      const rang = libelle ? PRIX_MAJEURS.findIndex((r) => r.test(libelle)) : -1;
      return { libelle, annee: Number.isFinite(annee) ? annee : null, rang };
    })
    .filter((p) => p.rang >= 0)
    .sort((a, b) => a.rang - b.rang || (a.annee ?? 9999) - (b.annee ?? 9999));
  const vus = new Set<string>();
  const uniques = prixMajeurs.filter((p) => !vus.has(p.libelle) && vus.add(p.libelle));

  const libellesDe = (p: string, max = Infinity) =>
    [...new Set(valeurs(claims, p).map((d) => libelles[idEntite(d) ?? ""]).filter(Boolean))].slice(0, max);

  const idAllocine = valeurs(claims, type === "film" ? "P1265" : "P1267").map(chaine).find(Boolean);
  const idSensCritique = valeurs(claims, "P10100").map(chaine).find(Boolean);
  return {
    prix: uniques.slice(0, MAX_PRIX).map(({ libelle, annee }) => ({ libelle, annee })),
    autresPrix: Math.max(0, uniques.length - MAX_PRIX),
    adapteDe: libellesDe("P144"),
    tournage: libellesDe("P915", MAX_LIEUX),
    // Formats d'URL des propriétés Wikidata (P1630), relevés le 2026-10-23
    allocine: idAllocine
      ? type === "film"
        ? `https://www.allocine.fr/film/fichefilm_gen_cfilm=${encodeURIComponent(idAllocine)}.html`
        : `https://www.allocine.fr/series/ficheserie_gen_cserie=${encodeURIComponent(idAllocine)}.html`
      : null,
    senscritique: idSensCritique ? `https://www.senscritique.com/film/-/${encodeURIComponent(idSensCritique)}` : null,
  };
}

/** Rien à montrer ? */
export function faitsVides(f: FaitsWikidata): boolean {
  return !f.prix.length && !f.adapteDe.length && !f.tournage.length && !f.allocine && !f.senscritique;
}

async function api<T>(params: Record<string, string>): Promise<T> {
  const url = new URL(API);
  for (const [k, v] of Object.entries({ format: "json", ...params })) url.searchParams.set(k, v);
  const res = await fetch(url, {
    headers: { "User-Agent": USER_AGENT, Accept: "application/json" },
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`Wikidata ${res.status}`);
  return res.json() as Promise<T>;
}

/**
 * Faits Wikidata d'une entité (cache 7 jours), ou null si rien d'utile. Une
 * erreur n'est pas mise en cache : elle remonte, et getFaitsWikidata la rattrape.
 */
const faitsEnCache = unstable_cache(
  async (qid: string, type: "film" | "serie"): Promise<FaitsWikidata | null> => {
    const r = await api<{ entities: Record<string, { claims?: Declarations }> }>({
      action: "wbgetentities",
      ids: qid,
      props: "claims",
    });
    const claims = r.entities[qid]?.claims ?? {};
    // Libellés français des entités citées, par lots de 50 (limite de l'API)
    const refs = entitesReferencees(claims);
    const libelles: Record<string, string> = {};
    for (let i = 0; i < refs.length; i += 50) {
      const l = await api<{ entities: Record<string, { labels?: { fr?: { value: string } } }> }>({
        action: "wbgetentities",
        ids: refs.slice(i, i + 50).join("|"),
        props: "labels",
        languages: "fr",
      });
      for (const [q, e] of Object.entries(l.entities)) if (e.labels?.fr) libelles[q] = e.labels.fr.value;
    }
    const faits = extraireFaits(claims, libelles, type);
    return faitsVides(faits) ? null : faits;
  },
  ["faits-wikidata"],
  { revalidate: 604800 }
);

/** Faits Wikidata d'une fiche, ou null (pas d'identifiant, rien d'utile, Wikidata en panne) */
export async function getFaitsWikidata(qid: string | undefined, type: "film" | "serie"): Promise<FaitsWikidata | null> {
  if (!qid || !/^Q\d+$/.test(qid)) return null;
  try {
    return await faitsEnCache(qid, type);
  } catch (err) {
    console.error(`[wikidata] ${qid} :`, err);
    return null;
  }
}
