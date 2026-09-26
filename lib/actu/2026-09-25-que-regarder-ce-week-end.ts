import type { Article } from "../actu";

/**
 * Données TMDB relevées le 2026-09-27 (après coup : sorties du 22 au 27
 * septembre, disponibilités France via les watch providers, dates d'épisodes
 * par /tv/{id}/season/1, arrivées de films par sortie numérique française).
 * Écrit pour visualiser la rubrique ; publiable tel quel, daté du vendredi.
 *
 * Fait extérieur à TMDB : « Hurlevent » adapte le roman d'Emily Brontë.
 */
export const ARTICLE_2026_09_25_WEEKEND: Article = {
  slug: "que-regarder-ce-week-end-25-septembre-2026",
  titre: "Que regarder ce week-end : 25 au 27 septembre 2026",
  description:
    "UNABOMBER sur Netflix, The Love Hypothesis sur Prime Video, « Hurlevent » sur Canal+ : que regarder le week-end du 25 septembre, et les autres sorties.",
  chapo:
    "Cette semaine, deux films se partagent l'affiche : UNABOMBER, sorti vendredi sur Netflix avec Russell Crowe, et « Hurlevent » avec Margot Robbie, arrivé sur Canal+. Pour une soirée plus légère, The Love Hypothesis sur Prime Video est le titre le mieux noté de la semaine. Côté séries, Le Problème final se regarde en un week-end, et Brothers vient de commencer sur Apple TV+.",
  publie: "2026-09-25",
  misAJour: "2026-09-25",
  sections: [
    {
      titre: "UNABOMBER, sur Netflix",
      oeuvre: { type: "film", id: 1492640 },
      blocs: [
        {
          p: "Sorti directement sur Netflix le vendredi 25 septembre, le film de Janus Metz revient sur Ted Kaczynski, entré à Harvard à 16 ans avant de basculer dans le terrorisme. Il s'attarde sur les expériences psychologiques menées par le docteur Henry Murray, et sur la façon dont ce passé refait surface. Russell Crowe, Shailene Woodley et Jacob Tremblay sont à l'affiche. Premier accueil : 7/10 sur TMDB, pour une cinquantaine de votes. Il dure 1 h 41.",
        },
      ],
    },
    {
      titre: "The Love Hypothesis, sur Prime Video",
      oeuvre: { type: "film", id: 1032863 },
      blocs: [
        {
          p: "Comédie romantique tirée d'un roman à succès, sortie le mercredi 23 septembre. Olive, doctorante, embrasse sur un coup de tête Adam Carlsen, le professeur le plus intimidant de son département, et se retrouve à jouer le faux couple. Lili Reinhart et Tom Bateman forment le duo, sous la direction de Claire Scanlon. C'est la meilleure note de la semaine parmi les titres assez votés : 8,4/10 sur TMDB, avec plus de 200 votes.",
        },
      ],
    },
    {
      titre: "« Hurlevent », sur Canal+",
      oeuvre: { type: "film", id: 1316092 },
      blocs: [
        {
          p: "L'adaptation du roman d'Emily Brontë par Emerald Fennell est arrivée sur Canal+ le mardi 22 septembre, sept mois après sa sortie en salle. Sur les landes du Yorkshire, la passion entre Catherine Earnshaw et Heathcliff tourne à l'obsession. Margot Robbie et Jacob Elordi tiennent les rôles principaux, avec Hong Chau. Le film a partagé ses spectateurs : 6,7/10 sur TMDB, avec plus de 1 300 votes. Il dure 2 h 16.",
        },
      ],
    },
    {
      titre: "Le Problème final, sur Netflix",
      oeuvre: { type: "serie", id: 290720 },
      blocs: [
        {
          p: "Minisérie espagnole en quatre épisodes, tous en ligne le vendredi 25 septembre. Au printemps 1959, treize voyageurs sont bloqués par une tempête sur une île près de Majorque, dans un petit hôtel où une touriste britannique est retrouvée morte. Un huis clos à l'ancienne, avec Jose Coronado et María Valverde, qui se regarde sans peine en un week-end.",
        },
      ],
    },
    {
      titre: "Brothers, sur Apple TV+",
      oeuvre: { type: "serie", id: 250203 },
      blocs: [
        {
          p: "Matthew McConaughey et Woody Harrelson jouent deux amis de toujours qui découvrent un secret de famille qui pourrait les rapprocher plus encore. Cette comédie a démarré le mardi 22 septembre avec deux épisodes ; les six suivants arrivent un par un, chaque mardi, jusqu'au 3 novembre. De quoi la suivre semaine après semaine.",
        },
      ],
    },
    {
      titre: "Et aussi cette semaine",
      blocs: [
        {
          ul: [
            "[Paolo](/serie/paolo-288385) (HBO Max, depuis le 25 septembre) : série française avec Jérôme Niel, un épisode par semaine.",
            "[4 Blocks Zero](/serie/4-blocks-zero-310133) (HBO Max, depuis le 25 septembre) : les origines d'un clan criminel dans le Berlin des années 1990, un épisode par semaine.",
            "[Mes Morts Tristes](/serie/mes-morts-tristes-310290) (Netflix, 24 septembre) : minisérie argentine et chilienne en quatre épisodes, d'après Mariana Enríquez.",
            "[Le Gang des souris vertes](/serie/le-gang-des-souris-vertes-335510) (Canal+, 23 septembre) : documentaire sur une bande de braqueurs des années 2000, deux épisodes, puis deux autres le 30 septembre.",
            "[A Different World](/serie/a-different-world-305357) (Netflix, 24 septembre) : dix épisodes dans une université historiquement noire.",
            "[Guns Up](/film/guns-up-1181540) (Prime Video, 25 septembre) : comédie d'action avec Kevin James et Christina Ricci.",
          ],
        },
        {
          p: "De nouveaux épisodes sont aussi sortis cette semaine pour des séries en cours, dont [Slow Horses](/serie/slow-horses-95480) et [Ted Lasso](/serie/ted-lasso-97546) sur Apple TV+, [MobLand](/serie/mobland-247718) sur Prime Video et [Lanterns](/serie/lanterns-95350) sur HBO Max.",
        },
        {
          p: "Tout ce qui sort chaque jour est sur les pages [Netflix](/netflix), [Prime Video](/prime-video), [Canal+](/canal-plus), [Apple TV+](/apple-tv-plus) et [HBO Max](/hbo-max), et ce qui arrive dans les quatre prochaines semaines dans le [calendrier des sorties](/prochaines-sorties).",
        },
      ],
    },
  ],
};
