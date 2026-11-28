/**
 * Connexion MariaDB des scripts (relevé, migrations), depuis les variables
 * d'environnement DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD.
 * Sur le serveur : les lancer avec `node --env-file=<chemin>/.env.production …`.
 */

import mysql from "mysql2/promise";

/** Configuration de la base, ou null si une variable manque */
export function configDb() {
  const { DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD } = process.env;
  if (!DB_HOST || !DB_NAME || !DB_USER || DB_PASSWORD === undefined) return null;
  return {
    host: DB_HOST,
    port: Number(DB_PORT || 3306),
    database: DB_NAME,
    user: DB_USER,
    password: DB_PASSWORD,
    // Les colonnes DATE restent des chaînes AAAA-MM-JJ : pas de fuseau horaire en jeu
    dateStrings: true,
    charset: "utf8mb4",
  };
}

export async function connecter(options = {}) {
  const config = configDb();
  if (!config) {
    throw new Error("Base non configurée : DB_HOST, DB_NAME, DB_USER et DB_PASSWORD sont requis.");
  }
  return mysql.createConnection({ ...config, ...options });
}
