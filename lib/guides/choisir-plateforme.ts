import type { Guide } from "../guides";

/**
 * Chiffres calculés le 2026-09-26 sur TMDB avec les filtres du site (catalogue
 * FR par abonnement, ≥ 5 votes) : séries ayant au moins un épisode diffusé et
 * films sortis entre le 1er janvier et le 26 septembre 2026 (total_results de
 * /discover, par plateforme ; with_origin_country=FR ; with_genres=16 et 99).
 * Pas de prix : ils changent trop souvent.
 */
export const GUIDE_CHOISIR_PLATEFORME: Guide = {
  slug: "choisir-plateforme",
  titre: "Quelle plateforme de streaming choisir en 2026",
  description:
    "Netflix, Prime Video, Disney+, Apple TV+, Canal+, HBO Max, Paramount+ : ce que chacune propose vraiment, chiffres de 2026 à l'appui, profil par profil.",
  chapo:
    "Il n'y a pas de meilleure plateforme dans l'absolu : il y a celle qui correspond à ce que vous regardez. En volume, Netflix domine largement, avec 318 séries ayant eu de nouveaux épisodes et 193 films sortis en 2026 disponibles au 26 septembre. Pour le cinéma récent, Canal+ reçoit les films six mois après la salle. Pour les séries américaines de prestige, HBO Max ; pour la famille et l'animation, Disney+.",
  publie: "2026-09-26",
  misAJour: "2026-09-26",
  sections: [
    {
      titre: "Les chiffres de 2026",
      blocs: [
        {
          p: "Le tableau compte, pour chaque plateforme, les séries dont au moins un épisode a été diffusé en 2026 et les films sortis en 2026, disponibles en France par abonnement au 26 septembre 2026. Les données viennent de TMDB, avec les mêmes filtres que le reste du site.",
        },
        {
          table: {
            entetes: ["Plateforme", "Séries", "Films", "Dont français (séries + films)", "Dont animation (séries + films)"],
            lignes: [
              ["[Netflix](/netflix)", "318", "193", "15", "62"],
              ["[Prime Video](/prime-video)", "120", "56", "8", "27"],
              ["[Disney+](/disney-plus)", "109", "25", "3", "42"],
              ["[HBO Max](/hbo-max)", "96", "9", "4", "12"],
              ["[Paramount+](/paramount-plus)", "44", "9", "0", "11"],
              ["[Apple TV+](/apple-tv-plus)", "33", "5", "2", "5"],
              ["[Canal+](/canal-plus)", "29", "17", "14", "4"],
            ],
          },
        },
        {
          p: "Attention à ce que ces chiffres mesurent : des titres sortis en 2026, pas des titres ajoutés au catalogue en 2026. Un film sorti au cinéma en 2025 et arrivé sur Canal+ cette année n'y figure pas. Ils avantagent donc les plateformes qui produisent beaucoup, et sous-estiment celles qui reçoivent surtout du cinéma déjà sorti en salle, Canal+ en tête. Une série est comptée dès qu'un épisode est sorti dans l'année, qu'elle soit nouvelle ou non.",
        },
      ],
    },
    {
      titre: "Vous voulez beaucoup de nouveautés, de tout : Netflix",
      blocs: [
        {
          p: "Netflix sort plus de séries et de films que toutes les autres plateformes réunies ou presque. C'est aussi là qu'on trouve le plus de productions françaises récentes (15 titres sortis en 2026), le plus de documentaires (86) et le plus d'animation (62). Les séries maison sortent en général d'un bloc, saison entière le même jour. Revers de la médaille : beaucoup de titres, dont une partie vite oubliée, et le cinéma récent n'y arrive que 17 mois après la salle.",
        },
      ],
    },
    {
      titre: "Vous voulez le cinéma récent : Canal+",
      blocs: [
        {
          p: "Canal+ est la seule plateforme qui peut diffuser un film six mois après sa sortie en salle, contre 9 mois pour Disney+ et 17 pour Netflix et Prime Video. C'est aussi, dans le tableau, la plateforme où les productions françaises pèsent le plus lourd (14 titres sur 46). Canal+ propose en outre des offres qui incluent d'autres plateformes ; ces offres, et leurs conditions d'engagement, sont à vérifier au moment de s'abonner. Le détail des délais est dans le guide [pourquoi un film quitte une plateforme](/guides/film-quitte-plateforme).",
        },
      ],
    },
    {
      titre: "Vous suivez les grandes séries américaines : HBO Max",
      blocs: [
        {
          p: "HBO Max rassemble les séries HBO (The Last of Us, House of the Dragon, The White Lotus), les films Warner Bros. et DC, et des documentaires Discovery (30 sortis en 2026). Les épisodes sortent chaque semaine, ce qui convient à ceux qui aiment suivre une série au rythme de sa diffusion. L'histoire de ces droits en France est racontée dans le guide [où regarder les séries HBO](/guides/series-hbo-france).",
        },
      ],
    },
    {
      titre: "Vous regardez en famille : Disney+",
      blocs: [
        {
          p: "Disney+ réunit Disney, Pixar, Marvel, Star Wars et National Geographic. L'animation y représente plus d'un tiers des séries sorties en 2026 (39 sur 109). Le catalogue Star ajoute des séries et films pour adultes. Les séries Marvel et Star Wars sortent en général un épisode par semaine.",
        },
      ],
    },
    {
      titre: "Vous êtes déjà client Amazon : Prime Video",
      blocs: [
        {
          p: "Prime Video est compris dans l'abonnement Amazon Prime, ce qui en fait souvent une plateforme qu'on a déjà sans l'avoir choisie. Le catalogue par abonnement est le deuxième en volume (120 séries et 56 films sortis en 2026). La même application vend et loue aussi des films hors abonnement, qui ne sont pas comptés ici. Elle sert aussi de porte d'entrée vers d'autres plateformes, proposées en chaînes payantes, comme HBO Max.",
        },
      ],
    },
    {
      titre: "Vous préférez peu de titres, choisis : Apple TV+",
      blocs: [
        {
          p: "Apple TV+ est la plus petite des sept plateformes en volume (33 séries et 5 films sortis en 2026), mais presque tout y est produit par Apple : Severance, Slow Horses, Ted Lasso, Pour toute l'humanité. C'est un choix pour qui regarde deux ou trois séries à la fois et veut éviter le tri.",
        },
      ],
    },
    {
      titre: "Vous aimez les westerns modernes ou Star Trek : Paramount+",
      blocs: [
        {
          p: "Paramount+ est connu pour les séries de Taylor Sheridan (1883, 1923, Tulsa King, Landman) et l'univers Star Trek. Son catalogue est plus petit (44 séries et 9 films sortis en 2026) et ne compte aucune production française cette année. En France, il est aussi proposé dans certaines offres Canal+.",
        },
      ],
    },
    {
      titre: "Changer de plateforme au fil des mois",
      blocs: [
        {
          p: "Beaucoup d'abonnés gardent une plateforme principale et en ajoutent une seconde le temps d'une série. Pour savoir quand ça vaut le coup, le [calendrier des prochaines sorties](/prochaines-sorties) liste les épisodes et films annoncés sur les quatre semaines à venir, plateforme par plateforme, et les [tops de l'année](/top/series-2026) montrent où se trouvent les titres les mieux notés. Avant de résilier, vérifiez les conditions : la plupart des abonnements se résilient d'un mois sur l'autre, mais certaines offres groupées comportent un engagement.",
        },
      ],
    },
  ],
  faq: [
    {
      q: "Quelle est la plateforme de streaming avec le plus de nouveautés en France ?",
      r: "Netflix, de loin : au 26 septembre 2026, 318 séries y ont eu de nouveaux épisodes et 193 films sortis en 2026 y sont disponibles, contre 120 séries et 56 films pour Prime Video, deuxième.",
    },
    {
      q: "Quelle plateforme a les films de cinéma le plus tôt ?",
      r: "Canal+, qui peut diffuser un film six mois après sa sortie en salle. Disney+ suit à neuf mois pour ses propres films, puis Netflix, Prime Video et les autres à dix-sept mois.",
    },
    {
      q: "Pourquoi StreamActu.fr ne donne-t-il pas les prix ?",
      r: "Parce qu'ils changent souvent et varient selon les offres groupées. Le site compare ce que les plateformes proposent, à partir de ses données ; les tarifs à jour sont sur le site de chaque plateforme.",
    },
  ],
  sources: [
    { titre: "The Movie Database (TMDB), données de disponibilité en France (JustWatch), consultées le 26 septembre 2026", url: "https://www.themoviedb.org" },
    { titre: "Selectra, « Pourquoi les films mettent 17 mois à arriver sur Netflix (et 9 sur Disney+) », mis à jour le 21 août 2026", url: "https://selectra.info/telecom/actualites/marche/netflix-france-17-mois-chronologie-medias-films-plus-tard" },
  ],
};
