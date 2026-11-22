/**
 * Sprites plus travaillés (dégradés, reflets) ajoutés à la feuille de symboles de Briques.tsx.
 * Dessinés à la main en SVG. `currentColor` donne la teinte de base ; l'ombre et le reflet sont des calques.
 */
const COEUR = "M16 28 C-6 12 4 -4 16 8 C28 -4 38 12 16 28Z";

export const SPRITES_EXTRA =
  `<defs>` +
  `<radialGradient id="reflet-c" cx=".32" cy=".28" r=".75"><stop offset="0" stop-color="#fff" stop-opacity=".6"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/></radialGradient>` +
  `<linearGradient id="ombre-c" x1="0" y1="0" x2="0" y2="1"><stop offset=".45" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".32"/></linearGradient>` +
  `<linearGradient id="ombre-p" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".28"/><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".3"/></linearGradient>` +
  `</defs>` +
  // Cœur brillant : base, ombre en bas, reflet en haut à gauche
  `<symbol id="s-coeur" viewBox="0 0 32 30"><path d="${COEUR}" fill="currentColor"/><path d="${COEUR}" fill="url(#ombre-c)"/><path d="${COEUR}" fill="url(#reflet-c)"/>` +
  `<ellipse cx="10" cy="9" rx="3.4" ry="2" fill="#fff" opacity=".6" transform="rotate(-32 10 9)"/></symbol>` +
  // Feuille d'érable : onze pointes, nervures, dégradé de lumière
  `<symbol id="s-feuille" viewBox="0 0 40 40"><path d="M20 2 L23 10 L30 7 L28 15 L37 14 L31 21 L36 26 L27 26 L28 34 L21 30 L20 39 L19 30 L12 34 L13 26 L4 26 L9 21 L3 14 L12 15 L10 7 L17 10 Z" fill="currentColor"/>` +
  `<path d="M20 2 L23 10 L30 7 L28 15 L37 14 L31 21 L36 26 L27 26 L28 34 L21 30 L20 39 L19 30 L12 34 L13 26 L4 26 L9 21 L3 14 L12 15 L10 7 L17 10 Z" fill="url(#ombre-p)"/>` +
  `<path d="M20 39 L20 10 M20 28 L9 17 M20 28 L31 17 M20 21 L13 11 M20 21 L27 11 M20 30 L12 28 M20 30 L28 28" fill="none" stroke="#000" stroke-opacity=".28" stroke-width=".9" stroke-linecap="round"/></symbol>` +
  // Pétale de rose : courbe, nervure centrale, dégradé de lumière
  `<symbol id="s-petale3d" viewBox="0 0 20 30"><path d="M10 0 C23 8 21 25 10 30 C-1 25 -3 8 10 0Z" fill="currentColor"/><path d="M10 0 C23 8 21 25 10 30 C-1 25 -3 8 10 0Z" fill="url(#ombre-p)"/>` +
  `<path d="M10 4 C11 12 11 20 10 27 M10 12 C7 10 5 9 3 9 M10 17 C13 15 15 14 17 14" fill="none" stroke="#000" stroke-opacity=".16" stroke-width=".8" stroke-linecap="round"/></symbol>`;
