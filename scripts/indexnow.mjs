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
  "hbo-max",
  "paramount-plus",
];

/** Pages mises à jour quotidiennement — toujours soumises */
function pagesChaudes() {
  const annee = new Date().getUTCFullYear();
  return [
    `${SITE}/`,
    ...PLATEFORMES.map((slug) => `${SITE}/${slug}`),
    `${SITE}/prochaines-sorties`,
    `${SITE}/top/series-${annee}`,
    `${SITE}/top/films-${annee}`,
  ];
}

/**
 * Garde les pages réellement indexables : HTTP 200 et pas de balise noindex.
 * Le code HTTP seul ne suffit pas : avec le loading.tsx racine, une page
 * introuvable répond 200 (soft 404) mais porte un noindex. Cas concret : les
 * tops de l'année font 404 début janvier, tant qu'ils ont moins de 5 titres.
 */
async function pagesIndexables(urls) {
  const verdicts = await Promise.all(
    urls.map(async (url) => {
      try {
        const res = await fetch(url, { signal: AbortSignal.timeout(15000) });
        if (res.status !== 200) return { url, ok: false, raison: `HTTP ${res.status}` };
        const html = await res.text();
        if (/<meta name="robots" content="[^"]*noindex/.test(html)) {
          return { url, ok: false, raison: "noindex" };
        }
        return { url, ok: true };
      } catch (err) {
        return { url, ok: false, raison: err instanceof Error ? err.message : String(err) };
      }
    })
  );
  for (const v of verdicts) {
    if (!v.ok) console.warn(`[indexnow] écartée : ${v.url} (${v.raison})`);
  }
  return verdicts.filter((v) => v.ok).map((v) => v.url);
}

/** URLs des fiches du flux RSS (liens des <item>, hors lien du canal) */
async function urlsDuFlux(chemin, obligatoire) {
  const res = await fetch(`${SITE}${chemin}`, { signal: AbortSignal.timeout(15000) });
  // Flux des articles : 404 tant qu'aucun article Actu n'est publié
  if (res.status === 404 && !obligatoire) return [];
  if (!res.ok) throw new Error(`${chemin} → HTTP ${res.status}`);
  const xml = await res.text();
  // Liens des <item> seulement : le <link> du canal (racine, /actu) n'est pas une page à soumettre
  const urls = [...xml.matchAll(/<item>[\s\S]*?<link>([^<]+)<\/link>/g)]
    .map((m) => m[1].trim().replace(/&amp;/g, "&"))
    .filter((u) => u.startsWith(`${SITE}/`));
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

  // Une relance sur panne réseau ou 5xx ; jamais sur 4xx (rejouer ne changera rien).
  // Renvoie le dernier statut HTTP, ou null si le réseau a échoué deux fois.
  let dernier = null;
  for (let essai = 1; essai <= 2; essai++) {
    try {
      const res = await fetch("https://api.indexnow.org/indexnow", {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: corps,
        signal: AbortSignal.timeout(15000),
      });
      dernier = res.status;
      if (res.status < 500) return dernier;
      console.warn(`[indexnow] HTTP ${res.status} (essai ${essai}/2)`);
    } catch (err) {
      dernier = null;
      console.warn(
        `[indexnow] échec réseau (essai ${essai}/2) :`,
        err instanceof Error ? err.message : err
      );
    }
    if (essai < 2) await new Promise((r) => setTimeout(r, 5000));
  }
  return dernier;
}

const fiches = [
  ...new Set([...(await urlsDuFlux("/flux.xml", true)), ...(await urlsDuFlux("/actu/flux.xml", false))]),
];
const dejaSoumises = await lireEtat();
const nouvelles = fiches.filter((u) => !dejaSoumises.has(u));
const chaudes = await pagesIndexables(pagesChaudes());
const urlList = [...new Set([...chaudes, ...nouvelles])];

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
  } else if (status === null) {
    console.error("[indexnow] IndexNow injoignable (réseau), deux essais — reprise demain");
    process.exitCode = 1;
  } else if (status >= 500) {
    console.error(`[indexnow] IndexNow en erreur (HTTP ${status}), deux essais — reprise demain`);
    process.exitCode = 1;
  } else {
    console.error(`[indexnow] refusé (HTTP ${status}) — vérifier la clé et le fichier ${KEY}.txt`);
    process.exitCode = 1;
  }
}
