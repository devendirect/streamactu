/**
 * Import des lieux de tournage en France (Wikidata, CC0) des films et séries
 * disponibles en streaming sur une plateforme suivie :
 *   node --env-file=.env.local scripts/import-tournages-france.mjs
 *   … --dry-run   affiche le bilan sans rien écrire
 *
 * Sortie : data/publiques/tournages-france.json.br, lu par lib/lieux-tournage-donnees.ts
 * pour la page /lieux-de-tournage.
 *
 * 1. Wikidata : titres ayant un identifiant TMDB (P4947 film, P4983 série) et un
 *    lieu de tournage (P915) situé en France (P17), outre-mer compris.
 * 2. Wikidata : pour chaque lieu, sa commune (P131* jusqu'à une commune) et sa
 *    région (région de France, ou région d'outre-mer), avec coordonnées (P625).
 * 3. TMDB : titre français, année et disponibilité en France ; ne sont gardés
 *    que les titres disponibles ce jour-là sur une plateforme suivie
 *    (variantes de lib/fournisseurs-releve.json). La page relit ensuite les
 *    plateformes chaque jour.
 *
 * Mise à jour : une fois par trimestre (relancer, puis commiter le fichier).
 * Node ≥ 20.6. Environ 2 000 appels TMDB (≈ 4 min) et une dizaine de requêtes Wikidata.
 */

import { mkdir, readFile, writeFile } from "node:fs/promises";
import { brotliCompressSync, constants } from "node:zlib";

const SORTIE = new URL("../data/publiques/tournages-france.json.br", import.meta.url);
const DRY_RUN = process.argv.includes("--dry-run");
const UA = "StreamActuBot/1.0 (https://streamactu.fr/contact)";
const SPARQL = "https://query.wikidata.org/sparql";

/** Régions actuelles (libellés Wikidata) ; les anciennes sont ramenées à leur région de 2016 */
const REGIONS = [
  "Île-de-France", "Provence-Alpes-Côte d'Azur", "Auvergne-Rhône-Alpes", "Occitanie", "Nouvelle-Aquitaine",
  "Hauts-de-France", "Grand Est", "Normandie", "Bretagne", "Centre-Val de Loire", "Bourgogne-Franche-Comté",
  "Pays de la Loire", "Corse", "La Réunion", "Guadeloupe", "Martinique", "Guyane", "Mayotte",
];
const ANCIENNES = {
  "Rhône-Alpes": "Auvergne-Rhône-Alpes", Auvergne: "Auvergne-Rhône-Alpes",
  "région Alsace": "Grand Est", Alsace: "Grand Est", Lorraine: "Grand Est", "Champagne-Ardenne": "Grand Est",
  Picardie: "Hauts-de-France", "Nord-Pas-de-Calais": "Hauts-de-France",
  Aquitaine: "Nouvelle-Aquitaine", Limousin: "Nouvelle-Aquitaine", "Poitou-Charentes": "Nouvelle-Aquitaine",
  Bourgogne: "Bourgogne-Franche-Comté", "Franche-Comté": "Bourgogne-Franche-Comté",
  "Haute-Normandie": "Normandie", "Basse-Normandie": "Normandie",
  "Languedoc-Roussillon": "Occitanie", "Midi-Pyrénées": "Occitanie",
};
/** Région actuelle d'un lieu, ou null (lieu « France », région inconnue, découpage ancien ambigu) */
export function regionActuelle(libelles) {
  const actuelles = new Set();
  for (const l of libelles) {
    if (REGIONS.includes(l)) actuelles.add(l);
    else if (ANCIENNES[l]) actuelles.add(ANCIENNES[l]);
  }
  // « Provence-Côte d'Azur-Corse » (circonscription ancienne) seule ne permet pas de choisir
  return actuelles.size === 1 ? [...actuelles][0] : null;
}

const attendre = (ms) => new Promise((r) => setTimeout(r, ms));

