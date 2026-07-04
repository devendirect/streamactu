interface EntreeCache {
  texte: string;
  expireAt: number;
}

// LRU borné : évite toute croissance mémoire illimitée, même si un client
// envoie des clés en masse. Le TTL borne aussi la durée de vie d'un pitch.
const MAX_ENTREES = 500;
const TTL_MS = 24 * 60 * 60_000;

const cache = new Map<string, EntreeCache>();

export function getCached(cle: string): string | undefined {
  const entree = cache.get(cle);
  if (!entree) return undefined;
  if (Date.now() > entree.expireAt) {
    cache.delete(cle);
    return undefined;
  }
  // LRU : l'entrée consultée repasse en fin de Map
  cache.delete(cle);
  cache.set(cle, entree);
  return entree.texte;
}

export function setCached(cle: string, texte: string): void {
  if (cache.has(cle)) {
    cache.delete(cle);
  } else if (cache.size >= MAX_ENTREES) {
    // Éviction de l'entrée la moins récemment utilisée (tête de Map)
    const plusAncienne = cache.keys().next().value;
    if (plusAncienne !== undefined) cache.delete(plusAncienne);
  }
  cache.set(cle, { texte, expireAt: Date.now() + TTL_MS });
}

export function streamFromCache(text: string): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();
  const words = text.split(" ");

  return new ReadableStream({
    async start(controller) {
      for (let i = 0; i < words.length; i++) {
        const chunk = i < words.length - 1 ? words[i] + " " : words[i];
        controller.enqueue(encoder.encode(chunk));
        await new Promise((r) => setTimeout(r, 25));
      }
      controller.close();
    },
  });
}
