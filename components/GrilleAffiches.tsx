import type { Contenu } from "@/types";
import CarteAffiche from "@/components/CarteAffiche";

/**
 * Grille d'affiches des pages de listes : même largeur de carte que les
 * rangées, en `auto-fill`. `data-grille` active l'aperçu au survol.
 */
export default function GrilleAffiches({
  contenus,
  priorite = false,
  badge,
}: {
  contenus: Contenu[];
  priorite?: boolean;
  /** Badge de chaque carte (ex. date de sortie) */
  badge?: (c: Contenu) => string | undefined;
}) {
  return (
    <div data-grille className="grid grid-cols-[repeat(auto-fill,minmax(clamp(132px,13vw,180px),1fr))] gap-x-3.5 gap-y-[22px]">
      {contenus.map((c, i) => (
        <CarteAffiche key={`${c.type}-${c.id}`} contenu={c} priorite={priorite && i < 4} badge={badge?.(c)} />
      ))}
    </div>
  );
}
