import Image from "next/image";
import Link from "next/link";
import { cheminFixe, editionCourante } from "@/lib/actu";
import Icone from "@/components/Icone";
import { formatJourSemaineFR } from "@/lib/utils";

/**
 * Bannière velours « Que regarder ce week-end » : une seule image fondue à
 * droite, titre en lumière à gauche, date sous le texte (pas d'étiquette
 * au-dessus du titre). Absente tant qu'aucune édition n'est publiée.
 */
export default function BanniereWeekend({ image }: { image: string | null }) {
  const article = editionCourante("week-end");
  if (!article) return null;

  return (
    <section
      aria-labelledby="banniere-we"
      className="banniere velours relative mb-section flex min-h-[380px] items-center overflow-hidden max-[760px]:min-h-[520px] max-[760px]:items-end"
    >
      {image && (
        <div className="banniere__fond">
          <Image src={image} alt="" fill sizes="(max-width: 760px) 100vw, 62vw" className="object-cover object-[70%_25%] saturate-[0.85]" />
        </div>
      )}
      <div className="relative z-[1] max-w-[680px] px-gouttiere py-[clamp(28px,4vw,48px)]">
        <h2
          id="banniere-we"
          className="font-salle text-[clamp(44px,5vw,72px)] leading-[0.9] font-black tracking-[0.005em] text-lumiere"
        >
          Que regarder ce&nbsp;week&#8209;end
        </h2>
        <p className="mt-3.5 max-w-[56ch] text-[#EAD9D2]">{article.chapo}</p>
        <p className="mt-2.5 text-sm text-velours-texte">Article du {formatJourSemaineFR(article.publie).toLowerCase()}</p>
        <Link href={cheminFixe("week-end")} className="btn-blanc mt-[22px]">
          Lire l&apos;article
          <Icone nom="droite" taille={18} />
        </Link>
      </div>
    </section>
  );
}
