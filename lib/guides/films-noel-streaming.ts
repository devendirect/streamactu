import type { Guide, OeuvreGuide } from "../guides";

/**
 * Données TMDB relevées le 2026-11-20 : films et séries tagués Noël (mots-clés
 * « christmas » et « holiday ») disponibles en abonnement sur Netflix, Prime
 * Video, Disney+, Apple TV+, Canal+, HBO Max et Paramount+ en France, triés par
 * nombre de votes. Les plateformes affichées dans les listes sont relues chaque
 * jour sur les fiches ; le texte du guide n'en fige aucune.
 *
 * Durées (TMDB, en minutes) : voir `repere` de chaque titre. Les résumés
 * d'une ligne ne reprennent que le point de départ du film, sans révéler
 * l'intrigue.
 *
 * Écartés : Un ticket pour deux (se passe à Thanksgiving), Un jour sans fin
 * (Jour de la marmotte), Terrifier 3 (horreur graphique), Valentine's Day.
 *
 * Révision : chaque année vers le 15 novembre (catalogues de fin d'année).
 */

const f = (id: number, titre: string, repere: string): OeuvreGuide => ({ type: "film", id, titre, repere });
const s = (id: number, titre: string, repere: string): OeuvreGuide => ({ type: "serie", id, titre, repere });

