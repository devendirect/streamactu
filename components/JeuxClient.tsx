"use client";

import { useState } from "react";
import type { Contenu } from "@/types";
import WordleJour from "@/components/WordleJour";
import PochetteMystere from "@/components/PochetteMystere";

type Onglet = "titre" | "pochette";

interface JeuxClientProps {
  /** Contenu du Titre du jour (enrichi : casting + plateformes pour les indices) */
  contenuTitre: Contenu;
  /** Contenu de la Pochette mystère — différent du premier pour éviter le spoil croisé */
  contenuPochette: Contenu;
  dateISO: string;
}

export default function JeuxClient({ contenuTitre, contenuPochette, dateISO }: JeuxClientProps) {
  const [onglet, setOnglet] = useState<Onglet>("titre");

  return (
    <div className="space-y-6">
      {/* Toggle onglets */}
      <div className="flex border border-border/50">
        <button
          onClick={() => setOnglet("titre")}
          aria-pressed={onglet === "titre"}
          className="flex-1 py-3 text-sm font-medium transition-colors border-r border-border/50"
          style={{
            background: onglet === "titre" ? "#ECE6D8" : "transparent",
            color: onglet === "titre" ? "#16140F" : "#9A9282",
            fontWeight: onglet === "titre" ? 600 : 400,
          }}
        >
          Titre du jour
        </button>
        <button
          onClick={() => setOnglet("pochette")}
          aria-pressed={onglet === "pochette"}
          className="flex-1 py-3 text-sm font-medium transition-colors"
          style={{
            background: onglet === "pochette" ? "#ECE6D8" : "transparent",
            color: onglet === "pochette" ? "#16140F" : "#9A9282",
            fontWeight: onglet === "pochette" ? 600 : 400,
          }}
        >
          Pochette mystère
        </button>
      </div>

      {/* Contenu de l'onglet */}
      {onglet === "titre" ? (
        <WordleJour contenu={contenuTitre} dateISO={dateISO} />
      ) : (
        <PochetteMystere contenu={contenuPochette} dateISO={dateISO} />
      )}
    </div>
  );
}
