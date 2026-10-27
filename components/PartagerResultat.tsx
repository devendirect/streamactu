"use client";

import { useState } from "react";
import Icone from "@/components/Icone";

interface Props {
  texte: string;
}

/** Bouton de partage d'un résultat de jeu — Web Share sur mobile, presse-papiers sinon */
export default function PartagerResultat({ texte }: Props) {
  const [copie, setCopie] = useState(false);

  async function partager() {
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ text: texte });
      } catch {
        // annulation par l'utilisateur — ne pas insister
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(texte);
      setCopie(true);
      setTimeout(() => setCopie(false), 2000);
    } catch {
      // presse-papiers indisponible (permissions) — rien à faire
    }
  }

  return (
    <button type="button" onClick={partager} className="btn-blanc w-full justify-center">
      <Icone nom={copie ? "coche" : "externe"} taille={20} />
      {copie ? "Copié dans le presse-papiers" : "Partager le résultat"}
    </button>
  );
}
