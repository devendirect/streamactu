import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ACTU_PUBLIEE, ARTICLES, MIN_ARTICLES_INDEX, articlesDeLaPage } from "@/lib/actu";
import { metadonnees } from "@/lib/meta";
import { imageArticle } from "@/lib/actu-oeuvres";
import ListeArticles from "@/components/ListeArticles";

// Vignettes et plateformes viennent du cache des fiches : rafraîchies chaque jour
export const revalidate = 86400;

export const metadata: Metadata = metadonnees(
  "Actu : que regarder ce week-end",
  "Chaque vendredi, les séries et films à regarder ce week-end sur Netflix, Prime Video, Disney+, Canal+, HBO Max et les autres plateformes en France.",
  "/actu",
  // Une liste d'un ou deux articles est trop maigre pour l'index
  ARTICLES.length < MIN_ARTICLES_INDEX ? { robots: { index: false, follow: true } } : {}
);

export default async function ActuPage() {
  // Rubrique absente tant qu'aucun article n'est publié
  if (!ACTU_PUBLIEE) notFound();
  const articles = articlesDeLaPage(1);
  const images = await Promise.all(articles.map(imageArticle));

  return (
    <div className="sa-container py-10 max-w-2xl space-y-10">
      <div className="space-y-4">
        <p className="font-mono-label text-ink-3">Actu</p>
        <h1 className="text-4xl font-extrabold tracking-[-0.025em]">Que regarder ce week-end</h1>
        <p className="text-[#C4BBA9] leading-relaxed" style={{ fontFamily: "var(--font-newsreader), serif", fontSize: "17px" }}>
          Chaque vendredi matin, une sélection de trois à cinq nouveautés sorties dans la semaine sur les
          plateformes en France, choisies d&apos;après les données du site et expliquées en quelques lignes,
          puis le reste des sorties. Articles rédigés avec l&apos;aide de Claude et vérifiés avant publication.
          Pour les suivre :{" "}
          <a href="/actu/flux.xml" className="text-primary underline">
            flux RSS des articles
          </a>
          .
        </p>
      </div>

      <ListeArticles articles={articles} images={images} page={1} />
    </div>
  );
}
