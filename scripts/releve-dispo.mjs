/**
 * Relevé quotidien des catalogues des 7 plateformes suivies en France
 * (docs/seo-geo/plan-historique-dispo.md, lot 1). À lancer par une tâche
 * planifiée Plesk, une fois par jour, avant IndexNow :
 *
 *   node --env-file=<httpdocs>/.env.production scripts/releve-dispo.mjs
 *   … --dry-run                 affiche les changements du jour sans rien écrire
 *   … --seulement=netflix       une seule plateforme (essais)
 *   … --type=film               un seul type (essais)
 *   … --forcer                  refait le relevé même s'il a déjà eu lieu aujourd'hui
 *
 * Pour chaque plateforme et chaque type, parcourt toutes les pages de
 * /discover (variantes de lib/fournisseurs-releve.json réunies), compare avec
 * l'état confirmé en base (scripts/lib/releve-logique.mjs) et enregistre les
 * arrivées et départs confirmés. Premier passage d'une plateforme : relevé de
 * référence, aucun événement. Purge de tout ce qui a plus de 6 mois
 * (conditions TMDB).
 *
 * Variables : TMDB_API_TOKEN (ou TMDB_API_KEY), DB_HOST, DB_PORT, DB_NAME,
 * DB_USER, DB_PASSWORD. Tables : scripts/migrer-db.mjs.
 * Code de sortie : 0 si tout va bien ; 1 si un relevé a échoué ou si le
 * garde-fou s'est déclenché (Plesk notifie l'erreur).
 */

import { readFile } from "node:fs/promises";
import { configDb, connecter } from "./lib/db.mjs";
import { comparer, jourParis, moinsMois } from "./lib/releve-logique.mjs";

const API = "https://api.themoviedb.org/3";
const DRY_RUN = process.argv.includes("--dry-run");
const FORCER = process.argv.includes("--forcer");
const argument = (nom) => process.argv.find((a) => a.startsWith(`--${nom}=`))?.split("=")[1];
const SEULEMENT = argument("seulement");
const TYPE = argument("type");

const CONSERVATION_MOIS = 6;
const MAX_PAGES = 500; // limite de /discover : au-delà, le relevé serait incomplet
const TRAVAILLEURS = 4;
const INTERVALLE_MS = 100; // ≈ 10 requêtes par seconde, bien sous la limite TMDB
const TENTATIVES = 4;

const TYPES = [
  { type: "film", chemin: "movie", tri: "original_title.asc" },
  { type: "serie", chemin: "tv", tri: "original_name.asc" },
];

const attendre = (ms) => new Promise((r) => setTimeout(r, ms));

// ── TMDB ────────────────────────────────────────

let prochainDepart = 0;
/** Espace les requêtes d'au moins INTERVALLE_MS, tous travailleurs confondus */
async function creneau() {
  const maintenant = Date.now();
  const depart = Math.max(maintenant, prochainDepart);
  prochainDepart = depart + INTERVALLE_MS;
  if (depart > maintenant) await attendre(depart - maintenant);
}

async function tmdb(chemin, params) {
  const url = new URL(API + chemin);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, String(v));
  const headers = { Accept: "application/json" };
  if (process.env.TMDB_API_TOKEN) headers.Authorization = `Bearer ${process.env.TMDB_API_TOKEN}`;
  else url.searchParams.set("api_key", process.env.TMDB_API_KEY ?? "");

  let derniere;
  for (let t = 1; t <= TENTATIVES; t++) {
    await creneau();
    try {
      const r = await fetch(url, { headers, signal: AbortSignal.timeout(15000) });
      if (r.ok) return await r.json();
      derniere = new Error(`TMDB ${r.status} ${chemin} page ${params.page}`);
      if (r.status !== 429 && r.status < 500) throw derniere; // erreur définitive
      const apres = Number(r.headers.get("retry-after"));
      await attendre(Number.isFinite(apres) && apres > 0 ? apres * 1000 : 1000 * 2 ** t);
    } catch (err) {
      derniere = err;
      if (err instanceof Error && /^TMDB 4\d\d/.test(err.message) && !err.message.startsWith("TMDB 429")) throw err;
      await attendre(1000 * 2 ** t);
    }
  }
  throw derniere;
}

