import { headers } from "next/headers";
import { getDispoTitre } from "@/lib/tmdb";
import { checkRateLimit, getIp } from "@/lib/rate-limit";
import type { MediaType } from "@/types";

export const dynamic = "force-dynamic";

/** Au-delà, les titres en trop sont ignorés (protège le quota TMDB) */
const MAX_TITRES = 60;
/** Appels TMDB en parallèle par paquet */
const PAQUET = 10;

/**
 * Disponibilités des titres de Ma liste, pour « Quel abonnement ce mois-ci ? ».
 * La liste vit dans le navigateur : elle passe dans la requête et n'est
 * enregistrée nulle part. Corps : { titres: [{ type: "serie" | "film", id }] }.
 * Réponse : { "serie-1399": { plateformes: [8], prochainEpisode: "2026-11-03" | null }, … }
 */
export async function POST(request: Request) {
  const ip = getIp(await headers());
  // La liste change rarement : 10 calculs par minute suffisent largement
  if (!checkRateLimit(`dispo-liste:${ip}`, 10, 60_000)) {
    return new Response("Trop de requêtes. Réessayez dans une minute.", { status: 429 });
  }

  let titres: { type: MediaType; id: number }[];
  try {
    const corps = (await request.json()) as { titres?: unknown };
    if (!Array.isArray(corps.titres)) throw new Error();
    titres = corps.titres
      .filter(
        (t): t is { type: MediaType; id: number } =>
          typeof t === "object" &&
          t !== null &&
          ((t as { type: unknown }).type === "serie" || (t as { type: unknown }).type === "film") &&
          Number.isInteger((t as { id: unknown }).id) &&
          (t as { id: number }).id > 0
      )
      .slice(0, MAX_TITRES);
  } catch {
    return new Response("Requête invalide.", { status: 400 });
  }

  const reponse: Record<string, { plateformes: number[]; prochainEpisode: string | null }> = {};
  for (let i = 0; i < titres.length; i += PAQUET) {
    const paquet = titres.slice(i, i + PAQUET);
    const dispos = await Promise.all(paquet.map((t) => getDispoTitre(t.type, t.id)));
    paquet.forEach((t, j) => {
      const d = dispos[j];
      if (d) reponse[`${t.type}-${t.id}`] = d;
    });
  }

  return Response.json(reponse, { headers: { "Cache-Control": "private, no-store" } });
}
