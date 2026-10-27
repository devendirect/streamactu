/**
 * Icônes du site (DESIGN.md) : un seul trait de 1.75 px, dessinées sur une
 * grille de 24, bouts arrondis. Toujours décoratives : le libellé est porté
 * par le lien ou le bouton (aria-label ou texte).
 */
const TRACES = {
  recherche: <><circle cx="11" cy="11" r="7" /><path d="m20 20-3.6-3.6" /></>,
  liste: <path d="M6.5 3.5h11a1 1 0 0 1 1 1v16l-6.5-4.2-6.5 4.2v-16a1 1 0 0 1 1-1z" />,
  plus: <path d="M12 5v14M5 12h14" />,
  coche: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  accueil: <path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-4.5v-6h-5v6H5a1 1 0 0 1-1-1z" />,
  calendrier: <><rect x="3.5" y="5" width="17" height="15.5" rx="2" /><path d="M3.5 10h17M8 3v4M16 3v4" /></>,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  fermer: <path d="M6 6l12 12M18 6 6 18" />,
  gauche: <path d="m15 5-7 7 7 7" />,
  droite: <path d="m9 5 7 7-7 7" />,
  bas: <path d="m6 9 6 6 6-6" />,
  externe: <path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />,
  etoile: <path d="m12 3.8 2.5 5.2 5.7.8-4.1 4 1 5.7-5.1-2.7-5.1 2.7 1-5.7-4.1-4 5.7-.8z" />,
  de: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="3.5" />
      <circle cx="9" cy="9" r="1.2" fill="currentColor" />
      <circle cx="15" cy="15" r="1.2" fill="currentColor" />
      <circle cx="15" cy="9" r="1.2" fill="currentColor" />
      <circle cx="9" cy="15" r="1.2" fill="currentColor" />
    </>
  ),
  jeu: (
    <>
      <rect x="3.5" y="3.5" width="7" height="7" rx="1.2" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1.2" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1.2" />
      <path d="M14 17h6M17 14v6" />
    </>
  ),
  loupeIA: <><circle cx="10.5" cy="10.5" r="6.5" /><path d="m19.5 19.5-4.2-4.2M10.5 7.5v6M7.5 10.5h6" /></>,
  actu: <><rect x="3.5" y="4.5" width="17" height="15" rx="2" /><path d="M7.5 9h9M7.5 12.5h9M7.5 16h5" /></>,
  top: <path d="M5 20V11M12 20V5M19 20v-6" />,
  grille: (
    <>
      <rect x="4" y="4" width="6.5" height="6.5" rx="1" />
      <rect x="13.5" y="4" width="6.5" height="6.5" rx="1" />
      <rect x="4" y="13.5" width="6.5" height="6.5" rx="1" />
      <rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1" />
    </>
  ),
  livre: <path d="M4 5.5A1.5 1.5 0 0 1 5.5 4H11v16H5.5A1.5 1.5 0 0 1 4 18.5zM20 5.5A1.5 1.5 0 0 0 18.5 4H13v16h5.5a1.5 1.5 0 0 0 1.5-1.5z" />,
  info: <><circle cx="12" cy="12" r="8.5" /><path d="M12 11v5.5M12 7.8v.4" /></>,
};

export type NomIcone = keyof typeof TRACES;

export default function Icone({
  nom,
  taille = 20,
  className,
}: {
  nom: NomIcone;
  taille?: number;
  className?: string;
}) {
  return (
    <svg
      className={className}
      width={taille}
      height={taille}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {TRACES[nom]}
    </svg>
  );
}
