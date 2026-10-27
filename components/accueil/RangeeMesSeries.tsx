"use client";
import type { Contenu } from "@/types";
import { useMaListe } from "@/lib/use-ma-liste";
import Rangee from "@/components/Rangee";
import CartePaysage from "@/components/CartePaysage";

/**
 * « Nouveaux épisodes de tes séries » (option A, décision du 2026-10-27) :
 * les séries de Ma liste croisées avec les séries sorties cette semaine, déjà
 * chargées par l'accueil. Rien n'apparaît tant que Ma liste n'est pas lue ou
 * si aucune série gardée n'a d'épisode cette semaine.
 */
export default function RangeeMesSeries({ seriesSemaine }: { seriesSemaine: Contenu[] }) {
  const { liste, restaure } = useMaListe();
  if (!restaure) return null;
  const gardees = new Set(liste.filter((e) => e.type === "serie").map((e) => e.id));
  const nouvelles = seriesSemaine.filter((c) => gardees.has(c.id));
  if (nouvelles.length === 0) return null;

  return (
    <Rangee titre="Nouveaux épisodes de tes séries" href="/ma-liste" paysage>
      {nouvelles.map((c) => (
        <CartePaysage key={c.id} contenu={c} />
      ))}
    </Rangee>
  );
}
