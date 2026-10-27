"use client";

import { useMemo, useState } from "react";
import type { NouveautesParPlateforme, ContexteTemporel } from "@/types";
import SectionPlateforme from "@/components/SectionPlateforme";
import NavigationTemporelle from "@/components/NavigationTemporelle";
import PastillePlateforme from "@/components/PastillePlateforme";

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

const TYPES: { val: TypeFiltre; label: string }[] = [
  { val: "tous", label: "Tout" },
  { val: "serie", label: "Séries" },
  { val: "film", label: "Films" },
];

const GENRES_FILTRES: { val: GenreFiltre; label: string }[] = [
  { val: "tout", label: "Tous les genres" },
  { val: "documentaire", label: "Documentaires" },
  { val: "animation", label: "Animation" },
];

/**
 * Vues jour, semaine et mois : barre collante (type, genre, période,
 * plateforme), puis une grille d'affiches par plateforme.
 */
export default function AccueilClient({ plateformes, contexte }: Props) {
  const [typeFiltre, setTypeFiltre] = useState<TypeFiltre>("serie");
  const [genreFiltre, setGenreFiltre] = useState<GenreFiltre>("tout");
  const [pfFiltre, setPfFiltre] = useState<number | null>(null);

  // Plateformes qui ont du contenu pour le type et genre actifs
  const pfsDispo = useMemo(
    () =>
      plateformes
        .filter((p) => {
          const hasSeries = typeFiltre !== "film" && p.series.some((s) => matchGenre(s.genres, genreFiltre));
          const hasFilms = typeFiltre !== "serie" && p.films.some((f) => matchGenre(f.genres, genreFiltre));
          return hasSeries || hasFilms;
        })
        .map((p) => p.plateforme),
    [plateformes, typeFiltre, genreFiltre]
  );

  // Filtre plateforme effectif : ignoré si la plateforme choisie n'a plus
  // de contenu pour le type/genre actifs (dérivé au rendu, pas d'effet)
  const pfFiltreEffectif = pfFiltre !== null && pfsDispo.some((p) => p.id === pfFiltre) ? pfFiltre : null;

  // Filtrage des données
  const filtrees = useMemo(() => {
    return plateformes
      .filter((pf) => pfFiltreEffectif === null || pf.plateforme.id === pfFiltreEffectif)
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
  }, [plateformes, typeFiltre, genreFiltre, pfFiltreEffectif]);

  return (
    <div className="px-gouttiere pb-4">
      {/* ─── Barre de filtres collante, sous l'en-tête ─── */}
      <div className="sticky top-entete z-30 -mx-gouttiere space-y-3 border-b border-trait bg-[rgba(10,10,11,0.86)] px-gouttiere py-3 backdrop-blur-[16px]">
        <div className="flex flex-wrap items-center gap-3">
          <div role="group" aria-label="Type" className="segments">
            {TYPES.map(({ val, label }) => (
              <button key={val} type="button" aria-pressed={typeFiltre === val} onClick={() => setTypeFiltre(val)}>
                {label}
              </button>
            ))}
          </div>
          <div role="group" aria-label="Genre" className="flex flex-wrap gap-2">
            {GENRES_FILTRES.map(({ val, label }) => (
              <button
                key={val}
                type="button"
                aria-pressed={genreFiltre === val}
                onClick={() => setGenreFiltre(val)}
                className="puce"
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <NavigationTemporelle contexte={contexte} />

        <div
          role="group"
          aria-label="Plateforme"
          className="flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <button type="button" aria-pressed={pfFiltreEffectif === null} onClick={() => setPfFiltre(null)} className="puce">
            Toutes les plateformes
          </button>
          {pfsDispo.map((pf) => (
            <button
              key={pf.id}
              type="button"
              aria-pressed={pf.id === pfFiltreEffectif}
              onClick={() => setPfFiltre(pf.id === pfFiltreEffectif ? null : pf.id)}
              className="puce"
            >
              <PastillePlateforme pf={pf} />
            </button>
          ))}
        </div>
      </div>

      {/* ─── Contenu filtré ─── */}
      <div className="mt-8 space-y-section">
        {filtrees.length === 0 ? (
          <p className="py-20 text-center text-xl text-texte-2">Aucun contenu ne correspond à ces filtres.</p>
        ) : (
          filtrees.map((data, i) => <SectionPlateforme key={data.plateforme.id} data={data} priorite={i === 0} />)
        )}
      </div>
    </div>
  );
}
