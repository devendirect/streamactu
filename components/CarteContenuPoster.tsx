import Image from "next/image";
import Link from "next/link";
import type { Contenu } from "@/types";
import { TYPE_ICONS, TYPE_LABELS, altAffiche, isNouvelleSerieCheck } from "@/lib/utils";

interface Props {
  contenu: Contenu;
  priorite?: boolean;
}

export default function CarteContenuPoster({ contenu, priorite = false }: Props) {
  const { type, titre, slug, poster, note, genres, saisonActuelle, premiereDiffusion } = contenu;
  const href = `/${type}/${slug}`;

  const isAnim = genres.some((g) => g.nom.toLowerCase().includes("animat"));
  const typeIcon = isAnim ? "✦" : TYPE_ICONS[type];
  const typeLabel = isAnim ? "Animation" : TYPE_LABELS[type];

  // Badge saison (texte sous le poster)
  let saisonNode: React.ReactNode = null;
  const isNouveauSerie = isNouvelleSerieCheck(saisonActuelle, premiereDiffusion);
  if (type === "serie") {
    if (isNouveauSerie) {
      saisonNode = (
        <span
          className="italic"
          style={{ color: "#E3A53A", fontFamily: "var(--font-newsreader), serif" }}
        >
          Nouvelle série
        </span>
      );
    } else if (saisonActuelle) {
      saisonNode = <span className="text-[#9A9282]">Saison {saisonActuelle}</span>;
    }
  }

  const genresLabel = genres
    .slice(0, 3)
    .map((g) => g.nom)
    .join(" · ");

  return (
    <Link href={href} className="group block">
      {/* ── Poster (2:3) avec badge image ── */}
      <div className="relative aspect-[2/3] overflow-hidden border border-border bg-white/5 mb-2">
        {poster ? (
          <Image
            src={poster}
            alt={altAffiche(titre, type)}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            priority={priorite}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
        )}

        {/* Badge NOUVEAU (nouvelle série seulement) */}
        {isNouveauSerie && (
          <div
            className="absolute top-2 right-2 font-mono-label px-1.5 py-0.5"
            style={{
              background: "#E3A53A",
              color: "#16140F",
              fontSize: "9px",
              letterSpacing: "0.18em",
            }}
          >
            NOUVEAU
          </div>
        )}
      </div>

      {/* ── Texte sous le poster ── */}
      <div>
        {/* Badge type + saison */}
        <div className="flex items-baseline gap-1.5 font-mono-label text-ink-3 mb-0.5 leading-tight flex-wrap">
          <span aria-hidden="true" className="text-[10px] text-foreground/50">{typeIcon}</span>
          <span className="uppercase tracking-[0.1em] text-[9px]">{typeLabel}</span>
          {saisonNode && <>&nbsp;{saisonNode}</>}
        </div>

        {/* Titre */}
        <p className="text-[13px] font-semibold leading-snug group-hover:text-primary transition-colors line-clamp-2 mb-0.5">
          {titre}
        </p>

        {/* Genres */}
        {genresLabel && (
          <p className="font-mono-label text-ink-4 leading-tight line-clamp-2">
            {genresLabel}
          </p>
        )}

        {/* Note */}
        {note > 0 && (
          <p className="font-mono text-[11px] text-primary mt-1">★ {note.toFixed(1)}</p>
        )}
      </div>
    </Link>
  );
}
