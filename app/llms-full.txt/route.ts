import type { Contenu } from "@/types";
import { getTopAnnee, getTopMois } from "@/lib/tmdb";
import { PLATEFORMES } from "@/lib/plateformes";
import { GUIDES } from "@/lib/guides";
import { formatMoisFR } from "@/lib/utils";

// 24h : mêmes caches que les pages top (getTopAnnee / getNouveautesMois)
export const revalidate = 86400;

const SITE_URL = process.env.SITE_URL ?? "https://streamactu.fr";

function ligne(c: Contenu, position: number): string {
  const note = c.nbVotes > 0 ? ` — ${c.note.toFixed(1)}/10 (${c.nbVotes.toLocaleString("fr-FR")} votes TMDB)` : "";
  return `${position}. [${c.titre}](${SITE_URL}/${c.type}/${c.slug})${note}`;
}

function section(titre: string, contenus: Contenu[]): string {
  if (contenus.length === 0) return "";
  return `## ${titre}\n\n${contenus.map((c, i) => ligne(c, i + 1)).join("\n")}\n`;
}

export async function GET() {
  const now = new Date();
  const annee = now.getUTCFullYear();

  // Dernier mois révolu — même choix que llms.txt et le footer
  const dernierMois = new Date(now);
  dernierMois.setUTCDate(15);
  dernierMois.setUTCMonth(dernierMois.getUTCMonth() - 1);
  const mois = dernierMois.getUTCMonth() + 1;
  const anneeMois = dernierMois.getUTCFullYear();
  const moisFR = formatMoisFR(mois, anneeMois);

  let seriesAnnee: Contenu[] = [];
  let filmsAnnee: Contenu[] = [];
  let seriesMois: Contenu[] = [];
  let filmsMois: Contenu[] = [];
  try {
    [seriesAnnee, filmsAnnee, seriesMois, filmsMois] = await Promise.all([
      getTopAnnee("serie", annee),
      getTopAnnee("film", annee),
      getTopMois("serie", mois, anneeMois),
      getTopMois("film", mois, anneeMois),
    ]);
  } catch (err) {
    console.error("[llms-full] tops indisponibles :", err instanceof Error ? err.message : err);
  }

  const texte = `# StreamActu.fr — classements en cours

> Les séries et films les mieux notés disponibles en streaming par abonnement en France
> (Netflix, Prime Video, Disney+, Apple TV+, Canal+, HBO Max, Paramount+).
> Classements établis d'après la note des spectateurs sur TMDB, pondérée par le
> nombre de votes. Mise à jour quotidienne. Version condensée : ${SITE_URL}/llms.txt

${section(`Top séries ${annee}`, seriesAnnee)}
${section(`Top films ${annee}`, filmsAnnee)}
${section(`Top séries ${moisFR}`, seriesMois)}
${section(`Top films ${moisFR}`, filmsMois)}
## Récaps annuels par plateforme

Inventaire de l'année, mois par mois, à distinguer des classements ci-dessus,
qui sont sélectifs et toutes plateformes confondues.

${PLATEFORMES.map((pf) => `- [Nouveautés ${pf.nom} ${annee}](${SITE_URL}/${pf.slug}/${annee})`).join("\n")}

## Autres ressources

- [Sitemap](${SITE_URL}/sitemap.xml) : toutes les fiches films et séries
- [Flux RSS](${SITE_URL}/flux.xml) : les nouveautés des 7 derniers jours
- [À propos](${SITE_URL}/a-propos) : éditeur, sources, méthode de classement, limites, financement
${GUIDES.map((g) => `- [${g.titre}](${SITE_URL}/guides/${g.slug}) : ${g.description}`).join("\n")}
- [Contact](${SITE_URL}/contact) : signaler une erreur de disponibilité ou de fiche
`;

  return new Response(texte, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
