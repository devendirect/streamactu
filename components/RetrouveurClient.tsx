"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import type { RetrouveurResultat } from "@/types";
import { evenementGA } from "@/lib/ga";
import { altAffiche } from "@/lib/utils";
import { plateformesDepuisFournisseurs } from "@/lib/plateformes";
import Faisceau from "@/components/Faisceau";
import Icone from "@/components/Icone";
import PastillePlateforme from "@/components/PastillePlateforme";

const EXEMPLES = [
  "un thriller dont la fin retourne complètement le cerveau",
  "une série feel-good réconfortante pour décompresser le soir",
  "une comédie romantique à New York dans les années 90",
];

type Phase = "idle" | "thinking" | "streaming" | "done" | "error";

interface State {
  phase: Phase;
  criteres: [string, string][];
  raisonnement: string;
  resultats: RetrouveurResultat[];
  erreur: string;
}

const TYPE_LABEL: Record<string, string> = { serie: "Série", film: "Film" };

export default function RetrouveurClient() {
  const [frOnly, setFrOnly] = useState(false);
  const [state, setState] = useState<State>({
    phase: "idle",
    criteres: [],
    raisonnement: "",
    resultats: [],
    erreur: "",
  });

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const submit = useCallback(async () => {
    const description = textareaRef.current?.value.trim() ?? "";
    if (!description || state.phase === "thinking" || state.phase === "streaming") return;

    abortRef.current?.abort();
    abortRef.current = new AbortController();

    setState({ phase: "thinking", criteres: [], raisonnement: "", resultats: [], erreur: "" });

    try {
      const res = await fetch("/api/retrouver", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description }),
        signal: abortRef.current.signal,
      });

      // Limite atteinte (par visiteur ou globale) : afficher le message du serveur
      if (res.status === 429) {
        const corps = (await res.json().catch(() => ({}))) as { error?: string };
        setState((s) => ({ ...s, phase: "error", erreur: corps.error ?? "Limite atteinte. Réessayez plus tard." }));
        return;
      }
      if (!res.ok || !res.body) throw new Error("Erreur réseau");

      setState((s) => ({ ...s, phase: "streaming" }));

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let nbTrouves = 0;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.trim()) continue;
          try {
            const chunk = JSON.parse(line) as
              | { type: "criteria"; data: [string, string][] }
              | { type: "reasoning"; text: string }
              | { type: "match"; data: RetrouveurResultat }
              | { type: "error"; message: string };

            if (chunk.type === "criteria") {
              setState((s) => ({ ...s, criteres: chunk.data }));
            } else if (chunk.type === "reasoning") {
              setState((s) => ({ ...s, raisonnement: chunk.text }));
            } else if (chunk.type === "match") {
              nbTrouves++;
              setState((s) => ({ ...s, resultats: [...s.resultats, chunk.data] }));
            } else if (chunk.type === "error") {
              setState((s) => ({ ...s, phase: "error", erreur: chunk.message }));
            }
          } catch {
            // ligne mal formée — on ignore
          }
        }
      }

      evenementGA("retrouveur_utilise", { resultats: nbTrouves });
      setState((s) => ({ ...s, phase: "done" }));
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") return;
      evenementGA("retrouveur_utilise", { resultats: 0, erreur: 1 });
      setState((s) => ({ ...s, phase: "error", erreur: "Une erreur est survenue. Réessayez." }));
    }
  }, [state.phase]);

  const setExemple = (txt: string) => {
    if (textareaRef.current) textareaRef.current.value = txt;
    textareaRef.current?.focus();
  };

  const isActive = state.phase === "thinking" || state.phase === "streaming";
  const resultatsAffiches = frOnly
    ? state.resultats.filter((r) => r.dispo.length > 0)
    : state.resultats;
  const masques = state.resultats.length - resultatsAffiches.length;

  return (
    <div className="pb-16">
      {/* ── Intro sous le faisceau ── */}
      <div className="scene -mt-entete px-gouttiere pt-[clamp(130px,18vh,190px)] pb-8">
        <Faisceau doux />
        <h1 className="max-w-[18ch] text-[clamp(34px,4.6vw,64px)] leading-none font-black tracking-[-0.03em]">
          Décrivez-le. <span className="text-lumiere">On le retrouve.</span>
        </h1>
        <p className="mt-3 max-w-[58ch] text-[clamp(16px,1.2vw,18px)] text-texte-doux">
          Un bout d&apos;intrigue, une ambiance, l&apos;acteur dont vous avez oublié le nom : racontez sans mots-clés.
          Claude lit, comprend, et explique pourquoi chaque titre colle.
        </p>
      </div>

      <div className="px-gouttiere">
        {/* ── Grand champ ── */}
        <div className="max-w-[960px] rounded-2xl border border-trait bg-surface transition-colors duration-200 focus-within:border-lumiere/70">
          <label htmlFor="champ-retrouver" className="sr-only">
            Décrivez le film ou la série
          </label>
          <textarea
            id="champ-retrouver"
            ref={textareaRef}
            rows={3}
            maxLength={600}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                submit();
              }
            }}
            placeholder="Un film avec un astronaute bloqué seul sur une planète, qui doit survivre avec les moyens du bord…"
            className="w-full resize-none border-none bg-transparent px-[22px] pt-[22px] pb-1.5 text-[clamp(20px,2.2vw,26px)] leading-[1.32] font-semibold tracking-[-0.015em] text-texte caret-ambre placeholder:text-texte-2 focus:outline-none focus-visible:outline-none"
          />
          <div className="flex flex-wrap items-center justify-between gap-3.5 pt-2.5 pr-4 pb-4 pl-[22px]">
            {/* Interrupteur : titres disponibles en France seulement */}
            <button
              type="button"
              role="switch"
              aria-checked={frOnly}
              onClick={() => setFrOnly((v) => !v)}
              className={`inline-flex items-center gap-2.5 py-1.5 text-sm font-semibold ${frOnly ? "text-white" : "text-texte-2"}`}
            >
              <span
                aria-hidden="true"
                className={`relative h-[22px] w-[38px] shrink-0 rounded-full transition-colors duration-200 ${frOnly ? "bg-ambre" : "bg-white/20"}`}
              >
                <span
                  className={`absolute top-[3px] left-[3px] size-4 rounded-full transition-transform duration-200 ease-salle ${
                    frOnly ? "translate-x-4 bg-sur-ambre" : "translate-x-0 bg-white"
                  }`}
                />
              </span>
              Disponibles en streaming en France seulement
            </button>

            <button type="button" onClick={submit} disabled={isActive} className="btn-blanc disabled:cursor-not-allowed disabled:opacity-60">
              <Icone nom="loupeIA" taille={20} />
              {isActive ? "Recherche…" : "Retrouver"}
            </button>
          </div>
        </div>

        {/* ── Exemples ── */}
        <div className="mt-3.5 flex flex-wrap items-center gap-2">
          <span className="libelle mr-1 text-texte-2">Essayez</span>
          {EXEMPLES.map((ex) => (
            <button key={ex} type="button" onClick={() => setExemple(ex)} className="puce">
              {ex}
            </button>
          ))}
        </div>

        {/* ── Réponse ── */}
        {state.phase !== "idle" && (
          <div className="mt-10 max-w-[960px]" aria-live="polite">
            {state.phase === "thinking" && (
              <p role="status" className="flex items-center gap-2.5 text-texte-2">
                <Icone nom="loupeIA" taille={18} className="animate-pulse text-ambre" />
                Claude analyse votre description…
              </p>
            )}

            {/* Critères compris */}
            {state.criteres.length > 0 && (
              <div className="border-t border-trait pt-6">
                <h2 className="libelle mb-3.5 text-texte-2">Ce que Claude a compris</h2>
                <div className="flex flex-wrap gap-2">
                  {state.criteres.map(([label, valeur], i) => (
                    <div
                      key={i}
                      className="inline-flex items-baseline gap-2 rounded-full bg-surface px-3.5 py-2 opacity-0"
                      style={{ animation: "sa-monte 0.5s var(--ease-salle) forwards", animationDelay: `${i * 80}ms` }}
                    >
                      <span className="text-xs font-bold tracking-[0.06em] text-texte-2 uppercase">{label}</span>
                      <span className="text-sm font-semibold">{valeur}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Raisonnement */}
            {state.raisonnement && (
              <p className="mt-[22px] max-w-[62ch] text-[18px] leading-[1.55] text-texte-doux">{state.raisonnement}</p>
            )}

            {/* En-tête des résultats */}
            {resultatsAffiches.length > 0 && (
              <div className="mt-[34px] mb-4 flex flex-wrap items-baseline justify-between gap-3.5 border-t border-trait pt-[22px]">
                <span className="text-[clamp(19px,1.6vw,23px)] font-bold">
                  {resultatsAffiches.length} titre{resultatsAffiches.length > 1 ? "s" : ""} trouvé
                  {resultatsAffiches.length > 1 ? "s" : ""}
                </span>
                <span className="text-sm text-texte-2">
                  {frOnly && masques > 0 ? `${masques} masqué${masques > 1 ? "s" : ""}, hors streaming en France` : "Classés par pertinence"}
                </span>
              </div>
            )}

            <div className="space-y-3">
              {resultatsAffiches.map((r, idx) => (
                <ResultatCard key={r.slug} resultat={r} idx={idx} />
              ))}
            </div>

            {state.phase === "error" && <p className="mt-6 font-semibold text-alerte">{state.erreur}</p>}
          </div>
        )}
      </div>
    </div>
  );
}

/** Réponse en carte velours : affiche, titre, et pourquoi ça colle */
function ResultatCard({ resultat: r, idx }: { resultat: RetrouveurResultat; idx: number }) {
  const plateformes = plateformesDepuisFournisseurs(r.dispo);
  return (
    <article
      className="flex gap-[22px] rounded-[14px] bg-linear-135 from-velours to-velours-sombre p-5 opacity-0"
      style={{ animation: "sa-monte 0.6s var(--ease-salle) forwards", animationDelay: `${idx * 100}ms` }}
    >
      <Link href={`/${r.type}/${r.slug}`} className="shrink-0">
        <span className="relative block h-[126px] w-[84px] overflow-hidden rounded-lg bg-velours-sombre shadow-[0_14px_24px_-12px_rgba(0,0,0,0.9)]">
          {r.poster ? (
            <Image src={r.poster} alt={altAffiche(r.titre, r.type)} fill sizes="84px" className="object-cover" />
          ) : (
            <span className="absolute right-2 bottom-2.5 left-2 text-xs leading-[0.96] font-extrabold text-lumiere uppercase">
              {r.titre}
            </span>
          )}
        </span>
      </Link>

      <div className="min-w-0 flex-1">
        <p className="mb-1 flex flex-wrap items-center gap-x-2.5 text-[13.5px] text-velours-texte">
          {TYPE_LABEL[r.type]}
          {r.annee > 0 && <span>{r.annee}</span>}
          {r.note > 0 && (
            <span className="inline-flex items-center gap-1 font-bold text-white">
              <Icone nom="etoile" taille={13} className="fill-current text-ambre" />
              {r.note.toFixed(1).replace(".", ",")}
            </span>
          )}
          {r.genres.length > 0 && <span>{r.genres.slice(0, 3).join(" · ")}</span>}
        </p>

        <h3 className="mb-2.5 text-[clamp(20px,1.7vw,24px)] leading-[1.15] font-extrabold tracking-[-0.015em]">
          <Link href={`/${r.type}/${r.slug}`} className="transition-colors duration-200 hover:text-lumiere">
            {r.titre}
          </Link>
        </h3>

        <p className="leading-[1.55] text-[#EAD9D2]">
          <span className="font-bold text-lumiere">Ça colle parce que </span>
          {r.pourquoi}
        </p>

        <p className="mt-3 flex flex-wrap gap-x-3.5 gap-y-1.5 text-[13.5px] font-semibold">
          {plateformes.length > 0 ? (
            plateformes.map((pf) => <PastillePlateforme key={pf.id} pf={pf} />)
          ) : r.dispo.length > 0 ? (
            <span className="text-velours-texte">{r.dispo.slice(0, 3).join(", ")}</span>
          ) : (
            <span className="text-velours-texte">Hors streaming en France</span>
          )}
        </p>
      </div>
    </article>
  );
}
