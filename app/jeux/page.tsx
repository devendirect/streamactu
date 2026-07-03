import type { Metadata } from "next";
import { getContenusJeuDuJour } from "@/lib/tmdb";
import { toISO } from "@/lib/utils";
import JeuxClient from "@/components/JeuxClient";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Jeux — Titre du jour & Pochette mystère",
  description: "Deux jeux quotidiens autour des séries et films streaming : devinez le titre du jour ou la pochette mystère.",
  alternates: { canonical: "/jeux" },
  openGraph: {
    title: "Jeux — Titre du jour & Pochette mystère | StreamActu.fr",
    description: "Deux jeux quotidiens autour des séries et films streaming : devinez le titre du jour ou la pochette mystère.",
    images: ["/og-default.png"],
  },
};

function contenuDuJour<T>(liste: T[], dateISO: string): T {
  const d = new Date(dateISO + "T00:00:00Z");
  const debut = Date.UTC(d.getUTCFullYear(), 0, 1);
  const jourAnnee = Math.floor((d.getTime() - debut) / 86_400_000);
  return liste[jourAnnee % liste.length];
}

export default async function JeuxPage() {
  const contenus = await getContenusJeuDuJour();
  const dateISO = toISO(new Date());

  const contenuJour = contenuDuJour(contenus, dateISO);

  return (
    <div className="sa-container py-8 max-w-xl">
      <JeuxClient contenu={contenuJour} dateISO={dateISO} />
    </div>
  );
}
