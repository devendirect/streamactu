"use client";

import type { Contenu } from "@/types";
import { useMaListe } from "@/lib/use-ma-liste";

interface Props {
  contenu: Contenu;
}

/** Ajout/retrait de la liste personnelle — utilisé sur les fiches */
export default function BoutonMaListe({ contenu }: Props) {
  const { contient, basculer } = useMaListe();
  const dans = contient(contenu.id, contenu.type);

  return (
    <button
      onClick={() =>
        basculer({
          id: contenu.id,
          type: contenu.type,
          titre: contenu.titre,
          slug: contenu.slug,
          poster: contenu.poster,
          note: contenu.note,
          annee: contenu.annee,
        })
      }
      aria-pressed={dans}
      className="flex items-center gap-2 font-mono-label px-5 py-3 border transition-colors"
      style={{
        borderColor: dans ? "#E3A53A" : "rgba(236,230,216,0.3)",
        color: dans ? "#E3A53A" : "#ECE6D8",
        background: dans ? "rgba(227,165,58,0.06)" : "transparent",
      }}
    >
      {dans ? "✓ Dans ma liste" : "+ Ma liste"}
    </button>
  );
}
