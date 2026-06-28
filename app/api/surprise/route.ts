import { getContenuAleatoire } from "@/lib/tmdb";
import { checkRateLimit, getIp } from "@/lib/rate-limit";
import { headers } from "next/headers";
import type { MediaType } from "@/types";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const ip = getIp(await headers());

  // 20 requêtes par minute — le bouton "Nouvelle surprise" peut être cliqué souvent
  if (!checkRateLimit(`surprise:${ip}`, 20, 60_000)) {
    return new Response("Trop de requêtes. Réessaie dans une minute.", { status: 429 });
  }

  const { searchParams } = new URL(request.url);
  const typeParam = searchParams.get("type") as MediaType | "tous" | null;

  const contenu = await getContenuAleatoire(typeParam ?? "tous");

  return Response.json(contenu);
}
