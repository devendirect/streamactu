"use client";

import { useEffect } from "react";
import Link from "next/link";

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
    <div className="sa-container py-16 flex-1 flex items-center">
      <div className="flex gap-12 items-center w-full flex-wrap md:flex-nowrap">

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
              style={{ fontSize: "64px", letterSpacing: "-0.04em", textShadow: "0 4px 30px rgba(0,0,0,0.6)" }}
            >
              ERR
            </span>
            <span className="font-mono-label text-ink-3 mt-3">Signal perdu</span>
          </div>
        </div>

        <div className="flex-1 min-w-0 text-center md:text-left">
          <div className="flex items-center gap-3 mb-4 justify-center md:justify-start font-mono-label text-[#B8AF9D]">
            <span aria-hidden="true" className="text-[13px] text-foreground">⌗</span>
            Erreur serveur
          </div>

          <h1
            className="font-extrabold leading-[0.95] tracking-[-0.03em] mb-4"
            style={{ fontSize: "clamp(36px,7vw,64px)" }}
          >
            Quelque chose<br />a mal tourné.
          </h1>

          <p
            className="mb-8 max-w-[46ch] text-[#B6AD9B] leading-relaxed"
            style={{ fontFamily: "var(--font-newsreader), serif", fontSize: "18px" }}
          >
            Une erreur inattendue s&apos;est produite. Vous pouvez réessayer ou revenir à l&apos;accueil.
          </p>

          <div className="flex items-center gap-3 flex-wrap justify-center md:justify-start">
            <button
              onClick={reset}
              className="inline-flex items-center gap-2 bg-foreground text-background font-mono-label font-semibold px-6 py-4 hover:bg-primary transition-colors"
            >
              ↻ Réessayer
            </button>
            <Link
              href="/"
              className="inline-flex items-center gap-2 border border-border/50 text-foreground font-mono-label px-6 py-4 hover:border-primary hover:text-primary transition-colors"
            >
              ← Retour à l&apos;accueil
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
