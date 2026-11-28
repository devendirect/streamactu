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
  /^[Gg]rand prix du Festival de Cannes\b/, // libellé Wikidata en minuscule (Q844804)
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
  adapteDe: OeuvreSource[];
  tournage: string[];
  allocine: string | null;
  senscritique: string | null;
  /** Fiche UniFrance (P3961, films seulement : la propriété ne vise que les films) */
  unifrance: string | null;
}

/** Œuvre adaptée : auteurs (P50) et première publication (P577) seulement pour une œuvre écrite */
export interface OeuvreSource {
  libelle: string;
  auteurs: string[];
  annee: number | null;
  /** Identifiant BnF de l'œuvre (P268), pour le lien data.bnf.fr */
  bnf: string | null;
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

/** Identifiant TMDB dans Wikidata : P4947 (film), P4983 (série) */
const PROPRIETE_TMDB = { film: "P4947", serie: "P4983" } as const;

/**
 * L'élément est-il bien la fiche TMDB ? « confirme » s'il porte cet identifiant
 * TMDB, « autre » s'il en porte seulement d'autres, « absent » s'il n'en a aucun.
 */
export function identiteTmdb(claims: Declarations, type: "film" | "serie", tmdbId: number): "confirme" | "autre" | "absent" {
  const ids = valeurs(claims, PROPRIETE_TMDB[type]).map(chaine).filter(Boolean);
  if (ids.length === 0) return "absent";
  return ids.includes(String(tmdbId)) ? "confirme" : "autre";
}

/** Œuvres adaptées (P144) : leurs déclarations sont lues pour l'auteur et la date */
export function oeuvresSourcesReferencees(claims: Declarations): string[] {
  return [...new Set(valeurs(claims, "P144").map(idEntite).filter((q): q is string => !!q))];
}

/** Entités à libeller : œuvres adaptées et leurs auteurs, lieux et prix */
export function entitesReferencees(claims: Declarations, sources: Record<string, Declarations> = {}): string[] {
  const auteurs = Object.values(sources).flatMap((s) => valeurs(s, "P50").map(idEntite));
  return [
    ...new Set(
      [...["P144", "P915", "P166"].flatMap((p) => valeurs(claims, p).map(idEntite)), ...auteurs].filter(
        (q): q is string => !!q
      )
    ),
  ];
}

/** Première année de publication (P577), ou null */
function anneePublication(claims: Declarations): number | null {
  const annees = valeurs(claims, "P577")
    .map((d) => (d.mainsnak.datavalue?.value as { time?: string } | undefined)?.time)
    .map((t) => (t ? Number(t.replace(/^[+]/, "").slice(0, 4)) : NaN))
    .filter((a) => Number.isFinite(a) && a > 0);
  return annees.length ? Math.min(...annees) : null;
}

/**
 * « Le Comte de Monte-Cristo, d'Alexandre Dumas (1844) » ; « Vision » ;
 * « Les Enfants de la Résistance, de Vincent Dugomier et Benoît Ers ».
 */
export function phraseOeuvreSource(o: OeuvreSource): string {
  if (o.auteurs.length === 0) return o.annee ? `${o.libelle} (${o.annee})` : o.libelle;
  const noms = o.auteurs.length === 1 ? o.auteurs[0] : `${o.auteurs.slice(0, -1).join(", ")} et ${o.auteurs.at(-1)}`;
  // Élision devant une voyelle seulement : devant un h, l'usage varie selon le nom
  const de = /^[aeiouyàâéèêëîïôöûüœ]/i.test(noms) ? "d'" : "de ";
  return `${o.libelle}, ${de}${noms}${o.annee ? ` (${o.annee})` : ""}`;
}

/**
 * Notice data.bnf.fr d'une œuvre, depuis son identifiant BnF (P268), ou null si
 * l'identifiant n'a pas le format attendu (P1793 de P268, relevé le 2026-11-28).
 */
export function lienBnf(id: string | null): string | null {
  if (!id || !/^\d{8,9}[0-9bcdfghjkmnpqrstvwxz]$/.test(id)) return null;
  return `https://data.bnf.fr/ark:/12148/cb${id}`;
}

/** Faits d'une fiche à partir des déclarations et des libellés français des entités citées */
export function extraireFaits(
  claims: Declarations,
  libelles: Record<string, string>,
  type: "film" | "serie",
  sources: Record<string, Declarations> = {}
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
  const idUnifrance = type === "film" ? valeurs(claims, "P3961").map(chaine).find(Boolean) : null;

  const vuesSources = new Set<string>();
  const adapteDe: OeuvreSource[] = [];
  for (const q of oeuvresSourcesReferencees(claims)) {
    const libelle = libelles[q];
    if (!libelle || vuesSources.has(libelle)) continue;
    vuesSources.add(libelle);
    const s = sources[q] ?? {};
    const auteurs = [...new Set(valeurs(s, "P50").map((d) => libelles[idEntite(d) ?? ""]).filter(Boolean))];
    adapteDe.push({
      libelle,
      auteurs,
      // Sans auteur, ce n'est pas une œuvre écrite (personnage, lieu…) : pas d'année non plus
      annee: auteurs.length ? anneePublication(s) : null,
      bnf: valeurs(s, "P268").map(chaine).find(Boolean) ?? null,
    });
  }

  return {
    prix: uniques.slice(0, MAX_PRIX).map(({ libelle, annee }) => ({ libelle, annee })),
    autresPrix: Math.max(0, uniques.length - MAX_PRIX),
    adapteDe,
    tournage: libellesDe("P915", MAX_LIEUX),
    // Formats d'URL des propriétés Wikidata (P1630), relevés le 2026-10-23
    allocine: idAllocine
      ? type === "film"
        ? `https://www.allocine.fr/film/fichefilm_gen_cfilm=${encodeURIComponent(idAllocine)}.html`
        : `https://www.allocine.fr/series/ficheserie_gen_cserie=${encodeURIComponent(idAllocine)}.html`
      : null,
    senscritique: idSensCritique ? `https://www.senscritique.com/film/-/${encodeURIComponent(idSensCritique)}` : null,
    // Format d'URL P1630 de P3961, relevé le 2026-11-28
    unifrance: idUnifrance ? `https://www.unifrance.org/film/${encodeURIComponent(idUnifrance)}` : null,
  };
}

/** Rien à montrer ? */
export function faitsVides(f: FaitsWikidata): boolean {
  return (
    !f.prix.length && !f.adapteDe.length && !f.tournage.length && !f.allocine && !f.senscritique && !f.unifrance
  );
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
async function declarations(qid: string): Promise<Declarations> {
  const r = await api<{ entities: Record<string, { claims?: Declarations }> }>({
    action: "wbgetentities",
    ids: qid,
    props: "claims",
  });
  return r.entities[qid]?.claims ?? {};
}

/** Éléments Wikidata qui portent cet identifiant TMDB (recherche « haswbstatement ») */
async function elementsParTmdb(type: "film" | "serie", tmdbId: number): Promise<string[]> {
  const r = await api<{ query?: { search?: { title: string }[] } }>({
    action: "query",
    list: "search",
    srsearch: `haswbstatement:${PROPRIETE_TMDB[type]}=${tmdbId}`,
    srlimit: "3",
  });
  return (r.query?.search ?? []).map((s) => s.title).filter((t) => /^Q\d+$/.test(t));
}

const faitsEnCache = unstable_cache(
  async (qidTmdb: string | null, type: "film" | "serie", tmdbId: number): Promise<FaitsWikidata | null> => {
    // L'identifiant Wikidata donné par TMDB peut être faux (Les Enfants de la
    // Résistance → la BD Q109043201) : on le contrôle par l'identifiant TMDB
    let qid: string | null = qidTmdb;
    let claims: Declarations = qid ? await declarations(qid) : {};
    const verdict = qid ? identiteTmdb(claims, type, tmdbId) : "absent";
    if (verdict !== "confirme") {
      const trouves = await elementsParTmdb(type, tmdbId);
      if (trouves.length === 1 && trouves[0] !== qid) {
        qid = trouves[0];
        claims = await declarations(qid);
      } else if (verdict === "autre" || !qid) {
        // Un autre identifiant TMDB, ou rien trouvé sans élément de départ : rien de sûr
        return null;
      }
      // Sinon : élément de TMDB sans identifiant TMDB côté Wikidata, gardé faute de mieux
    }
    // Déclarations des œuvres adaptées (auteur, date, BnF) : un appel de plus, seulement s'il y en a
    const idsSources = oeuvresSourcesReferencees(claims).slice(0, 50);
    const sources: Record<string, Declarations> = {};
    if (idsSources.length > 0) {
      const s = await api<{ entities: Record<string, { claims?: Declarations }> }>({
        action: "wbgetentities",
        ids: idsSources.join("|"),
        props: "claims",
      });
      for (const [q, e] of Object.entries(s.entities)) if (e.claims) sources[q] = e.claims;
    }
    // Libellés français des entités citées, par lots de 50 (limite de l'API)
    const refs = entitesReferencees(claims, sources);
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
    const faits = extraireFaits(claims, libelles, type, sources);
    return faitsVides(faits) ? null : faits;
  },
  // v2 (2026-11-28) : adapteDe passe de string[] à OeuvreSource[] ; nouvelle clé
  // pour ne jamais relire l'ancienne forme encore en cache
  ["faits-wikidata-v2"],
  { revalidate: 604800 }
);

/**
 * Faits Wikidata d'une fiche, ou null (rien de sûr, rien d'utile, Wikidata en panne).
 * Sans identifiant chez TMDB, l'élément est cherché par l'identifiant TMDB.
 */
export async function getFaitsWikidata(
  qid: string | undefined,
  type: "film" | "serie",
  tmdbId: number
): Promise<FaitsWikidata | null> {
  const depart = qid && /^Q\d+$/.test(qid) ? qid : null;
  try {
    return await faitsEnCache(depart, type, tmdbId);
  } catch (err) {
    console.error(`[wikidata] ${depart ?? "-"} (TMDB ${type} ${tmdbId}) :`, err);
    return null;
  }
}
