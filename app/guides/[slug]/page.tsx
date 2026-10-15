import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import {
  GUIDES,
  ancreSection,
  ancresOrdre,
  cheminOeuvreGuide,
  estGuideOrdre,
  horodatageGuide,
  minutesDeLecture,
  oeuvresDesSections,
  sommaireOrdres,
  trouverGuide,
} from "@/lib/guides";
import { chargerOeuvres, cleOeuvre, type OeuvreArticle } from "@/lib/actu-oeuvres";
import { metadonnees } from "@/lib/meta";
import { jsonLdFaq } from "@/lib/seo";
import { ORG_ID, SITE_URL } from "@/lib/site";
import { formatDateFR } from "@/lib/utils";
import CorpsGuide from "@/components/CorpsGuide";
import CompteVues from "@/components/CompteVues";

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

// Listes ordonnées : année et plateformes viennent du cache des fiches, rafraîchies chaque jour
export const revalidate = 86400;

export function generateStaticParams() {
  return GUIDES.map((g) => ({ slug: g.slug }));
}

/** Grande image du guide : celle du premier titre cité qui en a une (sinon l'image du site) */
function imageGuide(oeuvres: Map<string, OeuvreArticle>): OeuvreArticle | undefined {
  return [...oeuvres.values()].find((o) => o.grandeImage);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const guide = trouverGuide(slug);
  if (!guide) return { title: "Page non trouvée" };
  const meta = metadonnees(guide.titre, guide.description, `/guides/${guide.slug}`);
  // Mêmes caches que la page : aucun appel supplémentaire
  const image = imageGuide(await chargerOeuvres(oeuvresDesSections(guide.sections)));
  return {
    ...meta,
    openGraph: {
      ...meta.openGraph,
      type: "article",
      publishedTime: horodatageGuide(guide.publie),
      modifiedTime: horodatageGuide(guide.misAJour),
      ...(image?.grandeImage ? { images: [{ url: image.grandeImage, width: 1280, height: 720, alt: image.titre }] } : {}),
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
  const oeuvres = await chargerOeuvres(oeuvresDesSections(guide.sections));
  // Guides d'ordre de visionnage : sommaire, listes dédiées, FAQ dépliable (maquette du 2026-10-09)
  const ordre = estGuideOrdre(guide);
  const sommaire = ordre ? sommaireOrdres(guide) : [];
  const listes = guide.sections.flatMap((s) =>
    s.blocs.flatMap((b) =>
      "oeuvres" in b
        ? [
            {
              "@context": "https://schema.org",
              "@type": "ItemList",
              name: s.titre,
              url: `${url}#${ancreSection(s)}`,
              itemListOrder: "https://schema.org/ItemListOrderAscending",
              numberOfItems: b.oeuvres.length,
              itemListElement: b.oeuvres.map((item, i) => {
                const o = oeuvres.get(cleOeuvre(item));
                return {
                  "@type": "ListItem",
                  position: i + 1,
                  name: item.portion ? `${o?.titre ?? item.titre} (${item.portion})` : (o?.titre ?? item.titre),
                  url: `${SITE_URL}${o ? `/${o.type}/${o.slug}` : cheminOeuvreGuide(item)}`,
                };
              }),
            },
          ]
        : []
    )
  );

  const article = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.titre,
    description: guide.description,
    inLanguage: "fr-FR",
    datePublished: horodatageGuide(guide.publie),
    dateModified: horodatageGuide(guide.misAJour),
    mainEntityOfPage: url,
    image: imageGuide(oeuvres)?.grandeImage ?? `${SITE_URL}/og-default.png`,
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
      {listes.map((l) => (
        <script key={l.url} type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(l) }} />
      ))}
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

        {sommaire.length > 0 && (
          <nav
            aria-label="Les ordres de ce guide"
            className={`grid gap-px overflow-hidden rounded-[4px] border border-border bg-border ${sommaire.length === 2 ? "grid-cols-2" : "grid-cols-1 sm:grid-cols-3"}`}
          >
            {sommaire.map((c) => (
              <a key={c.ancre} href={`#${c.ancre}`} className="flex flex-col gap-1.5 bg-card px-4 py-3.5 transition-colors hover:bg-[#221E17]">
                <span className="font-mono-label text-primary">{c.libelle}</span>
                <span className="text-[17px] font-bold text-foreground">
                  {c.valeur}
                  {c.ordre === "histoire" && <CompteVues cle={c.cleSuivi} etapes={c.etapes} />}
                </span>
              </a>
            ))}
          </nav>
        )}

        <CorpsGuide
          sections={guide.sections}
          oeuvres={oeuvres}
          ancres={ordre ? ancresOrdre(guide.sections) : undefined}
          slugGuide={guide.slug}
        />
      </article>

      {guide.faq.length > 0 && (
        <section className={ordre ? "" : "space-y-5 border-t border-border pt-6"}>
          <h2 className={ordre ? "mb-2.5 text-2xl font-extrabold tracking-[-0.02em]" : "font-mono-label text-[#9A9282]"}>
            Questions fréquentes
          </h2>
          {ordre
            ? guide.faq.map((f, i) => (
                <details key={f.q} open={i === 0} className="border-t border-border py-3.5">
                  <summary className="flex cursor-pointer list-none justify-between gap-4 text-[17px] font-bold text-foreground [&::-webkit-details-marker]:hidden">
                    {f.q}
                    <span aria-hidden="true" className="flex-none font-mono text-primary">
                      +
                    </span>
                  </summary>
                  <p className="mt-2.5 font-serif text-[17px] leading-relaxed text-[#C4BBA9]">{f.r}</p>
                </details>
              ))
            : guide.faq.map((f) => (
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
