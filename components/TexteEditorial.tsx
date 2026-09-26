import Link from "next/link";

interface Props {
  titre: string;
  paragraphes: (string | null | undefined)[];
  liens?: { href: string; label: string }[];
}

/** Bloc de texte des pages hubs : paragraphes écrits à la main et synthèses calculées */
export default function TexteEditorial({ titre, paragraphes, liens }: Props) {
  const textes = paragraphes.filter((p): p is string => Boolean(p));
  if (textes.length === 0) return null;
  return (
    <section className="border-t border-border pt-5 max-w-3xl">
      <h2 className="font-mono-label text-ink-4 mb-4">{titre}</h2>
      <div className="space-y-3">
        {textes.map((p) => (
          <p
            key={p.slice(0, 40)}
            className="text-[15px] leading-relaxed text-[#9A9282]"
            style={{ fontFamily: "var(--font-newsreader), serif" }}
          >
            {p}
          </p>
        ))}
      </div>
      {liens && liens.length > 0 && (
        <nav className="flex items-center gap-x-5 gap-y-2 flex-wrap mt-4">
          {liens.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="font-mono-label text-foreground border-b border-primary pb-1 hover:text-primary transition-colors"
            >
              {l.label} →
            </Link>
          ))}
        </nav>
      )}
    </section>
  );
}
