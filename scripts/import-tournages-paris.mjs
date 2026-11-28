/**
 * Import des lieux de tournage à Paris (Ville de Paris, opendata.paris.fr, licence ODbL) :
 *   node scripts/import-tournages-paris.mjs            télécharge et écrit le fichier
 *   node scripts/import-tournages-paris.mjs --dry-run  affiche le bilan sans rien écrire
 *
 * Sortie : data/publiques/tournages-paris.json.br, lu côté serveur par
 * lib/tournages-donnees.ts. Garde les champs utiles au rapprochement et à
 * l'affichage (titre, type, année, réalisateur, producteur, adresse,
 * arrondissement), rangés par colonne. Le rapprochement avec les fiches TMDB se
 * fait à l'exécution (lib/tournages.ts).
 *
 * Mise à jour : la Ville publie l'année écoulée en début d'année (l'année en
 * cours n'est jamais diffusée). Relancer le script une fois par an, puis
 * commiter le fichier. Node ≥ 18 (fetch natif), aucune dépendance.
 */

import { mkdir, writeFile } from "node:fs/promises";
import { brotliCompressSync, constants } from "node:zlib";

const API = "https://opendata.paris.fr/api/explore/v2.1/catalog/datasets/lieux-de-tournage-a-paris";
const PAGE_JEU = "https://opendata.paris.fr/explore/dataset/lieux-de-tournage-a-paris/";
const SORTIE = new URL("../data/publiques/tournages-paris.json.br", import.meta.url);
const DRY_RUN = process.argv.includes("--dry-run");

const propre = (s) => (s ?? "").toString().replace(/ /g, " ").replace(/\s+/g, " ").trim();

async function json(url) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`opendata.paris.fr ${r.status} : ${url}`);
  return r.json();
}

async function main() {
  const meta = await json(API);
  const licence = meta?.metas?.default?.license ?? "";
  if (!/odbl|open database/i.test(licence)) throw new Error(`Licence inattendue : « ${licence} » (vérifier avant d'importer)`);
  const lignes = await json(`${API}/exports/json`);
  if (!Array.isArray(lignes) || lignes.length === 0) throw new Error("Export vide");

  const types = [];
  const garde = [];
  for (const l of lignes) {
    const titre = propre(l.nom_tournage);
    const annee = Number(String(l.annee_tournage ?? "").slice(0, 4));
    if (!titre || !Number.isInteger(annee)) continue;
    const type = propre(l.type_tournage);
    if (!types.includes(type)) types.push(type);
    garde.push({
      titre,
      type: types.indexOf(type),
      annee,
      realisation: propre(l.nom_realisateur),
      production: propre(l.nom_producteur),
      adresse: propre(l.adresse_lieu),
      ardt: propre(l.ardt_lieu),
    });
  }

  const donnees = {
    source: {
      jeu: "Lieux de tournage à Paris (Ville de Paris)",
      page: PAGE_JEU,
      licence: "ODbL",
      // « modified » ne bouge pas quand les données changent : date du dernier traitement des données
      maj: String(meta?.metas?.default?.data_processed ?? meta?.metas?.default?.modified ?? "").slice(0, 10),
      importeLe: new Date().toISOString().slice(0, 10),
    },
    types,
    titre: garde.map((l) => l.titre),
    type: garde.map((l) => l.type),
    annee: garde.map((l) => l.annee),
    realisation: garde.map((l) => l.realisation),
    production: garde.map((l) => l.production),
    adresse: garde.map((l) => l.adresse),
    ardt: garde.map((l) => l.ardt),
  };
  const br = brotliCompressSync(JSON.stringify(donnees), { params: { [constants.BROTLI_PARAM_QUALITY]: 11 } });
  const annees = garde.map((l) => l.annee);

  console.log(
    `${lignes.length} lieux lus, ${garde.length} gardés, tournages ${Math.min(...annees)}-${Math.max(...annees)}, ` +
      `types : ${types.join(", ")}. Mise à jour Ville de Paris : ${donnees.source.maj}. Fichier : ${(br.length / 1024).toFixed(0)} Ko.`
  );
  if (DRY_RUN) return;
  await mkdir(new URL(".", SORTIE), { recursive: true });
  await writeFile(SORTIE, br);
  console.log(`Écrit : ${SORTIE.pathname}`);
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
