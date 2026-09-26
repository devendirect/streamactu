import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { NB_PAGES_ACTU, articlesDeLaPage } from "@/lib/actu";
import { metadonnees } from "@/lib/meta";
import { imageArticle } from "@/lib/actu-oeuvres";
import ListeArticles from "@/components/ListeArticles";

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
    <div className="sa-container py-10 max-w-2xl space-y-10">
      <div className="space-y-4">
        <p className="font-mono-label text-ink-3">
          <Link href="/actu" className="hover:text-foreground transition-colors">
            Actu
          </Link>{" "}
          · page {n}
        </p>
        <h1 className="text-4xl font-extrabold tracking-[-0.025em]">Que regarder ce week-end : archives</h1>
      </div>
      <ListeArticles articles={articles} images={images} page={n} />
    </div>
  );
}
