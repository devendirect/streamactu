import type { Article } from "../actu";

/**
 * Données TMDB relevées le 2026-09-27 (calendrier du site : séries par réseau
 * d'origine, films par sortie numérique française ; dates des épisodes par
 * /tv/{id}/season/1). À RAFRAÎCHIR LE JEUDI 1er OCTOBRE : dates, disponibilités
 * en France (surtout War sur HBO Max et Paul, la série), notes. Puis relecture
 * de l'éditeur, `brouillon: false`, déploiement le vendredi matin.
 *
 * Fait extérieur à TMDB : À l'est d'Éden adapte le roman de John Steinbeck.
 */
export const ARTICLE_2026_10_02_WEEKEND: Article = {
  slug: "que-regarder-ce-week-end-2-octobre-2026",
  titre: "Que regarder ce week-end : 2 au 4 octobre 2026",
  description:
    "À l'est d'Éden sur Netflix, Kill Jackie sur Prime Video, Nuremberg sur Canal+ : que regarder le week-end du 2 octobre, et les autres sorties de la semaine.",
  chapo:
    "Trois nouveautés se détachent ce week-end sur les plateformes en France : À l'est d'Éden, minisérie Netflix avec Florence Pugh, Kill Jackie sur Prime Video avec Catherine Zeta-Jones, et Nuremberg, le film de procès avec Rami Malek et Russell Crowe, arrivé sur Canal+. Les deux séries sont disponibles en entier, le film dure deux heures et demie.",
  publie: "2026-10-02",
  misAJour: "2026-10-02",
  brouillon: true,
  sections: [
    {
      titre: "À l'est d'Éden, sur Netflix",
      blocs: [
        {
          p: "Minisérie en sept épisodes, tous mis en ligne le jeudi 1er octobre, adaptée du roman de John Steinbeck. Créée par Zoe Kazan, elle réunit Florence Pugh, Christopher Abbott et Mike Faist. Le récit suit sur plusieurs générations deux familles de Californie, les Trask et les Hamilton, et rejoue l'histoire de Caïn et Abel à travers deux frères. Une saison complète et fermée : c'est le choix le plus simple pour un week-end entier. [Voir la fiche](/serie/a-l-est-d-eden-258165).",
        },
      ],
    },
    {
      titre: "Kill Jackie, sur Prime Video",
      blocs: [
        {
          p: "Huit épisodes, tous disponibles le vendredi 2 octobre. Catherine Zeta-Jones y joue Jackie Price, ancienne trafiquante de cocaïne qui vit depuis vingt ans dans le luxe, loin de son passé, jusqu'à découvrir qu'un groupe de tueurs à gages s'intéresse à elle. Drame criminel britannique et australien créé par Conor Keane, avec Daniel Ings et Sidse Babett Knudsen. [Voir la fiche](/serie/kill-jackie-284558).",
        },
      ],
    },
    {
      titre: "Nuremberg, sur Canal+",
      blocs: [
        {
          p: "Le film de James Vanderbilt est arrivé sur Canal+ le mardi 29 septembre, un peu moins d'un an après sa sortie en salle, comme le permet la chronologie des médias. En 1945, un juge de la Cour suprême américaine obtient que les dignitaires nazis, dont Hermann Göring, soient jugés plutôt qu'exécutés. Rami Malek, Russell Crowe et Michael Shannon se partagent l'affiche. C'est le film le mieux noté de la semaine : 7,6/10 sur TMDB, avec plus de 1 400 votes (les séries, trop récentes, n'ont pas encore de note). Il dure 2 h 28. [Voir la fiche](/film/nuremberg-1214931).",
        },
      ],
    },
    {
      titre: "Pour rire : Paul, la série, sur Prime Video",
      blocs: [
        {
          p: "Six épisodes de comédie française, créée par Paul Mirabel et jouée par lui-même, avec Abraham Wapler et Enya Baroux. Le point de départ : à presque 30 ans, l'humoriste a vendu à Amazon son spectacle et un documentaire sur sa vie, sans avoir écrit le premier ni tourné le second. Le premier épisode arrive le vendredi 2 octobre. [Voir la fiche](/serie/paul-la-serie-300925).",
        },
      ],
    },
    {
      titre: "Et aussi cette semaine",
      blocs: [
        {
          ul: [
            "[War](/serie/war-298852) (HBO Max, à partir du 1er octobre) : série d'avocats londoniens avec Dominic West et Sienna Miller, un épisode par semaine.",
            "[Coutures](/film/coutures-1390382) (Canal+, 2 octobre) : le film d'Alice Winocour avec Angelina Jolie, dans les coulisses de la Fashion Week de Paris.",
            "[Retour à Silent Hill](/film/retour-a-silent-hill-680493) (Canal+, 3 octobre) : l'adaptation du jeu vidéo d'horreur par Christophe Gans.",
            "[The Last First : le K2 en hiver](/film/the-last-first-le-k2-en-hiver-1596303) (Apple TV+, 2 octobre) : documentaire sur la course à la première ascension hivernale du K2.",
            "[Chers parents](/film/chers-parents-1368830) (Canal+, 30 septembre) : comédie avec André Dussollier et Miou-Miou.",
            "[LEGO ONE PIECE](/serie/lego-one-piece-318918) (Netflix, 29 septembre) : deux épisodes en version LEGO, pour toute la famille.",
          ],
        },
        {
          p: "Tout ce qui sort chaque jour est sur les pages [Netflix](/netflix), [Prime Video](/prime-video), [Canal+](/canal-plus) et [HBO Max](/hbo-max), et ce qui arrive dans les quatre prochaines semaines dans le [calendrier des sorties](/prochaines-sorties).",
        },
      ],
    },
  ],
};
