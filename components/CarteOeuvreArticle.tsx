import Image from "next/image";
import Link from "next/link";
import type { OeuvreArticle } from "@/lib/actu-oeuvres";
import { altAffiche } from "@/lib/utils";
import Icone from "@/components/Icone";
import PastillePlateforme from "@/components/PastillePlateforme";

/** Carte « Où regarder » d'un titre dans un article : affiche, repères, plateformes, lien vers la fiche */
export default function CarteOeuvreArticle({ oeuvre }: { oeuvre: OeuvreArticle }) {
  const href = `/${oeuvre.type}/${oeuvre.slug}`;
  return (
    <div className="flex items-center gap-4 rounded-xl bg-surface p-3.5">
      {oeuvre.poster && (
        <Link href={href} tabIndex={-1} aria-hidden="true" className="relative h-[90px] w-[60px] shrink-0 overflow-hidden rounded-md bg-surface-2">
          <Image src={oeuvre.poster} alt={altAffiche(oeuvre.titre, oeuvre.type)} fill sizes="60px" className="object-cover" />
        </Link>
      )}
      <div className="min-w-0 flex-1 space-y-1.5">
        <Link href={href} className="block text-[17px] leading-tight font-bold transition-colors duration-200 hover:text-ambre">
          {oeuvre.titre}
        </Link>
        <p className="flex flex-wrap items-center gap-x-2.5 text-[13.5px] text-texte-2">
          {oeuvre.type === "serie" ? "Série" : "Film"}
          {oeuvre.annee ? <span>{oeuvre.annee}</span> : null}
          {oeuvre.nbVotes >= 10 && (
            <span className="inline-flex items-center gap-1 font-bold text-white">
              <Icone nom="etoile" taille={12} className="fill-current text-ambre" />
              {oeuvre.note.toFixed(1).replace(".", ",")}
            </span>
          )}
        </p>
        {oeuvre.plateformes.length > 0 && (
          <p className="flex flex-wrap gap-x-3.5 gap-y-1 text-[13.5px] font-semibold">
            {oeuvre.plateformes.map((p) => (
              <PastillePlateforme key={p.id} pf={p} />
            ))}
          </p>
        )}
      </div>
      <Link href={`${href}#ou-regarder`} className="btn-blanc h-11 flex-none px-4 text-[15px] max-[560px]:hidden">
        Où regarder
      </Link>
    </div>
  );
}
