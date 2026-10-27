import type { Metadata } from "next";
import SurpriseClient from "@/components/SurpriseClient";
import { getContenuAleatoire } from "@/lib/tmdb";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "À la surprise",
  description: "Laissez le hasard choisir votre prochaine série ou film à regarder.",
  robots: { index: false },
};

export default async function SurprisePage() {
  const contenu = await getContenuAleatoire("tous");

  return (
    <SurpriseClient initialContenu={contenu} />
  );
}
