import Link from "next/link";

interface Props {
  id: string;
  titre: string;
  compte: number;
  /** singulier du compteur — "sortie", "titre"… */
  compteLabel?: string;
  /** couleur du titre et de la barre (plateformes) ; ambre discret sinon */
  couleur?: string;
  /** rend le titre cliquable */
  lienHref?: string;
  lienTitle?: string;
  /** 28px (sections plateforme) au lieu de 24px */
  grand?: boolean;
}

/** En-tête commun des sections de listes : titre + compteur + barre colorée */
export default function EnTeteSection({
  id,
  titre,
  compte,
  compteLabel = "titre",
  couleur,
  lienHref,
  lienTitle,
  grand = false,
}: Props) {
  return (
    <>
      <div className="flex items-end justify-between mb-1">
        <h2
          id={id}
          className={`${grand ? "text-[28px]" : "text-[24px]"} font-extrabold tracking-[-0.025em] leading-none`}
          style={couleur ? { color: couleur } : undefined}
        >
          {lienHref ? (
            <Link href={lienHref} className="hover:underline underline-offset-4" title={lienTitle}>
              {titre}
            </Link>
          ) : (
            titre
          )}
        </h2>
        <span className="font-mono-label text-ink-3">
          {compte} {compteLabel}
          {compte > 1 ? "s" : ""}
        </span>
      </div>
      <div
        className="sa-platform-bar mb-3"
        style={{ background: couleur ?? "rgba(227,165,58,0.5)" }}
      />
    </>
  );
}
