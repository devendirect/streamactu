import type { Guide, OeuvreGuide } from "../guides";

/**
 * Données TMDB relevées le 2026-10-09 : titres français, dates de sortie,
 * nombre de saisons, plateformes en France (toutes sur Disney+ ce jour-là,
 * sauf The Mandalorian and Grogu, sorti en salle le 20 mai 2026). Les
 * plateformes affichées dans les listes sont relues chaque jour sur les fiches.
 *
 * Faits extérieurs à TMDB (voir `sources`) : place de chaque titre dans la
 * chronologie de la saga ; Maul – Seigneur de l'ombre se passe quelques années
 * après l'Épisode III ; The Mandalorian and Grogu se passe après la saison 3
 * de la série ; délai de 9 mois avant Disney+ pour un film sorti en salle.
 * Saison 2 d'Ahsoka : premier épisode daté du 20 janvier 2027 par TMDB.
 *
 * Révision : trimestrielle, et à chaque nouveau titre Star Wars.
 */

const EPISODE_I: OeuvreGuide = {
  type: "film",
  id: 1893,
  titre: "Star Wars, épisode I - La Menace fantôme",
  repere: "",
};
const EPISODE_II: OeuvreGuide = {
  type: "film",
  id: 1894,
  titre: "Star Wars, épisode II - L'Attaque des clones",
  repere: "",
};
const EPISODE_III: OeuvreGuide = {
  type: "film",
  id: 1895,
  titre: "Star Wars, épisode III - La Revanche des Sith",
  repere: "",
};
const EPISODE_IV: OeuvreGuide = { type: "film", id: 11, titre: "La Guerre des étoiles", repere: "" };
const EPISODE_V: OeuvreGuide = { type: "film", id: 1891, titre: "L'Empire contre-attaque", repere: "" };
const EPISODE_VI: OeuvreGuide = { type: "film", id: 1892, titre: "Le Retour du Jedi", repere: "" };
const EPISODE_VII: OeuvreGuide = { type: "film", id: 140607, titre: "Star Wars : Le Réveil de la Force", repere: "" };
const EPISODE_VIII: OeuvreGuide = { type: "film", id: 181808, titre: "Star Wars : Les Derniers Jedi", repere: "" };
const EPISODE_IX: OeuvreGuide = { type: "film", id: 181812, titre: "Star Wars : L'Ascension de Skywalker", repere: "" };
const ROGUE_ONE: OeuvreGuide = { type: "film", id: 330459, titre: "Rogue One : A Star Wars Story", repere: "" };
const SOLO: OeuvreGuide = { type: "film", id: 348350, titre: "Solo: A Star Wars Story", repere: "" };
const CLONE_WARS_FILM: OeuvreGuide = { type: "film", id: 12180, titre: "Star Wars : The Clone Wars", repere: "" };
const MANDO_GROGU: OeuvreGuide = { type: "film", id: 1228710, titre: "The Mandalorian and Grogu", repere: "" };

