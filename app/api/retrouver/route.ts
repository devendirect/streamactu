import { retrouverIA } from "@/lib/anthropic";
import { retrouverFiche } from "@/lib/tmdb";
import { checkRateLimit, getIp } from "@/lib/rate-limit";
import { headers } from "next/headers";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const ip = getIp(await headers());

  if (!checkRateLimit(`retrouver-day:${ip}`, 5, 24 * 60 * 60_000)) {
    return new Response(
      JSON.stringify({ error: "Vous avez atteint la limite de 5 recherches par jour. Revenez demain !" }),
      { status: 429, headers: { "Content-Type": "application/json" } }
    );
  }

  if (!checkRateLimit(`retrouver:${ip}`, 5, 60_000)) {
    return new Response(
      JSON.stringify({ error: "Trop de requêtes. Réessayez dans une minute." }),
      { status: 429, headers: { "Content-Type": "application/json" } }
    );
  }

  // ── Validation du body ──
  let description: string;
  try {
    const body = await request.json() as { description?: unknown };
    description = typeof body.description === "string" ? body.description.trim() : "";
  } catch {
    return new Response(
      JSON.stringify({ error: "Corps de requête invalide." }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  if (description.length < 10) {
    return new Response(
      JSON.stringify({ error: "Description trop courte (minimum 10 caractères)." }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }
  if (description.length > 600) {
    return new Response(
      JSON.stringify({ error: "Description trop longue (maximum 600 caractères)." }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  // ── Stream NDJSON ──
  const encoder = new TextEncoder();
  const send = (obj: object) => encoder.encode(JSON.stringify(obj) + "\n");

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        const ia = await retrouverIA(description);

        controller.enqueue(send({ type: "criteria", data: ia.criteres }));
        controller.enqueue(send({ type: "reasoning", text: ia.raisonnement }));

        const fiches = await Promise.all(
          ia.suggestions.map((s) => retrouverFiche(s.titre, s.type, s.pourquoi))
        );

        for (const fiche of fiches) {
          if (fiche) controller.enqueue(send({ type: "match", data: fiche }));
        }
      } catch {
        controller.enqueue(
          send({ type: "error", message: "Une erreur est survenue. Réessayez dans un instant." })
        );
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "application/x-ndjson; charset=utf-8",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
