import type { Guide, OeuvreGuide } from "../guides";

/**
 * Données TMDB relevées le 2026-10-09 (mot-clé « marvel cinematic universe ») :
 * titres français, dates de sortie en salle en France, plateformes en France
 * (Disney+ pour tous les films et séries Marvel Studios ce jour-là ; les
 * Spider-Man de Sony aussi sur Netflix et HBO Max). Les plateformes affichées
 * dans les listes sont relues chaque jour sur les fiches.
 *
 * Faits extérieurs à TMDB (voir `sources`) : ordre chronologique de la saga
 * de l'Infini (les guides divergent sur une ou deux places, voir le texte) ;
 * VisionQuest le 14 octobre 2026 sur Disney+, deux épisodes puis un par
 * semaine jusqu'au 25 novembre ; délai de 9 mois avant Disney+.
 *
 * Écartés des listes : courts métrages « One-Shot » et Je s'appelle Groot,
 * making-of, X-Men '97 (hors continuité), Votre fidèle serviteur Spider-Man
 * (sans plateforme française chez TMDB au relevé).
 *
 * Révision : trimestrielle, et à chaque nouveau film ou série.
 */

const f = (id: number, titre: string): OeuvreGuide => ({ type: "film", id, titre, repere: "" });
const s = (id: number, titre: string): OeuvreGuide => ({ type: "serie", id, titre, repere: "" });

const IRON_MAN = f(1726, "Iron Man");
const HULK = f(1724, "L'Incroyable Hulk");
const IRON_MAN_2 = f(10138, "Iron Man 2");
const THOR = f(10195, "Thor");
const CAP_1 = f(1771, "Captain America : First Avenger");
const AVENGERS = f(24428, "Avengers");
const IRON_MAN_3 = f(68721, "Iron Man 3");
const THOR_2 = f(76338, "Thor : Le Monde des ténèbres");
const CAP_2 = f(100402, "Captain America : Le Soldat de l'hiver");
const GARDIENS = f(118340, "Les Gardiens de la Galaxie");
const ULTRON = f(99861, "Avengers : L'Ère d'Ultron");
const ANT_MAN = f(102899, "Ant-Man");
const CIVIL_WAR = f(271110, "Captain America : Civil War");
const STRANGE = f(284052, "Doctor Strange");
const GARDIENS_2 = f(283995, "Les Gardiens de la Galaxie Vol. 2");
const HOMECOMING = f(315635, "Spider-Man : Homecoming");
const RAGNAROK = f(284053, "Thor : Ragnarok");
const BLACK_PANTHER = f(284054, "Black Panther");
const INFINITY_WAR = f(299536, "Avengers : Infinity War");
const ANT_MAN_2 = f(363088, "Ant-Man et la Guêpe");
const CAPTAIN_MARVEL = f(299537, "Captain Marvel");
const ENDGAME = f(299534, "Avengers : Endgame");
const FAR_FROM_HOME = f(429617, "Spider-Man : Far From Home");
const BLACK_WIDOW = f(497698, "Black Widow");

