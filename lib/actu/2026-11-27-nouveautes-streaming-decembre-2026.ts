import type { Article } from "../actu";

/**
 * BROUILLON du 2026-11-20 (deuxième article « mois »), relevé TMDB du jour :
 * séries par réseau d'origine et par plateforme en France, films par sortie
 * numérique FR, dates d'épisodes par /tv/{id}/season/{n}. Revérifié le
 * vendredi 27/11 (relevé TMDB refait, listes de décembre des plateformes),
 * à publier ce jour après relecture (brouillon: false).
 *
 * Revérification du 27/11 :
 * - Toutes les dates TMDB des titres cités sont inchangées. Ray Gunn passe à
 *   120 min (2 h).
 * - Emily in Paris : dernière saison, confirmée par Netflix (Tudum, annonce du
 *   21 mai), 10 épisodes le 24 décembre (journaldugeek.com du 12/11).
 * - Maxton Hall : dernière saison selon gameblog.fr et tv-direct.fr.
 * - Loups Garous saison 3 : 15 joueurs (et non 13), vendredi 4 décembre à
 *   21 h, deux épisodes puis un par semaine ; les deux premiers gratuits sur
 *   l'application Canal+ (journaldugeek.com du 09/11, serie-news.com, ozap.com).
 * - Ajouts : La Cage saison 2 (Netflix, 16/12, TMDB + listes jechange.fr,
 *   dlgaming.fr), Meurtres à Åre saison 2 (Netflix, 27/12, TMDB), Jumpers
 *   (Disney+, 4/12, serie-news.com, sortiraparis.com, page Disney+).
 * - Écartés : Validé saison 3 sur Netflix le 9/12 et Astérix et Obélix : Au
 *   service de Sa Majesté le 23/12 (une liste seulement, rien de confirmé),
 *   Le Conte de deux cités (Prime Video le 18/12, une source), Fury-Joshua en
 *   direct le 11/12 (sport, hors format).
 *
 * À vérifier à la reprise (rien n'est confirmé par une annonce officielle) :
 * - Trinity (Netflix), 7 épisodes le 1er décembre : confirmé le 20/11 par
 *   whats-on-netflix.com et Rotten Tomatoes (7 épisodes, réduits de 8) ;
 *   pas de communiqué Netflix France lu.
 * - Orgueil et Préjugés (Netflix), 6 épisodes le 3 décembre : TMDB seul.
 * - Emily in Paris saison 6 : 10 épisodes le 24 décembre (TMDB, gameblog.fr).
 *   Une source la dit « dernière saison » : non reprise ici.
 * - Les Nouvelles Mésaventures de Cliff Booth (Netflix) : 23 décembre (TMDB,
 *   gameblog.fr), durée TMDB 141 min.
 * - Maxton Hall saison 3 (Prime Video) : 2 épisodes le mercredi 9, 2 le 16, 2 le 23.
 * - L'Homme à la Hotte (Prime Video), film de Noël : 2 décembre (TMDB), durée
 *   TMDB à 0 min : non citée.
 * - Only Murders in the Building saison 6 (Disney+) : le mardi 8 décembre en
 *   France comme aux États-Unis, confirmé par Disney (press.disney.co.uk) ;
 *   saison située à Londres. Nombre d'épisodes non confirmé (TMDB : 1 daté).
 *   Journal d'un dégonflé Noël (Disney+) : 4 décembre (TMDB seul).
 * - Bad Monkey saison 2 (Apple TV) : mercredi 2 décembre, un épisode par semaine
 *   jusqu'au final du 3 février (sortiraparis.com, tvline.com, mactech.com).
 *   TMDB disait le 1er (date américaine) : corrigé.
 * - Alice (HBO Max) : trois épisodes le 4 décembre, trois le 11 (serie-news.com
 *   du 15/11) ; diffusion ensuite sur France Télévisions en 2027.
 * - Harry Potter (HBO Max) : 25 décembre, un épisode par semaine, huit épisodes
 *   (serie-news.com du 22/09, jechange.fr, geekslands.fr) ; heure de mise en
 *   ligne française non annoncée.
 * - Loups garous saison 3 (Canal+) : 4 décembre (TMDB, FR: Canal+).
 */
