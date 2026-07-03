import Link from "next/link";

const NAV = [
  { href: "/", label: "Actu" },
  { href: "/retrouver", label: "Retrouver" },
  { href: "/surprise", label: "À la surprise" },
  { href: "/jeux", label: "Jeux" },
  { href: "/recherche", label: "Recherche" },
];

export default function Footer() {
  return (
    <footer className="border-t border-border mt-auto">
      <div className="sa-container py-8">
        {/* Liens nav */}
        <nav className="flex items-center gap-6 flex-wrap pb-5 border-b border-border/50">
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

        {/* Bas de footer */}
        <div className="flex items-center justify-between gap-4 flex-wrap pt-5">
          <div className="flex items-center gap-5 flex-wrap">
            <span className="text-sm font-bold text-[#6F6856]">
              Stream<span className="text-[#9A8A5A]">Actu</span>.fr
            </span>
            <Link
              href="/mentions-legales"
              className="font-mono-label text-ink-3 hover:text-foreground transition-colors"
            >
              Mentions légales
            </Link>
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
