import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { OG_BASE, titreAffiche, titreFiche, titreMeta } from "@/lib/meta";
import { getDetailSerie } from "@/lib/tmdb";
import { idDepuisSlug } from "@/lib/utils";
import { descriptionFiche, fichePauvre, jsonLdFiche } from "@/lib/seo";
import { suggestionsFiche } from "@/lib/suggestions";
import FicheDetail from "@/components/FicheDetail";

export const revalidate = 3600;

// Liste vide : aucune fiche rendue au build, chacune l'est à sa première
// visite puis mise en cache une heure (ISR). Sans generateStaticParams, la
// route est rendue à chaque requête, robots compris (audit du 2026-10-14).
export async function generateStaticParams() {
  return [];
}

interface Props {
  params: Promise<{ slug: string }>;
}

async function getSerie(slug: string) {
  const id = idDepuisSlug(slug);
  if (!id) return null;
  try {
    return await getDetailSerie(id);
  } catch (err) {
    // Seul un identifiant inconnu de TMDB donne une 404. Une panne passagère
    // (429, 5xx, réseau) remonte en erreur : la page n'est pas mise en cache
    // comme introuvable, et l'ancienne version reste servie.
    if (err instanceof Error && err.message.startsWith("TMDB 404")) return null;
    throw err;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const serie = await getSerie(slug);
  if (!serie) return { title: "Série introuvable" };

  const description = descriptionFiche(serie);
  const titre = titreFiche(serie.titre, "serie");
  return {
    title: titreMeta(titre),
    description,
    alternates: { canonical: `/serie/${serie.slug}` },
    ...(fichePauvre(serie) ? { robots: { index: false, follow: true } } : {}),
    openGraph: {
      ...OG_BASE,
      type: "video.tv_show",
      url: `/serie/${serie.slug}`,
      title: titreAffiche(titre),
      description,
      images: serie.backdrop ? [{ url: serie.backdrop }] : ["/og-default.png"],
    },
  };
}

export default async function SeriePage({ params }: Props) {
  const { slug } = await params;
  const serie = await getSerie(slug);

  if (!serie) notFound();
  const suggestions = await suggestionsFiche(serie);

  return (
    <div className="sa-container py-6 max-w-2xl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdFiche(serie) }}
      />
      <FicheDetail contenu={serie} suggestions={suggestions} />
    </div>
  );
}
