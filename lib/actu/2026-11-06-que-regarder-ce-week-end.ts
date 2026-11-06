import type { Article } from "../actu";

/**
 * Données TMDB relevées le vendredi 2026-11-06 (séries par réseau d'origine
 * et par plateforme en France, films par sortie numérique française ; dates
 * des épisodes par /tv/{id}/season/{n}). Relu par l'éditeur avant publication.
 *
 * Vérifications du 6/11 :
 * - Super Mario Galaxy, le film : sortie numérique Canal+ le 6/11 (TMDB,
 *   release_dates FR) ; diffusion à 21 h 10 le vendredi (serie-news.com du
 *   30/10). Sorti au cinéma en France le 1er avril. Rosalina s'appelle
 *   Harmonie en VF (serie-news.com). TMDB ne liste pas encore Canal+ dans les
 *   plateformes FR du film.
 * - Black Doves saison 2 : six épisodes le jeudi 5/11 (TMDB, article de
 *   novembre vérifié le 27/10). Pas de résumé de saison sur TMDB : rien
 *   d'inventé sur l'intrigue de la saison 2.
 * - The Greatest : huit épisodes le mercredi 4/11 (TMDB, article de novembre).
 * - The Mongoose : Prime Video le 4/11 en France (TMDB, cineserie.com) ;
 *   cinéma américain le 30/10. Réalisateur incertain selon les sources
 *   (Mark Vanselow sur TMDB) : non cité.
 * - L'Institut saison 2 : HBO Max le dimanche 8/11, un épisode par semaine
 *   (serie-news.com du 31/10, TMDB).
 * - L'impératrice remariée : Disney+ mercredi 4/11 en France (article de
 *   novembre ; TMDB date du 3, heure américaine).
 * - Écarté : Dexter: Resurrection saison 2, pas de date française annoncée
 *   par Canal+ (cineserie.com, 19/10).
 */
