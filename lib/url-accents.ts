/**
 * Anciennes URL accentuées (« /31-août-2026 », « /netflix/février-2026 »,
 * « /top/series-décembre-2026 ») → forme sans accents, redirigée en 308 par
 * proxy.ts. Module sans dépendance à Next pour être testable.
 */

// Seuls ces trois mois ont un accent : on ne redirige rien d'autre.
const MOIS_ACCENTUES = /(^|-)(fevrier|aout|decembre)(-|$)/;

function sansAccents(str: string): string {
  return str.normalize("NFD").replace(/[̀-ͯ]/g, "");
}

/**
 * Une requête non encodée arrive parfois lue octet par octet (« août » devient
 * « aoÃ»t ») : on recompose l'UTF-8 quand c'est possible.
 */
function reparerUtf8(str: string): string {
  if (!/[Â-ô][\u0080-¿]/.test(str)) return str;
  if ([...str].some((c) => c.charCodeAt(0) > 0xff)) return str;
  try {
    const octets = Uint8Array.from(str, (c) => c.charCodeAt(0));
    return new TextDecoder("utf-8", { fatal: true }).decode(octets);
  } catch {
    return str;
  }
}

function normaliserSegment(segment: string): string {
  let decode = segment;
  try {
    decode = decodeURIComponent(segment);
  } catch {
    // segment mal encodé : on le garde tel quel
  }
  return sansAccents(reparerUtf8(decode));
}

/** Chemin sans accents si le chemin reçu en contenait sur un nom de mois, sinon null */
export function cheminSansAccents(pathname: string): string | null {
  if (/^[\x21-\x7e]*$/.test(pathname) && !pathname.includes("%")) return null;
  const segments = pathname.split("/");
  const normalises = segments.map(normaliserSegment);
  if (!normalises.some((s, i) => s !== segments[i] && MOIS_ACCENTUES.test(s))) return null;
  const cible = normalises.join("/");
  return cible === pathname ? null : cible;
}
