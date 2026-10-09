import Link from "next/link";
import type { ReactNode } from "react";
import { cheminOeuvreGuide, type OeuvreGuide, type SectionGuide } from "@/lib/guides";
import { cleOeuvre, type OeuvreArticle } from "@/lib/actu-oeuvres";

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

/**
 * Liste ordonnée de titres : année et plateformes lues sur la fiche du jour
 * (`oeuvres`), titre écrit dans le guide en repli si la fiche ne répond pas.
 */
function ListeOeuvres({ items, oeuvres }: { items: OeuvreGuide[]; oeuvres?: Map<string, OeuvreArticle> }) {
  return (
    <ol className="space-y-3 list-decimal pl-6 marker:text-ink-3 marker:font-mono">
      {items.map((item, i) => {
        const o = oeuvres?.get(cleOeuvre(item));
        const href = o ? `/${o.type}/${o.slug}` : cheminOeuvreGuide(item);
        return (
          <li key={`${item.type}-${item.id}-${i}`} className="pl-1 space-y-1">
            <div className="flex flex-wrap items-baseline gap-x-2">
              <Link href={href} className="text-[17px] font-semibold text-foreground hover:text-primary transition-colors">
                {o?.titre ?? item.titre}
              </Link>
              <span className="font-mono-label text-ink-3">
                {item.type === "serie" ? "Série" : "Film"}
                {o?.annee ? ` · ${o.annee}` : ""}
                {o
                  ? o.plateformes.length > 0
                    ? ` · ${o.plateformes.map((p) => p.nom).join(", ")}`
                    : " · pas en streaming par abonnement aujourd'hui"
                  : ""}
              </span>
            </div>
            <p className="text-[15px] leading-relaxed text-[#9A9282]" style={{ fontFamily: "var(--font-newsreader), serif" }}>
              <TexteEnLigne texte={item.repere} />
            </p>
          </li>
        );
      })}
    </ol>
  );
}

/** Blocs de texte d'une section (paragraphes, listes, tableaux), partagés par les guides et les articles */
export function BlocsGuide({ blocs, oeuvres }: { blocs: SectionGuide["blocs"]; oeuvres?: Map<string, OeuvreArticle> }) {
  return (
    <>
      {blocs.map((b, i) => {
        if ("p" in b) {
          return (
            <p key={i} className={classeProse} style={styleProse}>
              <TexteEnLigne texte={b.p} />
            </p>
          );
        }
        if ("oeuvres" in b) return <ListeOeuvres key={i} items={b.oeuvres} oeuvres={oeuvres} />;
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
    </>
  );
}

export default function CorpsGuide({
  sections,
  oeuvres,
}: {
  sections: SectionGuide[];
  /** Fiches des listes ordonnées (chargerOeuvres), indexées par cleOeuvre */
  oeuvres?: Map<string, OeuvreArticle>;
}) {
  return (
    <div className="space-y-10">
      {sections.map((s) => (
        <section key={s.titre} className="space-y-4">
          <h2 className="text-2xl font-extrabold tracking-[-0.02em]">{s.titre}</h2>
          <BlocsGuide blocs={s.blocs} oeuvres={oeuvres} />
        </section>
      ))}
    </div>
  );
}