/** Tous les identifiants d'une plateforme pour un type, ou null si le relevé est incomplet */
async function releverCatalogue(plateforme, { chemin, tri }) {
  const params = {
    watch_region: "FR",
    with_watch_providers: plateforme.fournisseurs.join("|"),
    include_adult: "false",
    sort_by: tri,
    language: "fr-FR",
  };
  try {
    const premiere = await tmdb(`/discover/${chemin}`, { ...params, page: 1 });
    const pages = premiere.total_pages ?? 0;
    if (pages > MAX_PAGES) {
      console.error(`  ${plateforme.nom} ${chemin} : ${pages} pages, au-delà de la limite de ${MAX_PAGES}`);
      return null;
    }
    const ids = new Set(premiere.results.map((r) => r.id));
    const restantes = Array.from({ length: Math.max(0, pages - 1) }, (_, i) => i + 2);
    const travailleur = async () => {
      for (let p = restantes.shift(); p !== undefined; p = restantes.shift()) {
        const page = await tmdb(`/discover/${chemin}`, { ...params, page: p });
        for (const r of page.results) ids.add(r.id);
      }
    };
    await Promise.all(Array.from({ length: TRAVAILLEURS }, travailleur));
    return ids;
  } catch (err) {
    console.error(`  ${plateforme.nom} ${chemin} : ${err instanceof Error ? err.message : err}`);
    return null;
  }
}

// ── Base ────────────────────────────────────────

async function etat(db, plateforme, type) {
  const [presents] = await db.query("SELECT tmdb_id FROM releve_presence WHERE plateforme = ? AND type = ?", [plateforme, type]);
  const [enAttente] = await db.query(
    "SELECT tmdb_id, changement, vu_le FROM releve_attente WHERE plateforme = ? AND type = ?",
    [plateforme, type]
  );
  const [passages] = await db.query(
    "SELECT jour FROM releve_passage WHERE plateforme = ? AND type = ? AND statut <> 'echec' ORDER BY jour DESC LIMIT 1",
    [plateforme, type]
  );
  return {
    confirmes: new Set(presents.map((l) => l.tmdb_id)),
    attente: new Map(enAttente.map((l) => [l.tmdb_id, { changement: l.changement, vuLe: l.vu_le }])),
    dernierPassage: passages[0]?.jour ?? null,
  };
}

async function dejaFait(db, jour, plateforme, type) {
  const [l] = await db.query(
    "SELECT statut FROM releve_passage WHERE jour = ? AND plateforme = ? AND type = ? AND statut <> 'echec'",
    [jour, plateforme, type]
  );
  return l.length > 0;
}

/** Insertion par paquets (évite une requête géante sur 8 000 titres) */
async function insererParPaquets(db, sql, lignes, taille = 1000) {
  for (let i = 0; i < lignes.length; i += taille) await db.query(sql, [lignes.slice(i, i + taille)]);
}

