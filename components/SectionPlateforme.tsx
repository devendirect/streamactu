import type { NouveautesParPlateforme, ModeAffichage } from "@/types";
import CarteContenu from "@/components/CarteContenu";
import CarteContenuPoster from "@/components/CarteContenuPoster";
import SkeletonCarte from "@/components/SkeletonCarte";

interface Props {
  data: NouveautesParPlateforme;
  mode?: ModeAffichage;
  priorite?: boolean;
}

export default function SectionPlateforme({ data, mode = "liste", priorite = false }: Props) {
  const { plateforme, series, films } = data;
  const contenus = [...series, ...films].sort((a, b) => b.note - a.note);
  const total = contenus.length;
  if (total === 0) return null;

  // En-tête identique pour les 3 modes
  const header = (
    <div className="flex items-end justify-between mb-1">
      <h2
        id={`pf-${plateforme.slug}`}
        className="text-[28px] font-extrabold tracking-[-0.025em] leading-none"
        style={{ color: plateforme.couleur }}
      >
        {plateforme.nom}
      </h2>
      <span className="font-mono-label text-ink-3">
        {total} sortie{total > 1 ? "s" : ""}
      </span>
    </div>
  );

  const bar = (
    <div className="sa-platform-bar mb-3" style={{ background: plateforme.couleur }} />
  );

  return (
    <section aria-labelledby={`pf-${plateforme.slug}`}>
      {header}
      {bar}

      {/* ─── LISTE ─── */}
      {mode === "liste" && (
        <div>
          {contenus.map((c, i) => (
            <CarteContenu key={c.id} contenu={c} priorite={priorite && i === 0} />
          ))}
        </div>
      )}

      {/* ─── GRILLE ─── */}
      {mode === "grille" && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {contenus.map((c, i) => (
            <CarteContenuPoster key={c.id} contenu={c} priorite={priorite && i === 0} />
          ))}
        </div>
      )}

      {/* ─── RAILS (scroll horizontal) ─── */}
      {mode === "rails" && (
        <div
          className="flex gap-3 overflow-x-auto pb-2"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {contenus.map((c, i) => (
            <div key={c.id} className="shrink-0 w-[140px] sm:w-[160px]">
              <CarteContenuPoster contenu={c} priorite={priorite && i === 0} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export function SectionPlateformeSkeleton() {
  return (
    <section>
      <div className="h-7 w-32 bg-white/8 rounded-sm animate-pulse" />
      <div className="sa-platform-bar bg-white/5 animate-pulse mb-3" />
      {Array.from({ length: 3 }).map((_, i) => (
        <SkeletonCarte key={i} />
      ))}
    </section>
  );
}
