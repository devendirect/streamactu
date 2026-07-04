import Link from "next/link";
import { BoutonGererCookies } from "@/components/ConsentAnalytics";
import { PLATEFORMES } from "@/lib/plateformes";
import { GENRES_SEO } from "@/lib/genres";
import { formatMoisFR, formatMoisURL } from "@/lib/utils";

// Les genres les plus recherchés — la liste complète est sur chaque page genre
const GENRES_FOOTER = ["thriller", "comedie", "drame", "horreur", "science-fiction", "animation", "documentaire", "policier"];

const NAV = [
  { href: "/", label: "Actu" },
  { href: "/prochaines-sorties", label: "À venir" },
  { href: "/retrouver", label: "Retrouver" },
  { href: "/surprise", label: "À la surprise" },
  { href: "/jeux", label: "Jeux" },
  { href: "/ma-liste", label: "Ma liste" },
  { href: "/recherche", label: "Recherche" },
];

export default function Footer() {
  // Tops du dernier mois révolu + de l'année en cours
  const d = new Date();
  d.setUTCDate(15);
  d.setUTCMonth(d.getUTCMonth() - 1);
  const moisSlug = formatMoisURL(d.getUTCMonth() + 1, d.getUTCFullYear());
  const moisLabel = formatMoisFR(d.getUTCMonth() + 1, d.getUTCFullYear());
  const annee = new Date().getUTCFullYear();

  const TOPS = [
    { href: `/top/series-${moisSlug}`, label: `Top séries ${moisLabel}` },
    { href: `/top/films-${moisSlug}`, label: `Top films ${moisLabel}` },
    { href: `/top/series-${annee}`, label: `Top séries ${annee}` },
    { href: `/top/films-${annee}`, label: `Top films ${annee}` },
  ];

  return (
    <footer className="border-t border-border mt-auto">
      <div className="sa-container py-8">
        {/* Liens nav */}
        <nav aria-label="Pages du site" className="flex items-center gap-6 flex-wrap pb-5 border-b border-border/50">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="font-mono-label text-[#B8AF9D] hover:text-foreground transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Nouveautés par plateforme */}
        <nav aria-label="Nouveautés par plateforme" className="flex items-center gap-x-5 gap-y-2 flex-wrap py-4 border-b border-border/50">
          <span className="font-mono-label text-ink-4">Nouveautés :</span>
          {PLATEFORMES.map((pf) => (
            <Link
              key={pf.id}
              href={`/${pf.slug}`}
              className="font-mono-label text-[#9A9282] hover:text-foreground transition-colors"
            >
              {pf.nom}
            </Link>
          ))}
        </nav>

        {/* Classements */}
        <nav aria-label="Classements" className="flex items-center gap-x-5 gap-y-2 flex-wrap py-4 border-b border-border/50">
          <span className="font-mono-label text-ink-4">Classements :</span>
          {TOPS.map((t) => (
            <Link
              key={t.href}
              href={t.href}
              className="font-mono-label text-[#9A9282] hover:text-foreground transition-colors"
            >
              {t.label}
            </Link>
          ))}
        </nav>

        {/* Genres */}
        <nav aria-label="Genres" className="flex items-center gap-x-5 gap-y-2 flex-wrap py-4 border-b border-border/50">
          <span className="font-mono-label text-ink-4">Genres :</span>
          {GENRES_SEO.filter((g) => GENRES_FOOTER.includes(g.slug)).map((g) => (
            <Link
              key={g.slug}
              href={`/genre/${g.slug}`}
              className="font-mono-label text-[#9A9282] hover:text-foreground transition-colors"
            >
              {g.nom}
            </Link>
          ))}
        </nav>

        {/* Bas de footer */}
        <div className="flex items-center justify-between gap-4 flex-wrap pt-5">
          <div className="flex items-center gap-5 flex-wrap">
            <span className="text-sm font-bold text-[#6F6856]">
              Stream<span className="text-[#9A8A5A]">Actu</span>.fr
            </span>
            <Link
              href="/a-propos"
              className="font-mono-label text-ink-3 hover:text-foreground transition-colors"
            >
              À propos
            </Link>
            <Link
              href="/mentions-legales"
              className="font-mono-label text-ink-3 hover:text-foreground transition-colors"
            >
              Mentions légales
            </Link>
            <a
              href="/flux.xml"
              className="font-mono-label text-ink-3 hover:text-foreground transition-colors"
            >
              Flux RSS
            </a>
            <BoutonGererCookies />
          </div>

          {/* Attribution TMDB obligatoire */}
          <p className="font-mono-label text-ink-3 text-right max-w-[46ch]">
            Données &amp; visuels fournis par{" "}
            <a
              href="https://www.themoviedb.org"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-[#9A9282] transition-colors"
            >
              TMDB
            </a>
            . Ce produit utilise l&apos;API de TMDB mais n&apos;est ni approuvé ni certifié par TMDB.
          </p>
        </div>
      </div>
    </footer>
  );
}
