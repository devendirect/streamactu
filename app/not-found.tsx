import Link from "next/link";
import type { Metadata } from "next";
import Faisceau from "@/components/Faisceau";
import Icone from "@/components/Icone";

export const metadata: Metadata = {
  title: "Page introuvable (404)",
  openGraph: {
    title: "Page introuvable (404) | StreamActu.fr",
    description: "Cette page n'existe pas ou a été déplacée.",
  },
};

export default function NotFound() {
  return (
    <div className="scene -mt-entete flex min-h-[calc(100dvh-1px)] flex-1 items-center px-gouttiere pt-[120px] pb-16">
      <Faisceau doux />
      <div className="flex w-full flex-wrap items-center gap-x-14 gap-y-8 md:flex-nowrap">
        {/* Le chiffre, détouré de lumière comme un rang */}
        <span
          aria-hidden="true"
          className="font-salle tabular mx-auto shrink-0 text-[clamp(140px,22vw,300px)] leading-[0.78] font-black tracking-[-0.04em] text-velours [-webkit-text-stroke:2px_rgba(255,241,210,0.6)] md:mx-0"
        >
          404
        </span>

        <div className="min-w-0 flex-1 text-center md:text-left">
          <h1 className="mb-4 text-[clamp(36px,6vw,64px)] leading-[0.95] font-black tracking-[-0.03em]">
            Cette page
            <br />
            n&apos;est pas
            <br />
            encore sortie.
          </h1>
          <p className="mx-auto mb-2 max-w-[46ch] text-lg leading-relaxed text-texte-doux md:mx-0">
            Annoncée, jamais tournée, probablement coincée en <em>development hell</em>. Le lien que vous suivez ne figure à aucune
            grille de programme.
          </p>
          <p className="mb-8 text-sm text-texte-2">Statut TMDB : introuvable · Note : — / 10</p>

          <div className="flex flex-wrap items-center justify-center gap-2.5 md:justify-start">
            <Link href="/" className="btn-blanc">
              <Icone nom="accueil" taille={20} />
              Retour à l&apos;accueil
            </Link>
            <Link href="/surprise" className="btn-verre">
              <Icone nom="de" taille={20} />
              Consolez-vous avec une surprise
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
