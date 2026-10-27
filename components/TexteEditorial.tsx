import Link from "next/link";
import Icone from "@/components/Icone";

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
    <section className="max-w-[68ch]">
      <h2 className="mb-3.5 text-[clamp(20px,1.7vw,24px)] font-extrabold tracking-[-0.015em]">{titre}</h2>
      <div className="space-y-3">
        {textes.map((p) => (
          <p key={p.slice(0, 40)} className="text-[16.5px] leading-[1.65] text-texte-doux">
            {p}
          </p>
        ))}
      </div>
      {liens && liens.length > 0 && (
        <nav className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2">
          {liens.map((l) => (
            <Link key={l.href} href={l.href} className="lien-fleche">
              {l.label}
              <Icone nom="droite" taille={18} />
            </Link>
          ))}
        </nav>
      )}
    </section>
  );
}
