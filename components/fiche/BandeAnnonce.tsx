"use client";
import Image from "next/image";
import { useState } from "react";
import Icone from "@/components/Icone";
import { evenementGA } from "@/lib/ga";

interface Props {
  cle: string;
  titre: string;
  type: string;
  image: string | null;
}

/**
 * Bande-annonce chargée au clic : pas d'iframe YouTube au chargement de la
 * page (poids, cookies). Le clic envoie l'événement GA4 « lecture_trailer ».
 */
export default function BandeAnnonce({ cle, titre, type, image }: Props) {
  const [lancee, setLancee] = useState(false);

  if (lancee) {
    return (
      <div className="relative aspect-video w-full max-w-[960px] overflow-hidden rounded-[14px] bg-black">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(cle)}?autoplay=1&rel=0&modestbranding=1`}
          title={`Bande-annonce de ${titre}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full border-0"
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => {
        evenementGA("lecture_trailer", { titre, type });
        setLancee(true);
      }}
      aria-label={`Lire la bande-annonce de ${titre}`}
      className="group relative block aspect-video w-full max-w-[960px] overflow-hidden rounded-[14px] bg-black"
    >
      {image && (
        <Image
          src={image}
          alt=""
          fill
          sizes="(max-width: 1000px) 100vw, 960px"
          className="object-cover brightness-[0.6] transition-[filter,transform] duration-[600ms] ease-salle group-hover:scale-[1.02] group-hover:brightness-75"
        />
      )}
      <span className="absolute inset-0 grid place-items-center">
        <span className="grid size-[84px] place-items-center rounded-full bg-white/90 text-fond transition-transform duration-[250ms] ease-salle group-hover:scale-[1.08]">
          <Icone nom="lecture" taille={34} />
        </span>
      </span>
    </button>
  );
}
