"use client";

import { useState, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ResultatRecherche } from "@/types";
import { evenementGA } from "@/lib/ga";
import { altAffiche } from "@/lib/utils";

interface RechercheClientProps {
  queryInitiale: string;
  resultatsInitiaux: ResultatRecherche[];
  tendances?: string[];
}

// Repli si TMDB ne répond pas au moment du rendu serveur
const TENDANCES_DEFAUT = ["Severance", "Arcane", "Dune", "Andor"];

export default function RechercheClient({
  queryInitiale,
  resultatsInitiaux,
  tendances = [],
}: RechercheClientProps) {
  const suggestions = tendances.length > 0 ? tendances : TENDANCES_DEFAUT;
  const [query, setQuery] = useState(queryInitiale);
  const [resultats, setResultats] = useState<ResultatRecherche[]>(resultatsInitiaux);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const rechercher = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResultats([]);
      router.replace("/recherche", { scroll: false });
      return;
    }

    setLoading(true);
    router.replace(`/recherche?q=${encodeURIComponent(q)}`, { scroll: false });

    try {
      const res = await fetch(`/api/recherche?q=${encodeURIComponent(q)}`);
      const data = (await res.json()) as ResultatRecherche[];
      setResultats(data);
      // ≥ 3 caractères : évite d'envoyer chaque étape de la frappe débouncée
      if (q.trim().length >= 3) {
        evenementGA("search", { search_term: q.trim(), resultats: data.length });
      }
    } catch {
      setResultats([]);
    } finally {
      setLoading(false);
    }
  }, [router]);

  function onInput(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setQuery(val);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => rechercher(val), 300);
  }

  function clear() {
    setQuery("");
    setResultats([]);
    router.replace("/recherche", { scroll: false });
  }

  const aResultats = resultats.length > 0;
  const isEmpty = !loading && query.trim() && !aResultats;

  return (
    <div className="space-y-6">
      {/* Grande barre de recherche */}
      <div>
        <p className="font-mono-label text-ink-3 mb-4">Recherche</p>
        <div className="flex items-center gap-4 border-b-2 border-foreground pb-3">
          <span aria-hidden="true" className="text-primary text-2xl leading-none">⌕</span>
          <input
            type="text"
            value={query}
            onChange={onInput}
            placeholder="Un titre, un genre, un acteur…"
            autoFocus
            className="flex-1 bg-transparent border-none text-[clamp(20px,4vw,32px)] font-bold tracking-[-0.02em] text-foreground placeholder-ink-4 focus:outline-none"
            style={{ fontFamily: "var(--font-bricolage), sans-serif" }}
          />
          {query && (
            <button
              onClick={clear}
              className="font-mono-label text-ink-3 hover:text-foreground transition-colors"
            >
              Effacer
            </button>
          )}
        </div>
      </div>

      {/* Statut */}
      {query.trim() && !loading && aResultats && (
        <div className="flex items-baseline justify-between gap-4">
          <span className="font-mono text-sm text-[#9A9282]">
            {resultats.length} résultat{resultats.length > 1 ? "s" : ""}
          </span>
          <span className="text-sm text-ink-3 italic" style={{ fontFamily: "var(--font-newsreader), serif" }}>
            pour « {query} »
          </span>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <p className="text-ink-3 italic" style={{ fontFamily: "var(--font-newsreader), serif" }}>
          Recherche en cours…
        </p>
      )}

      {/* Résultats */}
      {aResultats && !loading && (
        <div>
          {resultats.map((item, i) => (
            <Link
              key={item.id}
              href={`/${item.type}/${item.slug}`}
              className="flex items-center gap-5 py-4 hover:bg-white/[0.03] transition-colors group"
              style={{ borderTop: i === 0 ? "none" : "1px solid rgba(236,230,216,0.1)" }}
            >
              {/* Poster */}
              <div className="relative w-16 h-24 shrink-0 border border-border overflow-hidden bg-card">
                {item.poster ? (
                  <Image src={item.poster} alt={altAffiche(item.titre, item.type)} fill className="object-cover" sizes="64px" />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
                )}
              </div>

              {/* Infos */}
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-3 mb-1 font-mono-label text-[#9A9282]">
                  <span className="text-[12px] text-foreground/70">
                    {item.type === "serie" ? "▣" : "◈"}
                  </span>
                  {item.type === "serie" ? "Série" : "Film"}
                  {item.annee > 0 && <span className="text-ink-3">{item.annee}</span>}
                </div>
                <h3 className="text-[23px] font-semibold tracking-[-0.01em] group-hover:text-primary transition-colors">
                  {item.titre}
                </h3>
              </div>

              {/* Note */}
              {item.note > 0 && (
                <span className="shrink-0 font-mono text-sm text-primary whitespace-nowrap">
                  ★ {item.note.toFixed(1)}
                </span>
              )}
            </Link>
          ))}
        </div>
      )}

      {/* État vide */}
      {isEmpty && (
        <div className="py-16 text-center space-y-6">
          <p
            className="text-[clamp(22px,4vw,36px)] leading-tight text-[#C7BEAC] max-w-[20ch] mx-auto italic"
            style={{ fontFamily: "var(--font-newsreader), serif" }}
          >
            Rien sous ce titre… pour l&apos;instant.
          </p>
          <p className="font-mono text-sm text-ink-3">
            Aucune série ni film ne correspond à « {query} ».
          </p>

          <div>
            <p className="font-mono-label text-ink-4 mb-3">Tendances cette semaine</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {suggestions.map((t) => (
                <button
                  key={t}
                  onClick={() => { setQuery(t); rechercher(t); }}
                  className="border border-border/40 text-[#C4BBA9] font-mono text-sm px-4 py-2 hover:border-primary hover:text-primary transition-colors"
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <Link
            href="/surprise"
            className="inline-flex items-center gap-3 border border-border/50 text-foreground font-mono-label px-6 py-4 hover:border-primary hover:text-primary transition-colors"
          >
            ✦ Laissez le hasard choisir
          </Link>
        </div>
      )}

      {/* État initial vide (pas encore de recherche) */}
      {!query.trim() && !loading && (
        <div className="py-8">
          <p className="font-mono-label text-ink-4 mb-3">Tendances cette semaine</p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((t) => (
              <button
                key={t}
                onClick={() => { setQuery(t); rechercher(t); }}
                className="border border-border/40 text-[#9A9282] font-mono text-sm px-4 py-2 hover:border-primary hover:text-primary transition-colors"
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
