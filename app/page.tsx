import type { Metadata } from "next";
import { getNouveautesJour } from "@/lib/tmdb";
import { toISO, formatJourSemaineFR } from "@/lib/utils";
import AccueilClient from "@/components/AccueilClient";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const label = formatJourSemaineFR(new Date());
  return {
    title: `Nouveautés streaming — ${label}`,
    description:
      "Retrouvez chaque jour les nouvelles séries et films disponibles sur Netflix, Prime Video, Disney+, Apple TV+, Canal+, Max et Paramount+.",
  };
}

export default async function HomePage() {
  const aujourdhui = toISO(new Date());
  const nouveautes = await getNouveautesJour(aujourdhui);

  return (
    <AccueilClient
      plateformes={nouveautes}
      contexte={{ mode: "jour", dateISO: aujourdhui }}
    />
  );
}
