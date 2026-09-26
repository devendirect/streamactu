import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { GUIDES, minutesDeLecture, trouverGuide } from "@/lib/guides";
import { metadonnees } from "@/lib/meta";
import { jsonLdFaq } from "@/lib/seo";
import { ORG_ID, SITE_URL } from "@/lib/site";
import { formatDateFR } from "@/lib/utils";
import CorpsGuide from "@/components/CorpsGuide";

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return GUIDES.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const guide = trouverGuide(slug);
  if (!guide) return { title: "Page non trouvée" };
  const meta = metadonnees(guide.titre, guide.description, `/guides/${guide.slug}`);
  return {
    ...meta,
    openGraph: {
      ...meta.openGraph,
      type: "article",
      publishedTime: guide.publie,
      modifiedTime: guide.misAJour,
    },
  };
}

function jsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export default async function GuidePage({ params }: Props) {
  const { slug } = await params;
  const guide = trouverGuide(slug);
  if (!guide) notFound();

  const url = `${SITE_URL}/guides/${guide.slug}`;
  const autres = GUIDES.filter((g) => g.slug !== guide.slug);

  const article = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.titre,
    description: guide.description,
    inLanguage: "fr-FR",
    datePublished: guide.publie,
    dateModified: guide.misAJour,
    mainEntityOfPage: url,
    image: `${SITE_URL}/og-default.png`,
    author: { "@id": ORG_ID },
    publisher: { "@id": ORG_ID },
  };
  const filAriane = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "StreamActu.fr", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Guides", item: `${SITE_URL}/guides` },
      { "@type": "ListItem", position: 3, name: guide.titre, item: url },
    ],
  };

  return (
    <div className="sa-container py-10 max-w-2xl space-y-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(article) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(filAriane) }} />
      {guide.faq.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdFaq(guide.faq.map((f) => ({ question: f.q, reponse: f.r }))) }}
        />
      )}

      <nav aria-label="Fil d'Ariane" className="font-mono-label text-ink-3 flex gap-2 flex-wrap">
        <Link href="/" className="hover:text-foreground transition-colors">
          Accueil
        </Link>
        <span aria-hidden="true">/</span>
        <Link href="/guides" className="hover:text-foreground transition-colors">
          Guides
        </Link>
      </nav>

      <article className="space-y-10">
        <header className="space-y-4">
          <h1 className="text-4xl font-extrabold tracking-[-0.025em]">{guide.titre}</h1>
          <p className="font-mono-label text-ink-3">
            Mis à jour le {formatDateFR(guide.misAJour)} · {minutesDeLecture(guide)} min de lecture · Par
            l&apos;éditeur de StreamActu.fr
          </p>
          <p className="font-mono-label text-ink-3">
            Rédigé avec l&apos;aide de Claude, vérifié avant publication ·{" "}
            <Link href="/a-propos#ia" className="underline hover:text-foreground">
              comment le site est fait
            </Link>
          </p>
          <p
            className="text-foreground leading-relaxed border-l-2 border-primary pl-4"
            style={{ fontFamily: "var(--font-newsreader), serif", fontSize: "19px" }}
          >
            {guide.chapo}
          </p>
        </header>

        <CorpsGuide sections={guide.sections} />
      </article>

      {guide.faq.length > 0 && (
        <section className="space-y-5 border-t border-border pt-6">
          <h2 className="font-mono-label text-[#9A9282]">Questions fréquentes</h2>
          {guide.faq.map((f) => (
            <div key={f.q}>
              <h3 className="text-[17px] font-bold mb-1">{f.q}</h3>
              <p
                className="text-[15px] leading-relaxed text-[#9A9282]"
                style={{ fontFamily: "var(--font-newsreader), serif" }}
              >
                {f.r}
              </p>
            </div>
          ))}
        </section>
      )}

      {guide.sources && guide.sources.length > 0 && (
        <section className="space-y-3 border-t border-border pt-6">
          <h2 className="font-mono-label text-[#9A9282]">Sources</h2>
          <ul className="space-y-1 text-sm text-[#9A9282]">
            {guide.sources.map((s) => (
              <li key={s.url}>
                <a href={s.url} target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">
                  {s.titre}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      {autres.length > 0 && (
        <section className="space-y-3 border-t border-border pt-6">
          <h2 className="font-mono-label text-[#9A9282]">Autres guides</h2>
          <ul className="space-y-2">
            {autres.map((g) => (
              <li key={g.slug}>
                <Link href={`/guides/${g.slug}`} className="text-foreground hover:text-primary transition-colors">
                  {g.titre} →
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
