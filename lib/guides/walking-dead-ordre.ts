import type { Guide, OeuvreGuide } from "../guides";

/**
 * Données TMDB relevées le 2026-10-09 : titres, dates, nombre d'épisodes,
 * plateformes en France. Ce jour-là : The Walking Dead sur Netflix, Prime
 * Video, Disney+ et HBO Max ; Fear the Walking Dead et World Beyond sur Prime
 * Video ; Daryl Dixon sur Paramount+ ; The Ones Who Live sur la chaîne
 * Paramount+ de Prime Video ; Dead City sur aucune des sept plateformes
 * suivies (Molotov, SFR Play, chaîne OCS de Prime Video) ; Tales of the
 * Walking Dead sur aucune. Les plateformes affichées dans les listes sont
 * relues chaque jour sur les fiches : c'est tout l'intérêt de ce guide.
 *
 * Faits extérieurs à TMDB (voir `sources`) : ordre chronologique pratique
 * (Fear 1-3, TWD 1-8, Fear 4-8, TWD 9 épisodes 1-5, World Beyond, fin de TWD,
 * puis The Ones Who Live, Daryl Dixon, Dead City) ; passage de Morgan de la
 * saison 8 de The Walking Dead à la saison 4 de Fear.
 *
 * Révision : trimestrielle (les droits de ces séries changent souvent).
 */

const TWD: OeuvreGuide = { type: "serie", id: 1402, titre: "The Walking Dead", repere: "" };
const FEAR: OeuvreGuide = { type: "serie", id: 62286, titre: "Fear the Walking Dead", repere: "" };
const WORLD_BEYOND: OeuvreGuide = { type: "serie", id: 94305, titre: "The Walking Dead : World Beyond", repere: "" };
const TALES: OeuvreGuide = { type: "serie", id: 136248, titre: "Tales of the Walking Dead", repere: "" };
const DEAD_CITY: OeuvreGuide = { type: "serie", id: 194583, titre: "The Walking Dead : Dead City", repere: "" };
const DARYL: OeuvreGuide = { type: "serie", id: 211684, titre: "The Walking Dead : Daryl Dixon", repere: "" };
const ONES_WHO_LIVE: OeuvreGuide = { type: "serie", id: 206586, titre: "The Walking Dead : The Ones Who Live", repere: "" };

