const cache = new Map<string, string>();

export function getCached(slug: string): string | undefined {
  return cache.get(slug);
}

export function setCached(slug: string, text: string): void {
  cache.set(slug, text);
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
