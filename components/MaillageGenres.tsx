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
    <nav aria-label="Genres">
      <h2 className="font-mono-label mb-3 text-texte-2">{actuel ? "Autres genres" : "Par genre"}</h2>
      <div className="flex flex-wrap gap-2">
        {liens.map((g) => (
          <Link key={g.slug} href={`/genre/${g.slug}`} className="puce">
            {g.nom}
          </Link>
        ))}
      </div>
    </nav>
  );
}
