import type { Contenu, NouveautesParPlateforme } from "@/types";
import EnTeteSection from "@/components/EnTeteSection";
import GrilleAffiches from "@/components/GrilleAffiches";
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

const JOURS_COURTS = ["dim.", "lun.", "mar.", "mer.", "jeu.", "ven.", "sam."];

/** « jeu. 29 » */
function jourCourt(iso: string): string {
  const d = new Date(`${iso}T12:00:00Z`);
  return `${JOURS_COURTS[d.getUTCDay()]} ${d.getUTCDate()}`;
}

interface Props {
  jours: SortiesJour[];
}

/**
 * Calendrier des sorties : un bandeau collant des jours avec leur compteur,
 * puis une section par jour, titrée en capitales de salle, en grille d'affiches.
 */
export default function ListeSortiesParJour({ jours }: Props) {
  if (jours.length === 0) {
    return <p className="py-12 text-center text-xl text-texte-2">Aucune sortie annoncée sur cette période pour l&apos;instant.</p>;
  }

  return (
    <>
      <nav
        aria-label="Aller au jour"
        className="sticky top-entete z-30 -mx-gouttiere mb-6 flex gap-1.5 overflow-x-auto border-b border-trait bg-[rgba(10,10,11,0.86)] px-gouttiere py-2.5 backdrop-blur-[16px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {jours.map(({ dateISO, contenus }) => (
          <a
            key={dateISO}
            href={`#jour-${dateISO}`}
            className="inline-flex h-9 flex-none items-center gap-2 rounded-full px-3.5 text-[14.5px] font-semibold text-texte-doux transition-colors duration-200 hover:bg-surface-2 hover:text-white"
          >
            {jourCourt(dateISO)}
            <span className="tabular text-[13px] text-texte-2">{contenus.length}</span>
          </a>
        ))}
      </nav>
      <div className="space-y-section">
        {jours.map(({ dateISO, contenus }) => (
          <section key={dateISO} aria-labelledby={`jour-${dateISO}`} className="scroll-mt-[140px]">
            <EnTeteSection id={`jour-${dateISO}`} titre={formatJourSemaineFR(dateISO)} compte={contenus.length} compteLabel="sortie" salle />
            <GrilleAffiches contenus={contenus} />
          </section>
        ))}
      </div>
    </>
  );
}
