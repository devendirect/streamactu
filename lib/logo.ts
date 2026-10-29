/**
 * Hauteur d'un logo TMDB pour une largeur de 500 px (w500), d'après son
 * ratio : width/height de l'<img> réservent sa place avant le chargement
 * (sinon la une et l'en-tête des fiches se décalent, CLS).
 */
export function hauteurLogo(ratio: number | null | undefined): number | undefined {
  return ratio && ratio > 0 ? Math.round(500 / ratio) : undefined;
}
