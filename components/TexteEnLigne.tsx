import Link from "next/link";
import type { ReactNode } from "react";

/** Texte brut avec liens internes [libellé](/chemin) */
export function TexteEnLigne({ texte }: { texte: string }) {
  const morceaux: ReactNode[] = [];
  const re = /\[([^\]]+)\]\((\/[^)\s]*)\)/g;
  let dernier = 0;
  for (const m of texte.matchAll(re)) {
    const debut = m.index ?? 0;
    if (debut > dernier) morceaux.push(texte.slice(dernier, debut));
    morceaux.push(
      <Link
        key={debut}
        href={m[2]}
        className="text-white underline decoration-ambre/60 underline-offset-4 transition-[text-decoration-color] duration-200 hover:decoration-ambre"
      >
        {m[1]}
      </Link>
    );
    dernier = debut + m[0].length;
  }
  if (dernier < texte.length) morceaux.push(texte.slice(dernier));
  return <>{morceaux}</>;
}
