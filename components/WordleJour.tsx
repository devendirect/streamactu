"use client";

import { useState, useEffect, useRef } from "react";
import type { Contenu } from "@/types";
import { formatDateFR, normaliser } from "@/lib/utils";
import PartagerResultat from "@/components/PartagerResultat";

interface WordleJourProps {
  contenu: Contenu & { casting?: { nom: string }[] };
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

function echapperRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function getIndice(contenu: WordleJourProps["contenu"], n: number): string {
  switch (n) {
    case 0: return String(contenu.annee || "?");
    case 1: return contenu.genres.map((g) => g.nom).join(", ") || "?";
    case 2: return contenu.casting?.slice(0, 2).map((p) => p.nom).join(", ") || "?";
    case 3: {
      if (!contenu.synopsis) return "?";
      // Masque le titre s'il apparaît dans le synopsis — sinon l'indice donne la réponse
      const masque = contenu.synopsis.replace(
        new RegExp(echapperRegex(contenu.titre), "gi"),
        "▮▮▮"
      );
      return masque.slice(0, 80) + "…";
    }
    case 4: return contenu.dispo?.length ? contenu.dispo.slice(0, 2).join(", ") : "Voir TMDB";
    case 5: return `${contenu.note.toFixed(1)} / 10`;
    default: return "?";
  }
}

type EtatJeu = "en-cours" | "gagne" | "perdu";

interface PartieState {
  essais: string[];
  resultats: boolean[];
  etat: EtatJeu;
}

const ETAT_INITIAL: PartieState = { essais: [], resultats: [], etat: "en-cours" };

export default function WordleJour({ contenu, dateISO }: WordleJourProps) {
  const cleLS = `wordle-${dateISO}`;
  // Le premier rendu doit être identique côté serveur et client (hydratation) :
  // la partie sauvegardée est restaurée après montage, pas dans l'initialiseur.
  const [etat, setEtat] = useState<PartieState>(ETAT_INITIAL);
  const restaureRef = useRef(false);

  const [valeur, setValeur] = useState("");
  const [feedback, setFeedback] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const nbEssais = etat.essais.length;
  const indicesVisibles = Math.max(0, nbEssais - 1);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(cleLS);
      if (saved) {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- restauration localStorage post-hydratation, un seul re-rendu
        setEtat(JSON.parse(saved) as PartieState);
      }
    } catch {
      // sauvegarde corrompue — on repart de zéro
    }
    restaureRef.current = true;
  }, [cleLS]);

  useEffect(() => {
    if (!restaureRef.current) return;
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
      setFeedback(`Raté, indice ${Math.min(indicesVisibles + 2, MAX_ESSAIS)} révélé.`);
    }

    inputRef.current?.focus();
  }

  const nbIndices = Math.min(indicesVisibles + 1, MAX_ESSAIS);
  const termine = etat.etat !== "en-cours";

  return (
    <div className="space-y-5">
      {/* Saisie en tête, ou le résultat une fois la partie finie */}
      {termine ? (
        <div className="space-y-3">
          <p
            role="status"
            className={`rounded-[10px] px-4 py-3 font-semibold ${etat.etat === "gagne" ? "bg-ambre/15 text-ambre" : "bg-black/25 text-lumiere"}`}
          >
            {/* feedback vide après rechargement de la page → texte reconstruit */}
            {(feedback || (etat.etat === "gagne" ? "Bravo !" : `La réponse était : ${contenu.titre}`)).replace("🎉 ", "")}
          </p>
          <PartagerResultat
            texte={[
              `Le titre du jour · ${formatDateFR(dateISO)} · StreamActu.fr`,
              `${etat.resultats.map((ok) => (ok ? "🟨" : "⬛")).join("")} ${
                etat.etat === "gagne" ? `${etat.essais.length}/${MAX_ESSAIS}` : `✗/${MAX_ESSAIS}`
              }`,
              "streamactu.fr/jeux",
            ].join("\n")}
          />
        </div>
      ) : (
        <div className="space-y-2.5">
          <div className="flex gap-2">
            <label htmlFor="reponse-titre" className="sr-only">
              Votre réponse
            </label>
            <input
              id="reponse-titre"
              ref={inputRef}
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

      {/* Essais : barres de 6 px, ambre gagné, sombre raté */}
      <div>
        <p className="tabular mb-2 text-sm text-velours-texte">
          {nbEssais}/{MAX_ESSAIS} essai{nbEssais !== 1 ? "s" : ""}
        </p>
        <div className="flex gap-1.5" aria-hidden="true">
          {Array.from({ length: MAX_ESSAIS }).map((_, i) => (
            <span
              key={i}
              className={`h-1.5 flex-1 rounded-full ${
                i < etat.resultats.length ? (etat.resultats[i] ? "bg-ambre" : "bg-alerte") : "bg-white/15"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Six indices sur deux colonnes : les suivants restent fermés */}
      <ol className="grid grid-cols-2 gap-2.5 max-[560px]:grid-cols-1">
        {INDICES_LABELS.map((label, i) => {
          const ouvert = i < nbIndices;
          return (
            <li key={label} className={`relative min-h-[84px] rounded-xl p-3.5 pr-12 ${ouvert ? "bg-black/25" : "bg-black/10"}`}>
              <span
                aria-hidden="true"
                className="font-salle tabular absolute top-2.5 right-3 text-[26px] leading-none font-black text-transparent [-webkit-text-stroke:1.5px_rgba(255,241,210,0.5)]"
              >
                {i + 1}
              </span>
              <span className="block text-xs font-bold tracking-[0.06em] text-velours-texte uppercase">{label}</span>
              <span className={`mt-1 block text-[15px] font-semibold ${ouvert ? "text-white" : "text-velours-texte/80"}`}>
                {ouvert ? getIndice(contenu, i) : "Après un essai raté"}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
