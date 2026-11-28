/**
 * Applique les migrations SQL de scripts/db/migrations/ qui ne l'ont pas encore
 * été, dans l'ordre de leur nom (001-…, 002-…). Chaque migration appliquée est
 * notée dans la table schema_migrations : relancer le script ne refait rien.
 *
 *   node --env-file=<chemin>/.env.production scripts/migrer-db.mjs
 *   node --env-file=… scripts/migrer-db.mjs --liste   (affiche l'état sans rien appliquer)
 *
 * À lancer après chaque déploiement qui ajoute une migration, avant le relevé.
 */

import { readdir, readFile } from "node:fs/promises";
import { connecter } from "./lib/db.mjs";

const DOSSIER = new URL("./db/migrations/", import.meta.url);
const LISTE = process.argv.includes("--liste");

async function main() {
  const db = await connecter({ multipleStatements: true });
  try {
    await db.query(
      `CREATE TABLE IF NOT EXISTS schema_migrations (
         nom VARCHAR(190) NOT NULL PRIMARY KEY,
         appliquee_le DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
       ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`
    );
    const [lignes] = await db.query("SELECT nom FROM schema_migrations");
    const faites = new Set(lignes.map((l) => l.nom));
    const fichiers = (await readdir(DOSSIER)).filter((f) => /^\d{3}-.+\.sql$/.test(f)).sort();

    for (const f of fichiers) {
      if (faites.has(f)) {
        console.log(`déjà appliquée : ${f}`);
        continue;
      }
      if (LISTE) {
        console.log(`à appliquer    : ${f}`);
        continue;
      }
      const sql = await readFile(new URL(f, DOSSIER), "utf8");
      // MariaDB valide chaque CREATE TABLE à part (pas de transaction sur le DDL) :
      // en cas d'erreur au milieu, corriger puis supprimer les tables créées avant de relancer
      await db.query(sql);
      await db.query("INSERT INTO schema_migrations (nom) VALUES (?)", [f]);
      console.log(`appliquée      : ${f}`);
    }
  } finally {
    await db.end();
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
