import type { Article } from "../actu";

/**
 * Brouillon du 2026-10-10 (premier article « mois »), données TMDB relevées
 * le 10 octobre : séries par réseau d'origine de la plateforme et dates des
 * épisodes par /tv/{id}/season/{n} ; films par sortie numérique française
 * (note de sortie = plateforme).
 *
 * À faire le lundi 26 octobre, avant publication le mardi 27 :
 * - refaire le relevé TMDB (scratchpad mensuel/releve.mjs) et lire les
 *   annonces officielles de novembre de chaque plateforme (films sous licence,
 *   absents de TMDB) ; noter ici la source de chaque fait extérieur à TMDB ;
 * - Canal+ : aucune nouveauté dans TMDB au 10 octobre, section à écrire depuis
 *   l'annonce officielle (ou rubrique absente si rien de notable) ;
 * - vérifier la disponibilité en France : The Gilded Age (date américaine du
 *   dimanche, HBO Max France ?), L'impératrice remariée, Rivals ;
 * - candidats écartés faute de certitude sur la France : The Chosen saison 6
 *   (Prime Video aux États-Unis, 15 novembre), Last Week Tonight ;
 * - `brouillon: false`, misAJour, puis mise à jour vers le 15 novembre.
 *
 * Faits extérieurs à TMDB : Julian Fellowes a créé Downton Abbey ; Blade
 * Runner 2099 se situe dans l'univers des films Blade Runner ; la famille du
 * crime de MobLand est londonienne. (FTX, Sam Bankman-Fried et Caroline
 * Ellison figurent dans le résumé TMDB de The Altruists.)
 */
