import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { NB_PAGES_ACTU, articlesDeLaPage } from "@/lib/actu";
import { metadonnees } from "@/lib/meta";
import { imageArticle } from "@/lib/actu-oeuvres";
import ListeArticles from "@/components/ListeArticles";
import TeteLecture from "@/components/lecture/TeteLecture";

// Pages 2, 3… de la liste des articles (la page 1 est /actu)
export const revalidate = 86400;
export const dynamicParams = false;

interface Props {
  params: Promise<{ n: string }>;
}

export function generateStaticParams() {
  return Array.from({ length: Math.max(0, NB_PAGES_ACTU - 1) }, (_, i) => ({ n: String(i + 2) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const n = Number((await params).n);
  if (articlesDeLaPage(n).length === 0 || n < 2) return { title: "Page non trouvée" };
  return metadonnees(
    `Actu : que regarder ce week-end, page ${n}`,
    `Les articles « Que regarder ce week-end » des semaines précédentes, page ${n} : les séries et films sortis sur les plateformes de streaming en France.`,
    `/actu/page/${n}`
  );
}

export default async function ActuPageN({ params }: Props) {
  const n = Number((await params).n);
  const articles = articlesDeLaPage(n);
  if (n < 2 || articles.length === 0) notFound();
  const images = await Promise.all(articles.map(imageArticle));

  return (
    <>
      <TeteLecture
        ariane={[
          { href: "/", label: "Accueil" },
          { href: "/actu", label: "Actu" },
        ]}
        titre="Que regarder ce week-end : archives"
        meta={<p>Page {n}</p>}
      />
      <div className="px-gouttiere pt-4 pb-10">
        <ListeArticles articles={articles} images={images} page={n} />
      </div>
    </>
  );
}