async function enregistrer(db, { jour, plateforme, type, resultat, reference, releve, dureeMs }) {
  await db.beginTransaction();
  try {
    if (reference) {
      await db.query("DELETE FROM releve_presence WHERE plateforme = ? AND type = ?", [plateforme, type]);
      await insererParPaquets(
        db,
        "INSERT INTO releve_presence (plateforme, type, tmdb_id, depuis) VALUES ?",
        [...releve].map((id) => [plateforme, type, id, jour])
      );
    } else if (resultat.statut !== "echec") {
      if (resultat.ajouter.length) {
        await insererParPaquets(
          db,
          "INSERT IGNORE INTO releve_presence (plateforme, type, tmdb_id, depuis) VALUES ?",
          resultat.ajouter.map((a) => [plateforme, type, a.tmdbId, a.depuis])
        );
      }
      for (let i = 0; i < resultat.retirer.length; i += 1000) {
        await db.query("DELETE FROM releve_presence WHERE plateforme = ? AND type = ? AND tmdb_id IN (?)", [
          plateforme,
          type,
          resultat.retirer.slice(i, i + 1000),
        ]);
      }
      if (resultat.evenements.length) {
        await insererParPaquets(
          db,
          "INSERT INTO releve_evenement (jour, plateforme, type, tmdb_id, evenement) VALUES ?",
          resultat.evenements.map((e) => [e.jour, plateforme, type, e.tmdbId, e.evenement])
        );
      }
      await db.query("DELETE FROM releve_attente WHERE plateforme = ? AND type = ?", [plateforme, type]);
      if (resultat.attente.size) {
        await insererParPaquets(
          db,
          "INSERT INTO releve_attente (plateforme, type, tmdb_id, changement, vu_le) VALUES ?",
          [...resultat.attente].map(([id, a]) => [plateforme, type, id, a.changement, a.vuLe])
        );
      }
    }
    const statut = reference ? "reference" : resultat.statut;
    const nb = (e) => resultat.evenements.filter((x) => x.evenement === e).length;
    await db.query(
      `REPLACE INTO releve_passage (jour, plateforme, type, statut, nb_titres, nb_arrivees, nb_departs, duree_ms)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [jour, plateforme, type, statut, releve?.size ?? null, nb("arrivee"), nb("depart"), dureeMs]
    );
    await db.commit();
  } catch (err) {
    await db.rollback();
    throw err;
  }
}

async function purger(db, jour) {
  const limite = moinsMois(jour, CONSERVATION_MOIS);
  const [e] = await db.query("DELETE FROM releve_evenement WHERE jour < ?", [limite]);
  const [p] = await db.query("DELETE FROM releve_passage WHERE jour < ?", [limite]);
  // Une attente de plus de 6 mois n'a plus de sens (relevé interrompu longtemps)
  await db.query("DELETE FROM releve_attente WHERE vu_le < ?", [limite]);
  // « depuis » ne doit pas remonter au-delà de la fenêtre conservée
  await db.query("UPDATE releve_presence SET depuis = ? WHERE depuis < ?", [limite, limite]);
  if (e.affectedRows || p.affectedRows) {
    console.log(`Purge avant le ${limite} : ${e.affectedRows} événements, ${p.affectedRows} passages.`);
  }
}

// ── Programme ───────────────────────────────────

async function main() {
  if (!process.env.TMDB_API_TOKEN && !process.env.TMDB_API_KEY) throw new Error("TMDB_API_TOKEN (ou TMDB_API_KEY) manquant.");
  const { plateformes } = JSON.parse(await readFile(new URL("../lib/fournisseurs-releve.json", import.meta.url), "utf8"));
  const choisies = plateformes.filter((p) => !SEULEMENT || p.slug === SEULEMENT);
  if (choisies.length === 0) throw new Error(`Plateforme inconnue : ${SEULEMENT}`);
  const types = TYPES.filter((t) => !TYPE || t.type === TYPE);

  const avecBase = Boolean(configDb());
  if (!avecBase && !DRY_RUN) throw new Error("Base non configurée (DB_*). Pour un essai sans base : --dry-run.");
  const db = avecBase ? await connecter() : null;
  const jour = jourParis();
  console.log(`Relevé du ${jour}${DRY_RUN ? " (essai, rien n'est écrit)" : ""}${avecBase ? "" : " sans base"}`);

  let alerte = false;
  try {
    for (const plateforme of choisies) {
      for (const t of types) {
        const etiquette = `${plateforme.nom} ${t.type === "film" ? "films" : "séries"}`;
        if (db && !DRY_RUN && !FORCER && (await dejaFait(db, jour, plateforme.id, t.type))) {
          console.log(`${etiquette} : déjà relevé aujourd'hui`);
          continue;
        }
        const debut = Date.now();
        const releve = await releverCatalogue(plateforme, t);
        const dureeMs = Date.now() - debut;
        if (!db) {
          console.log(`${etiquette} : ${releve ? `${releve.size} titres` : "ÉCHEC"} (${Math.round(dureeMs / 1000)} s)`);
          if (!releve) alerte = true;
          continue;
        }

        const e = await etat(db, plateforme.id, t.type);
        const reference = e.dernierPassage === null && releve !== null;
        const resultat = reference
          ? { statut: "ok", evenements: [], ajouter: [], retirer: [], attente: new Map() }
          : comparer({ confirmes: e.confirmes, attente: e.attente, releve, aujourdhui: jour });

        const arrivees = resultat.evenements.filter((x) => x.evenement === "arrivee").length;
        const departs = resultat.evenements.filter((x) => x.evenement === "depart").length;
        console.log(
          `${etiquette} : ${releve ? `${releve.size} titres` : "ÉCHEC"}` +
            (reference
              ? " — relevé de référence, aucun événement"
              : ` — ${arrivees} arrivée(s), ${departs} départ(s) confirmés, ${resultat.attente.size} en attente`) +
            (resultat.statut === "garde_fou" ? ` — GARDE-FOU : ${e.confirmes.size} titres confirmés, départs ignorés` : "") +
            ` (${Math.round(dureeMs / 1000)} s)`
        );
        if (resultat.statut !== "ok") alerte = true;
        if (DRY_RUN) {
          for (const ev of resultat.evenements.slice(0, 10)) console.log(`    ${ev.evenement} ${t.type} ${ev.tmdbId} le ${ev.jour}`);
          continue;
        }
        await enregistrer(db, { jour, plateforme: plateforme.id, type: t.type, resultat, reference, releve, dureeMs });
      }
    }
    if (db && !DRY_RUN) await purger(db, jour);
  } finally {
    await db?.end();
  }
  if (alerte) {
    console.error("Au moins un relevé a échoué ou déclenché le garde-fou : voir ci-dessus.");
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
