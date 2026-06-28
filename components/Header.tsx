import Link from "next/link";
import { Search } from "lucide-react";

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
          <Search size={18} strokeWidth={1.5} />
        </Link>
      </div>
    </header>
  );
}
