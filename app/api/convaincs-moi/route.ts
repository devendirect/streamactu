import { convaincseMoiStream } from "@/lib/anthropic";
import { checkRateLimit, getIp } from "@/lib/rate-limit";
import { headers } from "next/headers";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const ip = getIp(await headers());

  // 10 requêtes par minute par IP (le bouton est sur une fiche, usage normal = 1-2 clics)
  if (!checkRateLimit(`convaincs:${ip}`, 10, 60_000)) {
    return new Response("Trop de requêtes. Réessaie dans une minute.", { status: 429 });
  }

  let body: {
    titre: string;
    type: "Série" | "Film";
    genres: string;
    note: string;
    casting: string;
    synopsis: string;
    variation?: boolean;
  };

  try {
    body = await request.json();
  } catch {
    return new Response("Corps de requête invalide.", { status: 400 });
  }

  if (!body.titre || !body.synopsis) {
    return new Response("Champs manquants.", { status: 400 });
  }

  const stream = convaincseMoiStream(body);

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
