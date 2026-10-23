import type { Article } from "../actu";

/**
 * Données TMDB relevées le vendredi 2026-10-23 (calendrier du site : séries
 * par réseau d'origine et par plateforme en France, films par sortie
 * numérique française ; dates des épisodes par /tv/{id}/season/{n}).
 * Brouillon : à relire par l'éditeur avant publication ce vendredi matin.
 *
 * Points à vérifier avant de passer brouillon à false (recherche du 23/10) :
 * - Le Charles : NON CONFIRMÉ. TMDB ne date toujours que l'épisode 1 ;
 *   AlloCiné, Wikipédia et LeBlogTVNews donnent seulement « à partir du
 *   23 octobre » (6 × 52 min), aucune source ne dit si les six épisodes
 *   sortent ensemble. Le texte reste prudent (« à partir du vendredi
 *   23 octobre ») ; à vérifier dans l'appli Prime Video.
 * - VisionQuest : CONFIRMÉ. Épisodes 3 et 4 le mercredi 21 en France, 5 et 6
 *   le 28 (TMDB ; superpouvoir.com, treyler.fr).
 *
 * Faits extérieurs à TMDB : la partie 3 de Lupin date d'octobre 2023 (TMDB
 * la date du 5 octobre 2023) ; Hubert Charuel a réalisé Petit Paysan ;
 * Météors était en sélection à Cannes en 2025 (TMDB : festival de Cannes,
 * 19 mai 2025) ; The Terminal List adapte les romans de Jack Carr.
 */
