import type { Guide } from "../guides";

/**
 * Fonctionnement vérifié dans le code : app/calendrier/[flux]/route.ts
 * (prochaines-sorties.ics, {plateforme}.ics, ma-liste.ics?t=…, 60 titres au
 * plus), components/AjouterAgenda.tsx (lien webcal://, lien Google Agenda,
 * adresse https à coller). Chemins des réglages relevés le 2026-10-29.
 */
export const GUIDE_SORTIES_AGENDA: Guide = {
  slug: "sorties-dans-son-agenda",
  titre: "Ajouter les sorties streaming à son agenda",
  description:
    "S'abonner aux calendriers de StreamActu.fr pour voir les sorties séries et films dans Google Agenda, Apple Calendrier ou Outlook, mises à jour chaque jour.",
  chapo:
    "StreamActu.fr publie ses sorties sous forme de calendriers auxquels on s'abonne une fois depuis son agenda : un calendrier pour toutes les plateformes, un par plateforme, et un construit à partir de Ma liste. L'agenda les met à jour tout seul, sans compte ni application à installer.",
  publie: "2026-10-29",
  misAJour: "2026-10-29",
  sections: [
    {
      titre: "Un calendrier auquel on s'abonne",
      blocs: [
        {
          p: "Google Agenda, Apple Calendrier et Outlook savent s'abonner à un calendrier publié à une adresse, au format iCalendar (.ics). On ajoute l'adresse une fois ; ensuite, l'agenda va chercher les nouveautés à son rythme. Si une sortie est annoncée ou si une date change, l'agenda le reflète sans rien faire.",
        },
        {
          p: "C'est le même mécanisme que pour les jours fériés ou les vacances scolaires. Il se retire aussi simplement : se désabonner du calendrier efface tous ses événements d'un coup, sans toucher au reste de l'agenda.",
        },
      ],
    },
    {
      titre: "Les trois calendriers proposés",
      blocs: [
        {
          table: {
            entetes: ["Calendrier", "Contenu", "Où le trouver"],
            lignes: [
              ["Toutes les plateformes", "Nouvelles séries et nouveaux films annoncés en France, environ quatre semaines à l'avance", "[Prochaines sorties](/prochaines-sorties)"],
              ["Une plateforme", "Les mêmes sorties, limitées à Netflix, Prime Video, Disney+, Apple TV+, Canal+, HBO Max ou Paramount+", "Page des prochaines sorties de chaque plateforme, par exemple [Netflix](/netflix/prochaines-sorties)"],
              ["Ma liste", "Les nouveaux épisodes des séries suivies et la sortie numérique des films de la liste", "[Ma liste](/ma-liste)"],
            ],
          },
        },
        {
          p: "Le calendrier Ma liste a une particularité : la liste n'est enregistrée nulle part sur le serveur. Les titres sont écrits dans l'adresse du calendrier elle-même, au plus 60. Quand la liste a beaucoup changé, il faut donc ajouter à nouveau le calendrier depuis la page Ma liste pour qu'il suive.",
        },
      ],
    },
    {
      titre: "L'ajouter à son agenda",
      blocs: [
        {
          p: "Sur chaque page qui propose un calendrier, deux boutons font l'essentiel du travail : « Ajouter à mon agenda » ouvre l'agenda de l'appareil (Apple Calendrier, Outlook), et « Google Agenda » ouvre directement l'écran d'abonnement de Google. L'adresse du calendrier est aussi affichée, pour la coller à la main :",
        },
        {
          ul: [
            "Google Agenda, sur ordinateur : bouton « + » à côté de « Autres agendas », puis « À partir de l'URL ».",
            "iPhone et iPad : Réglages, Calendrier, Comptes, Ajouter un compte, Autre, puis « Ajouter un calendrier avec abonnement ».",
            "Outlook : Ajouter un calendrier, puis « S'abonner à partir du web ».",
          ],
        },
        {
          p: "Un calendrier ajouté dans Google Agenda sur ordinateur apparaît ensuite sur le téléphone connecté au même compte. Choisir une couleur à part pour ce calendrier aide à distinguer les sorties des rendez-vous.",
        },
      ],
    },
    {
      titre: "Ce qu'il faut savoir",
      blocs: [
        {
          ul: [
            "Les mises à jour ne sont pas instantanées : StreamActu.fr actualise les sorties chaque jour, et chaque agenda relit le calendrier à son propre rythme. Google Agenda peut avoir jusqu'à un jour de retard.",
            "Les dates sont celles annoncées en France. Une plateforme peut avancer ou décaler une sortie ; le calendrier suit, avec ce délai.",
            "Seules les nouveautés figurent dans les calendriers, pas les départs de catalogue.",
            "Les calendriers sont gratuits et ne demandent aucun compte. Ils ne contiennent aucune publicité.",
          ],
        },
      ],
    },
  ],
  faq: [
    {
      q: "Comment voir les sorties Netflix dans Google Agenda ?",
      r: "Sur la page des prochaines sorties Netflix de StreamActu.fr, le bouton « Google Agenda » ouvre l'écran d'abonnement de Google. Le calendrier se met ensuite à jour tout seul, avec parfois un jour de retard.",
    },
    {
      q: "Le calendrier Ma liste se met-il à jour quand j'ajoute un titre ?",
      r: "Non : les titres sont écrits dans l'adresse du calendrier. Après des changements importants dans Ma liste, il faut ajouter à nouveau le calendrier depuis la page Ma liste.",
    },
    {
      q: "Comment supprimer un calendrier de sorties ?",
      r: "En se désabonnant du calendrier dans les réglages de son agenda. Tous ses événements disparaissent, sans effet sur les autres calendriers.",
    },
  ],
};
