import type { CSSProperties } from "react";

/**
 * Traîneau du Père Noël, dessiné à la main en SVG (aucune image externe) : silhouette à contre-jour,
 * avec quelques notes de lumière (nez rouge, clochettes, lanterne). Trois rennes galopent (pattes à
 * deux articulations, corps qui rebondit), le Père Noël salue, son bonnet balance.
 * Rempli avec `currentColor` : la couleur de la silhouette se règle en CSS (.passage dans app/noel.css),
 * les animations aussi (classes t-*). Mouvement réduit : tout le calque est masqué.
 */

const v = (o: Record<string, string>) => o as CSSProperties;

/** Une patte à deux segments : le haut pivote à la hanche, le bas au genou */
function Patte({ hanche, genou, sabot, a, k, ph, epaisseur = 5.4, opacite = 1 }: { hanche: [number, number]; genou: [number, number]; sabot: [number, number]; a: [number, number]; k: [number, number]; ph: string; epaisseur?: number; opacite?: number }) {
  return (
    <g className="t-haut" opacity={opacite} style={v({ "--ox": `${hanche[0]}px`, "--oy": `${hanche[1]}px`, "--a1": `${a[0]}deg`, "--a2": `${a[1]}deg`, "--ph": ph })}>
      <path d={`M${hanche[0]} ${hanche[1]} L${genou[0]} ${genou[1]}`} fill="none" stroke="currentColor" strokeWidth={epaisseur} strokeLinecap="round" />
      <g className="t-bas" style={v({ "--ox": `${genou[0]}px`, "--oy": `${genou[1]}px`, "--a1": `${k[0]}deg`, "--a2": `${k[1]}deg`, "--ph": ph })}>
        <path d={`M${genou[0]} ${genou[1]} L${sabot[0]} ${sabot[1]}`} fill="none" stroke="currentColor" strokeWidth={epaisseur - 0.8} strokeLinecap="round" />
        <ellipse cx={sabot[0] + 0.6} cy={sabot[1] + 1} rx="3.2" ry="2" />
      </g>
    </g>
  );
}

/** Un renne vu de profil, tourné vers la droite. (x, y) : coin haut gauche ; `ph` : décalage du galop */
function Renne({ x, y, s = 1, ph, tete = false }: { x: number; y: number; s?: number; ph: string; tete?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} fill="currentColor" style={v({ "--ph": ph })}>
      <g className="t-corps">
        {/* pattes éloignées, un peu plus fines */}
        <Patte hanche={[30, 38]} genou={[26, 52]} sabot={[28, 66]} a={[28, -26]} k={[-34, 8]} ph="-0.28s" epaisseur={4.6} opacite={0.85} />
        <Patte hanche={[56, 38]} genou={[60, 52]} sabot={[58, 66]} a={[-26, 30]} k={[2, -36]} ph="-0.28s" epaisseur={4.4} opacite={0.85} />
        {/* queue, corps, cou, tête */}
        <path d="M10 28 C4 26 2 30 4 34 C6 36 9 34 10 33 Z" />
        <path d="M10 30 C18 20 40 17 58 19 C66 20 70 14 76 6 C78 3 84 2 88 5 C92 7 95 10 94 13 C92 15 88 14 85 13 C81 15 78 20 76 26 C75 33 71 40 62 43 C48 46 30 45 20 42 C12 40 8 35 10 30 Z" />
        <path d="M80 4 L76 -4 L84 2 Z" />
        {/* bois : celui du fond plus fin et plus pâle */}
        <path d="M80 3 C76 -4 79 -12 74 -18 M78 -6 C72 -8 70 -13 71 -17 M75 -14 C79 -16 80 -21 78 -25" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" opacity="0.7" />
        <path d="M84 3 C82 -6 87 -14 83 -22 M85 -6 C91 -8 93 -14 91 -19 M84 -14 C79 -16 77 -21 79 -26 M83 -22 C86 -24 88 -28 87 -31" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
        {/* pattes proches */}
        <Patte hanche={[22, 37]} genou={[16, 52]} sabot={[19, 66]} a={[-26, 30]} k={[-30, 10]} ph="0s" />
        <Patte hanche={[62, 36]} genou={[67, 52]} sabot={[65, 66]} a={[30, -26]} k={[4, -38]} ph="0s" />
        {/* harnais et clochettes dorées */}
        <path d="M66 22 C71 28 71 34 66 39" fill="none" stroke="#f4d58a" strokeWidth="1.2" opacity="0.9" />
        <circle cx="72" cy="27" r="1.9" fill="#f4d58a" className="t-cloche" />
        <circle cx="68" cy="36" r="1.5" fill="#f4d58a" className="t-cloche" style={v({ "--ph": "-0.4s" })} />
        {/* nez rouge du renne de tête */}
        {tete && (
          <>
            <circle cx="94.6" cy="10.6" r="7" fill="#ff4a3a" className="t-nez-lueur" />
            <circle cx="94.6" cy="10.6" r="2.4" fill="#ff5a4a" />
          </>
        )}
      </g>
    </g>
  );
}

