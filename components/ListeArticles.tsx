import Image from "next/image";
import Link from "next/link";
import type { Article } from "@/lib/actu";
import { NB_PAGES_ACTU, cheminPageActu } from "@/lib/actu";
import type { OeuvreArticle } from "@/lib/actu-oeuvres";
import { formatDateFR } from "@/lib/utils";

interface Props {
  articles: Article[];
  /** Grande image de chaque article, dans le même ordre (null si aucune) */
  images: (OeuvreArticle | null)[];
  page: number;
}

/**
 * Liste des articles Actu : en page 1, le dernier article en vedette (image
 * large mais basse, 2:1) ; ensuite des lignes compactes avec une petite
 * vignette, pour voir une dizaine d'articles par écran.
 */
export default function ListeArticles({ articles, images, page }: Props) {
  const vedette = page === 1 ? articles[0] : undefined;
  const lignes = vedette ? articles.slice(1) : articles;
  const decalage = vedette ? 1 : 0;

  return (
    <div className="space-y-8">
      {vedette && (
        <article className="space-y-3">
          {images[0]?.grandeImage && (
            <Link
              href={`/actu/${vedette.slug}`}
              className="block relative aspect-[2/1] overflow-hidden border border-border bg-white/5"
            >
              <Image
                src={images[0].grandeImage}
                alt={`Image de ${images[0].titre}`}
                fill
                priority
                sizes="(max-width: 672px) 100vw, 672px"
                className="object-cover"
              />
            </Link>
          )}
          <p className="font-mono-label text-ink-3">Dernier article · {formatDateFR(vedette.publie)}</p>
          <h2 className="text-2xl font-extrabold tracking-[-0.02em]">
            <Link href={`/actu/${vedette.slug}`} className="hover:text-primary transition-colors">
              {vedette.titre}
            </Link>
          </h2>
          <p
            className="text-[15px] leading-relaxed text-[#9A9282]"
            style={{ fontFamily: "var(--font-newsreader), serif" }}
          >
            {vedette.description}
          </p>
        </article>
      )}

      {lignes.length > 0 && (
        <section aria-label={vedette ? "Articles précédents" : "Articles"} className="space-y-1">
          {vedette && <h2 className="font-mono-label text-ink-4 mb-3">Les semaines précédentes</h2>}
          <ul>
            {lignes.map((a, i) => {
              const image = images[i + decalage];
              return (
                <li key={a.slug} className="border-t border-border">
                  <Link href={`/actu/${a.slug}`} className="flex items-center gap-4 py-3 group">
                    <div className="relative w-[112px] sm:w-[140px] aspect-[16/9] shrink-0 overflow-hidden border border-border bg-white/5">
                      {image?.grandeImage && (
                        <Image
                          src={image.grandeImage}
                          alt={`Image de ${image.titre}`}
                          fill
                          sizes="140px"
                          className="object-cover"
                        />
                      )}
                    </div>
                    <div className="min-w-0 space-y-1">
                      <div className="text-[17px] font-semibold leading-tight group-hover:text-primary transition-colors">
                        {a.titre}
                      </div>
                      <div className="font-mono-label text-ink-3">{formatDateFR(a.publie)}</div>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {NB_PAGES_ACTU > 1 && (
        <nav aria-label="Pages des articles" className="flex items-center justify-between gap-4 border-t border-border pt-5">
          {page > 1 ? (
            <Link href={cheminPageActu(page - 1)} className="font-mono-label text-foreground hover:text-primary transition-colors">
              ← Plus récents
            </Link>
          ) : (
            <span />
          )}
          <span className="font-mono-label text-ink-4">
            Page {page} sur {NB_PAGES_ACTU}
          </span>
          {page < NB_PAGES_ACTU ? (
            <Link href={cheminPageActu(page + 1)} className="font-mono-label text-foreground hover:text-primary transition-colors">
              Plus anciens →
            </Link>
          ) : (
            <span />
          )}
        </nav>
      )}
    </div>
  );
}
