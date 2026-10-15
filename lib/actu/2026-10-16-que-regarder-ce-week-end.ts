import type { Article } from "../actu";

/**
 * Données TMDB relevées le jeudi 2026-10-15 (calendrier du site : séries par
 * réseau d'origine et par plateforme en France, films par sortie numérique
 * française ; dates des épisodes par /tv/{id}/season/{n}). Relu et validé
 * par l'éditeur le 2026-10-15 : dates et plateformes françaises (VisionQuest
 * le mercredi 14, lendemain de la sortie américaine), films Canal+ et faits
 * extérieurs ci-dessous. Publication vendredi matin.
 *
 * Faits extérieurs à TMDB : Paul Bettany joue Vision dans les films Marvel
 * depuis 2015 ; Taylor Sheridan a créé Yellowstone ; Christophe Barratier a
 * réalisé Les Choristes ; Les Enfants de la Résistance adapte la bande
 * dessinée du même nom.
 */
export const ARTICLE_2026_10_16_WEEKEND: Article = {
  slug: "que-regarder-ce-week-end-16-octobre-2026",
  format: "week-end",
  titre: "Que regarder ce week-end : 16 au 18 octobre 2026",
  description:
    "VisionQuest sur Disney+, Tulsa King saison 4 sur Paramount+, Sacrifice sur Netflix : que regarder le week-end du 16 octobre, et les autres sorties.",
  chapo:
    "Marvel revient en série ce week-end sur les plateformes en France : VisionQuest, avec Paul Bettany et James Spader, a commencé mercredi sur Disney+. Sylvester Stallone reprend Tulsa King pour une quatrième saison sur Paramount+, Netflix sort Sacrifice de Romain Gavras, et Canal+ propose le film le mieux noté de la semaine, La Maison des Femmes.",
  publie: "2026-10-16",
  misAJour: "2026-10-16",
  brouillon: true,
  sections: [
    {
      titre: "VisionQuest, sur Disney+",
      oeuvre: { type: "serie", id: 213375 },
      blocs: [
        {
          p: "Les deux premiers épisodes sont en ligne en France depuis le mercredi 14 octobre. Une nouvelle version de Vision, qui a échappé à ceux qui voulaient en faire une arme, vit cachée ; quand sa tête est mise à prix, il fuit avec Thomas, un garçon mystérieux qui pourrait être la réincarnation de son fils, tout en résistant à l'influence d'Ultron, l'une des intelligences artificielles de son programme. Paul Bettany retrouve le rôle qu'il tient dans les films Marvel, face à James Spader en Ultron. C'est la série la mieux notée de la semaine : près de 9/10 sur TMDB, avec plus de 50 votes. Huit épisodes en tout : deux par semaine en octobre, puis un par semaine jusqu'à la mi-novembre.",
        },
      ],
    },
    {
      titre: "Tulsa King saison 4, sur Paramount+",
      oeuvre: { type: "serie", id: 153312 },
      blocs: [
        {
          p: "Le premier épisode arrive le vendredi 16 octobre, puis un chaque vendredi. Sylvester Stallone y joue Dwight Manfredi, dit « le Général », ancien de la mafia new-yorkaise exilé à Tulsa après vingt-cinq ans de prison, qui s'y est bâti sa propre « famille ». La série est créée par Taylor Sheridan, l'auteur de Yellowstone ; elle obtient 8,3/10 sur TMDB, avec plus de 2 800 votes. Dix épisodes sont prévus pour cette saison.",
        },
      ],
    },
    {
      titre: "Sacrifice, sur Netflix",
      oeuvre: { type: "film", id: 1284186 },
      blocs: [
        {
          p: "Le film de Romain Gavras sort sur Netflix le vendredi 16 octobre. Un gala de charité est interrompu par l'attaque d'un groupe de radicaux qui veut accomplir une prophétie. La distribution est la plus fournie de la semaine : Chris Evans, Anya Taylor-Joy, Vincent Cassel, Salma Hayek et John Malkovich. L'accueil des premiers spectateurs est mitigé (5,5/10 sur TMDB, une trentaine de votes) : un film d'action et de comédie à prendre comme tel. Il dure 1 h 43.",
        },
      ],
    },
    {
      titre: "La Maison des Femmes, sur Canal+",
      oeuvre: { type: "film", id: 1318417 },
      blocs: [
        {
          p: "Sorti en salle le 4 mars, le film de Mélisa Godet est arrivé sur Canal+ le mardi 13 octobre. Dans une maison des femmes, une équipe de soignantes accueille et accompagne chaque jour des femmes victimes de violences. Karin Viard, Lætitia Dosch, Oulaya Amamra et Eye Haïdara jouent les membres de l'équipe. C'est le film le mieux noté de la semaine : 8,1/10 sur TMDB, avec une cinquantaine de votes. Il dure 1 h 50.",
        },
      ],
    },
    {
      titre: "En famille : Les Enfants de la Résistance, sur Canal+",
      oeuvre: { type: "film", id: 1309400 },
      blocs: [
        {
          p: "Christophe Barratier, le réalisateur des Choristes, adapte la bande dessinée du même nom. Sous l'Occupation, trois enfants, François, Eusèbe et Lisa, entrent en résistance en plein cœur de la France : sabotages, messages cachés et évasions, sous le nez de l'ennemi. Gérard Jugnot et Artus sont aussi de l'aventure. Sorti en salle le 11 février, il arrive sur Canal+ le vendredi 16 octobre. Il dure 1 h 39.",
        },
      ],
    },
    {
      titre: "Et aussi cette semaine",
      blocs: [
        {
          ul: [
            "[Masterplan](/film/masterplan-1561726) (Prime Video, 16 octobre) : film de casse avec Stanley Tucci en voleur légendaire qui vise la Joconde, aidé de deux jeunes inconnus, Victor Belmondo et Simona Tabasco, qui découvrent qu'ils sont frère et sœur.",
            "[Tenzing : à la conquête de l'Everest](/film/tenzing-a-la-conquete-de-l-everest-1288069) (Apple TV+, 16 octobre) : le sherpa Tenzing Norgay et la première ascension de l'Everest, avec Tom Hiddleston en Edmund Hillary et Willem Dafoe.",
            "[L'Amour de ta vie](/film/l-amour-de-ta-vie-1381078) (Prime Video, 14 octobre) : drame romantique avec Margaret Qualley.",
            "[Opus](/film/opus-1202479) (Canal+, 17 octobre) : thriller horrifique avec Ayo Edebiri en jeune autrice invitée chez une pop star disparue depuis trente ans, jouée par John Malkovich.",
            "[Cocorico 2](/film/cocorico-2-1437939) (Canal+, 18 octobre) : Christian Clavier et Didier Bourdon, de nouveau réunis par des tests ADN.",
            "[Le piège](/serie/le-piege-283371) (Netflix, 13 octobre) : minisérie allemande en six épisodes, sur une autrice qui ne sort plus de chez elle depuis le meurtre de sa sœur et croit reconnaître le tueur à la télévision.",
            "[TYSON](/serie/tyson-335536) (Netflix, 13 octobre) : série documentaire en quatre épisodes sur Mike Tyson.",
            "[Slow Horses](/serie/slow-horses-95480) (Apple TV+) : avant-dernier épisode de la saison 6 le 14 octobre, la fin le 21.",
            "[Dark Matter](/serie/dark-matter-196322) (Apple TV+) : la saison 2 continue, un épisode chaque jeudi jusqu'au 29 octobre.",
            "[WAR](/serie/war-298852) (HBO Max) : Dominic West et Sienna Miller dans le divorce du siècle, un épisode chaque vendredi.",
            "[Avatar : Les Sept Refuges](/serie/avatar-les-sept-refuges-284833) et [MobLand](/serie/mobland-247718) (Paramount+) : nouveaux épisodes le vendredi 16 octobre.",
          ],
        },
        {
          p: "Tout ce qui sort chaque jour est sur les pages [Disney+](/disney-plus), [Paramount+](/paramount-plus), [Netflix](/netflix) et [Canal+](/canal-plus), et ce qui arrive dans les quatre prochaines semaines dans le [calendrier des sorties](/prochaines-sorties).",
        },
      ],
    },
  ],
};
