import { useId, type CSSProperties } from "react";

/**
 * Créatures d'Halloween dessinées à la main en SVG : chauve-souris aux ailes articulées et
 * fantôme translucide. Les animations sont dans app/themes.css (classes chauve-*, fantome-*).
 */

const v = (o: Record<string, string>) => o as CSSProperties;

/** Aile gauche : bord d'attaque, membrane au bord festonné et nervures. Pivote à l'épaule (54, 28). */
const AILE = "M54 28 C44 14 22 10 3 22 C11 29 13 25 19 34 C23 28 29 35 34 39 C38 34 44 39 54 41 Z";
const NERVURES = "M54 28 L3 22 M54 28 L19 34 M54 28 L34 39";

export function Chauve({ vol = 0.24 }: { vol?: number }) {
  return (
    <svg viewBox="0 0 120 60" style={v({ ["--vol" as string]: `${vol}s`, width: "100%", display: "block", overflow: "visible" })} aria-hidden="true" focusable="false">
      <g className="chauve-aile">
        <path d={AILE} fill="currentColor" />
        <path d={NERVURES} fill="none" stroke="rgba(255,150,60,0.35)" strokeWidth="0.9" />
      </g>
      <g transform="translate(120 0) scale(-1 1)">
        <g className="chauve-aile">
          <path d={AILE} fill="currentColor" />
          <path d={NERVURES} fill="none" stroke="rgba(255,150,60,0.35)" strokeWidth="0.9" />
        </g>
      </g>
      {/* corps, tête, oreilles, pieds */}
      <ellipse cx="60" cy="36" rx="6.5" ry="11" fill="currentColor" />
      <circle cx="60" cy="24" r="5.8" fill="currentColor" />
      <path d="M55.5 21 L54 11 L59 19 Z M64.5 21 L66 11 L61 19 Z" fill="currentColor" />
      <path d="M57 46 L55 52 M63 46 L65 52" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="58" cy="24" r="1" fill="#ff5a3a" />
      <circle cx="62" cy="24" r="1" fill="#ff5a3a" />
    </svg>
  );
}

export function Fantome() {
  const id = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 100 130" style={{ width: "100%", display: "block", overflow: "visible" }} aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id={`f${id}`} cx="50%" cy="38%" r="70%">
          <stop offset="0" stopColor="#f4fff8" stopOpacity="0.95" />
          <stop offset="0.6" stopColor="#cfeedd" stopOpacity="0.7" />
          <stop offset="1" stopColor="#9fd9bd" stopOpacity="0.18" />
        </radialGradient>
      </defs>
      <g className="fantome-corps">
        {/* drap : dôme, flancs qui flottent, bas en lambeaux */}
        <path
          d="M50 6 C26 6 16 26 16 50 L14 96 C14 104 8 112 4 118 C12 116 18 112 22 106 C24 114 30 120 36 122 C38 116 42 112 46 112 C50 118 54 122 62 124 C64 116 70 112 76 108 C80 112 86 116 96 118 C90 110 86 104 86 96 L84 50 C84 26 74 6 50 6 Z"
          fill={`url(#f${id})`}
        />
        {/* bras */}
        <path d="M18 62 C8 66 4 76 8 84 C12 78 16 74 22 72 Z M82 62 C92 66 96 76 92 84 C88 78 84 74 78 72 Z" fill={`url(#f${id})`} />
        {/* visage */}
        <g className="fantome-oeil">
          <ellipse cx="38" cy="46" rx="5.2" ry="7.4" fill="#12201a" />
          <ellipse cx="62" cy="46" rx="5.2" ry="7.4" fill="#12201a" />
          <circle cx="39.6" cy="43.4" r="1.5" fill="#fff" />
          <circle cx="63.6" cy="43.4" r="1.5" fill="#fff" />
        </g>
        <ellipse cx="50" cy="66" rx="6" ry="8.4" fill="#12201a" />
      </g>
    </svg>
  );
}
