/**
 * Soumission IndexNow quotidienne — à lancer par une tâche planifiée Plesk :
 *   node scripts/indexnow.mjs            envoi réel
 *   node scripts/indexnow.mjs --dry-run  affiche les URLs sans rien envoyer
 *
 * Rejoue les fiches du flux RSS (7 derniers jours, déjà dédupliquées et sans
 * pages noindex) et les pages « chaudes » qui changent chaque jour. Un fichier
 * d'état à côté du script mémorise les fiches déjà soumises : seules les
 * nouvelles repartent, plus les pages chaudes (légitimement « modifiées »).
 *
 * Node ≥ 18 (fetch natif), aucune dépendance. Codes de sortie : 0 OK (ou 429,
 * on réessaiera demain), 1 échec — configurer Plesk pour notifier sur erreur.
 */

import { readFile, writeFile } from "node:fs/promises";

const SITE = process.env.SITE_URL ?? "https://streamactu.fr";
// Clé publique par conception (servie à la racine du site) — l'env permet d'en changer
const KEY = process.env.INDEXNOW_KEY ?? "615ad73a360a4288acb578d4cc13bc34";
const ETAT = new URL("./.indexnow-etat.json", import.meta.url);
const DRY_RUN = process.argv.includes("--dry-run");

const PLATEFORMES = [
  "netflix",
  "prime-video",
  "disney-plus",
  "apple-tv-plus",
  "canal-plus",
  "max",
  "paramount-plus",
];

/** Pages mises à jour quotidiennement — toujours soumises */
function pagesChaudes() {
  const now = new Date();
  const jour = now.toISOString().slice(0, 10); // même convention UTC que le site
  const annee = now.getUTCFullYear();
  return [
    `${SITE}/`,
    ...PLATEFORMES.map((slug) => `${SITE}/${slug}`),
    `${SITE}/${jour}`,
    `${SITE}/prochaines-sorties`,
    `${SITE}/top/series-${annee}`,
    `${SITE}/top/films-${annee}`,
  ];
}

/** URLs des fiches du flux RSS (liens des <item>, hors lien du canal) */
async function urlsDuFlux() {
  const res = await fetch(`${SITE}/flux.xml`, { signal: AbortSignal.timeout(15000) });
  if (!res.ok) throw new Error(`flux.xml → HTTP ${res.status}`);
  const xml = await res.text();
  const urls = [...xml.matchAll(/<link>([^<]+)<\/link>/g)]
    .map((m) => m[1].trim().replace(/&amp;/g, "&"))
    .filter((u) => u.startsWith(`${SITE}/`)); // écarte le <link> racine du canal
  return [...new Set(urls)];
}

async function lireEtat() {
  try {
    const brut = JSON.parse(await readFile(ETAT, "utf8"));
    return new Set(Array.isArray(brut) ? brut : []);
  } catch {
    return new Set(); // premier lancement ou état corrompu : tout est « nouveau »
  }
}

async function soumettre(urlList) {
  const corps = JSON.stringify({
    host: new URL(SITE).host,
    key: KEY,
    keyLocation: `${SITE}/${KEY}.txt`,
    urlList,
  });

  // Une relance sur panne réseau ou 5xx ; jamais sur 4xx (rejouer ne changera rien)
  for (let essai = 1; essai <= 2; essai++) {
    try {
      const res = await fetch("https://api.indexnow.org/indexnow", {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: corps,
        signal: AbortSignal.timeout(15000),
      });
      if (res.ok || res.status < 500) return res.status;
    } catch (err) {
      if (essai === 2) throw err;
    }
    await new Promise((r) => setTimeout(r, 5000));
  }
}

const fiches = await urlsDuFlux();
const dejaSoumises = await lireEtat();
const nouvelles = fiches.filter((u) => !dejaSoumises.has(u));
const urlList = [...new Set([...pagesChaudes(), ...nouvelles])];

console.log(
  `[indexnow] flux : ${fiches.length} fiches (${nouvelles.length} nouvelles) — envoi de ${urlList.length} URLs`
);

if (DRY_RUN) {
  console.log(urlList.join("\n"));
} else {
  const status = await soumettre(urlList);

  if (status === 200 || status === 202) {
    // On mémorise tout le flux courant : les absents d'aujourd'hui sortiront
    // naturellement de l'état quand ils sortiront de la fenêtre des 7 jours
    await writeFile(ETAT, JSON.stringify(fiches, null, 2));
    console.log(`[indexnow] accepté (HTTP ${status})`);
  } else if (status === 429) {
    console.warn("[indexnow] HTTP 429 — on n'insiste pas, reprise demain");
  } else {
    console.error(`[indexnow] refusé (HTTP ${status}) — vérifier la clé et le fichier ${KEY}.txt`);
    process.exitCode = 1;
  }
}
