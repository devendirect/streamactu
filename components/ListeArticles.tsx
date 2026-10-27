import Image from "next/image";
import Link from "next/link";
import type { Article } from "@/lib/actu";
import { NB_PAGES_ACTU, cheminArticle, cheminPageActu } from "@/lib/actu";
import type { OeuvreArticle } from "@/lib/actu-oeuvres";
import { formatDateFR } from "@/lib/utils";
import Icone from "@/components/Icone";

interface Props {
  articles: Article[];
  /** Grande image de chaque article, dans le même ordre (null si aucune) */
  images: (OeuvreArticle | null)[];
  page: number;
}

/**
 * Liste des articles Actu : en page 1, le dernier article en grand (image
 * 2:1, titre posé dessus) ; ensuite les éditions précédentes en cartes image.
 */
export default function ListeArticles({ articles, images, page }: Props) {
  const vedette = page === 1 ? articles[0] : undefined;
  const autres = vedette ? articles.slice(1) : articles;
  const decalage = vedette ? 1 : 0;

  return (
    <div className="space-y-section">
      {vedette && (
        <article>
          <Link href={cheminArticle(vedette)} className="group relative block overflow-hidden rounded-[14px] bg-surface">
            <span className="relative block aspect-[2/1] max-[640px]:aspect-[4/3]">
              {images[0]?.grandeImage && (
                <Image
                  src={images[0].grandeImage}
                  alt={`Image de ${images[0].titre}`}
                  fill
                  priority
                  sizes="(max-width: 1100px) 100vw, 1100px"
                  className="object-cover transition-transform duration-[600ms] ease-salle group-hover:scale-[1.02]"
                />
              )}
              <span aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-[rgba(10,10,11,0.92)] via-[rgba(10,10,11,0.35)] to-transparent" />
            </span>
            <span className="absolute right-0 bottom-0 left-0 p-[clamp(18px,3vw,36px)]">
              <h2 className="max-w-[24ch] text-[clamp(24px,3vw,40px)] leading-[1.05] font-black tracking-[-0.025em]">{vedette.titre}</h2>
              <span className="mt-2 block max-w-[60ch] text-[15px] text-texte-doux max-[640px]:hidden">{vedette.description}</span>
              <span className="mt-2 block text-sm text-texte-2">Publié le {formatDateFR(vedette.publie)}</span>
            </span>
          </Link>
        </article>
      )}

      {autres.length > 0 && (
        <section aria-labelledby="editions-precedentes">
          <h2 id="editions-precedentes" className="mb-3.5 text-[clamp(19px,1.6vw,23px)] font-bold tracking-[-0.01em]">
            {vedette ? "Les éditions précédentes" : "Articles"}
          </h2>
          <ul className="grid grid-cols-[repeat(auto-fill,minmax(min(260px,100%),1fr))] gap-x-3.5 gap-y-[22px]">
            {autres.map((a, i) => {
              const image = images[i + decalage];
              return (
                <li key={a.slug}>
                  <Link href={cheminArticle(a)} className="group block">
                    <span className="relative block aspect-video overflow-hidden rounded-lg bg-surface">
                      {image?.grandeImage && (
                        <Image
                          src={image.grandeImage}
                          alt={`Image de ${image.titre}`}
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
              );
            })}
          </ul>
        </section>
      )}

      {NB_PAGES_ACTU > 1 && (
        <nav aria-label="Pages des articles" className="flex items-center justify-between gap-4 border-t border-trait pt-5">
          {page > 1 ? (
            <Link href={cheminPageActu(page - 1)} className="lien-fleche">
              <Icone nom="gauche" taille={18} />
              Plus récents
            </Link>
          ) : (
            <span />
          )}
          <span className="tabular text-sm text-texte-2">
            Page {page} sur {NB_PAGES_ACTU}
          </span>
          {page < NB_PAGES_ACTU ? (
            <Link href={cheminPageActu(page + 1)} className="lien-fleche">
              Plus anciens
              <Icone nom="droite" taille={18} />
            </Link>
          ) : (
            <span />
          )}
        </nav>
      )}
    </div>
  );
}
