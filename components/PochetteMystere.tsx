"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import type { Contenu } from "@/types";
import { normaliser } from "@/lib/utils";

interface PochetteMystereProps {
  contenu: Contenu;
  dateISO: string;
}

const MAX_ESSAIS = 4;
const NIVEAUX_BLUR = [28, 18, 10, 4, 0];  // blur en px par niveau d'indice

type EtatJeu = "en-cours" | "gagne" | "perdu";

interface PartieState {
  nbEssais: number;
  etat: EtatJeu;
}

export default function PochetteMystere({ contenu, dateISO }: PochetteMystereProps) {
  const cleLS = `pochette-${dateISO}`;
  const [partie, setPartie] = useState<PartieState>(() => {
    if (typeof window === "undefined") return { nbEssais: 0, etat: "en-cours" };
    try {
      const saved = localStorage.getItem(cleLS);
      if (saved) return JSON.parse(saved) as PartieState;
    } catch { /* ignore */ }
    return { nbEssais: 0, etat: "en-cours" };
  });

  const [valeur, setValeur] = useState("");
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    localStorage.setItem(cleLS, JSON.stringify(partie));
  }, [partie, cleLS]);

  const blur = NIVEAUX_BLUR[Math.min(partie.nbEssais, NIVEAUX_BLUR.length - 1)];

  function tenter() {
    const saisie = valeur.trim();
    if (!saisie || partie.etat !== "en-cours") return;

    const correct = normaliser(saisie) === normaliser(contenu.titre);
    const nouvelNb = partie.nbEssais + 1;
    const fini = correct || nouvelNb >= MAX_ESSAIS;
    const nouvelEtat: EtatJeu = correct ? "gagne" : fini ? "perdu" : "en-cours";

    setPartie({ nbEssais: nouvelNb, etat: nouvelEtat });
    setValeur("");

    if (correct) {
      setFeedback("🎉 Bravo, pochette trouvée !");
    } else if (fini) {
      setFeedback(`C'était : ${contenu.titre}`);
    } else {
      setFeedback(`Raté — la pochette se dévoile un peu plus.`);
    }
  }

  function revelerIndice() {
    if (partie.nbEssais < MAX_ESSAIS && partie.etat === "en-cours") {
      setPartie((p) => ({ ...p, nbEssais: p.nbEssais + 1 }));
      setFeedback("Indice suivant révélé.");
    }
  }

  return (
    <div className="space-y-5">
      {/* Progression */}
      <div className="flex gap-1.5">
        {Array.from({ length: MAX_ESSAIS }).map((_, i) => (
          <div
            key={i}
            className="flex-1 h-2"
            style={{
              background:
                i < partie.nbEssais
                  ? partie.etat === "gagne" && i === partie.nbEssais - 1
                    ? "#E3A53A"
                    : "rgba(194,98,78,0.5)"
                  : "rgba(236,230,216,0.12)",
            }}
          />
        ))}
      </div>

      {/* Pochette floutée */}
      <div className="relative mx-auto w-[184px] h-[276px] border border-border overflow-hidden bg-card">
        {contenu.poster ? (
          <Image
            src={contenu.poster}
            alt="Pochette mystère"
            fill
            className="object-cover transition-all duration-700"
            style={{ filter: `blur(${blur}px)`, transform: `scale(1.${blur > 0 ? "1" : "0"})` }}
            sizes="184px"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
        )}

        {partie.etat === "gagne" && (
          <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
            <span className="text-3xl">✦</span>
          </div>
        )}
      </div>

      {/* Indice titre visible si trouvé ou perdu */}
      {partie.etat !== "en-cours" && (
        <p className="text-center font-extrabold text-xl tracking-tight">{contenu.titre}</p>
      )}

      {/* État fin de partie */}
      {partie.etat !== "en-cours" ? (
        <div
          className="p-4 border font-mono text-sm text-center"
          style={{
            borderColor: partie.etat === "gagne" ? "#E3A53A" : "rgba(194,98,78,0.5)",
            color: partie.etat === "gagne" ? "#E3A53A" : "#C2624E",
          }}
        >
          {feedback}
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={valeur}
              onChange={(e) => setValeur(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && tenter()}
              placeholder="Votre réponse…"
              className="flex-1 border border-border/40 bg-white/[0.03] px-4 py-3 font-mono text-sm text-[#6E6857] placeholder-[#5C564A] focus:outline-none focus:border-primary transition-colors"
            />
            <button
              onClick={tenter}
              className="bg-foreground text-background font-mono-label font-semibold px-5 py-3 hover:bg-primary hover:text-background transition-colors"
            >
              Tenter
            </button>
          </div>

          <button
            onClick={revelerIndice}
            disabled={partie.nbEssais >= MAX_ESSAIS - 1}
            className="w-full border border-border/40 py-2.5 font-mono-label text-[#9A9282] hover:border-primary hover:text-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Révéler un indice (−1 essai)
          </button>

          {feedback && (
            <p className="font-mono text-sm text-[#C2624E]">{feedback}</p>
          )}
        </div>
      )}
    </div>
  );
}