export const GUIDE_MARVEL_ORDRE: Guide = {
  slug: "marvel-ordre",
  titre: "Marvel dans l'ordre : films, séries et plateformes",
  description:
    "Les films et séries Marvel dans l'ordre de sortie et dans l'ordre de l'histoire, de Iron Man à VisionQuest, avec la plateforme de chaque titre en France.",
  chapo:
    "En France, les films et séries Marvel Studios sont sur Disney+, à l'exception des films sortis trop récemment en salle. Pour une première fois, suivez l'ordre de sortie : les 23 films de la saga de l'Infini, d'Iron Man (2008) à Spider-Man : Far From Home (2019), puis les films et séries sortis depuis, qui se suivent presque dans l'ordre de l'histoire.",
  publie: "2026-10-09",
  misAJour: "2026-10-09",
  sections: [
    {
      titre: "La saga de l'Infini dans l'ordre de sortie",
      blocs: [
        {
          p: "Les 23 premiers films, de 2008 à 2019, racontent une seule grande histoire qui culmine avec Avengers : Infinity War et Avengers : Endgame. L'ordre de sortie est le plus sûr : chaque film prépare les suivants, et les scènes après le générique annoncent souvent le prochain.",
        },
        {
          ordre: "sortie",
          sommaire: "Saga de l'Infini, ordre de sortie",
          oeuvres: [
            { ...IRON_MAN, repere: "2008. Le point de départ." },
            { ...HULK, facultatif: true, repere: "2008. Le seul film où Bruce Banner est joué par Edward Norton." },
            { ...IRON_MAN_2, repere: "2010." },
            { ...THOR, repere: "2011." },
            { ...CAP_1, repere: "2011. Se passe pendant la Seconde Guerre mondiale." },
            { ...AVENGERS, repere: "2012. Première réunion des héros." },
            { ...IRON_MAN_3, repere: "2013." },
            { ...THOR_2, repere: "2013." },
            { ...CAP_2, repere: "2014." },
            { ...GARDIENS, repere: "2014. Nouvelle équipe, dans l'espace." },
            { ...ULTRON, repere: "2015." },
            { ...ANT_MAN, repere: "2015." },
            { ...CIVIL_WAR, repere: "2016. Les Avengers se divisent ; première apparition de Spider-Man et de Black Panther." },
            { ...STRANGE, repere: "2016." },
            { ...GARDIENS_2, repere: "2017." },
            { ...HOMECOMING, repere: "2017. Coproduction avec Sony, d'où sa présence sur d'autres plateformes." },
            { ...RAGNAROK, repere: "2017." },
            { ...BLACK_PANTHER, repere: "2018." },
            { ...INFINITY_WAR, repere: "2018. Première partie du final." },
            { ...ANT_MAN_2, repere: "2018. Sa scène après le générique se passe pendant Infinity War." },
            { ...CAPTAIN_MARVEL, repere: "2019. Se passe en 1995 : à voir avant Endgame." },
            { ...ENDGAME, repere: "2019. Fin de la saga de l'Infini." },
            { ...FAR_FROM_HOME, repere: "2019. Épilogue, juste après Endgame." },
          ],
        },
      ],
    },
    {
      titre: "La saga de l'Infini dans l'ordre de l'histoire",
      blocs: [
        {
          p: "Pour revoir la saga, on peut ranger les films selon l'époque où ils se passent. Les guides divergent sur une ou deux places (L'Incroyable Hulk avant ou après Iron Man 2, Iron Man 3 avant ou après Thor : Le Monde des ténèbres), sans incidence sur la compréhension. Black Widow, sorti en 2021, y trouve sa place, entre Civil War et Infinity War.",
        },
        {
          ordre: "histoire",
          sommaire: "Saga de l'Infini, ordre de l'histoire",
          oeuvres: [
            { ...CAP_1, repere: "Seconde Guerre mondiale." },
            { ...CAPTAIN_MARVEL, repere: "1995." },
            { ...IRON_MAN, repere: "Le présent de la saga commence." },
            { ...HULK, repere: "En même temps qu'Iron Man 2." },
            { ...IRON_MAN_2, repere: "Six mois après Iron Man." },
            { ...THOR, repere: "La même semaine qu'Iron Man 2." },
            { ...AVENGERS, repere: "Réunit les héros des cinq films précédents." },
            { ...IRON_MAN_3, repere: "Quelques mois après Avengers." },
            { ...THOR_2, repere: "Après Avengers." },
            { ...CAP_2, repere: "Deux ans après Avengers." },
            { ...GARDIENS, repere: "Dans l'espace, la même année." },
            { ...GARDIENS_2, repere: "Quelques mois après le premier." },
            { ...ULTRON, repere: "Le retour des Avengers." },
            { ...ANT_MAN, repere: "Après L'Ère d'Ultron." },
            { ...CIVIL_WAR, repere: "Un an après L'Ère d'Ultron." },
            { ...BLACK_WIDOW, repere: "Juste après Civil War. Sorti en 2021." },
            { ...BLACK_PANTHER, repere: "Une semaine après Civil War." },
            { ...HOMECOMING, repere: "Quelques mois après Civil War." },
            { ...STRANGE, repere: "Son histoire s'étend sur plusieurs mois autour de Civil War." },
            { ...RAGNAROK, repere: "Juste avant Infinity War." },
            { ...ANT_MAN_2, repere: "Deux ans après Civil War." },
            { ...INFINITY_WAR, repere: "Première partie du final." },
            { ...ENDGAME, repere: "Commence juste après Infinity War, puis fait un saut de cinq ans." },
            { ...FAR_FROM_HOME, repere: "Quelques mois après Endgame." },
          ],
        },
      ],
    },
    {
      titre: "Depuis Endgame : films et séries dans l'ordre de sortie",
      blocs: [
        {
          p: "Depuis 2021, Marvel alterne films au cinéma et séries sur Disney+, et l'histoire avance à peu près au rythme des sorties : l'ordre de sortie fait office d'ordre chronologique. Les séries d'animation et les épisodes spéciaux, marqués « facultatif », ne sont pas indispensables.",
        },
        {
          ordre: "sortie",
          sommaire: "Depuis Endgame",
          oeuvres: [
            { ...s(85271, "WandaVision"), repere: "Janvier 2021. Wanda et Vision, juste après Endgame." },
            { ...s(88396, "Falcon et le Soldat de l'hiver"), repere: "Mars 2021. Qui reprend le bouclier de Captain America." },
            { ...s(84958, "Loki"), repere: "Saison 1 en juin 2021, saison 2 en octobre 2023. Ouvre le multivers." },
            { ...BLACK_WIDOW, repere: "Juillet 2021. Se passe avant Infinity War : peut aussi se voir avec la saga de l'Infini." },
            { ...s(91363, "What If...?"), facultatif: true, repere: "Animation, à partir d'août 2021 : versions alternatives des films." },
            { ...f(566525, "Shang-Chi et la Légende des Dix Anneaux"), repere: "Septembre 2021. Nouveau héros." },
            { ...f(524434, "Les Éternels"), repere: "Novembre 2021. Histoire largement indépendante." },
            { ...s(88329, "Hawkeye"), repere: "Novembre 2021. Se passe à Noël." },
            { ...f(634649, "Spider-Man : No Way Home"), repere: "Décembre 2021. Suite directe de Far From Home." },
            { ...s(92749, "Moon Knight"), repere: "Mars 2022. Nouveau héros, histoire indépendante." },
            { ...f(453395, "Doctor Strange in the Multiverse of Madness"), repere: "Mai 2022. Après WandaVision et No Way Home." },
            { ...s(92782, "Miss Marvel"), repere: "Juin 2022. À voir avant The Marvels." },
            { ...f(616037, "Thor : Love and Thunder"), repere: "Juillet 2022." },
            { ...s(92783, "She-Hulk : Avocate"), repere: "Août 2022. Comédie." },
            { ...f(894205, "Werewolf by Night"), facultatif: true, repere: "Épisode spécial en noir et blanc, octobre 2022." },
            { ...f(505642, "Black Panther : Wakanda Forever"), repere: "Novembre 2022." },
            { ...f(774752, "Les Gardiens de la Galaxie : Joyeuses Fêtes"), repere: "Épisode spécial, novembre 2022, avant le Volume 3." },
            { ...f(640146, "Ant-Man et la Guêpe : Quantumania"), repere: "Février 2023." },
            { ...f(447365, "Les Gardiens de la Galaxie : Volume 3"), repere: "Mai 2023. Fin de la trilogie des Gardiens." },
            { ...s(114472, "Secret Invasion"), repere: "Juin 2023. Nick Fury face aux Skrulls." },
            { ...f(609681, "The Marvels"), repere: "Novembre 2023. Suite de Captain Marvel et de Miss Marvel." },
            { ...s(122226, "Echo"), repere: "Janvier 2024. Dérivée de Hawkeye." },
            { ...f(533535, "Deadpool & Wolverine"), repere: "Juillet 2024. Se comprend mieux avec les deux Deadpool, produits par la Fox." },
            { ...s(138501, "Agatha All Along"), repere: "Septembre 2024. Dérivée de WandaVision." },
            { ...f(822119, "Captain America : Brave New World"), repere: "Février 2025. Sam Wilson, le Falcon, en Captain America." },
            { ...s(202555, "Daredevil : Born Again"), repere: "À partir de mars 2025. Suite de la série Daredevil de Netflix." },
            { ...f(986056, "Thunderbolts*"), repere: "Avril 2025." },
            { ...s(114471, "Ironheart"), repere: "Juin 2025. Riri Williams, apparue dans Wakanda Forever." },
            { ...f(617126, "Les 4 Fantastiques : Premiers Pas"), repere: "Juillet 2025. Se passe dans un univers parallèle à celui des autres films." },
            { ...s(241388, "Eyes of Wakanda"), facultatif: true, repere: "Animation, août 2025." },
            { ...s(138505, "Marvel Zombies"), facultatif: true, repere: "Animation, septembre 2025." },
            { ...s(198178, "Wonder Man"), facultatif: true, repere: "Janvier 2026. Comédie sur un acteur à Hollywood." },
            { ...f(1439930, "The Punisher : One Last Kill"), repere: "Épisode spécial, mai 2026." },
            {
              ...f(969681, "Spider-Man : Brand New Day"),
              auCinema: true,
              repere: "Sorti en salle le 29 juillet 2026. Film Sony Pictures.",
            },
          ],
        },
      ],
    },
    {
      titre: "Les séries Marvel de Netflix et d'ABC",
      blocs: [
        {
          p: "Avant Disney+, Marvel a produit des séries pour Netflix et pour la chaîne américaine ABC. Toutes sont aujourd'hui sur Disney+ en France. Elles se déroulent en marge des films, qui les ignorent presque entièrement ; seule Daredevil a une suite directe, Daredevil : Born Again.",
        },
        {
          ul: [
            "Chez Netflix : [Marvel's Daredevil](/serie/marvel-s-daredevil-61889), [Marvel's Jessica Jones](/serie/marvel-s-jessica-jones-38472), [Marvel's Luke Cage](/serie/marvel-s-luke-cage-62126), [Marvel's Iron Fist](/serie/marvel-s-iron-fist-62127), qui se rejoignent dans [Marvel's The Defenders](/serie/marvel-s-the-defenders-62285), puis [Marvel's The Punisher](/serie/marvel-s-the-punisher-67178).",
            "Chez ABC : [Marvel : Les Agents du S.H.I.E.L.D.](/serie/marvel-les-agents-du-s-h-i-e-l-d-1403), sept saisons dont les premières croisent les films, et [Agent Carter](/serie/agent-carter-61550), qui suit Peggy Carter après Captain America : First Avenger.",
          ],
        },
      ],
    },
    {
      titre: "Ce qui arrive",
      blocs: [
        {
          p: "VisionQuest, avec Paul Bettany en Vision, arrive sur Disney+ le mercredi 14 octobre 2026 avec deux épisodes, puis un épisode chaque mercredi jusqu'au 25 novembre. Elle conclut l'histoire ouverte par WandaVision et poursuivie par Agatha All Along. [Avengers : Doomsday](/film/avengers-doomsday-1003596) sort au cinéma le 16 décembre 2026 ; Disney+ ne peut proposer ses films que neuf mois après la salle (voir le guide [pourquoi un film quitte une plateforme](/guides/film-quitte-plateforme)). Les nouveautés sont suivies chaque jour sur la page [Disney+](/disney-plus) et dans le [calendrier des sorties](/prochaines-sorties).",
        },
      ],
    },
  ],
  faq: [
    {
      q: "Dans quel ordre regarder les films Marvel pour la première fois ?",
      r: "Dans l'ordre de sortie, d'Iron Man (2008) à Spider-Man : Far From Home (2019), puis les films et séries sortis depuis 2021. Le seul déplacement utile : Captain Marvel, sorti en 2019, peut se voir plus tôt, car il se passe en 1995.",
    },
    {
      q: "Où regarder les films Marvel en streaming en France ?",
      r: "Sur Disney+, qui propose les films et les séries Marvel Studios, y compris les anciennes séries Netflix et ABC. Les films Spider-Man coproduits avec Sony sont aussi sur d'autres plateformes, et les films récents arrivent sur Disney+ neuf mois après leur sortie en salle.",
    },
    {
      q: "Faut-il regarder les séries pour comprendre les films ?",
      r: "Pas pour la saga de l'Infini, qui se suit avec les seuls films. Depuis 2021, certaines séries comptent : WandaVision avant Doctor Strange in the Multiverse of Madness, Loki pour le multivers, Miss Marvel avant The Marvels.",
    },
    {
      q: "Combien de films Marvel faut-il voir avant Avengers : Endgame ?",
      r: "La saga de l'Infini compte 23 films, dont 21 sortis avant Endgame. Pour un parcours court : Iron Man, Captain America : First Avenger, Avengers, Captain America : Le Soldat de l'hiver, Les Gardiens de la Galaxie, Captain America : Civil War, Doctor Strange, Black Panther, Thor : Ragnarok, Captain Marvel, puis Infinity War et Endgame.",
    },
  ],
  sources: [
    { titre: "TheWrap, « Marvel Movies in Order: How to Watch the MCU Chronologically »", url: "https://www.thewrap.com/marvel-movies-in-order-how-to-watch/" },
    { titre: "Mental Floss, « How to Watch the Marvel Movies and TV Shows in Order »", url: "https://mentalfloss.com/article/648285/watch-marvel-movies-in-order" },
    { titre: "KultureGeek, « VisionQuest, la prochaine série Marvel, a maintenant une date de sortie », 2026", url: "https://kulturegeek.fr/news-352028/visionquest-marvel-date-sortie" },
    { titre: "Selectra, « Disney+ : les nouveautés d'octobre 2026 »", url: "https://selectra.info/telecom/actualites/marche/disney-plus-nouveautes-octobre-2026-calendrier" },
  ],
};
