/**
 * Logo StreamActu.fr (planche du 24/10, design-ref/maquettes-2026-10/logo.html) :
 * - le repère (ligne du temps et épingle ambre) ;
 * - le wordmark tracé main, en version renforcée (trait 14) pour l'en-tête ;
 * - le symbole B (épingle noire sur carré ambre) pour le mobile et les icônes.
 * Encre réglable par les variables --sa-logo-encre et --sa-logo-gris.
 */

export function Repere({ taille = 32 }: { taille?: number }) {
  return (
    <svg width={taille} height={taille} viewBox="0 0 120 120" fill="none" aria-hidden="true">
      <g stroke="var(--sa-logo-encre, currentColor)" strokeWidth="6" strokeLinecap="round">
        <line x1="18" y1="84" x2="102" y2="84" />
        <line x1="34" y1="84" x2="34" y2="74" />
        <line x1="50" y1="84" x2="50" y2="74" />
        <line x1="86" y1="84" x2="86" y2="74" />
      </g>
      <line x1="68" y1="84" x2="68" y2="42" stroke="#E3A53A" strokeWidth="6" strokeLinecap="round" />
      <circle cx="68" cy="34" r="11" fill="#E3A53A" />
    </svg>
  );
}

export function Symbole({ taille = 30 }: { taille?: number }) {
  return (
    <svg width={taille} height={taille} viewBox="0 0 100 100" aria-hidden="true">
      <rect width="100" height="100" rx="22" fill="#E3A53A" />
      <g transform="translate(15 15) scale(.7)" fill="none">
        <line x1="20" y1="82" x2="80" y2="82" stroke="#0A0A0B" strokeWidth="11" strokeLinecap="round" />
        <line x1="50" y1="82" x2="50" y2="44" stroke="#0A0A0B" strokeWidth="11" strokeLinecap="round" />
        <circle cx="50" cy="30" r="17" fill="#0A0A0B" />
      </g>
    </svg>
  );
}

/** Wordmark ; `renforce` épaissit le trait (11 → 14) pour les petites tailles et les images */
export function Wordmark({ hauteur = 28, renforce = false }: { hauteur?: number; renforce?: boolean }) {
  const trait = renforce ? 14 : 11;
  const tracer = { fill: "none", strokeWidth: trait, strokeLinecap: "round", strokeLinejoin: "round" } as const;
  return (
    <svg height={hauteur} viewBox="0 0 545 140" role="img" aria-label="StreamActu.fr">
      <g stroke="var(--sa-logo-encre, currentColor)" {...tracer}>
        <path d="M54 56 C 54 48, 20 46, 20 62 C 20 74, 54 72, 54 88 C 54 102, 20 100, 20 88" />
        <path d="M78 50 L78 92 C 78 100, 86 101, 92 97" />
        <path d="M66 62 L90 62" />
        <path d="M104 60 L104 100" />
        <path d="M104 70 C 104 60, 118 58, 124 64" />
        <path d="M133 80 L168 80" />
        <path d="M168 80 C 168 68, 152 62, 142 68 C 132 74, 132 90, 144 96 C 154 100, 164 96, 168 90" />
        <path d="M212 60 L212 100" />
        <path d="M212 70 C 204 62, 188 63, 183 73 C 178 84, 182 96, 192 98 C 201 99, 208 94, 212 88" />
        <path d="M228 100 L228 68 C 228 60, 246 60, 248 70 L248 100" />
        <path d="M248 70 C 250 61, 266 60, 268 70 L268 100" />
        <path d="M286 100 L306 50 L326 100" />
        <path d="M294 82 L318 82" />
        <path d="M372 70 C 366 62, 350 62, 344 70 C 336 78, 336 90, 344 96 C 351 101, 366 100, 372 92" />
        <path d="M392 52 L392 92 C 392 100, 400 101, 406 97" />
        <path d="M380 62 L404 62" />
        <path d="M418 60 L418 88 C 418 98, 434 100, 440 92 L440 60" />
        <path d="M440 60 L440 100" />
      </g>
      <rect x="284" y="110" width="168" height="9" rx="4.5" fill="#E3A53A" />
      <circle cx="468" cy="94" r="7" fill="#E3A53A" />
      <g stroke="var(--sa-logo-gris, #8E8E93)" {...tracer}>
        <path d="M498 50 C 498 44, 490 42, 486 48 C 484 52, 484 56, 484 60 L484 100" />
        <path d="M476 62 L500 62" />
        <path d="M512 60 L512 100" />
        <path d="M512 70 C 512 60, 526 58, 532 64" />
      </g>
    </svg>
  );
}
