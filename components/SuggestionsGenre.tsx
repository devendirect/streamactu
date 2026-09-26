import Link from "next/link";
import type { SuggestionsFiche } from "@/lib/suggestions";

/** Bas de fiche : autres titres du même genre sur la même plateforme */
export default function SuggestionsGenre({ suggestions }: { suggestions: SuggestionsFiche }) {
  const { genre, plateforme, contenus, pageGenreExiste } = suggestions;
  return (
    <section className="space-y-3 border-t border-border pt-5" aria-labelledby="suggestions-genre">
      <h2 id="suggestions-genre" className="font-mono-label text-ink-3">
        {genre ? `${genre.nom} sur ${plateforme.nom}` : `Aussi sur ${plateforme.nom}`}
      </h2>
      <p className="text-[15px] leading-relaxed text-[#9A9282]" style={{ fontFamily: "var(--font-newsreader), serif" }}>
        {genre
          ? `D'autres titres du même genre disponibles sur ${plateforme.nom} en France, parmi les plus populaires du moment :`
          : `D'autres séries et films arrivés sur ${plateforme.nom} en France ces quatre dernières semaines :`}
      </p>
      <ul className="space-y-2">
        {contenus.map((c) => (
          <li key={`${c.type}-${c.id}`} className="flex items-baseline justify-between gap-3">
            <Link
              href={`/${c.type}/${c.slug}`}
              className="text-foreground hover:text-primary transition-colors truncate"
            >
              {c.titre}
            </Link>
            <span className="font-mono-label text-ink-4 shrink-0">
              {c.type === "serie" ? "Série" : "Film"}
              {c.annee ? ` · ${c.annee}` : ""}
              {c.nbVotes > 0 ? ` · ★ ${c.note.toFixed(1)}` : ""}
            </span>
          </li>
        ))}
      </ul>
      <nav className="flex items-center gap-x-5 gap-y-2 flex-wrap pt-1">
        {genre && pageGenreExiste && (
          <Link
            href={`/genre/${genre.slug}/${plateforme.slug}`}
            className="font-mono-label text-foreground border-b border-primary pb-1 hover:text-primary transition-colors"
          >
            Tout le genre {genre.nom.toLowerCase()} sur {plateforme.nom} →
          </Link>
        )}
        <Link
          href={`/${plateforme.slug}`}
          className="font-mono-label text-foreground border-b border-primary pb-1 hover:text-primary transition-colors"
        >
          Nouveautés {plateforme.nom} →
        </Link>
      </nav>
    </section>
  );
}
