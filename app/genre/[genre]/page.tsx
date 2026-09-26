import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { getContenusGenre } from "@/lib/tmdb";
import { GENRES_SEO, GENRE_PAR_SLUG } from "@/lib/genres";
import { PLATEFORMES } from "@/lib/plateformes";
import { libelleComptes } from "@/lib/utils";
import { metadonnees, metaGenre } from "@/lib/meta";
import EnTeteNouveautes from "@/components/EnTeteNouveautes";
import ListeContenus from "@/components/ListeContenus";
import MaillageGenres from "@/components/MaillageGenres";

export const revalidate = 86400;

const MIN_CONTENUS = 5;

interface Props {
  params: Promise<{ genre: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { genre } = await params;
  const g = GENRE_PAR_SLUG[genre];
  if (!g) return { title: "Page non trouvée" };

  const { titre, description } = metaGenre(g.nom, g.intro);
  return metadonnees(titre, description, `/genre/${g.slug}`);
}

export function generateStaticParams() {
  return GENRES_SEO.map((g) => ({ genre: g.slug }));
}

export default async function GenrePage({ params }: Props) {
  const { genre } = await params;
  const g = GENRE_PAR_SLUG[genre];
  if (!g) notFound();

  const { series, films } = await getContenusGenre(g.idsTv, g.idsFilm);
  if (series.length + films.length < MIN_CONTENUS) notFound();

  return (
    <>
      <EnTeteNouveautes
        titre={`${g.nom} en streaming`}
        intro={`${g.intro} ${libelleComptes(series.length, films.length)} parmi les plus populaires du moment, disponibles en streaming en France.`}
      />
      <div className="sa-container py-4 space-y-10">
        {/* Déclinaisons par plateforme */}
        <nav aria-label={`${g.nom} par plateforme`} className="flex items-center gap-x-4 gap-y-2 flex-wrap">
          <span className="font-mono-label text-ink-4">Par plateforme :</span>
          {PLATEFORMES.map((pf) => (
            <Link
              key={pf.id}
              href={`/genre/${g.slug}/${pf.slug}`}
              className="font-mono-label text-[#9A9282] hover:text-foreground transition-colors"
            >
              {pf.nom}
            </Link>
          ))}
        </nav>

        <ListeContenus titre="Séries" contenus={series} priorite />
        <ListeContenus titre="Films" contenus={films} />

        <MaillageGenres actuel={g.slug} />
      </div>
    </>
  );
}