export const ARTICLE_2026_11_27_DECEMBRE: Article = {
  slug: "nouveautes-streaming-decembre-2026",
  format: "mois",
  titre: "Nouveautés Netflix, Prime Video, Disney+ : décembre 2026",
  description:
    "Harry Potter, Emily in Paris, Trinity, Alice, Only Murders : les nouveautés de décembre 2026 sur Netflix, Prime Video, Disney+ et les autres.",
  chapo:
    "En décembre 2026, Netflix lance Trinity le 1er, Orgueil et Préjugés le 3, Les Nouvelles Mésaventures de Cliff Booth le 23 et la sixième et dernière saison d'Emily in Paris le 24. HBO Max commence Alice le 4 et la série Harry Potter le 25, Disney+ ramène Only Murders in the Building, et Prime Video la saison 3 de Maxton Hall.",
  publie: "2026-11-27",
  misAJour: "2026-11-27",
  brouillon: false,
  sections: [
    // ── Netflix ──
    {
      rubrique: "Netflix",
      titre: "Trinity",
      oeuvre: { type: "serie", id: 294607 },
      blocs: [
        {
          p: "Nouvelle série en sept épisodes, tous disponibles le mardi 1er décembre. Le créateur de Bodyguard, Jed Mercurio, suit une officière de la Marine qui entame une relation avec le secrétaire à la Défense, ce qui la propulse dans un monde d'intrigues politiques. Gugu Mbatha-Raw et Richard Madden mènent la distribution.",
        },
      ],
    },
    {
      rubrique: "Netflix",
      titre: "Orgueil et Préjugés",
      oeuvre: { type: "serie", id: 288672 },
      blocs: [
        {
          p: "Les six épisodes sont attendus le jeudi 3 décembre. Dolly Alderton adapte le roman de Jane Austen : Elizabeth Bennet, deuxième de cinq filles, doit faire un bon mariage pour que sa famille ne perde pas tout, et croise le bourru M. Darcy. Emma Corrin et Jack Lowden jouent le couple, avec Olivia Colman et Rufus Sewell en parents Bennet.",
        },
      ],
    },
    {
      rubrique: "Netflix",
      titre: "Emily in Paris, saison 6",
      oeuvre: { type: "serie", id: 82596 },
      blocs: [
        {
          p: "La sixième et dernière saison arrive le jeudi 24 décembre, avec ses dix épisodes d'un coup : Netflix a annoncé en mai que la série s'arrêterait là. La série de Darren Star suit Emily, une Américaine qui travaille dans le marketing à Paris. Lily Collins, Philippine Leroy-Beaulieu, Ashley Park et Lucas Bravo reprennent leurs rôles.",
        },
      ],
    },
    {
      rubrique: "Netflix",
      titre: "Et aussi sur Netflix",
      blocs: [
        {
          ul: [
            "[Les Nouvelles Mésaventures de Cliff Booth](/film/les-nouvelles-mesaventures-de-cliff-booth-1457866) (mercredi 23 décembre) : film de David Fincher avec Brad Pitt, huit ans après Once Upon a Time… in Hollywood, avec Cliff dans un nouveau rôle de fixateur de studio (2 h 21).",
            "[Ray Gunn](/film/ray-gunn-940009) (vendredi 18 décembre) : film d'animation de Brad Bird, dans un futur où humains et extraterrestres cohabitent ; le dernier détective privé humain enquête sur la fidélité d'une pop star (2 h).",
            "[La Cage](/serie/la-cage-230003), saison 2 (mercredi 16 décembre) : la série de Franck Gastambide sur le MMA revient.",
            "[Meurtres à Åre](/serie/meurtres-a-are-224021), saison 2 (dimanche 27 décembre) : le polar suédois revient avec six épisodes.",
            "[Selling Sunset](/serie/selling-sunset-87826), saison 10 (vendredi 4 décembre).",
          ],
        },
        {
          p: "La liste complète, complétée au fil du mois : [nouveautés Netflix de décembre 2026](/netflix/decembre-2026).",
        },
      ],
    },

    // ── Prime Video ──
    {
      rubrique: "Prime Video",
      titre: "Maxton Hall : Le Monde qui nous sépare, saison 3",
      oeuvre: { type: "serie", id: 250670 },
      blocs: [
        {
          p: "Troisième et dernière saison, en six épisodes : deux le mercredi 9 décembre, deux le 16 et les deux derniers le 23. La série allemande suit James Beaufort, héritier millionnaire d'un lycée privé, et Ruby Bell, boursière, nés d'un secret que Ruby découvre par hasard. Damian Hardung et Harriet Herbig-Matten jouent le couple.",
        },
      ],
    },
    {
      rubrique: "Prime Video",
      titre: "Et aussi sur Prime Video",
      blocs: [
        {
          ul: [
            "[L'Homme à la Hotte](/film/l-homme-a-la-hotte-1137888) (mercredi 2 décembre) : comédie de Noël d'Adam Shankman avec Arnold Schwarzenegger en Père Noël, dont la hotte est volée et qui monte un braquage avec une équipe de voleurs.",
            "[The Devil's Hour](/serie/the-devil-s-hour-157061), saison 3 (vendredi 4 décembre) : la série britannique avec Jessica Raine et Peter Capaldi.",
          ],
        },
        {
          p: "La liste complète, complétée au fil du mois : [nouveautés Prime Video de décembre 2026](/prime-video/decembre-2026).",
        },
      ],
    },

    // ── Disney+ ──
    {
      rubrique: "Disney+",
      titre: "Only Murders in the Building, saison 6",
      oeuvre: { type: "serie", id: 107113 },
      blocs: [
        {
          p: "La saison démarre le mardi 8 décembre, en France comme aux États-Unis, et se déroule pour la première fois à Londres. Steve Martin, Martin Short et Selena Gomez reprennent leurs rôles de trois voisins new-yorkais passionnés de faits divers. La série tient 8,4/10 sur TMDB, avec plus de 2 000 votes.",
        },
      ],
    },
    {
      rubrique: "Disney+",
      titre: "Et aussi sur Disney+",
      blocs: [
        {
          ul: [
            "[Jumpers](/film/jumpers-1327819) (vendredi 4 décembre) : le film Pixar sorti au cinéma en mars ; Mabel transfère sa conscience dans un robot-castor pour parler aux animaux et les rallier contre un maire qui menace leur forêt (1 h 44).",
            "[Journal d'un dégonflé Noël : Sauve qui peut !](/film/journal-d-un-degonfle-noel-sauve-qui-peut-1519780) (vendredi 4 décembre) : film d'animation où la famille Heffley s'envole vers un complexe hôtelier sur une île pour échapper au stress des fêtes (1 h 30).",
          ],
        },
        {
          p: "La liste complète, complétée au fil du mois : [nouveautés Disney+ de décembre 2026](/disney-plus/decembre-2026).",
        },
      ],
    },

    // ── Apple TV+ ──
    {
      rubrique: "Apple TV+",
      titre: "Bad Monkey, saison 2",
      oeuvre: { type: "serie", id: 130853 },
      blocs: [
        {
          p: "Dix épisodes, un chaque mercredi à partir du 2 décembre, jusqu'au final du 3 février. Vince Vaughn joue Andrew Yancy, un policier devenu inspecteur de restaurants dans le sud de la Floride, entraîné dans une affaire de corruption quand un touriste pêche un bras coupé. Et oui, il y a un singe. La série a été créée par Bill Lawrence.",
        },
        {
          p: "La liste complète, complétée au fil du mois : [nouveautés Apple TV+ de décembre 2026](/apple-tv-plus/decembre-2026).",
        },
      ],
    },

    // ── HBO Max ──
    {
      rubrique: "HBO Max",
      titre: "Harry Potter",
      oeuvre: { type: "serie", id: 224377 },
      blocs: [
        {
          p: "La première saison de la série, qui adapte à nouveau les romans de J.K. Rowling, est attendue le vendredi 25 décembre, avec un épisode par semaine. Dominic McLaughlin, Arabella Stanton et Alastair Stout jouent Harry, Hermione et Ron, avec John Lithgow en Dumbledore et Janet McTeer en McGonagall. Pour revoir les films avant, voir le guide [Harry Potter dans l'ordre](/guides/harry-potter-ordre).",
        },
      ],
    },
    {
      rubrique: "HBO Max",
      titre: "Alice",
      oeuvre: { type: "serie", id: 300398 },
      blocs: [
        {
          p: "Nouvelle série française en six épisodes : trois le vendredi 4 décembre, trois le 11. Elle suit Alice Guy, pionnière du cinéma, de Paris à New York : artiste, épouse, mère et entrepreneuse, qui lutte pour être reconnue. Bérénice Bejo joue Alice, avec Thibaut Évrard (Léon Gaumont), Oscar Lesage et Irène Jacob.",
        },
        {
          p: "La liste complète, complétée au fil du mois : [nouveautés HBO Max de décembre 2026](/hbo-max/decembre-2026).",
        },
      ],
    },

    // ── Canal+ ──
    {
      rubrique: "Canal+",
      titre: "Loups garous, saison 3",
      blocs: [
        {
          p: "Nouvelle saison le vendredi 4 décembre à 21 h, avec deux épisodes, puis un par semaine ; ces deux premiers épisodes sont gratuits sur l'application Canal+, même sans abonnement. Canal+ transforme Les Loups-Garous de Thiercelieux, le jeu de société, en expérience grandeur nature : quinze joueurs spécialistes de stratégie et de dissimulation s'affrontent en temps réel. Fary Lopes et Panayotis Pascot sont à l'origine de la série.",
        },
        {
          p: "La liste complète, complétée au fil du mois : [nouveautés Canal+ de décembre 2026](/canal-plus/decembre-2026).",
        },
      ],
    },
  ],
};
