"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import type { RetrouveurResultat } from "@/types";

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

const TYPE_MARK: Record<string, string> = { serie: "▣", film: "◆" };
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
              setState((s) => ({ ...s, resultats: [...s.resultats, chunk.data] }));
            } else if (chunk.type === "error") {
              setState((s) => ({ ...s, phase: "error", erreur: chunk.message }));
            }
          } catch {
            // ligne mal formée — on ignore
          }
        }
      }

      setState((s) => ({ ...s, phase: "done" }));
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") return;
      setState((s) => ({ ...s, phase: "error", erreur: "Une erreur est survenue. Réessaie." }));
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
      <div
        className="font-mono-label mb-4"
        style={{ color: "#7C7565" }}
      >
        Retrouver un film, une série
      </div>
      <h1
        className="font-extrabold tracking-[-0.028em] leading-[1.02] mb-2"
        style={{ fontSize: "clamp(30px,5vw,44px)", maxWidth: "18ch" }}
      >
        Décrivez-le.{" "}
        <span
          style={{
            fontFamily: "var(--font-newsreader), serif",
            fontStyle: "italic",
            fontWeight: 500,
            color: "#E3A53A",
          }}
        >
          On le retrouve.
        </span>
      </h1>
      <p
        className="mb-7"
        style={{
          fontFamily: "var(--font-newsreader), serif",
          fontSize: "17px",
          lineHeight: 1.5,
          color: "#8E8676",
          maxWidth: "54ch",
        }}
      >
        Un bout d&apos;intrigue, une ambiance, l&apos;acteur dont vous avez oublié le nom — racontez
        sans mots-clés. Claude lit, comprend, et explique pourquoi chaque titre colle.
      </p>

      {/* ── Prompt box ── */}
      <div
        style={{
          border: `1px solid ${isActive ? "rgba(227,165,58,0.5)" : "rgba(236,230,216,0.18)"}`,
          background: "linear-gradient(180deg,rgba(236,230,216,0.035),rgba(236,230,216,0.012))",
          transition: "border-color 180ms ease",
        }}
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
          style={{
            width: "100%",
            resize: "none",
            background: "transparent",
            border: "none",
            color: "#ECE6D8",
            fontFamily: "var(--font-bricolage), sans-serif",
            fontSize: "24px",
            fontWeight: 500,
            lineHeight: 1.32,
            letterSpacing: "-0.015em",
            padding: "22px 22px 6px",
            outline: "none",
          }}
        />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "14px",
            padding: "10px 16px 14px 22px",
            flexWrap: "wrap",
          }}
        >
          {/* Toggle FR only */}
          <button
            onClick={() => setFrOnly((v) => !v)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "6px 0",
              fontFamily: "var(--font-spline-mono), monospace",
              fontSize: "11px",
              letterSpacing: "0.05em",
              color: frOnly ? "#ECE6D8" : "#9A9282",
            }}
          >
            {/* Toggle pill */}
            <span
              style={{
                width: "30px",
                height: "17px",
                borderRadius: "9px",
                background: frOnly ? "#E3A53A" : "rgba(236,230,216,0.16)",
                position: "relative",
                flexShrink: 0,
                transition: "background 160ms ease",
              }}
            >
              <span
                style={{
                  position: "absolute",
                  top: "2px",
                  left: "2px",
                  width: "13px",
                  height: "13px",
                  borderRadius: "50%",
                  background: frOnly ? "#16140F" : "#ECE6D8",
                  transform: frOnly ? "translateX(13px)" : "translateX(0)",
                  transition: "transform 160ms ease, background 160ms ease",
                }}
              />
            </span>
            Dispo en streaming FR uniquement
          </button>

          {/* Bouton soumettre */}
          <button
            onClick={submit}
            disabled={isActive}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              background: isActive ? "rgba(227,165,58,0.4)" : "#E3A53A",
              border: "none",
              cursor: isActive ? "not-allowed" : "pointer",
              color: "#16140F",
              fontFamily: "var(--font-spline-mono), monospace",
              fontSize: "12px",
              fontWeight: 600,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              padding: "12px 20px",
              transition: "background 120ms ease",
            }}
          >
            {isActive ? "Recherche…" : "Retrouver"}&nbsp;
            <span style={{ fontSize: "14px" }}>→</span>
          </button>
        </div>
      </div>

      {/* ── Exemples ── */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "14px", alignItems: "center" }}>
        <span className="font-mono-label" style={{ color: "#5C564A", marginRight: "4px" }}>
          Essayez
        </span>
        {EXEMPLES.map((ex) => (
          <button
            key={ex}
            onClick={() => setExemple(ex)}
            style={{
              background: "transparent",
              border: "1px solid rgba(236,230,216,0.16)",
              color: "#B6AD9B",
              cursor: "pointer",
              fontFamily: "var(--font-newsreader), serif",
              fontStyle: "italic",
              fontSize: "14px",
              padding: "7px 13px",
              borderRadius: "40px",
            }}
          >
            {ex}
          </button>
        ))}
      </div>

      {/* ── Workspace ── */}
      {state.phase !== "idle" && (
        <div style={{ marginTop: "40px" }}>

          {/* Thinking indicator */}
          {state.phase === "thinking" && (
            <div
              className="font-mono-label"
              style={{ color: "#9A9282", display: "flex", alignItems: "center", gap: "10px" }}
            >
              <span
                style={{
                  width: "20px", height: "20px", display: "inline-flex",
                  alignItems: "center", justifyContent: "center",
                  fontSize: "13px", color: "#16140F", background: "#E3A53A", borderRadius: "50%",
                  animation: "spin 1.5s linear infinite",
                }}
              >
                ✦
              </span>
              Claude analyse votre description…
            </div>
          )}

          {/* Critères */}
          {state.criteres.length > 0 && (
            <div style={{ borderTop: "1px solid rgba(236,230,216,0.1)", paddingTop: "24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
                <span
                  style={{
                    width: "20px", height: "20px", display: "inline-flex",
                    alignItems: "center", justifyContent: "center",
                    fontSize: "13px", color: "#16140F", background: "#E3A53A", borderRadius: "50%",
                  }}
                >
                  ✦
                </span>
                <span className="font-mono-label" style={{ color: "#9A9282" }}>
                  Ce que Claude a compris
                </span>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {state.criteres.map(([label, valeur], i) => (
                  <div
                    key={i}
                    style={{
                      display: "inline-flex",
                      alignItems: "baseline",
                      gap: "8px",
                      border: "1px solid rgba(227,165,58,0.32)",
                      background: "rgba(227,165,58,0.07)",
                      padding: "8px 13px",
                      animation: "scu-rise 360ms ease forwards",
                      animationDelay: `${i * 80}ms`,
                      opacity: 0,
                    }}
                  >
                    <span
                      className="font-mono-label"
                      style={{ fontSize: "9px", letterSpacing: "0.16em", color: "#C08A2E" }}
                    >
                      {label}
                    </span>
                    <span style={{ fontSize: "14px", fontWeight: 500, color: "#ECE6D8" }}>
                      {valeur}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Raisonnement */}
          {state.raisonnement && (
            <p
              style={{
                margin: "22px 0 0",
                fontFamily: "var(--font-newsreader), serif",
                fontStyle: "italic",
                fontSize: "19px",
                lineHeight: 1.5,
                color: "#C7BEAC",
                maxWidth: "62ch",
                animation: "scu-rise 400ms ease forwards",
              }}
            >
              {state.raisonnement}
            </p>
          )}

          {/* Header résultats */}
          {resultatsAffiches.length > 0 && (
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                justifyContent: "space-between",
                gap: "14px",
                margin: "34px 0 4px",
                paddingTop: "22px",
                borderTop: "1px solid rgba(236,230,216,0.1)",
                flexWrap: "wrap",
              }}
            >
              <span className="font-mono-label" style={{ color: "#9A9282" }}>
                {resultatsAffiches.length} titre{resultatsAffiches.length > 1 ? "s" : ""} trouvé{resultatsAffiches.length > 1 ? "s" : ""}
              </span>
              <span className="font-mono-label" style={{ color: "#6E6857" }}>
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
            <p className="font-mono-label" style={{ color: "#C2624E", marginTop: "24px" }}>
              {state.erreur}
            </p>
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
      style={{
        display: "flex",
        gap: "22px",
        padding: "24px 0",
        borderTop: idx === 0 ? "none" : "1px solid rgba(236,230,216,0.1)",
        animation: "scu-rise 420ms ease forwards",
        animationDelay: `${idx * 100}ms`,
        opacity: 0,
      }}
    >
      {/* Poster */}
      <Link href={`/${r.type}/${r.slug}`} className="shrink-0">
        <div
          style={{
            position: "relative",
            width: "84px",
            height: "126px",
            border: "1px solid rgba(236,230,216,0.14)",
            overflow: "hidden",
            background: "linear-gradient(157deg,#2A2620,#120F0B)",
            flexShrink: 0,
          }}
        >
          {r.poster ? (
            <Image
              src={r.poster}
              alt={r.titre}
              fill
              sizes="84px"
              className="object-cover"
            />
          ) : (
            <>
              {/* Placeholder stylisé comme la maquette */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "repeating-linear-gradient(0deg,rgba(0,0,0,0.1) 0 2px,transparent 2px 4px)",
                  opacity: 0.4,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  left: "9px",
                  right: "9px",
                  bottom: "10px",
                  fontFamily: "var(--font-bricolage), sans-serif",
                  fontWeight: 800,
                  fontSize: "12px",
                  lineHeight: 0.96,
                  letterSpacing: "-0.01em",
                  textTransform: "uppercase",
                  color: "#F3ECDD",
                  textShadow: "0 2px 12px rgba(0,0,0,0.6)",
                }}
              >
                {r.titre}
              </div>
              <div
                style={{
                  position: "absolute",
                  top: "7px",
                  left: "8px",
                  fontFamily: "var(--font-spline-mono), monospace",
                  fontSize: "11px",
                  color: "rgba(243,236,221,0.85)",
                }}
              >
                {TYPE_MARK[r.type]}
              </div>
            </>
          )}
        </div>
      </Link>

      {/* Infos */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Meta ligne */}
        <div
          className="font-mono-label"
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: "12px",
            marginBottom: "5px",
            flexWrap: "wrap",
          }}
        >
          <span style={{ color: "#9A9282" }}>{TYPE_LABEL[r.type]}</span>
          {r.annee > 0 && <span style={{ color: "#7C7565" }}>{r.annee}</span>}
          {r.note > 0 && <span style={{ color: "#E3A53A" }}>★ {r.note.toFixed(1)}</span>}
        </div>

        {/* Titre */}
        <Link href={`/${r.type}/${r.slug}`}>
          <h3
            style={{
              margin: "0 0 7px",
              fontSize: "25px",
              fontWeight: 600,
              letterSpacing: "-0.015em",
              color: "#ECE6D8",
              lineHeight: 1.1,
            }}
            className="hover:text-primary transition-colors"
          >
            {r.titre}
          </h3>
        </Link>

        {/* Genres */}
        {r.genres.length > 0 && (
          <div
            className="font-mono-label"
            style={{ color: "#7C7565", marginBottom: "13px" }}
          >
            {r.genres.slice(0, 3).join(" · ")}
          </div>
        )}

        {/* Explication "Ça colle parce que" */}
        <div style={{ display: "flex", gap: "12px" }}>
          <span
            style={{
              flexShrink: 0,
              width: "2px",
              background: "#E3A53A",
              alignSelf: "stretch",
            }}
          />
          <p
            style={{
              margin: 0,
              fontFamily: "var(--font-newsreader), serif",
              fontSize: "16px",
              lineHeight: 1.5,
              color: "#B6AD9B",
            }}
          >
            <span style={{ fontStyle: "italic", color: "#E3A53A" }}>
              Ça colle parce que{" "}
            </span>
            {r.pourquoi}
          </p>
        </div>

        {/* Dispo */}
        <div style={{ marginTop: "13px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {r.dispo.length > 0 ? (
            r.dispo.slice(0, 3).map((p) => (
              <span
                key={p}
                className="font-mono-label"
                style={{
                  fontSize: "10px",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "#16140F",
                  background: "#C7BEAC",
                  padding: "3px 8px",
                }}
              >
                {p}
              </span>
            ))
          ) : (
            <span
              className="font-mono-label"
              style={{
                fontSize: "10px",
                color: "#7C7565",
                border: "1px solid rgba(236,230,216,0.18)",
                padding: "3px 8px",
              }}
            >
              Hors streaming
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