export const GUIDE_FILMS_NOEL: Guide = {
  slug: "films-noel-streaming",
  titre: "Films et séries de Noël en streaming : où les voir",
  description:
    "Films et séries de Noël à voir en streaming en France : en famille, comédies romantiques, classiques et Noël décalé, avec la plateforme de chaque titre.",
  chapo:
    "Les films de Noël sont dispersés entre les plateformes : Disney+ garde les Maman, j'ai raté l'avion !, Netflix propose Klaus et Les Chroniques de Noël, Prime Video Love Actually et Last Christmas. Voici une sélection par envie (en famille, comédie romantique, classique, Noël décalé), avec pour chaque titre la durée et la plateforme du jour en France.",
  publie: "2026-11-20",
  misAJour: "2026-11-20",
  sections: [
    {
      titre: "En famille",
      blocs: [
        {
          p: "Des films qui se regardent à tout âge, la plupart d'animation ou de comédie. Les plus anciens (Maman, j'ai raté l'avion !, Super Noël) plaisent souvent autant aux parents qu'aux enfants.",
        },
        {
          ordre: "sortie",
          sommaire: "En famille",
          oeuvres: [
            f(771, "Maman, j'ai raté l'avion !", "1 h 43. Un garçon oublié à la maison pendant que sa famille part à Paris, face à deux cambrioleurs."),
            f(772, "Maman, j'ai encore raté l'avion !", "1 h 59. Le même garçon, cette fois perdu seul à New York."),
            f(9479, "L'Étrange Noël de monsieur Jack", "1 h 15. Film d'animation en volume : le roi d'Halloween découvre Noël et veut s'en emparer."),
            f(11395, "Super Noël", "1 h 37. Tim Allen devient le Père Noël malgré lui."),
            f(10719, "Elfe", "1 h 37. Will Ferrell, humain élevé parmi les elfes, part à New York retrouver son père."),
            f(5255, "Le Pôle express", "1 h 40. Film d'animation de Robert Zemeckis : un garçon monte dans un train qui file vers le pôle Nord."),
            f(17979, "Le Drôle de Noël de Scrooge", "1 h 36. Film d'animation d'après Dickens, avec Jim Carrey."),
            f(51052, "Mission : Noël - Les Aventures de la famille Noël", "1 h 38. Film d'animation : comment le Père Noël distribue les cadeaux en une nuit, grâce à un centre high-tech au pôle Nord."),
            f(508965, "Klaus", "1 h 38. Film d'animation : un facteur et un fabricant de jouets aux origines du Père Noël."),
            f(360920, "Le Grinch", "1 h 45. Film d'animation : le Grinch veut voler Noël."),
            f(527435, "Les Chroniques de Noël", "1 h 40. Kurt Russell en Père Noël, dans une comédie d'aventure."),
          ],
        },
      ],
    },
    {
      titre: "Comédies romantiques",
      blocs: [
        {
          p: "Les histoires d'amour de décembre, de la comédie chorale londonienne aux films Netflix de la saison. Chacune se regarde seule ou à deux.",
        },
        {
          ordre: "sortie",
          sommaire: "Comédies romantiques",
          oeuvres: [
            f(508, "Love Actually", "2 h 15. Des histoires croisées à Londres, dans les semaines qui précèdent Noël."),
            f(1581, "The Holiday", "2 h 15. Cameron Diaz et Kate Winslet échangent leurs maisons, de Los Angeles à l'Angleterre."),
            f(549053, "Last Christmas", "1 h 42. Emilia Clarke et Henry Golding à Londres, sur les chansons de George Michael."),
            f(615665, "Holidate", "1 h 44. Deux célibataires s'associent pour traverser les fêtes de l'année."),
            f(556803, "La Princesse de Chicago", "1 h 41. Une pâtissière et une future princesse se ressemblent trait pour trait et échangent leurs places."),
            f(734265, "Love hard", "1 h 45. Une comédie romantique : une Californienne rejoint un homme rencontré sur une appli."),
          ],
        },
      ],
    },
    {
      titre: "Classiques",
      blocs: [
        {
          p: "Des films qu'on revoit d'une année sur l'autre, dont une adaptation de roman qui s'ouvre à Noël.",
        },
        {
          ordre: "sortie",
          sommaire: "Classiques",
          oeuvres: [
            f(1621, "Un fauteuil pour deux", "1 h 57. John Landis, avec Eddie Murphy et Dan Aykroyd : un pari insensé entre deux hommes que tout oppose, un directeur de banque et un petit escroc, autour de Noël."),
            f(9587, "Les Quatre Filles du docteur March", "1 h 55. Adaptation du roman de Louisa May Alcott, qui s'ouvre à Noël."),
            f(8871, "Le Grinch", "1 h 44. La version de 2000, de Ron Howard, avec Jim Carrey."),
          ],
        },
      ],
    },
    {
      titre: "Un Noël décalé",
      blocs: [
        {
          p: "Pour ceux qui ont déjà tout vu : des films d'action ou fantastiques qui se passent à Noël, mais pas pour les plus jeunes (Gremlins mêle comédie et horreur).",
        },
        {
          ordre: "sortie",
          sommaire: "Noël décalé",
          oeuvres: [
            f(927, "Gremlins", "1 h 45. Joe Dante : à Noël, des créatures adorables se transforment en monstres."),
            f(364, "Batman : Le Défi", "2 h 06. Tim Burton : Noël à Gotham, face au Pingouin et à Catwoman."),
            f(845781, "Red One", "2 h 04. Dwayne Johnson et Chris Evans doivent retrouver le Père Noël enlevé."),
          ],
        },
      ],
    },
    {
      titre: "Séries pour les fêtes",
      blocs: [
        {
          p: "Pour regarder plus d'un soir : des séries qui se déroulent à Noël ou pendant les fêtes de fin d'année.",
        },
        {
          ordre: "sortie",
          sommaire: "Séries de Noël",
          oeuvres: [
            s(88329, "Hawkeye", "Série Marvel de 2021, à Noël à New York : Clint Barton et Kate Bishop."),
            s(111625, "Dash & Lily", "Deux jeunes échangent un carnet dans New York pendant les fêtes."),
            s(95612, "Home for Christmas", "Série norvégienne : une trentenaire jongle entre ses ex et ses nouvelles relations pendant les fêtes."),
            s(225385, "Black Doves", "Thriller londonien à Noël, avec Keira Knightley et Ben Whishaw."),
            s(155631, "Super Noël, la série", "La suite du film Super Noël, en série."),
          ],
        },
      ],
    },
    {
      titre: "Comment retrouver un film de Noël qui change de plateforme",
      blocs: [
        {
          p: "Les catalogues de fin d'année bougent vite : un film présent sur une plateforme le 20 novembre peut avoir changé le 15 décembre. La plateforme affichée sur chaque titre de ce guide est relue chaque jour sur sa fiche. Pour une autre envie, les pages [Disney+](/disney-plus/films), [Netflix](/netflix/films) et [Prime Video](/prime-video/films) listent leurs films, et les pages [genre familial](/genre/familial) et [genre romance](/genre/romance) trient les films du site par envie. Pour savoir ce qui sort cette semaine, voir le [calendrier des sorties](/prochaines-sorties).",
        },
      ],
    },
  ],
  faq: [
    {
      q: "Où regarder des films de Noël en streaming en France ?",
      r: "Sur Disney+ (Maman, j'ai raté l'avion !, Super Noël, L'Étrange Noël de monsieur Jack), Netflix (Klaus, Les Chroniques de Noël, Love hard), Prime Video (Love Actually, Last Christmas, Red One), HBO Max (Gremlins, Batman : Le Défi) et Paramount+ (Un fauteuil pour deux). Les plateformes changent d'une semaine à l'autre : la page de chaque titre donne celle du jour.",
    },
    {
      q: "Quels films de Noël regarder en famille avec de jeunes enfants ?",
      r: "Klaus, Le Pôle express, Mission : Noël et Le Grinch sont des films d'animation. Maman, j'ai raté l'avion ! et Super Noël sont des comédies familiales. Gremlins, Batman : Le Défi et Red One sont plutôt pour les plus grands.",
    },
    {
      q: "Quel est le film de Noël le plus connu ?",
      r: "Il n'y en a pas un seul. Parmi les titres de ce guide, Maman, j'ai raté l'avion ! a le plus de votes sur TMDB (plus de 13 000), devant L'Étrange Noël de monsieur Jack, Le Grinch et Love Actually.",
    },
    {
      q: "Y a-t-il des séries de Noël ?",
      r: "Oui : Hawkeye (Disney+), Dash & Lily, Home for Christmas et Black Doves (Netflix), Super Noël, la série (Disney+). Ce guide les réunit dans la dernière section.",
    },
  ],
  sources: [
    { titre: "The Movie Database (TMDB), mots-clés Noël, données de disponibilité en France (JustWatch), consultées le 20 novembre 2026", url: "https://www.themoviedb.org" },
  ],
};
