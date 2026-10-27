"use client";

import { useState } from "react";
import type { Serie, Film } from "@/types";
import Faisceau from "@/components/Faisceau";
import Icone from "@/components/Icone";

interface Props {
  contenu: Serie | Film;
}

export default function ConvaincsMoi({ contenu }: Props) {
  const [pitch, setPitch] = useState("");
  const [loading, setLoading] = useState(false);
  const [pitchVisible, setPitchVisible] = useState(false);

  async function lancerConvaincs() {
    setLoading(true);
    setPitch("");
    setPitchVisible(false);

    try {
      // Le serveur reconstruit lui-même les données du pitch depuis TMDB
      const res = await fetch("/api/convaincs-moi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: contenu.slug, type: contenu.type }),
      });

      // Limite atteinte (par visiteur ou globale) : afficher le message du serveur
      if (res.status === 429) {
        setPitch((await res.text()) || "Trop de demandes. Réessayez plus tard.");
        setPitchVisible(true);
        return;
      }
      if (!res.ok || !res.body) throw new Error("Erreur API");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let texte = "";

      setPitchVisible(true);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        texte += decoder.decode(value, { stream: true });
        setPitch(texte);
      }
    } catch {
      setPitch("Mon enthousiasme bug une seconde, réessayez dans un instant.");
      setPitchVisible(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    // Encadré velours (rendez-vous) : faisceau adouci, titre en capitales de salle
    <div className="relative isolate mt-[26px] overflow-hidden rounded-[14px] bg-linear-135 from-velours to-velours-sombre p-[22px]">
      <Faisceau doux />
      <h3 className="font-salle text-[30px] leading-none font-black text-lumiere">Pas encore convaincu&nbsp;?</h3>
      <p className="mt-2 max-w-[46ch] text-[#E6D5CE]">
        L&apos;IA vous dit en quelques lignes pourquoi {contenu.titre} vaut votre soirée.
      </p>

      {!pitchVisible && !loading && (
        <button type="button" onClick={lancerConvaincs} className="btn-blanc mt-4">
          <Icone nom="loupeIA" taille={20} />
          Convaincs-moi
        </button>
      )}

      {loading && (
        <p role="status" className="mt-4 animate-pulse text-velours-texte italic">
          Un ami cinéphile cherche ses mots
        </p>
      )}

      {pitchVisible && (
        <p aria-live="polite" className="mt-3.5 rounded-[10px] bg-black/25 px-4 py-3.5 text-[15px] leading-[1.55] text-lumiere">
          {pitch}
        </p>
      )}
    </div>
  );
}
