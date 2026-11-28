import type { Guide, OeuvreGuide } from "../guides";

/**
 * Données : base « Lieux de tournage à Paris » de la Ville de Paris (ODbL),
 * importée dans data/publiques/tournages-paris.json.br (mise à jour Ville du
 * 2026-10-05, tournages 2016 à 2025, extérieurs seulement). Séries retrouvées
 * sur TMDB et confirmées par la règle de lib/tournages.ts (titre, années de
 * diffusion, créateur ou société de production en commun), relevé du
 * 2026-11-28. Ne figurent que des séries disponibles ce jour-là sur une des
 * sept plateformes suivies en France ; les plateformes affichées dans les
 * listes sont relues chaque jour sur les fiches, le texte n'en fige aucune.
 *
 * Chiffres de lieux : lignes de la base pour le titre (une ligne = un lieu et
 * une période de tournage déclarés), toutes saisons confondues. Lupin : 144
 * lignes sous « Lupin » ; 81 autres sous « Arsène Lupin » (2019-2020) ne sont
 * pas comptées, faute de pouvoir les rattacher avec certitude.
 *
 * Écartés : séries sans plateforme suivie le 2026-11-28 (L'Art du crime,
 * Chefs, Je te promets, Une famille formidable…), Irrésistible et Tout va
 * bien (résumé non vérifié), Ça, c'est Paris ! (idem).
 *
 * Révision : chaque année au printemps, quand la Ville publie l'année écoulée
 * (relancer scripts/import-tournages-paris.mjs, puis refaire les comptes).
 */

const s = (id: number, titre: string, repere: string): OeuvreGuide => ({ type: "serie", id, titre, repere });

