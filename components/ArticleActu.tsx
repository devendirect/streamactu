import Image from "next/image";
import Link from "next/link";
import { ARTICLES, cheminArticle, horodatageArticle, rubriquesArticle, type Article } from "@/lib/actu";
import { slugify } from "@/lib/utils";
import { cleOeuvre, imagePrincipale, type OeuvreArticle } from "@/lib/actu-oeuvres";
import { ORG_ID, SITE_URL } from "@/lib/site";
import { formatDateFR } from "@/lib/utils";
import { BlocsGuide } from "@/components/CorpsGuide";
import CarteOeuvreArticle from "@/components/CarteOeuvreArticle";

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
export default function ArticleActu({ article, oeuvres, titre, edition }: Props) {
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
          <h1 className="text-4xl font-extrabold tracking-[-0.025em]">{titre}</h1>
          {edition && <p className="text-xl font-semibold text-foreground">{edition}</p>}
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
            style={{ fontFamily: "var(--font-onest), sans-serif", fontSize: "19px" }}
          >
            {article.chapo}
          </p>
        </header>

        {rubriques.length > 0 && (
          <nav aria-label="Sommaire" className="border border-border p-4 space-y-2">
            <p className="font-mono-label text-ink-3">Par plateforme</p>
            <ul className="flex flex-wrap gap-x-5 gap-y-2">
              {rubriques.map((r) => (
                <li key={r.ancre}>
                  <a href={`#${r.ancre}`} className="text-foreground hover:text-primary transition-colors">
                    {r.titre}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}

        <div className="space-y-10">
          {article.sections.map((s, i) => {
            const oeuvre = s.oeuvre ? oeuvres.get(cleOeuvre(s.oeuvre)) : undefined;
            // Article à rubriques : titre de rubrique (h2 ancré) à chaque changement, sections en h3
            const nouvelleRubrique = s.rubrique && s.rubrique !== article.sections[i - 1]?.rubrique;
            const Titre = rubriques.length > 0 && s.rubrique ? "h3" : "h2";
            return (
              <section key={s.titre} className="space-y-4">
                {nouvelleRubrique && (
                  <h2
                    id={slugify(s.rubrique!)}
                    className="scroll-mt-24 text-3xl font-extrabold tracking-[-0.025em] border-t border-border pt-8"
                  >
                    {s.rubrique}
                  </h2>
                )}
                <Titre className={Titre === "h3" ? "text-xl font-bold tracking-[-0.015em]" : "text-2xl font-extrabold tracking-[-0.02em]"}>
                  {s.titre}
                </Titre>
                <BlocsGuide blocs={s.blocs} />
                {oeuvre && <CarteOeuvreArticle oeuvre={oeuvre} />}
              </section>
            );
          })}
        </div>
      </article>

      {autres.length > 0 && (
        <section className="space-y-3 border-t border-border pt-6">
          <h2 className="font-mono-label text-[#9A9282]">
            {article.format === "mois" ? "Les mois précédents" : "Les semaines précédentes"}
          </h2>
          <ul className="space-y-2">
            {autres.map((a) => (
              <li key={a.slug}>
                <Link href={cheminArticle(a)} className="text-foreground hover:text-primary transition-colors">
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
