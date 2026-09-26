import type { Guide } from "../guides";

/**
 * Sources vérifiées le 2026-09-26 (voir `sources`). Délais de la chronologie
 * des médias : accord du 24 janvier 2022, avenant Disney+ du 29 janvier 2025,
 * fin de l'accord Netflix à 15 mois le 31 décembre 2025, avenant sur la
 * coexploitation télé/plateforme du 25 septembre 2023 (JO du 6 octobre 2023).
 */
export const GUIDE_FILM_QUITTE_PLATEFORME: Guide = {
  slug: "film-quitte-plateforme",
  titre: "Pourquoi un film quitte une plateforme de streaming",
  description:
    "Licence arrivée à échéance, passage sur une chaîne gratuite, chronologie des médias : pourquoi un film disparaît de Netflix ou de Canal+, et où il va.",
  chapo:
    "Un film quitte une plateforme de streaming pour deux raisons principales : la licence qui lui permettait de le diffuser arrive à son terme et n'est pas renouvelée, ou les règles françaises de la chronologie des médias l'obligent à le retirer, par exemple quand une chaîne gratuite le diffuse. Les films produits par la plateforme elle-même partent beaucoup plus rarement.",
  publie: "2026-09-26",
  misAJour: "2026-09-26",
  sections: [
    {
      titre: "Une plateforme loue la plupart de ses films",
      blocs: [
        {
          p: "Hors de leurs propres productions, les plateformes ne possèdent pas les films qu'elles proposent : elles achètent auprès des studios et des distributeurs un droit de diffusion, pour un pays et pour une durée. Quand ce contrat, la licence, arrive à échéance, la plateforme décide de le renouveler ou non. Netflix explique qu'elle tient compte de deux éléments : si les droits sont encore disponibles, et la popularité du titre dans le pays rapportée au coût de la licence.",
        },
        {
          p: "C'est aussi pourquoi le catalogue change d'un pays à l'autre : un film peut être sur Netflix aux États-Unis et sur Prime Video en France, parce que les droits ont été vendus séparément pour chaque territoire. StreamActu.fr ne suit que le catalogue français.",
        },
      ],
    },
    {
      titre: "La chronologie des médias fixe l'ordre de passage",
      blocs: [
        {
          p: "En France, un film sorti au cinéma ne peut pas arriver n'importe quand sur une plateforme. La chronologie des médias, un accord entre les professionnels du cinéma et les diffuseurs, fixe le délai minimal après la sortie en salle pour chaque type de diffusion. Les délais en vigueur en septembre 2026 :",
        },
        {
          table: {
            entetes: ["Mode de diffusion", "Délai après la sortie en salle"],
            lignes: [
              ["Achat et location en vidéo à la demande, DVD", "4 mois"],
              ["Canal+", "6 mois"],
              ["Disney+ (accord du 29 janvier 2025)", "9 mois"],
              ["Netflix (15 mois jusqu'au 31 décembre 2025)", "17 mois"],
              ["Prime Video et autres plateformes par abonnement", "17 mois"],
              ["Chaînes de télévision gratuites", "22 mois"],
            ],
          },
        },
        {
          p: "Les délais les plus courts sont la contrepartie d'engagements à financer le cinéma français. L'accord qui donnait à Netflix une fenêtre à 15 mois n'a pas été renouvelé fin 2025 : la plateforme est revenue à 17 mois. Ces règles ne concernent que les films sortis en salle ; un film produit par une plateforme et sorti directement chez elle n'y est pas soumis.",
        },
      ],
    },
    {
      titre: "Le passage à la télévision gratuite",
      blocs: [
        {
          p: "C'est la cause de départ la plus propre au système français. À partir du 22e mois, quand une chaîne gratuite a acheté le film, les plateformes par abonnement doivent en principe le retirer de leur catalogue pendant la fenêtre de la chaîne, jusqu'au 36e mois après la sortie en salle. Un film peut donc disparaître de Netflix ou de Prime Video quelques mois seulement après y être arrivé.",
        },
        {
          p: "Un avenant signé le 25 septembre 2023 a assoupli cette règle à titre expérimental. Pour certains films, la plateforme peut garder le titre et ne le retirer qu'autour de sa diffusion à la télévision : un mois après le premier passage à l'antenne, ou deux mois pour les grosses productions de plateformes qui n'ont pas été préfinancées par la télévision. Les conditions dépendent du budget et de qui a produit le film.",
        },
      ],
    },
    {
      titre: "Le parcours type d'un film de cinéma",
      blocs: [
        {
          ol: [
            "Sortie en salle.",
            "Quatre mois plus tard, achat et location en ligne.",
            "À six mois, arrivée sur Canal+.",
            "À neuf mois sur Disney+ pour ses propres films, à dix-sept mois sur Netflix, Prime Video ou une autre plateforme qui a acheté les droits.",
            "À vingt-deux mois, diffusion possible sur une chaîne gratuite, et retrait des plateformes pendant cette fenêtre.",
            "Ensuite, retour possible sur une plateforme, pas forcément la même, selon qui achète les droits.",
          ],
        },
        {
          p: "C'est un schéma général : chaque film suit ses propres contrats, et beaucoup ne passent pas par toutes les étapes. Mais il explique la plupart des disparitions qui surprennent les abonnés.",
        },
      ],
    },
    {
      titre: "Et les séries ?",
      blocs: [
        {
          p: "Les séries ne sont pas concernées par la chronologie des médias, qui vise les films sortis en salle. Elles quittent une plateforme pour la même raison que les films sous licence : le contrat arrive à son terme. Les séries produites par la plateforme restent en général disponibles, mais un retrait reste possible, par exemple lors d'un rachat ou d'une réorganisation du catalogue. L'histoire des séries HBO en France en est un bon exemple, racontée dans le guide [où regarder les séries HBO en France](/guides/series-hbo-france).",
        },
      ],
    },
    {
      titre: "Comment savoir où un film est passé",
      blocs: [
        {
          p: "Netflix prévient avant qu'un titre ne quitte son catalogue. Pour savoir où le retrouver ensuite, la fiche du film sur StreamActu.fr indique chaque jour les plateformes par abonnement où il est disponible en France, d'après JustWatch via TMDB. StreamActu.fr suit les arrivées de nouveautés, pas encore les départs : si un titre a disparu partout, c'est qu'il n'est plus proposé par abonnement, et qu'il reste peut-être disponible à la location.",
        },
        {
          p: "Pour les films et séries qui arrivent, voir les [prochaines sorties](/prochaines-sorties) et les nouveautés de chaque plateforme, par exemple [Netflix](/netflix) ou [Canal+](/canal-plus).",
        },
      ],
    },
  ],
  faq: [
    {
      q: "Pourquoi un film disparaît-il de Netflix ?",
      r: "Le plus souvent parce que la licence qui permettait à Netflix de le diffuser est arrivée à échéance et n'a pas été renouvelée. En France, un film peut aussi être retiré quand une chaîne gratuite le diffuse, à partir de 22 mois après sa sortie en salle.",
    },
    {
      q: "Combien de temps après sa sortie au cinéma un film arrive-t-il sur Netflix ?",
      r: "Dix-sept mois après la sortie en salle depuis le 1er janvier 2026, faute de renouvellement de l'accord qui lui accordait 15 mois. Canal+ peut le diffuser dès 6 mois et Disney+ dès 9 mois pour ses propres films.",
    },
    {
      q: "Un film retiré peut-il revenir ?",
      r: "Oui. Une fois la fenêtre d'une chaîne gratuite terminée, ou si une plateforme rachète les droits, le film peut revenir, sur la même plateforme ou sur une autre.",
    },
  ],
  sources: [
    { titre: "Netflix, « Pourquoi une série ou un film n'est-il plus diffusé sur Netflix ? »", url: "https://help.netflix.com/fr/node/60541" },
    { titre: "Wikipédia, « Chronologie des médias »", url: "https://fr.wikipedia.org/wiki/Chronologie_des_m%C3%A9dias" },
    { titre: "Boxoffice Pro, « Un avenant à la chronologie des médias sur la coexploitation télé/plateforme »", url: "https://www.boxofficepro.fr/un-avenant-a-la-chronologie-des-medias-sur-la-coexploitation-tele-plateforme/" },
    { titre: "Selectra, « Pourquoi les films mettent 17 mois à arriver sur Netflix (et 9 sur Disney+) », mis à jour le 21 août 2026", url: "https://selectra.info/telecom/actualites/marche/netflix-france-17-mois-chronologie-medias-films-plus-tard" },
  ],
};
