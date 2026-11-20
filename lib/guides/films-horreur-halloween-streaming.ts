import type { Guide, OeuvreGuide } from "../guides";

/**
 * Données TMDB relevées le 2026-11-20 : films du genre horreur (au moins 2 500
 * votes) et films du mot-clé Halloween disponibles en abonnement sur Netflix,
 * Prime Video, Disney+, Apple TV+, Canal+, HBO Max et Paramount+ en France ;
 * séries d'horreur, de mystère et d'Halloween. Les plateformes affichées dans
 * les listes sont relues chaque jour sur les fiches ; le texte du guide n'en
 * fige aucune, sauf chapo et FAQ (datés).
 *
 * Durées (TMDB) dans `repere`. Les résumés d'une ligne reprennent le point de
 * départ ou le réalisateur, sans révéler l'intrigue.
 *
 * Écartés : Terrifier 3 (horreur graphique, Noël), les films à très forte
 * violence, les séries de pur mystère sans horreur (Dark, Severance).
 *
 * Révision : chaque année vers le 15 octobre (catalogues d'automne), et à
 * chaque nouvelle saison d'une série citée.
 */

const f = (id: number, titre: string, repere: string): OeuvreGuide => ({ type: "film", id, titre, repere });
const s = (id: number, titre: string, repere: string): OeuvreGuide => ({ type: "serie", id, titre, repere });

