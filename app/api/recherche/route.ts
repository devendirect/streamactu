import { rechercherContenu } from "@/lib/tmdb";
import { checkRateLimit, getIp } from "@/lib/rate-limit";
import { headers } from "next/headers";

export async function GET(request: Request) {
  const ip = getIp(await headers());

  // 30 requêtes par minute — la recherche se déclenche à chaque frappe (debounce côté client)
  if (!checkRateLimit(`recherche:${ip}`, 30, 60_000)) {
    return new Response("Trop de requêtes. Réessaie dans une minute.", { status: 429 });
  }

  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") ?? "").trim();

  if (!q) return Response.json([]);
  if (q.length > 150) return new Response("Requête trop longue.", { status: 400 });

  const resultats = await rechercherContenu(q);
  return Response.json(resultats);
}
