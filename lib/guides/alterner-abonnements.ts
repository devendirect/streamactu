import type { Guide } from "../guides";

/**
 * Fonctionnement vérifié dans le code : components/AbonnementDuMois.tsx
 * (« Quel abonnement ce mois-ci ? » : titres à voir de Ma liste croisés avec
 * leurs plateformes en France et les abonnements cochés ; rubriques « À
 * prendre », « À garder », « Vous pouvez mettre en pause », « Les mois
 * suivants »). Aucun prix cité : ils changent trop souvent.
 */
export const GUIDE_ALTERNER_ABONNEMENTS: Guide = {
  slug: "alterner-abonnements",
  titre: "Alterner ses abonnements streaming mois par mois",
  description:
    "Garder un ou deux abonnements à la fois et changer selon les sorties : la méthode, ses limites, et comment Ma liste indique quelle plateforme prendre.",
  chapo:
    "Alterner ses abonnements consiste à ne garder qu'une ou deux plateformes à la fois, le temps de regarder ce qui y est sorti, puis à passer à une autre. La plupart des offres se résilient à tout moment, et le catalogue d'une plateforme est toujours là quand on y revient. Ma liste, sur StreamActu.fr, indique chaque mois la plateforme qui couvre le plus de titres à voir.",
  publie: "2026-10-29",
  misAJour: "2026-10-29",
  sections: [
    {
      titre: "Le principe",
      blocs: [
        {
          p: "Un abonné ne regarde jamais toutes ses plateformes en même temps. Plutôt que de payer chaque mois pour quatre services, on en garde un, parfois deux, pendant un mois ou deux, on regarde ce qui nous intéresse, on résilie, et on passe au suivant. Le catalogue ne disparaît pas : il s'est enrichi quand on revient.",
        },
        {
          p: "La méthode ne fait pas regarder moins. Elle fait payer pour ce qu'on regarde vraiment, à condition de savoir à l'avance ce qu'on veut voir sur chaque plateforme.",
        },
      ],
    },
    {
      titre: "Quatre habitudes qui la font marcher",
      blocs: [
        {
          ol: [
            "Attendre la fin des saisons. Beaucoup de séries sortent un épisode par semaine : s'abonner au lancement d'une saison de huit épisodes, c'est payer deux mois. S'abonner une fois le dernier épisode sorti, c'est la regarder en un mois. Le prix à payer, ce sont quelques semaines à éviter les révélations.",
            "Tenir une seule liste, toutes plateformes confondues. Quand trois ou quatre titres s'accumulent sur le même service, c'est le moment d'y aller.",
            "Résilier dès l'inscription. Sur la plupart des services, l'accès reste ouvert jusqu'à la fin de la période déjà payée : on ne perd rien, et on n'a plus à penser au renouvellement.",
            "Regarder les sorties à venir avant de changer. Savoir qu'une série attendue arrive le mois suivant permet de décider quelle plateforme garder.",
          ],
        },
      ],
    },
    {
      titre: "Ce que fait Ma liste",
      blocs: [
        {
          p: "Sur la page [Ma liste](/ma-liste), le bloc « Quel abonnement ce mois-ci ? » applique cette méthode aux titres qu'on y a ajoutés. Il croise les titres pas encore vus avec les plateformes qui les proposent en France et les abonnements qu'on a cochés, puis répond en quatre rubriques :",
        },
        {
          ul: [
            "À prendre ce mois-ci : la plateforme qui couvre le plus de titres de la liste.",
            "À garder : les abonnements qui servent encore.",
            "Vous pouvez mettre en pause : ceux qui ne proposent aucun titre de la liste.",
            "Les mois suivants : l'ordre conseillé pour la suite.",
          ],
        },
        {
          p: "Tout se calcule dans le navigateur, sans compte. Seule la liste des titres est envoyée au site pour connaître leurs disponibilités, et elle n'est pas enregistrée. Pour anticiper, les [prochaines sorties](/prochaines-sorties) donnent les nouveautés annoncées sur toutes les plateformes, environ quatre semaines à l'avance.",
        },
      ],
    },
    {
      titre: "Les limites de la méthode",
      blocs: [
        {
          ul: [
            "Certaines offres comportent un engagement, en particulier quand l'abonnement est inclus dans une box, un forfait mobile ou une formule groupée. Il faut vérifier les conditions avant de compter sur une résiliation mensuelle.",
            "Dans un foyer où chacun suit une plateforme différente, s'accorder sur un seul service à la fois est difficile.",
            "Le sport en direct se prête mal à l'alternance : on ne choisit pas la date d'un match.",
            "Certains films ne restent que quelques mois sur une plateforme. Trop attendre oblige parfois à les louer ailleurs ; le guide [pourquoi un film quitte une plateforme](/guides/film-quitte-plateforme) explique pourquoi.",
            "Suivre une série en même temps que tout le monde devient impossible pour celles qu'on attend de voir en entier.",
          ],
        },
        {
          p: "Pour choisir une plateforme selon ses goûts plutôt que selon le mois, voir le guide [quelle plateforme choisir](/guides/choisir-plateforme).",
        },
      ],
    },
  ],
  faq: [
    {
      q: "Peut-on résilier Netflix ou Disney+ à tout moment ?",
      r: "Les abonnements pris directement sur leur site sont sans engagement et se résilient en ligne ; l'accès reste ouvert jusqu'à la fin de la période payée. Les offres incluses dans une box ou un forfait suivent leurs propres conditions.",
    },
    {
      q: "Comment savoir quelle plateforme prendre ce mois-ci ?",
      r: "En ajoutant les titres qu'on veut voir à Ma liste sur StreamActu.fr : le bloc « Quel abonnement ce mois-ci ? » indique la plateforme qui en couvre le plus en France.",
    },
    {
      q: "Est-ce rentable d'alterner ses abonnements ?",
      r: "Oui dès qu'on paie plusieurs plateformes sans les regarder toutes chaque mois. L'économie dépend du nombre d'abonnements qu'on garde en même temps.",
    },
  ],
};
