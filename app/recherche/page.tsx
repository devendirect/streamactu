import type { Metadata } from "next";
import RechercheClient from "@/components/RechercheClient";
import { rechercherContenu } from "@/lib/tmdb";

export const metadata: Metadata = {
  title: "Recherche",
  robots: { index: false },
};

interface Props {
  searchParams: Promise<{ q?: string }>;
}

export default async function RecherchePage({ searchParams }: Props) {
  const { q } = await searchParams;
  const query = typeof q === "string" ? q.trim() : "";
  const resultatsInitiaux = query ? await rechercherContenu(query) : [];

  return (
    <div className="sa-container py-8">
      <RechercheClient queryInitiale={query} resultatsInitiaux={resultatsInitiaux} />
    </div>
  );
}
