/**
 * Textes éditoriaux des pages plateformes, écrits à la main : un angle
 * différent par page (hub, séries, films, calendrier) pour ne pas répéter le
 * même paragraphe. Pas de prix ni de date d'offre en dur : ça change.
 * Règle : ne rien affirmer qu'on ne puisse vérifier sur la plateforme.
 */

export interface ContenuPlateforme {
  /** Hub /{plateforme} : ce qu'on trouve sur la plateforme */
  presentation: string[];
  /** /{plateforme}/series : comment sortent les séries */
  series: string;
  /** /{plateforme}/films : d'où viennent les films */
  films: string;
  /** /{plateforme}/prochaines-sorties : comment lire le calendrier */
  calendrier: string;
}

export const CONTENU_PLATEFORME: Record<string, ContenuPlateforme> = {
  netflix: {
    presentation: [
      "Netflix mélange ses propres productions et des films et séries achetés à d'autres studios. Les productions maison viennent du monde entier : beaucoup de séries américaines, mais aussi françaises, espagnoles, coréennes ou allemandes, souvent disponibles en version originale et doublées.",
      "Côté rythme, Netflix publie en général une saison entière le même jour. Une série vue ici un vendredi peut donc être terminée le dimanche, ce qui explique que les séries Netflix restent peu de temps en tête des nouveautés.",
    ],
    series:
      "Une saison de série Netflix sort presque toujours d'un bloc : tous les épisodes le même jour, parfois coupés en deux parties à quelques semaines d'écart pour les plus attendues. Une partie des séries coréennes et certaines téléréalités font exception, avec de nouveaux épisodes chaque semaine. La date indiquée ici est celle de la mise en ligne, pas celle d'une éventuelle diffusion à l'étranger.",
    films:
      "Les films Netflix se partagent entre les films maison, qui sortent directement sur la plateforme, et les films passés d'abord par le cinéma, qui n'arrivent en France qu'une fois écoulés les délais de la chronologie des médias. Ces derniers sont classés à leur date de sortie en salle : ils figurent dans les archives mensuelles plutôt que dans cette liste des dernières semaines.",
    calendrier:
      "Pour Netflix, une date annoncée correspond le plus souvent à une saison complète, pas à un seul épisode. Les séries publiées chaque semaine apparaissent en revanche plusieurs fois dans le calendrier, une ligne par épisode.",
  },
  "prime-video": {
    presentation: [
      "Prime Video est compris dans l'abonnement Amazon Prime. On y trouve les productions d'Amazon (The Boys, Reacher, Les Anneaux de pouvoir) et un catalogue de films et séries sous licence, dont une part de cinéma français.",
      "Attention, la même application vend et loue aussi des films hors abonnement. StreamActu.fr ne retient que les titres inclus dans l'abonnement : un film proposé seulement à la location n'apparaît pas ici.",
    ],
    series:
      "Prime Video n'a pas de règle unique pour ses séries. Les grosses productions démarrent souvent avec deux ou trois épisodes, puis continuent au rythme d'un épisode par semaine ; d'autres saisons sortent en entier le même jour. Chaque série de cette liste mène à sa fiche, où le nombre de saisons et d'épisodes est indiqué.",
    films:
      "Les films de Prime Video viennent de trois sources : les productions d'Amazon MGM Studios, les films achetés pour l'abonnement, et le cinéma récent qui arrive après sa sortie en salle. Seuls les titres inclus dans Prime sont comptés ici ; ceux proposés à l'achat ou à la location dans la même application sont écartés.",
    calendrier:
      "Le calendrier Prime Video mélange lancements de saisons complètes et épisodes hebdomadaires. Quand une série apparaît plusieurs fois, c'est qu'elle sort épisode par épisode ; la première date correspond au lancement.",
  },
  "disney-plus": {
    presentation: [
      "Disney+ réunit les marques du groupe Disney : les films Disney et Pixar, l'univers Marvel, Star Wars et National Geographic. Le catalogue Star y ajoute des séries et films pour adultes, venus notamment des chaînes américaines du groupe.",
      "Les séries Marvel et Star Wars sortent le plus souvent au rythme d'un épisode par semaine, après un lancement à un ou deux épisodes : elles restent donc plusieurs semaines dans les nouveautés.",
    ],
    series:
      "Sur Disney+, la plupart des séries sortent un épisode par semaine, avec un lancement à un ou deux épisodes. Les séries du catalogue Star, souvent diffusées d'abord aux États-Unis, arrivent parfois en France avec un décalage. Une même série peut donc rester en haut de cette liste pendant tout le temps de sa diffusion.",
    films:
      "Les films Disney+ sont surtout ceux des studios du groupe : Disney, Pixar, Marvel, Lucasfilm et 20th Century. Les grands films passés par le cinéma n'arrivent sur la plateforme que plusieurs mois après leur sortie en salle, et sont classés ici à leur date de sortie en salle.",
    calendrier:
      "Comme la plupart des séries Disney+ sortent chaque semaine, le calendrier compte souvent une ligne par épisode. Les dates des films du catalogue Star sont celles annoncées pour la France, qui peuvent différer de la sortie américaine.",
  },
  "apple-tv-plus": {
    presentation: [
      "Apple TV+ a l'un des plus petits catalogues des sept plateformes, mais il s'agit presque uniquement de productions d'Apple : Ted Lasso, Severance, Slow Horses, Pour toute l'humanité. Il y a peu de titres achetés à d'autres studios.",
      "Conséquence directe : il y a moins de nouveautés que sur Netflix ou Prime Video, et certaines semaines sont vides. Quand c'est le cas, la page élargit aux quatre dernières semaines plutôt que de s'afficher vide.",
    ],
    series:
      "Les séries Apple TV+ sortent en général au rythme d'un épisode par semaine, après un lancement à deux ou trois épisodes. Comme la plateforme produit elle-même presque toutes ses séries, les dates sont connues longtemps à l'avance et bougent peu.",
    films:
      "Apple TV+ produit peu de films, mais certains sont de gros projets passés par le cinéma avant d'arriver sur la plateforme. Il y a donc des semaines, voire des mois, sans nouveau film : c'est le rythme normal du catalogue, pas un trou dans les données.",
    calendrier:
      "Le calendrier Apple TV+ est court mais fiable : les séries Apple sont annoncées tôt, et chaque épisode hebdomadaire a sa propre ligne. Un jour vide ici signifie simplement qu'Apple ne publie rien ce jour-là.",
  },
  "canal-plus": {
    presentation: [
      "Canal+ est d'abord un groupe de télévision payante. Sa plateforme rassemble ses chaînes, ses séries maison, les Créations Originales (Baron noir, Le Bureau des légendes, Validé), et beaucoup de cinéma.",
      "C'est le point fort de Canal+ : grâce à la chronologie des médias, les films y arrivent quelques mois après leur sortie en salle, bien avant les autres plateformes par abonnement. Les nouveautés films sont donc souvent des sorties cinéma récentes.",
    ],
    series:
      "Les Créations Originales de Canal+ sont en général diffusées d'abord à l'antenne, souvent deux épisodes par soirée, et mises en ligne au même moment. Le reste des séries vient de productions étrangères achetées par le groupe, françaises ou internationales.",
    films:
      "Sur Canal+, les films récents sont la règle : la chronologie des médias donne à Canal+ la première fenêtre par abonnement après le cinéma, quelques mois après la sortie en salle. Ces films sont classés ici à leur date de sortie au cinéma, ce qui explique qu'un film de l'an dernier puisse apparaître dans les archives récentes.",
    calendrier:
      "Le calendrier Canal+ suit surtout les séries, car les films arrivent au fil des fenêtres de diffusion plutôt qu'à des dates annoncées longtemps à l'avance. Les Créations Originales sont généralement programmées deux épisodes par semaine.",
  },
  "hbo-max": {
    presentation: [
      "HBO Max, anciennement Max, est la plateforme de Warner Bros. Discovery. Elle rassemble les séries HBO (The Last of Us, House of the Dragon, The White Lotus), les films Warner Bros. et DC, et des productions Discovery.",
      "Les séries HBO sortent un épisode par semaine, en général dès le lendemain de leur diffusion aux États-Unis : une saison s'étale donc sur deux mois environ, et apparaît plusieurs semaines de suite ici.",
    ],
    series:
      "La tradition HBO est l'épisode hebdomadaire : une nouvelle saison démarre avec un épisode, puis un par semaine, mis en ligne en France peu après la diffusion américaine. Les séries plus anciennes du catalogue sont disponibles en intégralité et n'apparaissent ici que lorsqu'une nouvelle saison sort.",
    films:
      "Les films de HBO Max viennent surtout de Warner Bros., de DC et de New Line. Les films récents passés par le cinéma arrivent après les fenêtres réservées aux autres diffuseurs, et sont classés ici à leur date de sortie en salle.",
    calendrier:
      "Pour HBO Max, le calendrier compte une ligne par épisode : c'est le reflet du rythme hebdomadaire des séries HBO. La date est celle de la mise en ligne en France, qui suit de peu la diffusion américaine.",
  },
  "paramount-plus": {
    presentation: [
      "Paramount+ regroupe les films Paramount Pictures et les séries du groupe, dont celles de Taylor Sheridan (1883, 1923, Tulsa King, Landman), l'univers Star Trek et des séries CBS. En France, la plateforme est proposée seule ou incluse dans certaines offres Canal+.",
      "Son catalogue est plus petit que ceux de Netflix ou Prime Video : certaines semaines comptent peu de nouveautés, et la page élargit alors aux quatre dernières semaines.",
    ],
    series:
      "Les séries Paramount+ sortent surtout au rythme d'un épisode par semaine, souvent peu après leur diffusion américaine. Les séries de Taylor Sheridan en sont l'exemple type : une saison s'étale sur plusieurs semaines et reste longtemps dans les nouveautés.",
    films:
      "Les films de Paramount+ sont en majorité des films Paramount Pictures, auxquels s'ajoutent quelques productions faites pour la plateforme. Les films passés par le cinéma arrivent plusieurs mois après leur sortie en salle, et sont classés ici à cette date de sortie.",
    calendrier:
      "Le calendrier Paramount+ est surtout fait d'épisodes hebdomadaires. Les dates des séries américaines peuvent bouger d'un jour ou deux entre l'annonce et la mise en ligne en France.",
  },
};

/** Comment est faite la liste des pages /{plateforme}/series et /films */
export function methodeListe(nom: string, type: "series" | "films"): string {
  const titres = type === "series" ? "séries" : "films";
  const quoi = type === "series" ? "dont un épisode est sorti" : "sortis";
  return `Cette liste reprend les ${titres} disponibles par abonnement sur ${nom} en France ${quoi} ces quatre dernières semaines, d'après TMDB. Ils sont triés par note des spectateurs ; chaque titre mène à sa fiche, avec le casting, la bande-annonce et les autres plateformes où le regarder. Les titres de moins de cinq votes n'y figurent pas encore, et la liste s'arrête à vingt titres.`;
}

/** Comment lire les pages /{plateforme}/prochaines-sorties */
export function methodeCalendrier(nom: string): string {
  return `Ce calendrier liste jour par jour les épisodes et films annoncés sur ${nom} en France pour les quatre semaines à venir, d'après TMDB. Il est recalculé toutes les six heures : une date peut apparaître, bouger ou disparaître d'ici là. Une fois sortis, les titres rejoignent les nouveautés de la semaine puis les archives mensuelles.`;
}
