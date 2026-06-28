"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import type { NouveautesParPlateforme, ContexteTemporel, ModeAffichage } from "@/types";
import SectionPlateforme from "@/components/SectionPlateforme";
import NavigationTemporelle from "@/components/NavigationTemporelle";

type TypeFiltre = "tous" | "serie" | "film";
type GenreFiltre = "tout" | "documentaire" | "animation";

function matchGenre(genres: { nom: string }[], filtre: GenreFiltre): boolean {
  if (filtre === "tout") return true;
  if (filtre === "animation") return genres.some((g) => g.nom.toLowerCase().includes("animat"));
  if (filtre === "documentaire") return genres.some((g) => g.nom.toLowerCase().includes("document"));
  return true;
}

interface Props {
  plateformes: NouveautesParPlateforme[];
  contexte: ContexteTemporel;
}

const GENRES_FILTRES = [
  { val: "tout" as GenreFiltre, label: "Tout" },
  { val: "documentaire" as GenreFiltre, label: "▣ Documentaires" },
  { val: "animation" as GenreFiltre, label: "✦ Animation" },
];

const MODES_AFFICHAGE: { val: ModeAffichage; icon: string; title: string }[] = [
  { val: "liste", icon: "≡", title: "Liste" },
  { val: "rails", icon: "⊟", title: "Rails" },
  { val: "grille", icon: "⊞", title: "Grille" },
];

