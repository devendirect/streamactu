import { PLATEFORMES } from "@/lib/plateformes";
import { GUIDES } from "@/lib/guides";
import { formatMoisFR, formatMoisURL } from "@/lib/utils";

// 24h : seuls les liens de classements (mois/année) changent
export const revalidate = 86400;

const SITE_URL = process.env.SITE_URL ?? "https://streamactu.fr";

export async function GET() {
  const now = new Date();
  const annee = now.getUTCFullYear();

  // Dernier mois révolu : le top du mois en cours peut être encore trop maigre (404)
  const dernierMois = new Date(now);
  dernierMois.setUTCDate(15);
  dernierMois.setUTCMonth(dernierMois.getUTCMonth() - 1);
  const mois = dernierMois.getUTCMonth() + 1;
  const anneeMois = dernierMois.getUTCFullYear();

  const plateformes = PLATEFORMES.map(
    (pf) => `- [Nouveautés ${pf.nom}](${SITE_URL}/${pf.slug}) : séries et films ajoutés cette semaine sur ${pf.nom} en France`
  ).join("\n");

  const moisURL = formatMoisURL(mois, anneeMois);
  const moisFR = formatMoisFR(mois, anneeMois);

  const recapsAnnuels = PLATEFORMES.map(
    (pf) => `- [Nouveautés ${pf.nom} ${annee}](${SITE_URL}/${pf.slug}/${annee}) : tout ce qui est arrivé sur ${pf.nom} en ${annee}, mois par mois`
  ).join("\n");

  const texte = `# StreamActu.fr

> Les nouveautés séries et films du streaming en France, mises à jour chaque jour :
> Netflix, Prime Video, Disney+, Apple TV+, Canal+, HBO Max et Paramount+.
> Chaque fiche indique la note des spectateurs, le casting, la bande-annonce
> et les plateformes où regarder le titre en France.

## Nouveautés par plateforme

${plateformes}

## Récaps annuels et mensuels

Chaque plateforme a une page par année et une page par mois :
\`/{plateforme}/{année}\` (ex. ${SITE_URL}/netflix/${annee}) et
\`/{plateforme}/{mois}-{année}\` (ex. ${SITE_URL}/netflix/${moisURL}).

${recapsAnnuels}

## Classements

- [Top films ${annee}](${SITE_URL}/top/films-${annee}) : les films de ${annee} les mieux notés, mis à jour chaque jour
- [Top séries ${annee}](${SITE_URL}/top/series-${annee}) : les séries de ${annee} les mieux notées, mis à jour chaque jour
- [Top films ${moisFR}](${SITE_URL}/top/films-${moisURL}) : le classement du dernier mois écoulé
- [Top séries ${moisFR}](${SITE_URL}/top/series-${moisURL}) : le classement du dernier mois écoulé

## Explorer

- [Accueil](${SITE_URL}/) : les sorties du jour, plateforme par plateforme
- [Prochaines sorties](${SITE_URL}/prochaines-sorties) : le calendrier des sorties à venir
- [Sitemap](${SITE_URL}/sitemap.xml) : toutes les fiches films et séries
- [Flux RSS](${SITE_URL}/flux.xml) : les nouveautés des 7 derniers jours
- [Version détaillée](${SITE_URL}/llms-full.txt) : les classements complets, titre par titre

## Guides

${GUIDES.map((g) => `- [${g.titre}](${SITE_URL}/guides/${g.slug}) : ${g.chapo.split(". ")[0]}.`).join("\n")}

## À propos

- [Qui édite le site, d'où viennent les données et comment sont faits les classements](${SITE_URL}/a-propos)
- [Contact](${SITE_URL}/contact) : signaler une erreur de disponibilité ou de fiche
- [Mentions légales](${SITE_URL}/mentions-legales) : éditeur, hébergeur, données personnelles, usage de l'IA
- Données : TMDB (The Movie Database), disponibilités France uniquement
- Langue : français
- Mise à jour : quotidienne
`;

  return new Response(texte, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
