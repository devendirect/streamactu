import type { Article } from "../actu";

/**
 * Données TMDB relevées le vendredi 2026-11-13 (séries par réseau d'origine
 * et par plateforme en France, films par sortie numérique française ; dates
 * des épisodes par /tv/{id}/season/{n}). À relire par l'éditeur avant
 * publication.
 *
 * Vérifications du 13/11 :
 * - Les Anneaux de pouvoir saison 3 : quatre épisodes le mercredi 11/11, deux
 *   le 18, deux le 25 (TMDB ; cineserie.com pour la date française). Résumé de
 *   saison TMDB : guerre des Elfes et de Sauron, forge de l'Anneau unique.
 * - Marty Supreme : sortie numérique Canal+ le mardi 10/11 (TMDB,
 *   release_dates FR), diffusion à 21 h 10 (serie-news.com). Cinéma France le
 *   mercredi 18 février. Durée TMDB 150 min (serie-news.com indique 146).
 *   TMDB ne liste pas encore Canal+ dans les plateformes FR du film.
 * - Send Help : Disney+ le vendredi 13/11 en France (serie-news.com du 1er/11,
 *   tv-direct.fr, jechange.fr). TMDB n'a pas de sortie numérique française ni
 *   de plateforme FR pour ce film : la fiche du site peut ne pas afficher
 *   Disney+ le jour même. Cinéma France le mercredi 11 février.
 * - L'Impératrice saison 3 : six épisodes le jeudi 12/11, série terminée
 *   (TMDB, statut « Ended »). Pas de résumé de saison sur TMDB : rien
 *   d'inventé sur l'intrigue.
 * - 12 12 12 : TMDB date les deux premiers épisodes du jeudi 12 (heure
 *   américaine) ; Apple annonce une sortie mondiale le vendredi 13, puis un
 *   épisode chaque vendredi jusqu'au 25 décembre (showbizjunkies.com,
 *   tvinsider.com), comme pour Nocturne. Les rôles de Mackie et Dornan (agent
 *   du FBI, braqueur) ne sont pas attribués par TMDB : non précisés.
 *   À CORRIGER dans l'article de novembre, qui dit « jeudi 12 novembre » et
 *   « jusqu'au 24 décembre » (et Nocturne « chaque jeudi »).
 * - VisionQuest : épisode 8 daté du mardi 10 par TMDB (heure américaine),
 *   mercredi 11 en France, comme les précédents ; série au statut « Ended ».
 * - Écartés : El crimen de Pazos (Netflix, 13/11), sans titre français ni
 *   plateforme FR sur TMDB ; The Chosen saison 6 et Shetland saison 11, pas de
 *   date française ; Dexter: Resurrection saison 2, comme le 6/11.
 */
