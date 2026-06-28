"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Contenu } from "@/types";

type FiltreType = "tous" | "serie" | "film";

const FILTRES: { label: string; value: FiltreType }[] = [
  { label: "Série", value: "serie" },
  { label: "Film", value: "film" },
  { label: "Peu importe", value: "tous" },
];

interface SurpriseClientProps {
  initialContenu: Contenu;
}

export default function SurpriseClient({ initialContenu }: SurpriseClientProps) {
  const [contenu, setContenu] = useState<Contenu>(initialContenu);
  const [filtre, setFiltre] = useState<FiltreType>("tous");
  const [loading, setLoading] = useState(false);

  async function autreSuggestion() {
    setLoading(true);
    try {
      const res = await fetch(`/api/surprise?type=${filtre}`);
      const data = (await res.json()) as Contenu;
      setContenu(data);
    } catch {
      // silently fail — keep current content
    } finally {
      setLoading(false);
    }
  }

  const href = `/${contenu.type}/${contenu.slug}`;
  const labelType = contenu.type === "serie" ? "Série" : "Film";

  return (
    <div className="flex flex-col items-center text-center space-y-6 max-w-sm mx-auto">
      {/* Label */}
      <p className="font-mono-label text-[#7C7565]">Le tirage du soir</p>

      {/* Toggle filtre */}
      <div className="flex border border-border/50">
        {FILTRES.map((f) => (
          <button
            key={f.value}
            onClick={() => setFiltre(f.value)}
            className="px-4 py-2 text-sm font-medium transition-colors border-l border-border/50 first:border-l-0"
            style={{
              background: filtre === f.value ? "#ECE6D8" : "transparent",
              color: filtre === f.value ? "#16140F" : "#9A9282",
              fontWeight: filtre === f.value ? 600 : 400,
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Pochette */}
      <Link href={href} className="group">
        <div className="relative w-[184px] h-[276px] border border-border overflow-hidden bg-card">
          {contenu.poster ? (
            <Image
              src={contenu.poster}
              alt={contenu.titre}
              fill
              className={`object-cover transition-opacity duration-300 group-hover:opacity-80 ${loading ? "opacity-30" : "opacity-100"}`}
              sizes="184px"
              priority
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
          )}
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-mono-label text-[#9A9282] animate-pulse">…</span>
            </div>
          )}
          {/* Titre en bas */}
          <div className="absolute left-3 right-3 bottom-4">
            <p className="font-extrabold text-lg leading-tight uppercase text-[#F3ECDD] drop-shadow-lg">
              {contenu.titre}
            </p>
          </div>
        </div>
      </Link>

      {/* Méta */}
      <div className="space-y-1">
        <div className="flex items-baseline justify-center gap-2 font-mono-label text-[#9A9282]">
          <span className="text-[11px] text-foreground">{contenu.type === "serie" ? "▣" : "◈"}</span>
          {labelType}
          {contenu.annee > 0 && <span>· {contenu.annee}</span>}
          {contenu.note > 0 && <span className="text-primary">· ★ {contenu.note.toFixed(1)}</span>}
        </div>

        <Link href={href}>
          <h1 className="text-2xl font-extrabold tracking-tight hover:text-primary transition-colors">
            {contenu.titre}
          </h1>
        </Link>

        {contenu.synopsis && (
          <p
            className="text-sm leading-relaxed text-[#B6AD9B] max-w-[32ch] mx-auto"
            style={{ fontFamily: "var(--font-newsreader), serif" }}
          >
            {contenu.synopsis.slice(0, 120)}
            {contenu.synopsis.length > 120 ? "…" : ""}
          </p>
        )}
      </div>

      {/* Bouton autre suggestion */}
      <button
        onClick={autreSuggestion}
        disabled={loading}
        className="w-full border border-border/50 py-3.5 font-mono-label text-foreground hover:border-primary hover:text-primary transition-colors disabled:opacity-40"
      >
        ⟳ Autre suggestion
      </button>
    </div>
  );
}
