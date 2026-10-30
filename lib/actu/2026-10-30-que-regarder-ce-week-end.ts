import type { Article } from "../actu";

/**
 * Données TMDB relevées le vendredi 2026-10-30 (calendrier du site : séries
 * par réseau d'origine et par plateforme en France, films par sortie
 * numérique française ; dates des épisodes par /tv/{id}/season/{n}).
 * Relu par l'éditeur et publié le vendredi 30 octobre au matin.
 *
 * Vérifications du 30/10 :
 * - Scream 7 : sortie numérique Canal+ le 30/10 (TMDB, release_dates FR) ;
 *   diffusion à 21 h 10 le vendredi (echosdunet.net, serie-news.com). TMDB
 *   ne liste pas encore Canal+ dans les plateformes FR du film.
 * - Nocturne : TMDB date les deux premiers épisodes du jeudi 29 (heure
 *   américaine) ; Apple annonce une sortie mondiale le vendredi 30, puis un
 *   épisode chaque vendredi jusqu'au 25 décembre (iphonesoft.fr, upi.com).
 *   Adaptation de Lazarus et Le Marchand de sable de Lars Kepler, série
 *   d'abord intitulée Lazarus. Plateformes FR absentes de TMDB.
 * - Avatar : Les Sept Refuges : épisodes 10 à 13 le vendredi 30 (TMDB,
 *   thewrap.com), renouvelée pour d'autres saisons (darkhorizons.com).
 * - Dead-End Job : sortie le 30/10 (about.netflix.com) ; série créée par
 *   Han Jun-hee (D.P.), réalisée par Kim Da-min. Pas de titre français :
 *   TMDB n'a que le titre coréen, que la fiche du site affiche (꿀알바) ;
 *   son adresse canonique est /serie/-289517, le lien passe par
 *   /serie/dead-end-job-289517 (la fiche se trouve par l'identifiant).
 * - The Gilded Age saison 4 : lundi 2 novembre en France (article de
 *   novembre, vérifié le 27/10).
 *
 * Contexte : Halloween samedi 31, Toussaint dimanche 1er novembre, reprise
 * des cours le lundi 2 novembre dans toutes les zones (vacances-scolaires.com).
 */