export const GUIDE_STAR_WARS_ORDRE: Guide = {
  slug: "star-wars-ordre",
  titre: "Star Wars dans l'ordre : films, séries et plateformes",
  description:
    "Les films et séries Star Wars dans l'ordre de sortie et dans l'ordre de l'histoire, avec la plateforme de chaque titre en France, vérifiée chaque jour.",
  chapo:
    "En France, toute la saga Star Wars est sur Disney+ : les neuf épisodes, les films dérivés et les séries. Seul le dernier film, The Mandalorian and Grogu, sorti en salle le 20 mai 2026, n'y est pas encore. Pour une première fois, regardez les films dans l'ordre de sortie, en commençant par l'Épisode IV ; pour revoir la saga, l'ordre chronologique ci-dessous intègre les séries.",
  publie: "2026-10-09",
  misAJour: "2026-10-09",
  sections: [
    {
      titre: "Les films dans l'ordre de sortie",
      blocs: [
        {
          p: "C'est l'ordre dans lequel le public a découvert la saga, et celui qui préserve ses révélations. La trilogie originale d'abord, puis la prélogie, qui raconte ce qui s'est passé avant, puis la suite.",
        },
        {
          oeuvres: [
            { ...EPISODE_IV, repere: "Épisode IV, aussi appelé Un nouvel espoir. Sorti en 1977 : le point de départ." },
            { ...EPISODE_V, repere: "Épisode V, 1980." },
            { ...EPISODE_VI, repere: "Épisode VI, 1983. Fin de la trilogie originale." },
            { ...EPISODE_I, repere: "1999. Début de la prélogie, plus de trente ans avant l'Épisode IV dans l'histoire." },
            { ...EPISODE_II, repere: "2002." },
            { ...EPISODE_III, repere: "2005. Fin de la prélogie : elle rejoint le début de l'Épisode IV." },
            { ...CLONE_WARS_FILM, repere: "2008. Film d'animation qui lance la série du même nom ; facultatif." },
            { ...EPISODE_VII, repere: "2015. Début de la troisième trilogie, trente ans après l'Épisode VI." },
            { ...ROGUE_ONE, repere: "2016. Premier film dérivé en prises de vues réelles : il se termine là où commence l'Épisode IV." },
            { ...EPISODE_VIII, repere: "2017." },
            { ...SOLO, repere: "2018. La jeunesse de Han Solo." },
            { ...EPISODE_IX, repere: "2019. Fin de la saga Skywalker." },
            {
              ...MANDO_GROGU,
              repere:
                "Sorti en salle le 20 mai 2026. Suite de la série The Mandalorian, pas encore sur Disney+ (voir plus bas).",
            },
          ],
        },
      ],
    },
    {
      titre: "Toute la saga dans l'ordre de l'histoire",
      blocs: [
        {
          p: "Pour revoir la saga ou suivre les séries, voici les films et les principales séries rangés selon l'époque où ils se passent. Plusieurs séries couvrent plusieurs années et se chevauchent : leur place est celle de leur début. Les repères sont donnés par rapport à l'Épisode IV.",
        },
        {
          oeuvres: [
            {
              type: "serie",
              id: 114479,
              titre: "The Acolyte",
              repere: "Environ un siècle avant l'Épisode I, à la fin de la Haute République. Une saison, la série a été arrêtée.",
            },
            { ...EPISODE_I, repere: "32 ans avant l'Épisode IV." },
            { ...EPISODE_II, repere: "22 ans avant. Début de la guerre des clones." },
            { ...CLONE_WARS_FILM, repere: "Pendant la guerre des clones ; il sert de pilote à la série." },
            {
              type: "serie",
              id: 4194,
              titre: "Star Wars : The Clone Wars",
              repere:
                "Sept saisons d'animation entre les Épisodes II et III. Les derniers épisodes de la saison 7 se déroulent en même temps que l'Épisode III : on peut les garder pour après le film.",
            },
            {
              type: "serie",
              id: 203085,
              titre: "Star Wars: Tales of the Jedi",
              repere: "Six courts épisodes d'animation sur Ahsoka Tano et le comte Dooku, à l'époque de la prélogie.",
            },
            { ...EPISODE_III, repere: "19 ans avant. Fin de la République et ordre 66." },
            {
              type: "serie",
              id: 105971,
              titre: "Star Wars : The Bad Batch",
              repere: "Animation. Commence juste après l'ordre 66, aux premiers jours de l'Empire.",
            },
            {
              type: "serie",
              id: 251091,
              titre: "Star Wars: Tales of the Empire",
              repere: "Six courts épisodes d'animation aux débuts de l'Empire.",
            },
            {
              type: "serie",
              id: 288055,
              titre: "Star Wars: Tales of the Underworld",
              repere: "Six courts épisodes d'animation sur des personnages du milieu criminel, de la guerre des clones à l'Empire.",
            },
            {
              type: "serie",
              id: 289219,
              titre: "Star Wars : Maul - Seigneur de l'ombre",
              repere: "Animation. Quelques années après l'Épisode III : Maul reconstruit son empire criminel.",
            },
            { ...SOLO, repere: "Une dizaine d'années avant l'Épisode IV." },
            {
              type: "serie",
              id: 92830,
              titre: "Obi-Wan Kenobi",
              repere: "Dix ans après l'Épisode III. Une saison de six épisodes.",
            },
            {
              type: "serie",
              id: 83867,
              titre: "Star Wars : Andor",
              repere: "Cinq ans avant l'Épisode IV. La saison 2 couvre les années suivantes, jusqu'à la veille de Rogue One.",
            },
            {
              type: "serie",
              id: 60554,
              titre: "Star Wars Rebels",
              repere: "Animation. Pendant les mêmes années qu'Andor, jusqu'à la veille de l'Épisode IV.",
            },
            { ...ROGUE_ONE, repere: "Juste avant l'Épisode IV." },
            { ...EPISODE_IV, repere: "Le point de repère." },
            { ...EPISODE_V, repere: "3 ans après." },
            { ...EPISODE_VI, repere: "4 ans après. Chute de l'Empire." },
            {
              type: "serie",
              id: 82856,
              titre: "The Mandalorian",
              repere: "Environ 5 ans après l'Épisode VI. Regarder les saisons 1 et 2, puis Le Livre de Boba Fett, puis la saison 3.",
            },
            {
              type: "serie",
              id: 115036,
              titre: "Le Livre de Boba Fett",
              repere: "Entre les saisons 2 et 3 de The Mandalorian ; les épisodes 5 et 6 en sont la suite directe.",
            },
            {
              type: "serie",
              id: 202879,
              titre: "Star Wars : Skeleton Crew",
              repere: "À la même époque que The Mandalorian. Huit épisodes, accessibles sans rien avoir vu.",
            },
            {
              type: "serie",
              id: 114461,
              titre: "Ahsoka",
              repere: "Après la saison 3 de The Mandalorian. Suite directe de Star Wars Rebels.",
            },
            { ...MANDO_GROGU, repere: "Après la saison 3 de The Mandalorian. Pas encore sur Disney+." },
            {
              type: "serie",
              id: 79093,
              titre: "Star Wars Resistance",
              repere: "Animation. Juste avant et pendant l'Épisode VII.",
            },
            { ...EPISODE_VII, repere: "30 ans après l'Épisode VI." },
            { ...EPISODE_VIII, repere: "Suite directe de l'Épisode VII." },
            { ...EPISODE_IX, repere: "Un an après." },
          ],
        },
      ],
    },
    {
      titre: "Par où commencer",
      blocs: [
        {
          ul: [
            "Une première fois : les six premiers films dans l'ordre de sortie (IV, V, VI, puis I, II, III), puis les trois derniers. Comptez environ vingt heures pour les neuf épisodes.",
            "Une seule série : The Mandalorian, la plus populaire sur TMDB, se regarde sans avoir vu les films. Andor, plus adulte, se suit aussi seule, puis mène directement à Rogue One.",
            "Pour les fans de la prélogie : la série The Clone Wars, la plus longue de la saga, développe Anakin, Obi-Wan et Ahsoka entre les Épisodes II et III.",
            "Avec des enfants : Star Wars : Skeleton Crew, dont les héros sont des enfants, ou les films de la trilogie originale.",
          ],
        },
      ],
    },
    {
      titre: "Hors de la chronologie",
      blocs: [
        {
          p: "Plusieurs titres Star Wars de Disney+ n'entrent pas dans l'ordre ci-dessus. [Star Wars: Visions](/serie/star-wars-visions-114478) est une anthologie de courts métrages d'animation confiés à des studios du monde entier, chacun libre de sa version de la saga. [Star Wars : Les Aventures des Petits Jedi](/serie/star-wars-les-aventures-des-petits-jedi-202998) s'adresse aux tout-petits. Les anciennes séries [Star Wars Vintage : Clone Wars](/serie/star-wars-vintage-clone-wars-3122) (2003) et [Star Wars Vintage : Droïdes](/serie/star-wars-vintage-droides-25) (1985) sont proposées en archives : la première a été remplacée par la série The Clone Wars de 2008.",
        },
      ],
    },
    {
      titre: "Ce qui arrive",
      blocs: [
        {
          p: "The Mandalorian and Grogu, sorti au cinéma en France le 20 mai 2026, n'est pas encore sur Disney+. Pour ses propres films sortis en salle, Disney+ doit attendre neuf mois, selon la chronologie des médias : pas avant le 20 février 2027 (voir le guide [pourquoi un film quitte une plateforme](/guides/film-quitte-plateforme)). La saison 2 d'Ahsoka est annoncée sur TMDB pour le 20 janvier 2027, une date à confirmer. Les deux apparaîtront dans le [calendrier des sorties](/prochaines-sorties) et sur la page [Disney+](/disney-plus) dès qu'ils seront datés.",
        },
      ],
    },
  ],
  faq: [
    {
      q: "Dans quel ordre regarder les films Star Wars pour la première fois ?",
      r: "Dans l'ordre de sortie : Épisodes IV, V et VI, puis I, II et III, puis VII, VIII et IX. Rogue One se glisse avant l'Épisode IV si l'on revoit la saga, ou après l'Épisode VII si l'on suit l'ordre de sortie.",
    },
    {
      q: "Où regarder Star Wars en streaming en France ?",
      r: "Sur Disney+, qui propose les neuf épisodes, Rogue One, Solo et les séries. Seul The Mandalorian and Grogu, sorti en salle le 20 mai 2026, n'y est pas encore : pas avant le 20 février 2027.",
    },
    {
      q: "Faut-il voir les films avant The Mandalorian ?",
      r: "Non. La série se passe après l'Épisode VI et se comprend sans les films, même si elle y fait des clins d'œil. Le Livre de Boba Fett se regarde entre ses saisons 2 et 3.",
    },
    {
      q: "Combien de temps faut-il pour voir tous les films Star Wars ?",
      r: "Environ vingt heures pour les neuf épisodes, et près de vingt-cinq heures avec Rogue One et Solo, qui durent chacun plus de deux heures.",
    },
  ],
  sources: [
    {
      titre: "TVLine, « Maul – Shadow Lord Timeline Explained », 2026",
      url: "https://tvline.com/2087488/mal-shadow-lord-timeline-explained-what-watch-before-star-wars-show",
    },
    {
      titre: "TheWrap, « When Is The Mandalorian and Grogu Set in the Star Wars Timeline? », 2026",
      url: "https://www.thewrap.com/creative-content/movies/when-is-the-mandalorian-and-grogu-star-wars-timeline/",
    },
    {
      titre: "Selectra, « Pourquoi les films mettent 17 mois à arriver sur Netflix (et 9 sur Disney+) », mis à jour le 21 août 2026",
      url: "https://selectra.info/telecom/actualites/marche/netflix-france-17-mois-chronologie-medias-films-plus-tard",
    },
  ],
};
