import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getDetailFilm } from "@/lib/tmdb";
import { idDepuisSlug } from "@/lib/utils";
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

  return {
    title: film.titre,
    description: film.synopsis?.slice(0, 160),
    openGraph: {
      type: "video.movie",
      title: `${film.titre} | StreamActu.fr`,
      description: film.synopsis?.slice(0, 160),
      images: film.backdrop ? [{ url: film.backdrop }] : [],
    },
  };
}

export default async function FilmPage({ params }: Props) {
  const { slug } = await params;
  const film = await getFilm(slug);

  if (!film) notFound();

  return (
    <div className="sa-container py-6 max-w-2xl">
      <FicheDetail contenu={film} />
    </div>
  );
}
