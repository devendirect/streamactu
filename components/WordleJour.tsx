"use client";

import { useState, useEffect, useRef } from "react";
import type { Contenu } from "@/types";

interface WordleJourProps {
  contenu: Contenu;
  dateISO: string;
}

const MAX_ESSAIS = 6;

const INDICES_LABELS = [
  "Année",
  "Genres",
  "Casting",
  "Synopsis (partiel)",
  "Plateforme",
  "Note",
];

function getIndice(contenu: Contenu & { casting?: { nom: string }[]; plateforme?: { nom: string } }, n: number): string {
  switch (n) {
    case 0: return String(contenu.annee || "?");
    case 1: return contenu.genres.map((g) => g.nom).join(", ") || "?";
    case 2: return (contenu as unknown as { casting?: { nom: string }[] }).casting?.slice(0, 2).map((p) => p.nom).join(", ") || "?";
    case 3: return contenu.synopsis ? contenu.synopsis.slice(0, 80) + "…" : "?";
    case 4: return (contenu as unknown as { plateforme?: { nom: string } }).plateforme?.nom || "Voir TMDB";
    case 5: return `${contenu.note.toFixed(1)} / 10`;
    default: return "?";
  }
}

function normaliser(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]/g, "");
}

type EtatJeu = "en-cours" | "gagne" | "perdu";

interface PartieState {
  essais: string[];
  resultats: boolean[];
  etat: EtatJeu;
}

export default function WordleJour({ contenu, dateISO }: WordleJourProps) {
  const cleLS = `wordle-${dateISO}`;
  const [etat, setEtat] = useState<PartieState>(() => {
    if (typeof window === "undefined")
      return { essais: [], resultats: [], etat: "en-cours" };
    try {
      const saved = localStorage.getItem(cleLS);
      if (saved) return JSON.parse(saved) as PartieState;
    } catch { /* ignore */ }
    return { essais: [], resultats: [], etat: "en-cours" };
  });

  const [valeur, setValeur] = useState("");
  const [feedback, setFeedback] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const nbEssais = etat.essais.length;
  const indicesVisibles = Math.max(0, nbEssais - 1);

  useEffect(() => {
    localStorage.setItem(cleLS, JSON.stringify(etat));
  }, [etat, cleLS]);

  function tenter() {
    const saisie = valeur.trim();
    if (!saisie || etat.etat !== "en-cours") return;

    const correct = normaliser(saisie) === normaliser(contenu.titre);
    const nouvelEssais = [...etat.essais, saisie];
    const nouveauxResultats = [...etat.resultats, correct];
    const fini = correct || nouvelEssais.length >= MAX_ESSAIS;
    const nouvelEtat: EtatJeu = correct ? "gagne" : fini ? "perdu" : "en-cours";

    setEtat({ essais: nouvelEssais, resultats: nouveauxResultats, etat: nouvelEtat });
    setValeur("");

    if (correct) {
      setFeedback("🎉 Bravo !");
    } else if (fini) {
      setFeedback(`La réponse était : ${contenu.titre}`);
    } else {
      setFeedback(`Raté — indice ${Math.min(indicesVisibles + 2, MAX_ESSAIS)} révélé.`);
    }

    inputRef.current?.focus();
  }

  return (
    <div className="space-y-5">
      {/* Barre de progression */}
      <div>
        <div className="flex items-baseline justify-between mb-2">
          <span className="font-mono-label text-[#7C7565]">Le titre du jour</span>
          <span className="font-mono-label text-[#6E6857]">
            {nbEssais}/{MAX_ESSAIS} essai{nbEssais !== 1 ? "s" : ""}
          </span>
        </div>
        <div className="flex gap-1.5">
          {Array.from({ length: MAX_ESSAIS }).map((_, i) => (
            <div
              key={i}
              className="flex-1 h-2"
              style={{
                background:
                  i < etat.resultats.length
                    ? etat.resultats[i]
                      ? "#E3A53A"
                      : "#C2624E"
                    : "rgba(236,230,216,0.12)",
              }}
            />
          ))}
        </div>
      </div>

      {/* Indices révélés */}
      <div className="border-t border-border/50">
        {Array.from({ length: Math.min(indicesVisibles + 1, MAX_ESSAIS) }).map((_, i) => (
          <div
            key={i}
            className="flex items-baseline justify-between py-3 border-b border-border/40"
          >
            <span className="font-mono-label text-[#7C7565]">
              Indice {i + 1} · {INDICES_LABELS[i]}
            </span>
            <span className="text-base font-semibold">
              {getIndice(contenu as Parameters<typeof getIndice>[0], i)}
            </span>
          </div>
        ))}
      </div>

      {/* Fin de partie */}
      {etat.etat !== "en-cours" ? (
        <div
          className="p-4 border text-sm font-mono"
          style={{
            borderColor: etat.etat === "gagne" ? "#E3A53A" : "rgba(194,98,78,0.5)",
            color: etat.etat === "gagne" ? "#E3A53A" : "#C2624E",
          }}
        >
          {feedback}
        </div>
      ) : (
        /* Input */
        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              ref={inputRef}
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

          {feedback && (
            <p className="font-mono text-sm text-[#C2624E]">{feedback}</p>
          )}
        </div>
      )}
    </div>
  );
}
