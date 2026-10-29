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
import TeteLecture from "@/components/lecture/TeteLecture";
import SommaireLecture from "@/components/lecture/SommaireLecture";
import Icone from "@/components/Icone";

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

  // Sommaire collant : les sections, puis la FAQ et les sources
  const liensSommaire = [
    ...guide.sections.map((s) => ({ id: ancreSection(s), label: s.titre })),
    ...(guide.faq.length > 0 ? [{ id: "faq", label: "Questions fréquentes" }] : []),
    ...(guide.sources && guide.sources.length > 0 ? [{ id: "sources", label: "Sources" }] : []),
  ];

  return (
    <>
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

      <TeteLecture
        ariane={[
          { href: "/", label: "Accueil" },
          { href: "/guides", label: "Guides" },
        ]}
        titre={guide.titre}
        meta={
          <>
            <p>
              Mis à jour le {formatDateFR(guide.misAJour)} · {minutesDeLecture(guide)} min de lecture · Par l&apos;éditeur de
              StreamActu.fr
            </p>
            <p>
              Rédigé avec l&apos;aide de Claude, vérifié avant publication ·{" "}
              <Link href="/a-propos#ia" className="underline underline-offset-[3px] transition-colors duration-200 hover:text-texte">
                comment le site est fait
              </Link>
            </p>
          </>
        }
        chapo={guide.chapo}
      />

      <div className="lecture">
        <SommaireLecture liens={liensSommaire} />

        <div className="space-y-section">
          <article className="space-y-10">
            {sommaire.length > 0 && (
              <nav
                aria-label="Les ordres de ce guide"
                className={`grid gap-2.5 ${sommaire.length === 2 ? "grid-cols-2" : "grid-cols-1 sm:grid-cols-3"}`}
              >
                {sommaire.map((c) => (
                  <a
                    key={c.ancre}
                    href={`#${c.ancre}`}
                    className="flex flex-col gap-1.5 rounded-xl bg-surface px-4 py-3.5 transition-[background-color,translate] duration-200 ease-salle hover:-translate-y-0.5 hover:bg-surface-2"
                  >
                    <span className="libelle text-texte-2">{c.libelle}</span>
                    <span className="text-[17px] font-bold">
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
            <section id="faq" aria-labelledby="h-faq" className="scroll-mt-24">
              <h2 id="h-faq" className="mb-3.5 text-[clamp(22px,2vw,28px)] leading-[1.2] font-extrabold tracking-[-0.02em]">
                Questions fréquentes
              </h2>
              {/* Accordéon : les réponses restent dans le HTML */}
              {guide.faq.map((f, i) => (
                <details key={f.q} open={ordre && i === 0} className="group border-t border-trait last:border-b">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-[18px] text-[17px] font-bold [&::-webkit-details-marker]:hidden">
                    {f.q}
                    <Icone
                      nom="bas"
                      taille={20}
                      className="flex-none text-texte-2 transition-transform duration-300 ease-salle group-open:rotate-180"
                    />
                  </summary>
                  <p className="pb-5 text-[17px] leading-[1.7] text-texte-doux">{f.r}</p>
                </details>
              ))}
            </section>
          )}

          {guide.sources && guide.sources.length > 0 && (
            <section id="sources" aria-labelledby="h-sources" className="scroll-mt-24">
              <h2 id="h-sources" className="libelle mb-3 text-texte-2">
                Sources
              </h2>
              <ul className="space-y-1.5 text-[15px] text-texte-doux">
                {guide.sources.map((s) => (
                  <li key={s.url}>
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline decoration-ambre/60 underline-offset-4 transition-[text-decoration-color] duration-200 hover:decoration-ambre"
                    >
                      {s.titre}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>

      {autres.length > 0 && (
        <nav aria-labelledby="autres-guides" className="mb-section px-gouttiere">
          <h2 id="autres-guides" className="mb-3 text-[clamp(19px,1.6vw,23px)] font-bold tracking-[-0.01em]">
            Autres guides
          </h2>
          <ul className="flex flex-wrap gap-x-7 gap-y-2.5">
            {autres.map((g) => (
              <li key={g.slug}>
                <Link href={`/guides/${g.slug}`} className="lien-fleche">
                  {g.titre}
                  <Icone nom="droite" taille={18} />
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </>
  );
}
