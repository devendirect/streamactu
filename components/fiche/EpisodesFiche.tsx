"use client";
import { useState } from "react";

export interface EpisodeCarte {
  numero: number;
  /** YYYY-MM-DD (date française si connue), null si pas encore datée */
  date: string | null;
  duree: number | null;
}

interface Props {
  /** Saison en cours (celle du calendrier), détaillée en cartes */
  saisonCourante: number;
  episodes: EpisodeCarte[];
  saisons: { numero: number; nom: string; nbEpisodes: number; annee: string | null }[];
  aujourdhui: string;
  /** « 28 oct. » : formaté côté serveur pour éviter tout écart d'hydratation */
  dates: Record<string, string>;
}

/**
 * Épisodes en cartes, saison par saison : la saison en cours en détail
 * (numéro détouré, durée, date ou « Disponible »), les autres en résumé.
 */
export default function EpisodesFiche({ saisonCourante, episodes, saisons, aujourdhui, dates }: Props) {
  const [choisie, setChoisie] = useState(saisonCourante);
  const resume = saisons.find((s) => s.numero === choisie);

  return (
    <>
      {saisons.length > 1 && (
        <div className="mb-[18px] max-w-full overflow-x-auto">
          <div role="tablist" aria-label="Saisons" className="segments">
            {saisons.map((s) => (
              <button
                key={s.numero}
                type="button"
                role="tab"
                aria-selected={s.numero === choisie}
                onClick={() => setChoisie(s.numero)}
              >
                {s.nom}
              </button>
            ))}
          </div>
        </div>
      )}

      {choisie === saisonCourante ? (
        <div className="episodes">
          {episodes.map((e) => {
            const futur = !e.date || e.date > aujourdhui;
            return (
              <article key={e.numero} className={`ep ${futur ? "ep--futur" : ""}`}>
                <span aria-hidden="true" className="ep__num">
                  {e.numero}
                </span>
                <strong className="pr-[60px] text-base">Épisode {e.numero}</strong>
                <span className="mt-auto flex justify-between gap-2.5 text-[13.5px] text-texte-2">
                  <span>{e.duree ? `${e.duree} min` : ""}</span>
                  <span className={futur ? "font-bold text-ambre" : "text-texte-doux"}>
                    {!e.date ? "Date à venir" : futur ? dates[e.date] : "Disponible"}
                  </span>
                </span>
              </article>
            );
          })}
        </div>
      ) : (
        resume && (
          <p className="max-w-[520px] rounded-xl bg-surface p-[18px] text-texte-doux">
            {resume.nom} :{" "}
            {resume.nbEpisodes > 0 ? `${resume.nbEpisodes} épisode${resume.nbEpisodes > 1 ? "s" : ""}` : "épisodes à venir"}
            {resume.annee ? `, diffusée en ${resume.annee}` : ""}.
          </p>
        )
      )}
    </>
  );
}
