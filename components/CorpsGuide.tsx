import { ancreSection, cleSuivi, type AncresOrdre, type BlocOrdre, type SectionGuide } from "@/lib/guides";
import { cleOeuvre, type OeuvreArticle } from "@/lib/actu-oeuvres";
import { PLATEFORMES } from "@/lib/plateformes";
import { TexteEnLigne } from "@/components/TexteEnLigne";
import ListeOrdre from "@/components/ListeOrdre";
import ZoneAbonnements from "@/components/ZoneAbonnements";

const styleProse = {
  fontFamily: "var(--font-newsreader), serif",
  fontSize: "17px",
} as const;

const classeProse = "text-[#C4BBA9] leading-relaxed";

/** Blocs de texte d'une section (paragraphes, listes, tableaux), partagés par les guides et les articles */
export function BlocsGuide({
  blocs,
  oeuvres,
  ancres,
  idSection,
  cleSuivi,
}: {
  blocs: SectionGuide["blocs"];
  oeuvres?: Map<string, OeuvreArticle>;
  ancres?: AncresOrdre;
  idSection?: string;
  /** Clé de stockage de la progression (ordre de l'histoire) */
  cleSuivi?: string;
}) {
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
        if ("oeuvres" in b) {
          return <ListeOrdre
              key={i}
              bloc={b}
              idListe={idSection ?? "liste"}
              cleSuivi={cleSuivi ?? idSection ?? "liste"}
              oeuvres={oeuvres}
              ancres={ancres ?? new Map()}
            />;
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
    </>
  );
}

/** Données de la barre « Mes abonnements » : plateformes du guide, titres distincts, étapes de l'histoire */
function donneesAbonnements(sections: SectionGuide[], oeuvres: Map<string, OeuvreArticle>) {
  const blocs = sections.flatMap((s) => s.blocs.filter((b): b is BlocOrdre => "oeuvres" in b));
  const distincts = new Map<string, OeuvreArticle>();
  for (const b of blocs)
    for (const item of b.oeuvres) {
      const o = oeuvres.get(cleOeuvre(item));
      if (o) distincts.set(cleOeuvre(o), o);
    }
  const titres = [...distincts.values()];
  const types = new Set(titres.map((o) => o.type));
  const etapes = blocs
    .filter((b) => b.ordre === "histoire")
    .flatMap((b) => b.oeuvres.flatMap((item) => oeuvres.get(cleOeuvre(item)) ?? []))
    .map((o) => o.plateformes.map((p) => p.id));
  const plateformes = PLATEFORMES.map((p) => ({
    id: p.id,
    nom: p.nom,
    couleur: p.couleur,
    nombre: titres.filter((o) => o.plateformes.some((x) => x.id === p.id)).length,
  }))
    .filter((p) => p.nombre > 0)
    .sort((a, b) => b.nombre - a.nombre);
  return {
    plateformes,
    titres: titres.map((o) => o.plateformes.map((p) => p.id)),
    unite: types.size > 1 ? "titres" : types.has("film") ? "films" : "séries",
    etapes,
  };
}

export default function CorpsGuide({
  sections,
  oeuvres,
  ancres,
  slugGuide,
}: {
  sections: SectionGuide[];
  /** Préfixe de la clé de progression du suivi de visionnage */
  slugGuide?: string;
  /** Fiches des listes ordonnées (chargerOeuvres), indexées par cleOeuvre */
  oeuvres?: Map<string, OeuvreArticle>;
  /** Ancres des titres dans les listes de sortie (ancresOrdre) : guide d'ordre, avec la barre « Mes abonnements » */
  ancres?: AncresOrdre;
}) {
  const section = (s: SectionGuide, dansZone = false) => (
    <section key={s.titre} id={ancreSection(s)} className={`${dansZone ? "scroll-mt-40" : "scroll-mt-4"} space-y-4`}>
      <h2 className="text-2xl font-extrabold tracking-[-0.02em]">{s.titre}</h2>
      <BlocsGuide
        blocs={s.blocs}
        oeuvres={oeuvres}
        ancres={ancres}
        idSection={ancreSection(s)}
        cleSuivi={slugGuide ? cleSuivi(slugGuide, s) : undefined}
      />
    </section>
  );

  // Guide d'ordre : la barre colle du début de la première liste à la fin de la dernière
  const avecListe = sections.map((s) => s.blocs.some((b) => "oeuvres" in b));
  const premiere = avecListe.indexOf(true);
  const derniere = avecListe.lastIndexOf(true);
  if (!ancres || !oeuvres || premiere < 0) {
    return <div className="space-y-10">{sections.map((s) => section(s))}</div>;
  }

  return (
    <div className="space-y-10">
      {sections.slice(0, premiere).map((s) => section(s))}
      <ZoneAbonnements {...donneesAbonnements(sections, oeuvres)}>
        <div className="space-y-12 pt-7">{sections.slice(premiere, derniere + 1).map((s) => section(s, true))}</div>
      </ZoneAbonnements>
      {sections.slice(derniere + 1).map((s) => section(s))}
    </div>
  );
}
