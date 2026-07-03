import type { Metadata } from "next";
import { getNouveautesJour } from "@/lib/tmdb";
import { toISO, formatJourSemaineFR } from "@/lib/utils";
import AccueilClient from "@/components/AccueilClient";
import EnTeteNouveautes from "@/components/EnTeteNouveautes";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const label = formatJourSemaineFR(new Date());
  return {
    title: `Nouveautés streaming — ${label}`,
    description:
      "Retrouvez chaque jour les nouvelles séries et films disponibles sur Netflix, Prime Video, Disney+, Apple TV+, Canal+, Max et Paramount+.",
    alternates: { canonical: "/" },
  };
}

export default async function HomePage() {
  const maintenant = new Date();
  const aujourdhui = toISO(maintenant);
  const nouveautes = await getNouveautesJour(aujourdhui);

  return (
    <>
      <EnTeteNouveautes
        titre={`Nouveautés streaming — ${formatJourSemaineFR(maintenant)}`}
        intro="Les séries et films qui sortent aujourd'hui sur Netflix, Prime Video, Disney+, Apple TV+, Canal+, Max et Paramount+ — mis à jour chaque jour."
      />
      <AccueilClient
        plateformes={nouveautes}
        contexte={{ mode: "jour", dateISO: aujourdhui }}
      />
    </>
  );
}
