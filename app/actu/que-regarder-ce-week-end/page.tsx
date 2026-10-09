import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CHEMIN_EDITION_COURANTE, EDITION_COURANTE, periodeArticle } from "@/lib/actu";
import { metadonnees } from "@/lib/meta";
import ArticleActu from "@/components/ArticleActu";
import { imagePrincipale, oeuvresArticle } from "@/lib/actu-oeuvres";

// Adresse fixe de l'édition de la semaine (voir SLUG_EDITION_COURANTE) : le
// titre ne change pas, le contenu est celui du dernier article publié.
export const revalidate = 86400;

const TITRE = "Que regarder ce week-end";

export async function generateMetadata(): Promise<Metadata> {
  if (!EDITION_COURANTE) return { title: "Page non trouvée" };
  const article = EDITION_COURANTE;
  const meta = metadonnees(`${TITRE} en streaming`, article.description, CHEMIN_EDITION_COURANTE);
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

export default async function EditionCourantePage() {
  // Rubrique absente tant qu'aucun article n'est publié
  if (!EDITION_COURANTE) notFound();
  const oeuvres = await oeuvresArticle(EDITION_COURANTE);
  return (
    <ArticleActu
      article={EDITION_COURANTE}
      oeuvres={oeuvres}
      titre={TITRE}
      edition={`Édition du ${periodeArticle(EDITION_COURANTE)}`}
    />
  );
}
