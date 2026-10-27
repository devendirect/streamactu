import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ACTU_PUBLIEE, ARTICLES, MIN_ARTICLES_INDEX, articlesDeLaPage } from "@/lib/actu";
import { metadonnees } from "@/lib/meta";
import { imageArticle } from "@/lib/actu-oeuvres";
import ListeArticles from "@/components/ListeArticles";
import Faisceau from "@/components/Faisceau";
import { CHAINES_VIDEO } from "@/lib/site";

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
    <>
      <div className="scene -mt-entete px-gouttiere pt-[clamp(130px,18vh,190px)] pb-8">
        <Faisceau doux />
        <h1 className="text-[clamp(34px,4.6vw,64px)] leading-none font-black tracking-[-0.03em]">Que regarder ce week-end</h1>
        <p className="mt-3 max-w-[66ch] text-[clamp(16px,1.2vw,18px)] text-texte-doux">
          Chaque vendredi matin, une sélection de trois à cinq nouveautés sorties dans la semaine sur les
          plateformes en France, choisies d&apos;après les données du site et expliquées en quelques lignes,
          puis le reste des sorties. Articles rédigés avec l&apos;aide de Claude et vérifiés avant publication.
          Pour les suivre :{" "}
          <a href="/actu/flux.xml" className="text-white underline decoration-ambre/60 underline-offset-4 hover:decoration-ambre">
            flux RSS des articles
          </a>
          .
        </p>
        <nav aria-label="Suivre les articles" className="mt-5 flex flex-wrap gap-2">
          <a href="/actu/flux.xml" className="puce">
            Flux RSS
          </a>
          {CHAINES_VIDEO.map((c) => (
            <a key={c.nom} href={c.url} target="_blank" rel="noopener noreferrer" className="puce">
              Le short sur {c.nom}
            </a>
          ))}
        </nav>
      </div>
      <div className="px-gouttiere pt-4 pb-10">
        <ListeArticles articles={articles} images={images} page={1} />
      </div>
    </>
  );
}
