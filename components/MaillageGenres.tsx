import Link from "next/link";
import { GENRES_SEO } from "@/lib/genres";

interface Props {
  /** slug du genre courant, exclu de la liste */
  actuel?: string;
}

/** Bloc de liens vers les pages genre — maillage interne */
export default function MaillageGenres({ actuel }: Props) {
  const liens = GENRES_SEO.filter((g) => g.slug !== actuel);

  return (
    <nav aria-label="Genres" className="border-t border-border pt-5">
      <p className="font-mono-label text-ink-4 mb-3">
        {actuel ? "Autres genres" : "Par genre"}
      </p>
      <div className="flex flex-wrap gap-2">
        {liens.map((g) => (
          <Link
            key={g.slug}
            href={`/genre/${g.slug}`}
            className="px-3 py-1.5 border border-border/50 font-mono-label text-[#9A9282] hover:text-foreground hover:border-border transition-colors"
          >
            {g.nom}
          </Link>
        ))}
      </div>
    </nav>
  );
}
