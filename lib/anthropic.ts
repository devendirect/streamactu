import Anthropic from "@anthropic-ai/sdk";
import type { RetrouveurResultat } from "@/types";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPT =
  "Tu es un ami cinéphile passionné et enthousiaste. À partir des informations ci-dessous, " +
  "convaincs l'utilisateur de regarder ce contenu ce soir en 3-4 phrases maximum. " +
  "Style naturel et chaleureux, pas un communiqué de presse. " +
  "Pas de spoilers. Pas de mention de TMDB ou StreamActu.";

interface ConvaincsParams {
  titre: string;
  type: "Série" | "Film";
  genres: string;
  note: string;
  casting: string;
  synopsis: string;
}

function buildPrompt(p: ConvaincsParams): string {
  const data = [
    `Titre : ${p.titre}`,
    `Type : ${p.type}`,
    `Genres : ${p.genres}`,
    `Note : ${p.note}/10`,
    `Casting principal : ${p.casting}`,
    `Synopsis : ${p.synopsis}`,
  ].join("\n");

  return `${SYSTEM_PROMPT}\n\n${data}\n\nÉcris uniquement le pitch, en français, sans titre, sans guillemets, sans préambule.`;
}

// ──────────────────────────────────────────────
// Retrouver — analyse sémantique de la description
// ──────────────────────────────────────────────

const RETROUVER_SYSTEM = `Tu es un expert en cinéma et séries TV, très cultivé, et tu réponds UNIQUEMENT en JSON valide — aucun texte avant ni après.

Quand l'utilisateur décrit un film ou une série dont il se souvient vaguement, tu dois répondre avec cet objet JSON exact :
{
  "criteres": [
    ["Genre", "..."],
    ["Thème", "..."],
    ["Ambiance", "..."],
    ["...", "..."]
  ],
  "raisonnement": "...",
  "suggestions": [
    { "titre": "...", "type": "film", "pourquoi": "..." },
    { "titre": "...", "type": "serie", "pourquoi": "..." }
  ]
}

Règles :
- criteres : 3 à 4 paires [label_court, valeur] résumant ce que cherche l'utilisateur
- raisonnement : 2 phrases en français expliquant ton interprétation (style éditorial, pas robotique)
- suggestions : 3 à 5 titres RÉELS ordonnés par pertinence décroissante
- type : "film" ou "serie" uniquement
- pourquoi : 1-2 phrases en français sans commencer par "Ça colle parce que"
- Ne suggère que des œuvres qui existent vraiment
- Tout en français`;

export interface RetrouveurIAResult {
  criteres: [string, string][];
  raisonnement: string;
  suggestions: { titre: string; type: "film" | "serie"; pourquoi: string }[];
}

export async function retrouverIA(description: string): Promise<RetrouveurIAResult> {
  const response = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 1024,
    system: RETROUVER_SYSTEM,
    messages: [{ role: "user", content: description }],
  });

  const raw = response.content[0].type === "text" ? response.content[0].text.trim() : "{}";
  try {
    return JSON.parse(raw) as RetrouveurIAResult;
  } catch {
    return {
      criteres: [["Erreur", "Analyse impossible"]],
      raisonnement: "Je n'ai pas réussi à analyser cette description. Essaie de reformuler.",
      suggestions: [],
    };
  }
}

/**
 * Retourne un ReadableStream de texte pour le streaming SSE depuis un Route Handler.
 * Utilise le modèle Haiku 4.5 (rapide, économique).
 */
export function convaincseMoiStream(
  params: ConvaincsParams,
  onComplete?: (text: string) => void
): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();

  return new ReadableStream({
    async start(controller) {
      let accumulated = "";
      try {
        const stream = client.messages.stream({
          model: "claude-haiku-4-5-20251001",
          max_tokens: 300,
          messages: [{ role: "user", content: buildPrompt(params) }],
        });

        for await (const event of stream) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            accumulated += event.delta.text;
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }

        if (accumulated) onComplete?.(accumulated);
      } catch {
        controller.enqueue(
          encoder.encode("Mon enthousiasme bug une seconde — réessaie dans un instant.")
        );
      } finally {
        controller.close();
      }
    },
  });
}
