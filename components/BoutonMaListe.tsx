"use client";

import type { Contenu } from "@/types";
import type { ElementListe } from "@/lib/use-ma-liste";
import { useMaListe } from "@/lib/use-ma-liste";
import Icone from "@/components/Icone";
import { annoncer } from "@/components/Annonce";

type Titre = Pick<Contenu, "id" | "type" | "titre" | "slug" | "poster" | "note" | "annee">;

interface Props {
  contenu: Titre;
  /**
   * - « pilule » : icône et texte (fiche) ;
   * - « rond » : icône seule, 44 px ;
   * - « verre » : rond de 50 px posé sur une image (la une).
   */
  variante?: "pilule" | "rond" | "verre";
  className?: string;
}

/** Ajout/retrait de Ma liste ; une fois gardé, filet et icône en ambre */
export default function BoutonMaListe({ contenu, variante = "pilule", className = "" }: Props) {
  const { contient, basculer } = useMaListe();
  const dans = contient(contenu.id, contenu.type);
  const texte = dans ? "Dans Ma liste" : "Ma liste";

  const surClic = () => {
    const element: Omit<ElementListe, "ajouteLe"> = {
      id: contenu.id,
      type: contenu.type,
      titre: contenu.titre,
      slug: contenu.slug,
      poster: contenu.poster,
      note: contenu.note,
      annee: contenu.annee,
    };
    basculer(element);
    annoncer(dans ? `${contenu.titre} retiré de Ma liste` : `${contenu.titre} ajouté à Ma liste`);
  };

  const classes = {
    pilule: "btn-liste btn-liste--grand",
    rond: "btn-liste",
    verre: "btn-liste btn-liste--verre",
  }[variante];

  return (
    <button
      type="button"
      onClick={surClic}
      aria-pressed={dans}
      aria-label={variante === "pilule" ? undefined : dans ? `Retirer ${contenu.titre} de Ma liste` : `Ajouter ${contenu.titre} à Ma liste`}
      className={`${classes} ${className}`}
    >
      <Icone nom={dans ? "coche" : "plus"} taille={20} />
      {variante === "pilule" && <span>{texte}</span>}
    </button>
  );
}
