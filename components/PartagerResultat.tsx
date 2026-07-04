"use client";

import { useState } from "react";

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
    <button
      onClick={partager}
      className="w-full border border-border/40 py-2.5 font-mono-label text-[#9A9282] hover:border-primary hover:text-primary transition-colors"
    >
      {copie ? "✓ Copié dans le presse-papiers" : "Partager le résultat"}
    </button>
  );
}
