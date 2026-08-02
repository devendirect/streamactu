import Link from "next/link";
import type { Plateforme } from "@/types";
import { formatMoisFR, formatMoisURL } from "@/lib/utils";

interface Props {
  plateforme: Plateforme;
  /** Mois affiché sur la page courante (exclu des liens), format "mois-annee" */
  moisActuel?: string;
  nb?: number;
  /** Année pointée par le lien récapitulatif (défaut : l'année en cours) */
  annee?: number;
}

/** Liens vers les archives mensuelles d'une plateforme (/netflix/juin-2026, …) */
export default function ArchivesMoisPlateforme({
  plateforme,
  moisActuel,
  nb = 3,
  annee,
}: Props) {
  const liens: { slug: string; label: string }[] = [];
  const now = new Date();

  for (let i = 1; liens.length < nb && i <= nb + 1; i++) {
    const d = new Date(now);
    d.setUTCDate(15); // évite le débordement de fin de mois
    d.setUTCMonth(d.getUTCMonth() - i);
    const slug = formatMoisURL(d.getUTCMonth() + 1, d.getUTCFullYear());
    if (slug === moisActuel) continue;
    liens.push({ slug, label: formatMoisFR(d.getUTCMonth() + 1, d.getUTCFullYear()) });
  }

  const anneeLien = annee ?? now.getUTCFullYear();

  return (
    <nav aria-label={`Archives ${plateforme.nom}`} className="border-t border-border pt-5">
      <p className="font-mono-label text-ink-4 mb-3">Mois précédents</p>
      <div className="flex flex-wrap gap-2">
        {liens.map((l) => (
          <Link
            key={l.slug}
            href={`/${plateforme.slug}/${l.slug}`}
            className="px-3 py-1.5 border border-border/50 font-mono-label text-[#9A9282] hover:text-foreground hover:border-border transition-colors"
          >
            {l.label}
          </Link>
        ))}
        <Link
          href={`/${plateforme.slug}/${anneeLien}`}
          className="px-3 py-1.5 border border-border/50 font-mono-label text-foreground hover:text-primary hover:border-border transition-colors"
        >
          Toute l&apos;année {anneeLien} →
        </Link>
      </div>
    </nav>
  );
}
