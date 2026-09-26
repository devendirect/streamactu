import type { Metadata } from "next";
import { metadonnees, metaProchainesSorties } from "@/lib/meta";
import Link from "next/link";
import { getSortiesAVenir } from "@/lib/tmdb";
import { PLATEFORMES } from "@/lib/plateformes";
import EnTeteNouveautes from "@/components/EnTeteNouveautes";
import ListeSortiesParJour, { agregerSortiesParJour } from "@/components/ListeSortiesParJour";
import MaillagePlateformes from "@/components/MaillagePlateformes";

export const revalidate = 21600;


export async function generateMetadata(): Promise<Metadata> {
  // Calendrier vide → noindex (même cache que le rendu, aucun appel en plus)
  let vide = false;
  try {
    const donnees = await getSortiesAVenir();
    vide = agregerSortiesParJour(donnees).length === 0;
  } catch (err) {
    // au doute, on laisse indexable
    console.error("[metadata] sorties à venir indisponibles :", err instanceof Error ? err.message : err);
  }

  const { titre, description } = metaProchainesSorties();
  return metadonnees(titre, description, "/prochaines-sorties", {
    ...(vide ? { robots: { index: false } } : {}),
  });
}

export default async function ProchainesSortiesPage() {
  const donnees = await getSortiesAVenir();
  const jours = agregerSortiesParJour(donnees);
  const total = jours.reduce((n, j) => n + j.contenus.length, 0);

  return (
    <>
      <EnTeteNouveautes
        titre="Prochaines sorties streaming"
        intro={
          total > 0
            ? `${total} sortie${total > 1 ? "s" : ""} annoncée${total > 1 ? "s" : ""} (nouvelles séries et films) sur les quatre prochaines semaines, jour par jour. Les dates peuvent bouger : la page est actualisée plusieurs fois par jour.`
            : "Aucune sortie annoncée sur les quatre prochaines semaines pour l'instant. Revenez bientôt : la page est actualisée plusieurs fois par jour."
        }
      />
      <div className="sa-container py-4 space-y-10">
        {/* Déclinaisons par plateforme */}
        <nav aria-label="Prochaines sorties par plateforme" className="flex items-center gap-x-4 gap-y-2 flex-wrap">
          <span className="font-mono-label text-ink-4">Par plateforme :</span>
          {PLATEFORMES.map((pf) => (
            <Link
              key={pf.id}
              href={`/${pf.slug}/prochaines-sorties`}
              className="font-mono-label text-[#9A9282] hover:text-foreground transition-colors"
            >
              {pf.nom}
            </Link>
          ))}
        </nav>

        <ListeSortiesParJour jours={jours} />

        <MaillagePlateformes />
      </div>
    </>
  );
}
