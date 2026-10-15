import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { cheminFixe, editionCourante, horodatageArticle } from "@/lib/actu";
import { metadonnees } from "@/lib/meta";
import ArticleActu from "@/components/ArticleActu";
import { imagePrincipale, oeuvresArticle } from "@/lib/actu-oeuvres";

// Adresse fixe des nouveautés du mois (voir ADRESSES_FIXES) : contenu du
// dernier article « mois » publié. Contrairement au week-end, le titre garde
// le mois (« Nouveautés streaming de novembre 2026 ») : c'est ce qui est cherché.
export const revalidate = 86400;

export async function generateMetadata(): Promise<Metadata> {
  const article = editionCourante("mois");
  if (!article) return { title: "Page non trouvée" };
  const meta = metadonnees(article.titre, article.description, cheminFixe("mois"));
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

export default async function NouveautesDuMoisPage() {
  const article = editionCourante("mois");
  // 404 tant qu'aucun article du mois n'est publié
  if (!article) notFound();
  const oeuvres = await oeuvresArticle(article);
  return <ArticleActu article={article} oeuvres={oeuvres} titre={article.titre} />;
}
