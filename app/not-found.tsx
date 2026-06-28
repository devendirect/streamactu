import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page introuvable — 404",
};

export default function NotFound() {
  return (
    <div className="sa-container py-16 flex-1 flex items-center">
      <div className="flex gap-12 items-center w-full flex-wrap md:flex-nowrap">

        {/* "Pochette" 404 */}
        <div
          className="relative w-[200px] h-[300px] shrink-0 border border-border overflow-hidden mx-auto md:mx-0"
          style={{
            background: "repeating-linear-gradient(135deg, #221D16 0 16px, #1C1812 16px 32px)",
          }}
        >
          <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,rgba(0,0,0,0.12)_0_2px,transparent_2px_4px)] opacity-50" />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span
              className="text-primary font-extrabold leading-none"
              style={{ fontSize: "80px", letterSpacing: "-0.04em", textShadow: "0 4px 30px rgba(0,0,0,0.6)" }}
            >
              404
            </span>
            <span className="font-mono-label text-[#8E8676] mt-3">Pochette indisponible</span>
          </div>
          <div className="absolute left-3 bottom-3 font-mono-label text-[#5C564A]">
            NR · ?? min
          </div>
        </div>

        {/* Texte */}
        <div className="flex-1 min-w-0 text-center md:text-left">
          <div className="flex items-center gap-3 mb-4 justify-center md:justify-start font-mono-label text-[#B8AF9D]">
            <span className="text-[13px] text-foreground">⌗</span>
            Page fantôme
            <span className="border-l border-border/40 pl-3 text-primary italic" style={{ fontFamily: "var(--font-newsreader), serif" }}>
              Jamais diffusée
            </span>
          </div>

          <h1
            className="font-extrabold leading-[0.95] tracking-[-0.03em] mb-4"
            style={{ fontSize: "clamp(36px,7vw,64px)" }}
          >
            Cette page<br />n&apos;est pas<br />encore sortie.
          </h1>

          <p
            className="mb-2 max-w-[46ch] text-[#B6AD9B] leading-relaxed"
            style={{ fontFamily: "var(--font-newsreader), serif", fontSize: "18px" }}
          >
            Annoncée, jamais tournée, probablement coincée en <em>development hell</em>. Le lien que vous suivez ne figure à aucune grille de programme.
          </p>
          <p className="font-mono text-sm text-[#7C7565] mb-8">
            Statut TMDB : <span className="text-[#9A9282]">introuvable</span>
            &nbsp;·&nbsp; Note : <span className="text-[#9A9282]">— / 10</span>
          </p>

          <div className="flex items-center gap-3 flex-wrap justify-center md:justify-start">
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-foreground text-background font-mono-label font-semibold px-6 py-4 hover:bg-primary transition-colors"
            >
              ← Retour à l&apos;accueil
            </Link>
            <Link
              href="/surprise"
              className="inline-flex items-center gap-2 border border-border/50 text-foreground font-mono-label px-6 py-4 hover:border-primary hover:text-primary transition-colors"
            >
              ✦ Consolez-vous avec une surprise
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