export const GUIDE_WALKING_DEAD_ORDRE: Guide = {
  slug: "walking-dead-ordre",
  titre: "The Walking Dead dans l'ordre : séries et plateformes",
  description:
    "Les séries The Walking Dead dans l'ordre de sortie et dans l'ordre de l'histoire, avec la plateforme de chaque série en France, vérifiée chaque jour.",
  chapo:
    "L'univers The Walking Dead compte sept séries, éparpillées entre plusieurs plateformes en France : la série principale est la plus largement disponible, ses dérivées se partagent entre Prime Video, Paramount+ et des services que StreamActu.fr ne suit pas. Pour une première fois, commencez par les onze saisons de The Walking Dead, puis les séries qui en prolongent l'histoire.",
  publie: "2026-10-09",
  misAJour: "2026-10-09",
  sections: [
    {
      titre: "Les séries dans l'ordre de sortie",
      blocs: [
        {
          p: "La plateforme indiquée pour chaque série est relevée chaque jour : les droits des séries The Walking Dead changent souvent de mains en France, et une série peut se trouver sur plusieurs plateformes à la fois.",
        },
        {
          ordre: "sortie",
          oeuvres: [
            { ...TWD, repere: "2010 à 2022. La série principale : 11 saisons, 177 épisodes." },
            { ...FEAR, repere: "2015 à 2023. Commence au tout début de l'épidémie, à Los Angeles : 8 saisons." },
            { ...WORLD_BEYOND, repere: "2020 à 2021. Deux saisons sur la première génération qui a grandi après l'épidémie." },
            { ...TALES, facultatif: true, repere: "2022. Anthologie de six épisodes indépendants." },
            { ...DEAD_CITY, repere: "À partir de 2023. Maggie et Negan à New York, après la fin de la série principale." },
            { ...DARYL, repere: "À partir de 2023. Daryl en France, après la fin de la série principale." },
            { ...ONES_WHO_LIVE, repere: "2024. Six épisodes sur Rick et Michonne." },
          ],
        },
      ],
    },
    {
      titre: "Toute l'histoire dans l'ordre",
      blocs: [
        {
          p: "Les séries se chevauchent, et l'ordre de l'histoire oblige à passer de l'une à l'autre en cours de saison. Voici l'ordre le plus couramment conseillé ; c'est un ordre pratique, pas un découpage officiel, car les retours en arrière et les sauts dans le temps empêchent un rangement parfait.",
        },
        {
          ordre: "histoire",
          oeuvres: [
            { ...FEAR, portion: "Saisons 1 à 3", repere: "Les premiers jours de l'épidémie." },
            { ...TWD, portion: "Saisons 1 à 8", repere: "De l'hôpital à la guerre contre Negan." },
            { ...FEAR, portion: "Saisons 4 à 8", repere: "Morgan quitte The Walking Dead à la fin de la saison 8 et arrive dans Fear au début de la saison 4." },
            { ...TWD, portion: "Saison 9, épisodes 1 à 5", repere: "Le départ de Rick." },
            { ...WORLD_BEYOND, portion: "Les deux saisons", repere: "Elles en disent beaucoup sur la CRM, l'organisation militaire que l'on retrouve ensuite." },
            { ...TWD, portion: "Saison 9, épisode 6, à la saison 11", repere: "Après un saut de six ans, jusqu'à la fin de la série." },
            { ...ONES_WHO_LIVE, repere: "Ce que sont devenus Rick et Michonne." },
            { ...DARYL, repere: "Daryl en France." },
            { ...DEAD_CITY, repere: "Maggie et Negan à New York." },
          ],
        },
        {
          p: "Tales of the Walking Dead, faite d'épisodes indépendants, se regarde à n'importe quel moment.",
        },
      ],
    },
    {
      titre: "Par où commencer",
      blocs: [
        {
          ul: [
            "Une première fois : The Walking Dead seule, du début à la fin. Les séries dérivées ne sont pas nécessaires pour la suivre.",
            "Pour la suite : The Ones Who Live, Daryl Dixon et Dead City reprennent chacune un ou deux personnages de la série principale, et peuvent se voir dans n'importe quel ordre.",
            "Pour l'épidémie vue de la ville : les trois premières saisons de Fear the Walking Dead, assez indépendantes du reste.",
          ],
        },
      ],
    },
  ],
  faq: [
    {
      q: "Dans quel ordre regarder les séries The Walking Dead ?",
      r: "Pour une première fois, dans l'ordre de sortie, en commençant par la série principale. Pour suivre l'histoire : Fear the Walking Dead saisons 1 à 3, The Walking Dead saisons 1 à 8, Fear saisons 4 à 8, puis la fin de The Walking Dead avec World Beyond, et enfin The Ones Who Live, Daryl Dixon et Dead City.",
    },
    {
      q: "Où regarder The Walking Dead en streaming en France ?",
      r: "La série principale est la plus largement disponible ; ses séries dérivées sont réparties entre Prime Video, Paramount+ et d'autres services. Les droits changent souvent : la fiche de chaque série sur StreamActu.fr indique chaque jour où elle est disponible par abonnement.",
    },
    {
      q: "Faut-il regarder Fear the Walking Dead ?",
      r: "Non, la série principale se suit sans elle. Ses trois premières saisons montrent le début de l'épidémie, et le personnage de Morgan relie les deux séries à partir de la saison 4 de Fear.",
    },
  ],
  sources: [
    { titre: "JustWatch, « How to Watch The Walking Dead Franchise in Order »", url: "https://www.justwatch.com/in/guide/the-walking-dead-shows-in-order" },
    { titre: "Inverse, « Fear the Walking Dead season 4 premiere: Morgan crossover timeline »", url: "https://inverse.com/article/43702-fear-the-walking-dead-season-4-premiere-recap-morgan-crossover-timeline" },
  ],
};
