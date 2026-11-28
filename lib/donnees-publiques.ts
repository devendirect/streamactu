/**
 * Lecture des fichiers de données publiques importés (data/publiques/*.json.br,
 * écrits par scripts/import-*.mjs). Côté serveur uniquement : chaque fichier est
 * lu une fois par processus. S'il manque ou est illisible, on renvoie null et
 * la fiche s'affiche sans le bloc concerné, jamais d'erreur.
 * Chaque fichier doit figurer dans outputFileTracingIncludes (next.config.ts).
 */

import { readFileSync } from "node:fs";
import path from "node:path";
import { brotliDecompressSync } from "node:zlib";

const cache = new Map<string, unknown>();

export function chargerDonneesPubliques<F, R>(fichier: string, preparer: (f: F) => R): R | null {
  if (cache.has(fichier)) return cache.get(fichier) as R | null;
  let resultat: R | null = null;
  try {
    const brut = readFileSync(path.join(process.cwd(), "data", "publiques", fichier));
    resultat = preparer(JSON.parse(brotliDecompressSync(brut).toString("utf-8")) as F);
  } catch (err) {
    console.error(`[données publiques] ${fichier} illisible :`, err instanceof Error ? err.message : err);
  }
  cache.set(fichier, resultat);
  return resultat;
}
