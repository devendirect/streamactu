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

const ONGLETS: { val: Onglet; label: string }[] = [
  { val: "titre", label: "Titre du jour" },
  { val: "pochette", label: "Pochette mystère" },
];

/** Plateau de jeu sur le velours (rendez-vous quotidien), deux jeux en segments */
export default function JeuxClient({ contenuTitre, contenuPochette, dateISO }: JeuxClientProps) {
  const [onglet, setOnglet] = useState<Onglet>("titre");

  return (
    <div className="velours rounded-[18px] p-[clamp(18px,3vw,32px)]">
      <div role="tablist" aria-label="Jeux" className="segments mb-6">
        {ONGLETS.map((o) => (
          <button
            key={o.val}
            type="button"
            role="tab"
            id={`onglet-${o.val}`}
            aria-selected={onglet === o.val}
            aria-controls="plateau-jeu"
            onClick={() => setOnglet(o.val)}
          >
            {o.label}
          </button>
        ))}
      </div>

      <div id="plateau-jeu" role="tabpanel" aria-labelledby={`onglet-${onglet}`}>
        <h2 className="font-salle mb-5 text-[clamp(30px,3.4vw,42px)] leading-[0.95] font-black text-lumiere">
          {onglet === "titre" ? "Le titre du jour" : "La pochette mystère"}
        </h2>
        {onglet === "titre" ? (
          <WordleJour contenu={contenuTitre} dateISO={dateISO} />
        ) : (
          <PochetteMystere contenu={contenuPochette} dateISO={dateISO} />
        )}
      </div>
    </div>
  );
}
