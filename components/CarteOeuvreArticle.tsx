import Image from "next/image";
import Link from "next/link";
import type { OeuvreArticle } from "@/lib/actu-oeuvres";
import { altAffiche } from "@/lib/utils";

/** Carte d'un titre dans un article : affiche, repères, lien vers la fiche */
export default function CarteOeuvreArticle({ oeuvre }: { oeuvre: OeuvreArticle }) {
  const href = `/${oeuvre.type}/${oeuvre.slug}`;
  return (
    <Link
      href={href}
      className="flex items-center gap-4 border border-border/60 p-3 hover:border-primary transition-colors group"
    >
      {oeuvre.poster && (
        <div className="relative w-[60px] h-[90px] shrink-0 border border-border overflow-hidden bg-white/5">
          <Image
            src={oeuvre.poster}
            alt={altAffiche(oeuvre.titre, oeuvre.type)}
            fill
            sizes="60px"
            className="object-cover"
          />
        </div>
      )}
      <div className="min-w-0 space-y-1">
        <div className="text-[17px] font-semibold leading-tight group-hover:text-primary transition-colors">
          {oeuvre.titre}
        </div>
        <div className="font-mono-label text-ink-3">
          {oeuvre.type === "serie" ? "Série" : "Film"}
          {oeuvre.annee ? ` · ${oeuvre.annee}` : ""}
          {oeuvre.nbVotes >= 10 ?` · ★ ${oeuvre.note.toFixed(1)}` : ""}
          {oeuvre.plateformes.length > 0 ? ` · ${oeuvre.plateformes.map((p) => p.nom).join(", ")}` : ""}
        </div>
        <div className="font-mono-label text-foreground">Voir la fiche →</div>
      </div>
    </Link>
  );
}