export const ARTICLE_2026_10_27_NOVEMBRE: Article = {
  slug: "nouveautes-streaming-novembre-2026",
  format: "mois",
  titre: "Nouveautés Netflix, Prime Video, Disney+ : novembre 2026",
  description:
    "Les Anneaux de pouvoir, Percy Jackson, Black Doves, Blade Runner 2099 : les nouveautés de novembre 2026 sur Netflix, Prime Video, Disney+ et les autres.",
  chapo:
    "En novembre 2026, Prime Video lance la saison 3 des Anneaux de pouvoir le 11 et Blade Runner 2099 le 25, Disney+ la saison 3 de Percy Jackson le 20, et Netflix la saison 2 de Black Doves le 5. Apple TV+ ramène Stick, HBO Max The Gilded Age, et Paramount+ termine la saison 2 de MobLand.",
  publie: "2026-10-27",
  misAJour: "2026-10-27",
  brouillon: true,
  sections: [
    // ── Netflix ──
    {
      rubrique: "Netflix",
      titre: "Black Doves, saison 2",
      oeuvre: { type: "serie", id: 225385 },
      blocs: [
        {
          p: "Six épisodes, tous mis en ligne le jeudi 5 novembre. La série d'espionnage britannique de Joe Barton suit une espionne infiltrée comme épouse d'un homme politique et le tueur à gages, vieil ami, qui l'aide à venger son amant. La série tient 7/10 sur TMDB, avec plus de 400 votes.",
        },
      ],
    },
    {
      rubrique: "Netflix",
      titre: "The Altruists",
      oeuvre: { type: "serie", id: 308007 },
      blocs: [
        {
          p: "Nouvelle série en huit épisodes, tous disponibles le jeudi 19 novembre. Graham Moore raconte l'histoire de Sam Bankman-Fried, cofondateur de la plateforme de cryptomonnaies FTX, et de sa compagne Caroline Ellison, de leur ambition de bouleverser la finance jusqu'à une fraude de 36 milliards de dollars.",
        },
      ],
    },
    {
      rubrique: "Netflix",
      titre: "The Hunting Wives, saison 2",
      oeuvre: { type: "serie", id: 244447 },
      blocs: [
        {
          p: "Les huit épisodes arrivent ensemble le jeudi 26 novembre. Le drame à suspense de Rebecca Perry Cutter retrouve le club des riches épouses d'une petite ville du Texas, où une citadine s'était laissé entraîner par la charismatique Margot Banks.",
        },
      ],
    },
    {
      rubrique: "Netflix",
      titre: "Et aussi sur Netflix",
      blocs: [
        {
          ul: [
            "[Heartland](/film/heartland-1543469) (vendredi 13 novembre) : film à suspense de Shana Feste avec Jessica Chastain, en ancienne star de la country qui enquête sur la disparition de sa nièce.",
            "[Sœurs de sort](/film/soeurs-de-sort-1595124) (vendredi 20 novembre) : film d'animation qui raconte Cendrillon du point de vue d'une de ses demi-sœurs, avec les voix originales d'Ali Wong et Amanda Seyfried (1 h 32).",
            "[JoJo's Bizarre Adventure](/serie/jojo-s-bizarre-adventure-45790) : un nouvel épisode chaque vendredi.",
          ],
        },
        {
          p: "La liste complète, complétée au fil du mois : [nouveautés Netflix de novembre 2026](/netflix/novembre-2026).",
        },
      ],
    },

    // ── Prime Video ──
    {
      rubrique: "Prime Video",
      titre: "Le Seigneur des anneaux : Les Anneaux de pouvoir, saison 3",
      oeuvre: { type: "serie", id: 84773 },
      blocs: [
        {
          p: "Huit épisodes : quatre le mercredi 11 novembre, puis deux le 18 et les deux derniers le 25. La série de Patrick McKay et John D. Payne raconte la résurgence du mal en Terre du Milieu, de Númenor au Lindon et aux Montagnes de Brume. Elle tient 7,2/10 sur TMDB, avec près de 4 000 votes.",
        },
      ],
    },
    {
      rubrique: "Prime Video",
      titre: "Blade Runner 2099",
      oeuvre: { type: "serie", id: 171802 },
      blocs: [
        {
          p: "Les huit épisodes sont attendus le mercredi 25 novembre. Dans le Los Angeles de 2099, Cora, qui a passé sa vie en cavale sous de fausses identités, en prend une dernière pour protéger son frère et doit faire équipe avec Olwen, une Blade Runner en fin de vie. Une série créée par Silka Luisa, dans l'univers des films.",
        },
      ],
    },
    {
      rubrique: "Prime Video",
      titre: "Et aussi sur Prime Video",
      blocs: [
        {
          ul: [
            "[L'Assassin](/serie/l-assassin-262352), saison 2 (vendredi 6 novembre) : six épisodes de la série britannique sur une tueuse à gages retraitée, rattrapée par son passé avec son fils.",
            "[Campus Drivers](/serie/campus-drivers-303044) (vendredi 6 novembre) : série française en six épisodes, une romance sur un campus universitaire.",
            "[Madden](/film/madden-1131943) (mercredi 18 novembre) : film de David O. Russell sur John Madden, entraîneur et voix du football américain, avec Nicolas Cage et Christian Bale.",
            "[Menteurs parfaits](/film/menteurs-parfaits-1568060) (vendredi 20 novembre) : film espagnol, une étudiante infiltre le cercle de trois frères tout-puissants pour venger son frère.",
          ],
        },
        {
          p: "La liste complète, complétée au fil du mois : [nouveautés Prime Video de novembre 2026](/prime-video/novembre-2026).",
        },
      ],
    },

    // ── Disney+ ──
    {
      rubrique: "Disney+",
      titre: "Percy Jackson et les Olympiens, saison 3",
      oeuvre: { type: "serie", id: 103540 },
      blocs: [
        {
          p: "Deux épisodes le vendredi 20 novembre, puis un par semaine jusqu'au 1er janvier (huit en tout). L'adaptation des romans de Rick Riordan, qui cosigne la série, tient 7,2/10 sur TMDB, avec plus de 800 votes.",
        },
      ],
    },
    {
      rubrique: "Disney+",
      titre: "L'impératrice remariée",
      oeuvre: { type: "serie", id: 279246 },
      blocs: [
        {
          p: "Série sud-coréenne en dix épisodes : quatre le mercredi 4 novembre, puis deux chaque mercredi jusqu'au 25. Quand l'empereur demande le divorce pour épouser sa maîtresse, l'impératrice Navier refuse de céder et noue une alliance avec un prince d'un royaume voisin.",
        },
      ],
    },
    {
      rubrique: "Disney+",
      titre: "Et aussi sur Disney+",
      blocs: [
        {
          ul: [
            "[Rivals](/serie/rivals-208921), saison 2 : trois épisodes le mercredi 11 novembre, puis un chaque mercredi jusqu'au 2 décembre.",
          ],
        },
        {
          p: "La liste complète, complétée au fil du mois : [nouveautés Disney+ de novembre 2026](/disney-plus/novembre-2026).",
        },
      ],
    },

    // ── Apple TV+ ──
    {
      rubrique: "Apple TV+",
      titre: "Stick, saison 2",
      oeuvre: { type: "serie", id: 248830 },
      blocs: [
        {
          p: "Deux épisodes le mardi 3 novembre, puis un chaque mardi jusqu'au 29 décembre (dix en tout). La comédie de Jason Keller suit un ancien espoir du golf, ruiné, qui mise tout sur un jeune prodige. La série tient 7,3/10 sur TMDB.",
        },
      ],
    },
    {
      rubrique: "Apple TV+",
      titre: "12 12 12",
      oeuvre: { type: "serie", id: 254630 },
      blocs: [
        {
          p: "Nouvelle série de braquage en huit épisodes : deux le jeudi 12 novembre, puis un chaque jeudi jusqu'au 24 décembre. Un braquage se prépare en 12 mois et s'exécute en 12 heures, et un braqueur qui n'est pas arrêté dans les 12 jours ne le sera jamais : sur trois époques, un agent du FBI et un criminel se poursuivent à travers l'Europe.",
        },
      ],
    },
    {
      rubrique: "Apple TV+",
      titre: "Et aussi sur Apple TV+",
      blocs: [
        {
          ul: [
            "[Nocturne](/serie/nocturne-292741) : la série policière commencée le 29 octobre continue chaque jeudi jusqu'au 24 décembre.",
            "[Awkwafina : la cheffe improbable](/serie/awkwafina-la-cheffe-improbable-306179) (vendredi 6 novembre) : documentaire culinaire en huit épisodes.",
            "[Being Heumann](/film/being-heumann-1050981) (vendredi 13 novembre) : film de Sian Heder sur la militante des droits des personnes handicapées Judy Heumann (2 h 07).",
            "[Warrior Kid](/film/warrior-kid-1280115) (mercredi 25 novembre) : film familial de McG avec Chris Pratt (1 h 46).",
          ],
        },
        {
          p: "La liste complète, complétée au fil du mois : [nouveautés Apple TV+ de novembre 2026](/apple-tv-plus/novembre-2026).",
        },
      ],
    },

    // ── HBO Max ──
    {
      rubrique: "HBO Max",
      titre: "The Gilded Age, saison 4",
      oeuvre: { type: "serie", id: 81723 },
      blocs: [
        {
          p: "Huit épisodes, un par semaine du dimanche 1er novembre au 20 décembre (dates américaines). Julian Fellowes, le créateur de Downton Abbey, poursuit sa chronique de la haute société new-yorkaise des années 1880. La série tient 7,7/10 sur TMDB.",
        },
      ],
    },
    {
      rubrique: "HBO Max",
      titre: "Et aussi sur HBO Max",
      blocs: [
        {
          ul: [
            "[Furia](/serie/furia-280880), saison 2 : la comédie noire espagnole se termine le vendredi 27 novembre.",
          ],
        },
        {
          p: "La liste complète, complétée au fil du mois : [nouveautés HBO Max de novembre 2026](/hbo-max/novembre-2026).",
        },
      ],
    },

    // ── Paramount+ ──
    {
      rubrique: "Paramount+",
      titre: "MobLand, fin de la saison 2",
      oeuvre: { type: "serie", id: 247718 },
      blocs: [
        {
          p: "Les trois derniers épisodes de la saison sortent les vendredis 6, 13 et 20 novembre. La série de Ronan Bennett suit Harry Da Souza, l'homme qui règle les problèmes d'une famille du crime londonienne en guerre contre une autre. Elle tient 8,5/10 sur TMDB, avec plus de 1 000 votes.",
        },
      ],
    },
    {
      rubrique: "Paramount+",
      titre: "Et aussi sur Paramount+",
      blocs: [
        {
          ul: ["[Tulsa King](/serie/tulsa-king-153312), saison 4 : un épisode chaque vendredi jusqu'au 18 décembre."],
        },
        {
          p: "La liste complète, complétée au fil du mois : [nouveautés Paramount+ de novembre 2026](/paramount-plus/novembre-2026).",
        },
      ],
    },

    // ── Hors abonnement ──
    {
      titre: "En achat et location : Spider-Man : Brand New Day",
      oeuvre: { type: "film", id: 969681 },
      blocs: [
        {
          p: "Sorti au cinéma le 29 juillet, le film de Destin Daniel Cretton avec Tom Holland arrive en achat et location numériques le jeudi 26 novembre. Aucune plateforme d'abonnement n'est encore annoncée : il sera ajouté ici dès qu'elle le sera.",
        },
      ],
    },
  ],
};
