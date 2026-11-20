import type { Guide, OeuvreGuide } from "../guides";

/**
 * Données TMDB relevées le 2026-11-20 : titres français, dates, durées,
 * statuts. Les plateformes affichées dans les listes sont relues chaque jour
 * sur les fiches (au 20/11 : Dune 2021 et Dune : Prophecy sur HBO Max, Dune
 * 1984 sur Canal+, Dune : Deuxième partie sans abonnement) ; le texte du guide
 * n'en fige aucune.
 *
 * Durées (TMDB) : Dune 1984 = 137 min, Dune 2021 = 155, Deuxième partie = 165.
 * Troisième partie : sortie en salle en France le 16 décembre 2026 (TMDB, avant-
 * première le 15 ; la presse hésite avec le 18, à confirmer), durée TMDB 150
 * min non encore confirmée, donc non citée.
 *
 * Faits extérieurs à TMDB (voir `sources`) : Troisième partie adapte Le Messie
 * de Dune (1969), second roman de la saga ; Villeneuve a dit que ce serait son
 * dernier film de l'univers ; Dune : Prophecy saison 2 renouvelée, tournée, sans
 * date de diffusion annoncée (JustWatch France indique 2027). Dune : Prophecy
 * se passe 10 000 ans avant Paul Atréides (résumé TMDB).
 *
 * Révision : à la sortie de Troisième partie (16 décembre 2026), puis à
 * l'annonce de la date de la saison 2 de Dune : Prophecy.
 */

const f = (id: number, titre: string, extra: Partial<OeuvreGuide> = {}): OeuvreGuide => ({ type: "film", id, titre, repere: "", ...extra });
const s = (id: number, titre: string, extra: Partial<OeuvreGuide> = {}): OeuvreGuide => ({ type: "serie", id, titre, repere: "", ...extra });