export const ARTICLE_2026_11_13_WEEKEND: Article = {
  slug: "que-regarder-ce-week-end-13-novembre-2026",
  format: "week-end",
  titre: "Que regarder ce week-end : 13 au 15 novembre 2026",
  description:
    "Les Anneaux de pouvoir saison 3 sur Prime Video, Marty Supreme sur Canal+, Send Help sur Disney+, 12 12 12 sur Apple TV+ : que regarder ce week-end.",
  chapo:
    "Prime Video a lancé mercredi la saison 3 des Anneaux de pouvoir, avec quatre épisodes d'un coup. Canal+ propose depuis mardi Marty Supreme, avec Timothée Chalamet. Ce vendredi 13, Disney+ met en ligne Send Help, le film de survie de Sam Raimi, et Apple TV+ commence 12 12 12, une série de braquage avec Anthony Mackie et Jamie Dornan. Sur Netflix, L'Impératrice se termine avec sa troisième saison.",
  publie: "2026-11-13",
  misAJour: "2026-11-13",
  brouillon: false,
  sections: [
    {
      titre: "Les Anneaux de pouvoir, saison 3, sur Prime Video",
      oeuvre: { type: "serie", id: 84773 },
      blocs: [
        {
          p: "Quatre épisodes sont en ligne depuis le mercredi 11 novembre ; deux suivront le 18, et les deux derniers le 25. La série de Patrick McKay et John D. Payne reprend en pleine guerre entre les Elfes et Sauron : le Seigneur des Ténèbres travaille en secret à forger l'Anneau unique, celui qui doit gouverner tous les autres. Charlie Vickers (Sauron), Morfydd Clark (Galadriel) et Robert Aramayo (Elrond) reprennent leurs rôles. La série tient 7,2/10 sur TMDB, avec plus de 4 000 votes.",
        },
      ],
    },
    {
      titre: "Marty Supreme, sur Canal+",
      oeuvre: { type: "film", id: 1317288 },
      blocs: [
        {
          p: "Sorti au cinéma le 18 février, le film de Josh Safdie est arrivé sur Canal+ le mardi 10 novembre. Timothée Chalamet joue Marty Mauser, 23 ans, qui veut devenir le meilleur joueur de tennis de table au monde, un sport peu reconnu aux États-Unis. Pour financer ses compétitions à l'étranger, il est prêt à tout, y compris à se rapprocher d'une ancienne actrice, jouée par Gwyneth Paltrow, et de son riche mari, et son entourage en fait souvent les frais. Le film dure 2 h 30 et obtient 7,4/10 sur TMDB, avec 2 400 votes.",
        },
      ],
    },
    {
      titre: "Send Help, sur Disney+",
      oeuvre: { type: "film", id: 1198994 },
      blocs: [
        {
          p: "Le film de Sam Raimi arrive sur Disney+ ce vendredi 13 novembre, neuf mois après sa sortie au cinéma. Après un accident d'avion, deux collègues se retrouvent seuls survivants sur une île déserte : Linda, une employée pleine de ressources jouée par Rachel McAdams, et Bradley, son patron tyrannique, joué par Dylan O'Brien. Ils doivent mettre de côté leurs vieilles rancunes pour survivre. Entre horreur, thriller et comédie, le film dure 1 h 53 et obtient 7/10 sur TMDB, avec 2 500 votes.",
        },
      ],
    },
    {
      titre: "12 12 12, sur Apple TV+",
      oeuvre: { type: "serie", id: 254630 },
      blocs: [
        {
          p: "Nouvelle série de braquage en huit épisodes : les deux premiers ce vendredi 13 novembre, puis un chaque vendredi jusqu'au 25 décembre. Le titre résume une règle : un braquage se prépare en 12 mois, s'exécute en 12 heures, et un braqueur qui n'est pas arrêté dans les 12 jours ne le sera jamais. Sur trois époques, un agent du FBI et un criminel de carrière se poursuivent à travers l'Europe. Anthony Mackie et Jamie Dornan mènent la distribution de cette série créée par Dudi Appleton et Jim Keeble, avec la Française Agathe Rousselle.",
        },
      ],
    },
    {
      titre: "L'Impératrice, saison 3, sur Netflix",
      oeuvre: { type: "serie", id: 131488 },
      blocs: [
        {
          p: "Les six épisodes de la troisième et dernière saison sont en ligne depuis le jeudi 12 novembre. La série allemande de Katharina Eyssen raconte Élisabeth, Sissi, jouée par Devrim Lingnau : devenue impératrice en épousant François-Joseph, joué par Philip Froissant, elle affronte les pressions et les intrigues de la cour de Vienne. La série tient 7,7/10 sur TMDB, avec 190 votes.",
        },
      ],
    },
    {
      titre: "Et aussi cette semaine",
      blocs: [
        {
          ul: [
            "[The Body](/serie/the-body-291507) (Netflix, mercredi 11 novembre) : série en huit épisodes de Quinn Shephard ; le soir d'Halloween, un rite d'initiation tourne au cauchemar pour une troupe de danseuses.",
            "[Heartland](/film/heartland-1543469) (Netflix, vendredi 13 novembre) : film à suspense de Shana Feste avec Jessica Chastain, en ancienne star de la country qui enquête sur la disparition de sa nièce.",
            "[Un bon avocat](/film/un-bon-avocat-1616419) (Netflix, lundi 9 novembre) : film français de Tristan Séguéla avec Laurent Lafitte, en avocat qui sort de cure de désintoxication et a une semaine pour préparer son propre procès, aidé par un stagiaire joué par Anthony Bajon (2 h 01).",
            "[ChiaroScuro](/serie/chiaroscuro-336243) (Netflix, mercredi 11 novembre) : série policière italienne en huit épisodes ; à Rome, un expert en art aide la police après la découverte d'un corps dans un musée.",
            "[À l'épreuve du diable](/serie/a-l-epreuve-du-diable-214582), saison 3 (Netflix, mardi 10 novembre) : le jeu de stratégie coréen revient avec cinq épisodes, la suite les 17 et 24 novembre.",
            "[Hunting Season](/film/hunting-season-1387382) (Prime Video, lundi 9 novembre) : film d'action avec Mel Gibson, en homme retiré dans les forêts de l'Oklahoma qui recueille une jeune femme blessée et poursuivie (1 h 39, 7,4/10 sur TMDB).",
            "[Juste une illusion](/film/juste-une-illusion-1404684) (Canal+, samedi 14 novembre) : le film d'Olivier Nakache et Éric Toledano avec Louis Garrel et Camille Cottin, sur un garçon de bientôt 13 ans en banlieue parisienne en 1985 (1 h 56) ; et [L'enfant du désert](/film/l-enfant-du-desert-1266800), film d'aventure familial de Gilles de Maistre avec Kev Adams, le vendredi 13 novembre.",
            "[Being Heumann](/film/being-heumann-1050981) (Apple TV+, vendredi 13 novembre) : film de Sian Heder sur la militante des droits des personnes handicapées Judy Heumann, avec Ruth Madeley et Mark Ruffalo (2 h 07).",
            "[Rivals](/serie/rivals-208921), seconde partie de la saison 2 (Disney+, mercredi 11 novembre) : trois épisodes, puis un chaque mercredi jusqu'au 2 décembre ; [VisionQuest](/serie/visionquest-213375) s'est terminée le même jour avec son huitième épisode.",
            "[MobLand](/serie/mobland-247718) (Paramount+) : avant-dernier épisode de la saison 2 le vendredi 13 novembre, avec un nouvel épisode de [Tulsa King](/serie/tulsa-king-153312) ; [Nocturne](/serie/nocturne-292741) (Apple TV+) continue le même jour, et [L'Institut](/serie/l-institut-253372) (HBO Max) le dimanche 15.",
          ],
        },
        {
          p: "Tout ce qui sort chaque jour est sur les pages [Netflix](/netflix), [Prime Video](/prime-video), [Canal+](/canal-plus), [Disney+](/disney-plus) et [Apple TV+](/apple-tv-plus), et ce qui arrive dans les quatre prochaines semaines dans le [calendrier des sorties](/prochaines-sorties).",
        },
      ],
    },
  ],
};