export default function Traineau({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 480 150" className={className} aria-hidden="true" focusable="false">
      {/* traits d'attelage, du traîneau vers chaque renne */}
      <g fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.9">
        <path d="M146 90 C190 88 222 74 246 66" />
        <path d="M146 92 C232 94 306 80 344 70" />
        <path d="M146 94 C282 98 386 84 442 66" />
      </g>
      <Renne x={166} y={30} s={1.04} ph="-0.36s" />
      <Renne x={264} y={34} s={1.06} ph="-0.18s" />
      <Renne x={362} y={28} s={1.1} ph="0s" tete />

      <g fill="currentColor">
        {/* patins : une longue courbe qui se relève devant en volute */}
        <path d="M6 130 C24 138 122 138 142 124 C154 116 152 102 140 98" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
        <path d="M30 122 L28 131 M118 121 L120 130" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
        {/* caisse et dossier arrondi */}
        <path d="M14 78 C12 96 22 116 52 120 L122 120 C140 118 148 102 146 88 C140 94 128 98 112 98 L44 98 C36 98 30 88 30 78 Z" />
        <path d="M14 78 C12 62 20 52 34 50 C30 60 30 70 34 80 Z" />
        {/* sac de cadeaux et petit paquet qui dépasse */}
        <path d="M30 100 C8 98 4 70 20 62 C30 56 42 64 42 78 L42 98 Z" />
        <path d="M18 62 C20 56 26 54 30 58 C28 62 22 64 18 62 Z" />
        <g transform="rotate(-14 38 54)">
          <rect x="30" y="44" width="14" height="12" rx="1.5" fill="none" stroke="#f4d58a" strokeWidth="1.6" opacity="0.9" />
          <path d="M37 44 L37 56 M30 50 L44 50" stroke="#f4d58a" strokeWidth="1.3" opacity="0.9" />
        </g>
        {/* le Père Noël : buste, tête, barbe */}
        <path d="M54 98 C50 84 56 72 70 70 C84 70 92 80 90 98 Z" />
        <circle cx="72" cy="58" r="9" />
        <path d="M66 62 C66 74 82 74 82 62 C78 66 70 66 66 62 Z" />
        {/* bonnet qui balance, pompon au bout */}
        <g className="t-bonnet">
          <path d="M80 52 C82 40 70 30 54 36 C62 38 63 46 64 54 Z" />
          <circle cx="53" cy="36" r="4.2" />
        </g>
        {/* bras qui salue */}
        <g className="t-bras">
          <path d="M82 80 L98 56" fill="none" stroke="currentColor" strokeWidth="7" strokeLinecap="round" />
          <circle cx="99.5" cy="53.5" r="4.6" />
        </g>
        {/* bras qui tient les rênes */}
        <path d="M80 86 L104 92" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
      </g>

      {/* rênes dorées */}
      <path d="M104 92 C150 84 200 80 246 64" fill="none" stroke="#f4d58a" strokeWidth="1.2" opacity="0.85" />

      {/* lanterne à l'avant : une petite flamme chaude qui vacille */}
      <g>
        <circle cx="148" cy="88" r="13" fill="#ffd98a" opacity="0.28" className="t-lanterne" />
        <circle cx="148" cy="88" r="3.4" fill="#ffe7b0" className="t-lanterne" />
      </g>
    </svg>
  );
}
