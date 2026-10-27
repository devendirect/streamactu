import { ACTU_PUBLIEE, ADRESSES_FIXES, EDITIONS_COURANTES, cheminFixe } from "@/lib/actu";
import { CHAINES_VIDEO, REPO_URL } from "@/lib/site";
import Link from "next/link";
import { BoutonGererCookies } from "@/components/ConsentAnalytics";
import { Repere, Wordmark } from "@/components/Logo";
import { PLATEFORMES } from "@/lib/plateformes";
import { GENRES_SEO } from "@/lib/genres";
import { formatMoisFR, formatMoisURL } from "@/lib/utils";

// Les genres les plus recherchés — la liste complète est sur chaque page genre
const GENRES_FOOTER = ["thriller", "comedie", "drame", "horreur", "science-fiction", "animation", "documentaire", "policier"];

const LIEN = "text-sm text-texte-2 transition-colors duration-200 hover:text-texte";

type Colonne = { titre: string; liens: { href: string; label: string; externe?: boolean }[] };

export default function Footer() {
  // Tops du dernier mois révolu + de l'année en cours
  const d = new Date();
  d.setUTCDate(15);
  d.setUTCMonth(d.getUTCMonth() - 1);
  const moisSlug = formatMoisURL(d.getUTCMonth() + 1, d.getUTCFullYear());
  const moisLabel = formatMoisFR(d.getUTCMonth() + 1, d.getUTCFullYear());
  const annee = new Date().getUTCFullYear();

  const COLONNES: Colonne[] = [
    {
      titre: "Explorer",
      liens: [
        { href: "/", label: "Accueil" },
        { href: "/prochaines-sorties", label: "À venir" },
        { href: "/recherche", label: "Recherche" },
        { href: "/ma-liste", label: "Ma liste" },
      ],
    },
    {
      titre: "Découvrir",
      liens: [
        // « Actu » et ses adresses fixes (« Ce week-end », « Ce mois-ci ») seulement une fois publiées
        ...(ACTU_PUBLIEE ? [{ href: "/actu", label: "Actu" }] : []),
        ...EDITIONS_COURANTES.map((a) => ({ href: cheminFixe(a.format), label: ADRESSES_FIXES[a.format].libelle })),
        { href: "/guides", label: "Guides" },
        { href: "/retrouver", label: "Retrouver un titre" },
        { href: "/surprise", label: "À la surprise" },
        { href: "/jeux", label: "Jeux" },
      ],
    },
    { titre: "Nouveautés", liens: PLATEFORMES.map((pf) => ({ href: `/${pf.slug}`, label: pf.nom })) },
    { titre: `Récaps ${annee}`, liens: PLATEFORMES.map((pf) => ({ href: `/${pf.slug}/${annee}`, label: `${pf.nom} ${annee}` })) },
    {
      titre: "Classements",
      liens: [
        { href: `/top/series-${moisSlug}`, label: `Top séries ${moisLabel}` },
        { href: `/top/films-${moisSlug}`, label: `Top films ${moisLabel}` },
        { href: `/top/series-${annee}`, label: `Top séries ${annee}` },
        { href: `/top/films-${annee}`, label: `Top films ${annee}` },
      ],
    },
    {
      titre: "Genres",
      liens: GENRES_SEO.filter((g) => GENRES_FOOTER.includes(g.slug)).map((g) => ({ href: `/genre/${g.slug}`, label: g.nom })),
    },
  ];

  const SITE = [
    { href: "/a-propos", label: "À propos" },
    { href: "/contact", label: "Contact" },
    { href: "/mentions-legales", label: "Mentions légales" },
  ];

  return (
    <footer className="mt-6 border-t border-trait px-gouttiere pt-12 pb-10">
      <Link
        href="/"
        aria-label="StreamActu.fr, accueil"
        className="mb-7 inline-flex items-center gap-2 [--sa-logo-encre:var(--sa-texte)]"
      >
        <Repere taille={30} />
        <Wordmark hauteur={24} />
      </Link>

      <div className="grid grid-cols-2 gap-7 sm:grid-cols-3 lg:grid-cols-6">
        {COLONNES.map((c) => (
          <nav key={c.titre} aria-label={c.titre}>
            <h2 className="mb-3 text-[15px] font-bold">{c.titre}</h2>
            <ul className="flex flex-col gap-2">
              {c.liens.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className={LIEN}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="mt-10 flex flex-col gap-4 border-t border-trait pt-5 lg:flex-row lg:items-start lg:justify-between">
        <nav aria-label="Le site" className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <span className="text-sm font-bold text-texte-2">© {annee} StreamActu.fr</span>
          {SITE.map((l) => (
            <Link key={l.href} href={l.href} className={LIEN}>
              {l.label}
            </Link>
          ))}
          <a href="/flux.xml" className={LIEN}>
            Flux RSS
          </a>
          <a href={REPO_URL} target="_blank" rel="noopener noreferrer" className={LIEN}>
            Code source
          </a>
          {CHAINES_VIDEO.map((c) => (
            <a key={c.nom} href={c.url} target="_blank" rel="noopener noreferrer" className={LIEN}>
              {c.nom}
            </a>
          ))}
          <BoutonGererCookies className={LIEN} />
        </nav>

        {/* Attribution TMDB obligatoire */}
        <p className="max-w-[70ch] text-[13px] text-texte-2 lg:max-w-[46ch] lg:text-right">
          Données &amp; visuels fournis par{" "}
          <a
            href="https://www.themoviedb.org"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-[3px] transition-colors duration-200 hover:text-texte"
          >
            TMDB
          </a>
          . Ce produit utilise l&apos;API de TMDB mais n&apos;est ni approuvé ni certifié par TMDB.
        </p>
      </div>
    </footer>
  );
}
