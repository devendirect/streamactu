import type { NouveautesParPlateforme, ModeAffichage } from "@/types";
import CarteContenu from "@/components/CarteContenu";
import CarteContenuPoster from "@/components/CarteContenuPoster";
import SkeletonCarte from "@/components/SkeletonCarte";
import EnTeteSection from "@/components/EnTeteSection";

interface Props {
  data: NouveautesParPlateforme;
  mode?: ModeAffichage;
  priorite?: boolean;
  /** Titre cliquable vers /{slug-plateforme} — désactivé sur la page plateforme elle-même */
  lienTitre?: boolean;
  /** Nombre réel de sorties (TMDB) quand la liste est plafonnée */
  totalReel?: number;
}

export default function SectionPlateforme({
  data,
  mode = "liste",
  priorite = false,
  lienTitre = true,
  totalReel,
}: Props) {
  const { plateforme, series, films } = data;
  const contenus = [...series, ...films].sort((a, b) => b.note - a.note);
  const total = contenus.length;
  if (total === 0) return null;

  return (
    <section aria-labelledby={`pf-${plateforme.slug}`}>
      <EnTeteSection
        id={`pf-${plateforme.slug}`}
        titre={plateforme.nom}
        compte={total}
        compteTotal={totalReel}
        compteLabel="sortie"
        couleur={plateforme.couleur}
        grand
        lienHref={lienTitre ? `/${plateforme.slug}` : undefined}
        lienTitle={`Toutes les nouveautés ${plateforme.nom}`}
      />

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
