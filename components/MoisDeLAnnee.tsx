import Link from "next/link";
import type { NouveautesAnnee, Plateforme } from "@/types";
import { formatMoisFR, formatMoisURL } from "@/lib/utils";

interface Props {
  plateforme: Plateforme;
  mois: NouveautesAnnee["mois"];
}

/**
 * Sommaire d'une page année : un lien par mois ayant eu des sorties
 * (/netflix/juin-2026, …). C'est le maillage qui sort les archives mensuelles
 * anciennes de leur orphelinat — la fenêtre glissante de 3 mois ne les atteint
 * plus passé le trimestre.
 */
export default function MoisDeLAnnee({ plateforme, mois }: Props) {
  if (mois.length === 0) return null;

  return (
    <nav aria-label={`Archives ${plateforme.nom} mois par mois`} >
      <h2 className="font-mono-label mb-3 text-texte-2">Mois par mois</h2>
      <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {mois.map((m) => {
          const total = m.nbSeries + m.nbFilms;
          return (
            <li key={`${m.annee}-${m.mois}`}>
              <Link
                href={`/${plateforme.slug}/${formatMoisURL(m.mois, m.annee)}`}
                className="flex items-baseline justify-between gap-3 rounded-xl bg-surface px-4 py-3 font-semibold transition-[background-color,translate] duration-200 ease-salle hover:-translate-y-0.5 hover:bg-surface-2"
              >
                <span>{formatMoisFR(m.mois, m.annee)}</span>
                <span className="tabular text-sm font-normal text-texte-2" aria-label={`${total} nouveauté${total > 1 ? "s" : ""}`}>{total}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
