import type { Article } from "../actu";

/**
 * Données TMDB relevées le vendredi 2026-11-20 (séries par réseau d'origine
 * et par plateforme en France, films par sortie numérique française ; dates
 * des épisodes par /tv/{id}/season/{n}). BROUILLON : à relire par l'éditeur
 * avant publication (passer `brouillon` à false).
 *
 * Vérifications du 20/11 :
 * - Percy Jackson saison 3 : Disney+ le vendredi 20/11, deux épisodes, puis
 *   deux par vendredi (27/11, 4/12, final le 11/12) ; page Disney+ et
 *   press.disneyplus.com ; adaptation du Sort du Titan (dexerto.fr). Pas de
 *   résumé de saison sur TMDB : rien d'inventé sur l'intrigue.
 * - Michael : diffusion Canal+ le vendredi 20/11 à 21 h 10 (serie-news.com,
 *   superpouvoir.com), semaine « CANAL 80's » ; TMDB : sortie numérique FR le
 *   20/11, cinéma le 22 avril, pas de plateforme FR. Durée TMDB 127 min.
 * - Yellowjackets saison 4 : TMDB date l'épisode 1 du dimanche 22/11 (heure
 *   américaine) ; en France, Paramount+ annonce le vendredi 20/11
 *   (sortiraparis.com, serie-news.com), dernière saison, 10 épisodes,
 *   un par semaine. Les saisons précédentes étaient aussi sur Canal+ : ne pas
 *   écrire Canal+. À confirmer par l'éditeur.
 * - The Altruists : huit épisodes Netflix le jeudi 19/11 (TMDB, statut
 *   « Ended »). Rôles TMDB : Julia Garner (Caroline Ellison), Anthony Boyle
 *   (Sam Bankman-Fried). Pas de plateforme FR sur TMDB : la fiche peut ne pas
 *   afficher Netflix le jour même.
 * - Madden : Prime Video le mercredi 18/11 (TMDB, release_dates FR type 4 et
 *   plateforme FR). Durée 111 min, note 8/10 sur 25 votes seulement : non citée.
 * - Les Anneaux de pouvoir : épisodes 5 et 6 le mercredi 18, derniers
 *   épisodes le 25. 12 12 12 : épisode 3 jeudi 19 (TMDB, heure américaine),
 *   vendredi 20 en France à confirmer. Nocturne : épisode 5 le 19.
 * - Écartés : Dexter: Resurrection (épisode 4 daté du 22 par TMDB, jour
 *   français non vérifié), La Comtesse de Monte-Cristo (TF1 ; Netflix ?
 *   aucune note, non vérifié), Gordon et La loi de la bête (peu de votes).
 */
