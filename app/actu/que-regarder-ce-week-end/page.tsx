import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { cheminFixe, editionCourante, periodeArticle, horodatageArticle } from "@/lib/actu";
import { metadonnees } from "@/lib/meta";
import ArticleActu from "@/components/ArticleActu";
import { imagePrincipale, oeuvresArticle } from "@/lib/actu-oeuvres";

// Adresse fixe de l'édition de la semaine (voir ADRESSES_FIXES) : le titre ne
// change pas, le contenu est celui du dernier article « week-end » publié.
export const revalidate = 86400;

const TITRE = "Que regarder ce week-end";

export async function generateMetadata(): Promise<Metadata> {
  const article = editionCourante("week-end");
  if (!article) return { title: "Page non trouvée" };
  const meta = metadonnees(`${TITRE} en streaming`, article.description, cheminFixe("week-end"));
  const image = imagePrincipale(article, await oeuvresArticle(article));
  return {
    ...meta,
    openGraph: {
      ...meta.openGraph,
      type: "article",
      publishedTime: horodatageArticle(article.publie),
      modifiedTime: horodatageArticle(article.misAJour),
      ...(image?.grandeImage ? { images: [{ url: image.grandeImage, width: 1280, height: 720, alt: image.titre }] } : {}),
    },
  };
}

export default async function EditionCourantePage() {
  const article = editionCourante("week-end");
  // Rubrique absente tant qu'aucun article n'est publié
  if (!article) notFound();
  const oeuvres = await oeuvresArticle(article);
  return (
    <ArticleActu
      article={article}
      oeuvres={oeuvres}
      titre={TITRE}
      edition={`Édition du ${periodeArticle(article)}`}
    />
  );
}
