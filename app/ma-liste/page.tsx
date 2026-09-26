import type { Metadata } from "next";
import MaListeClient from "@/components/MaListeClient";

export const metadata: Metadata = {
  title: "Ma liste",
  description: "Vos séries et films à voir, enregistrés dans votre navigateur, sans compte.",
  robots: { index: false }, // contenu personnel, rien à indexer
};

export default function MaListePage() {
  return (
    <div className="sa-container py-8">
      <p className="font-mono-label text-ink-3 mb-3">À voir plus tard</p>
      <h1 className="text-4xl font-extrabold tracking-[-0.025em] mb-6">Ma liste</h1>
      <MaListeClient />
    </div>
  );
}
