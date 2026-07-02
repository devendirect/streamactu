"use client";

import { useState } from "react";
import type { Serie, Film } from "@/types";

interface Props {
  contenu: Serie | Film;
}

export default function ConvaincsMoi({ contenu }: Props) {
  const [pitch, setPitch] = useState("");
  const [loading, setLoading] = useState(false);
  const [pitchVisible, setPitchVisible] = useState(false);

  const isSerie = contenu.type === "serie";

  async function lancerConvaincs() {
    setLoading(true);
    setPitch("");
    setPitchVisible(false);

    try {
      const res = await fetch("/api/convaincs-moi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: contenu.slug,
          titre: contenu.titre,
          type: isSerie ? "Série" : "Film",
          genres: contenu.genres.map((g) => g.nom).join(", "),
          note: contenu.note.toFixed(1),
          casting: contenu.casting.slice(0, 3).map((p) => p.nom).join(", "),
          synopsis: contenu.synopsis,
        }),
      });

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
      setPitch("Mon enthousiasme bug une seconde — réessaie dans un instant.");
      setPitchVisible(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      {!pitchVisible && !loading && (
        <button
          onClick={lancerConvaincs}
          className="w-full flex items-center justify-center gap-2 border border-primary text-primary font-semibold py-3.5 text-[15px] hover:bg-primary hover:text-background transition-colors"
        >
          <span>✦</span> Convaincs-moi
        </button>
      )}

      {loading && (
        <div className="flex items-center gap-3 py-4">
          <span
            className="text-base text-[#B8AF9D] italic animate-pulse"
            style={{ fontFamily: "var(--font-newsreader), serif" }}
          >
            Un ami cinéphile cherche ses mots
          </span>
        </div>
      )}

      {pitchVisible && (
        <div className="border-y border-primary/35 bg-primary/[0.05] p-4">
          <p className="font-mono-label text-primary mb-3">✦ Le mot d&apos;un ami</p>
          <p className="text-[17px] leading-[1.55] text-foreground">{pitch}</p>
        </div>
      )}
    </div>
  );
}
