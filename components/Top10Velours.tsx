import Image from "next/image";
import Link from "next/link";
import type { Contenu } from "@/types";
import Rangee from "@/components/Rangee";
import { attributsCarte, metaContenu } from "@/components/CarteAffiche";
import { altAffiche } from "@/lib/utils";

interface Props {
  titre: string;
  href?: string;
  contenus: Contenu[];
}

/**
 * Top 10 sur le velours (signature, DESIGN.md) : cartes larges dont le chiffre
 * géant, rempli de velours et détouré de lumière, passe sous l'affiche. Au
 * survol, la salle s'assombrit autour de la carte regardée (globals.css).
 */
export default function Top10Velours({ titre, href, contenus }: Props) {
  if (contenus.length === 0) return null;
  return (
    // data-rangee-bloc : le bandeau disparaît avec sa rangée quand les filtres la vident
    <div data-rangee-bloc className="velours mb-rangee pt-[34px] pb-2.5">
      <Rangee titre={titre} href={href} salle className="top10 mb-6">
        {contenus.slice(0, 10).map((c, i) => (
          <article key={`${c.type}-${c.id}`} className="top10__carte min-w-0" {...attributsCarte(c)}>
            <Link href={`/${c.type}/${c.slug}`} className="grid grid-cols-[46%_54%] items-end">
              <span aria-hidden="true" className="top10__rang">
                {i + 1}
              </span>
              <span className="top10__affiche relative block aspect-[2/3] overflow-hidden rounded-lg bg-surface">
                {c.poster && (
                  <Image
                    src={c.poster}
                    alt={altAffiche(c.titre, c.type)}
                    fill
                    // 54 % de la carte .top10 : clamp(190px, 19vw, 260px)
                    sizes="(max-width: 1000px) 103px, (max-width: 1368px) 10.3vw, 140px"
                    className="object-cover"
                  />
                )}
              </span>
              <span className="col-span-2 block pt-2">
                <span className="block truncate text-sm leading-[1.3] font-semibold">
                  <span className="sr-only">N° {i + 1} : </span>
                  {c.titre}
                </span>
                <span className="mt-0.5 block truncate text-[13px] text-velours-texte">{metaContenu(c)}</span>
              </span>
            </Link>
          </article>
        ))}
      </Rangee>
    </div>
  );
}
