import { cn } from "@/lib/utils";

interface BadgeTypeProps {
  type: "serie" | "film" | "animation";
  saison?: number;
  nouveau?: boolean;
  className?: string;
}

const ICONS: Record<string, string> = {
  serie: "▣",
  film: "◈",
  animation: "✦",
};

const LABELS: Record<string, string> = {
  serie: "Série",
  film: "Film",
  animation: "Animation",
};

export default function BadgeType({ type, saison, nouveau, className }: BadgeTypeProps) {
  return (
    <div
      className={cn(
        "flex items-baseline gap-2 font-mono-label text-[#D8CFBC]",
        className
      )}
    >
      <span className="text-[13px] text-foreground">{ICONS[type]}</span>
      {LABELS[type]}

      {saison && (
        <span className="text-primary border-l border-border/40 pl-3 ml-1">
          Saison {saison}
        </span>
      )}

      {nouveau && !saison && (
        <span className="text-primary border-l border-border/40 pl-3 ml-1">
          Nouveau
        </span>
      )}
    </div>
  );
}
