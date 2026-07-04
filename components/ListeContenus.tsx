import type { Contenu } from "@/types";
import CarteContenu from "@/components/CarteContenu";
import EnTeteSection from "@/components/EnTeteSection";
import { slugify } from "@/lib/utils";

interface Props {
  titre: string;
  contenus: Contenu[];
  priorite?: boolean;
}

/** Section titrée de cartes en mode liste (pages genre, tops, etc.) */
export default function ListeContenus({ titre, contenus, priorite = false }: Props) {
  if (contenus.length === 0) return null;
  const id = `liste-${slugify(titre)}`;

  return (
    <section aria-labelledby={id}>
      <EnTeteSection id={id} titre={titre} compte={contenus.length} />
      {contenus.map((c, i) => (
        <CarteContenu key={c.id} contenu={c} priorite={priorite && i === 0} />
      ))}
    </section>
  );
}
