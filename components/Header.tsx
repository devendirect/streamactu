import Link from "next/link";

const NAV = [
  { href: "/", label: "Actu" },
  { href: "/prochaines-sorties", label: "À venir" },
  { href: "/retrouver", label: "Retrouver" },
  { href: "/surprise", label: "À la surprise" },
  { href: "/jeux", label: "Jeux" },
];

export default function Header() {
  return (
    <header className="sa-container w-full py-6 flex items-center justify-between gap-4">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-3 leading-none" aria-label="StreamActu.fr — Accueil">
        <svg data-logo-header width="34" height="34" viewBox="0 0 120 120" fill="none" aria-hidden="true">
          <g stroke="#ECE6D8" strokeWidth="6" strokeLinecap="round">
            <line x1="18" y1="84" x2="102" y2="84" />
            <line x1="34" y1="84" x2="34" y2="74" />
            <line x1="50" y1="84" x2="50" y2="74" />
            <line x1="86" y1="84" x2="86" y2="74" />
          </g>
          <line x1="68" y1="84" x2="68" y2="42" stroke="#E3A53A" strokeWidth="6" strokeLinecap="round" />
          <circle cx="68" cy="34" r="11" fill="#E3A53A" />
        </svg>
        <span className="text-[21px] font-extrabold tracking-[-0.025em]">
          Stream<span className="text-primary">Actu</span><span className="text-ink-4 font-medium">.fr</span>
        </span>
      </Link>

      {/* Nav + recherche */}
      <nav aria-label="Navigation principale" className="flex items-center gap-6 flex-wrap">
        {NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="font-mono-label text-ink-3 hover:text-foreground transition-colors"
          >
            {item.label}
          </Link>
        ))}
        <Link
          href="/recherche"
          aria-label="Rechercher"
          className="text-[#9A9282] hover:text-foreground transition-colors"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        </Link>
      </nav>
    </header>
  );
}
