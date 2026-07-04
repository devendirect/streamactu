import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { getContenusGenre } from "@/lib/tmdb";
import { GENRE_PAR_SLUG } from "@/lib/genres";
import { PLATEFORME_PAR_SLUG } from "@/lib/plateformes";
import { libelleComptes } from "@/lib/utils";
import EnTeteNouveautes from "@/components/EnTeteNouveautes";
import ListeContenus from "@/components/ListeContenus";
import MaillageGenres from "@/components/MaillageGenres";

// Pas de generateStaticParams : les ~120 croisements sont rendus à la
// demande puis mis en cache (ISR) — les croisements maigres font 404.
export const revalidate = 86400;

const OG_IMAGES = ["/og-default.png"];
const MIN_CONTENUS = 5;

interface Props {
  params: Promise<{ genre: string; plateforme: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { genre, plateforme } = await params;
  const g = GENRE_PAR_SLUG[genre];
  const pf = PLATEFORME_PAR_SLUG[plateforme];
  if (!g || !pf) return { title: "Page non trouvée" };

  const title = `${g.nom} sur ${pf.nom} — séries et films à voir`;
  const description = `${g.intro} La sélection ${g.nom.toLowerCase()} disponible au catalogue ${pf.nom} en France.`;
  return {
    title,
    description,
    openGraph: { title: `${title} | StreamActu.fr`, description, images: OG_IMAGES },
    alternates: { canonical: `/genre/${g.slug}/${pf.slug}` },
  };
}

export default async function GenrePlateformePage({ params }: Props) {
  const { genre, plateforme } = await params;
  const g = GENRE_PAR_SLUG[genre];
  const pf = PLATEFORME_PAR_SLUG[plateforme];
  if (!g || !pf) notFound();

  const { series, films } = await getContenusGenre(g.idsTv, g.idsFilm, pf.id);
  // Garde-fou anti-contenu maigre : croisement trop pauvre → pas de page
  if (series.length + films.length < MIN_CONTENUS) notFound();

  return (
    <>
      <EnTeteNouveautes
        titre={`${g.nom} sur ${pf.nom}`}
        intro={`${g.intro} ${libelleComptes(series.length, films.length)} parmi les plus populaires du catalogue ${pf.nom} en France.`}
      />
      <div className="sa-container py-4 space-y-10">
        <nav aria-label="Navigation" className="flex items-center gap-4 flex-wrap">
          <Link
            href={`/genre/${g.slug}`}
            className="font-mono-label text-foreground border-b border-primary pb-1 hover:text-primary transition-colors"
          >
            ← {g.nom} toutes plateformes
          </Link>
          <Link
            href={`/${pf.slug}`}
            className="font-mono-label text-foreground border-b border-primary pb-1 hover:text-primary transition-colors"
          >
            Nouveautés {pf.nom} →
          </Link>
        </nav>

        <ListeContenus titre="Séries" contenus={series} priorite />
        <ListeContenus titre="Films" contenus={films} />

        <MaillageGenres actuel={g.slug} />
      </div>
    </>
  );
}
