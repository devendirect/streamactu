/**
 * Chargement du fichier des visas du CNC (data/publiques/visas-cnc.json.br),
 * une seule fois par processus et seulement quand une fiche film le demande.
 * Côté serveur uniquement. Si le fichier manque ou est illisible, la fiche
 * garde la classification TMDB : on ne casse jamais la page.
 */

import { readFileSync } from "node:fs";
import path from "node:path";
import { brotliDecompressSync } from "node:zlib";
import type { Film } from "@/types";
import { construireIndex, trouverVisa, type FichierVisas, type IndexVisas, type VisaCNC } from "@/lib/visas";

const FICHIER = path.join(process.cwd(), "data", "publiques", "visas-cnc.json.br");

export interface SourceVisas {
  page: string;
  maj: string;
}

let charge: { index: IndexVisas; source: SourceVisas } | null | undefined;

function charger() {
  if (charge !== undefined) return charge;
  try {
    const f = JSON.parse(brotliDecompressSync(readFileSync(FICHIER)).toString("utf-8")) as FichierVisas;
    charge = { index: construireIndex(f), source: { page: f.source.page, maj: f.source.maj } };
  } catch (err) {
    console.error("[visas] fichier CNC illisible :", err instanceof Error ? err.message : err);
    charge = null;
  }
  return charge;
}

/** Visa d'un film et la source à citer, ou null */
export function visaFilm(film: Film): { visa: VisaCNC; source: SourceVisas } | null {
  const donnees = charger();
  if (!donnees) return null;
  const visa = trouverVisa(donnees.index, {
    titre: film.titre,
    titreOriginal: film.titreOriginal,
    annees: [film.annee, film.anneeSalleFR ?? 0],
    realisateurs: film.realisateurs,
  });
  return visa ? { visa, source: donnees.source } : null;
}
