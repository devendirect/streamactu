import { convaincseMoiStream } from "@/lib/anthropic";
import { getCached, setCached, streamFromCache } from "@/lib/pitch-cache";
import { checkRateLimit, getIp } from "@/lib/rate-limit";
import { getDetailFilm, getDetailSerie } from "@/lib/tmdb";
import { idDepuisSlug } from "@/lib/utils";
import { headers } from "next/headers";

export const runtime = "nodejs";

const SLUG_VALIDE = /^[a-z0-9-]{3,120}$/;

export async function POST(request: Request) {
  const ip = getIp(await headers());

  if (!checkRateLimit(`convaincs:${ip}`, 10, 60_000)) {
    return new Response("Trop de requêtes. Réessayez dans une minute.", { status: 429 });
  }

  let body: { slug?: unknown; type?: unknown };
  try {
    body = await request.json();
  } catch {
    return new Response("Corps de requête invalide.", { status: 400 });
  }

  const slug = typeof body.slug === "string" ? body.slug : "";
  const type = body.type === "film" || body.type === "serie" ? body.type : null;
  if (!type || !SLUG_VALIDE.test(slug)) {
    return new Response("Paramètres invalides.", { status: 400 });
  }
  const id = idDepuisSlug(slug);
  if (!id) {
    return new Response("Paramètres invalides.", { status: 400 });
  }

  // Les données du pitch sont reconstruites côté serveur depuis le cache TMDB :
  // le client ne peut ni fournir un faux synopsis (injection de prompt) ni
  // empoisonner le cache d'une fiche avec un texte manipulé.
  let contenu;
  try {
    contenu = type === "film" ? await getDetailFilm(id) : await getDetailSerie(id);
  } catch {
    return new Response("Contenu introuvable.", { status: 404 });
  }

  const params = {
    titre: contenu.titre,
    type: type === "film" ? ("Film" as const) : ("Série" as const),
    genres: contenu.genres.map((g) => g.nom).join(", "),
    note: contenu.note.toFixed(1),
    casting: contenu.casting.slice(0, 3).map((p) => p.nom).join(", "),
    synopsis: contenu.synopsis,
  };

  // Clé par type + id : les ids TMDB films et séries se chevauchent, et
  // toutes les variantes de slug d'un même contenu partagent le cache
  const cle = `${type}:${id}`;
  const cached = getCached(cle);
  const stream = cached
    ? streamFromCache(cached)
    : convaincseMoiStream(params, (texte) => setCached(cle, texte));

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
