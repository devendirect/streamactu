import type { Guide } from "../guides";

/**
 * Fonctionnement de Retrouver vérifié sur la page /retrouver le 2026-10-29 :
 * Claude Haiku, trois à cinq titres vérifiés dans TMDB, interrupteur
 * « Disponibles en streaming en France seulement », cinq recherches par jour
 * et par visiteur, texte envoyé à Anthropic et non conservé par le site.
 * Exemple de recherche fait le même jour.
 */
export const GUIDE_RETROUVER_TITRE: Guide = {
  slug: "retrouver-titre-oublie",
  titre: "Retrouver un film dont on a oublié le titre",
  description:
    "Une scène, une ambiance, un acteur : la méthode pour retrouver un film ou une série dont on a oublié le nom, et où le regarder ensuite en France.",
  chapo:
    "Pour retrouver un film dont on a oublié le titre, il vaut mieux décrire une scène précise que l'histoire entière, séparer ce dont on est sûr de ce qui est flou, et choisir l'outil selon ce qu'on se rappelle : une réplique, un acteur ou une ambiance. La fonction Retrouver de StreamActu.fr part d'une description libre et indique où regarder les titres proposés en France.",
  publie: "2026-10-29",
  misAJour: "2026-10-29",
  sections: [
    {
      titre: "Trier ses souvenirs",
      blocs: [
        {
          p: "La mémoire mélange des souvenirs fiables et des souvenirs reconstruits. Avant de chercher, il vaut mieux les séparer. On retient en général bien l'époque à laquelle on a vu le titre (ce qui donne une année de sortie maximale), le format (film, série, dessin animé), une scène marquante et la langue.",
        },
        {
          p: "On retient mal les noms des personnages, la fin, les acteurs secondaires et l'ordre des scènes. Un acteur dont on est « presque sûr » est souvent une fausse piste : mieux vaut le garder pour vérifier à la fin que pour chercher.",
        },
      ],
    },
    {
      titre: "Décrire une scène plutôt que l'histoire",
      blocs: [
        {
          p: "Un résumé ressemble à des centaines d'autres. Une scène est unique. « Un film sur une famille qui déménage » ne mène nulle part ; « une famille qui emménage dans une maison où le papier peint se décolle tout seul la nuit » a une chance d'aboutir.",
        },
        {
          p: "Les détails visuels sont les plus utiles : un lieu, un objet, une couleur, un animal, une saison. Les impressions (« c'était triste ») aident peu. Signaler ses doutes aide aussi : « dans les années 2000, je crois » vaut mieux qu'une date inventée.",
        },
      ],
    },
    {
      titre: "Choisir l'outil selon ce qu'on se rappelle",
      blocs: [
        {
          table: {
            entetes: ["On se rappelle", "Le plus efficace"],
            lignes: [
              ["Une réplique", "La chercher entre guillemets dans un moteur de recherche, en français puis traduite si le film est étranger"],
              ["Un acteur, avec certitude", "Parcourir sa filmographie sur une période donnée"],
              ["Une scène, une ambiance", "Un outil qui comprend une description en langage courant, comme [Retrouver](/retrouver)"],
              ["Une image floue, presque rien", "Les communautés en ligne consacrées à ce problème, en donnant tout ce qu'on sait"],
            ],
          },
        },
      ],
    },
    {
      titre: "Comment fonctionne Retrouver",
      blocs: [
        {
          p: "Sur [Retrouver](/retrouver), on décrit le titre comme on le raconterait à quelqu'un. Un modèle d'intelligence artificielle, Claude Haiku d'Anthropic, en tire les indices utiles (genre, époque, lieu, intrigue) et propose trois à cinq titres, du plus probable au moins probable, avec une phrase qui explique le rapprochement. Chaque titre est ensuite vérifié dans la base TMDB et affiché avec son année, sa note et les plateformes qui le proposent en France.",
        },
        {
          p: "Exemple fait le 29 octobre 2026 : « un film où un homme se réveille chaque matin le même jour, dans une petite ville enneigée, et finit par en profiter pour changer » renvoie en premier [Un jour sans fin](/film/un-jour-sans-fin-137), suivi d'autres histoires de boucle temporelle. Un interrupteur limite les réponses aux titres disponibles en streaming en France.",
        },
        {
          p: "Les propositions viennent d'une IA : elle peut se tromper ou proposer un titre proche du bon. Le service est limité à cinq recherches par jour et par visiteur, et le texte saisi est envoyé à Anthropic sans être conservé par StreamActu.fr.",
        },
      ],
    },
    {
      titre: "Vérifier avant de conclure",
      blocs: [
        {
          ul: [
            "Regarder la bande-annonce plutôt que l'affiche : la scène recherchée y figure souvent.",
            "Vérifier l'année : un titre sorti après la date où on l'a vu n'est pas le bon.",
            "Chercher la scène dans le synopsis de la fiche.",
          ],
        },
        {
          p: "Si aucune proposition ne convient, reformuler en ajoutant un détail donne de meilleurs résultats que répéter la même description.",
        },
      ],
    },
  ],
  faq: [
    {
      q: "Comment retrouver un film avec seulement une scène en tête ?",
      r: "En décrivant la scène avec des détails visuels (lieu, objet, saison) dans un outil qui comprend le langage courant, comme Retrouver sur StreamActu.fr, puis en vérifiant les propositions avec leur bande-annonce.",
    },
    {
      q: "Retrouver est-il gratuit ?",
      r: "Oui, dans la limite de cinq recherches par jour et par visiteur.",
    },
    {
      q: "Ma description est-elle enregistrée ?",
      r: "Elle est envoyée à Anthropic pour être analysée, mais StreamActu.fr ne la conserve pas.",
    },
  ],
};