export const GUIDE_DUNE_ORDRE: Guide = {
  slug: "dune-ordre",
  titre: "Dune dans l'ordre : films, séries et plateformes",
  description:
    "Les films et séries Dune dans l'ordre de sortie et dans l'ordre de l'histoire, de Dune : Prophecy à Dune : Troisième partie, avec la plateforme en France.",
  chapo:
    "Pour regarder Dune, le plus simple est de suivre les films de Denis Villeneuve : Dune (2021), Dune : Deuxième partie (2024), puis Dune : Troisième partie, au cinéma en France le 16 décembre 2026. La série Dune : Prophecy se passe dix mille ans avant et n'est pas nécessaire pour les comprendre. Le film de David Lynch (1984) et les deux mini-séries (2000 et 2003) sont d'autres adaptations des romans.",
  publie: "2026-11-20",
  misAJour: "2026-11-20",
  sections: [
    {
      titre: "Dans l'ordre de sortie",
      blocs: [
        {
          p: "Les adaptations de Dune se sont succédé depuis 1984. Seules celles de Denis Villeneuve forment une suite continue : les autres reprennent les mêmes romans, avec d'autres acteurs. Comptez environ 5 h 20 pour les deux premiers films de Villeneuve.",
        },
        {
          ordre: "sortie",
          oeuvres: [
            f(841, "Dune", { repere: "1984. 2 h 17. David Lynch adapte le premier roman, avec Kyle MacLachlan en Paul Atréides.", facultatif: true }),
            s(19566, "Dune", { repere: "2000. Mini-série en trois épisodes, qui adapte le premier roman.", facultatif: true }),
            s(9156, "Les Enfants de Dune", { repere: "2003. Mini-série en trois épisodes, qui suit la précédente.", facultatif: true }),
            f(438631, "Dune", { repere: "2021. 2 h 35. Denis Villeneuve : la première moitié du premier roman, avec Timothée Chalamet." }),
            f(693134, "Dune : Deuxième partie", { repere: "2024. 2 h 45. La suite directe : Paul rejoint les Fremen." }),
            s(90228, "Dune : Prophecy", { repere: "2024. Série HBO, dix mille ans avant Paul Atréides : la naissance des Bene Gesserit.", facultatif: true }),
            f(1170608, "Dune : Troisième partie", { repere: "2026. Au cinéma le 16 décembre : l'adaptation du Messie de Dune.", auCinema: true }),
          ],
        },
      ],
    },
    {
      titre: "Dans l'ordre de l'histoire",
      blocs: [
        {
          p: "Dans l'univers de Dune, la série Dune : Prophecy se passe dix mille ans avant les films. On peut la voir en premier, mais elle a été écrite pour des spectateurs qui connaissent déjà les films : mieux vaut commencer par eux.",
        },
        {
          ordre: "histoire",
          oeuvres: [
            s(90228, "Dune : Prophecy", { repere: "Dix mille ans avant Paul Atréides, les Sœurs Harkonnen fondent les Bene Gesserit. Facultatif.", portion: "Saison 1", facultatif: true }),
            f(438631, "Dune", { repere: "Paul Atréides et sa famille arrivent sur la planète Arrakis." }),
            f(693134, "Dune : Deuxième partie", { repere: "Paul et les Fremen, après la chute de sa maison." }),
            f(1170608, "Dune : Troisième partie", { repere: "Paul, devenu empereur, fait face aux conséquences de son ascension. Au cinéma le 16 décembre 2026.", auCinema: true }),
          ],
        },
      ],
    },
    {
      titre: "La série Dune : Prophecy",
      blocs: [
        {
          p: "Dune : Prophecy raconte comment la secte des Bene Gesserit a été fondée, dix mille ans avant Paul Atréides. La série est sur HBO Max en France ; son suivi se fait sur [sa fiche](/serie/dune-prophecy-90228) et sur la page [HBO Max](/hbo-max). La saison 2 est renouvelée et tournée, mais aucune date de diffusion n'est annoncée. Pour savoir comment regarder HBO en France, voir le guide [où regarder les séries HBO](/guides/series-hbo-france).",
        },
      ],
    },
    {
      titre: "Dune de Lynch ou de Villeneuve ?",
      blocs: [
        {
          p: "Le film de 1984 adapte le premier roman en un seul film, avec une direction artistique très différente ; les mini-séries de 2000 et 2003 adaptent les trois premiers romans. Elles ne sont pas nécessaires pour suivre les films de Villeneuve. Pour une première fois, les films de 2021 et 2024 suffisent.",
        },
      ],
    },
  ],
  faq: [
    {
      q: "Dans quel ordre regarder les films Dune ?",
      r: "Dune (2021), puis Dune : Deuxième partie (2024), puis Dune : Troisième partie, au cinéma en France le 16 décembre 2026. Le film de Lynch (1984) et les mini-séries de 2000 et 2003 sont d'autres adaptations des romans.",
    },
    {
      q: "Faut-il voir Dune : Prophecy avant les films ?",
      r: "Non. La série se passe dix mille ans avant les films et a été écrite pour qui les connaît déjà : mieux vaut la voir après.",
    },
    {
      q: "Dune : Troisième partie adapte-t-il un roman ?",
      r: "Oui : Le Messie de Dune, le deuxième roman de Frank Herbert, publié en 1969. Les deux premiers films adaptent le premier roman.",
    },
    {
      q: "Où regarder Dune en streaming en France ?",
      r: "La plateforme change selon le film et selon la période : chaque titre de ce guide affiche celle du jour en France. Dune : Troisième partie n'est pour l'instant qu'au cinéma.",
    },
  ],
  sources: [
    { titre: "Fnac, L'Éclaireur, « Dune 3 : combien de temps après le deuxième film ? »", url: "https://leclaireur.fnac.com/article/662740-dune-3-combien-de-temps-apres-le-deuxieme-film/" },
    { titre: "Numéro, « Dune 3 : que sait-on du dernier volet de la saga de science-fiction ? »", url: "https://numero.com/culture/cinema/dune-3-que-sait-on-du-dernier-volet-de-la-saga-de-science-fiction/" },
    { titre: "JustWatch France, « Dune : Prophecy saison 2 »", url: "https://www.justwatch.com/fr/serie/dune-the-sisterhood/saison-2" },
  ],
};
