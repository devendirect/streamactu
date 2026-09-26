import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { titreAffiche, titreMeta } from "@/lib/meta";
import { getDetailSerie } from "@/lib/tmdb";
import { idDepuisSlug } from "@/lib/utils";
import { descriptionFiche, jsonLdFiche } from "@/lib/seo";
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

  const description = descriptionFiche(serie);
  return {
    title: titreMeta(serie.titre),
    description,
    alternates: { canonical: `/serie/${serie.slug}` },
    openGraph: {
      type: "video.tv_show",
      title: titreAffiche(serie.titre),
      description,
      images: serie.backdrop ? [{ url: serie.backdrop }] : ["/og-default.png"],
    },
  };
}

export default async function SeriePage({ params }: Props) {
  const { slug } = await params;
  const serie = await getSerie(slug);

  if (!serie) notFound();

  return (
    <div className="sa-container py-6 max-w-2xl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdFiche(serie) }}
      />
      <FicheDetail contenu={serie} />
    </div>
  );
}
