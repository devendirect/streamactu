import { SITE_URL } from "@/lib/site";

/**
 * « Ajouter à mon agenda » : abonnement par adresse à un calendrier
 * /calendrier/*.ics. webcal:// ouvre l'agenda de l'appareil (Apple
 * Calendrier, Outlook) ; Google Agenda a son propre lien. Sans état : utilisé
 * côté serveur (pages sorties) et côté client (Ma liste).
 */
export default function AjouterAgenda({ chemin, texte }: { chemin: string; texte: string }) {
  const https = `${SITE_URL}${chemin}`;
  const webcal = https.replace(/^https?:/, "webcal:");
  return (
    <div className="rounded-lg border border-trait bg-surface px-4 py-3.5">
      <p className="text-[15px] font-semibold text-texte">{texte}</p>
      <div className="mt-2.5 flex flex-wrap gap-2">
        <a href={webcal} className="puce">
          Ajouter à mon agenda
        </a>
        <a
          href={`https://calendar.google.com/calendar/render?cid=${encodeURIComponent(webcal)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="puce"
        >
          Google Agenda
        </a>
      </div>
      <p className="mt-2.5 text-[13px] text-texte-2">
        L&apos;agenda se met à jour tout seul, à son rythme : Google Agenda peut avoir un jour de retard. Adresse à coller
        ailleurs : <span className="break-all select-all">{https}</span>
      </p>
    </div>
  );
}
