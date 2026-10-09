import type { Guide, OeuvreGuide } from "../guides";

/**
 * Données TMDB relevées le 2026-10-09 : titres français, dates, durées,
 * plateformes en France (les huit Harry Potter et les trois Animaux
 * fantastiques sur HBO Max et sa chaîne Prime Video ce jour-là). Les
 * plateformes affichées dans les listes sont relues chaque jour sur les fiches.
 *
 * Durées (TMDB) : 1 180 minutes pour les huit Harry Potter (19 h 40), 409
 * pour les trois Animaux fantastiques, soit 26 h 30 au total.
 *
 * Faits extérieurs à TMDB (voir `sources`) : série HBO le 25 décembre 2026 sur
 * HBO Max, huit épisodes en saison 1, une saison par roman, distribution
 * principale. Époques : romans et films (1991-1998), Animaux fantastiques
 * (1926, 1927, années 1930).
 *
 * Révision : trimestrielle, et à la sortie de la série.
 */

const f = (id: number, titre: string): OeuvreGuide => ({ type: "film", id, titre, repere: "" });

const HP1 = f(671, "Harry Potter à l'école des sorciers");
const HP2 = f(672, "Harry Potter et la Chambre des secrets");
const HP3 = f(673, "Harry Potter et le Prisonnier d'Azkaban");
const HP4 = f(674, "Harry Potter et la Coupe de feu");
const HP5 = f(675, "Harry Potter et l'Ordre du Phénix");
const HP6 = f(767, "Harry Potter et le Prince de sang-mêlé");
const HP7 = f(12444, "Harry Potter et les Reliques de la Mort - 1ère partie");
const HP8 = f(12445, "Harry Potter et les Reliques de la Mort - 2ème partie");
const AF1 = f(259316, "Les Animaux Fantastiques");
const AF2 = f(338952, "Les Animaux Fantastiques : Les Crimes de Grindelwald");
const AF3 = f(338953, "Les Animaux fantastiques : Les Secrets de Dumbledore");

