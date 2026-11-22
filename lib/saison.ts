/**
 * Thèmes saisonniers : calendrier, choix de la saison du jour et de la variante.
 *
 * Tout passe par deux attributs sur <html> : data-saison="noel" et data-variante="1".
 * Les feuilles de style (app/noel.css…) ne ciblent que eux : sans attribut, le site garde
 * exactement son design de base.
 *
 * Un script en <head> (SCRIPT_SAISON) les pose avant le premier affichage, d'après la date
 * du visiteur à Paris : les pages restent statiques et le thème s'arrête tout seul, sans
 * redéploiement. Le calcul est écrit une seule fois (CALCUL_SAISON, du JavaScript brut) :
 * le même code part dans le navigateur et passe dans lib/saison.test.ts.
 *
 * Trois sortes de fenêtres :
 *  - « fixe » : du jour au jour (peut passer le nouvel an) ;
 *  - « paques » : calculée chaque année (dimanche de Pâques) ;
 *  - « annuel » : dates annoncées chaque année (Cannes, Fête du cinéma, cérémonies). Renseigner
 *    `annees` à l'annonce ; sinon `defaut` sert de repli (null = pas de thème cette année-là).
 * Une seule saison à la fois : si plusieurs fenêtres se chevauchent, la `priorite` la plus haute
 * l'emporte (0 par défaut), puis la fenêtre la plus courte.
 * `pret: true` = thème pas encore intégré, la saison est ignorée.
 *
 * Aperçu hors période : ?saison=noel (ou ?saison=0 pour revenir au design de base), et
 * ?variante=2 pour l'autre variante. Le choix dure le temps de l'onglet.
 * (l'ancien ?noel=1 reste accepté)
 *
 * Variantes : quand une saison en a plusieurs, chaque visiteur en tire une au hasard, gardée
 * dans son navigateur et tirée de nouveau chaque année. Les robots voient toujours la 1.
 *
 * RETIRER UN THÈME : mettre `pret: true` suffit à l'éteindre. Pour le supprimer
 * complètement : sa feuille CSS, son import dans app/layout.tsx, ses composants (components/noel/
 * pour Noël) et ses images (public/noel/).
 */

type Jour = [mois: number, jour: number];

export type Fenetre =
  | { type: "fixe"; du: Jour; au: Jour }
  | { type: "paques"; avant: number; apres: number }
  | { type: "annuel"; defaut: [Jour, Jour] | null; annees: Record<number, [Jour, Jour]> };

export interface Saison {
  id: string;
  nom: string;
  /** Thème intégré au site : sinon la saison est ignorée */
  pret: boolean;
  /** Nombre de variantes (tirage au hasard par visiteur) */
  variantes: number;
  /** Première année où la saison existe (l'anniversaire du site : 2027) */
  depuis?: number;
  /** Gagne sur les autres saisons qui se chevauchent (défaut 0), avant la durée de la fenêtre */
  priorite?: number;
  fenetre: Fenetre;
}

export const SAISONS: Saison[] = [
  { id: "nouvelan", nom: "Nouvel An", pret: true, variantes: 1, fenetre: { type: "fixe", du: [12, 30], au: [1, 2] } },
  { id: "noel", nom: "Noël", pret: true, variantes: 1, fenetre: { type: "fixe", du: [12, 1], au: [12, 29] } },
  { id: "valentin", nom: "Saint-Valentin", pret: true, variantes: 2, fenetre: { type: "fixe", du: [2, 1], au: [2, 14] } },
  { id: "avril", nom: "1er avril", pret: true, variantes: 1, fenetre: { type: "fixe", du: [4, 1], au: [4, 1] } },
  { id: "paques", nom: "Pâques", pret: true, variantes: 1, fenetre: { type: "paques", avant: 8, apres: 1 } },
  { id: "espace", nom: "4 mai", pret: true, variantes: 1, fenetre: { type: "fixe", du: [5, 4], au: [5, 4] } },
  // Dates annoncées chaque année : renseigner `annees` ; le repli est la mi-mai (à confirmer)
  { id: "cannes", nom: "Festival de Cannes", pret: true, variantes: 1, fenetre: { type: "annuel", defaut: [[5, 12], [5, 23]], annees: {} } },
  // Quatre jours fin juin (dates annoncées chaque année ; repli à confirmer)
  { id: "cinema", nom: "Fête du cinéma", pret: true, variantes: 1, fenetre: { type: "annuel", defaut: [[6, 28], [7, 1]], annees: {} } },
  // Site en ligne en juin 2026 : premier anniversaire en juin 2027
  { id: "anniv", nom: "Anniversaire du site", pret: true, variantes: 1, depuis: 2027, priorite: 1, fenetre: { type: "fixe", du: [6, 27], au: [7, 4] } },
  { id: "ete", nom: "Été", pret: true, variantes: 1, fenetre: { type: "fixe", du: [7, 5], au: [8, 31] } },
  { id: "rentree", nom: "Rentrée", pret: true, variantes: 1, fenetre: { type: "fixe", du: [9, 1], au: [9, 20] } },
  { id: "halloween", nom: "Halloween", pret: true, variantes: 2, fenetre: { type: "fixe", du: [10, 15], au: [11, 1] } },
  // Cérémonies (Golden Globes, Oscars, Emmy) : 5 jours avant → lendemain, dates à saisir à l'annonce
  { id: "oscars", nom: "Cérémonies", pret: true, variantes: 1, fenetre: { type: "annuel", defaut: null, annees: {} } },
];

