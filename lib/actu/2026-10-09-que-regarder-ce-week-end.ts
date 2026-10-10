import type { Article } from "../actu";

/**
 * Données TMDB relevées le 2026-10-09 (calendrier du site : séries par réseau
 * d'origine, films par sortie numérique française ; dates des épisodes par
 * /tv/{id}/season/{n}). Article rattrapé le vendredi (pas de brouillon le
 * jeudi). Reste à faire : relecture de l'éditeur (disponibilités en France de
 * Below, Avatar : Les Sept Refuges, Animals, Exit 8 et Marsupilami pas encore
 * listées par TMDB), `brouillon: false`, déploiement.
 *
 * Faits extérieurs à TMDB : Carrie adapte le roman de Stephen King ; dans
 * Hamnet, « Will » est William Shakespeare ; les créateurs d'Avatar : Les Sept
 * Refuges ont créé Avatar, le dernier maître de l'air ; Exit 8 adapte un jeu
 * vidéo ; Matchbox tire son nom des petites voitures Mattel.
 */
export const ARTICLE_2026_10_09_WEEKEND: Article = {
  slug: "que-regarder-ce-week-end-9-octobre-2026",
  format: "week-end",
  titre: "Que regarder ce week-end : 9 au 11 octobre 2026",
  description:
    "Carrie sur Prime Video, Below sur Netflix, Hamnet sur Canal+ : que regarder le week-end du 9 octobre, et les autres sorties de la semaine.",
  chapo:
    "Deux séries complètes et un film se détachent ce week-end sur les plateformes en France : Carrie, la nouvelle adaptation de Stephen King par Mike Flanagan sur Prime Video, Below, minisérie Netflix avec Josh Hartnett, et Hamnet de Chloé Zhao, arrivé sur Canal+. Pour les plus jeunes, Avatar : Les Sept Refuges commence sur Paramount+.",
  publie: "2026-10-09",
  misAJour: "2026-10-09",
  brouillon: false,
  sections: [
    {
      titre: "Carrie, sur Prime Video",
      oeuvre: { type: "serie", id: 288673 },
      blocs: [
        {
          p: "Huit épisodes, tous mis en ligne le mercredi 7 octobre. Mike Flanagan reprend le roman de Stephen King et le transpose dans un lycée d'aujourd'hui : après la mort de son père, Carrie White (Summer H. Howell) se retrouve au cœur d'un scandale de harcèlement devenu viral, pendant qu'un pouvoir de télékinésie s'éveille en elle. Samantha Sloyan joue sa mère, Margaret. C'est la série la mieux notée de la semaine : 8,4/10 sur TMDB, avec plus de 70 votes. Une saison unique et fermée.",
        },
      ],
    },
    {
      titre: "Below, sur Netflix",
      oeuvre: { type: "serie", id: 285322 },
      blocs: [
        {
          p: "Six épisodes, tous disponibles depuis le jeudi 8 octobre. Dans un petit village de pêcheurs de Terre-Neuve, une créature marine sème la terreur ; un pêcheur endurci, joué par Josh Hartnett, tente de protéger sa famille et sa communauté. Mackenzie Davis et Charlie Heaton complètent la distribution de cette minisérie canadienne et britannique créée par Jesse McKeown. Six épisodes, une histoire close : de quoi la finir en un week-end.",
        },
      ],
    },
    {
      titre: "Hamnet, sur Canal+",
      oeuvre: { type: "film", id: 858024 },
      blocs: [
        {
          p: "Le film de Chloé Zhao est arrivé sur Canal+ le mardi 6 octobre, près de neuf mois après sa sortie en salle (21 janvier). Angleterre, 1580 : un professeur de latin fauché, Will, épouse Agnes, jeune femme à l'esprit libre ; pendant qu'il tente sa chance comme dramaturge à Londres, un drame frappe la famille et en inspirera l'œuvre la plus célèbre. Jessie Buckley et Paul Mescal tiennent les rôles principaux. C'est le film le mieux noté de la semaine : 7,7/10 sur TMDB, avec plus de 1 600 votes. Il dure 2 h 05.",
        },
      ],
    },
    {
      titre: "En famille : Avatar : Les Sept Refuges, sur Paramount+",
      oeuvre: { type: "serie", id: 284833 },
      blocs: [
        {
          p: "Nouvelle série d'animation de Michael Dante DiMartino et Bryan Konietzko, les créateurs d'Avatar, le dernier maître de l'air. Après un cataclysme, une enfant découvre qu'elle est l'Avatar dans un monde qui la craint ; traquée par les humains et les esprits, elle cherche avec sa sœur jumelle à comprendre leurs origines. Les trois premiers épisodes arrivent le vendredi 9 octobre, puis trois chaque vendredi jusqu'aux quatre derniers, le 30 octobre (treize en tout).",
        },
      ],
    },
    {
      titre: "Et aussi cette semaine",
      blocs: [
        {
          ul: [
            "[Animals](/film/animals-1236045) (Netflix, 9 octobre) : thriller réalisé par Ben Affleck, qui joue un candidat à la mairie de Los Angeles dont le fils est enlevé, avec Kerry Washington.",
            "[Protector](/film/protector-1383731) (Prime Video, 5 octobre) : film d'action avec Milla Jovovich en ancienne soldate lancée à la recherche de sa fille kidnappée.",
            "[Matchbox – Le film](/film/matchbox-le-film-1148365) (Apple TV+, 9 octobre) : comédie d'action avec John Cena et Jessica Biel, inspirée des petites voitures.",
            "[Exit 8](/film/exit-8-1408208) (Canal+, 10 octobre) : huis clos japonais dans un couloir de métro sans fin, adapté du jeu vidéo.",
            "[L'Intermédiaire](/film/l-intermediaire-1088166) (Canal+, 7 octobre) : thriller avec Riz Ahmed et Lily James.",
            "[Marsupilami](/film/marsupilami-1145899) (Canal+, 9 octobre) : la comédie de Philippe Lacheau, pour toute la famille.",
            "[MobLand](/serie/mobland-247718) (Paramount+) : la saison 2 avec Tom Hardy et Pierce Brosnan continue, un épisode chaque vendredi.",
          ],
        },
        {
          p: "Tout ce qui sort chaque jour est sur les pages [Netflix](/netflix), [Prime Video](/prime-video), [Canal+](/canal-plus) et [Paramount+](/paramount-plus), et ce qui arrive dans les quatre prochaines semaines dans le [calendrier des sorties](/prochaines-sorties).",
        },
      ],
    },
  ],
};
