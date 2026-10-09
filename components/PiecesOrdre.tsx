import type { Plateforme } from "@/types";

/**
 * Pièces communes aux listes des guides d'ordre (rendu serveur et liste client
 * de l'ordre de l'histoire). Pas de hook : utilisables des deux côtés.
 */

/** Plateformes réduites aux champs affichés (props sérialisables vers le client) */
export type PlateformeAffichee = Pick<Plateforme, "id" | "nom" | "couleur">;

/** Plateformes du jour, ou mention « au cinéma » / « aucune plateforme » ; le nom est toujours écrit */
export function Plateformes({ plateformes, auCinema }: { plateformes: PlateformeAffichee[]; auCinema?: boolean }) {
  if (plateformes.length > 0) {
    return (
      <ul className="flex flex-wrap gap-x-4 gap-y-[5px]" aria-label="Plateformes en France">
        {plateformes.map((p) => (
          <li
            key={p.id}
            data-pf={p.id}
            className="inline-flex items-center gap-[7px] font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-foreground"
          >
            <span
              aria-hidden="true"
              className="size-2 shadow-[inset_0_0_0_1px_rgba(236,230,216,0.18)]"
              style={{ background: p.couleur }}
            />
            {p.nom}
          </li>
        ))}
      </ul>
    );
  }
  if (auCinema) {
    return (
      <p className="inline-flex items-center gap-[7px] font-mono text-[11px] uppercase tracking-[0.12em] text-primary">
        <span aria-hidden="true" className="size-[7px] border border-primary" />
        Au cinéma · pas encore en streaming
      </p>
    );
  }
  return (
    <p className="inline-flex items-center gap-[7px] font-mono text-[11px] uppercase tracking-[0.12em] text-[#9A9282]">
      <span aria-hidden="true" className="size-[7px] border border-dashed border-[#9A9282]" />
      Aucune plateforme d&apos;abonnement
    </p>
  );
}

export function Etiquette({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-[2px] border border-[rgba(236,230,216,0.24)] px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.2em] text-[#C4BBA9]">
      {children}
    </span>
  );
}
