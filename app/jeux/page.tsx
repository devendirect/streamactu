import type { Metadata } from "next";
import type { Contenu } from "@/types";
import { getContenusJeuDuJour, getDetailFilm, getDetailSerie } from "@/lib/tmdb";
import { toISO } from "@/lib/utils";
import JeuxClient from "@/components/JeuxClient";

// 1h : la rotation des jeux à minuit UTC ne doit pas traîner derrière l'ISR
export const revalidate = 3600;

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

function indexDuJour(dateISO: string): number {
  const d = new Date(dateISO + "T00:00:00Z");
  const debut = Date.UTC(d.getUTCFullYear(), 0, 1);
  return Math.floor((d.getTime() - debut) / 86_400_000);
}

/** Contenu du jour avec décalage ; avance jusqu'à trouver un poster si exigé */
function contenuDuJour(
  liste: Contenu[],
  jourAnnee: number,
  decalage: number,
  posterRequis = false
): Contenu {
  for (let i = 0; i < liste.length; i++) {
    const c = liste[(jourAnnee + decalage + i) % liste.length];
    if (!posterRequis || c.poster) return c;
  }
  return liste[(jourAnnee + decalage) % liste.length];
}

export default async function JeuxPage() {
  const contenus = await getContenusJeuDuJour();
  const dateISO = toISO(new Date());
  const jour = indexDuJour(dateISO);

  // Deux titres distincts : trouver l'un ne doit pas révéler l'autre
  const base = contenuDuJour(contenus, jour, 0);
  let pochette = contenuDuJour(
    contenus,
    jour,
    Math.floor(contenus.length / 2) || 1,
    true
  );
  if (pochette.id === base.id && contenus.length > 1) {
    pochette = contenuDuJour(contenus, jour, Math.floor(contenus.length / 2) + 1, true);
  }

  // Fiche détail pour le Titre du jour : alimente les indices casting et
  // plateformes (le discover ne fournit ni l'un ni l'autre)
  let contenuTitre: Contenu = base;
  try {
    contenuTitre =
      base.type === "film" ? await getDetailFilm(base.id) : await getDetailSerie(base.id);
  } catch (err) {
    // indices casting/plateforme dégradés si TMDB échoue — le jeu reste jouable
    console.error("[jeux] détail du titre du jour indisponible :", err instanceof Error ? err.message : err);
  }

  return (
    <div className="sa-container py-8 max-w-xl">
      <JeuxClient contenuTitre={contenuTitre} contenuPochette={pochette} dateISO={dateISO} />
    </div>
  );
}
