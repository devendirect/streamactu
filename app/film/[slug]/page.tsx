import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { OG_BASE, titreAffiche, titreMeta } from "@/lib/meta";
import { getDetailFilm } from "@/lib/tmdb";
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

async function getFilm(slug: string) {
  const id = idDepuisSlug(slug);
  if (!id) return null;
  try {
    return await getDetailFilm(id);
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
  const film = await getFilm(slug);
  if (!film) return { title: "Film introuvable" };

  const description = descriptionFiche(film);
  return {
    title: titreMeta(film.titre),
    description,
    alternates: { canonical: `/film/${film.slug}` },
    ...(fichePauvre(film) ? { robots: { index: false, follow: true } } : {}),
    openGraph: {
      ...OG_BASE,
      type: "video.movie",
      url: `/film/${film.slug}`,
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
