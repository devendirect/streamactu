import type { Plateforme } from "@/types";

/**
 * Pastille d'une plateforme (règle des pastilles, DESIGN.md) : point de 8 px
 * cerclé d'un filet, suivi du nom. La couleur de la plateforme n'apparaît
 * jamais ailleurs.
 */
export default function PastillePlateforme({ pf, className }: { pf: Plateforme; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1.5 whitespace-nowrap ${className ?? ""}`}>
      <span
        aria-hidden="true"
        className="size-2 flex-none rounded-full shadow-[0_0_0_1px_rgba(245,245,247,0.22)]"
        style={{ background: pf.couleur }}
      />
      {pf.nom}
    </span>
  );
}