export const ARTICLE_2026_10_30_WEEKEND: Article = {
  slug: "que-regarder-ce-week-end-30-octobre-2026",
  format: "week-end",
  titre: "Que regarder ce week-end : 30 octobre au 1er novembre 2026",
  description:
    "Scream 7 sur Canal+, Nocturne sur Apple TV+, la fin d'Avatar : Les Sept Refuges sur Paramount+ : que regarder le week-end d'Halloween.",
  chapo:
    "Le week-end d'Halloween s'ouvre ce vendredi avec Scream 7 sur Canal+, le retour de Neve Campbell face à Ghostface. Apple TV+ lance Nocturne, une traque de tueur en série avec Liev Schreiber, Zazie Beetz et Stephen Graham. Pour le dernier week-end des vacances de la Toussaint, Paramount+ met en ligne la fin de la première saison d'Avatar : Les Sept Refuges, et Prime Video propose Drive – The Pretenders.",
  publie: "2026-10-30",
  misAJour: "2026-10-30",
  brouillon: false,
  sections: [
    {
      titre: "Scream 7, sur Canal+",
      oeuvre: { type: "film", id: 1159559 },
      blocs: [
        {
          p: "Huit mois après sa sortie au cinéma, le 25 février, le film arrive sur Canal+ le vendredi 30 octobre, la veille d'Halloween, avec une diffusion à 21 h 10. Kevin Williamson, le scénariste du premier Scream, passe derrière la caméra. Neve Campbell revient en Sidney Prescott, qui a refait sa vie dans une petite ville tranquille : quand un nouveau Ghostface s'en prend à sa fille, elle doit reprendre le combat. Courteney Cox retrouve Gale Weathers. Le film dure 1 h 54 et obtient 6,2/10 sur TMDB, avec près de 1 400 votes.",
        },
      ],
    },
    {
      titre: "Nocturne, sur Apple TV+",
      oeuvre: { type: "serie", id: 292741 },
      blocs: [
        {
          p: "Nouvelle série en dix épisodes : les deux premiers le vendredi 30 octobre, puis un chaque vendredi jusqu'au 25 décembre. Une victime du tueur en série Jurek Walter réapparaît vivante, et l'enquêteur Jonah Lynn, joué par Liev Schreiber, se lance dans une course contre la montre pour retrouver la dernière personne encore disparue. Zazie Beetz joue Saga Bauer, l'agente du FBI qui s'infiltre pour faire parler le tueur, et Stephen Graham, Jurek Walter. Rowan Joffé adapte Lazarus et Le Marchand de sable, deux romans du duo suédois Lars Kepler.",
        },
      ],
    },
    {
      titre: "Avatar : Les Sept Refuges, fin de saison sur Paramount+",
      oeuvre: { type: "serie", id: 284833 },
      blocs: [
        {
          p: "Les quatre derniers épisodes de la première saison, du 10e au 13e, sortent le vendredi 30 octobre. Michael Dante DiMartino et Bryan Konietzko, les créateurs d'Avatar, le dernier maître de l'air, imaginent la succession de Korra : après une catastrophe, une jeune maîtresse de la terre découvre qu'elle est le nouvel Avatar, vue comme un présage de fin du monde. Une série d'animation à regarder en famille avant la rentrée du lundi 2 novembre. Elle obtient 9/10 sur TMDB, avec plus de 130 votes, et d'autres saisons sont déjà commandées.",
        },
      ],
    },
    {
      titre: "Drive – The Pretenders, sur Prime Video",
      oeuvre: { type: "film", id: 1596275 },
      blocs: [
        {
          p: "Film allemand de Sergej Moya, en ligne depuis le mercredi 28 octobre. Une jeune mécanicienne accepte de jouer la fiancée d'un champion automobile en disgrâce : officiellement pour redorer l'image du pilote, en secret pour décrocher sa chance au volant. Mais le mensonge devient bien plus qu'un arrangement. Lisa-Marie Koroll et Amin Baahmed tiennent les rôles principaux. Une romance sur fond de course, qui dure 1 h 43 et obtient 7,8/10 sur TMDB (une trentaine de votes).",
        },
      ],
    },
    {
      titre: "Et aussi cette semaine",
      blocs: [
        {
          ul: [
            "[Dead-End Job](/serie/dead-end-job-289517) (Netflix, vendredi 30 octobre) : K-drama d'horreur en huit épisodes avec Lee Jae-wook, créé par Han Jun-hee (D.P.). Un jeune endetté accepte un petit boulot payé cinquante fois le salaire minimum dans une supérette, où chaque service peut lui coûter la vie.",
            "[Trouble échange](/serie/trouble-echange-336240) (Netflix, vendredi 30 octobre) : série suédoise en quatre épisodes avec Frida Gustavsson et Fares Fares ; un échange de maisons entre la Sicile et Stockholm tourne mal pour deux couples fortunés.",
            "[Balaraw : Blood Island](/serie/balaraw-blood-island-313699) (Netflix, jeudi 29 octobre) : série philippine en huit épisodes ; à la recherche de sa mère disparue, une femme débarque sur une île sinistre.",
            "[La Chute d'El Mayo](/serie/la-chute-d-el-mayo-338689) (Netflix, jeudi 29 octobre) et [Celui qui s'appelait Matthew Perry](/serie/celui-qui-s-appelait-matthew-perry-333533) (Netflix, mardi 27 octobre) : deux documentaires en trois épisodes, sur le cofondateur du cartel de Sinaloa et sur l'acteur de Friends.",
            "[Ali G : J'suis qui ?](/film/ali-g-j-suis-qui-1727734) (Prime Video, mercredi 28 octobre) : Sacha Baron Cohen reprend son personnage, qui part aux États-Unis retrouver sa gloire passée avant la naissance de son enfant (1 h 29).",
            "[Les Rayons et les Ombres](/film/les-rayons-et-les-ombres-1318335) (Canal+, mardi 27 octobre) : le film de Xavier Giannoli avec Jean Dujardin en patron de presse de la Collaboration (3 h 15). Et le dimanche 1er novembre, [L'Incroyable Femme des neiges](/film/l-incroyable-femme-des-neiges-1221711), la comédie de Sébastien Betbeder avec Blanche Gardin.",
            "[MobLand](/serie/mobland-247718) et [Tulsa King](/serie/tulsa-king-153312) (Paramount+) : nouveaux épisodes le vendredi 30 octobre.",
            "[Outlander: Blood of My Blood](/serie/outlander-blood-of-my-blood-207484) (HBO Max) : épisode 7 de la saison 2 le vendredi 30 octobre ; [The Gilded Age](/serie/the-gilded-age-81723) revient pour sa saison 4 le lundi 2 novembre.",
          ],
        },
        {
          p: "Tout ce qui sort chaque jour est sur les pages [Netflix](/netflix), [Prime Video](/prime-video), [Canal+](/canal-plus) et [Disney+](/disney-plus), et ce qui arrive dans les quatre prochaines semaines dans le [calendrier des sorties](/prochaines-sorties).",
        },
      ],
    },
  ],
};
