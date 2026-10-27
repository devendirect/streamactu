import Link from "next/link";
import Icone from "@/components/Icone";

interface Props {
  id: string;
  titre: string;
  compte: number;
  /** singulier du compteur — "sortie", "titre"… */
  compteLabel?: string;
  /** total réel quand la liste affichée est tronquée : « 39 sur 71 sorties » */
  compteTotal?: number;
  /** couleur de la plateforme : pastille devant le titre (jamais le texte) */
  couleur?: string;
  /** rend le titre cliquable */
  lienHref?: string;
  lienTitle?: string;
  /** titre en capitales de salle (jours du calendrier) */
  salle?: boolean;
}

/** En-tête commun des sections de listes : titre, pastille éventuelle, compteur */
export default function EnTeteSection({
  id,
  titre,
  compte,
  compteLabel = "titre",
  compteTotal,
  couleur,
  lienHref,
  lienTitle,
  salle = false,
}: Props) {
  return (
    <div className="mb-3.5 flex flex-wrap items-baseline gap-x-3.5 gap-y-0.5">
      <h2
        id={id}
        className={`flex items-center gap-2.5 leading-[1.2] ${
          salle
            ? "font-salle text-[clamp(26px,2.4vw,34px)] font-extrabold tracking-[0.01em]"
            : "text-[clamp(19px,1.6vw,23px)] font-bold tracking-[-0.01em]"
        }`}
      >
        {couleur && (
          <span
            aria-hidden="true"
            className="size-3 flex-none rounded-full shadow-[0_0_0_1px_rgba(245,245,247,0.22)]"
            style={{ background: couleur }}
          />
        )}
        {lienHref ? (
          <Link href={lienHref} className="lien-fleche" title={lienTitle}>
            {titre}
            <Icone nom="droite" taille={18} />
          </Link>
        ) : (
          titre
        )}
      </h2>
      <span className="tabular text-sm text-texte-2">
        {compte}
        {compteTotal && compteTotal > compte ? ` sur ${compteTotal}` : ""} {compteLabel}
        {Math.max(compte, compteTotal ?? 0) > 1 ? "s" : ""}
      </span>
    </div>
  );
}