export const ARTICLE_2026_11_06_WEEKEND: Article = {
  slug: "que-regarder-ce-week-end-6-novembre-2026",
  format: "week-end",
  titre: "Que regarder ce week-end : 6 au 8 novembre 2026",
  description:
    "Super Mario Galaxy sur Canal+, Black Doves saison 2 sur Netflix, The Greatest et The Mongoose sur Prime Video : que regarder ce week-end.",
  chapo:
    "Canal+ diffuse ce vendredi Super Mario Galaxy, le film, sept mois après sa sortie au cinéma. Netflix a mis en ligne jeudi la saison 2 de Black Doves, avec Keira Knightley et Ben Whishaw. Prime Video propose deux nouveautés depuis mercredi : The Greatest, une série sur les débuts de Muhammad Ali, et The Mongoose, un film d'action avec Liam Neeson.",
  publie: "2026-11-06",
  misAJour: "2026-11-06",
  brouillon: false,
  sections: [
    {
      titre: "Super Mario Galaxy, le film, sur Canal+",
      oeuvre: { type: "film", id: 1226863 },
      blocs: [
        {
          p: "Sorti au cinéma le 1er avril, le film arrive sur Canal+ le vendredi 6 novembre, avec une diffusion à 21 h 10. Aaron Horvath et Michael Jelenic, les réalisateurs du premier film, envoient cette fois Mario et Luigi loin du royaume Champignon : entre l'amitié naissante avec Yoshi et l'anniversaire de Peach, un appel à l'aide venu de l'autre bout de la galaxie les lance vers de nouveaux mondes, aux côtés de la princesse Harmonie et face à Bowser Jr. Un film d'animation de 1 h 40 pour le week-end en famille, qui obtient 8,2/10 sur TMDB, avec près de 4 000 votes.",
        },
      ],
    },
    {
      titre: "Black Doves, saison 2, sur Netflix",
      oeuvre: { type: "serie", id: 225385 },
      blocs: [
        {
          p: "Les six épisodes de la deuxième saison sont en ligne depuis le jeudi 5 novembre. La série d'espionnage britannique de Joe Barton suit Helen Webb, jouée par Keira Knightley, une espionne infiltrée comme épouse d'un homme politique, et Sam Young, joué par Ben Whishaw, le tueur à gages et vieil ami qui l'a aidée à venger son amant. Sarah Lancashire reprend le rôle de Mrs Reed, la responsable de l'agence. La première saison obtient 7/10 sur TMDB, avec près de 470 votes : de quoi la rattraper avant d'enchaîner.",
        },
      ],
    },
    {
      titre: "The Greatest, sur Prime Video",
      oeuvre: { type: "serie", id: 258989 },
      blocs: [
        {
          p: "Nouvelle série en huit épisodes, tous en ligne depuis le mercredi 4 novembre. Ben Watkins raconte les années où Cassius Clay devient Muhammad Ali : tout juste médaillé d'or aux Jeux olympiques de 1960, le jeune boxeur vise le titre des poids lourds, entre la célébrité, les doutes, un conflit familial et une Amérique qui n'est pas prête à le voir décider seul de sa vie. Jaalen Best joue Ali, Omari Hardwick son père et Amin Joseph Sonny Liston, son adversaire pour le titre.",
        },
      ],
    },
    {
      titre: "The Mongoose, sur Prime Video",
      oeuvre: { type: "film", id: 1294189 },
      blocs: [
        {
          p: "Film d'action en ligne depuis le mercredi 4 novembre, quelques jours après sa sortie au cinéma aux États-Unis. Liam Neeson joue Ryan Flanagan, un héros de guerre marqué par le stress post-traumatique, accusé d'un crime qu'il n'a pas commis. Il n'a plus rien à perdre et entraîne la police dans une course-poursuite à travers le pays, aidé par ses anciens frères d'armes, sous les encouragements d'un public captivé. Marisa Tomei, Ving Rhames et Michael Chiklis complètent la distribution. Le film dure 1 h 39 et obtient 6,1/10 sur TMDB (une cinquantaine de votes).",
        },
      ],
    },
    {
      titre: "Et aussi cette semaine",
      blocs: [
        {
          ul: [
            "[Campus Drivers](/serie/campus-drivers-303044) (Prime Video, vendredi 6 novembre) : série française en six épisodes, créée par Thomas Boullé, avec Carmen Kassovitz ; une étudiante qui rejoint son grand amour sur le campus croise le créateur de l'application la plus en vogue de l'université.",
            "[Une vie arrachée : Natalee Holloway](/serie/une-vie-arrachee-natalee-holloway-338684) (Netflix, mercredi 4 novembre) : documentaire en trois épisodes sur la disparition d'une lycéenne américaine à Aruba en 2005, raconté par sa mère.",
            "[Anesthésie](/serie/anesthesie-312006) (Netflix, mercredi 4 novembre) : série polonaise en huit épisodes avec Leszek Lichota, en chirurgien qui quitte une clinique prestigieuse pour un petit hôpital après une opération ratée.",
            "[Mon beau Noël de chien](/film/mon-beau-noel-de-chien-1570488) (Netflix, mercredi 4 novembre) : comédie de Noël avec Dennis Quaid et Milo Ventimiglia (1 h 42).",
            "[L'impératrice remariée](/serie/l-imperatrice-remariee-279246) (Disney+, mercredi 4 novembre) : K-drama en dix épisodes, quatre pour commencer puis deux chaque mercredi ; l'impératrice Navier refuse de céder quand l'empereur veut la répudier pour sa maîtresse.",
            "[Les Rêveurs](/film/les-reveurs-1221724) (Canal+, vendredi 6 novembre) : le film d'Isabelle Carré, d'après son propre parcours, sur une comédienne qui anime des ateliers d'écriture avec des adolescents hospitalisés (1 h 46).",
            "[Stick](/serie/stick-248830), saison 2 (Apple TV+, mardi 3 novembre) : Owen Wilson revient en ancien espoir du golf, deux épisodes puis un chaque mardi ; et l'épisode 3 de [Nocturne](/serie/nocturne-292741) le vendredi 6 novembre.",
            "[L'Institut](/serie/l-institut-253372), saison 2 (HBO Max, dimanche 8 novembre) : la série adaptée de Stephen King revient, un épisode chaque dimanche.",
            "[MobLand](/serie/mobland-247718) et [Tulsa King](/serie/tulsa-king-153312) (Paramount+) et [Outlander: Blood of My Blood](/serie/outlander-blood-of-my-blood-207484) (HBO Max) : nouveaux épisodes le vendredi 6 novembre.",
          ],
        },
        {
          p: "Tout ce qui sort chaque jour est sur les pages [Netflix](/netflix), [Prime Video](/prime-video), [Canal+](/canal-plus) et [Disney+](/disney-plus), et ce qui arrive dans les quatre prochaines semaines dans le [calendrier des sorties](/prochaines-sorties).",
        },
      ],
    },
  ],
};
