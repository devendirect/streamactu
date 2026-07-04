import Link from "next/link";
import { PLATEFORMES } from "@/lib/plateformes";

interface Props {
  /** id TMDB de la plateforme courante, exclue de la liste */
  actuelle?: number;
}

/**
 * Bloc de liens vers les pages plateforme — maillage interne des pages
 * de listes et des pages plateforme entre elles.
 */
export default function MaillagePlateformes({ actuelle }: Props) {
  const liens = PLATEFORMES.filter((pf) => pf.id !== actuelle);

  return (
    <nav aria-label="Nouveautés par plateforme" className="border-t border-border pt-5">
      <p className="font-mono-label text-ink-4 mb-3">
        {actuelle ? "Autres plateformes" : "Nouveautés par plateforme"}
      </p>
      <div className="flex flex-wrap gap-2">
        {liens.map((pf) => (
          <Link
            key={pf.id}
            href={`/${pf.slug}`}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-border/50 font-mono-label text-[#9A9282] hover:text-foreground hover:border-border transition-colors"
          >
            <span
              aria-hidden="true"
              style={{
                display: "inline-block",
                width: "10px",
                height: "3px",
                background: pf.couleur,
                flexShrink: 0,
              }}
            />
            {pf.nom.toUpperCase()}
          </Link>
        ))}
      </div>
    </nav>
  );
}
