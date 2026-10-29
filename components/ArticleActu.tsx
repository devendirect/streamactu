import Image from "next/image";
import Link from "next/link";
import { ARTICLES, cheminArticle, horodatageArticle, periodeArticle, rubriquesArticle, type Article } from "@/lib/actu";
import { slugify } from "@/lib/utils";
import { cleOeuvre, imageArticle, imagePrincipale, type OeuvreArticle } from "@/lib/actu-oeuvres";
import { ORG_ID, SITE_URL } from "@/lib/site";
import { formatDateFR } from "@/lib/utils";
import { BlocsGuide } from "@/components/CorpsGuide";
import CarteOeuvreArticle from "@/components/CarteOeuvreArticle";
import TeteLecture from "@/components/lecture/TeteLecture";
import SommaireLecture from "@/components/lecture/SommaireLecture";

interface Props {
  article: Article;
  oeuvres: Map<string, OeuvreArticle>;
  /** Titre affiché (h1, fil d'Ariane) : celui de l'article, ou le titre stable de l'adresse fixe */
  titre: string;
  /** Ligne sous le titre, pour l'adresse fixe : « Édition du 9 au 11 octobre 2026 » */
  edition?: string;
}

function jsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

/** Corps d'un article Actu, servi à son adresse datée ou à l'adresse fixe de l'édition courante */
export default async function ArticleActu({ article, oeuvres, titre, edition }: Props) {
  const url = `${SITE_URL}${cheminArticle(article)}`;
  const principale = imagePrincipale(article, oeuvres);
  // Éditions précédentes du même format (un week-end renvoie aux week-ends, un mois aux mois)
  const rubriques = rubriquesArticle(article);
  const autres = ARTICLES.filter((a) => a.format === article.format && a.slug !== article.slug).slice(0, 5);

  const donnees = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.titre,
    description: article.description,
    inLanguage: "fr-FR",
    datePublished: horodatageArticle(article.publie),
    dateModified: horodatageArticle(article.misAJour),
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
      { "@type": "ListItem", position: 3, name: titre, item: url },
    ],
  };

  // Sommaire : les rubriques (article du mois), sinon les titres des sections
  const sommaire =
    rubriques.length > 0
      ? rubriques.map((r) => ({ id: r.ancre, label: r.titre }))
      : article.sections.map((s) => ({ id: slugify(s.titre), label: s.titre }));
  const imagesAutres = await Promise.all(autres.map(imageArticle));
  // Période séparée du titre seulement à l'adresse datée et si le titre en a une (« … : 23 au 25 octobre 2026 »)
  const periode = titre === article.titre && article.titre.includes(" : ") ? periodeArticle(article) : undefined;
  const titreCourt = periode ? article.titre.slice(0, article.titre.length - periode.length - 3) : titre;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(donnees) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(filAriane) }} />

      <TeteLecture
        ariane={[
          { href: "/", label: "Accueil" },
          { href: "/actu", label: "Actu" },
        ]}
        titre={titreCourt}
        periode={periode}
        edition={edition}
        meta={
          <>
            <p>
              Publié le {formatDateFR(article.publie)}
              {article.misAJour !== article.publie ? ` · mis à jour le ${formatDateFR(article.misAJour)}` : ""} · Par
              l&apos;éditeur de StreamActu.fr
            </p>
            <p>
              Rédigé avec l&apos;aide de Claude à partir des données du site, vérifié avant publication ·{" "}
              <Link href="/a-propos#ia" className="underline underline-offset-[3px] transition-colors duration-200 hover:text-texte">
                comment le site est fait
              </Link>
            </p>
          </>
        }
        chapo={article.chapo}
      />

      <div className="lecture">
        <SommaireLecture liens={sommaire} titre={rubriques.length > 0 ? "Par plateforme" : "Dans cet article"} />

        <article className="space-y-10">
          {principale?.grandeImage && (
            <figure className="space-y-2">
              <div className="relative aspect-video overflow-hidden rounded-[14px] bg-surface">
                <Image
                  src={principale.grandeImage}
                  alt={`Image de ${principale.titre}`}
                  fill
                  preload
                  sizes="(max-width: 980px) 100vw, 720px"
                  className="object-cover"
                />
              </div>
              <figcaption className="text-[13px] text-texte-2">{principale.titre} · image TMDB</figcaption>
            </figure>
          )}

          {article.sections.map((s, i) => {
            const oeuvre = s.oeuvre ? oeuvres.get(cleOeuvre(s.oeuvre)) : undefined;
            // Article à rubriques : titre de rubrique (h2 ancré) à chaque changement, sections en h3
            const nouvelleRubrique = s.rubrique && s.rubrique !== article.sections[i - 1]?.rubrique;
            const Titre = rubriques.length > 0 && s.rubrique ? "h3" : "h2";
            return (
              <section key={s.titre} id={rubriques.length > 0 ? undefined : slugify(s.titre)} className="scroll-mt-24 space-y-3.5">
                {nouvelleRubrique && (
                  <h2
                    id={slugify(s.rubrique!)}
                    className="scroll-mt-24 border-t border-trait pt-8 text-[clamp(26px,2.4vw,34px)] font-extrabold tracking-[-0.025em]"
                  >
                    {s.rubrique}
                  </h2>
                )}
                <Titre
                  className={
                    Titre === "h3"
                      ? "text-xl font-bold tracking-[-0.015em]"
                      : "text-[clamp(22px,2vw,28px)] leading-[1.2] font-extrabold tracking-[-0.02em]"
                  }
                >
                  {s.titre}
                </Titre>
                <BlocsGuide blocs={s.blocs} />
                {oeuvre && <CarteOeuvreArticle oeuvre={oeuvre} />}
              </section>
            );
          })}
        </article>
      </div>

      {autres.length > 0 && (
        <section aria-labelledby="editions-precedentes" className="mb-section px-gouttiere">
          <h2 id="editions-precedentes" className="mb-3.5 text-[clamp(19px,1.6vw,23px)] font-bold tracking-[-0.01em]">
            {article.format === "mois" ? "Les mois précédents" : "Les semaines précédentes"}
          </h2>
          <ul className="grid grid-cols-[repeat(auto-fill,minmax(min(260px,100%),1fr))] gap-3.5">
            {autres.map((a, i) => (
              <li key={a.slug}>
                <Link href={cheminArticle(a)} className="group block">
                  <span className="relative block aspect-video overflow-hidden rounded-lg bg-surface">
                    {imagesAutres[i]?.grandeImage && (
                      <Image
                        src={imagesAutres[i]!.grandeImage!}
                        alt=""
                        fill
                        sizes="(max-width: 760px) 100vw, 340px"
                        className="object-cover transition-transform duration-300 ease-salle group-hover:scale-[1.03]"
                      />
                    )}
                  </span>
                  <span className="mt-2 block text-[15px] leading-snug font-semibold transition-colors duration-200 group-hover:text-white">
                    {a.titre}
                  </span>
                  <span className="mt-0.5 block text-[13px] text-texte-2">{formatDateFR(a.publie)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}
