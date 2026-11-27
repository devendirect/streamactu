import type { Article } from "../actu";

/**
 * Données TMDB relevées le vendredi 2026-11-27 (séries par réseau d'origine
 * et par plateforme en France, films par sortie numérique française ; dates
 * des épisodes par /tv/{id}/season/{n}). BROUILLON : à relire par l'éditeur
 * avant publication (passer `brouillon` à false).
 *
 * Vérifications du 27/11 :
 * - Blade Runner 2099 : TMDB date les huit épisodes du mardi 24 (heure
 *   américaine) ; en France, Prime Video le mercredi 25, saison entière
 *   (gameblog.fr, aboutamazon.com). Série limitée, statut TMDB « Ended ».
 *   Note TMDB 5,2/10 sur 55 votes : non citée.
 * - Quasimodo, l'âme de Paris : Netflix le vendredi 27 (TMDB release_dates FR
 *   type 4, sortiraparis.com, whats-on-netflix.com) ; Jean-François Richet,
 *   Vincent Cassel ; Daphné Patakia en Esmeralda (sortiraparis.com, pas TMDB).
 *   1 h 43. Pas de plateforme FR sur TMDB ce matin : la fiche peut ne pas
 *   afficher Netflix le jour même.
 * - Les Anneaux de pouvoir saison 3 : épisodes 7 et 8 (fin de saison) le
 *   mercredi 25 (dexerto.fr, jechange.fr) ; TMDB dit le 24 (heure américaine).
 * - The Mosquito Bowl : Netflix le mercredi 25 (Tudum, TMDB FR type 4),
 *   d'après le livre de Buzz Bissinger ; 2 h 09.
 * - Warrior Kid : Apple TV le mercredi 25 (TMDB FR type 4, 9to5mac.com : date
 *   repoussée du 20 au 25 novembre) ; McG, Chris Pratt ; 1 h 47.
 * - Spider-Man: Brand New Day : TMDB seul, sortie numérique FR (type 4) le
 *   jeudi 26, pas de plateforme d'abonnement, DVD/Blu-ray (type 5) le 2/12.
 *   « Achat et location » à confirmer par l'éditeur.
 * - Percy Jackson : épisodes 3 et 4 le vendredi 27 (calendrier vérifié le 20/11).
 * - The Gilded Age : épisode 5 le dimanche 29 aux États-Unis, HBO Max le lundi 30.
 * - Écartés : The Hunting Wives saison 2 (Netflix le 26 aux États-Unis, mais
 *   la saison 1 était sur Canal+/Polar+ en France : plateforme française non
 *   confirmée), Sweetpea saison 2 (Paramount+ FR ? jour non vérifié),
 *   Fool Night (Netflix, pas de plateforme FR sur TMDB, 2 votes).
 */
