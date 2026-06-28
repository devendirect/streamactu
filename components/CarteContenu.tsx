import Image from "next/image";
import Link from "next/link";
import type { Contenu } from "@/types";

interface Props {
  contenu: Contenu;
  priorite?: boolean;
}

const TYPE_ICONS: Record<string, string> = { serie: "▣", film: "◈" };
const TYPE_LABELS: Record<string, string> = { serie: "Série", film: "Film" };

function isNouvelleSerieCheck(saisonActuelle?: number, premiereDiffusion?: string): boolean {
  if (saisonActuelle === 1) return true;
  if (!premiereDiffusion) return false;
  const diff = (Date.now() - new Date(premiereDiffusion).getTime()) / 86_400_000;
  return diff >= 0 && diff <= 180;
}

export default function CarteContenu({ contenu, priorite = false }: Props) {
  const { type, titre, slug, poster, note, genres, saisonActuelle, premiereDiffusion } = contenu;
  const href = `/${type}/${slug}`;

  // Animation détectée via les genres
  const isAnim = genres.some((g) => g.nom.toLowerCase().includes("animat"));
  const typeIcon = isAnim ? "✦" : TYPE_ICONS[type];
  const typeLabel = isAnim ? "Animation" : TYPE_LABELS[type];

  // Label saison
  let saisonLabel: React.ReactNode = null;
  if (type === "serie") {
    if (isNouvelleSerieCheck(saisonActuelle, premiereDiffusion)) {
      saisonLabel = (
        <span
          className="italic"
          style={{ color: "#E3A53A", fontFamily: "var(--font-newsreader), serif" }}
        >
          Nouvelle série
        </span>
      );
    } else if (saisonActuelle) {
      saisonLabel = (
        <span className="text-primary">Saison {saisonActuelle}</span>
      );
    }
  }

  const genresLabel = genres
    .slice(0, 3)
    .map((g) => g.nom)
    .join(" · ");

  return (
    <Link
      href={href}
      className="flex items-center gap-4 py-3.5 border-t border-border hover:bg-white/[0.025] transition-colors group"
    >
      {/* Poster */}
      <div className="relative w-[54px] h-[80px] shrink-0 border border-border overflow-hidden bg-white/5">
        {poster ? (
          <Image
            src={poster}
            alt={titre}
            fill
            sizes="54px"
            className="object-cover"
            priority={priorite}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
        )}
      </div>

      {/* Infos */}
      <div className="flex-1 min-w-0">
        {/* Badge type + saison */}
        <div className="flex items-baseline gap-1.5 font-mono-label text-[#9A9282] mb-1">
          <span className="text-[11px] text-foreground/60">{typeIcon}</span>
          <span className="uppercase tracking-[0.12em] text-[10px]">{typeLabel}</span>
          {saisonLabel && <>&nbsp;&nbsp;{saisonLabel}</>}
        </div>

        {/* Titre */}
        <div className="text-[18px] font-semibold tracking-[-0.01em] leading-tight truncate group-hover:text-primary transition-colors">
          {titre}
        </div>

        {/* Genres */}
        {genresLabel && (
          <div className="font-mono-label text-[#6E6857] mt-0.5">{genresLabel}</div>
        )}
      </div>

      {/* Note */}
      {note > 0 && (
        <span className="shrink-0 font-mono text-sm text-primary whitespace-nowrap">
          ★ {note.toFixed(1)}
        </span>
      )}
    </Link>
  );
}
