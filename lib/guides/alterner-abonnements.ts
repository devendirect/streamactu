import type { Guide } from "../guides";

/**
 * Fonctionnement vérifié dans le code : components/AbonnementDuMois.tsx
 * (« Quel abonnement ce mois-ci ? » : titres à voir de Ma liste croisés avec
 * leurs plateformes en France et les abonnements cochés ; rubriques « À
 * prendre », « À garder », « Vous pouvez mettre en pause », « Les mois
 * suivants »). Aucun prix cité dans le corps du guide : ils changent trop
 * souvent ; seules deux promotions datées de novembre 2026 sont mentionnées
 * (section « Les promotions de fin d'année »), à retirer ou mettre à jour après
 * le 9 décembre 2026.
 *
 * Faits extérieurs (vérifiés le 2026-11-20) :
 * - Disney+ : promotion du 11 au 24 novembre 2026 sur les trois formules, deux
 *   mois à tarif réduit puis plein tarif, sans engagement, ouverte aux nouveaux
 *   abonnés et aux anciens qui se réabonnent (ariase.com, selectra.info,
 *   economiematin.fr) ;
 * - Canal+ La Totale : série limitée vendue du 10 novembre au 9 décembre 2026,
 *   engagement de 24 mois (gameblog.fr, jechange.fr, resilier.com).
 */
export const GUIDE_ALTERNER_ABONNEMENTS: Guide = {
  slug: "alterner-abonnements",
  titre: "Alterner ses abonnements streaming mois par mois",
  description:
    "Garder un ou deux abonnements à la fois et changer selon les sorties : la méthode, ses limites, et comment Ma liste indique quelle plateforme prendre.",
  chapo:
    "Alterner ses abonnements consiste à ne garder qu'une ou deux plateformes à la fois, le temps de regarder ce qui y est sorti, puis à passer à une autre. La plupart des offres se résilient à tout moment, et le catalogue d'une plateforme est toujours là quand on y revient. Ma liste, sur StreamActu.fr, indique chaque mois la plateforme qui couvre le plus de titres à voir.",
  publie: "2026-10-29",
  misAJour: "2026-11-20",
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
      titre: "Les promotions de fin d'année",
      blocs: [
        {
          p: "Le Black Friday (le 27 novembre 2026) et les semaines qui l'entourent sont le moment où les offres se multiplient, mais elles ne se valent pas pour qui alterne. Deux exemples de ce mois de novembre 2026 :",
        },
        {
          ul: [
            "Disney+ propose, jusqu'au 24 novembre, deux mois à tarif réduit sur ses trois formules, puis le plein tarif. L'offre est sans engagement : on peut résilier à la fin des deux mois, ce qui convient à l'alternance. Elle est ouverte aux nouveaux abonnés et aux anciens abonnés qui reviennent, pas à un abonnement déjà actif.",
            "Canal+ vend jusqu'au 9 décembre une formule groupée, La Totale, qui rassemble plusieurs plateformes, avec un engagement de 24 mois. Le prix mensuel est bas, mais la formule ne se résilie pas mois par mois : elle ne convient pas à l'alternance.",
          ],
        },
        {
          p: "Avant de souscrire, il faut vérifier trois choses sur la page officielle de l'offre : la durée de l'engagement, le prix après la période promotionnelle, et si on y est éligible quand on a déjà été abonné. Ces conditions changent d'une opération à l'autre.",
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
      q: "Les offres du Black Friday conviennent-elles à qui alterne ses abonnements ?",
      r: "Seulement celles sans engagement, comme les deux mois à tarif réduit de Disney+ en novembre 2026. Les formules groupées engagées sur 24 mois, comme Canal+ La Totale, empêchent de résilier au bout d'un mois.",
    },
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
  sources: [
    { titre: "Ariase, « Disney+ baisse le prix de ses trois abonnements : quelle formule choisir avant le 24 novembre »", url: "https://www.ariase.com/streaming/actualite/disney-baisse-le-prix-de-ses-trois-abonnements-quelle-formule-choisir-avant-le-24-novembre" },
    { titre: "Gameblog, « Canal+ : la promo La Totale 2026 »", url: "https://www.gameblog.fr/geek/ed/news/canal-plus-promo-la-totale-2026-726511" },
    { titre: "JeChange, « Canal+ La Totale à 40 € : engagement de 2 ans »", url: "https://www.jechange.fr/telecom/internet/news/canal-plus-la-totale-40-euros-10-novembre-netflix-hbo-max-bein-engagement-2-ans" },
  ],
};
