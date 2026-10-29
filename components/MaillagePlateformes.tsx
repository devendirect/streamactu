import Link from "next/link";
import { PLATEFORMES } from "@/lib/plateformes";
import PastillePlateforme from "@/components/PastillePlateforme";

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
    <nav aria-label="Nouveautés par plateforme">
      <h2 className="libelle mb-3 text-texte-2">{actuelle ? "Autres plateformes" : "Nouveautés par plateforme"}</h2>
      <div className="flex flex-wrap gap-2">
        {liens.map((pf) => (
          <Link key={pf.id} href={`/${pf.slug}`} className="puce">
            <PastillePlateforme pf={pf} />
          </Link>
        ))}
      </div>
    </nav>
  );
}
