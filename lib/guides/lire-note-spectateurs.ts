import type { Guide } from "../guides";

/**
 * Exemples relevés sur les fiches du site le 2026-10-29 (note et nombre de
 * votes TMDB affichés). Les notes changent avec les votes : mettre à jour les
 * chiffres en même temps que `misAJour`. La pondération des tops est décrite
 * dans le guide classement-tops, qu'on ne répète pas ici.
 */
export const GUIDE_LIRE_NOTE: Guide = {
  slug: "lire-note-spectateurs",
  titre: "Comment lire la note des spectateurs d'un film",
  description:
    "Nombre de votes, date, public qui note : ce que dit et ne dit pas la note des spectateurs d'un film ou d'une série, avec des exemples tirés des fiches.",
  chapo:
    "La note des spectateurs n'a de sens qu'avec le nombre de votes qui l'accompagne : 9,1 sur 10 votes ne dit presque rien, 8,4 sur 40 000 votes est un signal solide. Elle bouge aussi avec le temps et mélange des publics qui n'attendent pas la même chose. Elle sert à écarter les titres mal reçus, moins à choisir entre deux titres bien notés.",
  publie: "2026-10-29",
  misAJour: "2026-10-29",
  sections: [
    {
      titre: "La note et le nombre de votes vont ensemble",
      blocs: [
        {
          p: "Chaque fiche de StreamActu.fr affiche la note moyenne des spectateurs de TMDB et, juste à côté, le nombre de votes. Le second chiffre décide de la confiance qu'on peut accorder au premier. Exemples relevés sur le site le 29 octobre 2026 :",
        },
        {
          table: {
            entetes: ["Titre", "Note", "Votes", "Ce qu'on peut en dire"],
            lignes: [
              ["[GET JIRO](/serie/get-jiro-231801)", "9,1", "10", "Une indication : une poignée de votants suffit à faire bouger la moyenne d'un point"],
              ["[The Mongoose](/film/the-mongoose-1294189)", "7,0", "6", "Pas encore une note : six avis"],
              ["[Dexter: Resurrection](/serie/dexter-resurrection-259909)", "8,5", "696", "Une note qui commence à être fiable"],
              ["[Inception](/film/inception-27205)", "8,4", "40 582", "Une note stable : quelques votes de plus ne la feront plus bouger"],
            ],
          },
        },
        {
          p: "En pratique, en dessous d'une centaine de votes, la note est une indication. Au-delà de quelques milliers, elle donne une bonne image de l'accueil général. C'est pour cette raison que les tops du site ne trient pas par note brute mais par une note pondérée par le nombre de votes, détaillée dans le guide [comment sont classés les tops](/guides/classement-tops).",
        },
      ],
    },
    {
      titre: "Une note bouge avec le temps",
      blocs: [
        {
          p: "Les premiers votants d'un titre sont rarement représentatifs : ce sont souvent ceux qui l'attendaient, ou ceux qui veulent dire leur déception. Les notes des premiers jours sont donc plus extrêmes. Quand des spectateurs moins impliqués arrivent, la moyenne se resserre, le plus souvent vers le bas pour les titres très attendus.",
        },
        {
          p: "Les titres anciens suivent la logique inverse. Ceux qui notent un film de 2010 aujourd'hui l'ont choisi, souvent parce qu'il a une réputation : les classiques profitent d'un public déjà convaincu. Comparer la note d'une nouveauté de la semaine à celle d'un film de quinze ans n'est donc pas comparer la même chose.",
        },
      ],
    },
    {
      titre: "Une moyenne mélange plusieurs publics",
      blocs: [
        {
          p: "Un film d'horreur apprécié des amateurs du genre peut afficher une note moyenne parce que des spectateurs qui n'aiment pas avoir peur l'ont aussi noté. Un dessin animé pour enfants est noté par des adultes, une adaptation de roman par des lecteurs qui comparent. Pour certains genres, une note de 6,5 peut cacher un titre très bien reçu par son public.",
        },
        {
          p: "Les notes de TMDB viennent en outre d'un public international et plutôt anglophone. Une série française ou un programme de télé-réalité peut y être peu noté, ou noté par un public qui ne le regarde pas pour les mêmes raisons qu'en France.",
        },
      ],
    },
    {
      titre: "Ce que la note ne dit pas",
      blocs: [
        {
          p: "Même fiable, une note ne dit pas si un titre correspond à une soirée précise. Elle ne dit pas s'il est lent ou rythmé, s'il demande toute l'attention ou se regarde fatigué, ni s'il ressemble à ce qu'on aime d'habitude. Les autres informations de la fiche y répondent mieux :",
        },
        {
          ol: [
            "Le nombre de votes, pour savoir si la note est solide.",
            "La note, sans s'attarder sur les dixièmes : 7,2 et 7,5 ne font pas de différence réelle.",
            "Le genre et la durée, pour savoir si le titre correspond à l'envie du moment.",
            "La bande-annonce, pour le ton.",
            "Les plateformes où le titre est disponible en France.",
          ],
        },
      ],
    },
  ],
  faq: [
    {
      q: "À partir de combien de votes une note est-elle fiable ?",
      r: "Il n'y a pas de seuil exact. En dessous d'une centaine de votes, la note reste une indication ; au-delà de quelques milliers, elle bouge peu et reflète bien l'accueil général.",
    },
    {
      q: "D'où viennent les notes affichées sur StreamActu.fr ?",
      r: "Des spectateurs de The Movie Database (TMDB), une base collaborative. StreamActu.fr ne donne pas de note maison ; il affiche la moyenne des votes TMDB et leur nombre.",
    },
    {
      q: "Pourquoi la note d'un film baisse-t-elle après sa sortie ?",
      r: "Les premiers votants sont souvent les plus enthousiastes. Quand des spectateurs moins impliqués votent à leur tour, la moyenne se resserre, généralement vers le bas.",
    },
  ],
};
