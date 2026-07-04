import type { Contenu, NouveautesParPlateforme } from "@/types";
import CarteContenu from "@/components/CarteContenu";
import EnTeteSection from "@/components/EnTeteSection";
import { formatJourSemaineFR } from "@/lib/utils";

export interface SortiesJour {
  dateISO: string;
  contenus: Contenu[];
}

/**
 * Agrège les sorties à venir en journées triées chronologiquement,
 * dédupliquées (un titre multi-plateformes n'apparaît qu'une fois).
 */
export function agregerSortiesParJour(
  plateformes: NouveautesParPlateforme[],
  filtreId?: number
): SortiesJour[] {
  const parJour = new Map<string, Contenu[]>();
  const vus = new Set<string>();

  for (const pf of plateformes) {
    if (filtreId !== undefined && pf.plateforme.id !== filtreId) continue;
    for (const contenu of [...pf.series, ...pf.films]) {
      if (!contenu.dateSortie) continue;
      const cle = `${contenu.type}-${contenu.id}`;
      if (vus.has(cle)) continue;
      vus.add(cle);
      const jour = parJour.get(contenu.dateSortie) ?? [];
      jour.push(contenu);
      parJour.set(contenu.dateSortie, jour);
    }
  }

  return [...parJour.entries()]
    .sort(([a], [b]) => (a < b ? -1 : 1))
    .map(([dateISO, contenus]) => ({ dateISO, contenus }));
}

interface Props {
  jours: SortiesJour[];
}

/** Calendrier des sorties : une section par jour, cartes en mode liste */
export default function ListeSortiesParJour({ jours }: Props) {
  if (jours.length === 0) {
    return (
      <p
        className="py-12 text-center text-xl text-[#9A9282] italic"
        style={{ fontFamily: "var(--font-newsreader), serif" }}
      >
        Aucune sortie annoncée sur cette période pour l&apos;instant.
      </p>
    );
  }

  return (
    <div className="space-y-10">
      {jours.map(({ dateISO, contenus }) => (
        <section key={dateISO} aria-labelledby={`jour-${dateISO}`}>
          <EnTeteSection
            id={`jour-${dateISO}`}
            titre={formatJourSemaineFR(dateISO)}
            compte={contenus.length}
            compteLabel="sortie"
          />
          {contenus.map((c) => (
            <CarteContenu key={`${c.type}-${c.id}`} contenu={c} />
          ))}
        </section>
      ))}
    </div>
  );
}
