"use client";

import { useState, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ResultatRecherche } from "@/types";
import { evenementGA } from "@/lib/ga";
import { altAffiche } from "@/lib/utils";
import { GENRES_SEO } from "@/lib/genres";
import Faisceau from "@/components/Faisceau";
import Icone from "@/components/Icone";

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

  const puceTendance = (t: string) => (
    <button
      key={t}
      type="button"
      onClick={() => {
        setQuery(t);
        rechercher(t);
      }}
      className="puce"
    >
      {t}
    </button>
  );

  return (
    <div>
      {/* Grande saisie sous le faisceau : pas de boîte, un trait qui prend la lumière */}
      <div className="scene -mt-entete px-gouttiere pt-[clamp(130px,18vh,190px)] pb-8">
        <Faisceau doux />
        <h1 className="mb-4 text-[clamp(34px,4.6vw,64px)] leading-none font-black tracking-[-0.03em]">Recherche</h1>
        <div className="flex max-w-[960px] items-center gap-4 border-b-2 border-white/40 pb-3 transition-colors duration-200 focus-within:border-lumiere">
          <Icone nom="recherche" taille={30} className="flex-none text-texte-2" />
          <label htmlFor="champ-recherche" className="sr-only">
            Rechercher une série, un film
          </label>
          <input
            id="champ-recherche"
            type="search"
            value={query}
            onChange={onInput}
            placeholder="Un titre, un genre, un acteur…"
            autoFocus
            className="min-w-0 flex-1 border-none bg-transparent text-[clamp(26px,4vw,46px)] font-extrabold tracking-[-0.02em] text-texte caret-ambre placeholder:text-texte-2 focus:outline-none focus-visible:outline-none [&::-webkit-search-cancel-button]:hidden"
          />
          {query && (
            <button
              type="button"
              onClick={clear}
              aria-label="Effacer la recherche"
              className="grid size-10 flex-none place-items-center rounded-full bg-white/10 transition-colors duration-200 hover:bg-white/20"
            >
              <Icone nom="fermer" taille={20} />
            </button>
          )}
        </div>
      </div>

      <div className="px-gouttiere pt-6 pb-10">
        {/* Statut */}
        <p role="status" className="mb-5 text-sm text-texte-2">
          {loading
            ? "Recherche en cours…"
            : query.trim() && aResultats
              ? `${resultats.length} résultat${resultats.length > 1 ? "s" : ""} pour « ${query} »`
              : ""}
        </p>

        {/* Résultats en grille d'affiches, le terme surligné dans le titre */}
        {aResultats && !loading && (
          <ul className="grid grid-cols-[repeat(auto-fill,minmax(clamp(132px,13vw,180px),1fr))] gap-x-3.5 gap-y-[22px]">
            {resultats.map((item) => (
              <li key={`${item.type}-${item.id}`} className="min-w-0">
                <Link href={`/${item.type}/${item.slug}`} className="group block">
                  <span className="relative block aspect-[2/3] overflow-hidden rounded-lg bg-surface">
                    {item.poster && (
                      <Image
                        src={item.poster}
                        alt={altAffiche(item.titre, item.type)}
                        fill
                        sizes="(max-width: 760px) 40vw, 180px"
                        className="object-cover transition-transform duration-300 ease-salle group-hover:scale-[1.03]"
                      />
                    )}
                  </span>
                  <span className="block truncate pt-2 text-sm leading-[1.3] font-semibold">
                    <Surligne texte={item.titre} terme={query} />
                  </span>
                  <span className="mt-0.5 flex items-center gap-1.5 text-[13px] text-texte-2">
                    {item.type === "serie" ? "Série" : "Film"}
                    {item.annee > 0 && ` · ${item.annee}`}
                    {item.note > 0 && (
                      <span className="inline-flex items-center gap-1">
                        ·<Icone nom="etoile" taille={12} className="fill-current text-ambre" />
                        {item.note.toFixed(1).replace(".", ",")}
                      </span>
                    )}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}

        {/* Aucun résultat */}
        {isEmpty && (
          <div className="space-y-5 py-10 text-center">
            <p className="mx-auto max-w-[24ch] text-[clamp(22px,4vw,36px)] leading-tight font-extrabold tracking-[-0.02em]">
              Rien sous ce titre… pour l&apos;instant.
            </p>
            <p className="text-texte-2">Aucune série ni film ne correspond à « {query} ».</p>
            <div>
              <h2 className="libelle mb-3 text-texte-2">Tendances cette semaine</h2>
              <div className="flex flex-wrap justify-center gap-2">{suggestions.map(puceTendance)}</div>
            </div>
            <Link href="/surprise" className="btn-verre">
              <Icone nom="de" taille={20} />
              Laissez le hasard choisir
            </Link>
          </div>
        )}

        {/* État initial : tendances, genres, et l'encadré Retrouver */}
        {!query.trim() && !loading && (
          <div className="space-y-section">
            <section>
              <h2 className="libelle mb-3 text-texte-2">Tendances cette semaine</h2>
              <div className="flex flex-wrap gap-2">{suggestions.map(puceTendance)}</div>
            </section>
            <section>
              <h2 className="libelle mb-3 text-texte-2">Parcourir par genre</h2>
              <div className="flex flex-wrap gap-2">
                {GENRES_SEO.map((g) => (
                  <Link key={g.slug} href={`/genre/${g.slug}`} className="puce">
                    {g.nom}
                  </Link>
                ))}
              </div>
            </section>
            <Link
              href="/retrouver"
              className="block max-w-[720px] rounded-[14px] bg-linear-140 from-velours to-velours-sombre p-[22px] transition-transform duration-[350ms] ease-salle hover:-translate-y-[3px]"
            >
              <span className="font-salle block text-[32px] leading-[0.95] font-black text-lumiere">Le titre vous échappe&nbsp;?</span>
              <span className="mt-1.5 block max-w-[48ch] text-[14.5px] text-[#E6D5CE]">
                Décrivez l&apos;histoire, un acteur, une scène : l&apos;IA retrouve le titre.
              </span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

/** Minuscules sans accents, caractère pour caractère : les positions restent celles du texte d'origine */
function plier(texte: string): string {
  return [...texte].map((c) => c.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().slice(0, 1) || c).join("");
}

/** Titre avec le terme cherché surligné (sans tenir compte des accents ni de la casse) */
function Surligne({ texte, terme }: { texte: string; terme: string }) {
  const t = plier(terme.trim());
  const i = t ? plier(texte).indexOf(t) : -1;
  if (i < 0) return <>{texte}</>;
  return (
    <>
      {texte.slice(0, i)}
      <mark className="rounded-[3px] bg-ambre/25 text-white">{texte.slice(i, i + t.length)}</mark>
      {texte.slice(i + t.length)}
    </>
  );
}