export const GUIDE_HARRY_POTTER_ORDRE: Guide = {
  slug: "harry-potter-ordre",
  titre: "Harry Potter dans l'ordre : films, série et plateformes",
  description:
    "Les films Harry Potter et Les Animaux fantastiques dans l'ordre de sortie et dans l'ordre de l'histoire, avec la plateforme de chaque film en France.",
  chapo:
    "En France, les huit films Harry Potter et les trois Animaux fantastiques sont sur HBO Max, aussi proposé en chaîne sur Prime Video. Pour une première fois, regardez les huit Harry Potter dans l'ordre, puis Les Animaux fantastiques, qui se passent plus de soixante ans plus tôt. La série de HBO, qui adapte à nouveau les romans, arrive sur HBO Max le 25 décembre 2026.",
  publie: "2026-10-09",
  misAJour: "2026-10-09",
  sections: [
    {
      titre: "Les films dans l'ordre de sortie",
      blocs: [
        {
          p: "Les huit films adaptent les sept romans de J.K. Rowling, le dernier en deux parties. Comptez environ 19 h 40 pour les huit, et 26 h 30 avec Les Animaux fantastiques.",
        },
        {
          ordre: "sortie",
          oeuvres: [
            { ...HP1, repere: "2001. Première année à Poudlard." },
            { ...HP2, repere: "2002. Deuxième année." },
            { ...HP3, repere: "2004. Troisième année." },
            { ...HP4, repere: "2005. Quatrième année : le Tournoi des Trois Sorciers." },
            { ...HP5, repere: "2007. Cinquième année." },
            { ...HP6, repere: "2009. Sixième année." },
            { ...HP7, repere: "2010. Le dernier roman, première partie." },
            { ...HP8, repere: "2011. Fin de la saga, et le plus court des huit films (2 h 10)." },
            { ...AF1, repere: "2016. Newt Scamander à New York, en 1926." },
            { ...AF2, repere: "2018. Suite directe, en 1927." },
            { ...AF3, repere: "2022. Dans les années 1930. La série de films s'est arrêtée là." },
          ],
        },
      ],
    },
    {
      titre: "Dans l'ordre de l'histoire",
      blocs: [
        {
          p: "Les Animaux fantastiques racontent la jeunesse d'Albus Dumbledore et la montée de Grindelwald, des décennies avant la naissance de Harry. Les voir d'abord fonctionne, mais certaines révélations supposent de connaître les personnages de Harry Potter : pour une première fois, l'ordre de sortie reste préférable.",
        },
        {
          ordre: "histoire",
          oeuvres: [
            { ...AF1, repere: "1926." },
            { ...AF2, repere: "1927." },
            { ...AF3, repere: "Années 1930." },
            { ...HP1, repere: "1991, l'entrée de Harry à Poudlard." },
            { ...HP2, repere: "1992." },
            { ...HP3, repere: "1993." },
            { ...HP4, repere: "1994." },
            { ...HP5, repere: "1995." },
            { ...HP6, repere: "1996." },
            { ...HP7, repere: "1997." },
            { ...HP8, repere: "1998, avec un épilogue dix-neuf ans plus tard." },
          ],
        },
      ],
    },
    {
      titre: "Autour des films",
      blocs: [
        {
          ul: [
            "[Harry Potter fête ses 20 ans : Retour à Poudlard](/film/harry-potter-fete-ses-20-ans-retour-a-poudlard-899082) (2022) : les acteurs des films réunis pour les vingt ans du premier.",
            "[Harry Potter : le tournoi des quatre maisons](/serie/harry-potter-le-tournoi-des-quatre-maisons-133723) : jeu de culture générale sur la saga.",
            "[Harry Potter : Les Sorciers de la pâtisserie](/serie/harry-potter-les-sorciers-de-la-patisserie-254514) : concours de pâtisserie sur le thème des films.",
          ],
        },
      ],
    },
    {
      titre: "La série HBO",
      blocs: [
        {
          p: "HBO adapte de nouveau les romans, cette fois en série, avec un roman par saison. La première saison, huit épisodes, arrive sur HBO Max le 25 décembre 2026. Dominic McLaughlin, Arabella Stanton et Alastair Stout y jouent Harry, Hermione et Ron. Sa date et sa plateforme seront suivies sur [sa fiche](/serie/harry-potter-224377), sur la page [HBO Max](/hbo-max) et dans le [calendrier des sorties](/prochaines-sorties). Pour savoir comment on regarde HBO en France, voir le guide [où regarder les séries HBO](/guides/series-hbo-france).",
        },
      ],
    },
  ],
  faq: [
    {
      q: "Dans quel ordre regarder les films Harry Potter ?",
      r: "Dans l'ordre de sortie, de Harry Potter à l'école des sorciers (2001) à Harry Potter et les Reliques de la Mort, 2e partie (2011). Les trois Animaux fantastiques, qui se passent dans les années 1920 et 1930, se regardent ensuite.",
    },
    {
      q: "Où regarder Harry Potter en streaming en France ?",
      r: "Sur HBO Max, par abonnement direct ou en chaîne sur Prime Video, qui propose les huit films et les trois Animaux fantastiques.",
    },
    {
      q: "Faut-il voir Les Animaux fantastiques avant Harry Potter ?",
      r: "Ce n'est pas nécessaire. Ils se passent avant, mais ont été écrits pour un public qui connaît déjà Harry Potter : mieux vaut les voir après.",
    },
    {
      q: "Quand sort la série Harry Potter ?",
      r: "Le 25 décembre 2026 sur HBO Max pour la première saison, de huit épisodes, adaptée du premier roman.",
    },
  ],
  sources: [
    { titre: "Tom's Guide, « Harry Potter, la série : on connaît enfin sa date de sortie »", url: "https://www.tomsguide.fr/harry-potter-la-serie-on-connait-enfin-sa-date-de-sortie-il-va-falloir-etre-patient/" },
    { titre: "KultureGeek, « La série Harry Potter a une date de sortie »", url: "https://kulturegeek.fr/news-305575/serie-harry-potter-date-sortie-nest-vraiment-suite" },
  ],
};
