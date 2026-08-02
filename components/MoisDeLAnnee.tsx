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
    <nav aria-label={`Archives ${plateforme.nom} mois par mois`} className="border-t border-border pt-5">
      <p className="font-mono-label text-ink-4 mb-3">Mois par mois</p>
      <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {mois.map((m) => {
          const total = m.nbSeries + m.nbFilms;
          return (
            <li key={`${m.annee}-${m.mois}`}>
              <Link
                href={`/${plateforme.slug}/${formatMoisURL(m.mois, m.annee)}`}
                className="flex items-baseline justify-between gap-3 px-3 py-2 border border-border/50 font-mono-label text-[#9A9282] hover:text-foreground hover:border-border transition-colors"
              >
                <span>{formatMoisFR(m.mois, m.annee)}</span>
                <span aria-label={`${total} nouveauté${total > 1 ? "s" : ""}`}>{total}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
