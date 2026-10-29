import type { Metadata } from "next";
import MaListeClient from "@/components/MaListeClient";
import EnTeteNouveautes from "@/components/EnTeteNouveautes";
import { getNouveautesSemaine } from "@/lib/tmdb";
import { aplatir, pourCarte } from "@/lib/accueil";
import { getISOWeek } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Ma liste",
  description: "Vos séries et films à voir, enregistrés dans votre navigateur, sans compte.",
  robots: { index: false }, // contenu personnel, rien à indexer
};

// Séries de la semaine (même cache que l'accueil) : croisées avec Ma liste dans le navigateur
export const revalidate = 3600;

export default async function MaListePage() {
  const { semaine, annee } = getISOWeek(new Date());
  let seriesSemaine: Awaited<ReturnType<typeof aplatir>> = [];
  try {
    seriesSemaine = aplatir(await getNouveautesSemaine(semaine, annee), "series").map(pourCarte);
  } catch {
    // La rangée des nouveaux épisodes est un bonus : la liste s'affiche sans
  }

  return (
    <>
      <EnTeteNouveautes titre="Ma liste" intro="Vos séries et films à voir, enregistrés dans ce navigateur, sans compte." />
      <MaListeClient seriesSemaine={seriesSemaine} />
    </>
  );
}
