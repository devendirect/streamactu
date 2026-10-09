import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ARTICLES, cheminArticle, trouverArticle } from "@/lib/actu";
import { metadonnees } from "@/lib/meta";
import ArticleActu from "@/components/ArticleActu";
import { imagePrincipale, oeuvresArticle } from "@/lib/actu-oeuvres";

interface Props {
  params: Promise<{ slug: string }>;
}

// Images, notes et plateformes viennent du cache des fiches : rafraîchies chaque jour
export const revalidate = 86400;

// Seuls les articles publiés existent (un brouillon fait 404)
export const dynamicParams = false;

export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = trouverArticle(slug);
  if (!article) return { title: "Page non trouvée" };
  // Édition courante : canonical vers l'adresse fixe, puis vers elle-même une fois archivée
  const meta = metadonnees(article.titre, article.description, cheminArticle(article));
  // Image de partage : la grande image de l'article (mêmes caches que la page)
  const image = imagePrincipale(article, await oeuvresArticle(article));
  return {
    ...meta,
    openGraph: {
      ...meta.openGraph,
      type: "article",
      publishedTime: article.publie,
      modifiedTime: article.misAJour,
      ...(image?.grandeImage ? { images: [{ url: image.grandeImage, width: 1280, height: 720, alt: image.titre }] } : {}),
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = trouverArticle(slug);
  if (!article) notFound();
  const oeuvres = await oeuvresArticle(article);
  return <ArticleActu article={article} oeuvres={oeuvres} titre={article.titre} />;
}