export default function AccueilClient({ plateformes, contexte }: Props) {
  const [typeFiltre, setTypeFiltre] = useState<TypeFiltre>("serie");
  const [genreFiltre, setGenreFiltre] = useState<GenreFiltre>("tout");
  const [pfFiltre, setPfFiltre] = useState<number | null>(null);
  const [mode, setMode] = useState<ModeAffichage>("liste");
  const [isSticky, setIsSticky] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsSticky(!entry.isIntersecting),
      { threshold: 0, rootMargin: "-1px 0px 0px 0px" }
    );
    if (sentinelRef.current) observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, []);

  // Plateformes qui ont du contenu pour le type et genre actifs
  const pfsDispo = useMemo(
    () =>
      plateformes
        .filter((p) => {
          const hasSeries =
            typeFiltre !== "film" &&
            p.series.some((s) => matchGenre(s.genres, genreFiltre));
          const hasFilms =
            typeFiltre !== "serie" &&
            p.films.some((f) => matchGenre(f.genres, genreFiltre));
          return hasSeries || hasFilms;
        })
        .map((p) => p.plateforme),
    [plateformes, typeFiltre, genreFiltre]
  );

  // Réinitialiser le filtre plateforme si la plateforme choisie disparaît
  useEffect(() => {
    if (pfFiltre !== null && !pfsDispo.some((p) => p.id === pfFiltre)) {
      setPfFiltre(null);
    }
  }, [pfsDispo, pfFiltre]);

  // Filtrage des données
  const filtrees = useMemo(() => {
    return plateformes
      .filter((pf) => pfFiltre === null || pf.plateforme.id === pfFiltre)
      .map((pf) => {
        let series = pf.series;
        let films = pf.films;

        if (typeFiltre === "serie") films = [];
        if (typeFiltre === "film") series = [];

        if (genreFiltre !== "tout") {
          series = series.filter((s) => matchGenre(s.genres, genreFiltre));
          films = films.filter((f) => matchGenre(f.genres, genreFiltre));
        }

        return { ...pf, series, films };
      })
      .filter((pf) => pf.series.length + pf.films.length > 0);
  }, [plateformes, typeFiltre, genreFiltre, pfFiltre]);

  function toggleType(t: "serie" | "film") {
    setTypeFiltre((prev) => (prev === t ? "tous" : t));
  }

  return (
    <div className="sa-container py-4">
      {/* Sentinel pour la détection sticky */}
      <div ref={sentinelRef} className="h-px -mt-px" />

      {/* ─── BARRE DE FILTRES STICKY ─── */}
      <div
        className="sticky top-0 z-20 sa-sticky-bleed transition-all duration-150"
        style={{
          background: isSticky ? "rgba(22,20,15,0.96)" : "transparent",
          backdropFilter: isSticky ? "blur(14px)" : "none",
          borderBottom: isSticky ? "1px solid rgba(236,230,216,0.08)" : "none",
        }}
      >
        {/* Ligne 1 : onglets Séries/Films + filtre genre */}
        <div className="flex items-center justify-between flex-wrap gap-3 py-3 border-b border-border/20">
          {/* Tabs type */}
          <div className="flex items-baseline gap-5">
            <button
              onClick={() => toggleType("serie")}
              className="text-[22px] font-extrabold tracking-[-0.02em] pb-0.5 border-b-2 transition-colors"
              style={{
                color: typeFiltre === "serie" ? "#ECE6D8" : "#4A4437",
                borderColor: typeFiltre === "serie" ? "#E3A53A" : "transparent",
              }}
            >
              Séries
            </button>
            <button
              onClick={() => toggleType("film")}
              className="text-[22px] font-extrabold tracking-[-0.02em] pb-0.5 border-b-2 transition-colors"
              style={{
                color: typeFiltre === "film" ? "#ECE6D8" : "#4A4437",
                borderColor: typeFiltre === "film" ? "#E3A53A" : "transparent",
              }}
            >
              Films
            </button>
          </div>

          {/* Filtres genre */}
          <div className="flex items-center gap-2 font-mono-label flex-wrap">
            <span className="text-[#4A4437]">Filtrer :</span>
            {GENRES_FILTRES.map(({ val, label }) => (
              <button
                key={val}
                onClick={() => setGenreFiltre((prev) => (prev === val ? "tout" : val))}
                className="px-3 py-1.5 border transition-colors"
                style={{
                  borderColor: genreFiltre === val ? "#E3A53A" : "rgba(236,230,216,0.15)",
                  color: genreFiltre === val ? "#E3A53A" : "#9A9282",
                  background: genreFiltre === val ? "rgba(227,165,58,0.06)" : "transparent",
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Ligne 2 : navigation temporelle */}
        <div className="py-3 border-b border-border/20">
          <NavigationTemporelle contexte={contexte} />
        </div>

        {/* Ligne 3 : plateformes + mode d'affichage */}
        <div className="flex items-center justify-between py-2.5 flex-wrap gap-2">
          {/* Chips plateforme */}
          <div className="flex items-center gap-2 flex-wrap font-mono-label">
            <span className="text-[#4A4437]">Plateforme :</span>
            <button
              onClick={() => setPfFiltre(null)}
              className="px-3 py-1.5 border transition-colors"
              style={{
                borderColor: pfFiltre === null ? "rgba(236,230,216,0.6)" : "rgba(236,230,216,0.15)",
                color: pfFiltre === null ? "#ECE6D8" : "#9A9282",
              }}
            >
              Toutes
            </button>
            {pfsDispo.map((pf) => (
              <button
                key={pf.id}
                onClick={() => setPfFiltre(pf.id === pfFiltre ? null : pf.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 border transition-colors font-mono-label"
                style={{
                  borderColor: pf.id === pfFiltre ? pf.couleur : "rgba(236,230,216,0.15)",
                  color: pf.id === pfFiltre ? pf.couleur : "#9A9282",
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    width: "10px",
                    height: "3px",
                    background: pf.couleur,
                    flexShrink: 0,
                  }}
                />
                {pf.nom.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Icônes mode d'affichage */}
          <div className="flex border border-border/30">
            {MODES_AFFICHAGE.map(({ val, icon, title }, i) => (
              <button
                key={val}
                onClick={() => setMode(val)}
                title={title}
                className="w-9 h-9 flex items-center justify-center text-lg transition-colors"
                style={{
                  borderLeft: i > 0 ? "1px solid rgba(236,230,216,0.12)" : "none",
                  background: mode === val ? "rgba(236,230,216,0.08)" : "transparent",
                  color: mode === val ? "#ECE6D8" : "#4A4437",
                }}
              >
                {icon}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ─── CONTENU FILTRÉ ─── */}
      <div className="mt-6 space-y-10">
        {filtrees.length === 0 ? (
          <div className="py-20 text-center">
            <p
              className="text-xl text-[#9A9282] italic"
              style={{ fontFamily: "var(--font-newsreader), serif" }}
            >
              Aucun contenu ne correspond à ces filtres.
            </p>
          </div>
        ) : (
          filtrees.map((data, i) => (
            <SectionPlateforme
              key={data.plateforme.id}
              data={data}
              mode={mode}
              priorite={i === 0}
            />
          ))
        )}
      </div>
    </div>
  );
}
