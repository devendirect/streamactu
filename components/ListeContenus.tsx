import type { Contenu } from "@/types";
import EnTeteSection from "@/components/EnTeteSection";
import GrilleAffiches from "@/components/GrilleAffiches";
import { slugify } from "@/lib/utils";

interface Props {
  titre: string;
  contenus: Contenu[];
  priorite?: boolean;
}

/** Section titrée de cartes en grille d'affiches (pages genre) */
export default function ListeContenus({ titre, contenus, priorite = false }: Props) {
  if (contenus.length === 0) return null;
  const id = `liste-${slugify(titre)}`;

  return (
    <section aria-labelledby={id}>
      <EnTeteSection id={id} titre={titre} compte={contenus.length} />
      <GrilleAffiches contenus={contenus} priorite={priorite} />
    </section>
  );
}
