import type { Metadata } from "next";
import RechercheClient from "@/components/RechercheClient";
import { getTendancesSemaine, rechercherContenu } from "@/lib/tmdb";

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

  const [resultatsInitiaux, tendances] = await Promise.all([
    query ? rechercherContenu(query) : Promise.resolve([]),
    getTendancesSemaine().catch((err) => {
      console.error("[recherche] tendances indisponibles :", err instanceof Error ? err.message : err);
      return [];
    }),
  ]);

  return (
    <div className="sa-container py-8">
      <RechercheClient
        queryInitiale={query}
        resultatsInitiaux={resultatsInitiaux}
        tendances={tendances}
      />
    </div>
  );
}
