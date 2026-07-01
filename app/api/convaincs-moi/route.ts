import { convaincseMoiStream } from "@/lib/anthropic";
import { getCached, setCached, streamFromCache } from "@/lib/pitch-cache";
import { checkRateLimit, getIp } from "@/lib/rate-limit";
import { headers } from "next/headers";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const ip = getIp(await headers());

  if (!checkRateLimit(`convaincs:${ip}`, 10, 60_000)) {
    return new Response("Trop de requêtes. Réessaie dans une minute.", { status: 429 });
  }

  let body: {
    slug: string;
    titre: string;
    type: "Série" | "Film";
    genres: string;
    note: string;
    casting: string;
    synopsis: string;
  };

  try {
    body = await request.json();
  } catch {
    return new Response("Corps de requête invalide.", { status: 400 });
  }

  if (!body.titre || !body.synopsis) {
    return new Response("Champs manquants.", { status: 400 });
  }

  const cached = body.slug ? getCached(body.slug) : undefined;
  const stream = cached
    ? streamFromCache(cached)
    : convaincseMoiStream(body, body.slug ? (text) => setCached(body.slug, text) : undefined);

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
