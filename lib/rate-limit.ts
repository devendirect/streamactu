import { PLAFONDS_IA_JOUR } from "./plafonds-ia";
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

const JOUR_MS = 24 * 60 * 60_000;

// Plafonds définis dans lib/plafonds-ia.ts. Compteurs en mémoire : ils
// repartent de zéro au redémarrage du serveur.
export { PLAFONDS_IA_JOUR };

/** Compte un appel à l'IA ; true si le plafond du jour est déjà atteint (l'appel ne doit pas partir) */
export function plafondIAAtteint(fonction: keyof typeof PLAFONDS_IA_JOUR): boolean {
  return !checkRateLimit(`ia-global:${fonction}`, PLAFONDS_IA_JOUR[fonction], JOUR_MS);
}

/**
 * IP du client derrière UN proxy de confiance (nginx/Plesk).
 *
 * - `x-real-ip` d'abord : nginx le définit avec $remote_addr (non falsifiable).
 * - Sinon, la DERNIÈRE adresse de `x-forwarded-for` : c'est celle ajoutée par
 *   notre propre proxy. Les précédentes peuvent être fournies par le client
 *   (spoof) — prendre la première permettrait de contourner les rate limits.
 *
 * ⚠️ À vérifier côté Plesk : le proxy doit définir X-Real-IP, ou au minimum
 * ajouter l'adresse réelle en fin de X-Forwarded-For. S'il y a plus d'un
 * proxy de confiance en chaîne (CDN…), adapter en conséquence.
 */
export function getIp(headers: Headers): string {
  const realIp = headers.get("x-real-ip");
  if (realIp) return realIp.trim();

  const xff = headers.get("x-forwarded-for");
  if (xff) {
    const parts = xff.split(",");
    return parts[parts.length - 1].trim();
  }

  return "unknown";
}
