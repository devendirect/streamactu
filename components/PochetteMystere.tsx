"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import type { Contenu } from "@/types";
import { formatDateFR, normaliser } from "@/lib/utils";
import PartagerResultat from "@/components/PartagerResultat";

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

const ETAT_INITIAL: PartieState = { nbEssais: 0, etat: "en-cours" };

export default function PochetteMystere({ contenu, dateISO }: PochetteMystereProps) {
  const cleLS = `pochette-${dateISO}`;
  // Le premier rendu doit être identique côté serveur et client (hydratation) :
  // la partie sauvegardée est restaurée après montage, pas dans l'initialiseur.
  const [partie, setPartie] = useState<PartieState>(ETAT_INITIAL);
  const restaureRef = useRef(false);

  const [valeur, setValeur] = useState("");
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(cleLS);
      if (saved) {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- restauration localStorage post-hydratation, un seul re-rendu
        setPartie(JSON.parse(saved) as PartieState);
      }
    } catch {
      // sauvegarde corrompue — on repart de zéro
    }
    restaureRef.current = true;
  }, [cleLS]);

  useEffect(() => {
    if (!restaureRef.current) return;
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
      setFeedback(`Raté, la pochette se dévoile un peu plus.`);
    }
  }

  function revelerIndice() {
    if (partie.nbEssais < MAX_ESSAIS && partie.etat === "en-cours") {
      setPartie((p) => ({ ...p, nbEssais: p.nbEssais + 1 }));
      setFeedback("Indice suivant révélé.");
    }
  }

  const termine = partie.etat !== "en-cours";

  return (
    <div className="space-y-5">
      {/* Saisie en tête, ou le résultat une fois la partie finie */}
      {termine ? (
        <div className="space-y-3">
          <p
            role="status"
            className={`rounded-[10px] px-4 py-3 font-semibold ${partie.etat === "gagne" ? "bg-ambre/15 text-ambre" : "bg-black/25 text-lumiere"}`}
          >
            {/* feedback vide après rechargement de la page → texte reconstruit */}
            {(feedback || (partie.etat === "gagne" ? "Bravo, pochette trouvée !" : `C'était : ${contenu.titre}`)).replace("🎉 ", "")}
          </p>
          <PartagerResultat
            texte={[
              `Pochette mystère · ${formatDateFR(dateISO)} · StreamActu.fr`,
              `${Array.from({ length: partie.nbEssais }, (_, i) =>
                partie.etat === "gagne" && i === partie.nbEssais - 1 ? "🟨" : "⬛"
              ).join("")} ${partie.etat === "gagne" ? `${partie.nbEssais}/${MAX_ESSAIS}` : `✗/${MAX_ESSAIS}`}`,
              "streamactu.fr/jeux",
            ].join("\n")}
          />
        </div>
      ) : (
        <div className="space-y-2.5">
          <div className="flex gap-2">
            <label htmlFor="reponse-pochette" className="sr-only">
              Votre réponse
            </label>
            <input
              id="reponse-pochette"
              type="text"
              value={valeur}
              onChange={(e) => setValeur(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && tenter()}
              placeholder="Votre réponse…"
              autoComplete="off"
              className="h-[50px] min-w-0 flex-1 rounded-[10px] border border-white/20 bg-black/35 px-4 text-base text-texte caret-ambre transition-colors duration-200 placeholder:text-velours-texte/70 focus:border-lumiere focus:outline-none focus-visible:outline-none"
            />
            <button type="button" onClick={tenter} className="btn-blanc">
              Tenter
            </button>
          </div>
          {feedback && (
            <p role="status" className="text-sm text-velours-texte">
              {feedback}
            </p>
          )}
        </div>
      )}

      {/* Essais : barres de 6 px */}
      <div className="flex gap-1.5" aria-hidden="true">
        {Array.from({ length: MAX_ESSAIS }).map((_, i) => (
          <span
            key={i}
            className={`h-1.5 flex-1 rounded-full ${
              i < partie.nbEssais
                ? partie.etat === "gagne" && i === partie.nbEssais - 1
                  ? "bg-ambre"
                  : "bg-alerte"
                : "bg-white/15"
            }`}
          />
        ))}
      </div>

      {/* Pochette floutée, de plus en plus nette à chaque erreur */}
      <div className="relative mx-auto h-[276px] w-[184px] overflow-hidden rounded-[10px] bg-black/30 shadow-[0_14px_24px_-12px_rgba(0,0,0,0.9)]">
        {contenu.poster && (
          <Image
            src={contenu.poster}
            alt="Pochette mystère"
            fill
            className="object-cover transition-[filter,transform] duration-700 ease-salle"
            style={{ filter: `blur(${blur}px)`, transform: `scale(1.${blur > 0 ? "1" : "0"})` }}
            sizes="184px"
          />
        )}
      </div>

      {termine && <p className="text-center text-xl font-extrabold tracking-[-0.02em]">{contenu.titre}</p>}

      {!termine && (
        <button
          type="button"
          onClick={revelerIndice}
          disabled={partie.nbEssais >= MAX_ESSAIS - 1}
          className="mx-auto flex h-11 items-center gap-2 rounded-full border border-lumiere/30 px-5 text-sm font-semibold text-lumiere transition-colors duration-200 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Révéler un indice (un essai en moins)
        </button>
      )}
    </div>
  );
}
