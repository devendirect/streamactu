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
            className="inline-flex items-center gap-[7px] text-[13px] font-medium uppercase tracking-[0.06em] text-texte"
          >
            <span
              aria-hidden="true"
              className="size-2 rounded-full shadow-[0_0_0_1px_rgba(245,245,247,0.22)]"
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
      <p className="inline-flex items-center gap-[7px] text-[13px] uppercase tracking-[0.06em] text-ambre">
        <span aria-hidden="true" className="size-[7px] border border-ambre" />
        Au cinéma · pas encore en streaming
      </p>
    );
  }
  return (
    <p className="inline-flex items-center gap-[7px] text-[13px] uppercase tracking-[0.06em] text-texte-2">
      <span aria-hidden="true" className="size-[7px] border border-dashed border-texte-2" />
      Aucune plateforme d&apos;abonnement
    </p>
  );
}

export function Etiquette({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-md border border-trait px-1.5 py-0.5 text-[13px] uppercase tracking-[0.06em] text-texte-doux">
      {children}
    </span>
  );
}