export const GUIDE_FILMS_HORREUR_HALLOWEEN: Guide = {
  slug: "films-horreur-halloween-streaming",
  titre: "Films d'horreur à voir en streaming pour Halloween",
  description:
    "Films et séries d'horreur à voir en streaming en France, classés par envie : sans trop avoir peur, classiques, slashers, horreur psychologique, séries.",
  chapo:
    "Pour Halloween, le plus simple est de choisir selon l'envie plutôt que selon la plateforme : un film pour frissonner en famille, un classique à voir une fois, un slasher entre amis, ou une série à enchaîner. Au 20 novembre 2026, les films d'horreur sont surtout sur HBO Max, Netflix, Disney+ et Prime Video. Chaque titre de ce guide affiche la plateforme du jour en France.",
  publie: "2026-11-20",
  misAJour: "2026-11-20",
  sections: [
    {
      titre: "Frissonner sans trop avoir peur",
      blocs: [
        {
          p: "Des films de monstres, de fantômes et de sorcières qui se regardent en famille ou à partir de l'enfance : de l'animation, de l'humour et peu de sang.",
        },
        {
          ordre: "sortie",
          sommaire: "Sans trop avoir peur",
          oeuvres: [
            f(4011, "Beetlejuice", "1 h 38. Tim Burton : un couple de fantômes fait appel à un esprit farceur pour chasser les nouveaux habitants de leur maison."),
            f(162, "Edward aux mains d'argent", "1 h 45. Tim Burton, avec Johnny Depp : un être artificiel aux ciseaux à la place des mains."),
            f(2907, "La Famille Addams", "1 h 39. La famille de personnages macabres, dans sa version des années 1990."),
            f(2758, "Les Valeurs de la famille Addams", "1 h 34. La suite de La Famille Addams."),
            f(10439, "Hocus Pocus : Les Trois Sorcières", "1 h 36. Un garçon réveille à Salem trois sorcières exécutées au XVIIe siècle."),
            f(8839, "Casper", "1 h 41. Un jeune fantôme s'ennuie dans son manoir jusqu'à l'arrivée d'une fillette et de son père."),
            f(3933, "Les Noces funèbres", "1 h 15. Film d'animation en volume de Tim Burton, entre le monde des vivants et celui des morts."),
            f(62214, "Frankenweenie", "1 h 27. Tim Burton : un garçon ramène son chien à la vie."),
            f(9479, "L'Étrange Noël de monsieur Jack", "1 h 15. Film d'animation en volume : le roi d'Halloween découvre Noël."),
          ],
        },
      ],
    },
    {
      titre: "Les classiques à voir une fois",
      blocs: [
        {
          p: "Des films qui ont fait date et qu'on cite encore. Les plus anciens font moins peur par leurs effets que par leur atmosphère ; ils conviennent à qui veut comprendre d'où viennent les autres.",
        },
        {
          ordre: "sortie",
          sommaire: "Classiques",
          oeuvres: [
            f(9552, "L'Exorciste", "2 h 13. William Friedkin, 1973."),
            f(578, "Les Dents de la Mer", "2 h 04. Steven Spielberg, 1975."),
            f(348, "Alien, le huitième passager", "1 h 58. Ridley Scott, 1979 : l'horreur dans un vaisseau spatial."),
            f(694, "Shining", "1 h 59. Stanley Kubrick, d'après Stephen King."),
            f(9426, "La Mouche", "1 h 36. David Cronenberg, 1986."),
            f(6114, "Dracula", "2 h 10. Francis Ford Coppola, 1992."),
            f(628, "Entretien avec un vampire", "2 h 03. Neil Jordan, avec Tom Cruise et Brad Pitt."),
            f(2667, "Le Projet Blair Witch", "1 h 21. Un faux documentaire tourné caméra à l'épaule, qui a popularisé le genre dit « found footage »."),
          ],
        },
      ],
    },
    {
      titre: "Slashers et sagas",
      blocs: [
        {
          p: "Le tueur, les victimes, les codes qu'on connaît par cœur : le genre idéal à plusieurs. Les Scream jouent avec ces codes ; les autres les installent.",
        },
        {
          ordre: "sortie",
          sommaire: "Slashers",
          oeuvres: [
            f(4488, "Vendredi 13", "1 h 35. Le premier de la série, en 1980, dans un camp de vacances."),
            f(10585, "Jeu d'enfant", "1 h 27. Une poupée tueuse : le premier film de la série Chucky."),
            f(4232, "Scream", "1 h 51. Wes Craven, 1996."),
            f(4233, "Scream 2", "2 h 00. La suite, en 1997."),
            f(9532, "Destination finale", "1 h 38. Des jeunes échappent à la mort, qui les rattrape."),
            f(176, "Saw", "1 h 43. James Wan, 2004. Plus violent que les autres titres de cette liste."),
            f(424139, "Halloween", "1 h 45. La suite directe du film de 1978, avec Jamie Lee Curtis."),
            f(646385, "Scream", "1 h 54. Le retour de la série en 2022."),
            f(934433, "Scream VI", "2 h 03. Les survivants à New York."),
          ],
        },
      ],
    },
    {
      titre: "Frissons surnaturels",
      blocs: [
        {
          p: "Maisons hantées, poupées, exorcismes : l'horreur qui fait sursauter. L'univers Conjuring se regarde dans l'ordre de sortie, mais chaque film se comprend seul.",
        },
        {
          ordre: "sortie",
          sommaire: "Frissons surnaturels",
          oeuvres: [
            f(49018, "Insidious", "1 h 42. James Wan : une famille dont le fils tombe dans le coma."),
            f(138843, "Conjuring : Les Dossiers Warren", "1 h 52. James Wan : les enquêteurs Ed et Lorraine Warren."),
            f(250546, "Annabelle", "1 h 39. La poupée du premier Conjuring, en film à part."),
            f(259693, "Conjuring 2 : Le Cas Enfield", "2 h 13. À Londres, dans une maison hantée."),
            f(396422, "Annabelle 2 : La Création du Mal", "1 h 49. Le passé de la poupée."),
            f(439079, "La Nonne", "1 h 37. En Roumanie, dans l'univers Conjuring."),
            f(423108, "Conjuring : Sous l'emprise du Diable", "1 h 52. Le troisième film de la série."),
            f(346364, "Ça", "2 h 15. Andy Muschietti, d'après Stephen King : des enfants face à un clown."),
          ],
        },
      ],
    },
    {
      titre: "L'horreur qui fait réfléchir",
      blocs: [
        {
          p: "Des films qui misent sur le malaise et l'ambiance plus que sur le sang. Ils se discutent après la séance.",
        },
        {
          ordre: "sortie",
          sommaire: "Horreur psychologique",
          oeuvres: [
            f(44214, "Black Swan", "1 h 48. Darren Aronofsky, avec Natalie Portman : une danseuse sous pression."),
            f(310131, "The Witch", "1 h 32. Robert Eggers : une famille dans la Nouvelle-Angleterre du XVIIe siècle."),
            f(419430, "Get Out", "1 h 44. Jordan Peele : un jeune homme rend visite à la famille de sa compagne."),
            f(447332, "Sans un bruit", "1 h 30. John Krasinski : une famille qui ne doit faire aucun bruit."),
            f(381288, "Split", "1 h 57. M. Night Shyamalan : un homme aux nombreuses personnalités."),
            f(493922, "Hérédité", "2 h 06. Ari Aster : une famille endeuillée."),
            f(530385, "Midsommar", "2 h 28. Ari Aster : une fête d'été en Suède. Le film est éprouvant par moments."),
            f(458723, "Us", "1 h 56. Jordan Peele : une famille face à ses doubles."),
            f(381283, "mother !", "1 h 55. Darren Aronofsky : un film déroutant, à voir en connaissance de cause."),
          ],
        },
      ],
    },
    {
      titre: "Pour rire autant que pour frissonner",
      blocs: [
        {
          p: "Des films d'horreur où l'humour tient autant de place que la peur, pour ceux qui aiment le genre sans l'excès.",
        },
        {
          ordre: "sortie",
          sommaire: "Horreur et humour",
          oeuvres: [
            f(927, "Gremlins", "1 h 45. Joe Dante, 1984 : des créatures adorables qui ne le restent pas."),
            f(765, "Evil Dead 2", "1 h 25. Sam Raimi, 1987 : une cabane dans les bois et beaucoup d'humour noir."),
            f(755, "Une Nuit en enfer", "1 h 47. Robert Rodriguez, avec George Clooney, sur un scénario de Quentin Tarantino."),
            f(19908, "Bienvenue à Zombieland", "1 h 28. Ruben Fleischer, avec Woody Harrelson : des survivants dans un monde de zombies."),
            f(567609, "Wedding Nightmare", "1 h 31. Une jeune mariée, la famille de son mari et une nuit de noces qui tourne mal."),
            f(593643, "Le Menu", "1 h 46. Ralph Fiennes et Anya Taylor-Joy : un dîner dans un restaurant sur une île."),
          ],
        },
      ],
    },
    {
      titre: "Séries à enchaîner",
      blocs: [
        {
          p: "Pour regarder plus d'un soir : des séries d'horreur, de fantastique ou de mystère à frissons, de la plus familiale (La Forêt de l'étrange, Mercredi) aux plus sombres.",
        },
        {
          ordre: "sortie",
          sommaire: "Séries à frissons",
          oeuvres: [
            s(1413, "American Horror Story", "Une anthologie : chaque saison raconte une histoire différente."),
            s(61617, "La Forêt de l'étrange", "Série d'animation en épisodes de 12 minutes, pour les plus jeunes, entre mystère et humour."),
            s(66732, "Stranger Things", "Des enfants face à des phénomènes étranges dans une petite ville américaine des années 1980."),
            s(72844, "The Haunting of Hill House", "Mike Flanagan : une famille et une maison hantée, à deux époques."),
            s(109958, "The Haunting of Bly Manor", "Mike Flanagan : une gouvernante dans un manoir anglais."),
            s(119051, "Mercredi", "Mercredi Addams dans un pensionnat pour élèves hors du commun."),
            s(83659, "Le Cabinet de curiosités de Guillermo del Toro", "Une anthologie de huit histoires d'horreur."),
            s(124364, "FROM", "Des voyageurs piégés dans une ville dont on ne peut pas sortir."),
          ],
        },
      ],
    },
    {
      titre: "Pour aller plus loin",
      blocs: [
        {
          p: "Les pages [genre horreur](/genre/horreur) et [genre familial](/genre/familial) trient les films du site par envie. Pour une soirée en fin d'année, voir le guide [films et séries de Noël](/guides/films-noel-streaming). Pour savoir ce qui sort cette semaine, voir le [calendrier des sorties](/prochaines-sorties).",
        },
      ],
    },
  ],
  faq: [
    {
      q: "Quel film d'horreur regarder pour commencer ?",
      r: "Pour un premier film, Sans un bruit, Get Out ou Scream sont de bons choix : du suspense et peu de scènes insoutenables. Pour les enfants, Casper, Hocus Pocus ou Frankenweenie.",
    },
    {
      q: "Quels films d'horreur regarder en famille ?",
      r: "La Famille Addams, Hocus Pocus, Casper, Les Noces funèbres, Frankenweenie et L'Étrange Noël de monsieur Jack sont des films d'animation ou de comédie conçus pour un public large.",
    },
    {
      q: "Quelle plateforme propose le plus de films d'horreur ?",
      r: "Au 20 novembre 2026, d'après nos relevés, HBO Max (29 titres) et Netflix (20) proposent le plus de films d'horreur parmi les soixante films d'horreur les plus votés sur TMDB, devant Disney+ (13) et Prime Video (12). La page de chaque titre donne la plateforme du jour.",
    },
    {
      q: "Y a-t-il des séries d'horreur pour toute la famille ?",
      r: "La Forêt de l'étrange (animation, épisodes de 12 minutes) et Mercredi sont les plus accessibles. The Haunting of Hill House et American Horror Story s'adressent à un public adulte.",
    },
  ],
  sources: [
    { titre: "The Movie Database (TMDB), genre horreur et mot-clé Halloween, données de disponibilité en France (JustWatch), consultées le 20 novembre 2026", url: "https://www.themoviedb.org" },
  ],
};