export const ARTICLE_2026_11_27_WEEKEND: Article = {
  slug: "que-regarder-ce-week-end-27-novembre-2026",
  format: "week-end",
  titre: "Que regarder ce week-end : 27 au 29 novembre 2026",
  description:
    "Blade Runner 2099 et la fin des Anneaux de pouvoir sur Prime Video, Quasimodo et The Mosquito Bowl sur Netflix : que regarder ce week-end.",
  chapo:
    "Prime Video a mis en ligne mercredi 25 novembre Blade Runner 2099, avec Michelle Yeoh et Hunter Schafer, en huit épisodes d'un coup, et la fin de la saison 3 des Anneaux de pouvoir. Netflix sort ce vendredi 27 Quasimodo, l'âme de Paris, avec Vincent Cassel, après The Mosquito Bowl de Peter Berg mercredi. Apple TV propose Warrior Kid avec Chris Pratt.",
  publie: "2026-11-27",
  misAJour: "2026-11-27",
  brouillon: false,
  sections: [
    {
      titre: "Blade Runner 2099, sur Prime Video",
      oeuvre: { type: "serie", id: 171802 },
      blocs: [
        {
          p: "Les huit épisodes de cette série limitée sont en ligne depuis le mercredi 25 novembre. Cinquante ans après Blade Runner 2049, Cora, une fugitive devenue Blade Runner, fait équipe avec Olwen, une Réplicante en fin de vie, pour traquer un fugitif dans un Los Angeles qui reprend vie. Ensemble, elles mettent au jour une vérité qui menace leur ville. Michelle Yeoh joue Olwen et Hunter Schafer Cora ; la série est créée par Silka Luisa.",
        },
      ],
    },
    {
      titre: "Quasimodo, l'âme de Paris, sur Netflix",
      oeuvre: { type: "film", id: 1480665 },
      blocs: [
        {
          p: "Le film de Jean-François Richet sort ce vendredi 27 novembre. Paris, 1830 : alors que le choléra menace la ville, un homme recherché pour d'obscures expériences médicales se retrouve pris entre la révolte et un amour impossible. Le film imagine l'homme qui aurait inspiré le personnage de Victor Hugo. Vincent Cassel, qui retrouve Richet après les deux Mesrine et L'Empereur de Paris, tient le rôle-titre, avec Daphné Patakia en Esmeralda, Benjamin Voisin, Karim Leklou et Noémie Lvovsky. Le film dure 1 h 43.",
        },
      ],
    },
    {
      titre: "Les Anneaux de pouvoir, saison 3, sur Prime Video",
      oeuvre: { type: "serie", id: 84773 },
      blocs: [
        {
          p: "Les épisodes 7 et 8, qui terminent la saison, sont en ligne depuis le mercredi 25 novembre : les huit épisodes peuvent donc se regarder d'une traite ce week-end. La guerre entre les Elfes et Sauron fait rage, pendant que le Seigneur des Ténèbres travaille en secret à forger l'Anneau unique. Charlie Vickers (Sauron), Morfydd Clark (Galadriel) et Robert Aramayo (Elrond) reprennent leurs rôles. La série tient 7,2/10 sur TMDB, avec plus de 4 000 votes.",
        },
      ],
    },
    {
      titre: "The Mosquito Bowl, sur Netflix",
      oeuvre: { type: "film", id: 1458300 },
      blocs: [
        {
          p: "Disponible depuis le mercredi 25 novembre, le film de Peter Berg adapte le livre de Buzz Bissinger. Après Pearl Harbor, quatre vedettes du football américain universitaire s'engagent dans les Marines et découvrent la fraternité et le prix de la guerre. Nicholas Galitzine, Bill Skarsgård, Ray Nicholson et Tom Francis mènent la distribution. Le film dure 2 h 09.",
        },
      ],
    },
    {
      titre: "Warrior Kid, sur Apple TV",
      oeuvre: { type: "film", id: 1280115 },
      blocs: [
        {
          p: "En ligne depuis le mercredi 25 novembre, le film de McG suit Jake, un commando de la Marine blessé en mission, qui aide son neveu Marc, un adolescent timide et malmené, à prendre confiance grâce aux principes appris dans l'armée. Chris Pratt joue Jake, Jude Hill Marc et Linda Cardellini Sarah. Un film familial de 1 h 47.",
        },
      ],
    },
    {
      titre: "Et aussi cette semaine",
      blocs: [
        {
          ul: [
            "[Percy Jackson et les Olympiens](/serie/percy-jackson-et-les-olympiens-103540), saison 3 (Disney+, vendredi 27 novembre) : épisodes 3 et 4, les suivants le 4 décembre et le final le 11.",
            "[Spider-Man : Brand New Day](/film/spider-man-brand-new-day-969681) : sorti au cinéma le 29 juillet, le film de Destin Daniel Cretton avec Tom Holland est en achat et location numérique depuis le jeudi 26 novembre ; il n'est pas encore sur une plateforme d'abonnement.",
            "[Noël à la page](/film/noel-a-la-page-1611767) (Prime Video, lundi 23 novembre) : comédie romantique de Noël, deux éditeurs rivaux coincés sur la route de New York par une tempête de neige (1 h 50).",
            "[The Gilded Age](/serie/the-gilded-age-81723), saison 4 (HBO Max) : épisode 5 le lundi 30 novembre.",
          ],
        },
        {
          p: "Tout ce qui sort chaque jour est sur les pages [Netflix](/netflix), [Prime Video](/prime-video), [Canal+](/canal-plus), [Disney+](/disney-plus) et [Apple TV+](/apple-tv-plus), et ce qui arrive dans les quatre prochaines semaines dans le [calendrier des sorties](/prochaines-sorties). Les nouveautés de décembre sont dans [notre sélection du mois](/actu/nouveautes-streaming-du-mois).",
        },
      ],
    },
  ],
};
