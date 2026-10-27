import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { GUIDES, MIN_GUIDES_INDEX, estGuideOrdre, oeuvresDesSections } from "@/lib/guides";
import { chargerOeuvres } from "@/lib/actu-oeuvres";
import { metadonnees } from "@/lib/meta";
import { formatDateFR } from "@/lib/utils";
import TeteLecture from "@/components/lecture/TeteLecture";
import Icone from "@/components/Icone";

// Images des sagas : cache des fiches, rafraîchi chaque jour
export const revalidate = 86400;

export const metadata: Metadata = metadonnees(
  "Guides streaming",
  "Les guides de StreamActu.fr : comment sont faits les classements, quelle plateforme choisir, où trouver une série en France. Méthode et sources indiquées.",
  "/guides",
  // Une liste d'un ou deux liens est trop maigre pour l'index
  GUIDES.length < MIN_GUIDES_INDEX ? { robots: { index: false, follow: true } } : {}
);

export default async function GuidesPage() {
  const guides = [...GUIDES].sort((a, b) => b.misAJour.localeCompare(a.misAJour));
  // Sagas (guides d'ordre de visionnage) en grandes cartes, guides pratiques en liste
  const sagas = guides.filter(estGuideOrdre);
  const pratiques = guides.filter((g) => !estGuideOrdre(g));
  const images = await Promise.all(
    sagas.map(async (g) => {
      const oeuvres = await chargerOeuvres(oeuvresDesSections(g.sections).slice(0, 4));
      return [...oeuvres.values()].find((o) => o.grandeImage)?.grandeImage ?? null;
    })
  );

  return (
    <>
      <TeteLecture
        ariane={[{ href: "/", label: "Accueil" }]}
        titre="Guides"
        chapo="Des guides durables, mis à jour quand les faits changent. Chacun s'appuie sur les données du site et cite ses sources extérieures. Ils sont signés par l'éditeur du site et rédigés avec l'aide de Claude, puis vérifiés."
        meta={
          <p>
            Le détail est sur la page{" "}
            <Link href="/a-propos#ia" className="underline underline-offset-[3px] transition-colors duration-200 hover:text-texte">
              à propos
            </Link>
            .
          </p>
        }
      />

      <div className="space-y-section px-gouttiere pt-4 pb-10">
        {sagas.length > 0 && (
          <section aria-labelledby="sagas">
            <h2 id="sagas" className="mb-3.5 text-[clamp(19px,1.6vw,23px)] font-bold tracking-[-0.01em]">
              Dans quel ordre regarder
            </h2>
            <ul className="grid grid-cols-[repeat(auto-fill,minmax(min(340px,100%),1fr))] gap-3.5">
              {sagas.map((g, i) => (
                <li key={g.slug}>
                  <Link href={`/guides/${g.slug}`} className="group relative block overflow-hidden rounded-[14px] bg-surface">
                    <span className="relative block aspect-video">
                      {images[i] && (
                        <Image
                          src={images[i]!}
                          alt=""
                          fill
                          sizes="(max-width: 760px) 100vw, 480px"
                          className="object-cover transition-transform duration-[600ms] ease-salle group-hover:scale-[1.03]"
                        />
                      )}
                      <span aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-[rgba(10,10,11,0.95)] via-[rgba(10,10,11,0.4)] to-transparent" />
                    </span>
                    <span className="absolute right-0 bottom-0 left-0 p-5">
                      <span className="block text-[clamp(20px,1.8vw,24px)] leading-tight font-extrabold tracking-[-0.015em]">{g.titre}</span>
                      <span className="mt-1 block text-[13px] text-texte-2">Mis à jour le {formatDateFR(g.misAJour)}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {pratiques.length > 0 && (
          <section aria-labelledby="pratiques" className="max-w-[820px]">
            <h2 id="pratiques" className="mb-1.5 text-[clamp(19px,1.6vw,23px)] font-bold tracking-[-0.01em]">
              Guides pratiques
            </h2>
            <ul>
              {pratiques.map((g) => (
                <li key={g.slug} className="border-b border-trait">
                  <Link href={`/guides/${g.slug}`} className="group block py-5">
                    <span className="flex items-center gap-2 text-[clamp(18px,1.5vw,21px)] font-bold transition-colors duration-200 group-hover:text-ambre">
                      {g.titre}
                      <Icone nom="droite" taille={18} className="flex-none transition-transform duration-[250ms] ease-salle group-hover:translate-x-[3px]" />
                    </span>
                    <span className="mt-1.5 block text-[15px] leading-relaxed text-texte-doux">{g.description}</span>
                    <span className="mt-1.5 block text-[13px] text-texte-2">Mis à jour le {formatDateFR(g.misAJour)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </>
  );
}
