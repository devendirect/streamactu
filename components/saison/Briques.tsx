import type { CSSProperties, ReactNode } from "react";
import { FEUILLE_SPRITES, RATIOS } from "@/components/saison/sprites";
import { SPRITES_EXTRA } from "@/components/saison/spritesExtra";

/**
 * Briques communes des scènes de saison (components/saison/scenes/*) : sprites, éléments qui
 * traversent le hero, particules qui tombent ou montent. Styles : app/saison.css.
 * Tout est décoratif et déterministe (pas de Math.random : un tirage fixe par scène).
 */

/** Variables CSS en ligne (--x, --s…) */
export const vars = (o: Record<string, string | number>) => o as CSSProperties;

/** Petit générateur pseudo-aléatoire à graine (mulberry32) : mêmes particules à chaque rendu */
export function alea(graine: number): () => number {
  let a = graine >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Feuille de symboles SVG, à poser une fois dans le calque */
export function Sprites() {
  return <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true" focusable="false" dangerouslySetInnerHTML={{ __html: FEUILLE_SPRITES + SPRITES_EXTRA }} />;
}

export function Sprite({ nom, largeur, className = "", style }: { nom: string; largeur: string; className?: string; style?: CSSProperties }) {
  return (
    <svg className={`spr ${className}`} style={{ width: largeur, aspectRatio: String(RATIOS[nom]), ...style }} aria-hidden="true" focusable="false">
      <use href={`#s-${nom}`} />
    </svg>
  );
}

/**
 * Un élément qui traverse le hero de gauche à droite (ou l'inverse), puis longue pause hors écran.
 * `haut` : hauteur dans le hero (rester dans la moitié haute, le texte est plus bas à gauche).
 */
export function Passage({
  nom,
  largeur,
  haut,
  cycle = 24,
  delai = 3,
  rtl = false,
  couleur,
  classe = "",
  interne = "",
  style,
  avant,
}: {
  nom: string;
  largeur: string;
  haut: string;
  cycle?: number;
  delai?: number;
  rtl?: boolean;
  couleur?: string;
  classe?: string;
  interne?: string;
  style?: CSSProperties;
  avant?: ReactNode;
}) {
  return (
    <div className="eff">
      <div
        className={`trav ${rtl ? "rtl" : ""} ${classe}`}
        style={{ ["--haut" as string]: haut, ["--cycle" as string]: `${cycle}s`, ["--delai" as string]: `${delai}s`, color: couleur, ...style }}
      >
        <div className="bob" style={{ display: "flex", alignItems: "center" }}>
          {avant}
          <Sprite nom={nom} largeur={largeur} className={`${rtl ? "flip" : ""} ${interne}`} />
        </div>
      </div>
    </div>
  );
}

/** Comme Passage, mais avec un dessin libre (SVG animé) à la place d'un sprite */
export function PassageLibre({
  largeur,
  haut,
  cycle = 24,
  delai = 3,
  rtl = false,
  couleur,
  classe = "",
  style,
  children,
}: {
  largeur: string;
  haut: string;
  cycle?: number;
  delai?: number;
  rtl?: boolean;
  couleur?: string;
  classe?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  return (
    <div className="eff">
      <div
        className={`trav ${rtl ? "rtl" : ""} ${classe}`}
        style={{ ["--haut" as string]: haut, ["--cycle" as string]: `${cycle}s`, ["--delai" as string]: `${delai}s`, color: couleur, ...style }}
      >
        <div className="bob" style={{ width: largeur }}>
          <div className={rtl ? "flip" : ""}>{children}</div>
        </div>
      </div>
    </div>
  );
}

/** Particules : tombent (chute) ou montent (monte), avec dérive et rotation ; `lent` adoucit le rythme */
export function Particules({
  nom,
  n,
  couleurs,
  taille,
  duree,
  graine,
  mode = "chute",
  lent = false,
  flou = 0,
  trois = false,
  evenement = false,
  derive = [-120, 120],
  rot = [180, 540],
}: {
  nom: string;
  n: number;
  couleurs: string[];
  taille: [number, number];
  duree: [number, number];
  graine: number;
  mode?: "chute" | "monte";
  lent?: boolean;
  /** Part des particules (0 à 1) rendues floues et plus grandes : un premier plan hors de la mise au point */
  flou?: number;
  /** Tourne aussi sur les axes X et Y (pétales qui tournoient en trois dimensions) */
  trois?: boolean;
  /** Événement ponctuel (final du Nouvel An, victoire) : il ne s'éteint pas en mode calme */
  evenement?: boolean;
  derive?: [number, number];
  rot?: [number, number];
}) {
  const a = alea(graine);
  const u = (min: number, max: number) => min + a() * (max - min);
  const items = Array.from({ length: n }, (_, i) => {
    const t = u(duree[0], duree[1]);
    const proche = a() < flou;
    return (
      <i
        key={i}
        className={`part ${mode === "monte" ? "monte" : ""} ${lent ? "lent" : ""} ${trois ? "trois" : ""}`}
        style={{
          ...vars({
          "--x": `${u(0, 100).toFixed(1)}%`,
          "--s": `${(u(taille[0], taille[1]) * (proche ? 1.6 : 1)).toFixed(0)}px`,
          "--t": `${t.toFixed(1)}s`,
          "--d": `${(-u(0, t)).toFixed(1)}s`,
          "--dx": `${u(derive[0], derive[1]).toFixed(0)}px`,
          "--r": `${u(rot[0], rot[1]).toFixed(0)}deg`,
          "--rx": `${u(360, 1100).toFixed(0)}deg`,
          "--ry": `${u(360, 1100).toFixed(0)}deg`,
          "--c": couleurs[Math.floor(a() * couleurs.length)],
          }),
          ...(proche ? { filter: "blur(2.6px)", opacity: 0.8 } : {}),
        }}
      >
        <svg aria-hidden="true" focusable="false">
          <use href={`#s-${nom}`} />
        </svg>
      </i>
    );
  });
  return <div className={evenement ? "eff eff-evt" : "eff"}>{items}</div>;
}
