import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { ARTICLES, trouverArticle } from "@/lib/actu";
import { metadonnees } from "@/lib/meta";
import { ORG_ID, SITE_URL } from "@/lib/site";
import { formatDateFR } from "@/lib/utils";
import Image from "next/image";
import { BlocsGuide } from "@/components/CorpsGuide";
import CarteOeuvreArticle from "@/components/CarteOeuvreArticle";
import { cleOeuvre, imagePrincipale, oeuvresArticle } from "@/lib/actu-oeuvres";

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
  const meta = metadonnees(article.titre, article.description, `/actu/${article.slug}`);
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

function jsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = trouverArticle(slug);
  if (!article) notFound();

  const url = `${SITE_URL}/actu/${article.slug}`;
  const oeuvres = await oeuvresArticle(article);
  const principale = imagePrincipale(article, oeuvres);
  const autres = ARTICLES.filter((a) => a.slug !== article.slug).slice(0, 5);

  const donnees = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.titre,
    description: article.description,
    inLanguage: "fr-FR",
    datePublished: article.publie,
    dateModified: article.misAJour,
    mainEntityOfPage: url,
    image: principale?.grandeImage ?? `${SITE_URL}/og-default.png`,
    author: { "@id": ORG_ID },
    publisher: { "@id": ORG_ID },
  };
  const filAriane = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "StreamActu.fr", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Actu", item: `${SITE_URL}/actu` },
      { "@type": "ListItem", position: 3, name: article.titre, item: url },
    ],
  };

  return (
    <div className="sa-container py-10 max-w-2xl space-y-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(donnees) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(filAriane) }} />

      <nav aria-label="Fil d'Ariane" className="font-mono-label text-ink-3 flex gap-2 flex-wrap">
        <Link href="/" className="hover:text-foreground transition-colors">
          Accueil
        </Link>
        <span aria-hidden="true">/</span>
        <Link href="/actu" className="hover:text-foreground transition-colors">
          Actu
        </Link>
      </nav>

      <article className="space-y-10">
        <header className="space-y-4">
          {principale?.grandeImage && (
            <figure className="space-y-2">
              <div className="relative aspect-[16/9] overflow-hidden border border-border bg-white/5">
                <Image
                  src={principale.grandeImage}
                  alt={`Image de ${principale.titre}`}
                  fill
                  priority
                  sizes="(max-width: 672px) 100vw, 672px"
                  className="object-cover"
                />
              </div>
              <figcaption className="font-mono-label text-ink-4">{principale.titre} · image TMDB</figcaption>
            </figure>
          )}
          <h1 className="text-4xl font-extrabold tracking-[-0.025em]">{article.titre}</h1>
          <p className="font-mono-label text-ink-3">
            Publié le {formatDateFR(article.publie)}
            {article.misAJour !== article.publie ? ` · mis à jour le ${formatDateFR(article.misAJour)}` : ""} · Par
            l&apos;éditeur de StreamActu.fr
          </p>
          <p className="font-mono-label text-ink-3">
            Rédigé avec l&apos;aide de Claude à partir des données du site, vérifié avant publication ·{" "}
            <Link href="/a-propos#ia" className="underline hover:text-foreground">
              comment le site est fait
            </Link>
          </p>
          <p
            className="text-foreground leading-relaxed border-l-2 border-primary pl-4"
            style={{ fontFamily: "var(--font-newsreader), serif", fontSize: "19px" }}
          >
            {article.chapo}
          </p>
        </header>

        <div className="space-y-10">
          {article.sections.map((s) => {
            const oeuvre = s.oeuvre ? oeuvres.get(cleOeuvre(s.oeuvre)) : undefined;
            return (
              <section key={s.titre} className="space-y-4">
                <h2 className="text-2xl font-extrabold tracking-[-0.02em]">{s.titre}</h2>
                <BlocsGuide blocs={s.blocs} />
                {oeuvre && <CarteOeuvreArticle oeuvre={oeuvre} />}
              </section>
            );
          })}
        </div>
      </article>

      {autres.length > 0 && (
        <section className="space-y-3 border-t border-border pt-6">
          <h2 className="font-mono-label text-[#9A9282]">Les semaines précédentes</h2>
          <ul className="space-y-2">
            {autres.map((a) => (
              <li key={a.slug}>
                <Link href={`/actu/${a.slug}`} className="text-foreground hover:text-primary transition-colors">
                  {a.titre} →
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
