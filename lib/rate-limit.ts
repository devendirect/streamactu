const store = new Map<string, { n: number; resetAt: number }>();

// Nettoyage toutes les 5 minutes pour éviter la fuite mémoire
setInterval(() => {
  const now = Date.now();
  for (const [key, val] of store) {
    if (now > val.resetAt) store.delete(key);
  }
}, 5 * 60_000);

/**
 * Vérifie si l'IP est dans la limite.
 * @param key  identifiant de la limite (ex: "convaincs-moi:1.2.3.4")
 * @param max  nombre de requêtes autorisées par fenêtre
 * @param windowMs  durée de la fenêtre en ms
 */
export function checkRateLimit(key: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  const entry = store.get(key);
  if (!entry || now > entry.resetAt) {
    store.set(key, { n: 1, resetAt: now + windowMs });
    return true; // autorisé
  }
  if (entry.n >= max) return false; // bloqué
  entry.n++;
  return true;
}

export function getIp(headers: Headers): string {
  return (
    headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    headers.get("x-real-ip") ??
    "unknown"
  );
}
