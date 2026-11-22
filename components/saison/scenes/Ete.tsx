import { Passage, vars } from "@/components/saison/Briques";

/**
 * Été : un petit avion tire sa banderole « Bonnes vacances », nuages lents et mouettes, soleil bas
 * avec son reflet d'objectif, et des palmes au premier plan qui se balancent dans le coin du hero.
 */
const OMBRE = "drop-shadow(0 0 4px rgba(0,0,0,.6))";

/** Une palme : une nervure courbe et des folioles de chaque côté, de plus en plus courtes vers la pointe */
function Palme({ angle, longueur, delai }: { angle: number; longueur: number; delai: number }) {
  const folioles = Array.from({ length: 17 }, (_, i) => {
    const t = (i + 1) / 18;
    // point de la nervure (courbe de Bézier quadratique de (0,0) à (L,0), contrôle (L/2, -L*0.34))
    const L = longueur;
    const x = 2 * (1 - t) * t * (L / 2) + t * t * L;
    const y = 2 * (1 - t) * t * (-L * 0.34);
    // tangente
    const dx = 2 * (1 - t) * (L / 2) + 2 * t * (L - L / 2);
    const dy = 2 * (1 - t) * (-L * 0.34) + 2 * t * (0 + L * 0.34);
    const a = Math.atan2(dy, dx);
    const taille = (1 - t * 0.7) * L * 0.2;
    return { x, y, a, taille };
  });
  return (
    <g transform={`rotate(${angle})`}>
      <g className="ete-palme" style={vars({ "--delai": `${delai}s` })}>
      <path d={`M0 0 Q${longueur / 2} ${-longueur * 0.34} ${longueur} 0`} fill="none" stroke="#080306" strokeWidth="4" strokeLinecap="round" />
      {folioles.map((f, i) => (
        <g key={i}>
          <path d={`M${f.x.toFixed(1)} ${f.y.toFixed(1)} l${(Math.cos(f.a - 1.0) * f.taille).toFixed(1)} ${(Math.sin(f.a - 1.0) * f.taille).toFixed(1)}`} stroke="#080306" strokeWidth="3.4" strokeLinecap="round" fill="none" />
          <path d={`M${f.x.toFixed(1)} ${f.y.toFixed(1)} l${(Math.cos(f.a + 1.0) * f.taille).toFixed(1)} ${(Math.sin(f.a + 1.0) * f.taille).toFixed(1)}`} stroke="#080306" strokeWidth="3.4" strokeLinecap="round" fill="none" />
        </g>
      ))}
      </g>
    </g>
  );
}

export default function Ete() {
  return (
    <>
      <div className="ete-soleil" />
      <div className="eff">
      <div className="ete-reflets">
        {[[22, 0.32, "rgba(255,190,120,.5)"], [38, 0.5, "rgba(255,140,90,.4)"], [54, 0.22, "rgba(255,230,160,.5)"], [70, 0.7, "rgba(255,120,120,.28)"], [84, 0.4, "rgba(255,210,140,.34)"]].map(([p, t, c], i) => (
          <i key={i} style={vars({ "--p": `${p}%`, "--s": `${(t as number) * 130}px`, "--c": c as string })} />
        ))}
      </div>
      </div>
      <Passage nom="cloud" largeur="clamp(120px, 14vw, 220px)" haut="8%" cycle={44} delai={-8} couleur="rgba(255,220,200,.4)" style={{ ["--bob" as string]: "6s" }} />
      <Passage nom="cloud" largeur="clamp(90px, 10vw, 160px)" haut="32%" cycle={52} delai={-30} couleur="rgba(255,200,190,.32)" style={{ ["--bob" as string]: "7s" }} />
      <Passage nom="avion" largeur="clamp(260px, 32vw, 470px)" haut="16%" cycle={22} delai={3} style={{ filter: "drop-shadow(0 6px 12px rgba(0,0,0,.45))" }} />
      <Passage nom="mouette" largeur="clamp(26px, 3vw, 42px)" haut="40%" cycle={19} delai={5} couleur="#fff" interne="flap" style={{ filter: OMBRE }} />
      <Passage nom="mouette" largeur="clamp(20px, 2.4vw, 34px)" haut="44%" cycle={19} delai={5.7} couleur="#fff" interne="flap" style={{ filter: OMBRE }} />
      {/* palmes au premier plan, accrochées au coin haut droit */}
      <svg className="ete-palmes" viewBox="-240 -20 260 300" aria-hidden="true" focusable="false">
        <g transform="translate(0 0)">
          <Palme angle={172} longueur={230} delai={0} />
          <Palme angle={150} longueur={210} delai={-1.1} />
          <Palme angle={128} longueur={190} delai={-2.2} />
          <Palme angle={108} longueur={150} delai={-0.6} />
        </g>
      </svg>
    </>
  );
}
