import type { NouveautesParPlateforme } from "@/types";
import EnTeteSection from "@/components/EnTeteSection";
import GrilleAffiches from "@/components/GrilleAffiches";

interface Props {
  data: NouveautesParPlateforme;
  priorite?: boolean;
  /** Titre cliquable vers /{slug-plateforme} — désactivé sur la page plateforme elle-même */
  lienTitre?: boolean;
  /** Nombre réel de sorties (TMDB) quand la liste est plafonnée */
  totalReel?: number;
}

/** Sorties d'une plateforme : en-tête à pastille, puis grille d'affiches triées par note */
export default function SectionPlateforme({ data, priorite = false, lienTitre = true, totalReel }: Props) {
  const { plateforme, series, films } = data;
  const contenus = [...series, ...films].sort((a, b) => b.note - a.note).map((c) => ({ ...c, plateforme }));
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
        lienHref={lienTitre ? `/${plateforme.slug}` : undefined}
        lienTitle={`Toutes les nouveautés ${plateforme.nom}`}
      />
      <GrilleAffiches contenus={contenus} priorite={priorite} />
    </section>
  );
}