export const GUIDE_SERIES_TOURNEES_PARIS: Guide = {
  slug: "series-tournees-paris",
  titre: "Séries tournées à Paris : quartiers et streaming",
  description:
    "Emily in Paris, Lupin, Dix pour cent, Le Bureau des légendes : les séries tournées à Paris, leurs rues et arrondissements, et où les voir en streaming.",
  chapo:
    "D'après les autorisations de tournage de la Ville de Paris (2016 à 2025), Emily in Paris est la série qui a déclaré le plus de lieux de tournage dans la capitale : 255, surtout dans le 5e arrondissement. Suivent Engrenages (156) et Lupin (144). Voici une sélection de séries tournées à Paris et visibles en streaming en France, avec leurs quartiers et leurs rues.",
  publie: "2026-11-28",
  misAJour: "2026-11-28",
  sections: [
    {
      titre: "Ce que disent les autorisations de tournage",
      blocs: [
        {
          p: "Chaque tournage en extérieur à Paris passe par une autorisation de la Ville, qui publie la liste des lieux en données ouvertes : titre, type de tournage, adresse, arrondissement et dates. De 2016 à 2025, les séries (télévision et web) y totalisent 6 744 lieux déclarés, sur 15 852 tous tournages confondus. L'année en cours n'est jamais publiée, et les scènes tournées en studio ou en intérieur n'y figurent pas.",
        },
        {
          p: "Les séries tournent partout, mais pas également. Le 16e arrondissement arrive en tête, devant le 1er, le 18e et le 8e :",
        },
        {
          table: {
            entetes: ["Arrondissement", "Lieux de tournage de séries (2016-2025)"],
            lignes: [
              ["16e", "595"],
              ["1er", "470"],
              ["18e", "468"],
              ["8e", "454"],
              ["10e", "384"],
            ],
          },
        },
        {
          p: "Les fiches des séries de ce guide reprennent ces données : arrondissements, rues les plus filmées et années de tournage, sous la ligne « Tourné à Paris ». Les numéros de rue ne sont jamais donnés, une adresse de tournage pouvant être un immeuble d'habitation.",
        },
      ],
    },
    {
      titre: "Paris en vitrine",
      blocs: [
        {
          p: "Des séries où la ville est presque un personnage, souvent tournées pour un public international.",
        },
        {
          ordre: "sortie",
          sommaire: "Paris en vitrine",
          oeuvres: [
            s(82596, "Emily in Paris", "Comédie romantique : une Américaine envoyée à Paris pour son travail. 255 lieux de 2019 à 2024, surtout dans le 5e ; lieux les plus filmés : place de l'Estrapade, rue des Fossés-Saint-Jacques, puis place de Valois (1er) et le bassin de l'Arsenal (12e)."),
            s(86784, "The Eddy", "Un club de jazz parisien et son propriétaire, dont Damien Chazelle a réalisé les deux premiers épisodes. 59 lieux en 2019, surtout dans le 12e et le 20e ; lieux les plus filmés : rue Claude-Decaen, boulevard Jourdan, quai d'Austerlitz."),
            s(129057, "Notre-Dame, la part du feu", "Fiction autour de l'incendie de la cathédrale en 2019. 59 lieux en 2021, autour de l'île de la Cité (4e) et du Quartier latin (5e) : parvis Notre-Dame, boulevard Saint-Germain, port de Montebello."),
            s(157368, "The New Look", "Christian Dior et Coco Chanel sous l'Occupation. 54 lieux en 2022, surtout dans le 7e et le 18e ; lieux les plus filmés : rue de Grenelle, rue Dupont-des-Loges."),
          ],
        },
      ],
    },
    {
      titre: "Polars, espionnage et cambriolages",
      blocs: [
        {
          p: "Paris côté police, services secrets et voleurs, du palais de justice aux beaux quartiers.",
        },
        {
          ordre: "sortie",
          sommaire: "Polars et espionnage",
          oeuvres: [
            s(11726, "Engrenages", "Série policière et judiciaire, huit saisons. 156 lieux de 2016 à 2019, surtout dans le nord et l'est de Paris (20e, 19e, 9e, 17e) ; lieux les plus filmés : rue de Douai, boulevard de Clichy."),
            s(62476, "Le Bureau des légendes", "Espionnage : les agents clandestins de la DGSE. 42 lieux de 2016 à 2019, surtout dans le 8e, le 16e et le 17e ; lieux les plus filmés : boulevard Mortier, avenue Carnot."),
            s(96677, "Lupin", "Omar Sy en gentleman cambrioleur inspiré d'Arsène Lupin. 144 lieux de 2021 à 2025, dans dix-neuf arrondissements : avenue Gustave-Eiffel, place de la Concorde, place Vendôme."),
            s(222176, "Cat's Eyes", "Adaptation du manga : trois sœurs cambrioleuses. 40 lieux de 2023 à 2025, surtout dans le 7e et le 16e ; lieux les plus filmés : avenue du Maine, avenue Foch."),
            s(212588, "Furies", "Action : une jeune femme plongée dans la pègre parisienne. 73 lieux de 2022 à 2025, surtout dans le 15e et le 13e ; lieux les plus filmés : quai de Grenelle, avenue de Saxe."),
            s(221817, "La Fièvre", "Thriller politique d'Éric Benzekri : l'emballement de l'opinion autour d'un footballeur. 24 lieux en 2023, surtout dans le 20e ; lieux les plus filmés : rue de la Mare, rue de l'Ermitage."),
          ],
        },
      ],
    },
    {
      titre: "Comédies et chroniques parisiennes",
      blocs: [
        {
          p: "Le Paris des bureaux, des cafés et des quartiers populaires, du 6e au 20e.",
        },
        {
          ordre: "sortie",
          sommaire: "Comédies et chroniques",
          oeuvres: [
            s(64165, "Dix pour cent", "Comédie dans une agence d'acteurs, avec des vedettes dans leur propre rôle. 112 lieux de 2018 à 2020, surtout dans le 6e et le 1er ; lieux les plus filmés : rue Saint-Honoré, place du Général-Catroux."),
            s(83412, "Plan cœur", "Comédie romantique : ses amies engagent un escort pour lui remonter le moral. 35 lieux de 2019 à 2021, surtout dans le 14e et le 18e."),
            s(89785, "Family Business", "Comédie : une famille veut transformer sa boucherie en coffee-shop. 66 lieux de 2018 à 2021, surtout dans le 12e et le 17e ; lieux les plus filmés : avenue de Saint-Mandé, avenue des Ternes."),
            s(86570, "Vernon Subutex", "D'après les romans de Virginie Despentes, avec Romain Duris en ancien disquaire. 60 lieux en 2018, surtout dans le 19e et le 11e ; lieux les plus filmés : avenue Secrétan, avenue Darcel."),
            s(90816, "Validé", "Le parcours d'un jeune rappeur, par Franck Gastambide. 72 lieux de 2019 à 2024, surtout dans le 18e, le 19e et le 20e ; lieux les plus filmés : rue Greneta, rue du Poteau."),
            s(121171, "Le Monde de demain", "Les débuts de NTM et du hip-hop français. 28 lieux en 2021, surtout dans le 12e et le 9e."),
            s(258002, "Des vivants", "Le 13 novembre 2015, vu par des otages du Bataclan. 30 lieux de 2024 à 2025, surtout dans le 11e ; lieux les plus filmés : boulevard Voltaire, passage Saint-Pierre-Amelot."),
          ],
        },
      ],
    },
    {
      titre: "Les limites de ces chiffres",
      blocs: [
        {
          ul: [
            "Un lieu déclaré n'est pas une scène : une même rue peut servir une journée ou une semaine, et une autorisation peut ne pas être utilisée.",
            "Les tournages sont parfois déclarés sous un titre de travail. Mission: Impossible – Fallout apparaît ainsi sous « Gemini » : ces lieux ne peuvent pas être rattachés à la bonne fiche, et le site ne les affiche pas.",
            "Seuls les extérieurs à Paris intra-muros sont recensés. Les studios, la petite couronne et l'année en cours manquent.",
          ],
        },
        {
          p: "La méthode de rapprochement entre la base de la Ville et les fiches est détaillée dans [À propos](/a-propos#methode). Hors de Paris, les [lieux de tournage en France](/lieux-de-tournage) rassemblent, région par région, les films et séries disponibles en streaming. Pour la suite, les [prochaines sorties](/prochaines-sorties) donnent les séries annoncées sur toutes les plateformes.",
        },
      ],
    },
  ],
  faq: [
    {
      q: "Quelle série a été le plus tournée à Paris ?",
      r: "D'après les autorisations de tournage publiées par la Ville de Paris pour 2016 à 2025, Emily in Paris, avec 255 lieux déclarés, devant Engrenages (156) et Lupin (144).",
    },
    {
      q: "Où a été tournée Emily in Paris ?",
      r: "Surtout dans le 5e arrondissement, place de l'Estrapade et rue des Fossés-Saint-Jacques, mais aussi place de Valois (1er), au bassin de l'Arsenal et boulevard de la Bastille (12e), selon les lieux déclarés à la Ville de Paris de 2019 à 2024.",
    },
    {
      q: "Quels arrondissements de Paris sont les plus filmés par les séries ?",
      r: "Le 16e (595 lieux de tournage de séries de 2016 à 2025), devant le 1er (470), le 18e (468), le 8e (454) et le 10e (384), d'après les données de la Ville de Paris.",
    },
    {
      q: "D'où viennent ces données ?",
      r: "De la base « Lieux de tournage à Paris » publiée par la Ville de Paris sous licence ODbL : les tournages en extérieur autorisés depuis 2016, hors année en cours.",
    },
  ],
  sources: [
    { titre: "Ville de Paris, « Lieux de tournage à Paris » (licence ODbL)", url: "https://opendata.paris.fr/explore/dataset/lieux-de-tournage-a-paris/" },
  ],
};
