import { ancreSection, cleSuivi, type AncresOrdre, type BlocOrdre, type SectionGuide } from "@/lib/guides";
import { cleOeuvre, type OeuvreArticle } from "@/lib/actu-oeuvres";
import { PLATEFORMES } from "@/lib/plateformes";
import { TexteEnLigne } from "@/components/TexteEnLigne";
import ListeOrdre from "@/components/ListeOrdre";
import ZoneAbonnements from "@/components/ZoneAbonnements";

/** Texte de lecture : 17 px, interligne 1,7, 62 à 72 caractères par ligne (colonne de 720 px) */
const classeProse = "text-[17px] leading-[1.7] text-texte-doux";

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
            <p key={i} className={classeProse}>
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
              className={`${classeProse} space-y-1.5 pl-[22px] marker:text-ambre ${"ul" in b ? "list-disc" : "list-decimal"}`}
             
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
          <div key={i} className="overflow-x-auto rounded-xl border border-trait">
            <table className="tabular w-full border-collapse text-left text-[15px]">
              <thead className="bg-surface text-[13px] font-bold text-texte-2">
                <tr>
                  {b.table.entetes.map((e) => (
                    <th key={e} className="px-3.5 py-3 whitespace-nowrap">
                      {e}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-[#E2E2E6]">
                {b.table.lignes.map((ligne) => (
                  <tr key={ligne[0]} className="border-t border-trait">
                    {ligne.map((cellule, j) => (
                      <td key={j} className="px-3.5 py-3">
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
    <section key={s.titre} id={ancreSection(s)} className={`${dansZone ? "scroll-mt-56" : "scroll-mt-24"} space-y-3.5`}>
      <h2 className="text-[clamp(22px,2vw,28px)] leading-[1.2] font-extrabold tracking-[-0.02em]">{s.titre}</h2>
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