async function sparql(requete) {
  for (let essai = 1; essai <= 6; essai++) {
    let pause = 5000 * essai;
    try {
      const r = await fetch(SPARQL, {
        method: "POST",
        headers: {
          "User-Agent": UA,
          Accept: "application/sparql-results+json",
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({ query: requete }),
        signal: AbortSignal.timeout(65000),
      });
      if (r.ok) return (await r.json()).results.bindings;
      // 429 : Wikidata indique combien de secondes attendre
      const apres = Number(r.headers.get("retry-after"));
      if (Number.isFinite(apres) && apres > 0) pause = (apres + 1) * 1000;
      if (essai === 6) throw new Error(`Wikidata ${r.status}`);
    } catch (err) {
      if (essai === 6) throw err;
    }
    console.log(`  Wikidata occupé, nouvel essai dans ${Math.round(pause / 1000)} s`);
    await attendre(pause);
  }
}

const qid = (uri) => uri.split("/").pop();

const COMMUNE = "Q484170"; // commune de France
const CLASSES_REGION = new Set(["Q36784", "Q202216"]); // région de France, région d'outre-mer

/** Valeurs d'entités d'une propriété (déclarations non dépréciées) */
const valeursEntites = (claims, p) =>
  (claims?.[p] ?? []).filter((d) => d.rank !== "deprecated").map((d) => d.mainsnak?.datavalue?.value?.id).filter(Boolean);

/**
 * Charge les lieux et tous leurs ancêtres administratifs (P131), par l'API
 * wbgetentities (50 éléments par appel). Renvoie qid → { nom, classes, parents, coord }.
 */
async function remonterHierarchie(depart) {
  const entites = new Map();
  let aCharger = [...new Set(depart)];
  for (let niveau = 0; niveau < 10 && aCharger.length > 0; niveau++) {
    const nouveaux = new Set();
    for (let i = 0; i < aCharger.length; i += 50) {
      const ids = aCharger.slice(i, i + 50).join("|");
      let rep;
      for (let essai = 1; essai <= 5 && !rep; essai++) {
        try {
          const r = await fetch(
            `https://www.wikidata.org/w/api.php?${new URLSearchParams({ action: "wbgetentities", ids, props: "claims|labels", languages: "fr|en", format: "json", maxlag: "5" })}`,
            { headers: { "User-Agent": UA }, signal: AbortSignal.timeout(30000) }
          );
          const j = r.ok ? await r.json() : null;
          if (j?.entities) rep = j;
          else await attendre(3000 * essai);
        } catch {
          await attendre(3000 * essai);
        }
      }
      if (!rep) throw new Error("Wikidata wbgetentities indisponible");
      for (const [q, e] of Object.entries(rep.entities)) {
        if (e.missing !== undefined) continue;
        const coord = e.claims?.P625?.find((d) => d.rank !== "deprecated")?.mainsnak?.datavalue?.value;
        const parents = valeursEntites(e.claims, "P131");
        entites.set(q, {
          nom: e.labels?.fr?.value ?? e.labels?.en?.value ?? q,
          classes: valeursEntites(e.claims, "P31"),
          parents,
          coord: coord ? [coord.longitude, coord.latitude] : null,
        });
        for (const p of parents) if (!entites.has(p)) nouveaux.add(p);
      }
      await attendre(300);
    }
    aCharger = [...nouveaux].filter((q) => !entites.has(q));
    console.log(`Wikidata : niveau ${niveau + 1}, ${entites.size} éléments chargés`);
  }
  return entites;
}

/** Commune la plus proche (le lieu lui-même compris) et régions, en remontant P131 */
export function ancetres(q, entites) {
  let commune = null;
  const regions = new Set();
  const vus = new Set();
  let niveau = [q];
  for (let profondeur = 0; profondeur < 10 && niveau.length > 0; profondeur++) {
    const suivant = [];
    const communesDuNiveau = [];
    for (const x of niveau) {
      if (vus.has(x)) continue;
      vus.add(x);
      const e = entites.get(x);
      if (!e) continue;
      if (e.classes.includes(COMMUNE)) communesDuNiveau.push(x);
      if (e.classes.some((c) => CLASSES_REGION.has(c))) regions.add(x);
      suivant.push(...e.parents);
    }
    // Une seule commune au premier niveau qui en a une, sinon aucune (lieu à cheval sur plusieurs)
    if (!commune && communesDuNiveau.length > 0) commune = communesDuNiveau.length === 1 ? communesDuNiveau[0] : "";
    niveau = suivant;
  }
  return { commune: commune || null, regions: [...regions] };
}

let prochain = 0;
async function tmdb(chemin) {
  const url = new URL(`https://api.themoviedb.org/3${chemin}`);
  url.searchParams.set("language", "fr-FR");
  url.searchParams.set("append_to_response", "watch/providers");
  const headers = { Accept: "application/json" };
  if (process.env.TMDB_API_TOKEN) headers.Authorization = `Bearer ${process.env.TMDB_API_TOKEN}`;
  else url.searchParams.set("api_key", process.env.TMDB_API_KEY ?? "");
  for (let essai = 1; essai <= 4; essai++) {
    const depart = Math.max(Date.now(), prochain);
    prochain = depart + 100;
    await attendre(Math.max(0, depart - Date.now()));
    try {
      const r = await fetch(url, { headers, signal: AbortSignal.timeout(15000) });
      if (r.status === 404) return null;
      if (r.ok) return await r.json();
      if (r.status !== 429 && r.status < 500) throw new Error(`TMDB ${r.status} ${chemin}`);
    } catch (err) {
      if (essai === 4) throw err;
    }
    await attendre(1000 * 2 ** essai);
  }
  return null;
}

async function main() {
  if (!process.env.TMDB_API_TOKEN && !process.env.TMDB_API_KEY) throw new Error("TMDB_API_TOKEN (ou TMDB_API_KEY) manquant.");
  const { plateformes } = JSON.parse(await readFile(new URL("../lib/fournisseurs-releve.json", import.meta.url), "utf8"));
  const plateformeDe = new Map(plateformes.flatMap((p) => p.fournisseurs.map((f) => [f, p.id])));

  // 1. Titres et lieux
  const lignes = [];
  for (const [type, prop] of [["film", "P4947"], ["serie", "P4983"]]) {
    const b = await sparql(
      `SELECT ?tmdb ?lieu WHERE { ?o wdt:${prop} ?tmdb ; wdt:P915 ?lieu . ?lieu wdt:P17 wd:Q142 . }`
    );
    for (const x of b) if (/^\d+$/.test(x.tmdb.value)) lignes.push({ type, id: Number(x.tmdb.value), lieu: qid(x.lieu.value) });
    console.log(`Wikidata : ${b.length} lignes (${type})`);
  }

  // 2. Lieux : nom, commune, région, coordonnées
  // « France » (Q142) comme lieu ne dit rien de la région ni de la commune
  const idsLieux = [...new Set(lignes.map((l) => l.lieu))].filter((q) => q !== "Q142").sort();
  // Remontée de la hiérarchie administrative (P131) par l'API Wikidata, niveau par
  // niveau : les requêtes SPARQL avec P131* dépassent trop souvent le délai.
  const entites = await remonterHierarchie(idsLieux);
  const lieux = {};
  for (const q of idsLieux) {
    const e = entites.get(q);
    if (!e) continue;
    const { commune, regions } = ancetres(q, entites);
    lieux[q] = {
      nom: e.nom,
      coord: e.coord,
      commune: commune ? { id: commune, nom: entites.get(commune).nom, coord: entites.get(commune).coord } : null,
      region: regionActuelle(regions.map((r) => entites.get(r).nom)),
    };
  }

  // 3. TMDB : titre, année, disponibilité
  const titres = new Map();
  for (const l of lignes) {
    const cle = `${l.type}-${l.id}`;
    const t = titres.get(cle) ?? { type: l.type, id: l.id, lieux: new Set() };
    t.lieux.add(l.lieu);
    titres.set(cle, t);
  }
  const gardes = [];
  let n = 0;
  for (const t of titres.values()) {
    if (++n % 250 === 0) console.log(`TMDB : ${n} / ${titres.size}`);
    const d = await tmdb(`/${t.type === "film" ? "movie" : "tv"}/${t.id}`);
    if (!d) continue;
    const pf = [...new Set((d["watch/providers"]?.results?.FR?.flatrate ?? []).map((p) => plateformeDe.get(p.provider_id)).filter(Boolean))];
    if (pf.length === 0) continue;
    const date = t.type === "film" ? d.release_date : d.first_air_date;
    gardes.push({
      type: t.type,
      id: t.id,
      titre: t.type === "film" ? d.title : d.name,
      annee: date ? Number(date.slice(0, 4)) : null,
      votes: d.vote_count ?? 0,
      lieux: [...t.lieux].filter((q) => lieux[q]),
    });
  }

  // Lieux des titres gardés seulement
  const utiles = new Set(gardes.flatMap((t) => t.lieux));
  const donnees = {
    source: {
      jeu: "Wikidata (lieux de tournage, CC0) et TMDB (titres et disponibilités)",
      page: "https://www.wikidata.org/wiki/Property:P915",
      licence: "CC0 (Wikidata)",
      maj: new Date().toISOString().slice(0, 10),
      importeLe: new Date().toISOString().slice(0, 10),
      titresWikidata: titres.size,
    },
    titres: gardes.sort((a, b) => b.votes - a.votes),
    lieux: Object.fromEntries(Object.entries(lieux).filter(([q]) => utiles.has(q))),
  };
  const br = brotliCompressSync(JSON.stringify(donnees), { params: { [constants.BROTLI_PARAM_QUALITY]: 11 } });
  const sansRegion = Object.values(donnees.lieux).filter((l) => !l.region).length;
  console.log(
    `${titres.size} titres Wikidata, ${gardes.length} disponibles en streaming, ${Object.keys(donnees.lieux).length} lieux ` +
      `(${sansRegion} sans région sûre). Fichier : ${(br.length / 1024).toFixed(0)} Ko.`
  );
  if (DRY_RUN) return;
  await mkdir(new URL(".", SORTIE), { recursive: true });
  await writeFile(SORTIE, br);
  console.log(`Écrit : ${SORTIE.pathname}`);
}

if (import.meta.url === `file:///${process.argv[1].replace(/\\/g, "/").replace(/^\//, "")}` || process.argv[1]?.endsWith("import-tournages-france.mjs")) {
  main().catch((err) => {
    console.error(err instanceof Error ? err.message : err);
    process.exit(1);
  });
}
