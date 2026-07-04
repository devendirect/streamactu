"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import type { RetrouveurResultat } from "@/types";
import { evenementGA } from "@/lib/ga";

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

const TYPE_MARK: Record<string, string> = { serie: "▣", film: "◈" };
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
    <div className="sa-container py-8 pb-20">
      {/* ── Intro ── */}
      <div className="font-mono-label text-ink-3 mb-4">Retrouver un film, une série</div>
      <h1 className="font-extrabold tracking-[-0.028em] leading-[1.02] mb-2 text-[clamp(30px,5vw,44px)] max-w-[18ch]">
        Décrivez-le.{" "}
        <span className="font-serif italic font-medium text-primary">On le retrouve.</span>
      </h1>
      <p className="mb-7 font-serif text-[17px] leading-[1.5] text-ink-3 max-w-[54ch]">
        Un bout d&apos;intrigue, une ambiance, l&apos;acteur dont vous avez oublié le nom — racontez
        sans mots-clés. Claude lit, comprend, et explique pourquoi chaque titre colle.
      </p>

      {/* ── Prompt box ── */}
      <div
        className="border bg-gradient-to-b from-[rgba(236,230,216,0.035)] to-[rgba(236,230,216,0.012)] transition-colors duration-200"
        style={{ borderColor: isActive ? "rgba(227,165,58,0.5)" : "rgba(236,230,216,0.18)" }}
      >
        <textarea
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
          className="w-full resize-none bg-transparent border-none text-foreground text-2xl font-medium leading-[1.32] tracking-[-0.015em] pt-[22px] px-[22px] pb-1.5 outline-none"
        />
        <div className="flex items-center justify-between gap-3.5 flex-wrap pt-2.5 pr-4 pb-3.5 pl-[22px]">
          {/* Toggle FR only */}
          <button
            onClick={() => setFrOnly((v) => !v)}
            aria-pressed={frOnly}
            className={`inline-flex items-center gap-2.5 bg-transparent border-none cursor-pointer py-1.5 font-mono text-[11px] tracking-[0.05em] ${frOnly ? "text-foreground" : "text-[#9A9282]"}`}
          >
            {/* Toggle pill */}
            <span
              className={`relative w-[30px] h-[17px] rounded-[9px] shrink-0 transition-colors duration-150 ${frOnly ? "bg-primary" : "bg-[rgba(236,230,216,0.16)]"}`}
            >
              <span
                className={`absolute top-[2px] left-[2px] w-[13px] h-[13px] rounded-full transition-transform duration-150 ${frOnly ? "translate-x-[13px] bg-background" : "translate-x-0 bg-foreground"}`}
              />
            </span>
            Dispo en streaming FR uniquement
          </button>

          {/* Bouton soumettre */}
          <button
            onClick={submit}
            disabled={isActive}
            className={`inline-flex items-center gap-2.5 border-none text-background font-mono-label font-semibold px-5 py-3 transition-colors ${isActive ? "bg-primary/40 cursor-not-allowed" : "bg-primary cursor-pointer"}`}
          >
            {isActive ? "Recherche…" : "Retrouver"}&nbsp;
            <span aria-hidden="true" className="text-sm">→</span>
          </button>
        </div>
      </div>

      {/* ── Exemples ── */}
      <div className="flex flex-wrap items-center gap-2 mt-3.5">
        <span className="font-mono-label text-ink-4 mr-1">Essayez</span>
        {EXEMPLES.map((ex) => (
          <button
            key={ex}
            onClick={() => setExemple(ex)}
            className="bg-transparent border border-[rgba(236,230,216,0.16)] text-[#B6AD9B] cursor-pointer font-serif italic text-sm px-[13px] py-[7px] rounded-full"
          >
            {ex}
          </button>
        ))}
      </div>

      {/* ── Workspace ── */}
      {state.phase !== "idle" && (
        <div className="mt-10">
          {/* Thinking indicator */}
          {state.phase === "thinking" && (
            <div className="font-mono-label text-[#9A9282] flex items-center gap-2.5">
              <span
                aria-hidden="true"
                className="w-5 h-5 inline-flex items-center justify-center text-[13px] text-background bg-primary rounded-full"
                style={{ animation: "spin 1.5s linear infinite" }}
              >
                ✦
              </span>
              Claude analyse votre description…
            </div>
          )}

          {/* Critères */}
          {state.criteres.length > 0 && (
            <div className="border-t border-[rgba(236,230,216,0.1)] pt-6">
              <div className="flex items-center gap-2.5 mb-3.5">
                <span
                  aria-hidden="true"
                  className="w-5 h-5 inline-flex items-center justify-center text-[13px] text-background bg-primary rounded-full"
                >
                  ✦
                </span>
                <span className="font-mono-label text-[#9A9282]">Ce que Claude a compris</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {state.criteres.map(([label, valeur], i) => (
                  <div
                    key={i}
                    className="inline-flex items-baseline gap-2 border border-[rgba(227,165,58,0.32)] bg-[rgba(227,165,58,0.07)] px-[13px] py-2 opacity-0"
                    style={{ animation: "scu-rise 360ms ease forwards", animationDelay: `${i * 80}ms` }}
                  >
                    <span
                      className="font-mono-label text-[#C08A2E]"
                      style={{ fontSize: "9px", letterSpacing: "0.16em" }}
                    >
                      {label}
                    </span>
                    <span className="text-sm font-medium text-foreground">{valeur}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Raisonnement */}
          {state.raisonnement && (
            <p
              className="mt-[22px] mb-0 font-serif italic text-[19px] leading-[1.5] text-[#C7BEAC] max-w-[62ch]"
              style={{ animation: "scu-rise 400ms ease forwards" }}
            >
              {state.raisonnement}
            </p>
          )}

          {/* Header résultats */}
          {resultatsAffiches.length > 0 && (
            <div className="flex items-baseline justify-between gap-3.5 flex-wrap mt-[34px] mb-1 pt-[22px] border-t border-[rgba(236,230,216,0.1)]">
              <span className="font-mono-label text-[#9A9282]">
                {resultatsAffiches.length} titre{resultatsAffiches.length > 1 ? "s" : ""} trouvé{resultatsAffiches.length > 1 ? "s" : ""}
              </span>
              <span className="font-mono-label text-ink-3">
                {frOnly && masques > 0
                  ? `${masques} masqué${masques > 1 ? "s" : ""} · hors streaming FR`
                  : "classé par pertinence"}
              </span>
            </div>
          )}

          {/* Résultats */}
          <div>
            {resultatsAffiches.map((r, idx) => (
              <ResultatCard key={r.slug} resultat={r} idx={idx} />
            ))}
          </div>

          {/* Erreur */}
          {state.phase === "error" && (
            <p className="font-mono-label text-[#C2624E] mt-6">{state.erreur}</p>
          )}
        </div>
      )}

      {/* Animations globales */}
      <style>{`
        @keyframes scu-rise {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

function ResultatCard({ resultat: r, idx }: { resultat: RetrouveurResultat; idx: number }) {
  return (
    <div
      className={`flex gap-[22px] py-6 opacity-0 ${idx === 0 ? "" : "border-t border-[rgba(236,230,216,0.1)]"}`}
      style={{ animation: "scu-rise 420ms ease forwards", animationDelay: `${idx * 100}ms` }}
    >
      {/* Poster */}
      <Link href={`/${r.type}/${r.slug}`} className="shrink-0">
        <div className="relative w-[84px] h-[126px] shrink-0 overflow-hidden border border-[rgba(236,230,216,0.14)] bg-gradient-to-br from-[#2A2620] to-[#120F0B]">
          {r.poster ? (
            <Image src={r.poster} alt={r.titre} fill sizes="84px" className="object-cover" />
          ) : (
            <>
              {/* Placeholder stylisé comme la maquette */}
              <div className="absolute inset-0 opacity-40 bg-[repeating-linear-gradient(0deg,rgba(0,0,0,0.1)_0_2px,transparent_2px_4px)]" />
              <div className="absolute left-[9px] right-[9px] bottom-2.5 font-extrabold text-xs leading-[0.96] tracking-[-0.01em] uppercase text-[#F3ECDD] [text-shadow:0_2px_12px_rgba(0,0,0,0.6)]">
                {r.titre}
              </div>
              <div aria-hidden="true" className="absolute top-[7px] left-2 font-mono text-[11px] text-[rgba(243,236,221,0.85)]">
                {TYPE_MARK[r.type]}
              </div>
            </>
          )}
        </div>
      </Link>

      {/* Infos */}
      <div className="flex-1 min-w-0">
        {/* Meta ligne */}
        <div className="font-mono-label flex items-baseline gap-3 mb-[5px] flex-wrap">
          <span className="text-[#9A9282]">{TYPE_LABEL[r.type]}</span>
          {r.annee > 0 && <span className="text-ink-3">{r.annee}</span>}
          {r.note > 0 && <span className="text-primary">★ {r.note.toFixed(1)}</span>}
        </div>

        {/* Titre */}
        <Link href={`/${r.type}/${r.slug}`}>
          <h3 className="m-0 mb-[7px] text-[25px] font-semibold tracking-[-0.015em] text-foreground leading-[1.1] hover:text-primary transition-colors">
            {r.titre}
          </h3>
        </Link>

        {/* Genres */}
        {r.genres.length > 0 && (
          <div className="font-mono-label text-ink-3 mb-[13px]">
            {r.genres.slice(0, 3).join(" · ")}
          </div>
        )}

        {/* Explication "Ça colle parce que" */}
        <div className="flex gap-3">
          <span aria-hidden="true" className="shrink-0 w-[2px] bg-primary self-stretch" />
          <p className="m-0 font-serif text-base leading-[1.5] text-[#B6AD9B]">
            <span className="italic text-primary">Ça colle parce que </span>
            {r.pourquoi}
          </p>
        </div>

        {/* Dispo */}
        <div className="mt-[13px] flex gap-2 flex-wrap">
          {r.dispo.length > 0 ? (
            r.dispo.slice(0, 3).map((p) => (
              <span
                key={p}
                className="font-mono-label text-background bg-[#C7BEAC] px-2 py-[3px]"
                style={{ fontSize: "10px", letterSpacing: "0.1em" }}
              >
                {p}
              </span>
            ))
          ) : (
            <span
              className="font-mono-label text-ink-3 border border-[rgba(236,230,216,0.18)] px-2 py-[3px]"
              style={{ fontSize: "10px" }}
            >
              Hors streaming
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
