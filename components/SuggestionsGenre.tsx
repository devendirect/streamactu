import Link from "next/link";
import type { SuggestionsFiche } from "@/lib/suggestions";
import Rangee from "@/components/Rangee";
import CarteAffiche from "@/components/CarteAffiche";
import Icone from "@/components/Icone";

/** Bas de fiche : autres titres du même genre sur la même plateforme, en rangée d'affiches */
export default function SuggestionsGenre({ suggestions }: { suggestions: SuggestionsFiche }) {
  const { genre, plateforme, contenus, pageGenreExiste } = suggestions;
  const titre = genre ? `${genre.nom} sur ${plateforme.nom}` : `Aussi sur ${plateforme.nom}`;
  return (
    <div id="similaires" className="scroll-mt-[140px]">
      <Rangee
        titre={titre}
        href={genre && pageGenreExiste ? `/genre/${genre.slug}/${plateforme.slug}` : `/${plateforme.slug}`}
        sous={
          genre
            ? `D'autres titres du même genre disponibles sur ${plateforme.nom} en France, parmi les plus populaires du moment.`
            : `D'autres séries et films sortis sur ${plateforme.nom} en France ces quatre dernières semaines.`
        }
      >
        {contenus.map((c) => (
          <CarteAffiche key={`${c.type}-${c.id}`} contenu={{ ...c, plateforme }} />
        ))}
      </Rangee>
      <nav aria-label="Aller plus loin" className="-mt-3 mb-rangee flex flex-wrap items-center gap-x-6 gap-y-2 px-gouttiere">
        {genre && pageGenreExiste && (
          <Link href={`/genre/${genre.slug}/${plateforme.slug}`} className="lien-fleche">
            Tout le genre {genre.nom.toLowerCase()} sur {plateforme.nom}
            <Icone nom="droite" taille={18} />
          </Link>
        )}
        <Link href={`/${plateforme.slug}`} className="lien-fleche">
          Nouveautés {plateforme.nom}
          <Icone nom="droite" taille={18} />
        </Link>
      </nav>
    </div>
  );
}
