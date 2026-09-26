import Link from "next/link";
import type { ReactNode } from "react";
import type { SectionGuide } from "@/lib/guides";

const styleProse = {
  fontFamily: "var(--font-newsreader), serif",
  fontSize: "17px",
} as const;

const classeProse = "text-[#C4BBA9] leading-relaxed";

/** Texte brut avec liens internes [libellé](/chemin) */
export function TexteEnLigne({ texte }: { texte: string }) {
  const morceaux: ReactNode[] = [];
  const re = /\[([^\]]+)\]\((\/[^)\s]*)\)/g;
  let dernier = 0;
  for (const m of texte.matchAll(re)) {
    const debut = m.index ?? 0;
    if (debut > dernier) morceaux.push(texte.slice(dernier, debut));
    morceaux.push(
      <Link key={debut} href={m[2]} className="text-primary underline">
        {m[1]}
      </Link>
    );
    dernier = debut + m[0].length;
  }
  if (dernier < texte.length) morceaux.push(texte.slice(dernier));
  return <>{morceaux}</>;
}

export default function CorpsGuide({ sections }: { sections: SectionGuide[] }) {
  return (
    <div className="space-y-10">
      {sections.map((s) => (
        <section key={s.titre} className="space-y-4">
          <h2 className="text-2xl font-extrabold tracking-[-0.02em]">{s.titre}</h2>
          {s.blocs.map((b, i) => {
            if ("p" in b) {
              return (
                <p key={i} className={classeProse} style={styleProse}>
                  <TexteEnLigne texte={b.p} />
                </p>
              );
            }
            if ("ul" in b || "ol" in b) {
              const items = "ul" in b ? b.ul : b.ol;
              const Liste = "ul" in b ? "ul" : "ol";
              return (
                <Liste
                  key={i}
                  className={`${classeProse} space-y-2 pl-5 ${"ul" in b ? "list-disc" : "list-decimal"}`}
                  style={styleProse}
                >
                  {items.map((item) => (
                    <li key={item.slice(0, 40)}>
                      <TexteEnLigne texte={item} />
                    </li>
                  ))}
                </Liste>
              );
            }
            return (
              <div key={i} className="overflow-x-auto">
                <table className="w-full text-left text-sm border border-border">
                  <thead className="font-mono-label text-ink-3">
                    <tr>
                      {b.table.entetes.map((e) => (
                        <th key={e} className="px-3 py-2 border-b border-border font-normal">
                          {e}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="text-[#C4BBA9]">
                    {b.table.lignes.map((ligne) => (
                      <tr key={ligne[0]} className="border-t border-border/50">
                        {ligne.map((cellule, j) => (
                          <td key={j} className="px-3 py-2">
                            <TexteEnLigne texte={cellule} />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          })}
        </section>
      ))}
    </div>
  );
}
