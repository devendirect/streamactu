/**
 * Import de la liste des visas d'exploitation du CNC (data.gouv.fr, Licence Ouverte v2) :
 *   node scripts/import-visas-cnc.mjs            télécharge la dernière version et écrit le fichier
 *   node scripts/import-visas-cnc.mjs --dry-run  affiche le bilan sans rien écrire
 *
 * Sortie : data/publiques/visas-cnc.json.br, lu côté serveur par lib/visas-donnees.ts.
 * Ne garde que ce qui sert au rapprochement et à l'affichage : titre, année,
 * réalisation, numéro de visa, décision. Les courts métrages sont écartés ; les
 * lignes au format « Non renseigné » sont gardées (beaucoup de films anciens).
 * Le rapprochement avec les fiches TMDB se fait à l'exécution (lib/visas.ts).
 *
 * Mise à jour : ponctuelle côté CNC (dernière le 13/11/2025). Relancer le script
 * quand data.gouv.fr annonce une nouvelle version, puis commiter le fichier.
 * Node ≥ 18 (fetch natif), aucune dépendance.
 */

import { mkdir, writeFile } from "node:fs/promises";
import { brotliCompressSync, constants } from "node:zlib";

const JEU = "6311c164ebfb165ddc828ded";
const PAGE_JEU = `https://www.data.gouv.fr/datasets/${JEU}`;
const SORTIE = new URL("../data/publiques/visas-cnc.json.br", import.meta.url);
const DRY_RUN = process.argv.includes("--dry-run");

/** CSV « ; » avec champs entre guillemets, guillemets doublés et retours à la ligne */
function lireCsv(texte) {
  const lignes = [];
  let ligne = [];
  let champ = "";
  let guillemets = false;
  for (let i = 0; i < texte.length; i++) {
    const c = texte[i];
    if (guillemets) {
      if (c === '"' && texte[i + 1] === '"') {
        champ += '"';
        i++;
      } else if (c === '"') guillemets = false;
      else champ += c;
    } else if (c === '"') guillemets = true;
    else if (c === ";") {
      ligne.push(champ);
      champ = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && texte[i + 1] === "\n") i++;
      ligne.push(champ);
      lignes.push(ligne);
      ligne = [];
      champ = "";
    } else champ += c;
  }
  if (champ || ligne.length) {
    ligne.push(champ);
    lignes.push(ligne);
  }
  return lignes;
}

const propre = (s) => (s ?? "").replace(/ /g, " ").replace(/\s+/g, " ").trim();

async function main() {
  const meta = await fetch(`https://www.data.gouv.fr/api/1/datasets/${JEU}/`).then((r) => {
    if (!r.ok) throw new Error(`data.gouv.fr ${r.status}`);
    return r.json();
  });
  const ressource = meta.resources.find((r) => r.format === "csv");
  if (!ressource) throw new Error("Aucune ressource CSV dans le jeu de données");

  const reponse = await fetch(ressource.url);
  if (!reponse.ok) throw new Error(`CSV ${reponse.status}`);
  const texte = (await reponse.text()).replace(/^﻿/, "");

  const [entete, ...corps] = lireCsv(texte);
  const col = (nom) => {
    const i = entete.findIndex((e) => propre(e) === nom);
    if (i < 0) throw new Error(`Colonne absente : ${nom} (le format du CNC a changé ?)`);
    return i;
  };
  const [cTitre, cReal, cFormat, cDate, cVisa, cDecision] = [
    col("Titre"),
    col("Réalisation"),
    col("Format"),
    col("Date"),
    col("N° de visa"),
    col("Décision"),
  ];

  const vus = new Set();
  const lignes = [];
  let courts = 0;
  let sansVisa = 0;
  for (const l of corps) {
    if (l.length < entete.length) continue;
    const format = propre(l[cFormat]);
    if (format === "Court-métrage") {
      courts++;
      continue;
    }
    const visa = Number(propre(l[cVisa]));
    if (!Number.isInteger(visa) || visa <= 0) {
      sansVisa++;
      continue;
    }
    const titre = propre(l[cTitre]);
    const date = propre(l[cDate]);
    const annee = /^\d{4}$/.test(date) ? Number(date) : null;
    const real = propre(l[cReal]);
    const decision = propre(l[cDecision]);
    const cle = `${visa}|${titre}`;
    if (!titre || vus.has(cle)) continue;
    vus.add(cle);
    lignes.push([titre, annee, real === "Non renseigné" ? "" : real, visa, decision]);
  }

  // Rangement par colonne et décisions en dictionnaire : environ 20 % de moins
  // après compression qu'une liste de lignes (mesuré le 2026-11-28)
  const decisions = [...new Set(lignes.map((l) => l[4]))];
  const donnees = {
    source: {
      jeu: "Liste des visas d'exploitations cinématographiques (CNC)",
      page: PAGE_JEU,
      licence: "Licence Ouverte v2",
      maj: (ressource.last_modified ?? meta.last_update ?? "").slice(0, 10),
      importeLe: new Date().toISOString().slice(0, 10),
    },
    decisions,
    titre: lignes.map((l) => l[0]),
    annee: lignes.map((l) => l[1]),
    realisation: lignes.map((l) => l[2]),
    visa: lignes.map((l) => l[3]),
    decision: lignes.map((l) => decisions.indexOf(l[4])),
  };
  const gz = brotliCompressSync(JSON.stringify(donnees), {
    params: { [constants.BROTLI_PARAM_QUALITY]: 11 },
  });

  console.log(
    `${corps.length} lignes lues, ${lignes.length} gardées (${courts} courts métrages, ${sansVisa} sans numéro de visa écartés). ` +
      `Mise à jour CNC : ${donnees.source.maj}. Fichier : ${(gz.length / 1024).toFixed(0)} Ko.`
  );
  if (DRY_RUN) return;
  await mkdir(new URL(".", SORTIE), { recursive: true });
  await writeFile(SORTIE, gz);
  console.log(`Écrit : ${SORTIE.pathname}`);
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
