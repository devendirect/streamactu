import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { titreAffiche, titreMeta } from "@/lib/meta";
import { getDetailFilm } from "@/lib/tmdb";
import { idDepuisSlug } from "@/lib/utils";
import { descriptionFiche, jsonLdFiche } from "@/lib/seo";
import { suggestionsFiche } from "@/lib/suggestions";
import FicheDetail from "@/components/FicheDetail";

export const revalidate = 3600;

interface Props {
  params: Promise<{ slug: string }>;
}

async function getFilm(slug: string) {
  const id = idDepuisSlug(slug);
  if (!id) return null;
  try {
    return await getDetailFilm(id);
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const film = await getFilm(slug);
  if (!film) return { title: "Film introuvable" };

  const description = descriptionFiche(film);
  return {
    title: titreMeta(film.titre),
    description,
    alternates: { canonical: `/film/${film.slug}` },
    openGraph: {
      type: "video.movie",
      title: titreAffiche(film.titre),
      description,
      images: film.backdrop ? [{ url: film.backdrop }] : ["/og-default.png"],
    },
  };
}

export default async function FilmPage({ params }: Props) {
  const { slug } = await params;
  const film = await getFilm(slug);

  if (!film) notFound();
  const suggestions = await suggestionsFiche(film);

  return (
    <div className="sa-container py-6 max-w-2xl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdFiche(film) }}
      />
      <FicheDetail contenu={film} suggestions={suggestions} />
    </div>
  );
}
