/**
 * Import des films ayant réalisé plus d'un million d'entrées en France (CNC,
 * data.gouv.fr, Licence Ouverte) :
 *   node scripts/import-entrees-cnc.mjs            télécharge et écrit le fichier
 *   node scripts/import-entrees-cnc.mjs --dry-run  affiche le bilan sans rien écrire
 *
 * Sortie : data/publiques/entrees-cnc.json.br, lu côté serveur par
 * lib/entrees-donnees.ts. Une ligne par film et par année civile (une feuille
 * Excel par année, 2003 à l'année écoulée) : titre, date de sortie, entrées.
 * Un film n'est listé une année que s'il y a dépassé le million d'entrées.
 *
 * Le fichier est un .xlsx (zip de XML) : lu sans dépendance, avec zlib.
 * Mise à jour : annuelle côté CNC (mai). Relancer le script, puis commiter.
 * Node ≥ 18 (fetch natif).
 */

import { mkdir, writeFile } from "node:fs/promises";
import { brotliCompressSync, constants, inflateRawSync } from "node:zlib";

const JEU = "films-ayant-realise-plus-dun-million-dentrees";
const PAGE_JEU = `https://www.data.gouv.fr/datasets/${JEU}`;
const SORTIE = new URL("../data/publiques/entrees-cnc.json.br", import.meta.url);
const DRY_RUN = process.argv.includes("--dry-run");

/** Fichiers d'une archive zip (méthodes « stocké » et « deflate ») */
function lireZip(buf) {
  let fin = buf.length - 22;
  while (fin >= 0 && buf.readUInt32LE(fin) !== 0x06054b50) fin--;
  if (fin < 0) throw new Error("Archive zip illisible");
  const nb = buf.readUInt16LE(fin + 10);
  let p = buf.readUInt32LE(fin + 16);
  const fichiers = new Map();
  for (let i = 0; i < nb; i++) {
    const methode = buf.readUInt16LE(p + 10);
    const taille = buf.readUInt32LE(p + 20);
    const lgNom = buf.readUInt16LE(p + 28);
    const lgExtra = buf.readUInt16LE(p + 30);
    const lgComm = buf.readUInt16LE(p + 32);
    const local = buf.readUInt32LE(p + 42);
    const nom = buf.toString("utf8", p + 46, p + 46 + lgNom);
    const debut = local + 30 + buf.readUInt16LE(local + 26) + buf.readUInt16LE(local + 28);
    const brut = buf.subarray(debut, debut + taille);
    fichiers.set(nom, methode === 0 ? brut : inflateRawSync(brut));
    p += 46 + lgNom + lgExtra + lgComm;
  }
  return fichiers;
}

const entites = (s) =>
  s
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&amp;/g, "&");

/** Numéro de série Excel → AAAA-MM-JJ */
function dateExcel(n) {
  const d = new Date(Date.UTC(1899, 11, 30) + Math.round(n) * 86400000);
  return d.toISOString().slice(0, 10);
}

async function main() {
  const meta = await fetch(`https://www.data.gouv.fr/api/1/datasets/${JEU}/`).then((r) => {
    if (!r.ok) throw new Error(`data.gouv.fr ${r.status}`);
    return r.json();
  });
  if (!/lo|ouverte/i.test(meta.license ?? "")) throw new Error(`Licence inattendue : ${meta.license}`);
  const ressource = meta.resources.find((r) => /xlsx/i.test(r.format ?? "") || /\.xlsx/i.test(r.url));
  if (!ressource) throw new Error("Aucune ressource xlsx");
  const rep = await fetch(ressource.url, { redirect: "follow" });
  if (!rep.ok) throw new Error(`xlsx ${rep.status}`);
  const zip = lireZip(Buffer.from(await rep.arrayBuffer()));

  const texte = (nom) => zip.get(nom)?.toString("utf8") ?? "";
  const partages = [...texte("xl/sharedStrings.xml").matchAll(/<si>([\s\S]*?)<\/si>/g)].map((m) =>
    entites(m[1].replace(/<[^>]+>/g, "")).replace(/\s+/g, " ").trim()
  );
  const cibles = new Map(
    [...texte("xl/_rels/workbook.xml.rels").matchAll(/<Relationship\b([^>]*)\/?>/g)].map((m) => [
      m[1].match(/Id="([^"]+)"/)?.[1],
      m[1].match(/Target="([^"]+)"/)?.[1],
    ])
  );

  const lignes = [];
  for (const m of texte("xl/workbook.xml").matchAll(/<sheet\b([^>]*)\/>/g)) {
    const nom = m[1].match(/name="([^"]+)"/)?.[1] ?? "";
    if (!/^\d{4}$/.test(nom)) continue; // « Sommaire » et feuilles techniques
    const cible = cibles.get(m[1].match(/r:id="([^"]+)"/)?.[1]);
    const xml = texte(`xl/${cible.replace(/^\/?(xl\/)?/, "")}`);
    for (const ligne of xml.matchAll(/<row\b[^>]*>([\s\S]*?)<\/row>/g)) {
      const cellules = {};
      for (const c of ligne[1].matchAll(/<c r="([A-Z]+)\d+"([^>]*?)(?:\/>|>([\s\S]*?)<\/c>)/g)) {
        const v = c[3]?.match(/<v>([^<]*)<\/v>/)?.[1];
        if (v === undefined) continue;
        cellules[c[1]] = /t="s"/.test(c[2]) ? partages[Number(v)] : v;
      }
      const rang = Number(cellules.A);
      const entrees = Number(cellules.E);
      const serie = Number(cellules.D);
      if (!(rang >= 1) || !cellules.B || !(entrees >= 1_000_000) || !(serie > 30000)) continue;
      lignes.push({ titre: cellules.B, sortie: dateExcel(serie), annee: Number(nom), entrees, nationalite: cellules.C ?? "" });
    }
  }
  if (lignes.length < 500) throw new Error(`Seulement ${lignes.length} lignes : le format du CNC a changé ?`);

  const donnees = {
    source: {
      jeu: "Films ayant réalisé plus d'un million d'entrées (CNC)",
      page: PAGE_JEU,
      licence: "Licence Ouverte",
      maj: (ressource.last_modified ?? meta.last_update ?? "").slice(0, 10),
      importeLe: new Date().toISOString().slice(0, 10),
    },
    titre: lignes.map((l) => l.titre),
    sortie: lignes.map((l) => l.sortie),
    annee: lignes.map((l) => l.annee),
    entrees: lignes.map((l) => l.entrees),
    nationalite: lignes.map((l) => l.nationalite),
  };
  const br = brotliCompressSync(JSON.stringify(donnees), { params: { [constants.BROTLI_PARAM_QUALITY]: 11 } });
  const annees = lignes.map((l) => l.annee);
  console.log(
    `${lignes.length} lignes (film × année), ${Math.min(...annees)}-${Math.max(...annees)}. ` +
      `Mise à jour CNC : ${donnees.source.maj}. Fichier : ${(br.length / 1024).toFixed(0)} Ko.`
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