/**
 * Choisit la saison d'un jour donné. JavaScript brut, sans fermeture : exécuté tel quel
 * dans le navigateur (SCRIPT_SAISON) et dans les tests.
 * Arguments : config (les saisons prêtes seulement : le filtre est fait avant), année, mois, jour (à Paris), saison forcée (ou "0").
 * Renvoie la saison choisie ou null.
 */
export const CALCUL_SAISON = `function (cfg, y, m, j, forcee) {
  function jours(a, mo, d) { return Math.round(Date.UTC(a, mo - 1, d) / 864e5); }
  function paques(a) {
    var A = a % 19, B = Math.floor(a / 100), C = a % 100, D = Math.floor(B / 4), E = B % 4;
    var F = Math.floor((B + 8) / 25), G = Math.floor((B - F + 1) / 3), H = (19 * A + B - D - G + 15) % 30;
    var I = Math.floor(C / 4), K = C % 4, L = (32 + 2 * E + 2 * I - H - K) % 7, M = Math.floor((A + 11 * H + 22 * L) / 451);
    return [Math.floor((H + L - 7 * M + 114) / 31), ((H + L - 7 * M + 114) % 31) + 1];
  }
  function fenetre(s, a) {
    var f = s.fenetre;
    if (f.type === "fixe") {
      var du = jours(a, f.du[0], f.du[1]), au = jours(a, f.au[0], f.au[1]);
      if (au < du) au = jours(a + 1, f.au[0], f.au[1]);
      return [du, au];
    }
    if (f.type === "paques") { var p = paques(a), e = jours(a, p[0], p[1]); return [e - f.avant, e + f.apres]; }
    var w = f.annees[a] || f.defaut;
    return w ? [jours(a, w[0][0], w[0][1]), jours(a, w[1][0], w[1][1])] : null;
  }
  if (forcee === "0") return null;
  var i, k, s;
  if (forcee) { for (i = 0; i < cfg.length; i++) if (cfg[i].id === forcee) return cfg[i]; return null; }
  var t = jours(y, m, j), best = null, longueur = 1e9, prio = -1e9;
  for (i = 0; i < cfg.length; i++) {
    s = cfg[i];
    for (k = y - 1; k <= y; k++) {
      if (s.depuis && k < s.depuis) continue;
      var w = fenetre(s, k);
      if (!w || t < w[0] || t > w[1]) continue;
      var p = s.priorite || 0;
      if (p > prio || (p === prio && w[1] - w[0] < longueur)) { best = s; prio = p; longueur = w[1] - w[0]; }
    }
  }
  return best;
}`;

/** Script inline, à exécuter avant le premier affichage (voir app/layout.tsx) */
export const SCRIPT_SAISON = `(function () {
  var d = document.documentElement;
  var calc = ${CALCUL_SAISON};
  var cfg = ${JSON.stringify(SAISONS.filter((s) => s.pret).map(({ id, variantes, depuis, priorite, fenetre }) => ({ id, variantes, depuis, priorite, fenetre })))};
  var y, m, j, n = new Date();
  y = n.getFullYear(); m = n.getMonth() + 1; j = n.getDate();
  try {
    new Intl.DateTimeFormat("fr-FR", { timeZone: "Europe/Paris", year: "numeric", month: "numeric", day: "numeric" }).formatToParts(n).forEach(function (p) {
      if (p.type === "year") y = +p.value; else if (p.type === "month") m = +p.value; else if (p.type === "day") j = +p.value;
    });
  } catch (e) {}
  var forcee = null, varForcee = 0;
  try {
    var q = location.search.match(/[?&]saison=([a-z0-9-]+)/), v = location.search.match(/[?&]variante=([0-9]+)/), old = location.search.match(/[?&]noel=([01])/);
    if (q) sessionStorage.setItem("saison", q[1]); else if (old) sessionStorage.setItem("saison", old[1] === "1" ? "noel" : "0");
    if (v) sessionStorage.setItem("variante", v[1]);
    forcee = sessionStorage.getItem("saison");
    varForcee = +sessionStorage.getItem("variante") || 0;
  } catch (e) {}
  var s = calc(cfg, y, m, j, forcee);
  if (!s) return;
  var num = 1;
  if (s.variantes > 1) {
    var stock = null;
    try { stock = JSON.parse(localStorage.getItem("saison-variante") || "null"); } catch (e) {}
    if (varForcee >= 1 && varForcee <= s.variantes) num = varForcee;
    else if (stock && stock.id === s.id && stock.annee === y && stock.n >= 1 && stock.n <= s.variantes) num = stock.n;
    else {
      num = 1 + Math.floor(Math.random() * s.variantes);
      try { localStorage.setItem("saison-variante", JSON.stringify({ id: s.id, annee: y, n: num })); } catch (e) {}
    }
  }
  d.setAttribute("data-saison", s.id);
  d.setAttribute("data-variante", String(num));
  try {
    if (localStorage.getItem("effets-saison") === "off") d.setAttribute("data-effets", "off");
    if (s.id !== "nouvelan" && sessionStorage.getItem("effets-vus") === s.id) d.setAttribute("data-calme", "1");
  } catch (e) {}
})()`;

/** Pages de lecture où la neige ne tombe pas : elle gênerait le texte */
export const PAGES_SANS_NEIGE = ["/actu", "/guides", "/mentions-legales", "/a-propos", "/contact"];
