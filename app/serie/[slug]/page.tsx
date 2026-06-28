import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getDetailSerie } from "@/lib/tmdb";
import { idDepuisSlug } from "@/lib/utils";
import FicheDetail from "@/components/FicheDetail";

export const revalidate = 3600;

interface Props {
  params: Promise<{ slug: string }>;
}

async function getSerie(slug: string) {
  const id = idDepuisSlug(slug);
  if (!id) return null;
  try {
    return await getDetailSerie(id);
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const serie = await getSerie(slug);
  if (!serie) return { title: "Série introuvable" };

  return {
    title: serie.titre,
    description: serie.synopsis?.slice(0, 160),
    openGraph: {
      title: `${serie.titre} | StreamActu.fr`,
      description: serie.synopsis?.slice(0, 160),
      images: serie.backdrop ? [{ url: serie.backdrop }] : [],
    },
  };
}

export default async function SeriePage({ params }: Props) {
  const { slug } = await params;
  const serie = await getSerie(slug);

  if (!serie) notFound();

  return (
    <div className="sa-container py-6 max-w-2xl">
      <FicheDetail contenu={serie} />
    </div>
  );
}
