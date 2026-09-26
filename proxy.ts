import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cheminSansAccents } from "@/lib/url-accents";

/**
 * 308 des anciennes URL de dates et de mois accentuées vers la forme sans
 * accents (« /netflix/août-2026 » → « /netflix/aout-2026 »). Fait ici plutôt
 * que dans les pages : un permanentRedirect après le début du streaming
 * (loading.tsx) ne produirait pas de vrai 308.
 */
export function proxy(request: NextRequest) {
  const cible = cheminSansAccents(request.nextUrl.pathname);
  if (!cible) return NextResponse.next();
  const url = request.nextUrl.clone();
  url.pathname = cible;
  return NextResponse.redirect(url, 308);
}

export const config = {
  matcher: ["/((?!api/|_next/|.*\\.[a-z0-9]+$).*)"],
};
