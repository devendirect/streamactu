import Link from "next/link";

const NAV = [
  { href: "/", label: "Actu" },
  { href: "/retrouver", label: "Retrouver" },
  { href: "/surprise", label: "À la surprise" },
  { href: "/jeux", label: "Jeux" },
];

export default function Header() {
  return (
    <header className="sa-container w-full py-6 flex items-center justify-between gap-4">
      {/* Logo */}
      <Link href="/" className="text-[22px] font-extrabold tracking-[-0.02em] leading-none">
        Stream<span className="text-primary">Actu</span>
        <span className="text-[#5C564A] font-medium">.fr</span>
      </Link>

      {/* Nav + recherche */}
      <div className="flex items-center gap-6 flex-wrap">
        {NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="font-mono-label text-[#8E8676] hover:text-foreground transition-colors"
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
      </div>
    </header>
  );
}
