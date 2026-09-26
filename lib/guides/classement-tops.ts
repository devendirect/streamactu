import type { Guide } from "../guides";

/**
 * Méthode vérifiée dans le code : lib/utils.ts (scoreBayesien, m = 100, C = 7),
 * lib/tmdb.ts (getTopMois, getTopAnnee). Exemples relevés sur le site le
 * 2026-09-26 (llms-full.txt) ; les scores sont recalculés à partir des notes
 * arrondies affichées.
 */
export const GUIDE_CLASSEMENT_TOPS: Guide = {
  slug: "classement-tops",
  titre: "Comment sont classés les tops séries et films",
  description:
    "Les tops de StreamActu.fr classent séries et films par note TMDB pondérée par le nombre de votes : la formule, des exemples réels et les limites.",
  chapo:
    "Les tops de StreamActu.fr ne classent pas les titres par leur note brute, mais par une note pondérée par le nombre de votes. Chaque note est mélangée à une note de référence de 7/10, comme si le titre avait reçu 100 votes de plus à 7. Un titre très bien noté par une poignée de spectateurs ne passe donc pas devant un titre presque aussi bien noté par des milliers de personnes.",
  publie: "2026-09-26",
  misAJour: "2026-09-26",
  sections: [
    {
      titre: "D'où viennent les notes",
      blocs: [
        {
          p: "Les notes affichées sur le site sont celles des spectateurs de The Movie Database (TMDB), une base collaborative où chacun peut noter un film ou une série de 0 à 10. StreamActu.fr ne note rien lui-même : il n'y a pas de note maison, ni d'avis de rédaction. Le site reprend la moyenne des votes TMDB et le nombre de votes, deux chiffres visibles sur chaque fiche.",
        },
        {
          p: "Ces deux chiffres suffisent pour les listes de nouveautés, triées par note. Pour un classement, ils ne suffisent pas : une moyenne n'a pas le même poids selon qu'elle repose sur 12 votes ou sur 12 000.",
        },
      ],
    },
    {
      titre: "Le problème de la note brute",
      blocs: [
        {
          p: "Un titre sorti la veille peut afficher 10/10 avec six votes, souvent ceux de son équipe ou de ses premiers fans. Trié par note brute, il passerait devant n'importe quel classique. À l'inverse, une série regardée par des centaines de milliers de personnes finit presque toujours entre 7 et 9 : plus il y a de votants, plus les avis se diversifient.",
        },
        {
          p: "Le classement doit donc tenir compte de deux choses à la fois : la note, et la confiance qu'on peut lui accorder. C'est le rôle de la note pondérée, une méthode connue sous le nom de moyenne bayésienne, utilisée par de nombreux sites de classement.",
        },
      ],
    },
    {
      titre: "La formule",
      blocs: [
        {
          p: "Note pondérée = (note × votes + 7 × 100) ÷ (votes + 100). Concrètement, on ajoute à chaque titre 100 votes fictifs à 7/10, une note ordinaire pour un titre sur TMDB. Avec peu de votes, les votes fictifs dominent et la note pondérée reste proche de 7. Avec beaucoup de votes, ils ne pèsent presque plus rien et la note pondérée rejoint la note réelle. À exactement 100 votes, la note réelle et la note de référence comptent autant l'une que l'autre.",
        },
        {
          table: {
            entetes: ["Titre", "Note TMDB", "Votes", "Note pondérée"],
            lignes: [
              ["Titre fictif sorti la veille", "10", "6", "7,17"],
              ["Rick et Morty", "8,7", "11 294", "8,69"],
              ["X-Men '97", "8,7", "851", "8,52"],
              ["A Knight of the Seven Kingdoms", "8,4", "1 110", "8,28"],
              ["Star Wars : Maul - Seigneur de l'ombre", "8,6", "222", "8,10"],
            ],
          },
        },
        {
          p: "Les titres réels ci-dessus viennent des tops du site au 26 septembre 2026. Rick et Morty et X-Men '97 ont la même note, 8,7, mais la première repose sur treize fois plus de votes : elle passe devant. Star Wars : Maul a une meilleure note brute que A Knight of the Seven Kingdoms (8,6 contre 8,4), mais cinq fois moins de votes : il se classe derrière. Les notes pondérées sont recalculées ici à partir des notes arrondies affichées sur le site, d'où de petits écarts possibles avec le classement réel.",
        },
      ],
    },
    {
      titre: "Le top du mois",
      blocs: [
        {
          p: "Le top du mois part des nouveautés du mois sur les sept plateformes suivies : les films sortis ce mois-là, et les séries dont au moins un épisode a été diffusé ce mois-là. Pour chaque plateforme, le site retient les vingt titres les plus populaires ayant au moins cinq votes, réunit les listes des sept plateformes en supprimant les doublons, puis garde les vingt meilleures notes pondérées.",
        },
        {
          p: "Conséquence : une série lancée il y a des années peut figurer dans le top d'un mois si de nouveaux épisodes sont sortis. C'est le cas de One Piece et de Rick et Morty dans le [top séries de juillet 2026](/top/series-juillet-2026). Un top de moins de cinq titres n'est pas publié.",
        },
      ],
    },
    {
      titre: "Le top de l'année",
      blocs: [
        {
          p: "Le top de l'année est plus sélectif. Il ne retient que les séries lancées dans l'année (premier épisode diffusé cette année-là) et les films sortis dans l'année, disponibles en France par abonnement, avec au moins 200 votes sur TMDB. Parmi eux, le site prend les vingt meilleures notes brutes, puis les réordonne par note pondérée.",
        },
        {
          p: "Ce seuil de 200 votes écarte les titres trop confidentiels pour qu'on se fie à leur note. Il a un revers : un titre très regardé mais noté un peu moins haut que les vingt premiers n'entre pas dans la sélection de départ, même si sa note pondérée serait meilleure. Le classement de l'année en cours est recalculé chaque jour.",
        },
      ],
    },
    {
      titre: "Ce que les tops ne disent pas",
      blocs: [
        {
          ul: [
            "Ce sont des notes de spectateurs, pas de critiques. Les votants de TMDB ne représentent ni le public français dans son ensemble, ni la presse.",
            "Certains publics votent beaucoup plus que d'autres, ce qui avantage les titres dont les fans sont très actifs en ligne.",
            "La note d'un titre récent bouge pendant ses premières semaines, le temps que les votes s'accumulent. Un titre peut entrer dans un top puis en sortir.",
            "Le périmètre est le catalogue français par abonnement : un titre disponible seulement à la location ou à l'achat n'y figure pas.",
          ],
        },
      ],
    },
    {
      titre: "Où trouver les classements",
      blocs: [
        {
          p: "Les classements de l'année sont sur les pages [top séries 2026](/top/series-2026) et [top films 2026](/top/films-2026), avec un lien vers le classement du type opposé. La méthode est résumée sur la page [à propos](/a-propos#methode), avec les autres règles du site.",
        },
      ],
    },
  ],
  faq: [
    {
      q: "Pourquoi un titre noté 9/10 n'est-il pas premier du top ?",
      r: "Parce que le classement tient compte du nombre de votes. Un 9/10 obtenu avec 12 votes a une note pondérée d'environ 7,2 ; un 8,5 obtenu avec 20 000 votes garde une note pondérée d'environ 8,5 et passe devant.",
    },
    {
      q: "StreamActu.fr donne-t-il ses propres notes ?",
      r: "Non. Le site n'attribue aucune note : il reprend la moyenne des votes des spectateurs de TMDB et le nombre de votes, puis applique la pondération pour les classements.",
    },
    {
      q: "À quelle fréquence les tops sont-ils mis à jour ?",
      r: "Une fois par jour. Les notes et le nombre de votes changent chaque jour sur TMDB, surtout pour les titres récents.",
    },
  ],
};
