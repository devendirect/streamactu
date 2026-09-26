"use client";

import Image from "next/image";
import Link from "next/link";
import { useMaListe } from "@/lib/use-ma-liste";

export default function MaListeClient() {
  const { liste, restaure, retirer } = useMaListe();

  // Évite le flash « liste vide » avant restauration du localStorage
  if (!restaure) {
    return (
      <div className="py-8">
        <div className="h-5 w-40 bg-white/5 rounded-sm animate-pulse" />
      </div>
    );
  }

  if (liste.length === 0) {
    return (
      <div className="py-16 text-center space-y-6">
        <p
          className="text-[clamp(22px,4vw,32px)] leading-tight text-[#C7BEAC] max-w-[24ch] mx-auto italic"
          style={{ fontFamily: "var(--font-newsreader), serif" }}
        >
          Rien pour l&apos;instant : votre prochaine soirée se prépare ici.
        </p>
        <p className="font-mono text-sm text-ink-3 max-w-[52ch] mx-auto">
          Ajoutez des titres depuis leur fiche avec « + Ma liste ». Tout reste dans votre
          navigateur, sans compte.
        </p>
        <div className="flex items-center gap-3 flex-wrap justify-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-foreground text-background font-mono-label font-semibold px-6 py-4 hover:bg-primary transition-colors"
          >
            Voir les nouveautés
          </Link>
          <Link
            href="/surprise"
            className="inline-flex items-center gap-2 border border-border/50 text-foreground font-mono-label px-6 py-4 hover:border-primary hover:text-primary transition-colors"
          >
            <span aria-hidden="true">✦</span> Laissez le hasard choisir
          </Link>
        </div>
      </div>
    );
  }

  const triee = [...liste].sort((a, b) => (a.ajouteLe < b.ajouteLe ? 1 : -1));

  return (
    <div>
      <p className="font-mono text-sm text-[#9A9282] mb-2">
        {triee.length} titre{triee.length > 1 ? "s" : ""} enregistré{triee.length > 1 ? "s" : ""}
      </p>
      {triee.map((item, i) => (
        <div
          key={`${item.type}-${item.id}`}
          className="flex items-center gap-5 py-4"
          style={{ borderTop: i === 0 ? "none" : "1px solid rgba(236,230,216,0.1)" }}
        >
          {/* Fiche cliquable */}
          <Link
            href={`/${item.type}/${item.slug}`}
            className="flex items-center gap-5 flex-1 min-w-0 group"
          >
            <div className="relative w-16 h-24 shrink-0 border border-border overflow-hidden bg-card">
              {item.poster ? (
                <Image src={item.poster} alt={item.titre} fill className="object-cover" sizes="64px" />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-3 mb-1 font-mono-label text-[#9A9282]">
                <span aria-hidden="true" className="text-[12px] text-foreground/70">
                  {item.type === "serie" ? "▣" : "◈"}
                </span>
                {item.type === "serie" ? "Série" : "Film"}
                {item.annee > 0 && <span className="text-ink-3">{item.annee}</span>}
                {item.note > 0 && <span className="text-primary">★ {item.note.toFixed(1)}</span>}
              </div>
              <h2 className="text-[21px] font-semibold tracking-[-0.01em] group-hover:text-primary transition-colors truncate">
                {item.titre}
              </h2>
            </div>
          </Link>

          {/* Retrait — hors du lien (imbrication invalide sinon) */}
          <button
            onClick={() => retirer(item.id, item.type)}
            aria-label={`Retirer ${item.titre} de ma liste`}
            className="shrink-0 font-mono-label text-ink-3 hover:text-[#C2624E] transition-colors px-2 py-1"
          >
            Retirer
          </button>
        </div>
      ))}
    </div>
  );
}