export const ARTICLE_2026_10_23_WEEKEND: Article = {
  slug: "que-regarder-ce-week-end-23-octobre-2026",
  format: "week-end",
  titre: "Que regarder ce week-end : 23 au 25 octobre 2026",
  description:
    "Lupin partie 4 sur Netflix, Le Charles et The Terminal List saison 2 sur Prime Video, Météors sur Canal+ : que regarder le week-end du 23 octobre.",
  chapo:
    "Omar Sy revient ce vendredi en Assane Diop : la quatrième partie de Lupin sort sur Netflix, trois ans après la précédente. Prime Video mise sur le polar français avec Le Charles, une enquête à bord du porte-avions Charles de Gaulle, et sur la deuxième saison de The Terminal List avec Chris Pratt. Netflix sort aussi la saison 3 de Nobody Wants This, et Canal+ propose Météors, le film d'Hubert Charuel.",
  publie: "2026-10-23",
  misAJour: "2026-10-23",
  brouillon: false,
  sections: [
    {
      titre: "Lupin partie 4, sur Netflix",
      oeuvre: { type: "serie", id: 96677 },
      blocs: [
        {
          p: "Les huit épisodes sont en ligne d'un coup le vendredi 23 octobre. Omar Sy reprend le rôle d'Assane Diop, le cambrioleur qui s'inspire des aventures d'Arsène Lupin, trois ans après la partie 3, sortie en octobre 2023. La série française la plus vue de Netflix est créée par George Kay et François Uzan ; George Kay signe aussi WAR, en ce moment sur HBO Max. Les parties précédentes obtiennent 7,7/10 sur TMDB, avec près de 2 700 votes. Un programme tout trouvé pour le week-end.",
        },
      ],
    },
    {
      titre: "Le Charles, sur Prime Video",
      oeuvre: { type: "serie", id: 306163 },
      blocs: [
        {
          p: "Nouvelle série française, à partir du vendredi 23 octobre. Le porte-avions Charles de Gaulle part en mission en Méditerranée orientale quand une femme de l'équipage est retrouvée morte et une autre portée disparue. La mission continue, un enquêteur militaire est envoyé à bord, et une nouvelle victime est découverte : 1 800 hommes et 240 femmes enfermés en mer avec un tueur. Élodie Yung, Alban Lenoir, Jacques Gamblin, Patrick Mille et Constance Labbé en sont les têtes d'affiche. Six épisodes.",
        },
      ],
    },
    {
      titre: "The Terminal List saison 2, sur Prime Video",
      oeuvre: { type: "serie", id: 120911 },
      blocs: [
        {
          p: "Les huit épisodes sont arrivés le mercredi 21 octobre. Chris Pratt retrouve James Reece, ancien commando de la marine américaine qui a vengé son unité dans la première saison. Cette fois, la CIA l'accule et il doit laver son nom en arrêtant un groupe terroriste qui a rallié l'un de ses amis, sur fond de conspiration entre Moscou et Langley. La saison adapte Le Vrai Croyant, deuxième roman de la série de Jack Carr. Taylor Kitsch, Riley Keough et Constance Wu sont aussi au générique. La série obtient 8/10 sur TMDB, avec plus de 1 250 votes.",
        },
      ],
    },
    {
      titre: "Nobody Wants This saison 3, sur Netflix",
      oeuvre: { type: "serie", id: 250923 },
      blocs: [
        {
          p: "Les dix épisodes sont en ligne depuis le jeudi 22 octobre. Kristen Bell joue Joanne, podcasteuse qui parle de sexe sans tabou, et Adam Brody Noah, un rabbin, dans cette comédie romantique créée par Erin Foster : leur couple doit survivre à leurs vies opposées et à leurs familles. Des épisodes d'une demi-heure, faciles à enchaîner. La série obtient 7,3/10 sur TMDB, avec environ 300 votes.",
        },
      ],
    },
    {
      titre: "Météors, sur Canal+",
      oeuvre: { type: "film", id: 1262773 },
      blocs: [
        {
          p: "Le deuxième film d'Hubert Charuel, le réalisateur de Petit Paysan, est arrivé sur Canal+ le jeudi 22 octobre. Trois amis inséparables, dans la « diagonale du vide » : Tony est devenu le roi du BTP, Mika et Dan les rois de rien du tout. Après un plan raté de trop, les deux derniers vont travailler pour Tony sur un site de stockage de déchets nucléaires. Paul Kircher, Idir Azougli et Salif Cissé jouent les trois amis. Présenté au festival de Cannes en 2025, sorti en salle le 8 octobre 2025, il obtient 6,8/10 sur TMDB (une trentaine de votes). Il dure 1 h 50.",
        },
      ],
    },
    {
      titre: "Et aussi cette semaine",
      blocs: [
        {
          ul: [
            "[Cyberpunk: Edgerunners](/serie/cyberpunk-edgerunners-105248) (Netflix, 20 octobre) : la saison 2 de l'animé tiré de l'univers Cyberpunk, dix épisodes d'un coup.",
            "[The Prison Experiment : La nouvelle expérience de Stanford](/serie/the-prison-experiment-la-nouvelle-experience-de-stanford-335319) (Netflix, 21 octobre) : télé-réalité en six épisodes, trente personnes enfermées deux semaines dans une prison, d'après la célèbre expérience de psychologie.",
            "[Furcy, né libre](/film/furcy-ne-libre-960051) (Canal+, 20 octobre) : le film d'Abd Al Malik, avec Makita Samba et Romain Duris ; à la Réunion en 1817, un esclave se lance dans une bataille judiciaire pour faire reconnaître sa liberté.",
            "[The Last Refuge](/film/the-last-refuge-1103437) (Canal+, 24 octobre) : film d'horreur avec Michelle Dockery, sur des orphelins qui fuient après une épidémie qui a tué presque tous les adultes.",
            "[La Messagerie du Diable](/serie/la-messagerie-du-diable-337950) (HBO Max, 23 octobre) : série documentaire française en trois épisodes sur Sky ECC, la messagerie chiffrée de la pègre piratée par des enquêteurs français.",
            "[VisionQuest](/serie/visionquest-213375) (Disney+) : épisodes 3 et 4 le mercredi 21 octobre, puis 5 et 6 le 28.",
            "[Slow Horses](/serie/slow-horses-95480) (Apple TV+) : fin de la saison 6 le 21 octobre ; [Dark Matter](/serie/dark-matter-196322) : avant-dernier épisode de la saison 2 le 22, la fin le 29.",
            "[Tulsa King](/serie/tulsa-king-153312), [MobLand](/serie/mobland-247718) et [Avatar : Les Sept Refuges](/serie/avatar-les-sept-refuges-284833) (Paramount+) : nouveaux épisodes le vendredi 23 octobre.",
            "[Tony](/film/tony-1329016) (Prime Video, lundi 26 octobre) : les débuts du jeune Anthony Bourdain en cuisine, avec Dominic Sessa et Antonio Banderas.",
          ],
        },
        {
          p: "Tout ce qui sort chaque jour est sur les pages [Netflix](/netflix), [Prime Video](/prime-video), [Canal+](/canal-plus) et [Disney+](/disney-plus), et ce qui arrive dans les quatre prochaines semaines dans le [calendrier des sorties](/prochaines-sorties).",
        },
      ],
    },
  ],
};
