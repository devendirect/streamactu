interface Props {
  titre: string;
  intro: string;
}

/**
 * En-tête sémantique des pages de listes (accueil, jour, semaine, mois).
 * Rendu côté serveur : fournit le H1 et un paragraphe indexables.
 */
export default function EnTeteNouveautes({ titre, intro }: Props) {
  return (
    <header className="sa-container pt-7">
      <h1 className="text-[clamp(24px,4.2vw,34px)] font-extrabold tracking-[-0.025em] leading-tight">
        {titre}
      </h1>
      <p
        className="mt-1.5 text-[#9A9282] max-w-[68ch]"
        style={{ fontFamily: "var(--font-newsreader), serif", fontSize: "16px", lineHeight: 1.5 }}
      >
        {intro}
      </p>
    </header>
  );
}