export const ARTICLE_2026_11_20_WEEKEND: Article = {
  slug: "que-regarder-ce-week-end-20-novembre-2026",
  format: "week-end",
  titre: "Que regarder ce week-end : 20 au 22 novembre 2026",
  description:
    "Percy Jackson saison 3 sur Disney+, Michael sur Canal+, Yellowjackets saison 4 sur Paramount+, The Altruists sur Netflix : que regarder ce week-end.",
  chapo:
    "Disney+ lance ce vendredi 20 novembre la saison 3 de Percy Jackson et les Olympiens, avec deux épisodes d'un coup. Le même soir, Canal+ diffuse Michael, le film sur Michael Jackson, et Paramount+ commence la dernière saison de Yellowjackets. Sur Netflix, The Altruists raconte en huit épisodes l'affaire FTX, et Prime Video propose Madden avec Nicolas Cage.",
  publie: "2026-11-20",
  misAJour: "2026-11-20",
  brouillon: false,
  sections: [
    {
      titre: "Percy Jackson et les Olympiens, saison 3, sur Disney+",
      oeuvre: { type: "serie", id: 103540 },
      blocs: [
        {
          p: "Les deux premiers épisodes sont en ligne ce vendredi 20 novembre ; deux autres suivront chaque vendredi, jusqu'au final le 11 décembre. Cette saison adapte Le Sort du Titan, le troisième roman de Rick Riordan. Walker Scobell (Percy), Leah Sava Jeffries (Annabeth) et Aryan Simhadri (Grover) reprennent leurs rôles. La série tient 7,3/10 sur TMDB, avec plus de 800 votes.",
        },
      ],
    },
    {
      titre: "Michael, sur Canal+",
      oeuvre: { type: "film", id: 936075 },
      blocs: [
        {
          p: "Sorti au cinéma le 22 avril, le film d'Antoine Fuqua passe sur Canal+ ce vendredi 20 novembre à 21 h 10, en clôture de la semaine « CANAL 80's ». Il raconte Michael Jackson au-delà de la musique, des débuts avec les Jackson Five jusqu'à ses premiers succès en solo. Son neveu Jaafar Jackson tient le rôle principal, face à Colman Domingo (Joseph Jackson) et Nia Long (Katherine Jackson). Le film dure 2 h 07 et obtient 8,6/10 sur TMDB, avec plus de 4 700 votes.",
        },
      ],
    },
    {
      titre: "Yellowjackets, saison 4, sur Paramount+",
      oeuvre: { type: "serie", id: 117488 },
      blocs: [
        {
          p: "La dernière saison commence ce vendredi 20 novembre, avec dix épisodes à raison d'un par semaine. Après un crash d'avion, des lycéennes d'une équipe de football survivent dans une région sauvage du nord des États-Unis ; vingt-cinq ans plus tard, les survivantes essaient de se reconstruire, mais leur pacte de silence sur ce qui s'est passé pendant dix-neuf mois tient de moins en moins. Melanie Lynskey (Shauna) et Tawny Cypress (Taissa) mènent la distribution adulte. La série tient 7,4/10 sur TMDB, avec plus de 1 000 votes.",
        },
      ],
    },
    {
      titre: "The Altruists, sur Netflix",
      oeuvre: { type: "serie", id: 308007 },
      blocs: [
        {
          p: "Les huit épisodes sont en ligne depuis le jeudi 19 novembre. La série de Graham Moore raconte l'histoire vraie de Sam Bankman-Fried et de sa compagne Caroline Ellison : deux jeunes idéalistes qui montent FTX, une plateforme d'échange de cryptomonnaies, et sa société sœur Alameda Research, puis utilisent l'argent de leurs clients pour des investissements risqués. Julia Garner joue Caroline Ellison et Anthony Boyle Sam Bankman-Fried.",
        },
      ],
    },
    {
      titre: "Madden, sur Prime Video",
      oeuvre: { type: "film", id: 1131943 },
      blocs: [
        {
          p: "Disponible depuis le mercredi 18 novembre, le film de David O. Russell retrace le parcours de John Madden, de son duo avec Al Davis chez les Raiders à son rôle de voix du football américain, jusqu'à la création du jeu vidéo Madden NFL. Nicolas Cage joue John Madden, Christian Bale Al Davis et Kathryn Hahn son épouse Virginia. Le film dure 1 h 51.",
        },
      ],
    },
    {
      titre: "Et aussi cette semaine",
      blocs: [
        {
          ul: [
            "[Les Anneaux de pouvoir](/serie/le-seigneur-des-anneaux-les-anneaux-de-pouvoir-84773), saison 3 (Prime Video, mercredi 18 novembre) : épisodes 5 et 6, les deux derniers arrivent le 25.",
            "[12 12 12](/serie/12-12-12-254630) (Apple TV+) : troisième épisode cette semaine, puis un par semaine jusqu'au 24 décembre ; [Nocturne](/serie/nocturne-292741) continue aussi.",
            "[Rivals](/serie/rivals-208921), saison 2 (Disney+, mercredi 18 novembre) : épisode 10 sur 12, les deux derniers les 25 novembre et 2 décembre.",
            "[Soeurs de sort](/film/soeurs-de-sort-1595124) (Netflix, vendredi 20 novembre) : film d'animation qui reprend Cendrillon du point de vue de Lilith, l'une des belles-sœurs, avec les voix d'Ali Wong et d'Amanda Seyfried (1 h 32).",
            "[MobLand](/serie/mobland-247718) et [Tulsa King](/serie/tulsa-king-153312) (Paramount+, vendredi 20 novembre) : nouveaux épisodes ; [The Gilded Age](/serie/the-gilded-age-81723) (HBO Max) continue le dimanche 22.",
          ],
        },
        {
          p: "Tout ce qui sort chaque jour est sur les pages [Netflix](/netflix), [Prime Video](/prime-video), [Canal+](/canal-plus), [Disney+](/disney-plus) et [Apple TV+](/apple-tv-plus), et ce qui arrive dans les quatre prochaines semaines dans le [calendrier des sorties](/prochaines-sorties).",
        },
      ],
    },
  ],
};
