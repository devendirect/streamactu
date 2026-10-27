"use client";

import { useEffect } from "react";
import Link from "next/link";
import Faisceau from "@/components/Faisceau";
import Icone from "@/components/Icone";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    // Trace côté client pour le diagnostic (l'UI reste générique)
    console.error(error);
  }, [error]);

  return (
    <div className="scene -mt-entete flex min-h-[calc(100dvh-1px)] flex-1 items-center px-gouttiere pt-[120px] pb-16">
      <Faisceau doux />
      <div className="flex w-full flex-wrap items-center gap-x-14 gap-y-8 md:flex-nowrap">
        <span
          aria-hidden="true"
          className="font-salle mx-auto shrink-0 text-[clamp(120px,18vw,240px)] leading-[0.78] font-black tracking-[-0.04em] text-velours [-webkit-text-stroke:2px_rgba(255,241,210,0.6)] md:mx-0"
        >
          ERR
        </span>

        <div className="min-w-0 flex-1 text-center md:text-left">
          <h1 className="mb-4 text-[clamp(36px,6vw,64px)] leading-[0.95] font-black tracking-[-0.03em]">
            Quelque chose
            <br />a mal tourné.
          </h1>
          <p className="mx-auto mb-8 max-w-[46ch] text-lg leading-relaxed text-texte-doux md:mx-0">
            Une erreur inattendue s&apos;est produite. Vous pouvez réessayer ou revenir à l&apos;accueil.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2.5 md:justify-start">
            <button type="button" onClick={reset} className="btn-blanc">
              Réessayer
            </button>
            <Link href="/" className="btn-verre">
              <Icone nom="accueil" taille={20} />
              Retour à l&apos;accueil
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
