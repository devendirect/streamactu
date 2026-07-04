import type { Contenu } from "@/types";
import CarteContenu from "@/components/CarteContenu";
import { slugify } from "@/lib/utils";

interface Props {
  titre: string;
  contenus: Contenu[];
  priorite?: boolean;
}

/** Section titrée de cartes en mode liste (pages genre, etc.) */
export default function ListeContenus({ titre, contenus, priorite = false }: Props) {
  if (contenus.length === 0) return null;
  const id = `liste-${slugify(titre)}`;

  return (
    <section aria-labelledby={id}>
      <div className="flex items-end justify-between mb-1">
        <h2 id={id} className="text-[24px] font-extrabold tracking-[-0.025em] leading-none">
          {titre}
        </h2>
        <span className="font-mono-label text-ink-3">
          {contenus.length} titre{contenus.length > 1 ? "s" : ""}
        </span>
      </div>
      <div className="sa-platform-bar mb-3 bg-primary/50" />
      {contenus.map((c, i) => (
        <CarteContenu key={c.id} contenu={c} priorite={priorite && i === 0} />
      ))}
    </section>
  );
}
