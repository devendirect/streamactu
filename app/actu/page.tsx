import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { ACTU_PUBLIEE, ARTICLES, MIN_ARTICLES_INDEX } from "@/lib/actu";
import { metadonnees } from "@/lib/meta";
import { formatDateFR } from "@/lib/utils";
import { imageArticle } from "@/lib/actu-oeuvres";
import Image from "next/image";

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
  const images = await Promise.all(ARTICLES.map(imageArticle));

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

      <ul className="space-y-6">
        {ARTICLES.map((a, i) => (
          <li key={a.slug} className="border-t border-border pt-5 space-y-3">
            {images[i]?.grandeImage && (
              <Link href={`/actu/${a.slug}`} className="block relative aspect-[16/9] overflow-hidden border border-border bg-white/5">
                <Image
                  src={images[i].grandeImage}
                  alt={`Image de ${images[i].titre}`}
                  fill
                  priority={i === 0}
                  sizes="(max-width: 672px) 100vw, 672px"
                  className="object-cover"
                />
              </Link>
            )}
            <Link href={`/actu/${a.slug}`} className="text-xl font-bold hover:text-primary transition-colors">
              {a.titre} →
            </Link>
            <p className="text-[15px] leading-relaxed text-[#9A9282]" style={{ fontFamily: "var(--font-newsreader), serif" }}>
              {a.description}
            </p>
            <p className="font-mono-label text-ink-3">Publié le {formatDateFR(a.publie)}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
