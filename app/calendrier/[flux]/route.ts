import { headers } from "next/headers";
import { getAgendaTitre, getSortiesAVenir } from "@/lib/tmdb";
import { PLATEFORME_PAR_SLUG } from "@/lib/plateformes";
import { calendrierICS, type EvenementICS } from "@/lib/ics";
import { evenementFilm, evenementsSerie, evenementsSorties } from "@/lib/agenda";
import { agregerSortiesParJour } from "@/components/ListeSortiesParJour";
import { checkRateLimit, getIp } from "@/lib/rate-limit";
import { SITE_URL } from "@/lib/site";
import { toISO } from "@/lib/utils";
import type { MediaType } from "@/types";

export const dynamic = "force-dynamic";

/** Comme « Quel abonnement ce mois-ci ? » : au-delà, les titres en trop sont ignorés */
const MAX_TITRES = 60;
const PAQUET = 10;

/**
 * Calendriers à ajouter à son agenda (abonnement par adresse) :
 * - /calendrier/prochaines-sorties.ics : les sorties à venir de toutes les plateformes ;
 * - /calendrier/netflix.ics, … : celles d'une plateforme ;
 * - /calendrier/ma-liste.ics?t=serie-1399,film-27205 : les épisodes des séries et
 *   la sortie numérique des films de Ma liste. La liste vit dans le navigateur :
 *   elle est dans l'adresse, et n'est enregistrée nulle part.
 */
export async function GET(request: Request, { params }: { params: Promise<{ flux: string }> }) {
  const { flux } = await params;
  const nom = flux.endsWith(".ics") ? flux.slice(0, -4) : null;
  const maintenant = new Date();

  let calendrier: { nom: string; description: string; evenements: EvenementICS[] } | null = null;
  if (nom === "prochaines-sorties" || (nom && PLATEFORME_PAR_SLUG[nom])) {
    const pf = nom === "prochaines-sorties" ? undefined : PLATEFORME_PAR_SLUG[nom];
    const jours = agregerSortiesParJour(await getSortiesAVenir(), pf?.id);
    calendrier = {
      nom: pf ? `Sorties ${pf.nom} (StreamActu)` : "Sorties streaming (StreamActu)",
      description: `Nouvelles séries et films annoncés${pf ? ` sur ${pf.nom}` : ""} en France, quatre semaines à l'avance. ${SITE_URL}/${pf ? `${pf.slug}/` : ""}prochaines-sorties`,
      evenements: evenementsSorties(jours, SITE_URL),
    };
  } else if (nom === "ma-liste") {
    // Les agendas relisent le flux toutes les quelques heures : la limite ne gêne qu'un abus
    if (!checkRateLimit(`calendrier:${getIp(await headers())}`, 60, 60_000)) {
      return new Response("Trop de requêtes. Réessayez dans une minute.", { status: 429 });
    }
    const titres = (new URL(request.url).searchParams.get("t") ?? "")
      .split(",")
      .map((c) => /^(serie|film)-([1-9]\d{0,9})$/.exec(c.trim()))
      .filter((m): m is RegExpExecArray => m !== null)
      .map((m) => ({ type: m[1] as MediaType, id: Number(m[2]) }))
      .slice(0, MAX_TITRES);
    const aujourdhui = toISO(maintenant);
    const evenements: EvenementICS[] = [];
    for (let i = 0; i < titres.length; i += PAQUET) {
      const agendas = await Promise.all(titres.slice(i, i + PAQUET).map((t) => getAgendaTitre(t.type, t.id)));
      for (const a of agendas) {
        if (a?.type === "serie") evenements.push(...evenementsSerie(a, aujourdhui, SITE_URL));
        else if (a?.type === "film") evenements.push(...evenementFilm(a, SITE_URL));
      }
    }
    calendrier = {
      nom: "Ma liste (StreamActu)",
      description: `Les nouveaux épisodes des séries et la sortie des films de votre liste. ${SITE_URL}/ma-liste`,
      evenements,
    };
  }

  if (!calendrier) return new Response("Calendrier introuvable.", { status: 404 });

  return new Response(calendrierICS({ ...calendrier, maintenant }), {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `inline; filename="${flux}"`,
      "Cache-Control": "public, max-age=21600",
      "X-Robots-Tag": "noindex",
    },
  });
}
